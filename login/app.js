(function () {
  'use strict';

  const loginButton = document.getElementById('iam-login');
  const label = loginButton.querySelector('.button-label');
  const defaultLabel = label.textContent;

  loginButton.addEventListener('click', function () {
    loginButton.classList.add('is-loading');
    loginButton.setAttribute('aria-busy', 'true');
    label.textContent = 'Đang chuyển đến IAM…';
  });

  window.addEventListener('pageshow', function () {
    loginButton.classList.remove('is-loading');
    loginButton.removeAttribute('aria-busy');
    label.textContent = defaultLabel;
  });
})();
