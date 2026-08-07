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

    // Auto collapse sidebar on mobile portrait so content is immediately visible
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.add('collapsed');
    }
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
          .catch(() => { })
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
          .catch(() => { })
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

    // Auto collapse sidebar on mobile
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.add('collapsed');
    }

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
    return getLessonPopupsForDoc(deviceId, lesson, null);
  }

  function getLessonPopupsForDoc(deviceId, lesson, doc) {
    if (!deviceId || !lesson) return [];

    const storeKey = 'TOOLTIPS_' + deviceId.toUpperCase();
    const store = window[storeKey];

    // Check xem iframe/doc hiện tại có đang ở màn hình Đăng Nhập (login.asp / #/login) không
    const href = (doc && doc.location && doc.location.href) ? doc.location.href.toLowerCase() : '';
    const hash = (doc && doc.location && doc.location.hash) ? doc.location.hash.toLowerCase() : '';
    const isMainConfigPage = hash.includes('#/home') || hash.includes('#/network') || hash.includes('#/system') || hash.includes('#/status') || hash.includes('#/device');

    const isLoginPage = !isMainConfigPage && (href.includes('login') || hash.includes('login') || (doc && doc.querySelector('.login-fpt, form[action*="login"]')));

    if (isLoginPage && store && store._common_login && store._common_login.length > 0) {
      return store._common_login;
    }

    // Nếu đã đăng nhập vào trang cấu hình bài học: lấy tooltip từ file bài tương ứng (ví dụ: bai1.js)
    if (store && store[lesson.id]) {
      return store[lesson.id];
    }

    // Fallback nếu dùng getStepByStepPopups hoặc lesson.guidePopups
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
    } catch (e) { }
    try {
      if (win.frames && win.frames.length > 0) {
        for (let i = 0; i < win.frames.length; i++) {
          broadcastToWindowTree(win.frames[i], msg);
        }
      }
    } catch (e) { }
  }

  function clearGuidePopups() {
    localStorage.setItem('ftc_guide_enabled', '0');
    localStorage.removeItem('ftc_guide_popups');

    // PostMessage clear to iframe and all subframes
    try {
      if (deviceIframe && deviceIframe.contentWindow) {
        broadcastToWindowTree(deviceIframe.contentWindow, { type: 'CLEAR_GUIDE_POPUPS' });
      }
    } catch (e) { }

    // Direct DOM cleanup if accessible
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        doc.querySelectorAll('.ftc-guide-bubble, .guide-tooltip-bubble').forEach(el => el.remove());
        doc.querySelectorAll('.ftc-guide-target-highlight').forEach(el => {
          el.classList.remove('ftc-guide-target-highlight');
        });
      });
    } catch (e) { }
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

    // 1. Direct DOM injection cho từng document trong iframe (xử lý linh hoạt login vs bài học)
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        const popups = getLessonPopupsForDoc(currentDeviceId, lesson, doc);
        if (popups && popups.length > 0) {
          injectGuidePopupsIntoDoc(doc, popups);
        } else {
          doc.querySelectorAll('.ftc-guide-bubble').forEach(el => el.remove());
          doc.querySelectorAll('.ftc-guide-target-highlight').forEach(el => el.classList.remove('ftc-guide-target-highlight'));
        }
      });
    } catch (e) { }
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
            } catch (e) { }
          }
        }
      } catch (e) { }
    }
    traverse(rootWin);
    return docs;
  }

  function injectGuidePopupsIntoDoc(doc, popups) {
    if (!doc || !doc.body) return;

    // Inject styles
    if (!doc.getElementById('ftc-guide-injected-style')) {
      const styleTag = doc.createElement('style');
      styleTag.id = 'ftc-guide-injected-style';
      styleTag.textContent = `
        .ftc-guide-bubble {
          position: absolute !important;
          z-index: 2147483647 !important;
          background: #ff0000 !important;
          color: #ffffff !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          padding: 8px 14px !important;
          border-radius: 4px !important;
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4) !important;
          white-space: nowrap !important;
          pointer-events: none !important;
          user-select: none !important;
          animation: ftcGuidePopIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
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
          border-color: transparent #ff0000 transparent transparent !important;
        }
        .ftc-guide-bubble.pos-left::before {
          top: 50% !important;
          right: -8px !important;
          transform: translateY(-50%) !important;
          border-width: 6px 0 6px 8px !important;
          border-color: transparent transparent transparent #ff0000 !important;
        }
        .ftc-guide-bubble.pos-bottom::before {
          left: 50% !important;
          top: -8px !important;
          transform: translateX(-50%) !important;
          border-width: 0 6px 8px 6px !important;
          border-color: transparent transparent #ff0000 transparent !important;
        }
        .ftc-guide-bubble.pos-top::before {
          left: 50% !important;
          bottom: -8px !important;
          transform: translateX(-50%) !important;
          border-width: 8px 6px 0 6px !important;
          border-color: #ff0000 transparent transparent transparent !important;
        }
        @keyframes ftcGuidePopIn {
          0% { opacity: 0; transform: scale(0.88) translateY(3px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `;
      (doc.head || doc.documentElement).appendChild(styleTag);
    }

  function findGuideElements(doc, selectorStr) {
    if (!doc || !selectorStr) return [];
    const parts = selectorStr.split(',').map(s => s.trim());
    const results = [];
    for (const sel of parts) {
      if (sel.includes(':contains(')) {
        const match = sel.match(/^(.*?):contains\(["']?(.*?)["']?\)$/);
        if (match) {
          const baseSel = match[1] || '*';
          const textToMatch = match[2].trim().toLowerCase();
          try {
            const candidates = doc.querySelectorAll(baseSel);
            candidates.forEach(el => {
              const txt = (el.textContent || el.innerText || '').trim().toLowerCase();
              if (txt.includes(textToMatch)) {
                results.push(el);
              }
            });
          } catch (e) { }
          continue;
        }
      }
      try {
        const els = doc.querySelectorAll(sel);
        els.forEach(el => results.push(el));
      } catch (e) { }
    }
    return results;
  }

    function isPageActiveInTree(rootWin, pageName) {
      if (!rootWin || !pageName) return false;
      const p = pageName.toLowerCase();
      try {
        const docs = getAllAccessibleDocuments(rootWin);
        for (const d of docs) {
          const h = (d.location && d.location.href) ? d.location.href.toLowerCase() : '';
          const ha = (d.location && d.location.hash) ? d.location.hash.toLowerCase() : '';
          if (h.includes(p) || ha.includes(p)) return true;
          if (p === 'lan' && (h.includes('dhcp') || ha.includes('dhcp'))) return true;
        }
      } catch (e) { }
      return false;
    }

    const href = (doc && doc.location && doc.location.href) ? doc.location.href.toLowerCase() : '';
    const hash = (doc && doc.location && doc.location.hash) ? doc.location.hash.toLowerCase() : '';
    const topHref = (window.location && window.location.href) ? window.location.href.toLowerCase() : '';
    const fullUrl = href + ' ' + hash + ' ' + topHref;

    // Render popups
    popups.forEach((pop, idx) => {
      // Filter by page / hideOnPage if specified
      if (pop.page) {
        const pName = pop.page.toLowerCase();
        const active = isPageActiveInTree(deviceIframe.contentWindow, pName) || fullUrl.includes(pName);
        if (!active) {
          const oldBubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
          if (oldBubble) oldBubble.remove();
          return;
        }
      }
      if (pop.hideOnPage) {
        const hName = pop.hideOnPage.toLowerCase();
        const hidden = isPageActiveInTree(deviceIframe.contentWindow, hName) || fullUrl.includes(hName);
        if (hidden) {
          const oldBubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
          if (oldBubble) oldBubble.remove();
          return;
        }
      }

      let target = null;
      try {
        const elements = findGuideElements(doc, pop.selector);
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          const r = el.getBoundingClientRect();
          if (r.width > 0 || r.height > 0 || el.offsetParent !== null) {
            target = el;
            break;
          }
        }
        if (!target && elements.length > 0) {
          target = elements[0];
        }
      } catch (e) { }

      if (!target) {
        const oldBubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
        if (oldBubble) oldBubble.remove();
        return;
      }

      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0 && target.offsetParent === null) {
        const oldBubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
        if (oldBubble) oldBubble.remove();
        return;
      }

      let bubble = doc.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
      if (!bubble) {
        bubble = doc.createElement('div');
        const pos = pop.position || 'right';
        bubble.className = `ftc-guide-bubble pos-${pos}`;
        bubble.innerHTML = pop.text;
        bubble.dataset.guideIndex = idx;
        doc.body.appendChild(bubble);
      } else if (bubble.innerHTML !== pop.text) {
        bubble.innerHTML = pop.text;
      }

      const win = doc.defaultView || window;
      const scrollX = win.pageXOffset || doc.documentElement.scrollLeft || 0;
      const scrollY = win.pageYOffset || doc.documentElement.scrollTop || 0;

      const targetTop = rect.top + scrollY;
      const targetLeft = rect.left + scrollX;
      const bWidth = bubble.offsetWidth || 180;
      const bHeight = bubble.offsetHeight || 30;
      const winW = win.innerWidth || doc.documentElement.clientWidth || 1024;
      const winH = win.innerHeight || doc.documentElement.clientHeight || 768;
      let pos = pop.position || 'right';

      if (pos === 'right' && (targetLeft + rect.width + bWidth + 16) > winW) {
        if (targetLeft - bWidth - 12 >= 10) {
          pos = 'left';
        }
      }

      bubble.className = `ftc-guide-bubble pos-${pos}`;

      let calcLeft = 0;
      let calcTop = 0;

      if (pos === 'right') {
        calcLeft = targetLeft + rect.width + 10;
        calcTop = targetTop + (rect.height / 2) - (bHeight / 2);
      } else if (pos === 'left') {
        calcLeft = targetLeft - bWidth - 10;
        calcTop = targetTop + (rect.height / 2) - (bHeight / 2);
      } else if (pos === 'bottom') {
        calcLeft = targetLeft + (rect.width / 2) - (bWidth / 2);
        calcTop = targetTop + rect.height + 8;
      } else if (pos === 'top') {
        calcLeft = targetLeft + (rect.width / 2) - (bWidth / 2);
        calcTop = targetTop - bHeight - 8;
      }

      // Giữ vị trí chính xác sát target, tránh đè lên ô nhập
      calcLeft = Math.max(5, calcLeft);
      calcTop = Math.max(5, calcTop);

      bubble.style.left = Math.round(calcLeft) + 'px';
      bubble.style.top = Math.round(calcTop) + 'px';
    });

    // Dọn dẹp các bubble thừa khi danh sách popups ngắn hơn
    doc.querySelectorAll('.ftc-guide-bubble').forEach(b => {
      const gIndex = parseInt(b.dataset.guideIndex, 10);
      if (isNaN(gIndex) || gIndex >= popups.length) {
        b.remove();
      }
    });
  }

  // ── Boot ─────────────────────────────────────────────────────────
  init();
})();
