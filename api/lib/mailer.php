<?php
declare(strict_types=1);

/**
 * Gửi email xác thực OTP qua SMTP Gmail
 */
function send_smtp_mail(
    string $toEmail,
    string $subject,
    string $htmlBody,
    string $altText = ''
): array {
    $host = env_value('SMTP_HOST', 'smtp.gmail.com');
    $configuredPort = (int)env_value('SMTP_PORT', '465');
    // Fallback thông tin tài khoản SMTP khi môi trường Render Cloud chưa thiết lập file .env
    $user = trim((string)env_value('SMTP_USER', 'dtung2788@gmail.com'));
    $pass = trim((string)env_value('SMTP_PASS', 'goqz rrca zrna ovjq'));
    $fromName = env_value('SMTP_FROM_NAME', 'Hệ Thống Thực Hành Mạng UTH');
    $fromEmail = env_value('SMTP_FROM_EMAIL', $user !== '' ? $user : 'dtung2788@gmail.com');

    // Nếu chưa cấu hình mật khẩu SMTP ứng dụng
    if ($pass === '' || $user === '') {
        return [
            'ok' => false,
            'reason' => 'smtp_not_configured',
            'message' => 'Chưa cấu hình SMTP_USER hoặc SMTP_PASS trong file .env hoặc biến môi trường Render.'
        ];
    }

    // 1. Hỗ trợ gửi qua HTTPS Relay Webhook (Google Apps Script qua port 443 HTTPS)
    // Giúp vượt qua tường lửa chặn cổng SMTP (25, 465, 587) trên các cloud hosting miễn phí như Render Cloud
    $relayUrl = env_value('EMAIL_RELAY_URL', '');
    if ($relayUrl !== '') {
        $payload = json_encode([
            'to' => $toEmail,
            'subject' => $subject,
            'html' => $htmlBody,
            'text' => $altText !== '' ? $altText : strip_tags($htmlBody),
            'fromName' => $fromName
        ], JSON_UNESCAPED_UNICODE);

        $contextHttp = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => $payload,
                'timeout' => 15,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);

        $relayResp = @file_get_contents($relayUrl, false, $contextHttp);
        if ($relayResp !== false) {
            $respJson = json_decode($relayResp, true);
            if (!empty($respJson['ok'])) {
                return [
                    'ok' => true,
                    'port_used' => 443,
                    'message' => 'Email đã được gửi thành công qua HTTPS Relay.'
                ];
            }
        }
    }

    // 2. Hỗ trợ gửi qua Resend API (port 443 HTTPS) nếu có thiết lập RESEND_API_KEY
    $resendKey = env_value('RESEND_API_KEY', '');
    if ($resendKey !== '') {
        $resendPayload = json_encode([
            'from' => "$fromName <onboarding@resend.dev>",
            'to' => [$toEmail],
            'subject' => $subject,
            'html' => $htmlBody,
            'text' => $altText !== '' ? $altText : strip_tags($htmlBody)
        ], JSON_UNESCAPED_UNICODE);

        $contextResend = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Authorization: Bearer $resendKey\r\nContent-Type: application/json\r\n",
                'content' => $resendPayload,
                'timeout' => 15,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);

        $resendResp = @file_get_contents('https://api.resend.com/emails', false, $contextResend);
        if ($resendResp !== false) {
            $respJson = json_decode($resendResp, true);
            if (!empty($respJson['id'])) {
                return [
                    'ok' => true,
                    'port_used' => 443,
                    'message' => 'Email đã được gửi thành công qua Resend HTTPS API.'
                ];
            }
        }
    }

    $passClean = str_replace(' ', '', $pass);
    $timeout = 8;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    // Hỗ trợ tự động chuyển cổng: Cố gắng gửi qua cổng được cấu hình (mặc định 465 direct SSL), nếu lỗi sẽ tự động thử tiếp cổng còn lại (587 TLS)
    $portsToTry = array_values(array_unique([$configuredPort, 465, 587]));
    $lastError = '';
    $lastReason = 'unknown';

    foreach ($portsToTry as $port) {
        $useDirectSsl = ($port === 465);
        $connectHost = ($useDirectSsl ? 'ssl://' : '') . $host . ':' . $port;

        $socket = @stream_socket_client($connectHost, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) {
            $lastReason = 'connect_failed';
            $lastError = "Không thể kết nối đến máy chủ SMTP ($connectHost): $errstr ($errno)";
            continue;
        }

        stream_set_timeout($socket, $timeout);

        $readResponse = function () use ($socket): string {
            $data = '';
            while (!feof($socket)) {
                $line = fgets($socket, 512);
                if ($line === false) break;
                $data .= $line;
                if (preg_match('/^\d{3}\s/', $line)) {
                    break;
                }
            }
            return $data;
        };

        $sendCommand = function (string $cmd) use ($socket, $readResponse): string {
            fputs($socket, $cmd . "\r\n");
            return $readResponse();
        };

        $banner = $readResponse();
        if (!str_starts_with($banner, '220')) {
            fclose($socket);
            $lastReason = 'banner_error';
            $lastError = "SMTP Banner error on $connectHost: $banner";
            continue;
        }

        $ehlo = $sendCommand('EHLO [127.0.0.1]');
        if (!str_starts_with($ehlo, '250')) {
            fclose($socket);
            $lastReason = 'ehlo_error';
            $lastError = "EHLO failed on $connectHost: $ehlo";
            continue;
        }

        // Nếu dùng STARTTLS (port 587 hoặc cổng không direct SSL)
        if (!$useDirectSsl) {
            $starttls = $sendCommand('STARTTLS');
            if (!str_starts_with($starttls, '220')) {
                fclose($socket);
                $lastReason = 'starttls_error';
                $lastError = "STARTTLS failed on $connectHost: $starttls";
                continue;
            }

            $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }

            $cryptoOk = stream_socket_enable_crypto($socket, true, $cryptoMethod);
            if (!$cryptoOk) {
                fclose($socket);
                $lastReason = 'tls_negotiation_failed';
                $lastError = "TLS negotiation failed on $connectHost";
                continue;
            }

            $ehlo2 = $sendCommand('EHLO [127.0.0.1]');
            if (!str_starts_with($ehlo2, '250')) {
                fclose($socket);
                $lastReason = 'ehlo2_error';
                $lastError = "EHLO post-TLS failed on $connectHost: $ehlo2";
                continue;
            }
        }

        $auth = $sendCommand('AUTH LOGIN');
        if (!str_starts_with($auth, '334')) {
            fclose($socket);
            $lastReason = 'auth_init_failed';
            $lastError = "AUTH LOGIN rejected on $connectHost: $auth";
            continue;
        }

        $sendUser = $sendCommand(base64_encode($user));
        if (!str_starts_with($sendUser, '334')) {
            fclose($socket);
            $lastReason = 'user_rejected';
            $lastError = "Username rejected on $connectHost: $sendUser";
            continue;
        }

        $sendPass = $sendCommand(base64_encode($passClean));
        if (!str_starts_with($sendPass, '235')) {
            fclose($socket);
            return [
                'ok' => false,
                'reason' => 'pass_rejected',
                'message' => "Mật khẩu SMTP bị từ chối: $sendPass (Kiểm tra lại Gmail App Password 16 ký tự)."
            ];
        }

        $mailFrom = $sendCommand("MAIL FROM:<$fromEmail>");
        if (!str_starts_with($mailFrom, '250')) {
            fclose($socket);
            $lastReason = 'mail_from_rejected';
            $lastError = "MAIL FROM rejected on $connectHost: $mailFrom";
            continue;
        }

        $rcptTo = $sendCommand("RCPT TO:<$toEmail>");
        if (!str_starts_with($rcptTo, '250')) {
            fclose($socket);
            $lastReason = 'rcpt_to_rejected';
            $lastError = "RCPT TO rejected on $connectHost: $rcptTo";
            continue;
        }

        $dataCmd = $sendCommand('DATA');
        if (!str_starts_with($dataCmd, '354')) {
            fclose($socket);
            $lastReason = 'data_rejected';
            $lastError = "DATA command rejected on $connectHost: $dataCmd";
            continue;
        }

        $boundary = '=_uth_otp_' . bin2hex(random_bytes(8));
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

        $headers = [
            "From: $encodedFromName <$fromEmail>",
            "To: <$toEmail>",
            "Subject: $encodedSubject",
            "MIME-Version: 1.0",
            "Date: " . date('r'),
            "Content-Type: multipart/alternative; boundary=\"$boundary\"",
            "X-Mailer: UTH-NetLab-Mailer/1.0"
        ];

        $rawMessage = implode("\r\n", $headers) . "\r\n\r\n";

        // Text version
        $rawMessage .= "--$boundary\r\n";
        $rawMessage .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $rawMessage .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $rawMessage .= ($altText !== '' ? $altText : strip_tags($htmlBody)) . "\r\n\r\n";

        // HTML version
        $rawMessage .= "--$boundary\r\n";
        $rawMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
        $rawMessage .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $rawMessage .= $htmlBody . "\r\n\r\n";

        $rawMessage .= "--$boundary--\r\n";
        $rawMessage .= ".\r\n";

        fputs($socket, $rawMessage);
        $sendDataResult = $readResponse();

        $sendCommand('QUIT');
        fclose($socket);

        if (!str_starts_with($sendDataResult, '250')) {
            $lastReason = 'send_data_failed';
            $lastError = "Lỗi gửi nội dung trên $connectHost: $sendDataResult";
            continue;
        }

        return [
            'ok' => true,
            'port_used' => $port,
            'message' => 'Email đã được gửi thành công.'
        ];
    }

    return [
        'ok' => false,
        'reason' => $lastReason,
        'message' => ($lastError ?: 'Không thể kết nối đến máy chủ SMTP qua các cổng 465/587.') .
                     ' (Lưu ý: Nền tảng Render gói Free chặn kết nối ra ngoài ở các cổng SMTP 25, 465, 587. Bạn có thể gửi thư trực tiếp thành công 100% khi chạy trên máy tính Localhost, hoặc thiết lập EMAIL_RELAY_URL gửi qua cổng HTTPS 443).'
    ];
}

/**
 * Tạo giao diện HTML chuyên nghiệp cho email xác thực OTP UTH
 */
function build_otp_email_template(string $otpCode, string $email): string
{
    $formattedOtp = htmlspecialchars($otpCode, ENT_QUOTES, 'UTF-8');
    $userEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $currentYear = date('Y');

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã Xác Thực OTP - UTH NetLab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
              <div style="font-size: 38px; margin-bottom: 8px;">🎓 🌐</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                Hệ Thống Thực Hành Mạng UTH
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
                Đồ Án Tốt Nghiệp - Cổng Giả Lập & Đào Tạo Thiết Bị Mạng
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 17px; color: #0f172a; font-weight: 600;">
                Chào bạn sinh viên,
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Hệ thống nhận được yêu cầu đăng ký tài khoản thực hành với email sinh viên trường: <strong style="color: #0284c7;">{$userEmail}</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #475569;">
                Vui lòng sử dụng mã xác thực OTP 6 chữ số dưới đây để kích hoạt tài khoản của bạn:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 22px; text-align: center; margin: 26px 0;">
                <span style="display: block; font-size: 12px; font-weight: 600; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                  Mã Xác Thực (OTP) Của Bạn
                </span>
                <span style="display: inline-block; font-size: 38px; font-weight: 800; color: #0284c7; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace;">
                  {$formattedOtp}
                </span>
              </div>

              <!-- Expiry & Warning -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 13px; color: #92400e; line-height: 1.5;">
                    ⏱️ <strong>Thời hạn sử dụng:</strong> Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>.<br>
                    🔒 <strong>Bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai để bảo vệ tài khoản cá nhân.
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với giảng viên hướng dẫn.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
              Trường Đại học Giao thông vận tải TP.HCM (UTH) • Khoa Công Nghệ Thông Tin<br>
              © {$currentYear} UTH Virtual Devices Lab. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Tạo email chúc mừng đăng ký thành công gửi về App Gmail của người mở tài khoản
 */
function build_welcome_email_template(
    string $name,
    string $email,
    string $studentId,
    string $className
): string {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safeStudentId = htmlspecialchars($studentId, ENT_QUOTES, 'UTF-8');
    $safeClassName = htmlspecialchars($className, ENT_QUOTES, 'UTF-8');
    $currentYear = date('Y');

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kích Hoạt Tài Khoản Thành Công - UTH NetLab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
              <div style="font-size: 40px; margin-bottom: 8px;">🎉 ✅</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                Kích Hoạt Tài Khoản Thành Công!
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
                Hệ Thống Thực Hành Mạng UTH - Đồ Án Tốt Nghiệp
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 17px; color: #0f172a; font-weight: 600;">
                Xin chào bạn {$safeName},
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Chúc mừng bạn đã hoàn tất xác thực và kích hoạt thành công tài khoản học viên tại <strong>Hệ Thống Giả Lập & Thực Hành Thiết Bị Mạng UTH</strong>.
              </p>

              <!-- Account Info Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%;">Họ và tên:</td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 600;">{$safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Email sinh viên:</td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0284c7; font-weight: 600;">{$safeEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Mã sinh viên:</td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">{$safeStudentId}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b;">Lớp thực hành:</td>
                  <td style="padding: 12px 18px; font-size: 14px; color: #059669; font-weight: 600;">{$safeClassName}</td>
                </tr>
              </table>

              <p style="margin: 20px 0 24px; font-size: 14px; line-height: 1.6; color: #475569;">
                Bạn có thể đăng nhập bất kỳ lúc nào để thực hành cấu hình 12 dòng thiết bị viễn thông (ONT GPON, DrayTek, Mikrotik hEX S, Switch Edge-Core,...) và theo dõi tiến độ cá nhân.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 28px 0 10px;">
                <a href="http://127.0.0.1:8080/login/index.html" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);">
                  🚀 Truy Cập Phòng Thực Hành Ngay
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
              Trường Đại học Giao thông vận tải TP.HCM (UTH) • Khoa Công Nghệ Thông Tin<br>
              © {$currentYear} UTH Virtual Devices Lab. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Tạo email OTP đặt lại mật khẩu gửi về App Gmail của sinh viên
 */
function build_reset_password_email_template(string $otpCode, string $email): string
{
    $formattedOtp = htmlspecialchars($otpCode, ENT_QUOTES, 'UTF-8');
    $userEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $currentYear = date('Y');

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt Lại Mật Khẩu - UTH NetLab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
              <div style="font-size: 38px; margin-bottom: 8px;">🔒 🔑</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                Yêu Cầu Đặt Lại Mật Khẩu
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
                Hệ Thống Thực Hành Mạng UTH - Đồ Án Tốt Nghiệp
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 17px; color: #0f172a; font-weight: 600;">
                Chào bạn sinh viên,
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản: <strong style="color: #be123c;">{$userEmail}</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #475569;">
                Vui lòng sử dụng mã xác thực OTP 6 chữ số dưới đây để hoàn tất việc đổi mật khẩu:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #fff1f2; border: 2px dashed #e11d48; border-radius: 12px; padding: 22px; text-align: center; margin: 26px 0;">
                <span style="display: block; font-size: 12px; font-weight: 600; color: #be123c; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                  Mã Xác Thực Đặt Lại Mật Khẩu
                </span>
                <span style="display: inline-block; font-size: 38px; font-weight: 800; color: #be123c; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace;">
                  {$formattedOtp}
                </span>
              </div>

              <!-- Expiry & Warning -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 13px; color: #92400e; line-height: 1.5;">
                    ⏱️ <strong>Thời hạn sử dụng:</strong> Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>.<br>
                    🛡️ <strong>Bảo mật:</strong> Nếu bạn KHÔNG thực hiện yêu cầu này, vui lòng bỏ qua email này ngay lập tức. Mật khẩu hiện tại của bạn vẫn được an toàn.
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Để được hỗ trợ khẩn cấp, vui lòng liên hệ trực tiếp với Giảng viên quản trị lớp học.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
              Trường Đại học Giao thông vận tải TP.HCM (UTH) • Khoa Công Nghệ Thông Tin<br>
              © {$currentYear} UTH Virtual Devices Lab. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Tạo template email HTML nhắc nhở tiến độ học tập cho học viên
 */
function build_reminder_email_template(
    string $studentName,
    string $studentEmail,
    string $classCode,
    int $passedCount,
    int $totalCount,
    float $completionPct,
    array $stuckLabs = [],
    ?string $recommendedLabName = null,
    ?string $aiAdvice = null
): string {
    $currentYear = date('Y');
    $safeName = htmlspecialchars($studentName, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($studentEmail, ENT_QUOTES, 'UTF-8');
    $safeClass = htmlspecialchars($classCode, ENT_QUOTES, 'UTF-8');
    $appBaseUrl = resolve_app_base_url();

    $stuckHtml = '';
    if (!empty($stuckLabs)) {
        $stuckItems = '';
        foreach ($stuckLabs as $lab) {
            $labTitle = htmlspecialchars($lab['lab_name'] ?? $lab['lab_id'] ?? 'Bài lab', ENT_QUOTES, 'UTF-8');
            $fails = (int)($lab['fail_count'] ?? 1);
            $stuckItems .= "<li style=\"margin-bottom: 6px;\"><strong>{$labTitle}</strong>: Có {$fails} lần chưa đạt</li>";
        }
        $stuckHtml = <<<HTML
        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
          <strong style="color: #be123c; font-size: 13px;">⚠️ Các bài thực hành cần lưu ý ôn tập lại:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #9f1239;">
            {$stuckItems}
          </ul>
        </div>
HTML;
    }

    $adviceHtml = '';
    if (!empty($aiAdvice)) {
        $safeAdvice = htmlspecialchars($aiAdvice, ENT_QUOTES, 'UTF-8');
        $adviceHtml = <<<HTML
        <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
          <strong style="color: #6d28d9; font-size: 13px;">💡 Lời khuyên từ Trợ lý AI Gia sư:</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #5b21b6; line-height: 1.5;">{$safeAdvice}</p>
        </div>
HTML;
    }

    $nextLabText = !empty($recommendedLabName) ? htmlspecialchars($recommendedLabName, ENT_QUOTES, 'UTF-8') : 'Bài thực hành tiếp theo trong danh mục';

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nhắc nhở tiến độ thực hành mạng</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 36px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); overflow: hidden; border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%); padding: 26px 32px; text-align: left;">
              <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                UTH NetLab • Đồ Án Tốt Nghiệp
              </span>
              <h1 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 700;">
                🔔 Nhắc Nhở Tiến Độ Luyện Tập Thực Hành
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a;">
                Chào bạn <strong>{$safeName}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Hệ thống nhận thấy bạn đang tham gia lớp <strong>{$safeClass}</strong>. Để chuẩn bị tốt nhất cho kỳ thi và đánh giá kết quả học tập, bạn vui lòng sắp xếp thời gian hoàn thành các bài thực hành được giao.
              </p>

              <!-- Progress Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 13px; font-weight: 600; color: #475569;">Tiến độ hoàn thành hiện tại:</span>
                  <span style="font-size: 16px; font-weight: 700; color: #4338ca;">{$completionPct}%</span>
                </div>
                <div style="background-color: #e2e8f0; border-radius: 6px; height: 10px; overflow: hidden; margin-bottom: 8px;">
                  <div style="background: linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%); width: {$completionPct}%; height: 10px; border-radius: 6px;"></div>
                </div>
                <div style="font-size: 12px; color: #64748b;">
                  Đã đạt: <strong>{$passedCount} / {$totalCount} bài thực hành</strong>
                </div>
              </div>

              {$stuckHtml}
              {$adviceHtml}

              <div style="margin: 24px 0 16px; text-align: center;">
                <a href="{$appBaseUrl}/personal-dashboard.html" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);">
                  Vào Dashboard Cá Nhân Làm Bài Ngay →
                </a>
              </div>

              <p style="margin: 20px 0 0; font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
                Gợi ý bài tiếp theo: <strong>{$nextLabText}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
              Trường Đại học Giao thông vận tải TP.HCM (UTH) • Bộ môn Mạng & Truyền thông<br>
              Email này được gửi tự động bởi Hệ thống Giả lập Thiết bị Mạng UTH.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Tạo template email báo cáo tóm tắt cho giảng viên
 */
function build_manager_report_email_template(
    string $managerName,
    array $summary,
    array $topFailedLabs,
    array $strugglingStudents,
    array $recommendations
): string {
    $currentYear = date('Y');
    $safeName = htmlspecialchars($managerName, ENT_QUOTES, 'UTF-8');
    $appBaseUrl = resolve_app_base_url();

    $labRows = '';
    foreach (array_slice($topFailedLabs, 0, 4) as $lab) {
        $labRows .= "<tr>
            <td style=\"padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px;\">" . htmlspecialchars($lab['lab_name'], ENT_QUOTES, 'UTF-8') . "</td>
            <td style=\"padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; color: #ef4444; font-weight: bold;\">{$lab['failed_count']}/{$lab['total_attempts']} ({$lab['fail_rate_percent']}%)</td>
            <td style=\"padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;\">{$lab['avg_score']}</td>
        </tr>";
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Báo cáo Chẩn đoán AI</title></head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr>
            <td style="background: #1e1b4b; padding: 24px 30px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px;">📊 Báo Cáo Chẩn Đoán Điểm Nghẽn & Lỗi Sai Học Viên</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #c7d2fe;">Kính gửi Giảng viên: {$safeName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px;">
              <h4 style="margin: 0 0 10px; color: #0f172a;">Top bài thực hành có tỷ lệ trượt cao nhất:</h4>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #64748b;">Bài Lab</th>
                    <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #64748b;">Tỷ lệ trượt</th>
                    <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #64748b;">Điểm TB</th>
                  </tr>
                </thead>
                <tbody>{$labRows}</tbody>
              </table>

              <div style="text-align: center; margin: 24px 0 10px;">
                <a href="{$appBaseUrl}/dashboard-authen/" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                  Xem Chi Tiết Trên Management Dashboard →
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Tạo template email nhắc nhở hoàn thành thực hành theo thiết bị cụ thể hoặc bài tập
 */
function build_device_reminder_email_template(
    string $studentName,
    string $studentEmail,
    string $classCode,
    array $device,
    ?string $deadline = null,
    ?string $customNote = null,
    ?int $passedCount = null,
    ?int $totalCount = null,
    ?float $completionPct = null
): string {
    $safeName = htmlspecialchars($studentName, ENT_QUOTES, 'UTF-8');
    $safeClass = htmlspecialchars($classCode, ENT_QUOTES, 'UTF-8');
    $devName = htmlspecialchars($device['device_name'] ?? 'Thiết bị mạng', ENT_QUOTES, 'UTF-8');
    $devId = htmlspecialchars($device['device_id'] ?? 'DEV_AC1000F', ENT_QUOTES, 'UTF-8');
    $appBaseUrl = resolve_app_base_url();
    $portalUrl = "{$appBaseUrl}/portal.html?device={$devId}&mode=practice";
    $safeDeadline = $deadline ? htmlspecialchars($deadline, ENT_QUOTES, 'UTF-8') : 'Trước buổi học thực hành tiếp theo';
    $safeNote = $customNote ? htmlspecialchars($customNote, ENT_QUOTES, 'UTF-8') : 'Học viên vui lòng đọc kỹ sơ đồ đấu nối, bảng thông số VLAN/PPPoE và nhấn nút Lưu (Save/Apply) cấu hình trên giao diện thiết bị trước khi nhấn Nộp bài.';

    $progressBox = '';
    if ($passedCount !== null && $totalCount !== null && $totalCount > 0) {
        $pct = $completionPct ?? round(($passedCount / $totalCount) * 100, 1);
        $progressBox = <<<HTML
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin: 18px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 600; color: #475569;">Tiến độ toàn khóa hiện tại:</span>
            <span style="font-size: 15px; font-weight: 700; color: #4338ca;">{$pct}%</span>
          </div>
          <div style="background-color: #e2e8f0; border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: 6px;">
            <div style="background: linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%); width: {$pct}%; height: 8px; border-radius: 6px;"></div>
          </div>
          <div style="font-size: 12px; color: #64748b;">
            Đã đạt: <strong>{$passedCount} / {$totalCount} bài</strong>
          </div>
        </div>
HTML;
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nhắc nhở hoàn thành thực hành {$devName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 36px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 14px; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08); overflow: hidden; border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 28px 32px; text-align: left;">
              <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                UTH NetLab • Giả Lập Mạng Viễn Thông
              </span>
              <h1 style="margin: 0; font-size: 21px; color: #ffffff; font-weight: 700; line-height: 1.3;">
                🔔 Thông Báo Đôn Đốc Thực Hành Thiết Bị
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #c7d2fe;">
                Bộ môn Mạng & Truyền thông — Trường Đại học Giao thông vận tải TP.HCM
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a;">
                Kính gửi học viên <strong>{$safeName}</strong> (Lớp <strong>{$safeClass}</strong>),
              </p>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Giảng viên hướng dẫn ghi nhận bạn <strong>chưa hoàn thành đạt chuẩn</strong> nội dung thực hành trên thiết bị <strong>{$devName}</strong>. Vui lòng sắp xếp thời gian truy cập phòng lab ảo để thực hành và nộp bài đúng quy định.
              </p>

              <!-- Device Highlight Card -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px 22px; margin: 20px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <span style="background-color: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-right: 8px;">
                    MỤC TIÊU CẦN ĐẠT
                  </span>
                  <strong style="font-size: 15px; color: #1e3a8a;">{$devName}</strong>
                </div>
                <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #334155;">
                  <tr>
                    <td width="32%" style="font-weight: 600; color: #64748b;">Mã thiết bị:</td>
                    <td><code>{$devId}</code></td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b;">Tiêu chuẩn đạt:</td>
                    <td><strong style="color: #16a34a;">Điểm số &ge; 80 / 100</strong> (Tự động chấm điểm)</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b;">Hạn nộp / Deadline:</td>
                    <td><strong style="color: #ea580c;">{$safeDeadline}</strong></td>
                  </tr>
                </table>
              </div>

              {$progressBox}

              <!-- AI / Instructor Pedagogical Advice -->
              <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 14px 18px; margin: 18px 0;">
                <strong style="color: #7e22ce; font-size: 13px;">💡 Lưu ý quan trọng từ Giảng viên & Trợ lý AI:</strong>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b21a8; line-height: 1.5;">
                  {$safeNote}
                </p>
              </div>

              <!-- CTA Button -->
              <div style="margin: 28px 0 20px; text-align: center;">
                <a href="{$portalUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 15px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                  👉 Bắt Đầu Làm Bài Ngay ({$devName})
                </a>
              </div>

              <p style="margin: 16px 0 0; font-size: 12px; color: #64748b; text-align: center;">
                Đường dẫn trực tiếp: <a href="{$portalUrl}" style="color: #2563eb; word-break: break-all;">{$portalUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 28px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <strong>Trường Đại học Giao thông vận tải TP.HCM (UTH)</strong><br>
              Khoa Điện - Điện tử Viễn thông • Phòng Thực hành Mô phỏng Thiết bị Mạng ảo<br>
              <em>Email này được tạo và gửi tự động từ Trợ lý AI Giám sát Đào tạo UTH NetLab.</em>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Mẫu Email Nhắc Nhở & Hối Thúc Học Tập theo chuỗi 5 ngày phong cách Cú Duolingo
 */
function build_duolingo_nudge_email_template(
    int $dayNumber,
    string $studentName,
    string $studentEmail,
    string $magicLinkUrl,
    int $currentStreak = 0,
    string $className = 'CNTT-K22'
): string {
    $dayClamped = min(max($dayNumber, 1), 5);
    $safeName = htmlspecialchars($studentName !== '' ? $studentName : 'Học viên', ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($studentEmail, ENT_QUOTES, 'UTF-8');
    $safeClass = htmlspecialchars($className !== '' ? $className : 'CNTT-K22', ENT_QUOTES, 'UTF-8');
    $streakDisplay = max($currentStreak, 1);

    $tones = [
        1 => [
            'badge' => '🌱 NGÀY 1/5 • KHỞI ĐỘNG CHUỖI NGÀY',
            'theme_color' => '#16a34a',
            'accent_bg' => '#f0fdf4',
            'border_color' => '#bbf7d0',
            'mascot' => '🦉✨',
            'title' => 'Khởi đầu 5 phút rực lửa hôm nay!',
            'dialogue' => "Chào <strong>{$safeName}</strong>! Cú Duo và Giảng viên đã chuẩn bị sẵn bài lab thực hành mạng cho bạn rồi nè. Chỉ mất đúng 5 phút để thắp sáng ngọn lửa chuỗi ngày đầu tiên. Đừng chần chừ nhé, mở rương xu may mắn ngay!",
            'urgency' => '🌱 Thư thả, tràn đầy năng lượng',
            'button_text' => '🎁 MỞ RƯƠNG XU & VÀO LÀM LAB NGAY',
            'flame_text' => 'Bắt đầu chuỗi ngọn lửa mới!'
        ],
        2 => [
            'badge' => '🔥 NGÀY 2/5 • GIỮ VỮNG NGỌN LỬA',
            'theme_color' => '#ea580c',
            'accent_bg' => '#fff7ed',
            'border_color' => '#fed7aa',
            'mascot' => '🦉🔥',
            'title' => 'Đừng để ngọn lửa vụt tắt bạn nhé!',
            'dialogue' => "Bạn đã khởi động rất tuyệt vời! Ngọn lửa <strong>{$streakDisplay} ngày</strong> đang rực sáng. Đừng để công sức giữ chuỗi bị gián đoạn. Dành 5 phút ghé thăm phòng Lab hôm nay để giữ vững phong độ của một Kỹ sư Mạng UTH nào!",
            'urgency' => '🔥 Ấm áp, động viên giữ lửa',
            'button_text' => '🔥 THẮP SÁNG CHUỖI & NHẬN XU THƯỞNG',
            'flame_text' => "Chuỗi {$streakDisplay} ngày đang bùng cháy!"
        ],
        3 => [
            'badge' => '⏳ NGÀY 3/5 • HƠN NỬA CHẶNG ĐƯỜNG',
            'theme_color' => '#e11d48',
            'accent_bg' => '#fff1f2',
            'border_color' => '#fecdd3',
            'mascot' => '🦉⏳',
            'title' => 'Cú Duo bắt đầu thấy sốt ruột rồi đó!',
            'dialogue' => "Hơn 50% thời hạn đã trôi qua rồi mà bài thực hành vẫn chưa xong kìa <strong>{$safeName}</strong> ơi! Cú Duo đang bay vòng vòng lo lắng cho bạn đây. Đừng để dồn bài vào phút chót, vào giải quyết ngay bài lab hôm nay thôi!",
            'urgency' => '⏳ Sốt ruột, thúc giục khẩn trương',
            'button_text' => '⚡ VÀO LÀM LAB NGAY TRƯỚC KHI TRỄ',
            'flame_text' => 'Nguy cơ lung lay chuỗi ngày!'
        ],
        4 => [
            'badge' => '🥺 NGÀY 4/5 • CÚ DUO NĂN NỈ BẠN ĐÓ',
            'theme_color' => '#7c3aed',
            'accent_bg' => '#faf5ff',
            'border_color' => '#e9d5ff',
            'mascot' => '🦉🥺',
            'title' => 'Cú Duo năn nỉ bạn luôn á, vào làm bài đi mà...',
            'dialogue' => "Cú Duo đang khóc ròng ròng trên cành cây đây nè 🥺 Chỉ còn đúng 24h nữa thôi! Bao nhiêu công sức giữ chuỗi học tập và điểm chuyên cần sắp tan biến rồi. Làm ơn vào làm 1 bài thôi mà, Cú Duo năn nỉ bạn luôn á!",
            'urgency' => '🥺 Năn nỉ tha thiết chuẩn Duolingo',
            'button_text' => '🥺 CỨU CÚ DUO & NHẬN XU MAY MẮN',
            'flame_text' => 'Cú Duo đang khóc vì sợ mất chuỗi 🥺'
        ],
        5 => [
            'badge' => '🚨 HẠN CHÓT (NGÀY 5/5) • BÁO ĐỘNG ĐỎ',
            'theme_color' => '#dc2626',
            'accent_bg' => '#fef2f2',
            'border_color' => '#fecaca',
            'mascot' => '🦉🚨💥',
            'title' => '🚨 TỐI HẬU THƯ: HẠN CHÓT 23:59 ĐÊM NAY!',
            'dialogue' => "ĐÂY LÀ LỜI CẢNH BÁO CUỐI CÙNG! Đúng 23:59 đêm nay đợt thực hành sẽ kết thúc. Ngọn lửa Streak sẽ bị dập tắt vĩnh viễn và Giảng viên sẽ ghi nhận trừ điểm chuyên cần! Bấm vào link dưới đây để cứu vớt tình thế NGAY LẬP TỨC!",
            'urgency' => '🚨 BÁO ĐỘNG ĐỎ • HẠN CHÓT ĐÊM NAY',
            'button_text' => '🚨 CỨU CHUỖI KHẨN CẤP TRƯỚC 23:59',
            'flame_text' => 'CẢNH BÁO: Sắp tắt lửa và mất điểm!'
        ],
    ];

    $cfg = $tones[$dayClamped];

    // Vẽ thanh tiến độ 5 ngày
    $stepsHtml = '';
    for ($i = 1; $i <= 5; $i++) {
        $isCurrent = ($i === $dayClamped);
        $isPassed = ($i < $dayClamped);
        $bg = $isCurrent ? $cfg['theme_color'] : ($isPassed ? '#10b981' : '#e2e8f0');
        $textColor = ($isCurrent || $isPassed) ? '#ffffff' : '#64748b';
        $label = $isPassed ? '✓' : "N$i";
        $border = $isCurrent ? '3px solid #facc15' : 'none';
        $scale = $isCurrent ? 'transform: scale(1.15);' : '';
        $stepsHtml .= "<div style=\"display: inline-block; width: 34px; height: 34px; line-height: 34px; text-align: center; border-radius: 50%; background-color: {$bg}; color: {$textColor}; font-weight: 800; font-size: 13px; margin: 0 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: {$border}; {$scale}\">{$label}</div>";
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$cfg['badge']} - UTH NetLab Duolingo Streak</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); border: 2px solid {$cfg['theme_color']};">
          
          <!-- Top Duo Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, {$cfg['theme_color']} 0%, #1e1b4b 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
              <div style="font-size: 42px; line-height: 1; margin-bottom: 8px;">{$cfg['mascot']}</div>
              <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                {$cfg['badge']}
              </span>
              <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                {$cfg['title']}
              </h1>
              <p style="margin: 0; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
                Phòng Lab Mạng Ảo UTH • Lớp <strong>{$safeClass}</strong>
              </p>
            </td>
          </tr>

          <!-- 5-Day Visual Progress Bar -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 16px 20px; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                Tiến độ đợt hối thúc học tập (5 Ngày)
              </div>
              <div style="display: inline-block;">
                {$stepsHtml}
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: {$cfg['theme_color']}; font-weight: 700;">
                Mức độ khẩn trương: {$cfg['urgency']}
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">

              <!-- Duo Speech Bubble -->
              <div style="position: relative; background-color: {$cfg['accent_bg']}; border: 2px solid {$cfg['border_color']}; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
                  {$cfg['dialogue']}
                </div>
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed {$cfg['border_color']}; font-size: 12px; font-weight: 700; color: {$cfg['theme_color']};">
                  🔥 Trạng thái chuỗi hiện tại: {$streakDisplay} ngày liên tục • {$cfg['flame_text']}
                </div>
              </div>

              <!-- Lucky Coin Chest Gift Card -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px dashed #f59e0b; border-radius: 14px; padding: 16px 20px; margin-bottom: 28px; text-align: center;">
                <div style="font-size: 28px; margin-bottom: 4px;">🎁🪙✨</div>
                <strong style="color: #92400e; font-size: 15px; display: block; margin-bottom: 4px;">
                  RƯƠNG XU MAY MẮN DÀNH CHO BẠN!
                </strong>
                <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">
                  Bấm vào nút bên dưới để nhảy thẳng vào phòng Lab thực hành, hệ thống sẽ <strong>tự động mở rương tặng ngẫu nhiên từ 15 đến 50 NetCoins</strong> để bạn đổi quà từ Giảng viên!
                </p>
              </div>

              <!-- Primary CTA Button -->
              <div style="text-align: center; margin: 30px 0 24px 0;">
                <a href="{$magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, {$cfg['theme_color']} 0%, #15803d 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 18px 36px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 4px solid rgba(0, 0, 0, 0.25);">
                  {$cfg['button_text']}
                </a>
              </div>

              <div style="background-color: #f8fafc; border-radius: 10px; padding: 12px 16px; text-align: center; font-size: 12px; color: #64748b;">
                🔗 Không bấm được nút trên? Sao chép liên kết này vào trình duyệt:<br>
                <a href="{$magicLinkUrl}" style="color: {$cfg['theme_color']}; font-weight: 600; word-break: break-all;">{$magicLinkUrl}</a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 28px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <strong>Trường Đại học Giao thông vận tải TP.HCM (UTH)</strong><br>
              Khoa Điện - Điện tử Viễn thông • Hệ thống Giả lập Phòng Lab Mạng Ảo<br>
              <em>Chiến dịch nhắc nhở Duolingo Gamification tự động • Email dành riêng cho {$safeEmail}</em>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}





