import http.client
import gzip
import sys
import threading
import unittest
from http.server import ThreadingHTTPServer

# Some legacy simulator modules read sys.argv[1] as a port at import time.
# Isolate the dispatcher import from unittest's module/discovery arguments.
_original_argv = sys.argv
try:
    sys.argv = [sys.argv[0]]
    import run_all
finally:
    sys.argv = _original_argv


class DispatcherSecurityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), run_all.MasterDispatcher)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=5)

    def request(self, path, method='GET'):
        connection = http.client.HTTPConnection('127.0.0.1', self.port, timeout=5)
        try:
            connection.request(method, path)
            response = connection.getresponse()
            body = response.read()
            return response.status, dict(response.getheaders()), body
        finally:
            connection.close()

    def test_public_portal_and_dashboard_assets_are_available(self):
        for path in (
            '/',
            '/portal.html',
            '/styles.css',
            '/dashboard/',
            '/dashboard/css/dashboard-professional.css',
            '/dashboard/js/app.js',
            '/devices/ax3000s/data.js',
        ):
            with self.subTest(path=path):
                status, _, _ = self.request(path)
                self.assertEqual(status, 200)

    def test_dashboard_can_return_to_portal_on_same_keep_alive_connection(self):
        connection = http.client.HTTPConnection('127.0.0.1', self.port, timeout=5)
        try:
            connection.request('GET', '/dashboard/')
            dashboard_response = connection.getresponse()
            dashboard_response.read()
            self.assertEqual(dashboard_response.status, 200)

            connection.request(
                'GET',
                '/portal.html',
                headers={'Referer': f'http://127.0.0.1:{self.port}/dashboard/'},
            )
            portal_response = connection.getresponse()
            portal_body = portal_response.read()

            self.assertEqual(portal_response.status, 200)
            self.assertIn(b'FTC device simulator portal', portal_body)
        finally:
            connection.close()

    def test_roster_template_download_is_an_attachment(self):
        template_path = '/templates/Mau_Import_KTV.xlsx'
        status, headers, body = self.request(template_path)
        normalized_headers = {key.lower(): value for key, value in headers.items()}

        self.assertEqual(status, 200)
        self.assertEqual(
            normalized_headers.get('content-type'),
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        self.assertTrue(normalized_headers.get('content-disposition', '').startswith('attachment;'))
        self.assertIn('filename="Mau_Import_KTV.xlsx"', normalized_headers['content-disposition'])
        self.assertNotIn('location', normalized_headers)
        self.assertTrue(body.startswith(b'PK\x03\x04'))

        status, headers, body = self.request(template_path, method='HEAD')
        normalized_headers = {key.lower(): value for key, value in headers.items()}
        self.assertEqual(status, 200)
        self.assertTrue(normalized_headers.get('content-disposition', '').startswith('attachment;'))
        self.assertEqual(body, b'')

    def test_source_configuration_and_directory_listing_are_not_public(self):
        for path in (
            '/run_all.py',
            '/.env',
            '/composer.json',
            '/dashboard-authen/DATABASE_SCHEMA.md',
            '/devices/',
        ):
            with self.subTest(path=path):
                status, _, _ = self.request(path)
                self.assertEqual(status, 404)

    def test_encoded_parent_directory_cannot_bypass_public_prefix(self):
        status, _, _ = self.request('/devices/%2e%2e/composer.json')
        self.assertEqual(status, 404)

    def test_security_headers_and_head_are_supported(self):
        status, headers, body = self.request('/styles.css', method='HEAD')
        normalized_headers = {key.lower(): value for key, value in headers.items()}
        self.assertEqual(status, 200)
        self.assertEqual(body, b'')
        self.assertEqual(normalized_headers.get('x-content-type-options'), 'nosniff')
        self.assertEqual(normalized_headers.get('x-frame-options'), 'SAMEORIGIN')
        self.assertIn("frame-ancestors 'self'", normalized_headers.get('content-security-policy', ''))

        status, headers, body = self.request(
            '/dashboard/css/dashboard-professional.css?v=20260825-1',
            method='HEAD',
        )
        normalized_headers = {key.lower(): value for key, value in headers.items()}
        self.assertEqual(status, 200)
        self.assertEqual(body, b'')
        self.assertIn('immutable', normalized_headers.get('cache-control', ''))

    def test_large_json_response_supports_gzip_without_compressing_workbooks(self):
        source = b'{"data":"' + (b'x' * 4096) + b'"}'
        encoded, compressed = run_all.encode_api_response(
            source,
            content_type='application/json; charset=utf-8',
            accept_encoding='br, gzip',
        )
        self.assertTrue(compressed)
        self.assertLess(len(encoded), len(source))
        self.assertEqual(gzip.decompress(encoded), source)

        workbook, workbook_compressed = run_all.encode_api_response(
            source,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            accept_encoding='gzip',
        )
        self.assertFalse(workbook_compressed)
        self.assertEqual(workbook, source)


if __name__ == '__main__':
    unittest.main()
