// FTC Network Simulator - Authentication Script
(function () {
  'use strict';

  // Helper: Get redirect target from URL
  function getRedirectUrl(defaultFallback = '/portal.html') {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('redirect') || params.get('next');
    if (target && target.startsWith('/') && !target.startsWith('//')) {
      return target;
    }
    return defaultFallback;
  }

  // Show Alert Banner
  window.showAlert = function (message, type = 'error') {
    const alertBox = document.getElementById('auth-alert');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');
    if (!alertBox) return;

    alertBox.className = 'auth-alert ' + type;
    alertIcon.textContent = type === 'success' ? '✅' : '⚠️';
    alertMessage.textContent = message;
    alertBox.style.display = 'flex';
  };

  // Hide Alert Banner
  window.hideAlert = function () {
    const alertBox = document.getElementById('auth-alert');
    if (alertBox) alertBox.style.display = 'none';
  };

  // Switch Between Login & Register Tabs
  window.switchAuthTab = function (tabName) {
    window.hideAlert();
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const formForgot = document.getElementById('form-forgot');

    if (tabName === 'login') {
      if (tabLogin) tabLogin.className = 'auth-tab active';
      if (tabRegister) tabRegister.className = 'auth-tab';
      if (formLogin) formLogin.style.display = 'flex';
      if (formRegister) formRegister.style.display = 'none';
      if (formForgot) formForgot.style.display = 'none';
      document.getElementById('login-email')?.focus();
    } else if (tabName === 'register') {
      if (tabRegister) tabRegister.className = 'auth-tab active';
      if (tabLogin) tabLogin.className = 'auth-tab';
      if (formRegister) formRegister.style.display = 'flex';
      if (formLogin) formLogin.style.display = 'none';
      if (formForgot) formForgot.style.display = 'none';

      // Auto prefill email if user already typed one in login tab
      const loginEmailVal = (document.getElementById('login-email')?.value || '').trim();
      const regEmailInput = document.getElementById('reg-email');
      if (loginEmailVal && regEmailInput && !regEmailInput.value) {
        regEmailInput.value = loginEmailVal;
      }

      document.getElementById('reg-name')?.focus();
    } else if (tabName === 'forgot') {
      if (tabLogin) tabLogin.className = 'auth-tab';
      if (tabRegister) tabRegister.className = 'auth-tab';
      if (formLogin) formLogin.style.display = 'none';
      if (formRegister) formRegister.style.display = 'none';
      if (formForgot) formForgot.style.display = 'flex';

      const loginEmailVal = (document.getElementById('login-email')?.value || '').trim();
      const forgotEmailInput = document.getElementById('forgot-email');
      if (loginEmailVal && forgotEmailInput && !forgotEmailInput.value) {
        forgotEmailInput.value = loginEmailVal;
      }

      document.getElementById('forgot-email')?.focus();
    }
  };

  // Fill Quick Demo Accounts
  window.fillQuickAccount = function (email, pwd) {
    const emailInput = document.getElementById('login-email');
    const pwdInput = document.getElementById('login-password');
    if (emailInput && pwdInput) {
      emailInput.value = email;
      pwdInput.value = pwd;
      window.hideAlert();
      document.getElementById('btn-submit-login')?.focus();
    }
  };

  // Toggle Password Visibility
  window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (input) {
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      if (btn) btn.textContent = isPwd ? '🙈' : '👁️';
    }
  };

  function setBtnLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    const textSpan = btn.querySelector('.btn-text');
    const spinnerSpan = btn.querySelector('.btn-spinner');
    if (textSpan) textSpan.style.display = isLoading ? 'none' : 'inline';
    if (spinnerSpan) spinnerSpan.style.display = isLoading ? 'inline' : 'none';
  }

  // Handle Login Submit
  window.handleLoginSubmit = async function (event) {
    if (event && event.preventDefault) event.preventDefault();
    window.hideAlert();

    const email = (document.getElementById('login-email')?.value || '').trim();
    const password = document.getElementById('login-password')?.value || '';
    const btn = document.getElementById('btn-submit-login');

    if (!email || !password) {
      window.showAlert('Vui lòng nhập đầy đủ Email và Mật khẩu.', 'error');
      return false;
    }

    setBtnLoading(btn, true);

    try {
      const response = await fetch('/api/index.php/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let errMsg = data.error?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.';
        if (response.status === 401) {
          errMsg = 'Email hoặc mật khẩu không chính xác. Nếu chưa có tài khoản, hãy nhấn tab [Đăng Ký] ở trên.';
        }
        window.showAlert(errMsg, 'error');
        setBtnLoading(btn, false);
        return false;
      }

      window.showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
      setTimeout(() => {
        const u = data.user || {};
        const role = String(u.role || '').toUpperCase();
        const isStaff = Boolean(u.isAdmin || u.is_admin || ['GIANGVIEN', 'ADMIN', 'DEV'].includes(role));
        const defaultFallback = isStaff ? '/dashboard/' : '/portal.html';
        window.location.replace(getRedirectUrl(defaultFallback));
      }, 400);

    } catch (err) {
      window.showAlert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.', 'error');
      setBtnLoading(btn, false);
    }
    return false;
  };

  // Handle Send OTP
  window.handleSendOtp = async function (event) {
    if (event && event.preventDefault) event.preventDefault();
    window.hideAlert();

    const email = (document.getElementById('reg-email')?.value || '').trim();
    const btn = document.getElementById('btn-send-otp');
    if (!btn) return false;

    const textSpan = btn.querySelector('.otp-btn-text');
    const spinnerSpan = btn.querySelector('.otp-btn-spinner');

    if (!email) {
      window.showAlert('Vui lòng nhập Email sinh viên trước khi bấm nhận mã OTP.', 'error');
      document.getElementById('reg-email')?.focus();
      return false;
    }

    const emailLower = email.toLowerCase();
    if (!emailLower.endsWith('@ut.edu.vn') && !emailLower.endsWith('@grad.edu.vn')) {
      window.showAlert('Hệ thống chỉ chấp nhận gửi mã xác thực đến email sinh viên trường (@ut.edu.vn).', 'error');
      return false;
    }

    // Set button loading
    btn.disabled = true;
    if (textSpan) textSpan.style.display = 'none';
    if (spinnerSpan) spinnerSpan.style.display = 'inline';

    try {
      const response = await fetch('/api/index.php/auth/send-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg = data.error?.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.';
        window.showAlert(errMsg, 'error');
        btn.disabled = false;
        if (textSpan) textSpan.style.display = 'inline';
        if (spinnerSpan) spinnerSpan.style.display = 'none';
        return false;
      }

      // Check if server returned dev/fallback OTP
      if (data.dev_otp) {
        const otpField = document.getElementById('reg-otp');
        if (otpField) {
          otpField.value = data.dev_otp;
        }
        window.showAlert(`⚡ [Chế độ Demo Fallback] Mã xác thực OTP: ${data.dev_otp} (Đã tự động điền vào ô OTP).`, 'success');
      } else {
        window.showAlert('✅ Mã xác thực OTP (6 chữ số) đã được gửi đến hộp thư sinh viên @ut.edu.vn. Vui lòng kiểm tra Gmail (hoặc mục Spam).', 'success');
      }

      // Focus on OTP input
      document.getElementById('reg-otp')?.focus();

      // Start 60s cooldown
      let countdown = 60;
      if (spinnerSpan) spinnerSpan.style.display = 'none';
      if (textSpan) {
        textSpan.textContent = `Gửi lại (${countdown}s)`;
        textSpan.style.display = 'inline';
      }

      const cooldownTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(cooldownTimer);
          if (textSpan) textSpan.textContent = 'Gửi lại mã OTP';
          btn.disabled = false;
        } else {
          if (textSpan) textSpan.textContent = `Gửi lại (${countdown}s)`;
        }
      }, 1000);

    } catch (err) {
      window.showAlert('Không thể kết nối đến máy chủ gửi mail. Vui lòng thử lại.', 'error');
      btn.disabled = false;
      if (textSpan) textSpan.style.display = 'inline';
      if (spinnerSpan) spinnerSpan.style.display = 'none';
    }

    return false;
  };

  // Handle Register Submit
  window.handleRegisterSubmit = async function (event) {
    if (event && event.preventDefault) event.preventDefault();
    window.hideAlert();

    const name = (document.getElementById('reg-name')?.value || '').trim();
    const email = (document.getElementById('reg-email')?.value || '').trim();
    const otp = (document.getElementById('reg-otp')?.value || '').trim();
    const studentId = (document.getElementById('reg-student-id')?.value || '').trim();
    const password = document.getElementById('reg-password')?.value || '';
    const confirmPassword = document.getElementById('reg-confirm-password')?.value || '';
    const btn = document.getElementById('btn-submit-register');

    if (!name || !email || !password) {
      window.showAlert('Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.', 'error');
      return false;
    }

    const emailLower = email.toLowerCase();
    if (!emailLower.endsWith('@ut.edu.vn') && !emailLower.endsWith('@grad.edu.vn')) {
      window.showAlert('Hệ thống chỉ chấp nhận đăng ký bằng email sinh viên trường (@ut.edu.vn).', 'error');
      return false;
    }

    if (!otp) {
      window.showAlert('Vui lòng bấm nút "Nhận mã OTP" và nhập mã xác thực 6 chữ số từ hòm thư trường.', 'error');
      document.getElementById('reg-otp')?.focus();
      return false;
    }

    if (password.length < 6) {
      window.showAlert('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
      return false;
    }

    if (password !== confirmPassword) {
      window.showAlert('Xác nhận mật khẩu không khớp. Vui lòng nhập lại chính xác.', 'error');
      return false;
    }

    setBtnLoading(btn, true);

    try {
      const response = await fetch('/api/index.php/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          otp: otp,
          student_id: studentId,
          password: password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg = data.error?.message || 'Đăng ký tài khoản không thành công.';
        window.showAlert(errMsg, 'error');
        setBtnLoading(btn, false);
        return false;
      }

      window.showAlert('Đăng ký tài khoản thành công! Đang đưa bạn vào phòng thực hành...', 'success');
      setTimeout(() => {
        window.location.replace(getRedirectUrl());
      }, 500);

    } catch (err) {
      window.showAlert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.', 'error');
      setBtnLoading(btn, false);
    }
    return false;
  };

  // Handle Send Forgot Password OTP
  window.handleSendForgotOtp = async function (event) {
    if (event && event.preventDefault) event.preventDefault();
    window.hideAlert();

    const email = (document.getElementById('forgot-email')?.value || '').trim();
    const btn = document.getElementById('btn-send-forgot-otp');
    if (!btn) return false;

    const textSpan = btn.querySelector('.otp-btn-text');
    const spinnerSpan = btn.querySelector('.otp-btn-spinner');

    if (!email) {
      window.showAlert('Vui lòng nhập Email sinh viên để nhận mã đặt lại mật khẩu.', 'error');
      document.getElementById('forgot-email')?.focus();
      return false;
    }

    btn.disabled = true;
    if (textSpan) textSpan.style.display = 'none';
    if (spinnerSpan) spinnerSpan.style.display = 'inline';

    try {
      const response = await fetch('/api/index.php/auth/forgot-password-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg = data.error?.message || 'Không thể gửi mã OTP đặt lại mật khẩu.';
        window.showAlert(errMsg, 'error');
        btn.disabled = false;
        if (textSpan) textSpan.style.display = 'inline';
        if (spinnerSpan) spinnerSpan.style.display = 'none';
        return false;
      }

      if (data.dev_otp) {
        const otpField = document.getElementById('forgot-otp');
        if (otpField) otpField.value = data.dev_otp;
        window.showAlert(`⚡ [Chế độ Demo] Mã OTP đặt lại mật khẩu: ${data.dev_otp} (Đã tự động điền).`, 'success');
      } else {
        window.showAlert('✅ Mã xác thực đặt lại mật khẩu (6 chữ số) đã được gửi đến Gmail trường của bạn! Vui lòng kiểm tra điện thoại.', 'success');
      }

      document.getElementById('forgot-otp')?.focus();

      let countdown = 60;
      if (spinnerSpan) spinnerSpan.style.display = 'none';
      if (textSpan) {
        textSpan.textContent = `Gửi lại (${countdown}s)`;
        textSpan.style.display = 'inline';
      }

      const cooldownTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(cooldownTimer);
          if (textSpan) textSpan.textContent = 'Gửi lại mã OTP';
          btn.disabled = false;
        } else {
          if (textSpan) textSpan.textContent = `Gửi lại (${countdown}s)`;
        }
      }, 1000);

    } catch (err) {
      window.showAlert('Không thể kết nối đến máy chủ. Vui lòng thử lại.', 'error');
      btn.disabled = false;
      if (textSpan) textSpan.style.display = 'inline';
      if (spinnerSpan) spinnerSpan.style.display = 'none';
    }

    return false;
  };

  // Handle Reset Password Submit
  window.handleResetPasswordSubmit = async function (event) {
    if (event && event.preventDefault) event.preventDefault();
    window.hideAlert();

    const email = (document.getElementById('forgot-email')?.value || '').trim();
    const otp = (document.getElementById('forgot-otp')?.value || '').trim();
    const newPassword = document.getElementById('forgot-new-password')?.value || '';
    const confirmNewPassword = document.getElementById('forgot-confirm-password')?.value || '';
    const btn = document.getElementById('btn-submit-reset-password');

    if (!email || !otp || !newPassword) {
      window.showAlert('Vui lòng nhập đầy đủ Email, Mã OTP và Mật khẩu mới.', 'error');
      return false;
    }

    if (newPassword.length < 6) {
      window.showAlert('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error');
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      window.showAlert('Xác nhận mật khẩu mới không khớp. Vui lòng kiểm tra lại.', 'error');
      return false;
    }

    setBtnLoading(btn, true);

    try {
      const response = await fetch('/api/index.php/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          password: newPassword
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg = data.error?.message || 'Đặt lại mật khẩu không thành công.';
        window.showAlert(errMsg, 'error');
        setBtnLoading(btn, false);
        return false;
      }

      window.showAlert('🎉 Đặt lại mật khẩu thành công! Đang chuyển về màn hình đăng nhập...', 'success');
      setTimeout(() => {
        setBtnLoading(btn, false);
        window.switchAuthTab('login');
        const loginEmail = document.getElementById('login-email');
        if (loginEmail) loginEmail.value = email;
        document.getElementById('login-password')?.focus();
        window.showAlert('Mật khẩu đã được cập nhật thành công! Vui lòng nhập mật khẩu mới để đăng nhập.', 'success');
      }, 1000);

    } catch (err) {
      window.showAlert('Không thể kết nối đến máy chủ. Vui lòng thử lại.', 'error');
      setBtnLoading(btn, false);
    }
    return false;
  };

  // Bind Enter key handlers to prevent default form submits
  function bindEnterKeys() {
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
      loginForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleLoginSubmit(e);
        }
      });
    }

    const regForm = document.getElementById('form-register');
    if (regForm) {
      regForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleRegisterSubmit(e);
        }
      });
    }

    const forgotForm = document.getElementById('form-forgot');
    if (forgotForm) {
      forgotForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleResetPasswordSubmit(e);
        }
      });
    }

    // Auto switch to register or forgot tab if URL requests it
    if (window.location.hash === '#register' || new URLSearchParams(window.location.search).get('tab') === 'register') {
      window.switchAuthTab('register');
    } else if (window.location.hash === '#forgot' || new URLSearchParams(window.location.search).get('tab') === 'forgot') {
      window.switchAuthTab('forgot');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEnterKeys);
  } else {
    bindEnterKeys();
  }

  // Clean dirty URL query if any (e.g. from accidental form GET)
  if (window.location.search) {
    const sp = new URLSearchParams(window.location.search);
    let changed = false;
    if (sp.has('email')) { sp.delete('email'); changed = true; }
    if (sp.has('password')) { sp.delete('password'); changed = true; }
    if (changed) {
      const q = sp.toString() ? '?' + sp.toString() : '';
      window.history.replaceState({}, document.title, window.location.pathname + q);
    }
  }

  // Check if session is already active (unless force=login)
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('force')) {
    fetch('/api/index.php/auth/session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) {
          // User is already logged in
          window.location.replace(getRedirectUrl());
        }
      })
      .catch(() => {});
  }

})();
