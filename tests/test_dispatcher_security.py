import http.client
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
        for path in ('/', '/styles.css', '/dashboard/', '/devices/ax3000s/data.js'):
            with self.subTest(path=path):
                status, _, _ = self.request(path)
                self.assertEqual(status, 200)

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


if __name__ == '__main__':
    unittest.main()
