(function () {
  'use strict';

  const loginButton = document.getElementById('iam-login');
  const label = loginButton.querySelector('.button-label');
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

  if (isLocalHost) {
    loginButton.href = '/api/index.php/dev/bypass?next=/portal.html';
    label.textContent = 'Vào local (bypass IAM)';
  }

  const defaultLabel = label.textContent;

  loginButton.addEventListener('click', function () {
    loginButton.classList.add('is-loading');
    loginButton.setAttribute('aria-busy', 'true');
    label.textContent = isLocalHost ? 'Đang vào local…' : 'Đang chuyển đến IAM…';
  });

  window.addEventListener('pageshow', function () {
    loginButton.classList.remove('is-loading');
    loginButton.removeAttribute('aria-busy');
    label.textContent = defaultLabel;
  });
})();
