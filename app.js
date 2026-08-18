/**
 * app.js — Network Simulator Portal Logic
 */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────────
  let currentDeviceId = null;
  let currentLessonId = null;
  let _currentLesson = null;  // lesson object hiện tại (dùng cho clearFields)
  let currentMode = 'guide'; // 'guide' (có popups) hoặc 'practice' (không có popups)
  let guideSyncInterval = null;

  // ── Tracking State ───────────────────────────────────────────────
  // Lưu thông tin phiên thực hành hiện tại để gửi Tracking API khi kết thúc
  let _trackingSession = null; // { device, lesson, mode, startedAt }
  let _currentUser = null;    // { technician_id, name, email } — lấy từ API auth/session

  // ── Practice Timer State ────────────────────────────────────────
  let _practiceTimerInterval = null; // setInterval ID cho đồng hồ realtime
  let _practiceStartTime = null;     // Date object lúc bắt đầu thực hành
  let _lastSubmitDurationSec = 0;    // Thời gian khi nộp bài (dùng cho tracking)
  let _lastEvalResult = null;        // Kết quả chấm điểm gần nhất (dùng cho nút modal)

  // ── DOM Refs ─────────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const btnCollapse = document.getElementById('btn-collapse');
  const deviceSelect = document.getElementById('device-select');
  const navList = document.getElementById('nav-list');
  const breadcrumb = document.getElementById('breadcrumb');
  const statusText = document.getElementById('status-text');
  const heroScreen = document.getElementById('hero-screen');
  const lessonScreen = document.getElementById('lesson-screen');
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
  const btnSubmitLab = document.getElementById('btn-submit-lab');
  const practiceTimer = document.getElementById('practice-timer');
  const serverWarning = document.getElementById('server-warning');
  const practiceModeLabel = document.getElementById('practice-mode-label');
  const practiceLessonTitle = document.getElementById('practice-lesson-title');

  // Grading Modal elements
  const gradingModal = document.getElementById('grading-modal');
  const gradingBackdrop = document.getElementById('grading-backdrop');
  const btnModalRetry = document.getElementById('btn-modal-retry');
  const btnModalClose = document.getElementById('btn-modal-close');
  const gmIcon = document.getElementById('gm-icon');
  const gmTitle = document.getElementById('gm-title');
  const gmSubtitle = document.getElementById('gm-subtitle');
  const gmScoreBadge = document.getElementById('gm-score-badge');
  const gmScoreNum = document.getElementById('gm-score-num');
  const gmMetaDevice = document.getElementById('gm-meta-device');
  const gmMetaLesson = document.getElementById('gm-meta-lesson');
  const gmMetaMode = document.getElementById('gm-meta-mode');
  const gmMetaTime = document.getElementById('gm-meta-time');
  const gmStatusBox = document.getElementById('gm-status-box');
  const gmStatusTitle = document.getElementById('gm-status-title');
  const gmStatusDesc = document.getElementById('gm-status-desc');
  const gmChecklistBody = document.getElementById('gm-checklist-body');

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

    // Practice screen events
    if (btnBackLesson) btnBackLesson.addEventListener('click', backToLesson);
    if (btnOpenNewTab) btnOpenNewTab.addEventListener('click', () => {
      if (currentIframeUrl) window.open(currentIframeUrl, '_blank', 'noopener');
    });
    if (btnSubmitLab) btnSubmitLab.addEventListener('click', submitLab);

    // ── Grading Modal Events ──────────────────────────────────────────

    // 1. Click backdrop (viền đen ngoài bảng điểm)
    if (gradingBackdrop) gradingBackdrop.addEventListener('click', () => {
      // KHÓA màn hình nếu CHƯA ĐẠT ở chế độ Thực hành
      if (_lastEvalResult && !_lastEvalResult.passed && currentMode === 'practice') return;
      
      // Nếu ĐẠT: Đóng và quay về danh sách bài học
      if (_lastEvalResult && _lastEvalResult.passed) {
        hideGradingModal();
        backToLesson();
      } else {
        // Nếu CHƯA ĐẠT (chỉ có thể xảy ra ở chế độ Hướng dẫn): Ẩn bảng để KTV tự sửa lỗi
        hideGradingModal();
      }
    });

    // 2. Nút "Quay lại làm từ đầu" / "Đóng & Sửa lỗi" (Hiển thị khi CHƯA ĐẠT)
    if (btnModalRetry) btnModalRetry.addEventListener('click', () => {
      if (currentMode === 'guide') {
        // Chế độ Hướng dẫn: Đóng bảng để KTV thao tác tiếp, giữ nguyên giao diện thiết bị
        hideGradingModal();
      } else {
        // Chế độ Thực hành: Reset toàn bộ, đuổi ra ngoài danh sách bài học
        hideGradingModal();
        backToLesson();
      }
    });

    // 3. Nút "Hoàn tất & Quay lại" (Hiển thị khi ĐẠT)
    if (btnModalClose) btnModalClose.addEventListener('click', () => {
      hideGradingModal();
      backToLesson();
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

    // When iframe loads, trigger popups if in guide mode + clear fields
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
      // Xóa trắng các field được khai báo trong clearFields của bài học
      setTimeout(clearLessonFields, 300);
      setTimeout(clearLessonFields, 900);
      
      // Gọi hook phục hồi dữ liệu nếu bài học có định nghĩa
      if (_currentLesson && typeof _currentLesson.onSimLoad === 'function') {
        setTimeout(() => { _currentLesson.onSimLoad(deviceIframe.contentWindow); }, 400);
        setTimeout(() => { _currentLesson.onSimLoad(deviceIframe.contentWindow); }, 1000);
      }
    });

    // Periodic sync interval while practice screen is active
    if (!guideSyncInterval) {
      guideSyncInterval = setInterval(() => {
        if (practiceScreen.classList.contains('visible')) {
          // Xóa trắng trường của bài học cho cả Hướng dẫn và Thực hành khi load trang mới
          clearLessonFields();

          if (currentMode === 'guide') {
            applyGuidePopups();
            
            // Theo dõi sự kiện click vào nút Save/Apply trong iframe
            try {
              const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
              allDocs.forEach(doc => {
                if (!doc._ftcSaveListenerAttached) {
                  doc.addEventListener('click', function(e) {
                    let el = e.target;
                    while(el && el !== doc) {
                      if ((el.tagName === 'INPUT' || el.tagName === 'BUTTON') && 
                          (el.type === 'submit' || (el.value || el.textContent || '').toLowerCase().includes('save') || (el.value || el.textContent || '').toLowerCase().includes('apply'))) {
                        window._hasClickedSaveInGuide = true;
                      }
                      el = el.parentNode;
                    }
                  }, true);
                  doc._ftcSaveListenerAttached = true;
                }
              });
            } catch(e) {}

            // Tự động kiểm tra hoàn thành để mở nút Nộp bài trong chế độ Hướng dẫn
            if (btnSubmitLab && btnSubmitLab.disabled) {
              const device = DEVICES.find(d => d.id === currentDeviceId);
              const lesson = getCurrentLesson();
              if (device && lesson) {
                const evalResult = evaluateLesson(device, lesson);
                
                // Kiểm tra xem bài học có yêu cầu bấm Save/Apply không thông qua tooltip
                let requiresSave = false;
                const popups = getLessonPopupsForDoc(device.id, lesson, null) || [];
                const popupsStr = JSON.stringify(popups).toLowerCase();
                if (popupsStr.includes('save') || popupsStr.includes('apply')) {
                  requiresSave = true;
                }

                if (evalResult && evalResult.passed) {
                  // Chỉ bật nút nếu (Không cần Save) HOẶC (Đã bấm Save)
                  if (!requiresSave || window._hasClickedSaveInGuide) {
                    btnSubmitLab.disabled = false;
                    btnSubmitLab.style.opacity = '1';
                    btnSubmitLab.style.cursor = 'pointer';
                  }
                }
              }
            }
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

    // Tải thông tin người dùng hiện tại từ API để dùng cho Tracking
    fetchCurrentUser();
  }

  function renderUserProfile() {
    const section = document.getElementById('user-profile-section');
    if (!section) return;

    if (_currentUser) {
      const initials = (_currentUser.name || 'K').substring(0, 2).toUpperCase();
      section.innerHTML = `
        <div class="auth-container">
          <div class="auth-user-info">
            <div class="auth-avatar">${initials}</div>
            <div class="auth-details">
              <span class="auth-name" title="${_currentUser.name}">${_currentUser.name}</span>
              <span class="auth-role">${_currentUser.technician_id}</span>
            </div>
          </div>
          <button class="btn-auth btn-logout" id="btn-iam-logout">Đăng xuất</button>
        </div>
      `;
      document.getElementById('btn-iam-logout').addEventListener('click', function() {
        fetch('/api/index.php/auth/logout', { method: 'POST', credentials: 'include' })
          .then(function() {
            window.location.href = '/';
          });
      });
    } else {
      section.innerHTML = `
        <div class="auth-container">
          <button class="btn-auth btn-login" id="btn-iam-login">Đăng nhập IAM</button>
        </div>
      `;
      document.getElementById('btn-iam-login').addEventListener('click', function() {
        window.location.href = '/api/index.php/auth/login?next=' + encodeURIComponent(window.location.pathname);
      });
    }
  }

  // ── Fetch Current User (for Tracking) ───────────────────────────
  /**
   * Lấy thông tin user đang đăng nhập từ API auth/session.
   * Kết quả được cache vào _currentUser để dùng khi gửi Tracking API.
   * Không block UI nếu API lỗi — chỉ log warning.
   */
  function fetchCurrentUser() {
    fetch('/api/index.php/auth/session', { credentials: 'include' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        const u = data && data.user;
        if (u) {
          _currentUser = {
            technician_id: u.user_id || u.id || 'UNKNOWN',
            name: u.displayName || u.display_name || u.email || 'KTV',
            email: u.email || '',
            role: u.role || 'user'
          };
        }
        renderUserProfile();
        if (_currentUser && _currentUser.role === 'admin') {
          document.getElementById('btn-dashboard').style.display = '';
        }
      })
      .catch(function () {
        // Không làm gì — portal vẫn hoạt động bình thường
        console.warn('[Tracking] Không thể lấy thông tin user từ API.');
      });
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

    // Thiết lập cookie current_sim cho Master Dispatcher
    const simId = device.folder || ('sim_' + device.id);
    document.cookie = 'current_sim=' + simId + ';path=/;SameSite=Lax';

    // Update practice topbar info
    if (practiceModeLabel) {
      practiceModeLabel.textContent = modeLabel + ':';
      practiceModeLabel.className = 'practice-badge ' + (enableGuide ? 'guide' : 'practice');
    }
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

    // Reset session storage của thiết bị
    try {
      sessionStorage.removeItem('ftc_ac1000f_wan_PPPUsername');
      sessionStorage.removeItem('ftc_ac1000f_wan_PPPPassword');
    } catch(e) {}

    // Reset wifi storage cho bài 2
    if (lesson && lesson.id === 'ac1-bai2') {
      try {
        localStorage.removeItem('ftc_sim_wifi24');
        localStorage.removeItem('ftc_sim_wifi5g');
      } catch(e) {}
    }

    // Lưu lesson hiện tại để dùng cho clearFields
    _currentLesson = lesson;

    // Reset cờ theo dõi click Save cho phiên hướng dẫn mới
    window._hasClickedSaveInGuide = false;

    // ── Ghi nhận thời điểm BẮT ĐẦU phiên thực hành (Tracking) ──
    _trackingSession = {
      device: device,
      lesson: lesson,
      mode: enableGuide ? 'Hướng dẫn' : 'Thực hành',
      startedAt: new Date().toISOString()
    };

    // ── Khởi động đồng hồ realtime trên toolbar ──
    startPracticeTimer();

    // Reset iframe loading state
    iframeLoading.classList.remove('hidden');
    deviceIframe.src = 'about:blank';

    // Thiết lập trạng thái ban đầu cho nút Nộp bài
    if (btnSubmitLab) {
      if (currentMode === 'guide') {
        btnSubmitLab.disabled = true;
        btnSubmitLab.style.opacity = '0.5';
        btnSubmitLab.style.cursor = 'not-allowed';
      } else {
        btnSubmitLab.disabled = false;
        btnSubmitLab.style.opacity = '1';
        btnSubmitLab.style.cursor = 'pointer';
      }
    }

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
    // Reset đồng hồ và session tracking
    resetPracticeTimer();
    _trackingSession = null;
    _lastEvalResult = null;
    _lastSubmitDurationSec = 0;

    deviceIframe.src = '';
    currentIframeUrl = '';
    clearGuidePopups();
    showLesson();
  }

  // ── Clear Fields On Load ──────────────────────────────────────────
  /**
   * Xóa trắng các input field được khai báo trong lesson.clearFields[].
   * Chạy sau mỗi lần iframe load hoặc định kỳ để học viên phải tự nhập giá trị.
   */
  function clearLessonFields() {
    if (!_currentLesson || !Array.isArray(_currentLesson.clearFields) || _currentLesson.clearFields.length === 0) return;
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        if (doc._ftcFieldsCleared) return;
        let clearedAny = false;
        _currentLesson.clearFields.forEach(selector => {
          try {
            doc.querySelectorAll(selector).forEach(el => {
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = '';
                clearedAny = true;
              }
            });
          } catch(e) {}
        });
        if (clearedAny) {
          doc._ftcFieldsCleared = true;
        }
      });
    } catch(e) {}
  }

  // ── Grading & Evaluation Engine ──────────────────────────────────
  function evaluateLesson(device, lesson) {
    if (!lesson) return null;

    if (lesson.grading && typeof lesson.grading.customGrading === 'function') {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      return lesson.grading.customGrading(allDocs);
    }

    let rules = (lesson.grading && lesson.grading.rules && lesson.grading.rules.length > 0)
      ? lesson.grading.rules
      : [];

    // Tự động đọc đáp án từ tooltips nếu chưa định nghĩa rules riêng
    if (rules.length === 0) {
      const deviceTooltipsVar = `TOOLTIPS_${device.id.toUpperCase()}`;
      if (window[deviceTooltipsVar] && window[deviceTooltipsVar][lesson.id]) {
        const tooltips = window[deviceTooltipsVar][lesson.id];
        tooltips.forEach(step => {
          if (step.expected !== undefined) {
            rules.push({
              selector: step.selector,
              expected: step.expected,
              type: step.checkType || 'text_exact',
              label: step.text.split(':')[0] || 'Kiểm tra'
            });
          }
        });
      }
    }

    if (rules.length === 0) {
      // Nếu bài học chưa có rule chi tiết và tooltip không có expected, mặc định xem như hoàn tất thao tác
      return {
        passed: true,
        score: 100,
        passedCount: 1,
        totalRules: 1,
        details: [
          {
            id: 'default',
            name: 'Thao tác cấu hình',
            expected: 'Hoàn tất theo yêu cầu đề bài',
            actual: 'Đã hoàn thành',
            passed: true,
            message: 'Đã hoàn thành các bước yêu cầu'
          }
        ]
      };
    }

    const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
    let passedCount = 0;
    const details = [];

    rules.forEach(rule => {
      let actualValue = '';
      let elementFound = false;
      let isSaved = false;

      // Tìm element trong tất cả accessible frames
      for (const doc of allDocs) {
        try {
          const el = doc.querySelector(rule.selector);
          if (el) {
            elementFound = true;
            isSaved = !!doc._ftcIsSaved;
            if (el.type === 'checkbox' || el.type === 'radio') {
              actualValue = el.checked ? (el.value || 'true') : 'false';
            } else {
              actualValue = (el.value !== undefined ? el.value : el.textContent || '').trim();
            }
            break;
          }
        } catch (e) {}
      }

      const expectedVal = (rule.trim !== false) ? String(rule.expected).trim() : String(rule.expected);
      const compActual = (rule.trim !== false) ? String(actualValue).trim() : String(actualValue);
      let isMatch = false;

      if (rule.type === 'text_exact') {
        isMatch = compActual === expectedVal;
      } else if (rule.type === 'case_insensitive') {
        isMatch = compActual.toLowerCase() === expectedVal.toLowerCase();
      } else if (rule.type === 'contains') {
        isMatch = compActual.includes(expectedVal);
      } else {
        isMatch = compActual === expectedVal;
      }

      if (isMatch) {
        // Đối với thiết bị AX3000C, bắt buộc trang chứa phần tử phải được bấm Save/Apply thành công
        if (currentDeviceId === 'ax3000c' && !isSaved) {
          isMatch = false;
        }
      }

      if (isMatch) {
        passedCount++;
      }

      let msg = '';
      if (isMatch) {
        msg = 'Chính xác';
      } else {
        if (currentDeviceId === 'ax3000c' && elementFound && !isSaved) {
          msg = 'Chưa bấm Apply để lưu cấu hình';
        } else {
          msg = `Mong muốn: "${expectedVal}", Thực tế: "${actualValue || 'Trống'}"`;
        }
      }

      details.push({
        id: rule.id,
        name: rule.name,
        expected: expectedVal,
        actual: (currentDeviceId === 'ax3000c' && elementFound && !isSaved) ? `${actualValue} (Chưa lưu)` : (actualValue || '(Chưa nhập / Chưa tìm thấy)'),
        passed: isMatch,
        message: msg
      });
    });

    const score = Math.round((passedCount / rules.length) * 100);
    const passed = passedCount === rules.length;

    return {
      passed: passed,
      score: score,
      passedCount: passedCount,
      totalRules: rules.length,
      details: details
    };
  }

  function submitLab() {
    const device = DEVICES.find(d => d.id === currentDeviceId);
    const lesson = getCurrentLesson();
    if (!device || !lesson) return;

    // Dừng đồng hồ và lấy thời gian chính xác
    const durationSec = stopPracticeTimer();

    // Chấm điểm
    const evalResult = evaluateLesson(device, lesson);

    // Lưu kết quả tạm để nút modal dùng khi cần thiết
    _lastEvalResult = evalResult;
    _lastSubmitDurationSec = durationSec;

    // =========================================================================
    // [GỬI TEAM DATA] LƯU Ý VỀ LUỒNG TRACKING API 
    // - Vị trí: Tracking được gọi ngay khi KTV ấn nút "Nộp Bài" (submitLab).
    // - Phân luồng: 
    //   + Chế độ Hướng dẫn (guide): CHỈ gửi log khi ĐẠT 100% (passed = true). 
    //     Các lần KTV nộp thử bị Rớt (FAIL) sẽ bị bỏ qua để tránh rác DB.
    //   + Chế độ Thực hành (practice): LUÔN gửi log (Cả PASS và FAIL) ngay lúc bấm.
    // =========================================================================
    if (currentMode === 'practice' || (currentMode === 'guide' && evalResult.passed)) {
      sendTrackingTimer(evalResult, durationSec);
    }

    // Hiển thị modal kết quả cho KTV xem
    showGradingModal(evalResult, device, lesson, currentMode, durationSec);
  }

  function showGradingModal(res, device, lesson, mode, durationSec) {
    if (!gradingModal) return;

    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (gmMetaDevice) gmMetaDevice.textContent = (device && device.name) ? device.name : 'Thiết bị';
    if (gmMetaLesson) gmMetaLesson.textContent = (lesson && lesson.title) ? lesson.title : 'Bài học';
    if (gmMetaMode) gmMetaMode.textContent = mode === 'guide' ? '💡 Hướng dẫn' : '⚡ Thực hành';
    if (gmMetaTime) gmMetaTime.textContent = timeStr;

    if (gmScoreNum) gmScoreNum.textContent = res.score;

    if (res.passed) {
      if (gmScoreBadge) gmScoreBadge.classList.remove('failed');
      if (gmIcon) gmIcon.textContent = '🎉';
      if (gmTitle) gmTitle.textContent = 'KẾT QUẢ: ĐẠT YÊU CẦU';
      if (gmSubtitle) gmSubtitle.textContent = 'Chúc mừng bạn đã cấu hình chính xác bài thực hành!';
      if (gmStatusBox) gmStatusBox.className = 'gm-status-box';
      if (gmStatusTitle) gmStatusTitle.textContent = '✔ ĐẠT TOÀN BỘ TIÊU CHÍ (100%)';
      if (gmStatusDesc) gmStatusDesc.textContent = 'Cấu hình hoàn toàn trùng khớp với thông số kỹ thuật chuẩn của FPT Telecom.';
      // ĐẠT: hiện nút "Hoàn tất", ẩn nút "Quay lại làm từ đầu"
      if (btnModalClose) btnModalClose.style.display = '';
      if (btnModalRetry) btnModalRetry.style.display = 'none';
    } else {
      if (gmScoreBadge) gmScoreBadge.classList.add('failed');
      if (gmIcon) gmIcon.textContent = '⚠️';
      if (gmTitle) gmTitle.textContent = 'KẾT QUẢ: CHƯA ĐẠT';
      if (gmSubtitle) gmSubtitle.textContent = 'Một số thông số cấu hình chưa đúng với yêu cầu đề bài.';
      if (gmStatusBox) gmStatusBox.className = 'gm-status-box failed';
      if (gmStatusTitle) gmStatusTitle.textContent = `✖ CHƯA ĐẠT (${res.passedCount}/${res.totalRules} tiêu chí đúng)`;
      
      if (mode === 'guide') {
        if (gmStatusDesc) gmStatusDesc.textContent = 'Vui lòng kiểm tra lại các lỗi bên dưới, đóng bảng này và sửa lỗi.';
        if (btnModalRetry) {
          btnModalRetry.style.display = '';
          btnModalRetry.innerHTML = '<span>✖ Đóng & Sửa lỗi</span>';
        }
      } else {
        if (gmStatusDesc) gmStatusDesc.textContent = 'Vui lòng quay lại và thực hiện lại bài thực hành từ đầu.';
        if (btnModalRetry) {
          btnModalRetry.style.display = '';
          btnModalRetry.innerHTML = '<span>↩ Quay lại làm từ đầu</span>';
        }
      }
      if (btnModalClose) btnModalClose.style.display = 'none';
    }

    // Render danh sách checklist — chỉ hiện tiêu chí SAI, giữ header phân biệt phần
    if (gmChecklistBody) {
      gmChecklistBody.innerHTML = '';
      const checklistSection = gmChecklistBody.closest('table, .gm-checklist-wrap, section');

      // Lọc ra các tiêu chí thực sự (bỏ header) bị sai
      const failedRealItems = res.details.filter(item => !item._isHeader && !item.passed);

      if (failedRealItems.length === 0) {
        // Tất cả đúng: ẩn bảng
        if (checklistSection) checklistSection.style.display = 'none';
      } else {
        if (checklistSection) checklistSection.style.display = '';

        // Xác định section nào có lỗi (kể cả hint & item thực)
        const has24GFail = failedRealItems.some(i => i.id.startsWith('2.4G_') || i.id === '_24g_hint');
        const has5GFail  = failedRealItems.some(i => i.id.startsWith('5G_')   || i.id === '_5g_hint');

        res.details.forEach(item => {
          // Header row: chỉ vẽ nếu section đó có lỗi
          if (item._isHeader) {
            const shouldShow = (item.id === '_header_24g' && has24GFail) ||
                               (item.id === '_header_5g'  && has5GFail);
            if (!shouldShow) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td colspan="4" style="background:#1e293b;color:#94a3b8;font-weight:700;
                font-size:11px;letter-spacing:1px;padding:6px 10px;text-align:center;">
                ${item.name}
              </td>
            `;
            gmChecklistBody.appendChild(tr);
            return;
          }
          // Hint row (trang chưa mở): hiển thị dạng cảnh báo nổi bật
          if (item.id === '_24g_hint' || item.id === '_5g_hint') {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td colspan="4" style="background:#7c2d12;color:#fed7aa;font-size:12px;
                padding:6px 10px;font-style:italic;">
                ⚠ ${item.expected}
              </td>
            `;
            gmChecklistBody.appendChild(tr);
            return;
          }
          // Tiêu chí thường: chỉ vẽ nếu sai
          if (item.passed) return;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td><code class="gm-code-val">${item.expected}</code></td>
            <td><code class="gm-code-val" style="color:#b91c1c; font-weight:700;">${item.actual}</code></td>
            <td><span class="gm-badge-fail">✖ Sai</span></td>
          `;
          gmChecklistBody.appendChild(tr);
        });
      }
    }

    gradingModal.style.display = 'flex';
    gradingModal.setAttribute('aria-hidden', 'false');
  }

  function hideGradingModal() {
    if (gradingModal) {
      gradingModal.style.display = 'none';
      gradingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // ── Tracking API ─────────────────────────────────────────────────
  /**
   * Gửi thông tin phiên thực hành lên server qua POST /api/index.php/tracking/timer.
   * Được gọi DUY NHẤT 1 LẦN khi KTV bấm nút trên modal kết quả.
   * @param {object|null} evalResult - Kết quả chấm điểm
   * @param {number} durationSec - Thời gian làm bài (giây), lấy từ đồng hồ đã dừng
   */
  function sendTrackingTimer(evalResult, durationSec) {
    if (!_trackingSession) return; // Chưa có phiên nào được bắt đầu

    const session = _trackingSession;

    const finishedAt = new Date();

    // Lấy tên thiết bị từ device object (ưu tiên device.name, fallback device.id)
    const deviceName = (session.device && session.device.name) ? session.device.name : (session.device && session.device.id ? session.device.id : 'Unknown');

    // Lấy lab_id chính xác từ lesson.id (khớp với data.js)
    const labId = session.lesson && session.lesson.id ? session.lesson.id : (session.lesson && session.lesson.title ? session.lesson.title : 'Unknown');

    // Thông tin KTV — dùng từ user đã đăng nhập, fallback về anonymous
    const user = _currentUser || {
      technician_id: 'ANONYMOUS',
      name: 'Người dùng chưa đăng nhập',
      email: ''
    };

    const payload = {
      technician_id: user.technician_id,
      name: user.name,
      email: user.email || undefined,
      lab_id: labId,
      mode: session.mode,
      device: deviceName,
      started_at: session.startedAt,
      finished_at: finishedAt.toISOString(),
      duration_sec: durationSec || 0
    };

    if (evalResult) {
      payload.is_passed = evalResult.passed;
      payload.score = evalResult.score;
      payload.grading_details = evalResult.details;
    }

    // Loại bỏ các field undefined trước khi gửi
    Object.keys(payload).forEach(function (k) {
      if (payload[k] === undefined) delete payload[k];
    });

    fetch('/api/index.php/tracking/timer', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) {
            console.warn('[Tracking] API trả về lỗi:', err);
          });
        }
        return res.json().then(function (data) {
          console.info('[Tracking] Đã ghi phiên thực hành & chấm điểm:', data);
        });
      })
      .catch(function (err) {
        // Không hiển thị lỗi cho người dùng — portal vẫn hoạt động bình thường
        console.warn('[Tracking] Không thể gửi dữ liệu tracking:', err);
      });
  }

  // ── Practice Timer (Đồng hồ realtime trên toolbar) ──────────────
  /**
   * Bắt đầu đồng hồ đếm thời gian, cập nhật mỗi giây lên #practice-timer.
   */
  function startPracticeTimer() {
    // Dọn interval cũ nếu có
    if (_practiceTimerInterval) clearInterval(_practiceTimerInterval);

    _practiceStartTime = new Date();
    _lastSubmitDurationSec = 0;
    _lastEvalResult = null;

    // Cập nhật text ngay lập tức
    if (practiceTimer) {
      practiceTimer.textContent = '⏱ 00:00';
      practiceTimer.classList.remove('stopped');
      practiceTimer.classList.add('running');
    }

    _practiceTimerInterval = setInterval(function () {
      if (!_practiceStartTime) return;
      const elapsed = Math.floor((new Date() - _practiceStartTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      if (practiceTimer) {
        practiceTimer.textContent = '⏱ ' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      }

      // Tự động ngắt phiên nếu quá 60 phút (3600 giây)
      if (elapsed >= 3600) {
        alert("Đã hết thời gian thao tác (60 phút). Phiên làm việc sẽ tự động kết thúc và kết quả bị hủy bỏ.");
        backToLesson();
      }
    }, 1000);
  }

  /**
   * Dừng đồng hồ và trả về số giây đã chạy.
   * @returns {number} Số giây từ lúc bắt đầu đến lúc dừng
   */
  function stopPracticeTimer() {
    if (_practiceTimerInterval) {
      clearInterval(_practiceTimerInterval);
      _practiceTimerInterval = null;
    }

    let durationSec = 0;
    if (_practiceStartTime) {
      durationSec = Math.max(0, Math.floor((new Date() - _practiceStartTime) / 1000));
    }

    // Đổi style đồng hồ sang trạng thái "đã dừng"
    if (practiceTimer) {
      practiceTimer.classList.remove('running');
      practiceTimer.classList.add('stopped');
    }

    return durationSec;
  }

  /**
   * Reset đồng hồ về 00:00 và dọn interval.
   */
  function resetPracticeTimer() {
    if (_practiceTimerInterval) {
      clearInterval(_practiceTimerInterval);
      _practiceTimerInterval = null;
    }
    _practiceStartTime = null;

    if (practiceTimer) {
      practiceTimer.textContent = '⏱ 00:00';
      practiceTimer.classList.remove('running', 'stopped');
    }
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

  // ── Dashboard Button (admin only) ──────────────────────────────────
  document.getElementById('btn-dashboard').addEventListener('click', function () {
    window.location.href = '/dashboard-authen/';
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

        // Nếu frame này bị ẩn khỏi giao diện (chỉ rộng/cao 0px và parent display none), bỏ qua nó
        if (win.frameElement) {
          try {
            const rect = win.frameElement.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0 && win.frameElement.offsetParent === null) {
              return;
            }
          } catch(e) {}
        }

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
      try {
        if (!sel.includes(':contains(')) {
          const els = doc.querySelectorAll(sel);
          els.forEach(el => results.push(el));
          continue;
        }

        // Tách selector thành các phân đoạn bằng khoảng trắng
        const segments = sel.split(/\s+/).filter(Boolean);
        let currentContexts = [doc.body || doc];

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          const match = seg.match(/^(.*?):contains\(["']?(.*?)["']?\)$/);
          let baseSel = seg;
          let textToMatch = null;

          if (match) {
            baseSel = match[1] || '*';
            textToMatch = match[2].trim().toLowerCase();
          }

          const nextContexts = [];
          for (const ctx of currentContexts) {
            const elements = ctx.querySelectorAll(baseSel);
            elements.forEach(el => {
              if (textToMatch) {
                const txt = (el.textContent || el.innerText || '').trim().toLowerCase();
                if (txt.includes(textToMatch)) {
                  nextContexts.push(el);
                }
              } else {
                nextContexts.push(el);
              }
            });
          }
          currentContexts = nextContexts;
          if (currentContexts.length === 0) break;
        }

        currentContexts.forEach(el => {
          if (!results.includes(el)) {
            results.push(el);
          }
        });
      } catch (e) {
        console.error("Error in findGuideElements for selector:", sel, e);
      }
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

  // ── Hook cho Simulator Save ──────────────────────────────────────
  window.onSimulatorSave = function(simWin) {
    window._hasClickedSaveInGuide = true;

    if (_currentLesson && typeof _currentLesson.onSimSave === 'function') {
      try {
        _currentLesson.onSimSave(simWin);
      } catch(e) {}
    }

    // Đánh giá tức thì để mở nút Nộp bài ngay không cần chờ setInterval
    if (currentMode === 'guide' && btnSubmitLab && btnSubmitLab.disabled) {
      const device = DEVICES.find(d => d.id === currentDeviceId);
      const lesson = getCurrentLesson();
      if (device && lesson) {
        const evalResult = evaluateLesson(device, lesson);
        if (evalResult && evalResult.passed) {
          btnSubmitLab.disabled = false;
          btnSubmitLab.style.opacity = '1';
          btnSubmitLab.style.cursor = 'pointer';
        }
      }
    }
  };

  // ── Boot ─────────────────────────────────────────────────────────
  init();
})();
