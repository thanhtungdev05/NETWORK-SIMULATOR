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
  let _lastTrackingPayload = null; // Giữ nguyên payload/idempotency key khi retry lỗi mạng
  let _catalogDeviceIds = null;
  let _catalogLabIds = null;

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

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
  const gmMetaDevice = document.getElementById('gm-meta-device');
  const gmMetaLesson = document.getElementById('gm-meta-lesson');
  const gmMetaMode = document.getElementById('gm-meta-mode');
  const gmMetaTime = document.getElementById('gm-meta-time');
  const gmStatusBox = document.getElementById('gm-status-box');
  const gmStatusTitle = document.getElementById('gm-status-title');
  const gmStatusDesc = document.getElementById('gm-status-desc');
  const gmChecklistBody = document.getElementById('gm-checklist-body');
  const gmSaveStatus = document.getElementById('gm-save-status');

  // ── Multi-Device Topology DOM Refs ──────────────────────────────
  const topologyDeviceTabs = document.getElementById('topology-device-tabs');
  const deviceIframe2 = document.getElementById('device-iframe-2');
  const topologyCanvasPanel = document.getElementById('topology-canvas-panel');
  const topologyTerminalPanel = document.getElementById('topology-terminal-panel');
  const topolDev1Label = document.getElementById('topol-dev1-label');
  const topolDev2Label = document.getElementById('topol-dev2-label');
  const topolDev1Role = document.getElementById('topol-dev1-role');
  const topolDev2Role = document.getElementById('topol-dev2-role');
  const topolPingBadge = document.getElementById('topol-ping-badge');
  let currentTopologyTab = 'topology';

  // Track current iframe URL
  let currentIframeUrl = '';
  let trackingSaveInFlight = false;

  function normalizeDeviceId(id) {
    if (!id) return '';
    const clean = String(id).trim().replace(/^DEV_/i, '').toLowerCase();
    if (clean === 'ax3000cv2') return 'ax3000c';
    if (clean === 'topology' || clean === 'topology_labs') return 'topology_labs';
    return clean;
  }

  function normalizeLabId(id) {
    if (!id) return '';
    let clean = String(id).trim().toLowerCase();
    clean = clean.replace(/^lab_ax3000c_(\d+)/i, 'lab_ax3000cv2_$1');
    return clean;
  }

  function databaseDeviceToPortalId(device) {
    const rawId = typeof device === 'string' ? device : (device.device_id || device.id || '');
    return normalizeDeviceId(rawId);
  }

  function populateDeviceDropdown(devices) {
    deviceSelect.replaceChildren();
    devices.forEach(device => {
      const opt = document.createElement('option');
      opt.value = device.id;
      opt.textContent = device.name;
      deviceSelect.appendChild(opt);
    });
    deviceSelect.disabled = devices.length === 0;
  }

  function integrateCustomLabs() {
    return fetch('/api/index.php/labs', { credentials: 'include' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (json) {
        const items = (json && (json.items || json.data)) || [];
        if (!Array.isArray(items)) return;
        const customLabs = items.filter(function (l) { return l.is_custom && l.is_active; });
        customLabs.forEach(function (lab) {
          const normDev = normalizeDeviceId(lab.device_id);
          const device = DEVICES.find(function (d) { return normalizeDeviceId(d.id) === normDev; });
          if (!device) return;
          if (!device.categories || device.categories.length === 0) {
            device.categories = [{ title: 'HỌC TẬP', lessons: [] }];
          }
          const cat = device.categories[0];
          if (!cat.lessons) cat.lessons = [];

          const normLabId = normalizeLabId(lab.lab_id);
          const existingIdx = cat.lessons.findIndex(function (l) { return normalizeLabId(l.id) === normLabId; });

          const rawInstructions = Array.isArray(lab.instructions) ? lab.instructions : (lab.instructions ? [lab.instructions] : []);
          const formattedInstructions = rawInstructions.map(function (step) {
            return String(step).replace(/\n/g, '<br>');
          });

          const rawRules = Array.isArray(lab.grading_rules) ? lab.grading_rules : [];
          const formattedRules = rawRules.map(function (r, i) {
            return {
              id: r.id || ('rule_' + (i + 1)),
              name: r.name || ('Tiêu chí ' + (i + 1)),
              selector: r.selector,
              expected: r.expected,
              type: r.type || 'text_exact',
              trim: r.trim !== false,
              required: r.required !== false
            };
          });

          const lessonObj = {
            id: lab.lab_id,
            title: lab.title || lab.lab_name,
            subtitle: lab.subtitle || '',
            instructions: formattedInstructions,
            practiceUrl: lab.practice_url || device.loginUrl || '',
            clearFields: Array.isArray(lab.clear_fields) ? lab.clear_fields : [],
            grading: {
              description: lab.subtitle || lab.title || lab.lab_name,
              rules: formattedRules
            }
          };

          if (existingIdx >= 0) {
            cat.lessons[existingIdx] = lessonObj;
          } else {
            cat.lessons.push(lessonObj);
          }
        });
      })
      .catch(function (err) {
        console.warn('Không thể tải bài thực hành tùy biến:', err);
      });
  }

  function loadLearningCatalog() {
    return Promise.all([
      fetch('/api/index.php/learning/catalog', { credentials: 'include' })
        .then(function (response) {
          if (!response.ok) throw new Error('Không thể tải danh sách bài luyện tập.');
          return response.json();
        }),
      integrateCustomLabs()
    ])
      .then(function (results) {
        const data = results[0];
        const catalogDevices = Array.isArray(data.devices) ? data.devices : [];
        _catalogDeviceIds = new Set(catalogDevices.map(databaseDeviceToPortalId));
        _catalogLabIds = new Set(catalogDevices.flatMap(function (device) {
          return Array.isArray(device.labs) ? device.labs.map(function (lab) { return normalizeLabId(lab.lab_id); }) : [];
        }));
        const visibleDevices = DEVICES.filter(function (device) {
          return device.isTopology || !_catalogDeviceIds || _catalogDeviceIds.has(normalizeDeviceId(device.id));
        });
        populateDeviceDropdown(visibleDevices);
        const urlParams = new URLSearchParams(window.location.search);
        const reqDevice = urlParams.get('device');
        const reqLab = urlParams.get('lab');
        const reqMode = urlParams.get('mode');
        let initialDev = null;
        if (reqDevice) {
          const normReq = normalizeDeviceId(reqDevice);
          initialDev = visibleDevices.find(function (d) {
            return normalizeDeviceId(d.id) === normReq;
          });
        }
        if (!initialDev && visibleDevices.length > 0) {
          initialDev = visibleDevices[0];
        }
        if (initialDev) {
          selectDevice(initialDev.id, reqLab, reqMode);
        } else {
          currentDeviceId = null;
          navList.innerHTML = '<div class="empty-state"><p>Chưa có thiết bị luyện tập đang hoạt động.</p></div>';
          showHero();
          setBreadcrumb(['Chưa có bài luyện tập']);
        }
      });
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    const loadingOption = document.createElement('option');
    loadingOption.textContent = 'Đang tải bài luyện tập...';
    deviceSelect.replaceChildren(loadingOption);
    deviceSelect.disabled = true;

    // Bind events
    deviceSelect.addEventListener('change', () => selectDevice(deviceSelect.value));
    btnCollapse.addEventListener('click', toggleSidebar);

    // Practice screen events
    if (btnBackLesson) btnBackLesson.addEventListener('click', backToLesson);
    if (btnOpenNewTab) btnOpenNewTab.addEventListener('click', () => {
      if (currentIframeUrl) window.open(currentIframeUrl, '_blank', 'noopener');
    });
    if (btnSubmitLab) btnSubmitLab.addEventListener('click', submitLab);
    const btnGuideErrors = document.getElementById('btn-guide-errors');
    if (btnGuideErrors) {
      btnGuideErrors.addEventListener('click', () => {
        const device = DEVICES.find(d => d.id === currentDeviceId);
        const lesson = getCurrentLesson();
        if (device && lesson) {
          const evalResult = evaluateLesson(device, lesson);

          // Lấy thời gian thực để hiển thị trên bảng báo lỗi
          let elapsed = 0;
          if (typeof _practiceStartTime !== 'undefined' && _practiceStartTime) {
            elapsed = Math.floor((new Date() - _practiceStartTime) / 1000);
          }

          // Show modal but don't record to DB (since it's Guide mode preview)
          showGradingModal(evalResult, device, lesson, currentMode, elapsed);
        }
      });
    }

    // ── Multi-Device Topology Tabs & Navigation ────────────────────────
    if (topologyDeviceTabs) {
      topologyDeviceTabs.querySelectorAll('.topol-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.topolTab;
          if (tab) switchTopologyTab(tab);
        });
      });
    }

    const btnTopolRefresh = document.getElementById('btn-topol-refresh-state');
    if (btnTopolRefresh) {
      btnTopolRefresh.addEventListener('click', () => {
        updateTopologyLiveState();
      });
    }

    const btnGotoDev1 = document.getElementById('btn-goto-dev1');
    if (btnGotoDev1) {
      btnGotoDev1.addEventListener('click', () => switchTopologyTab('device1'));
    }

    const btnGotoDev2 = document.getElementById('btn-goto-dev2');
    if (btnGotoDev2) {
      btnGotoDev2.addEventListener('click', () => switchTopologyTab('device2'));
    }

    const btnGotoTerm = document.getElementById('btn-goto-terminal');
    if (btnGotoTerm) {
      btnGotoTerm.addEventListener('click', () => switchTopologyTab('terminal'));
    }

    if (deviceIframe2) {
      deviceIframe2.addEventListener('load', () => {
        iframeLoading.classList.add('hidden');
      });
    }

    initTopologyTerminal();

    // ── Grading Modal Events ──────────────────────────────────────────

    // 1. Click backdrop (viền đen ngoài bảng điểm)
    if (gradingBackdrop) gradingBackdrop.addEventListener('click', () => {
      if (trackingSaveInFlight) return;
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
      // Nhận tín hiệu Save thành công từ simulator AX3000H v2 (qua postMessage cross-origin)
      if (event.data && event.data.type === 'FTC_SAVE_SUCCESS') {
        // Delay nhỏ để frame đã load xong và đặt document._ftcIsSaved = true trước khi đọc
        setTimeout(function () {
          try {
            const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
            let savedWin = null;
            for (const doc of allDocs) {
              if (doc._ftcIsSaved) {
                savedWin = doc.defaultView || doc.parentWindow;
                break;
              }
            }
            // Nếu không tìm thấy frame cụ thể, dùng contentWindow của iframe
            if (!savedWin) savedWin = deviceIframe.contentWindow;
            if (typeof window.onSimulatorSave === 'function') {
              window.onSimulatorSave(savedWin);
            }
          } catch (e) { }
        }, 300);
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
            }

          // Theo dõi sự kiện click vào nút Save/Apply trong iframe (chạy cho cả Hướng dẫn và Thực hành)
          try {
            const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
            allDocs.forEach(doc => {
              // Liên tục Tắt gợi ý mật khẩu/tự động điền (Autocomplete/Saved Info) bằng phương pháp mạnh (readonly hack)
              try {
                doc.querySelectorAll('form:not([data-autofill-disabled]), input:not([data-autofill-disabled])').forEach(el => {
                  el.setAttribute('data-autofill-disabled', 'true');
                  el.setAttribute('autocomplete', 'off'); // Chuẩn chung
                  el.setAttribute('data-lpignore', 'true'); // Chặn LastPass
                  el.setAttribute('data-form-type', 'other');

                  if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'password' || el.type === 'number')) {
                    // Bỏ qua các ô vốn dĩ đã bị khóa (readonly / disabled) từ mã HTML gốc
                    if (el.hasAttribute('readonly') || el.hasAttribute('disabled')) {
                      return;
                    }

                    // Cài cắm cạm bẫy readonly: Edge/Chrome sẽ không hiện popup Saved Info trên ô readonly.
                    // Khi người dùng thực sự bấm vào hoặc tab vào, ta mới gỡ readonly ra.
                    el.setAttribute('readonly', 'readonly');

                    const removeReadonly = function () {
                      if (el.hasAttribute('readonly')) {
                        el.removeAttribute('readonly');
                      }
                    };

                    el.addEventListener('focus', removeReadonly);
                    el.addEventListener('click', removeReadonly);
                    el.addEventListener('mousedown', removeReadonly);

                    // Khôi phục readonly khi rời chuột/focus để đảm bảo chặn triệt để
                    el.addEventListener('blur', function () {
                      if (el.value === '') {
                        el.setAttribute('readonly', 'readonly');
                      }
                    });
                  }
                });
              } catch (e) { }

              if (!doc._ftcSaveListenerAttached) {

                // Ràng buộc đăng nhập thiết bị bắt buộc nhập admin / admin
                const loc = (doc.location && doc.location.href) ? doc.location.href.toLowerCase() : '';
                const hsh = (doc.location && doc.location.hash) ? doc.location.hash.toLowerCase() : '';
                const isMainPage = hsh.includes('#/home') || hsh.includes('#/network') || hsh.includes('#/system') || hsh.includes('#/status') || hsh.includes('#/device');
                const isLogin = !isMainPage && (loc.includes('login') || hsh.includes('login') || doc.querySelector('.login-fpt, form[action*="login"]'));

                if (isLogin) {
                  const checkLoginFields = function (e, triggerEl) {
                    // Cố gắng tìm các ô nhập liệu user/pass trên trang (lấy mọi input không bị ẩn)
                    const inputs = Array.from(doc.querySelectorAll('input')).filter(i => i.type !== 'hidden' && i.style.display !== 'none' && !i.disabled);
                    let isOk = false;

                    let hasAdminPass = false;
                    let hasAdminUser = false;
                    let hasPasswordType = false;

                    inputs.forEach(i => {
                      if (i.type === 'password') {
                        hasPasswordType = true;
                        if (i.value.trim() === 'admin') hasAdminPass = true;
                      } else if (i.tagName === 'INPUT' && (i.type === 'text' || !i.type)) {
                        if (i.value.trim() === 'admin') hasAdminUser = true;
                      }
                    });

                    // Xác định hợp lệ:
                    if (hasPasswordType) {
                      if (inputs.length > 1) {
                        if (hasAdminPass && hasAdminUser) isOk = true;
                      } else {
                        if (hasAdminPass) isOk = true;
                      }
                    } else {
                      if (inputs.length >= 2 && inputs[0].value.trim() === 'admin' && inputs[1].value.trim() === 'admin') {
                        isOk = true;
                      } else if (inputs.length === 1 && inputs[0].value.trim() === 'admin') {
                        isOk = true;
                      }
                    }

                    if (!isOk && inputs.length > 0) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                      alert("Tên đăng nhập hoặc mật khẩu không chính xác! (Gợi ý: admin / admin)");
                      return false;
                    }
                    return true;
                  };

                  doc.addEventListener('click', function (e) {
                    let el = e.target;
                    // Bỏ qua nếu click vào các ô nhập liệu văn bản/mật khẩu
                    if (el && el.tagName === 'INPUT' && el.type !== 'submit' && el.type !== 'button') {
                      return;
                    }

                    while (el && el !== doc && el !== doc.body) {
                      // Dừng nếu duyệt lên tới form/table/container lớn
                      if (el.tagName === 'FORM' || el.tagName === 'TABLE' || el.tagName === 'BODY' || el.tagName === 'HTML') {
                        break;
                      }

                      const txt = (el.value || el.textContent || el.innerText || '').toLowerCase().trim();
                      const cls = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
                      const id = (el.id || '').toLowerCase();
                      const isSubmitInput = el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button') &&
                        (txt.includes('login') || txt.includes('log in') || txt.includes('đăng nhập') || id.includes('login') || cls.includes('login') || cls.includes('submit'));
                      const isButton = (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN') &&
                        (txt.includes('login') || txt.includes('log in') || txt.includes('đăng nhập') || id.includes('login') || cls.includes('login') || cls.includes('btn-primary') || cls.includes('submit'));

                      if (isSubmitInput || isButton) {
                        if (!checkLoginFields(e, el)) return false;
                        break;
                      }
                      el = el.parentNode;
                    }
                  }, true);

                  doc.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                      if (!checkLoginFields(e, e.target)) return false;
                    }
                  }, true);
                }

                // Sự kiện click nút Save/Apply
                doc.addEventListener('click', function (e) {
                  let el = e.target;
                  while (el && el !== doc) {
                    if ((el.tagName === 'INPUT' || el.tagName === 'BUTTON') && 
                        (el.type === 'submit' || (el.value || el.textContent || '').toLowerCase().includes('save') || (el.value || el.textContent || '').toLowerCase().includes('apply') || el.name === 'AddBtn' || (currentLessonId === 'ONT_be6500c-bai6' && (el.value || el.textContent || '').trim().toLowerCase() === 'add'))) {
                      window._hasClickedSaveInGuide = true;
                      if (currentDeviceId === 'ax3000s') {
                        doc._ftcIsSaved = true;
                        try { if (typeof window.onSimulatorSave === 'function') window.onSimulatorSave(doc.defaultView || doc.parentWindow); } catch(ex) { console.warn('[FTC] onSimulatorSave error:', ex); }
                      }
                    }
                    el = el.parentNode;
                  }
                }, true);

                // Đánh dấu người dùng đã chạm vào ô nhập liệu để tránh bị clear tự động
                // Đồng thời hủy bỏ trạng thái "Đã Save" nếu người dùng sửa lại dữ liệu
                doc.addEventListener('input', function (e) {
                  if (e.target) {
                    e.target._ftcUserModified = true;
                  }
                  window._hasClickedSaveInGuide = false;
                  if (currentDeviceId === 'ax3000s') {
                    doc._ftcIsSaved = false;
                  }
                }, true);
                doc.addEventListener('change', function (e) {
                  if (e.target) {
                    e.target._ftcUserModified = true;
                  }
                  window._hasClickedSaveInGuide = false;
                  if (currentDeviceId === 'ax3000s') {
                    doc._ftcIsSaved = false;
                  }
                }, true);

                // === BẮT LỖI TƯƠNG TÁC CHÍNH XÁC TUYỆT ĐỐI (Dành riêng cho SPAs) ===
                if (!doc._ftcOriginalValues) doc._ftcOriginalValues = {};

                const captureBeforeEdit = function (e) {
                  if (!e.isTrusted) return; // Chỉ bắt người dùng thật
                  let el = e.target;
                  // Nếu click vào thẻ label bọc input, lấy input bên trong
                  if (el.tagName === 'LABEL') {
                    const input = el.querySelector('input, select, textarea');
                    if (input) el = input;
                  }
                  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                    if (!el.dataset.ftcId) el.dataset.ftcId = 'ftc_' + Math.random().toString(36).substr(2, 9);
                    const uid = el.dataset.ftcId;
                    // Lưu lại giá trị của field NGAY TRƯỚC KHI người dùng kịp thay đổi nó
                    if (doc._ftcOriginalValues[uid] === undefined) {
                      doc._ftcOriginalValues[uid] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
                    }
                  }
                };

                // Mousedown và Focusin kích hoạt ngay trước khi giá trị kịp thay đổi
                doc.addEventListener('mousedown', captureBeforeEdit, true);
                doc.addEventListener('focusin', captureBeforeEdit, true);
                // =================================================================

                doc._ftcSaveListenerAttached = true;
              }
            });
          } catch (e) { }

          if (currentMode === 'guide') {
            applyGuidePopups();

            // Tự động kiểm tra hoàn thành để mở nút Nộp bài trong chế độ Hướng dẫn
            const device = DEVICES.find(d => d.id === currentDeviceId);
            const lesson = getCurrentLesson();
            if (device && lesson) {
              const evalResult = evaluateLesson(device, lesson);
              // === GUIDE MODE: AUTO-BASELINE UI ===
              let btnGuideErrors = document.getElementById('btn-guide-errors');
              if (btnGuideErrors) {
                if (currentMode === 'guide' && evalResult) {
                  const unexpectedError = evalResult.details.find(d => d.id.startsWith('unexpected_change'));
                  const hasMissingSteps = !evalResult.passed;

                  if (unexpectedError || hasMissingSteps) {
                    btnGuideErrors.style.display = 'flex';

                    // Ẩn xám nút nếu học viên chưa bấm Save
                    if (!window._hasClickedSaveInGuide) {
                      btnGuideErrors.disabled = true;
                      btnGuideErrors.style.opacity = '0.5';
                      btnGuideErrors.style.cursor = 'not-allowed';
                      btnGuideErrors.style.background = '#f3f4f6';
                      btnGuideErrors.style.color = '#9ca3af';
                      btnGuideErrors.style.borderColor = '#d1d5db';
                    } else {
                      btnGuideErrors.disabled = false;
                      btnGuideErrors.style.opacity = '1';
                      btnGuideErrors.style.cursor = 'pointer';
                      btnGuideErrors.style.background = '#fee2e2';
                      btnGuideErrors.style.color = '#ef4444';
                      btnGuideErrors.style.borderColor = '#fca5a5';
                    }
                  } else {
                    btnGuideErrors.style.display = 'none';
                  }
                } else {
                  btnGuideErrors.style.display = 'none';
                }
              }
              // ====================================

              if (btnSubmitLab && btnSubmitLab.disabled) {
                if (evalResult && evalResult.passed) {
                  // Chỉ bật nút nếu Đã bấm Save
                  if (window._hasClickedSaveInGuide) {
                    btnSubmitLab.disabled = false;
                    btnSubmitLab.style.opacity = '1';
                    btnSubmitLab.style.cursor = 'pointer';
                  }
                }
              } else if (btnSubmitLab && !btnSubmitLab.disabled) {
                // Tự động tắt nút nếu học viên lỡ tay làm sai sau khi đã làm đúng hoặc chưa save lại
                if (evalResult && (!evalResult.passed || !window._hasClickedSaveInGuide)) {
                  btnSubmitLab.disabled = true;
                  btnSubmitLab.style.opacity = '0.5';
                  btnSubmitLab.style.cursor = 'not-allowed';
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
      if (statusText) statusText.textContent = 'System Ready';
    }, 1200);

    // Tải thông tin người dùng hiện tại từ API để dùng cho Tracking
    fetchCurrentUser();
  }

  function redirectToLogin() {
    window.location.replace('/login/index.html');
  }

  function renderUserProfile() {
    const section = document.getElementById('user-profile-section');
    if (!section) return;

    if (_currentUser) {
      const initials = (_currentUser.name || 'K').substring(0, 2).toUpperCase();
      const roleLabel = _currentUser.role_name
        || ({ KTV: 'Kỹ thuật viên', ADMIN: 'Quản trị viên', DEV: 'Nhà phát triển' }[_currentUser.role])
        || _currentUser.job_title
        || 'Kỹ thuật viên';
      const role = String(_currentUser.role || 'KTV').toUpperCase();
      const isStaff = Boolean(_currentUser.is_admin || ['GIANGVIEN', 'ADMIN', 'DEV'].includes(role));
      const dashboardBtnLabel = role === 'GIANGVIEN' ? 'Dashboard Giảng Viên' : 'Quản Lý Đào Tạo';
      const dashboardBtnHtml = isStaff ? `
        <a href="/dashboard/" class="btn-auth btn-sidebar-dashboard" title="Đến Dashboard Quản Lý Đào Tạo & Soạn bài lab">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M4 13h6V4H4v9zm0 7h6v-4H4v4zm10 0h6v-9h-6v9zm0-16v4h6V4h-6z"/>
          </svg>
          <span>${dashboardBtnLabel}</span>
        </a>
      ` : '';

      section.innerHTML = `
        <div class="auth-container">
          <div class="auth-user-info">
            <div class="auth-avatar">${initials}</div>
            <div class="auth-details">
              <span class="auth-name" title="${escapeHTML(_currentUser.name)}">${escapeHTML(_currentUser.name)}</span>
              <span class="auth-role" title="${escapeHTML(roleLabel)}">${escapeHTML(roleLabel)}</span>
            </div>
          </div>
          ${dashboardBtnHtml}
          <button class="btn-auth btn-logout" id="btn-iam-logout" title="Đăng xuất">Đăng xuất</button>
        </div>
      `;
      const btnIamLogout = document.getElementById('btn-iam-logout');
      if (btnIamLogout) {
        btnIamLogout.addEventListener('click', function () {
          fetch('/api/index.php/auth/logout', { method: 'POST', credentials: 'include' })
            .then(function () {
              window.location.href = '/login/index.html';
            });
        });
      }
    } else {
      section.innerHTML = `
        <div class="auth-container">
          <button class="btn-auth btn-login" id="btn-iam-login">Đăng nhập</button>
        </div>
      `;
      const btnIamLogin = document.getElementById('btn-iam-login');
      if (btnIamLogin) {
        btnIamLogin.addEventListener('click', function () {
          redirectToLogin();
        });
      }
    }
  }

  // ── Fetch Current User (for Tracking) ───────────────────────────
  /**
   * Lấy thông tin user đang đăng nhập từ API auth/session.
   * Kết quả được cache vào _currentUser để dùng khi gửi Tracking API.
   * Nếu chưa đăng nhập, tự động chuyển hướng về trang login.
   */
  function fetchCurrentUser() {
    fetch('/api/index.php/auth/session', { credentials: 'include' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        const u = data && data.user;
        if (u) {
          _currentUser = {
            technician_id: u.user_id || u.id || 'UNKNOWN',
            employee_id: u.employee_id || u.employeeId || '',
            name: u.displayName || u.display_name || u.email || 'KTV',
            email: u.email || '',
            role: String(u.role || 'KTV').toUpperCase(),
            role_name: u.roleName || u.role_name || '',
            is_admin: Boolean(u.isAdmin ?? u.is_admin ?? u.permissions?.admin),
            can_export_reports: Boolean(u.canExportReports ?? u.can_export_reports ?? u.permissions?.exportReports),
            job_title: u.job_title || u.jobTitle || ''
          };
          renderUserProfile();
          const role = String(_currentUser.role || 'KTV').toUpperCase();
          const isStaff = Boolean(_currentUser.is_admin || ['GIANGVIEN', 'ADMIN', 'DEV'].includes(role));
          if (_currentUser && isStaff) {
            const btnDashboard = document.getElementById('btn-dashboard');
            if (btnDashboard) {
              btnDashboard.style.display = 'inline-flex';
              const btnText = document.getElementById('btn-dashboard-text');
              if (btnText) {
                btnText.textContent = role === 'GIANGVIEN' ? 'Dashboard Giảng Viên' : 'Quản Lý Đào Tạo';
              }
              btnDashboard.href = '/dashboard/';
            }
          }
          loadLearningCatalog().catch(function (error) {
            console.warn('[Catalog] Không thể tải danh sách bài luyện tập, chuyển sang chế độ offline:', error);
            _catalogDeviceIds = null;
            _catalogLabIds = null;
            populateDeviceDropdown(DEVICES);
            const urlParams = new URLSearchParams(window.location.search);
            const reqDevice = urlParams.get('device');
            const reqLab = urlParams.get('lab');
            const reqMode = urlParams.get('mode');
            let initialDev = null;
            if (reqDevice) {
              const normReq = normalizeDeviceId(reqDevice);
              initialDev = DEVICES.find(function (d) {
                return normalizeDeviceId(d.id) === normReq;
              });
            }
            if (!initialDev && DEVICES.length > 0) {
              initialDev = DEVICES[0];
            }
            if (initialDev) {
              selectDevice(initialDev.id, reqLab, reqMode);
            } else {
              navList.innerHTML = '<div class="empty-state"><p>Không thể tải danh sách bài luyện tập.</p></div>';
            }
          });
        } else {
          _currentUser = null;
          renderUserProfile();
          redirectToLogin();
        }
      })
      .catch(function () {
        console.warn('[Tracking] Không thể lấy thông tin user từ API.');
        redirectToLogin();
      });
  }

  // ── Device Selection ─────────────────────────────────────────────
  function selectDevice(deviceId, targetLabId = null, autoMode = null) {
    const normDevId = normalizeDeviceId(deviceId);
    if (_catalogDeviceIds && !_catalogDeviceIds.has(normDevId)) return;

    const device = DEVICES.find(d => normalizeDeviceId(d.id) === normDevId);
    if (!device) return;

    currentDeviceId = device.id;
    currentLessonId = null;

    // Sync dropdown
    deviceSelect.value = device.id;

    // Render nav list
    renderNavList(device);

    // Automatically select requested or first lesson if available
    const allAllowedLessons = (device.categories?.flatMap(category => category.lessons || []) || [])
      .filter(lesson => {
        if (device.isTopology || (lesson && lesson.isTopology)) return true;
        if (!_catalogLabIds) return true;
        const normLab = normalizeLabId(lesson.id);
        return _catalogLabIds.has(normLab);
      });

    let chosenLesson = null;
    if (targetLabId) {
      const normTarget = normalizeLabId(targetLabId);
      chosenLesson = allAllowedLessons.find(l => {
        const lid = normalizeLabId(l.id);
        return lid === normTarget
          || lid.replace(/^lab_/i, '') === normTarget.replace(/^lab_/i, '')
          || lid.endsWith(normTarget)
          || normTarget.endsWith(lid);
      });
    }
    if (!chosenLesson && allAllowedLessons.length > 0) {
      chosenLesson = allAllowedLessons[0];
    }
    if (chosenLesson) {
      const lessonItem = navList.querySelector(`[data-lesson-id="${chosenLesson.id}"]`) || navList.querySelector('.nav-item');
      selectLesson(device, chosenLesson, lessonItem);
      if (lessonItem && typeof lessonItem.scrollIntoView === 'function') {
        lessonItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (autoMode === 'practice' && btnPrac) {
        setTimeout(() => btnPrac.click(), 100);
      } else if (autoMode === 'guide' && btnGuide) {
        setTimeout(() => btnGuide.click(), 100);
      }
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
      const lessons = (cat.lessons || []).filter(lesson => {
        if (device.isTopology || (lesson && lesson.isTopology)) return true;
        if (!_catalogLabIds) return true;
        const normLab = normalizeLabId(lesson.id);
        return _catalogLabIds.has(normLab);
      });
      if (!lessons.length) return;
      // Category title
      const catTitle = document.createElement('div');
      catTitle.className = 'nav-category-title';
      catTitle.textContent = cat.title;
      navList.appendChild(catTitle);

      // Lessons
      lessons.forEach((lesson, idx) => {
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
      if (!_currentUser) {
        redirectToLogin();
        return;
      }
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
      if (!_currentUser) {
        redirectToLogin();
        return;
      }
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

  // ══════════════════════════════════════════════════════════════════
  // MULTI-DEVICE TOPOLOGY ENGINE
  // ══════════════════════════════════════════════════════════════════

  function switchTopologyTab(tabName) {
    currentTopologyTab = tabName;
    if (!topologyDeviceTabs) return;

    // Cập nhật trạng thái active của các nút tab
    const tabButtons = topologyDeviceTabs.querySelectorAll('.topol-tab-btn');
    tabButtons.forEach(btn => {
      if (btn.dataset.topolTab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Ẩn tất cả các view/iframe
    if (deviceIframe) deviceIframe.style.display = 'none';
    if (deviceIframe2) deviceIframe2.style.display = 'none';
    if (topologyCanvasPanel) topologyCanvasPanel.style.display = 'none';
    if (topologyTerminalPanel) topologyTerminalPanel.style.display = 'none';

    if (tabName === 'topology') {
      if (topologyCanvasPanel) {
        topologyCanvasPanel.style.display = 'flex';
        updateTopologyLiveState();
      }
    } else if (tabName === 'device1') {
      if (deviceIframe) {
        deviceIframe.style.display = 'block';
      }
    } else if (tabName === 'device2') {
      if (deviceIframe2) {
        deviceIframe2.style.display = 'block';
      }
    } else if (tabName === 'terminal') {
      if (topologyTerminalPanel) {
        topologyTerminalPanel.style.display = 'flex';
        const termInput = document.getElementById('terminal-input');
        if (termInput) setTimeout(() => termInput.focus(), 100);
      }
    }
  }

  function inspectTopologyState() {
    const docs1 = deviceIframe ? getAllAccessibleDocuments(deviceIframe.contentWindow) : [];
    const docs2 = deviceIframe2 ? getAllAccessibleDocuments(deviceIframe2.contentWindow) : [];

    let ontWanMode = '';
    let ont8021q = '';
    let ontVlan = '';
    let isOntDhcpDisabled = false;

    // Inspect ONT
    for (const doc of docs1) {
      try {
        const selWan = doc.querySelector('select[name="wanTypeRadio"]') || doc.querySelector('input[name="wanTypeRadio"]:checked');
        if (selWan && selWan.value) ontWanMode = selWan.value;

        const sel8021q = doc.querySelector('select[name="wan_dot1q"]') || doc.querySelector('input[name="wan_dot1q"]:checked');
        if (sel8021q && sel8021q.value) ont8021q = sel8021q.value;

        const inpVlan = doc.querySelector('input[name="wan_vid"]');
        if (inpVlan && inpVlan.value) ontVlan = inpVlan.value.trim();

        const rdoDhcp = doc.querySelector('input[name="dhcpTypeRadio"]:checked');
        if (rdoDhcp) {
          isOntDhcpDisabled = (rdoDhcp.value === '0' || rdoDhcp.value === 'Disable');
        }
      } catch (e) {}
    }

    // Inspect Router
    let routerPppoeMode = false;
    let routerPppoeUser = '';
    let routerLanIp = '192.168.10.1'; // Target

    for (const doc of docs2) {
      try {
        const selAcc = doc.querySelector('select[name="iAccessMode0"]') || doc.querySelector('select[name="iAccessMode"]');
        if (selAcc && (selAcc.value === '1' || selAcc.value === 'pppoe')) {
          routerPppoeMode = true;
        }
        const inpUser = doc.querySelector('input[name="sPppUserName"], input[name="sUserName"], input[name="sAccount"]');
        if (inpUser && inpUser.value) {
          routerPppoeUser = inpUser.value.trim();
        }
        const inpIp = doc.querySelector('input[name="sLanIp"], input[name="sIp"], input[name="iLanIp"]');
        if (inpIp && inpIp.value) {
          routerLanIp = inpIp.value.trim();
        }
      } catch (e) {}
    }

    const isOntBridge = (ontWanMode === '3' || ontWanMode.toLowerCase() === 'bridge');
    const isVlanCorrect = (ontVlan === '2502');
    const isVlanTagged = (ont8021q === 'Yes' || ont8021q === '1' || ont8021q === 'Tag');
    const isRouterPppoe = routerPppoeMode || (routerPppoeUser === 'sgfdl-210208-218');
    const hasIpConflict = (routerLanIp === '192.168.1.1');
    const isNetworkOnline = isOntBridge && isVlanTagged && isVlanCorrect && isRouterPppoe && !hasIpConflict;

    return {
      isOntBridge,
      ontVlan: ontVlan || '2502',
      isVlanTagged,
      isOntDhcpDisabled,
      isRouterPppoe,
      routerPppoeUser: routerPppoeUser || 'sgfdl-210208-218',
      routerLanIp: routerLanIp || '192.168.10.1',
      hasIpConflict,
      isNetworkOnline
    };
  }

  function updateTopologyLiveState() {
    const state = inspectTopologyState();

    // Node 1 badges
    const nodeDev1Pill = document.getElementById('node-dev1-state-pill');
    const nodeDev1Vlan = document.getElementById('node-dev1-vlan');
    const nodeDev1Dhcp = document.getElementById('node-dev1-dhcp');
    if (nodeDev1Pill) {
      if (state.isOntBridge) {
        nodeDev1Pill.textContent = 'Bridge Mode (OK)';
        nodeDev1Pill.style.background = 'rgba(16, 185, 129, 0.2)';
        nodeDev1Pill.style.color = '#10b981';
      } else {
        nodeDev1Pill.textContent = 'Route Mode (Chưa cấu hình)';
        nodeDev1Pill.style.background = 'rgba(239, 68, 68, 0.2)';
        nodeDev1Pill.style.color = '#ef4444';
      }
    }
    if (nodeDev1Vlan) nodeDev1Vlan.textContent = state.ontVlan ? `${state.ontVlan} (Internet FPT)` : '2502';
    if (nodeDev1Dhcp) {
      nodeDev1Dhcp.textContent = state.isOntDhcpDisabled ? 'Disabled (Đã tắt)' : 'Enabled (Chưa tắt)';
      nodeDev1Dhcp.style.color = state.isOntDhcpDisabled ? '#10b981' : '#f59e0b';
    }

    // Node 2 badges
    const nodeDev2Pill = document.getElementById('node-dev2-state-pill');
    const nodeDev2Ip = document.getElementById('node-dev2-ip');
    const nodeDev2Pppoe = document.getElementById('node-dev2-pppoe');
    if (nodeDev2Pill) {
      if (state.isRouterPppoe) {
        nodeDev2Pill.textContent = 'PPPoE Dialed (Up)';
        nodeDev2Pill.style.background = 'rgba(16, 185, 129, 0.2)';
        nodeDev2Pill.style.color = '#10b981';
      } else {
        nodeDev2Pill.textContent = 'PPPoE Chưa kết nối';
        nodeDev2Pill.style.background = 'rgba(245, 158, 11, 0.2)';
        nodeDev2Pill.style.color = '#f59e0b';
      }
    }
    if (nodeDev2Ip) {
      nodeDev2Ip.textContent = state.routerLanIp;
      if (state.hasIpConflict) {
        nodeDev2Ip.style.color = '#ef4444';
        nodeDev2Ip.title = 'XUNG ĐỘT: Trùng IP với ONT (192.168.1.1)!';
      } else {
        nodeDev2Ip.style.color = '#38bdf8';
        nodeDev2Ip.title = 'IP Subnet sạch, không xung đột';
      }
    }
    if (nodeDev2Pppoe) nodeDev2Pppoe.textContent = state.routerPppoeUser;

    // Client PC badges
    const nodeClientIp = document.getElementById('node-client-ip');
    const nodeClientGw = document.getElementById('node-client-gw');
    if (nodeClientGw) nodeClientGw.textContent = state.routerLanIp;
    if (nodeClientIp) {
      const parts = state.routerLanIp.split('.');
      if (parts.length === 4) {
        nodeClientIp.textContent = `${parts[0]}.${parts[1]}.${parts[2]}.150`;
      }
    }

    // Diagnostics Matrix
    const diagBridgeStatus = document.getElementById('diag-bridge-status');
    const diagPppoeStatus = document.getElementById('diag-pppoe-status');
    const diagConflictStatus = document.getElementById('diag-conflict-status');

    if (diagBridgeStatus) {
      diagBridgeStatus.className = state.isOntBridge ? 'diag-status success' : 'diag-status warning';
      diagBridgeStatus.textContent = state.isOntBridge ? '✓ BRIDGE OK' : 'CHƯA CHUYỂN';
    }
    if (diagPppoeStatus) {
      diagPppoeStatus.className = state.isRouterPppoe ? 'diag-status success' : 'diag-status warning';
      diagPppoeStatus.textContent = state.isRouterPppoe ? '✓ QUAY SỐ OK' : 'CHƯA KẾT NỐI';
    }
    if (diagConflictStatus) {
      diagConflictStatus.className = state.hasIpConflict ? 'diag-status danger' : 'diag-status success';
      diagConflictStatus.textContent = state.hasIpConflict ? '⚠ XUNG ĐỘT IP' : '✓ AN TOÀN';
    }

    // Ping Badge on Tab
    if (topolPingBadge) {
      if (state.isNetworkOnline) {
        topolPingBadge.textContent = 'Ping: 12ms (Online)';
        topolPingBadge.style.background = '#065f46';
        topolPingBadge.style.color = '#34d399';
      } else if (state.hasIpConflict) {
        topolPingBadge.textContent = 'Ping: Xung đột IP';
        topolPingBadge.style.background = '#991b1b';
        topolPingBadge.style.color = '#fecaca';
      } else {
        topolPingBadge.textContent = 'Ping: Mất kết nối';
        topolPingBadge.style.background = '#854d0e';
        topolPingBadge.style.color = '#fef08a';
      }
    }
  }

  // Virtual Client CLI Terminal Logic
  function initTopologyTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const btnTermClear = document.getElementById('btn-term-clear');
    const quickButtons = document.querySelectorAll('.btn-term-quick[data-cmd]');

    if (!termInput || !termOutput) return;

    function appendOutput(text, type = '') {
      const entry = document.createElement('div');
      entry.className = `term-output-entry ${type}`;
      entry.textContent = text;
      termOutput.appendChild(entry);
      const termBody = document.getElementById('terminal-body');
      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }

    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim();
      if (!cmd) return;

      appendOutput(`C:\\Users\\KTV_FPT> ${cmd}`, 'term-cmd-echo');
      const lower = cmd.toLowerCase();
      const state = inspectTopologyState();

      if (lower === 'clear' || lower === 'cls') {
        termOutput.innerHTML = '';
        return;
      }

      if (lower === 'help') {
        appendOutput(
          'Danh sách lệnh hỗ trợ:\n' +
          '  ping <ip>       - Gửi gói tin ICMP kiểm tra kết nối (vd: ping 8.8.8.8)\n' +
          '  ipconfig        - Xem cấu hình IP, Subnet Mask, Default Gateway máy trạm\n' +
          '  tracert <ip>    - Dò tìm lộ trình các chặng mạng (vd: tracert 8.8.8.8)\n' +
          '  clear / cls     - Xóa sạch màn hình dòng lệnh\n' +
          '  help            - Xem hướng dẫn lệnh'
        );
        return;
      }

      if (lower.startsWith('ping 8.8.8.8')) {
        if (state.isNetworkOnline) {
          appendOutput(
            '\nPinging 8.8.8.8 with 32 bytes of data:\n' +
            'Reply from 8.8.8.8: bytes=32 time=12ms TTL=118\n' +
            'Reply from 8.8.8.8: bytes=32 time=14ms TTL=118\n' +
            'Reply from 8.8.8.8: bytes=32 time=11ms TTL=118\n' +
            'Reply from 8.8.8.8: bytes=32 time=13ms TTL=118\n\n' +
            'Ping statistics for 8.8.8.8:\n' +
            '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),\n' +
            'Approximate round trip times in milli-seconds:\n' +
            '    Minimum = 11ms, Maximum = 14ms, Average = 12ms\n' +
            '>>> THÀNH CÔNG: Mô hình liên kết ONT Bridge + Router PPPoE thông suốt!',
            'success'
          );
        } else if (state.hasIpConflict) {
          appendOutput(
            '\nPinging 8.8.8.8 with 32 bytes of data:\n' +
            'Request timed out.\n' +
            'Request timed out.\n' +
            'Request timed out.\n' +
            'Request timed out.\n\n' +
            '[CẢNH BÁO XUNG ĐỘT IP] Phát hiện Gateway Router đang dùng 192.168.1.1 trùng với IP ONT!\n' +
            'Gói tin bị định tuyến vòng lặp. Vui lòng đổi LAN IP Router sang 192.168.10.1.',
            'error'
          );
        } else if (!state.isOntBridge) {
          appendOutput(
            '\nPinging 8.8.8.8 with 32 bytes of data:\n' +
            'Destination host unreachable.\n' +
            'Destination host unreachable.\n\n' +
            '[LỖI KẾT NỐI] ONT AC1000F chưa chuyển sang Bridge Mode (VLAN 2502). Router không thể quay số PPPoE qua kênh quang.',
            'error'
          );
        } else {
          appendOutput(
            '\nPinging 8.8.8.8 with 32 bytes of data:\n' +
            'Destination host unreachable.\n' +
            'Request timed out.\n\n' +
            '[LỖI KẾT NỐI] Router WAN 1 chưa thiết lập PPPoE hoặc thông tin tài khoản ISP chưa chính xác.',
            'warning'
          );
        }
        updateTopologyLiveState();
        return;
      }

      if (lower.startsWith('ping 192.168.10.1')) {
        appendOutput(
          '\nPinging 192.168.10.1 with 32 bytes of data:\n' +
          'Reply from 192.168.10.1: bytes=32 time<1ms TTL=64\n' +
          'Reply from 192.168.10.1: bytes=32 time<1ms TTL=64\n' +
          'Reply from 192.168.10.1: bytes=32 time<1ms TTL=64\n' +
          'Reply from 192.168.10.1: bytes=32 time<1ms TTL=64\n' +
          '>>> Gateway Router DrayTek Vigor 2927 phản hồi tức thì (LAN kết nối tốt).',
          'success'
        );
        return;
      }

      if (lower.startsWith('ping 192.168.1.1')) {
        appendOutput(
          '\nPinging 192.168.1.1 with 32 bytes of data:\n' +
          'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64\n' +
          'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64\n' +
          '>>> Cổng quản trị modem quang ONT AC1000F phản hồi bình thường.',
          'success'
        );
        return;
      }

      if (lower.startsWith('ipconfig')) {
        const gw = state.routerLanIp || '192.168.10.1';
        const parts = gw.split('.');
        const clientIp = `${parts[0]}.${parts[1]}.${parts[2]}.150`;
        appendOutput(
          '\nWindows IP Configuration\n\n' +
          'Ethernet adapter Local Area Connection:\n' +
          '   Connection-specific DNS Suffix  . : fpt.vn\n' +
          '   IPv4 Address. . . . . . . . . . . : ' + clientIp + '\n' +
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n' +
          '   Default Gateway . . . . . . . . . : ' + gw + '\n' +
          '   DHCP Server . . . . . . . . . . . : ' + gw + ' (DrayTek Vigor 2927)\n' +
          '   DNS Servers . . . . . . . . . . . : 8.8.8.8, 8.8.4.4\n',
          'term-line'
        );
        return;
      }

      if (lower.startsWith('tracert 8.8.8.8') || lower.startsWith('traceroute 8.8.8.8')) {
        if (state.isNetworkOnline) {
          appendOutput(
            '\nTracing route to dns.google [8.8.8.8] over a maximum of 30 hops:\n\n' +
            '  1    <1 ms    <1 ms    <1 ms  192.168.10.1 (Router DrayTek Vigor 2927)\n' +
            '  2     1 ms     1 ms     1 ms  192.168.1.1 (ONT AC1000F Bridge)\n' +
            '  3     4 ms     3 ms     4 ms  118.69.182.1 (FPT Broadband BRAS Gateway)\n' +
            '  4    12 ms    11 ms    12 ms  8.8.8.8 (dns.google)\n\n' +
            'Trace complete.',
            'success'
          );
        } else {
          appendOutput(
            '\nTracing route to 8.8.8.8 over a maximum of 30 hops:\n\n' +
            '  1    <1 ms    <1 ms    <1 ms  192.168.10.1\n' +
            '  2     *        *        *     Request timed out.\n' +
            '  3     *        *        *     Request timed out.\n\n' +
            'Trace failed: Kênh truyền Internet chưa thông.',
            'error'
          );
        }
        return;
      }

      appendOutput(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.\nGõ 'help' để xem các lệnh khả dụng.`);
    }

    termInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      }
    });

    if (btnTermClear) {
      btnTermClear.addEventListener('click', function () {
        termOutput.innerHTML = '';
      });
    }

    quickButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const cmd = btn.dataset.cmd;
        if (cmd) executeCommand(cmd);
      });
    });
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
    } catch (e) { }

    // Reset wifi storage cho bài 2
    if (lesson && lesson.id === 'ac1-bai2') {
      try {
        localStorage.removeItem('ftc_sim_wifi24');
        localStorage.removeItem('ftc_sim_wifi5g');
      } catch (e) { }
    }

    // Lưu lesson hiện tại để dùng cho clearFields
    _currentLesson = lesson;
    window._currentLesson = lesson;

    // Reset cờ theo dõi click Save cho phiên hướng dẫn mới
    window._hasClickedSaveInGuide = false;

    // ── Ghi nhận thời điểm BẮT ĐẦU phiên thực hành (Tracking) ──
    _trackingSession = {
      device: device,
      lesson: lesson,
      mode: enableGuide ? 'Hướng dẫn' : 'Thực hành',
      startedAt: new Date().toISOString(),
      submissionId: crypto.randomUUID ? crypto.randomUUID() : ('sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10))
    };
    const sessionToReserve = _trackingSession;
    _trackingSession.startSettled = sessionToReserve.mode !== 'Thực hành';
    _trackingSession.startPromise = sessionToReserve.mode === 'Thực hành'
      ? reserveTrackingTimerStart(sessionToReserve)
        .finally(function () { sessionToReserve.startSettled = true; })
      : Promise.resolve(true);
    _lastTrackingPayload = null;

    // ── Khởi động đồng hồ realtime trên toolbar ──
    startPracticeTimer();

    // Reset iframe loading state
    iframeLoading.classList.remove('hidden');

    // Thiết lập trạng thái ban đầu cho nút Nộp bài
    if (btnSubmitLab) {
      if (currentMode === 'guide' && !lesson.isTopology) {
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

    // Load URL into iframe (Multi-Device Topology aware)
    if (lesson.isTopology) {
      if (topologyDeviceTabs) topologyDeviceTabs.style.display = 'flex';
      const dev1 = lesson.device1 || { name: 'ONT AC1000F', role: 'Bridge Mode', practiceUrl: '/sim_ac1000f/cgi-bin/login.asp' };
      const dev2 = lesson.device2 || { name: 'Router Vigor 2927', role: 'PPPoE Gateway', practiceUrl: '/sim_vigor2927/weblogin.htm' };
      if (topolDev1Label) topolDev1Label.textContent = `Thiết bị 1: ${dev1.shortName || dev1.name}`;
      if (topolDev2Label) topolDev2Label.textContent = `Thiết bị 2: ${dev2.shortName || dev2.name}`;
      if (topolDev1Role) topolDev1Role.textContent = dev1.role || 'Bridge Mode';
      if (topolDev2Role) topolDev2Role.textContent = dev2.role || 'PPPoE Gateway';

      setTimeout(() => {
        const urlObj1 = new URL(dev1.practiceUrl || url, window.location.origin);
        urlObj1.searchParams.set('_t', Date.now());
        deviceIframe.src = urlObj1.toString();

        if (deviceIframe2) {
          const urlObj2 = new URL(dev2.practiceUrl || '/sim_vigor2927/weblogin.htm', window.location.origin);
          urlObj2.searchParams.set('_t', Date.now());
          deviceIframe2.src = urlObj2.toString();
        }

        switchTopologyTab('topology');
      }, 80);
    } else {
      if (topologyDeviceTabs) topologyDeviceTabs.style.display = 'none';
      if (topologyCanvasPanel) topologyCanvasPanel.style.display = 'none';
      if (topologyTerminalPanel) topologyTerminalPanel.style.display = 'none';
      if (deviceIframe2) {
        deviceIframe2.style.display = 'none';
        deviceIframe2.src = 'about:blank';
      }
      deviceIframe.style.display = 'block';

      setTimeout(() => {
        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.set('_t', Date.now());
        deviceIframe.src = urlObj.toString();
      }, 80);
    }
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
    if (trackingSaveInFlight) return;
    // Reset đồng hồ và session tracking
    const sessionToClose = _trackingSession;
    const elapsedSec = stopPracticeTimer();
    if (sessionToClose && sessionToClose.mode === 'Thực hành' && !sessionToClose.finalized) {
      finalizeAbandonedTrackingSession(sessionToClose, elapsedSec);
    }
    resetPracticeTimer();
    _trackingSession = null;
    _lastTrackingPayload = null;
    _lastEvalResult = null;
    _lastSubmitDurationSec = 0;

    deviceIframe.src = '';
    if (deviceIframe2) {
      deviceIframe2.src = '';
      deviceIframe2.style.display = 'none';
    }
    if (topologyDeviceTabs) topologyDeviceTabs.style.display = 'none';
    if (topologyCanvasPanel) topologyCanvasPanel.style.display = 'none';
    if (topologyTerminalPanel) topologyTerminalPanel.style.display = 'none';
    deviceIframe.style.display = '';

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
    if (window._hasClickedSaveInGuide) return;
    if (!_currentLesson) return;

    // Nếu lesson có hàm customClear riêng thì chạy hàm đó
    if (typeof _currentLesson.customClear === 'function') {
      try { _currentLesson.customClear(); } catch (e) { console.error(e); }
    }

    if (!Array.isArray(_currentLesson.clearFields) || _currentLesson.clearFields.length === 0) return;
    try {
      const allDocs = getAllAccessibleDocuments(deviceIframe.contentWindow);
      allDocs.forEach(doc => {
        _currentLesson.clearFields.forEach(selector => {
          try {
            doc.querySelectorAll(selector).forEach(el => {
              if (el._ftcUserModified || el === doc.activeElement) return;

              // Bỏ qua việc xóa trường SSID/Mật khẩu trên trang 5G để KTV có thể nhìn thấy dữ liệu phản chiếu từ 2.4G
              const is5GPage = doc.defaultView && doc.defaultView.location.hash.includes('wlanBasicSetting5g');
              if (is5GPage && (selector.includes('Txt_SSID') || selector.includes('Pwd_WpaPsk'))) {
                return;
              }

              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                if (el.type === 'radio' || el.type === 'checkbox') {
                  el.checked = false;
                } else if (el.tagName === 'SELECT') {
                  el.selectedIndex = 0;
                } else {
                  el.value = '';
                }
              } else if (el.classList.contains('item')) {
                el.remove();
              }
            });
          } catch (e) { }
        });
      });
    } catch (e) { }
  }


  // ── Grading & Evaluation Engine ──────────────────────────────────
  function evaluateLesson(device, lesson) {
    if (!lesson) return null;

    if (lesson.grading && typeof lesson.grading.customGrading === 'function') {
      if (lesson.isTopology) {
        const allDocs1 = getAllAccessibleDocuments(deviceIframe.contentWindow);
        const allDocs2 = deviceIframe2 ? getAllAccessibleDocuments(deviceIframe2.contentWindow) : [];
        const topolState = (typeof inspectTopologyState === 'function') ? inspectTopologyState() : {};
        return lesson.grading.customGrading(allDocs1, allDocs2, topolState);
      }
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
        } catch (e) { }
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
      } else if (rule.type === 'any_of') {
        // rule.expected is an array of accepted values (or comma-separated string)
        const choices = Array.isArray(rule.expected)
          ? rule.expected.map(v => String(v).trim())
          : String(rule.expected).split(',').map(v => v.trim());
        isMatch = choices.some(v => compActual === v);
      } else if (rule.type === 'element_exists') {
        isMatch = elementFound;
      } else {
        isMatch = compActual === expectedVal;
      }

      if (isMatch) {
        // Đối với thiết bị AX3000C, AX3000H v2 và AX3000S, bắt buộc trang chứa phần tử phải được bấm Save/Apply thành công
        if ((currentDeviceId === 'ax3000c' || currentDeviceId === 'ax3000hv2' || currentDeviceId === 'ax3000s') && !isSaved) {
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
        if ((currentDeviceId === 'ax3000c' || currentDeviceId === 'ax3000hv2' || currentDeviceId === 'ax3000s') && elementFound && !isSaved) {
          msg = 'Chưa bấm Save để lưu cấu hình';
        } else {
          msg = `Mong muốn: "${expectedVal}", Thực tế: "${actualValue || 'Trống'}"`;
        }
      }

      details.push({
        id: rule.id,
        name: rule.name,
        expected: expectedVal,
        actual: ((currentDeviceId === 'ax3000c' || currentDeviceId === 'ax3000hv2' || currentDeviceId === 'ax3000s') && elementFound && !isSaved) ? `${actualValue} (Chưa lưu)` : (actualValue || '(Chưa nhập / Chưa tìm thấy)'),
        passed: isMatch,
        message: msg
      });
    });

    function getLabelForElement(el, doc) {
      if (el.labels && el.labels.length > 0) return el.labels[0].textContent.trim().replace(/:$/, '');
      if (el.id) {
        const label = doc.querySelector(`label[for="${el.id}"]`);
        if (label) return label.textContent.trim().replace(/:$/, '');
      }
      const tr = el.closest('tr');
      if (tr) {
        const th = tr.querySelector('th, td.head, td.label, .dt');
        if (th && th !== el.parentElement) return th.textContent.trim().replace(/:$/, '');
        const firstTd = tr.querySelector('td');
        if (firstTd && firstTd !== el.closest('td')) return firstTd.textContent.trim().replace(/:$/, '');
      }
      const dl = el.closest('dl');
      if (dl) {
        const dt = dl.querySelector('dt, .dt');
        if (dt) return dt.textContent.trim().replace(/:$/, '');
      }
      let parent = el.parentElement;
      let depth = 0;
      while (parent && parent !== doc.body && depth < 4) {
        const prev = parent.previousElementSibling;
        if (prev && (prev.tagName === 'LABEL' || prev.className.includes('label') || prev.className.includes('title') || prev.className.includes('dt'))) {
          return prev.textContent.trim().replace(/:$/, '');
        }
        const labelEl = parent.querySelector('label, .label, .dt, .title, .head');
        if (labelEl && labelEl !== el && !labelEl.contains(el)) {
          return labelEl.textContent.trim().replace(/:$/, '');
        }
        parent = parent.parentElement;
        depth++;
      }
      let fallback = el.id || el.name || el.placeholder;
      if (fallback) return fallback.replace(/_/g, ' ');
      return 'Trường ẩn/Không xác định';
    }

    // === BỘ LỌC AUTO-BASELINE (TÌM THAO TÁC THỪA) ===
    let unexpectedErrors = [];

    allDocs.forEach(doc => {
      if (doc._ftcOriginalValues) {
        Object.keys(doc._ftcOriginalValues).forEach(uid => {
          const originalValue = doc._ftcOriginalValues[uid];
          const el = doc.querySelector(`[data-ftc-id="${uid}"]`);
          if (el) {
            // Kiểm tra xem input này có thuộc về các bước yêu cầu (rules) không?
            const isExpected = rules.some(r => {
              try { return doc.querySelector(r.selector) === el; } catch (e) { return false; }
            });

            // Nếu KHÔNG nằm trong rule, nhưng lại bị sửa giá trị khác gốc
            if (!isExpected) {
              const currentValue = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
              if (String(currentValue) !== String(originalValue)) {
                // Bỏ qua đánh giá radio bị tắt để tránh 1 lần click sinh 2 lỗi trùng lặp
                if (el.type === 'radio' && !el.checked) return;

                let labelText = getLabelForElement(el, doc);
                let formattedOriginal = '';
                let formattedCurrent = '';

                if (el.type === 'checkbox' || el.type === 'radio') {
                  formattedOriginal = (originalValue === true || String(originalValue) === 'true') ? 'Bật/Enable' : 'Tắt/Disable';
                  formattedCurrent = currentValue ? 'Bật/Enable' : 'Tắt/Disable';
                } else if (el.tagName === 'SELECT') {
                  try {
                    let optOrig = el.querySelector(`option[value="${originalValue}"]`);
                    let optCurr = el.querySelector(`option[value="${currentValue}"]`);
                    formattedOriginal = optOrig ? optOrig.textContent.trim() : originalValue;
                    formattedCurrent = optCurr ? optCurr.textContent.trim() : currentValue;
                  } catch (e) {
                    formattedOriginal = originalValue;
                    formattedCurrent = currentValue;
                  }
                } else {
                  formattedOriginal = originalValue || 'Trống';
                  formattedCurrent = currentValue || 'Trống';
                }

                unexpectedErrors.push({
                  label: labelText,
                  expected: formattedOriginal,
                  actual: formattedCurrent
                });
              }
            }
          }
        });
      }
    });

    // Cập nhật kết quả passed: Chỉ pass khi đủ rule VÀ không có thao tác thừa
    const hasUnexpected = unexpectedErrors.length > 0;
    const passed = (passedCount === rules.length) && !hasUnexpected;
    const score = passed ? 100 : Math.round((passedCount / rules.length) * (hasUnexpected ? 99 : 100));

    let finalTotalRules = rules.length + unexpectedErrors.length;

    // Đẩy TẤT CẢ lỗi thao tác thừa vào danh sách details
    unexpectedErrors.forEach(err => {
      details.push({
        id: 'unexpected_change_' + Math.random(),
        name: err.label,
        expected: err.expected,
        actual: err.actual,
        passed: false,
        message: 'Thao tác thừa ngoài yêu cầu'
      });
    });
    // ===============================================

    return {
      passed: passed,
      score: score,
      passedCount: passedCount,
      totalRules: finalTotalRules,
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
    setTrackingSaveStatus('', '');
    if (currentMode === 'practice' || (currentMode === 'guide' && evalResult.passed)) {
      const savePromise = sendTrackingTimer(evalResult, durationSec);
      Promise.resolve(savePromise).finally(function () {
        showGradingModal(evalResult, device, lesson, currentMode, durationSec);
      });
    } else {
      setTrackingSaveStatus('warning', 'Lần thử ở chế độ Hướng dẫn chưa đạt nên không được ghi vào tiến độ.');
      showGradingModal(evalResult, device, lesson, currentMode, durationSec);
    }
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

    if (res.passed) {
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
        const has5GFail = failedRealItems.some(i => i.id.startsWith('5G_') || i.id === '_5g_hint');
        const hasOntFail = failedRealItems.some(i => i.group === 'ont' || i.id.startsWith('ont_'));
        const hasRouterFail = failedRealItems.some(i => i.group === 'router' || i.id.startsWith('vigor_') || i.id.startsWith('router_'));
        const hasLinkFail = failedRealItems.some(i => i.group === 'link' || i.id.startsWith('link_') || i.id.startsWith('ping_'));

        res.details.forEach(item => {
          // Header row: chỉ vẽ nếu section đó có lỗi
          if (item._isHeader) {
            let shouldShow = false;
            if (item.id === '_header_24g' && has24GFail) shouldShow = true;
            else if (item.id === '_header_5g' && has5GFail) shouldShow = true;
            else if (item.id === '_header_ont' && hasOntFail) shouldShow = true;
            else if (item.id === '_header_router' && hasRouterFail) shouldShow = true;
            else if (item.id === '_header_link' && hasLinkFail) shouldShow = true;
            else if (item.id.startsWith('_header_')) shouldShow = true;
            if (!shouldShow) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td colspan="4" style="background:#1e293b;color:#38bdf8;font-weight:700;
                font-size:11px;letter-spacing:1px;padding:6px 10px;text-align:center;">
                ${escapeHTML(item.name)}
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
                ⚠ ${escapeHTML(item.expected)}
              </td>
            `;
            gmChecklistBody.appendChild(tr);
            return;
          }
          // Tiêu chí thường: chỉ vẽ nếu sai
          if (item.passed) return;

          let groupBadge = '';
          if (item.group === 'ont') {
            groupBadge = '<span style="background:#0284c7;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;margin-right:6px;font-weight:700;">ONT</span>';
          } else if (item.group === 'router') {
            groupBadge = '<span style="background:#d97706;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;margin-right:6px;font-weight:700;">ROUTER</span>';
          } else if (item.group === 'link') {
            groupBadge = '<span style="background:#16a34a;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;margin-right:6px;font-weight:700;">LINK</span>';
          }

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${groupBadge}<strong>${escapeHTML(item.name)}</strong></td>
            <td><code class="gm-code-val">${escapeHTML(item.expected)}</code></td>
            <td><code class="gm-code-val" style="color:#b91c1c; font-weight:700;">${escapeHTML(item.actual)}</code></td>
            <td><span class="gm-badge-fail">✖ Sai</span></td>
          `;
          gmChecklistBody.appendChild(tr);
        });
      }
    }

    gradingModal.style.display = 'flex';
    gradingModal.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      const target = btnModalClose && btnModalClose.style.display !== 'none' ? btnModalClose : btnModalRetry;
      target?.focus();
    });
  }

  function hideGradingModal() {
    if (gradingModal) {
      gradingModal.style.display = 'none';
      gradingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // ── Tracking API ─────────────────────────────────────────────────
  function reserveTrackingTimerStart(session) {
    if (!session || !_currentUser) return Promise.resolve(false);
    const labId = session.lesson && session.lesson.id
      ? session.lesson.id
      : (session.lesson && session.lesson.title ? session.lesson.title : '');
    return fetch('/api/index.php/tracking/timer/start', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submission_id: session.submissionId,
        lab_id: labId,
        mode: session.mode,
        started_at: session.startedAt
      })
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (err) {
            const message = err && err.error && err.error.message
              ? err.error.message
              : `Không khởi tạo được phiên (HTTP ${res.status}).`;
            throw new Error(message);
          });
        }
        return res.json();
      })
      .then(function (data) {
        const item = data && data.item ? data.item : {};
        session.attemptNo = item.practice_attempt_no == null ? null : Number(item.practice_attempt_no);
        session.serverSessionId = item.session_id || '';
        return true;
      })
      .catch(function (err) {
        console.warn('[Tracking] Chưa thể giữ số thứ tự phiên; máy chủ sẽ cấp số khi lưu kết quả:', err);
        return false;
      });
  }

  function finalizeAbandonedTrackingSession(session, durationSec) {
    if (!session || !_currentUser) return Promise.resolve(false);
    const labId = session.lesson && session.lesson.id
      ? session.lesson.id
      : (session.lesson && session.lesson.title ? session.lesson.title : '');
    const user = _currentUser;
    const finish = function () {
      return fetch('/api/index.php/tracking/timer', {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: session.submissionId,
          technician_id: user.technician_id,
          name: user.name,
          email: user.email || undefined,
          lab_id: labId,
          mode: session.mode,
          started_at: session.startedAt,
          finished_at: new Date().toISOString(),
          duration_sec: durationSec || 0,
          status: 'abandoned'
        })
      })
        .then(function (response) {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          session.finalized = true;
          return true;
        })
        .catch(function (error) {
          console.warn('[Tracking] Không thể ghi nhận phiên đã dừng:', error);
          return false;
        });
    };
    return Promise.resolve(session.startPromise).then(finish);
  }

  /**
   * Gửi thông tin phiên thực hành lên server qua POST /api/index.php/tracking/timer.
   * Được gọi DUY NHẤT 1 LẦN khi KTV bấm nút trên modal kết quả.
   * @param {object|null} evalResult - Kết quả chấm điểm
   * @param {number} durationSec - Thời gian làm bài (giây), lấy từ đồng hồ đã dừng
   */
  function setTrackingSaveStatus(status, message, allowRetry) {
    if (!gmSaveStatus) return;
    gmSaveStatus.hidden = !message;
    gmSaveStatus.className = `gm-save-status${status ? ` is-${status}` : ''}`;
    gmSaveStatus.replaceChildren();
    if (!message) return;

    const text = document.createElement('span');
    text.textContent = message;
    gmSaveStatus.appendChild(text);
    if (allowRetry) {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'gm-save-retry';
      retry.textContent = 'Thử lưu lại';
      retry.addEventListener('click', () => sendTrackingTimer(_lastEvalResult, _lastSubmitDurationSec, _lastTrackingPayload));
      gmSaveStatus.appendChild(retry);
    }
  }

  function setTrackingActionsDisabled(disabled) {
    [btnModalRetry, btnModalClose].forEach(button => {
      if (button) button.disabled = disabled;
    });
  }

  function sendTrackingTimer(evalResult, durationSec, retryPayload = null) {
    if (!_trackingSession) return; // Chưa có phiên nào được bắt đầu
    const session = _trackingSession;
    if (session.startPromise && !session.startSettled) {
      return session.startPromise.then(function () {
        return sendTrackingTimer(evalResult, durationSec, retryPayload);
      });
    }
    if (trackingSaveInFlight) return;
    if (!_currentUser) {
      setTrackingSaveStatus('error', 'Phiên đăng nhập không còn hợp lệ. Hãy đăng nhập lại trước khi nộp bài.');
      return Promise.resolve(false);
    }
    trackingSaveInFlight = true;
    setTrackingActionsDisabled(true);
    setTrackingSaveStatus('saving', 'Đang lưu kết quả và cập nhật tiến độ...');

    const finishedAt = new Date();

    // Lấy tên thiết bị từ device object (ưu tiên device.name, fallback device.id)
    const deviceName = (session.device && session.device.name) ? session.device.name : (session.device && session.device.id ? session.device.id : 'Unknown');

    // Lấy lab_id chính xác từ lesson.id (khớp với data.js)
    const labId = session.lesson && session.lesson.id ? session.lesson.id : (session.lesson && session.lesson.title ? session.lesson.title : 'Unknown');

    // Thông tin KTV từ phiên đăng nhập; server đối chiếu lại danh tính này.
    const user = _currentUser;

    const payload = retryPayload ? { ...retryPayload } : {
      submission_id: session.submissionId,
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

    if (!retryPayload && evalResult) {
      payload.status = evalResult.passed ? 'completed' : 'failed';
      payload.is_passed = evalResult.passed;
      payload.score = evalResult.score;
      payload.grading_details = evalResult.details;
    }

    // Loại bỏ các field undefined trước khi gửi
    Object.keys(payload).forEach(function (k) {
      if (payload[k] === undefined) delete payload[k];
    });
    if (!retryPayload) _lastTrackingPayload = payload;

    return fetch('/api/index.php/tracking/timer', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (err) {
            const message = err && err.error && err.error.message
              ? err.error.message
              : `Không lưu được kết quả (HTTP ${res.status}).`;
            throw new Error(message);
          });
        }
        return res.json().then(function (data) {
          console.info('[Tracking] Đã ghi phiên thực hành & chấm điểm:', data);
          const item = data && data.item ? data.item : {};
          session.finalized = true;
          const attemptNote = item.practice_attempt_no
            ? ` Lần thực hành ${item.practice_attempt_no}.`
            : '';
          if (item.normalized_saved === false) {
            setTrackingSaveStatus('success', `Đã lưu kết quả luyện tập.${attemptNote} Bài ngoài phạm vi giao không cộng vào tiến độ lớp.`);
          } else {
            setTrackingSaveStatus('success', item.duplicate
              ? `Kết quả này đã được lưu trước đó.${attemptNote}`
              : `Đã lưu kết quả và cập nhật tiến độ thành công.${attemptNote}`);
          }
        });
      })
      .catch(function (err) {
        console.warn('[Tracking] Không thể gửi dữ liệu tracking:', err);
        setTrackingSaveStatus('error', `Chưa lưu được kết quả: ${err.message || 'lỗi kết nối.'}`, true);
      })
      .finally(function () {
        trackingSaveInFlight = false;
        setTrackingActionsDisabled(false);
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
  const btnDashboard = document.getElementById('btn-dashboard');
  if (btnDashboard) {
    btnDashboard.addEventListener('click', function () {
      window.location.href = '/dashboard-authen/';
    });
  }

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
    if (currentMode !== 'guide' || window._hasClickedSaveInGuide) {
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
          } catch (e) { }
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
          font-size: 11px !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          padding: 4px 8px !important;
          border-radius: 3px !important;
          box-shadow: 0 2px 8px rgba(255, 0, 0, 0.35) !important;
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
        // Kiểm tra biến global oldpath của simulator
        if (rootWin.oldpath && rootWin.oldpath.toLowerCase().includes(p)) {
          return true;
        }
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

      if (target) {
        const openModal = Array.from(doc.querySelectorAll('.MuiDialog-root, .MuiModal-root, #modal_overlay, .modal-overlay, .modal_overlay, #modal-overlay')).find(m => {
          if (!m) return false;
          if (m.classList.contains('MuiDialog-root') || m.classList.contains('MuiModal-root')) {
            return m.style.display !== 'none' && (m.offsetWidth > 0 || m.offsetHeight > 0 || (m.getClientRects && m.getClientRects().length > 0));
          }
          return m.classList.contains('active') || m.classList.contains('show') || m.style.display === 'flex' || m.style.display === 'block';
        });
        if (openModal && !openModal.contains(target)) {
          target = null;
        }
      }

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
      const bodyStyle = win.getComputedStyle(doc.body);
      const isBodyPositioned = bodyStyle && bodyStyle.position !== 'static';
      const offsetParent = isBodyPositioned ? doc.body : doc.documentElement;
      const parentRect = offsetParent.getBoundingClientRect();

      const targetTop = rect.top - parentRect.top;
      const targetLeft = rect.left - parentRect.left;
      const bWidth = bubble.offsetWidth || 180;
      const bHeight = bubble.offsetHeight || 30;
      const winW = win.innerWidth || doc.documentElement.clientWidth || 1024;
      const winH = win.innerHeight || doc.documentElement.clientHeight || 768;
      let pos = pop.position || 'right';

      // Tắt tự động lật tooltip theo yêu cầu
      /*
      if (!pop.forcePosition && pos === 'right' && (rect.left + rect.width + bWidth + 16) > winW) {
        if (rect.left - bWidth - 12 >= 10) {
          pos = 'left';
        }
      }
      */

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
  window.onSimulatorSave = function (simWin, modalTitle) {
    if (currentDeviceId === 'ax3000gz' && _currentLesson && _currentLesson.id === 'LAB_AX3000GZ_02') {
      if (modalTitle !== 'WLAN SSID Configuration') {
        return;
      }
    }

    window._hasClickedSaveInGuide = true;

    if (_currentLesson && typeof _currentLesson.onSimSave === 'function') {
      try {
        _currentLesson.onSimSave(simWin);
      } catch (e) { }
    }

    // Đánh giá tức thì để mở nút Nộp bài ngay không cần chờ setInterval
    if (currentMode === 'guide' && btnSubmitLab && btnSubmitLab.disabled) {
      const device = DEVICES.find(d => d.id === currentDeviceId);
      const lesson = getCurrentLesson();
      if (device && lesson) {
        const evalResult = evaluateLesson(device, lesson);
        console.error('[FTC-DEBUG] onSimulatorSave evalResult:', JSON.stringify(evalResult));
        if (evalResult && evalResult.passed) {
          btnSubmitLab.disabled = false;
          btnSubmitLab.style.opacity = '1';
          btnSubmitLab.style.cursor = 'pointer';
        } else if (evalResult) {
          console.error('[FTC-DEBUG] Grading FAILED — details:', JSON.stringify(evalResult.details));
        }
      } else {
        console.error('[FTC-DEBUG] device or lesson is null. device:', !!device, 'lesson:', !!lesson, 'currentDeviceId:', currentDeviceId, 'currentLessonId:', currentLessonId);
      }
    } else {
      console.error('[FTC-DEBUG] onSimulatorSave skipped — mode:', currentMode, 'btnDisabled:', btnSubmitLab && btnSubmitLab.disabled);
    }
  };

  // ── Boot ─────────────────────────────────────────────────────────
  init();
})();
