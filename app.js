/**
 * app.js — Network Simulator Portal Logic
 */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────────
  let currentDeviceId = null;
  let currentLessonId = null;
  let currentMode = 'guide'; // 'guide' (có popups) hoặc 'practice' (không có popups)
  let guideSyncInterval = null;

  // ── DOM Refs ─────────────────────────────────────────────────────
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
  const practiceModeLabel = document.getElementById('practice-mode-label');
  const practiceLessonTitle = document.getElementById('practice-lesson-title');

  // Track current iframe URL
  let currentIframeUrl = '';

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    // Populate device dropdown
    DEVICES.forEach(device => {
      const opt = document.createElement('option');
      opt.value = device.id;
      opt.textContent = device.name;
      deviceSelect.appendChild(opt);
    });

    // Select initial device
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

    // Handle messages from simulator frames
    window.addEventListener('message', function (event) {
      if (event.data && event.data.type === 'REQUEST_GUIDE_POPUPS') {
        if (currentMode === 'guide') {
          applyGuidePopups();
        } else {
          clearGuidePopups();
        }
      }
    });

    // When iframe loads, trigger popups if in guide mode
    deviceIframe.addEventListener('load', () => {
      iframeLoading.classList.add('hidden');
      if (currentMode === 'guide') {
        setTimeout(applyGuidePopups, 100);
        setTimeout(applyGuidePopups, 350);
        setTimeout(applyGuidePopups, 800);
        setTimeout(applyGuidePopups, 1500);
      } else {
        clearGuidePopups();
      }
    });

    // Periodic sync interval while practice screen is active
    if (!guideSyncInterval) {
      guideSyncInterval = setInterval(() => {
        if (practiceScreen.classList.contains('visible')) {
          if (currentMode === 'guide') {
            applyGuidePopups();
          } else {
            clearGuidePopups();
          }
        }
      }, 400);
    }

    // Show system ready after short delay
    setTimeout(() => {
      statusText.textContent = 'System Ready';
    }, 1200);
  }

  // ── Device Selection ─────────────────────────────────────────────
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

  // ── Render Nav ───────────────────────────────────────────────────
  function renderNavList(device) {
    navList.innerHTML = '';

    if (!device.categories || device.categories.length === 0) {
      navList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📁</div>
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
        const match = lesson.title.match(/^(Bài\s*\d+)\s*[-—]\s*(.+)$/i);
        const numPart = match ? match[1] : `${idx + 1}`;
        const labelPart = match ? match[2] : lesson.title;

        item.innerHTML = `
          <span class="nav-num">${numPart}</span>
          <span class="nav-label" title="${lesson.title}">- ${labelPart}</span>`;

        item.addEventListener('click', () => selectLesson(device, lesson, item));
        navList.appendChild(item);
      });
    });
  }

  // ── Lesson Selection ─────────────────────────────────────────────
  function selectLesson(device, lesson, itemEl) {
    currentLessonId = lesson.id;

    // Update nav active state
    navList.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    itemEl.classList.add('active');

    // Breadcrumb
    setBreadcrumb([device.name, 'Học Tập', lesson.title]);

    // Render lesson card
    renderLessonCard(lesson);

    // Switch view to show lesson card
    showLesson();
  }

  // ── Render Lesson Card ───────────────────────────────────────────
  function renderLessonCard(lesson) {
    lcTitle.textContent = lesson.title.toUpperCase();
    lcSubtitle.textContent = lesson.subtitle;

    // Build instruction list
    lcInstr.innerHTML = '';
    lesson.instructions.forEach(instr => {
      const div = document.createElement('div');
      div.className = 'instruction-item';
      div.innerHTML = instr;
      lcInstr.appendChild(div);
    });

    // 💡 Hướng dẫn — mở giao diện thiết bị và BẬT POPUP HƯỚNG DẪN TỪNG BƯỚC
    const device = DEVICES.find(d => d.id === currentDeviceId);
    btnGuide.onclick = () => {
      currentMode = 'guide';
      // Reset session trước rồi mở trang login
      const resetUrl = device.resetSessionUrl || null;
      const loginUrl = device.loginUrl + (device.loginUrl.includes('?') ? '&' : '?') + 'logout=1&_t=' + Date.now();
      if (resetUrl) {
        const cacheBustUrl = resetUrl + (resetUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();
        fetch(cacheBustUrl, { cache: 'no-store' })
          .catch(() => {})
          .finally(() => {
            openInFrame(device, lesson, loginUrl, '💡 Hướng dẫn', true);
          });
      } else {
        openInFrame(device, lesson, loginUrl, '💡 Hướng dẫn', true);
      }
    };

    // ⚡ Thực hành — mở trang login của thiết bị và TẮT POPUP (bắt buộc học viên login vào)
    btnPrac.onclick = () => {
      currentMode = 'practice';
      const resetUrl = device.resetSessionUrl || null;
      const loginUrl = device.loginUrl + (device.loginUrl.includes('?') ? '&' : '?') + 'logout=1&_t=' + Date.now();
      if (resetUrl) {
        const cacheBustUrl = resetUrl + (resetUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();
        fetch(cacheBustUrl, { cache: 'no-store' })
          .catch(() => {})
          .finally(() => {
            openInFrame(device, lesson, loginUrl, '⚡ Thực hành', false);
          });
      } else {
        openInFrame(device, lesson, loginUrl, '⚡ Thực hành', false);
      }
    };
  }

  // ── Open In Frame ────────────────────────────────────────────────
  function openInFrame(device, lesson, url, modeLabel, enableGuide) {
    if (!device || !url) return;

    currentIframeUrl = url;
    currentMode = enableGuide ? 'guide' : 'practice';

    // Update practice topbar info
    if (practiceModeLabel) practiceModeLabel.textContent = modeLabel + ':';
    if (practiceLessonTitle) practiceLessonTitle.textContent = lesson.title;

    // Always hide server warning banner
    if (serverWarning) {
      serverWarning.style.display = 'none';
    }

    const popups = getLessonPopups(device.id, lesson);

    // Save popups to localStorage
    if (enableGuide && popups && popups.length > 0) {
      localStorage.setItem('ftc_guide_popups', JSON.stringify(popups));
      localStorage.setItem('ftc_guide_enabled', '1');
    } else {
      localStorage.setItem('ftc_guide_enabled', '0');
      localStorage.removeItem('ftc_guide_popups');
    }

    // Reset iframe loading state
    iframeLoading.classList.remove('hidden');
    deviceIframe.src = 'about:blank';

    // Switch to practice screen
    showPractice();

    // Load URL into iframe
    setTimeout(() => {
      // Force reload even if only hash changes
      const urlObj = new URL(url, window.location.origin);
      urlObj.searchParams.set('_t', Date.now());
      deviceIframe.src = urlObj.toString();
    }, 80);
  }

  // ── View Switchers ───────────────────────────────────────────────
  function showHero() {
    heroScreen.style.display = 'flex';
    lessonScreen.classList.remove('visible');
    practiceScreen.classList.remove('visible');
  }

  function showLesson() {
    heroScreen.style.display = 'none';
    practiceScreen.classList.remove('visible');
    lessonScreen.classList.remove('visible');
    void lessonScreen.offsetWidth;
    lessonScreen.classList.add('visible');
    lessonScreen.scrollTop = 0;
  }

  function showPractice() {
    heroScreen.style.display = 'none';
    lessonScreen.classList.remove('visible');
    practiceScreen.classList.remove('visible');
    void practiceScreen.offsetWidth;
    practiceScreen.classList.add('visible');
  }

  function backToLesson() {
    deviceIframe.src = '';
    currentIframeUrl = '';
    clearGuidePopups();
    showLesson();
  }

  // ── Breadcrumb ───────────────────────────────────────────────────
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
    breadcrumb.innerHTML = items.join('<span class="bc-sep">></span>');
  }

  // ── Sidebar Toggle ───────────────────────────────────────────────
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
  }

  // ── Action Menu ──────────────────────────────────────────────────
  function toggleActionMenu() {
    actionMenu.classList.toggle('open');
  }

  function onDocClick(e) {
    if (!e.target.closest('.action-dropdown')) {
      actionMenu.classList.remove('open');
    }
  }

  // ── Action Menu Items ────────────────────────────────────────────
  document.getElementById('menu-dashboard').addEventListener('click', () => {
    actionMenu.classList.remove('open');
    alert('🖥️ Quản lý Dashboard\n\nTính năng này sẽ được phát triển trong phiên bản tiếp theo.');
  });

  document.getElementById('menu-logout').addEventListener('click', () => {
    actionMenu.classList.remove('open');
    if (confirm('Bạn có muốn đăng xuất không?')) {
      alert('Đã đăng xuất. Chúc bạn học tốt! 🎓');
    }
  });

  // ── Step By Step Guide Popups Logic ──────────────────────────────
  function getLessonPopups(deviceId, lesson) {
    if (!deviceId || !lesson) return [];
    if (window.getStepByStepPopups) {
      const steps = window.getStepByStepPopups(deviceId, lesson.id);
      if (steps && steps.length > 0) return steps;
    }
    return lesson.guidePopups || [];
  }

  function broadcastToWindowTree(win, msg) {
    if (!win) return;
    try {
      win.postMessage(msg, '*');
    } catch (e) {}
    try {
      if (win.frames && win.frames.length > 0) {
        for (let i = 0; i < win.frames.length; i++) {
          broadcastToWindowTree(win.frames[i], msg);
        }
      }
    } catch (e) {}
  }

  function clearGuidePopups() {
    localStorage.setItem('ftc_guide_enabled', '0');
    localStorage.removeItem('ftc_guide_popups');

    // PostMessage clear to iframe and all subframes
    try {
      if (deviceIframe && deviceIframe.contentWindow) {
        broadcastToWindowTree(deviceIframe.contentWindow, { type: 'CLEAR_GUIDE_POPUPS' });
      }
    } catch (e) {}

    // Direct DOM cleanup if accessible
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        doc.querySelectorAll('.ftc-guide-bubble, .guide-tooltip-bubble').forEach(el => el.remove());
      });
    } catch (e) {}
  }

  function getCurrentLesson() {
    if (!currentDeviceId || !currentLessonId) return null;
    const device = DEVICES.find(d => d.id === currentDeviceId);
    if (!device || !device.categories) return null;
    for (const cat of device.categories) {
      const found = cat.lessons.find(l => l.id === currentLessonId);
      if (found) return found;
    }
    return null;
  }

  function applyGuidePopups() {
    if (currentMode !== 'guide') {
      clearGuidePopups();
      return;
    }

    const lesson = getCurrentLesson();
    if (!lesson) return;

    const popups = getLessonPopups(currentDeviceId, lesson);
    if (!popups || popups.length === 0) return;

    // 1. Save to localStorage
    localStorage.setItem('ftc_guide_popups', JSON.stringify(popups));
    localStorage.setItem('ftc_guide_enabled', '1');

    // 2. Broadcast postMessage to deviceIframe and ALL subframes recursively
    try {
      if (deviceIframe && deviceIframe.contentWindow) {
        const msg = {
          type: 'SET_GUIDE_POPUPS',
          popups: popups,
          enabled: true
        };
        broadcastToWindowTree(deviceIframe.contentWindow, msg);
      }
    } catch (e) {}

    // 3. Direct DOM injection fallback for accessible frames
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        injectGuidePopupsIntoDoc(doc, popups);
      });
    } catch (e) {}
  }

  function getAllAccessibleDocuments(rootWin) {
    const docs = [];
    function traverse(win) {
      try {
        if (!win || !win.document) return;
        docs.push(win.document);
        if (win.frames && win.frames.length > 0) {
          for (let i = 0; i < win.frames.length; i++) {
            try {
              if (win.frames[i] && win.frames[i] !== win) {
                traverse(win.frames[i]);
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    traverse(rootWin);
    return docs;
  }

  function injectGuidePopupsIntoDoc(doc, popups) {
    if (!doc || !doc.body) return;

    // Inject styles (no border on target element)
    if (!doc.getElementById('ftc-guide-injected-style')) {
      const styleTag = doc.createElement('style');
      styleTag.id = 'ftc-guide-injected-style';
      styleTag.textContent = `
        .ftc-guide-bubble {
          position: absolute !important;
          z-index: 2147483647 !important;
          background: #e50019 !important;
          color: #ffffff !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          line-height: 1.4 !important;
          padding: 7px 14px !important;
          border-radius: 5px !important;
          box-shadow: 0 4px 16px rgba(229, 0, 25, 0.45), 0 2px 5px rgba(0, 0, 0, 0.3) !important;
          white-space: nowrap !important;
          pointer-events: none !important;
          user-select: none !important;
          animation: ftcGuidePopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .ftc-guide-bubble::before {
          content: '' !important;
          position: absolute !important;
          width: 0 !important;
          height: 0 !important;
          border-style: solid !important;
        }
        .ftc-guide-bubble.pos-right::before {
          top: 50% !important;
          left: -8px !important;
          transform: translateY(-50%) !important;
          border-width: 6px 8px 6px 0 !important;
          border-color: transparent #e50019 transparent transparent !important;
        }
        .ftc-guide-bubble.pos-left::before {
          top: 50% !important;
          right: -8px !important;
          transform: translateY(-50%) !important;
          border-width: 6px 0 6px 8px !important;
          border-color: transparent transparent transparent #e50019 !important;
        }
        .ftc-guide-bubble.pos-bottom::before {
          left: 50% !important;
          top: -8px !important;
          transform: translateX(-50%) !important;
          border-width: 0 6px 8px 6px !important;
          border-color: transparent transparent #e50019 transparent !important;
        }
        .ftc-guide-bubble.pos-top::before {
          left: 50% !important;
          bottom: -8px !important;
          transform: translateX(-50%) !important;
          border-width: 8px 6px 0 6px !important;
          border-color: #e50019 transparent transparent transparent !important;
        }
        @keyframes ftcGuidePopIn {
          0% { opacity: 0; transform: scale(0.88) translateY(3px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `;
      (doc.head || doc.documentElement).appendChild(styleTag);
    }

    // Render popups
    popups.forEach((pop, idx) => {
      let target = null;
      try {
        target = doc.querySelector(pop.selector);
      } catch (e) {}

      if (!target) return;

      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0 && target.offsetParent === null) return;

      let bubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
      if (!bubble) {
        bubble = doc.createElement('div');
        const pos = pop.position || 'right';
        bubble.className = `ftc-guide-bubble pos-${pos}`;
        bubble.textContent = pop.text;
        bubble.dataset.guideIndex = idx;
        doc.body.appendChild(bubble);
      }

      const win = doc.defaultView || window;
      const scrollX = win.pageXOffset || doc.documentElement.scrollLeft || 0;
      const scrollY = win.pageYOffset || doc.documentElement.scrollTop || 0;

      const targetTop = rect.top + scrollY;
      const targetLeft = rect.left + scrollX;
      const bWidth = bubble.offsetWidth || 180;
      const bHeight = bubble.offsetHeight || 30;
      const pos = pop.position || 'right';

      if (pos === 'right') {
        bubble.style.left = (targetLeft + rect.width + 12) + 'px';
        bubble.style.top = (targetTop + (rect.height / 2) - (bHeight / 2)) + 'px';
      } else if (pos === 'left') {
        bubble.style.left = (targetLeft - bWidth - 12) + 'px';
        bubble.style.top = (targetTop + (rect.height / 2) - (bHeight / 2)) + 'px';
      } else if (pos === 'bottom') {
        bubble.style.left = (targetLeft + (rect.width / 2) - (bWidth / 2)) + 'px';
        bubble.style.top = (targetTop + rect.height + 10) + 'px';
      } else if (pos === 'top') {
        bubble.style.left = (targetLeft + (rect.width / 2) - (bWidth / 2)) + 'px';
        bubble.style.top = (targetTop - bHeight - 10) + 'px';
      }
    });
  }

  // ── Boot ─────────────────────────────────────────────────────────
  init();
})();
