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
    $port = (int)env_value('SMTP_PORT', '587');
    $user = env_value('SMTP_USER', '');
    $pass = env_value('SMTP_PASS', '');
    $fromName = env_value('SMTP_FROM_NAME', 'Hệ Thống Thực Hành Mạng UTH');
    $fromEmail = env_value('SMTP_FROM_EMAIL', $user !== '' ? $user : 'no-reply@ut.edu.vn');

    // Nếu chưa cấu hình mật khẩu SMTP ứng dụng
    if ($pass === '' || $user === '') {
        return [
            'ok' => false,
            'reason' => 'smtp_not_configured',
            'message' => 'Chưa cấu hình SMTP_USER hoặc SMTP_PASS trong file .env. Hệ thống đang chuyển sang chế độ Demo Fallback.'
        ];
    }

    $passClean = str_replace(' ', '', $pass);
    $timeout = 15;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $useDirectSsl = ($port === 465);
    $connectHost = ($useDirectSsl ? 'ssl://' : '') . $host . ':' . $port;

    $socket = @stream_socket_client($connectHost, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return [
            'ok' => false,
            'reason' => 'connect_failed',
            'message' => "Không thể kết nối đến máy chủ SMTP ($connectHost): $errstr ($errno)"
        ];
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
        return ['ok' => false, 'reason' => 'banner_error', 'message' => "SMTP Banner error: $banner"];
    }

    $ehlo = $sendCommand('EHLO [127.0.0.1]');
    if (!str_starts_with($ehlo, '250')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'ehlo_error', 'message' => "EHLO failed: $ehlo"];
    }

    // Nếu dùng STARTTLS (port 587)
    if (!$useDirectSsl) {
        $starttls = $sendCommand('STARTTLS');
        if (!str_starts_with($starttls, '220')) {
            fclose($socket);
            return ['ok' => false, 'reason' => 'starttls_error', 'message' => "STARTTLS failed: $starttls"];
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
            return ['ok' => false, 'reason' => 'tls_negotiation_failed', 'message' => "TLS negotiation failed"];
        }

        $ehlo2 = $sendCommand('EHLO [127.0.0.1]');
        if (!str_starts_with($ehlo2, '250')) {
            fclose($socket);
            return ['ok' => false, 'reason' => 'ehlo2_error', 'message' => "EHLO post-TLS failed: $ehlo2"];
        }
    }

    $auth = $sendCommand('AUTH LOGIN');
    if (!str_starts_with($auth, '334')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'auth_init_failed', 'message' => "AUTH LOGIN rejected: $auth"];
    }

    $sendUser = $sendCommand(base64_encode($user));
    if (!str_starts_with($sendUser, '334')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'user_rejected', 'message' => "Username rejected: $sendUser"];
    }

    $sendPass = $sendCommand(base64_encode($passClean));
    if (!str_starts_with($sendPass, '235')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'pass_rejected', 'message' => "Password rejected: $sendPass (Kiểm tra lại Gmail App Password 16 ký tự)"];
    }

    $mailFrom = $sendCommand("MAIL FROM:<$fromEmail>");
    if (!str_starts_with($mailFrom, '250')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'mail_from_rejected', 'message' => "MAIL FROM rejected: $mailFrom"];
    }

    $rcptTo = $sendCommand("RCPT TO:<$toEmail>");
    if (!str_starts_with($rcptTo, '250')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'rcpt_to_rejected', 'message' => "RCPT TO rejected: $rcptTo"];
    }

    $dataCmd = $sendCommand('DATA');
    if (!str_starts_with($dataCmd, '354')) {
        fclose($socket);
        return ['ok' => false, 'reason' => 'data_rejected', 'message' => "DATA command rejected: $dataCmd"];
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
        return ['ok' => false, 'reason' => 'send_data_failed', 'message' => "Lỗi gửi nội dung: $sendDataResult"];
    }

    return ['ok' => true, 'message' => 'Email đã được gửi thành công.'];
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
    $appBaseUrl = env_value('APP_BASE_URL', 'http://127.0.0.1:8080');

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
    $appBaseUrl = env_value('APP_BASE_URL', 'http://127.0.0.1:8080');

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



