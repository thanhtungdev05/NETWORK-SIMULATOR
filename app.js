/**
 * app.js — Network Simulator Portal Logic
 */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────
  let currentDeviceId = null;
  let currentLessonId = null;

  // ── DOM Refs ─────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const btnCollapse = document.getElementById('btn-collapse');
  const deviceSelect = document.getElementById('device-select');
  const navList = document.getElementById('nav-list');
  const breadcrumb = document.getElementById('breadcrumb');
  const statusText = document.getElementById('status-text');
  const heroScreen = document.getElementById('hero-screen');
  const lessonScreen = document.getElementById('lesson-screen');
  const actionBtn = document.getElementById('action-btn');
  const actionMenu = document.getElementById('action-menu');
  const loadingOverlay = document.getElementById('loading-overlay');

  // Lesson card elements
  const lcTitle = document.getElementById('lc-title');
  const lcSubtitle = document.getElementById('lc-subtitle');
  const lcInstr = document.getElementById('lc-instructions');
  const btnGuide = document.getElementById('btn-guide');
  const btnPrac = document.getElementById('btn-practice');

  // Practice screen elements
  const practiceScreen = document.getElementById('practice-screen');
  const deviceIframe = document.getElementById('device-iframe');
  const iframeLoading = document.getElementById('iframe-loading');
  const btnBackLesson = document.getElementById('btn-back-lesson');
  const btnOpenNewTab = document.getElementById('btn-open-new-tab');
  const serverWarning = document.getElementById('server-warning');
  const serverWarningText = document.getElementById('server-warning-text');
  const practiceModeLabel = document.getElementById('practice-mode-label');
  const practiceLessonTitle = document.getElementById('practice-lesson-title');

  // Track current iframe URL
  let currentIframeUrl = '';

  // ── Init ─────────────────────────────────────────────────
  function init() {
    // Populate device dropdown
    DEVICES.forEach(device => {
      const opt = document.createElement('option');
      opt.value = device.id;
      opt.textContent = device.name;
      deviceSelect.appendChild(opt);
    });

    // Select initial device (use restored dropdown value if available, else first device)
    const initialDeviceId = (deviceSelect.value && DEVICES.some(d => d.id === deviceSelect.value))
      ? deviceSelect.value
      : (DEVICES.length > 0 ? DEVICES[0].id : null);

    if (initialDeviceId) {
      selectDevice(initialDeviceId);
    }

    // Bind events
    deviceSelect.addEventListener('change', () => selectDevice(deviceSelect.value));
    btnCollapse.addEventListener('click', toggleSidebar);
    actionBtn.addEventListener('click', toggleActionMenu);
    document.addEventListener('click', onDocClick);

    // Practice screen events
    if (btnBackLesson) btnBackLesson.addEventListener('click', backToLesson);
    if (btnOpenNewTab) btnOpenNewTab.addEventListener('click', () => {
      if (currentIframeUrl) window.open(currentIframeUrl, '_blank', 'noopener');
    });

    // Hide iframe loading when iframe finishes loading
    deviceIframe.addEventListener('load', () => {
      iframeLoading.classList.add('hidden');
    });

    // Show system ready after short delay
    setTimeout(() => {
      statusText.textContent = 'System Ready';
    }, 1200);
  }

  // ── Device Selection ─────────────────────────────────────
  function selectDevice(deviceId) {
    currentDeviceId = deviceId;
    currentLessonId = null;

    const device = DEVICES.find(d => d.id === deviceId);
    if (!device) return;

    // Sync dropdown
    deviceSelect.value = deviceId;

    // Render nav list
    renderNavList(device);

    // Automatically select first lesson if available
    const firstLessonItem = navList.querySelector('.nav-item');
    if (firstLessonItem && device.categories && device.categories[0] && device.categories[0].lessons[0]) {
      selectLesson(device, device.categories[0].lessons[0], firstLessonItem);
    } else {
      showHero();
      setBreadcrumb([device.name]);
    }
  }

  // ── Render Nav ───────────────────────────────────────────
  function renderNavList(device) {
    navList.innerHTML = '';

    if (!device.categories || device.categories.length === 0) {
      navList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <p>Chưa có bài học nào<br>cho thiết bị này.</p>
        </div>`;
      return;
    }

    device.categories.forEach(cat => {
      // Category title
      const catTitle = document.createElement('div');
      catTitle.className = 'nav-category-title';
      catTitle.textContent = cat.title;
      navList.appendChild(catTitle);

      // Lessons
      cat.lessons.forEach((lesson, idx) => {
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.dataset.lessonId = lesson.id;

        // Parse "Bài X - " for the number
        const match = lesson.title.match(/^(Bài\s*\d+)\s*[-–]\s*(.+)$/i);
        const numPart = match ? match[1] : `${idx + 1}`;
        const labelPart = match ? match[2] : lesson.title;

        item.innerHTML = `
          <span class="nav-num">${numPart}</span>
          <span class="nav-label" title="${lesson.title}">-${labelPart}</span>`;

        item.addEventListener('click', () => selectLesson(device, lesson, item));
        navList.appendChild(item);
      });
    });
  }

  // ── Lesson Selection ─────────────────────────────────────
  function selectLesson(device, lesson, itemEl) {
    currentLessonId = lesson.id;

    // Update nav active state
    navList.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    itemEl.classList.add('active');

    // Breadcrumb
    setBreadcrumb([device.name, 'Học Tập', lesson.title]);

    // Render lesson card
    renderLessonCard(lesson);

    // Switch view to show lesson card (Image 3)
    showLesson();
  }

  // ── Render Lesson Card ────────────────────────────────────
  function renderLessonCard(lesson) {
    lcTitle.textContent = lesson.title.toUpperCase();
    lcSubtitle.textContent = lesson.subtitle;

    // Build instruction list
    lcInstr.innerHTML = '';
    lesson.instructions.forEach(instr => {
      const div = document.createElement('div');
      div.className = 'instruction-item';
      div.innerHTML = instr; // supports HTML tags like <b>, <span>
      lcInstr.appendChild(div);
    });

    // Hướng dẫn → mở trang chủ/login của thiết bị
    const device = DEVICES.find(d => d.id === currentDeviceId);
    btnGuide.onclick = () => {
      // Nếu thiết bị có server hỗ trợ reset session (AX3000C dùng OUI/Vue SPA),
      // gọi /sim-reset-session trước để hủy SID cũ → SPA buộc hiện trang Login.
      const resetUrl = device.resetSessionUrl || null;
      if (resetUrl) {
        const cacheBustUrl = resetUrl + (resetUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();
        fetch(cacheBustUrl, { cache: 'no-store' })
          .catch(() => {}) // bỏ qua lỗi nếu server chưa chạy
          .finally(() => {
            const loginUrlWithTime = 'http://127.0.0.1:8090/?logout=1&_t=' + Date.now() + '#/login';
            openInFrame(device, lesson, loginUrlWithTime, '📋 Hướng dẫn');
          });
      } else {
        openInFrame(device, lesson, device.loginUrl, '📋 Hướng dẫn');
      }
    };

    // Thực hành → mở trang login để đăng nhập lại từ đầu
    btnPrac.onclick = () => {
      const resetUrl = device.resetSessionUrl || null;
      if (resetUrl) {
        const cacheBustUrl = resetUrl + (resetUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();
        fetch(cacheBustUrl, { cache: 'no-store' })
          .catch(() => {}) // bỏ qua lỗi nếu server chưa chạy
          .finally(() => {
            const loginUrlWithTime = 'http://127.0.0.1:8090/?logout=1&_t=' + Date.now() + '#/login';
            openInFrame(device, lesson, loginUrlWithTime, '🖥️ Thực hành');
          });
      } else {
        openInFrame(device, lesson, device.loginUrl, '🖥️ Thực hành');
      }
    };
  }

  // ── Open In Frame ─────────────────────────────────────────
  /**
   * @param {object} device   - DEVICES entry
   * @param {object} lesson   - lesson entry
   * @param {string} url      - URL to load in iframe
   * @param {string} modeLabel - e.g. '🖥️ Thực hành' | '📋 Hướng dẫn'
   */
  function openInFrame(device, lesson, url, modeLabel) {
    if (!device || !url) return;

    currentIframeUrl = url;

    // Update practice topbar info if present
    if (practiceModeLabel) practiceModeLabel.textContent = modeLabel + ':';
    if (practiceLessonTitle) practiceLessonTitle.textContent = lesson.title;

    // Always hide server warning banner
    if (serverWarning) {
      serverWarning.style.display = 'none';
    }

    // Reset iframe loading state
    iframeLoading.classList.remove('hidden');
    deviceIframe.src = '';

    // Switch to practice screen
    showPractice();

    // Load URL into iframe after tiny delay (allows CSS transition)
    setTimeout(() => {
      deviceIframe.src = url;
    }, 80);
  }

  // ── View Switchers ────────────────────────────────────────
  function showHero() {
    heroScreen.style.display = 'flex';
    lessonScreen.classList.remove('visible');
    practiceScreen.classList.remove('visible');
  }

  function showLesson() {
    heroScreen.style.display = 'none';
    practiceScreen.classList.remove('visible');
    // Re-trigger animation by removing then re-adding class
    lessonScreen.classList.remove('visible');
    void lessonScreen.offsetWidth; // force reflow
    lessonScreen.classList.add('visible');
    lessonScreen.scrollTop = 0;
  }

  function showPractice() {
    heroScreen.style.display = 'none';
    lessonScreen.classList.remove('visible');
    // Re-trigger animation by removing then re-adding class
    practiceScreen.classList.remove('visible');
    void practiceScreen.offsetWidth; // force reflow
    practiceScreen.classList.add('visible');
  }

  function backToLesson() {
    // Clear iframe to stop loading
    deviceIframe.src = '';
    currentIframeUrl = '';
    showLesson();
  }

  // ── Breadcrumb ────────────────────────────────────────────
  function setBreadcrumb(parts) {
    if (!parts || parts.length === 0) {
      breadcrumb.innerHTML = '';
      return;
    }

    if (parts.length === 1) {
      breadcrumb.innerHTML =
        `<span>Đang chọn: <b>${parts[0]}</b></span>` +
        `<span style="color:#9ea7ba"> (Vui lòng chọn chức năng bên trái)</span>`;
      return;
    }

    const items = parts.map((p, i) => {
      if (i === parts.length - 1) {
        return `<span class="bc-active">${p}</span>`;
      }
      return `<span>${p}</span>`;
    });
    breadcrumb.innerHTML = items.join('<span class="bc-sep">›</span>');
  }

  // ── Sidebar Toggle ────────────────────────────────────────
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    // Update arrow
    const arrow = btnCollapse.querySelector('.arrow');
    if (arrow) {
      // CSS handles rotation via .collapsed class
    }
  }

  // ── Action Menu ───────────────────────────────────────────
  function toggleActionMenu() {
    actionMenu.classList.toggle('open');
  }

  function onDocClick(e) {
    if (!e.target.closest('.action-dropdown')) {
      actionMenu.classList.remove('open');
    }
  }

  // ── Loading ───────────────────────────────────────────────
  function showLoading(msg) {
    document.getElementById('loading-msg').textContent = msg || 'Đang tải...';
    loadingOverlay.classList.add('visible');
  }

  function hideLoading() {
    loadingOverlay.classList.remove('visible');
  }

  // ── Action Menu Items ─────────────────────────────────────
  document.getElementById('menu-dashboard').addEventListener('click', () => {
    actionMenu.classList.remove('open');
    alert('🖥️ Quản lý Dashboard\n\nTính năng này sẽ được phát triển trong phiên bản tiếp theo.');
  });

  document.getElementById('menu-logout').addEventListener('click', () => {
    actionMenu.classList.remove('open');
    if (confirm('Bạn có muốn đăng xuất không?')) {
      alert('Đã đăng xuất. Chúc bạn học tốt! 👋');
    }
  });

  // ── Boot ─────────────────────────────────────────────────
  init();
})();
