/**
 * FTC NETWORK SIMULATOR - PERSONAL DASHBOARD FOR KTV
 * Logic for fetching data, rendering KPIs, device progress, interactive SVG charts,
 * and filtering/paginating session history.
 */

(function () {
  'use strict';

  let _dashboardData = null;
  let _filteredSessions = [];
  let _currentPage = 1;
  const PAGE_SIZE = 12;

  // DOM Elements
  const elLoading = document.getElementById('loading-state');
  const elContent = document.getElementById('dashboard-content');
  const elError = document.getElementById('error-state');
  const elErrorMessage = document.getElementById('error-message');

  // User elements
  const elUserName = document.getElementById('user-name');
  const elUserAvatar = document.getElementById('user-avatar');
  const elHeroTitle = document.getElementById('hero-greeting-title');
  const elHeroSubtitle = document.getElementById('hero-greeting-desc');
  const elTagEmployeeId = document.getElementById('tag-employee-id');
  const elTagClass = document.getElementById('tag-class-name');
  const elTagRegion = document.getElementById('tag-region');

  // Metric elements
  const elMetricCompletionVal = document.getElementById('metric-completion-val');
  const elMetricCompletionSub = document.getElementById('metric-completion-sub');
  const elMetricCompletionBar = document.getElementById('metric-completion-bar');

  const elMetricFirstTryVal = document.getElementById('metric-first-try-val');
  const elMetricFirstTrySub = document.getElementById('metric-first-try-sub');
  const elMetricFirstTryBar = document.getElementById('metric-first-try-bar');

  const elMetricAvgScoreVal = document.getElementById('metric-avg-score-val');
  const elMetricAvgScoreSub = document.getElementById('metric-avg-score-sub');
  const elMetricAvgScoreBar = document.getElementById('metric-avg-score-bar');

  const elMetricTimeVal = document.getElementById('metric-time-val');
  const elMetricTimeSub = document.getElementById('metric-time-sub');
  const elMetricTimeBar = document.getElementById('metric-time-bar');

  // Donut elements
  const elDonutCircle = document.getElementById('donut-circle-progress');
  const elDonutPercent = document.getElementById('donut-percent-text');
  const elStatPassedCount = document.getElementById('stat-passed-count');
  const elStatInProgressCount = document.getElementById('stat-in-progress-count');
  const elStatUnstartedCount = document.getElementById('stat-unstarted-count');

  // Device & Sessions containers
  const elDeviceGrid = document.getElementById('device-progress-grid');
  const elSessionsBody = document.getElementById('sessions-table-body');
  const elSessionsCount = document.getElementById('sessions-total-count');
  const elSessionsPagination = document.getElementById('sessions-pagination');
  const elPageInfo = document.getElementById('page-info');
  const elBtnPrevPage = document.getElementById('btn-prev-page');
  const elBtnNextPage = document.getElementById('btn-next-page');

  // Filters
  const elFilterSearch = document.getElementById('filter-search');
  const elFilterMode = document.getElementById('filter-mode');
  const elFilterResult = document.getElementById('filter-result');
  const elFilterDevice = document.getElementById('filter-device');

  // Trend & Frequency Chart Elements & State
  const elTrendChartContainer = document.getElementById('trend-chart-container');
  const elTrendChartTitle = document.getElementById('trend-chart-title');
  const elTrendChartIcon = document.getElementById('trend-chart-icon');
  const elBtnChartScore = document.getElementById('btn-chart-score');
  const elBtnChartFrequency = document.getElementById('btn-chart-frequency');
  const elChartMonthSelect = document.getElementById('chart-month-select');

  let _chartMode = 'score'; // 'score' | 'frequency'
  let _selectedMonth = ''; // 'YYYY-MM'

  // Student AI Coach & Tutor elements (Part 2)
  let _studentAiAdvice = null;
  let _aiChatLoading = false;

  const elAiCoachCard = document.getElementById('ai-coach-card');
  const elAiStatusPill = document.getElementById('ai-status-pill');
  const elAiFeedbackText = document.getElementById('ai-feedback-text');
  const elAiMistakeAlert = document.getElementById('ai-mistake-alert');
  const elAiMistakeContent = document.getElementById('ai-mistake-content');
  const elAiNextLabName = document.getElementById('ai-next-lab-name');
  const elAiNextDeviceName = document.getElementById('ai-next-device-name');
  const btnAiLaunchLab = document.getElementById('btn-ai-launch-lab');
  const btnHeroOpenTutor = document.getElementById('btn-hero-open-tutor');

  const studentAiFab = document.getElementById('student-ai-fab');
  const studentAiBackdrop = document.getElementById('student-ai-backdrop');
  const studentAiDrawer = document.getElementById('student-ai-drawer');
  const studentAiCloseBtn = document.getElementById('student-ai-close-btn');
  const studentAiChatBody = document.getElementById('student-ai-chat-body');
  const studentAiInput = document.getElementById('student-ai-input');
  const studentAiSendBtn = document.getElementById('student-ai-send-btn');
  const studentAiChipsBar = document.getElementById('student-ai-chips-bar');

  // Duolingo Gamification & Reward Elements
  let _gamificationData = null;
  let _rewardsCatalog = [];
  let _speedLeaderboard = [];

  const elStreakFlameIcon = document.getElementById('streak-flame-icon');
  const elStreakCountVal = document.getElementById('streak-count-val');
  const elStreakLongestBadge = document.getElementById('streak-longest-badge');
  const elStreakFreezeBadge = document.getElementById('streak-freeze-badge');
  const elStreakWeekCalendar = document.getElementById('streak-week-calendar');
  const elStreakMotivationalText = document.getElementById('streak-motivational-text');
  const elNetcoinsBalanceVal = document.getElementById('netcoins-balance-val');
  const elNetcoinsSpeedSub = document.getElementById('netcoins-speed-sub');
  const btnDailyCheckin = document.getElementById('btn-daily-checkin');
  const btnOpenRewards = document.getElementById('btn-open-rewards');

  // Nav top pill
  const elNavStreakPill = document.getElementById('nav-streak-pill');
  const elNavStreakDays = document.getElementById('nav-streak-days');
  const elNavStreakCoins = document.getElementById('nav-streak-coins');

  // Modal elements
  const elRewardModalBackdrop = document.getElementById('reward-modal-backdrop');
  const elRewardModal = document.getElementById('reward-modal');
  const btnCloseRewardModal = document.getElementById('btn-close-reward-modal');
  const elModalUserCoins = document.getElementById('modal-user-coins');
  const elHistoryCount = document.getElementById('history-count');
  const elRewardItemsGrid = document.getElementById('reward-items-grid');
  const elRewardHistoryList = document.getElementById('reward-history-list');
  const elSpeedLeaderboardWrap = document.getElementById('speed-leaderboard-wrap');

  const tabBtnCatalog = document.getElementById('tab-btn-catalog');
  const tabBtnHistory = document.getElementById('tab-btn-history');
  const tabBtnSpeed = document.getElementById('tab-btn-speed');
  const tabContentCatalog = document.getElementById('tab-content-catalog');
  const tabContentHistory = document.getElementById('tab-content-history');
  const tabContentSpeed = document.getElementById('tab-content-speed');

  function init() {
    setupEventListeners();
    setupStudentAiEvents();
    fetchDashboardData();
  }

  function setupEventListeners() {
    if (elFilterSearch) elFilterSearch.addEventListener('input', debounce(applySessionFilters, 250));
    if (elFilterMode) elFilterMode.addEventListener('change', applySessionFilters);
    if (elFilterResult) elFilterResult.addEventListener('change', applySessionFilters);
    if (elFilterDevice) elFilterDevice.addEventListener('change', applySessionFilters);

    if (elBtnPrevPage) {
      elBtnPrevPage.addEventListener('click', () => {
        if (_currentPage > 1) {
          _currentPage--;
          renderSessionsTable();
        }
      });
    }

    if (elBtnNextPage) {
      elBtnNextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(_filteredSessions.length / PAGE_SIZE) || 1;
        if (_currentPage < totalPages) {
          _currentPage++;
          renderSessionsTable();
        }
      });
    }

    if (elBtnChartScore) {
      elBtnChartScore.addEventListener('click', () => {
        if (_chartMode === 'score') return;
        _chartMode = 'score';
        elBtnChartScore.classList.add('active');
        elBtnChartFrequency?.classList.remove('active');
        if (elChartMonthSelect) elChartMonthSelect.style.display = 'none';
        if (elTrendChartTitle) elTrendChartTitle.textContent = 'Xu hướng điểm số & hoạt động';
        if (elTrendChartIcon) {
          elTrendChartIcon.innerHTML = '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>';
        }
        renderActiveChart();
      });
    }

    if (elBtnChartFrequency) {
      elBtnChartFrequency.addEventListener('click', () => {
        if (_chartMode === 'frequency') return;
        _chartMode = 'frequency';
        elBtnChartFrequency.classList.add('active');
        elBtnChartScore?.classList.remove('active');
        if (elChartMonthSelect) elChartMonthSelect.style.display = 'inline-block';
        if (elTrendChartTitle) elTrendChartTitle.textContent = 'Tần suất thực hiện theo ngày';
        if (elTrendChartIcon) {
          elTrendChartIcon.innerHTML = '<rect x="3" y="12" width="4" height="8" rx="1"></rect><rect x="10" y="8" width="4" height="12" rx="1"></rect><rect x="17" y="4" width="4" height="16" rx="1"></rect>';
        }
        renderActiveChart();
      });
    }

    if (elChartMonthSelect) {
      elChartMonthSelect.addEventListener('change', (e) => {
        _selectedMonth = e.target.value;
        renderActiveChart();
      });
    }

    window.addEventListener('resize', debounce(() => {
      renderActiveChart();
    }, 200));

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', handleLogout);
    }

    // Gamification listeners
    if (btnOpenRewards) {
      btnOpenRewards.addEventListener('click', openRewardModal);
    }
    if (elNavStreakPill) {
      elNavStreakPill.addEventListener('click', openRewardModal);
    }
    if (btnCloseRewardModal) {
      btnCloseRewardModal.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeRewardModal();
      });
    }
    if (elRewardModalBackdrop) {
      elRewardModalBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeRewardModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeRewardModal();
      }
    });
    if (btnDailyCheckin) {
      btnDailyCheckin.addEventListener('click', handleDailyCheckin);
    }

    [tabBtnCatalog, tabBtnHistory, tabBtnSpeed].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          switchRewardTab(btn.dataset.tab);
        });
      }
    });
  }

  function fetchDashboardData() {
    showLoading(true);
    fetch('/api/index.php/learning/personal-dashboard', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/login/?redirect=' + encodeURIComponent(window.location.pathname);
          return null;
        }
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data || !data.data) {
          throw new Error('Dữ liệu trả về không hợp lệ.');
        }
        _dashboardData = data.data;
        renderDashboard(_dashboardData);
        fetchStudentAiAdvice();
        fetchGamificationStatus();
        showLoading(false);
      })
      .catch(err => {
        console.error('[PersonalDashboard] Error loading dashboard:', err);
        showError('Không thể tải thông tin tiến độ cá nhân. Vui lòng thử lại sau.');
      });
  }

  function renderDashboard(data) {
    const user = data.user || {};
    const stats = data.stats || {};
    const classes = data.classes || [];
    const devices = data.device_progress || [];
    const sessions = data.sessions || [];
    const trend = data.trend || [];

    // 1. User info & Greeting
    const displayName = user.display_name || user.email || 'Kỹ thuật viên';
    if (elUserName) elUserName.textContent = displayName;
    if (elHeroTitle) elHeroTitle.textContent = `Xin chào, ${displayName}! 👋`;
    
    const initials = displayName.substring(0, 2).toUpperCase();
    if (elUserAvatar) elUserAvatar.textContent = initials;

    // Show Dashboard button for lecturers and admins
    const role = String(user.role || '').toUpperCase();
    const isStaff = Boolean(user.is_admin || ['GIANGVIEN', 'ADMIN', 'DEV'].includes(role));
    const btnGotoDashboard = document.getElementById('btn-goto-dashboard');
    if (btnGotoDashboard && isStaff) {
      btnGotoDashboard.style.display = 'inline-flex';
      const btnText = document.getElementById('btn-goto-dashboard-text');
      if (btnText) {
        btnText.textContent = role === 'GIANGVIEN' ? 'Dashboard Giảng Viên' : 'Quản Lý Đào Tạo';
      }
    }

    if (elTagEmployeeId) {
      elTagEmployeeId.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Mã sinh viên: <strong>${escapeHTML(user.employee_id || 'Chưa có')}</strong></span>
      `;
    }

    const activeClass = classes.length > 0 ? classes[0] : null;
    if (elTagClass) {
      const className = activeClass ? (activeClass.class_name || activeClass.class_code) : 'Tự do / Chưa gán lớp';
      elTagClass.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>Lớp: <strong>${escapeHTML(className)}</strong></span>
      `;
    }

    if (elTagRegion) {
      const regionName = user.region_name || user.unit_name || 'Phòng Thực Hành Mạng UTH';
      elTagRegion.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
        <span>Đơn vị: <strong>${escapeHTML(regionName)}</strong></span>
      `;
    }

    // 2. Metrics Ribbon
    const completionPct = stats.completion_rate_percent || 0;
    if (elMetricCompletionVal) elMetricCompletionVal.textContent = `${completionPct}%`;
    if (elMetricCompletionSub) elMetricCompletionSub.textContent = `${stats.passed_labs || 0}/${stats.total_assigned_labs || 0} bài đạt`;
    if (elMetricCompletionBar) elMetricCompletionBar.style.width = `${Math.min(100, completionPct)}%`;

    const firstTryPct = stats.first_try_pass_rate_percent || 0;
    if (elMetricFirstTryVal) elMetricFirstTryVal.textContent = `${firstTryPct}%`;
    if (elMetricFirstTrySub) elMetricFirstTrySub.textContent = `Tỷ lệ đạt lần 1`;
    if (elMetricFirstTryBar) elMetricFirstTryBar.style.width = `${Math.min(100, firstTryPct)}%`;

    const avgScore = stats.average_score || 0;
    if (elMetricAvgScoreVal) elMetricAvgScoreVal.textContent = avgScore > 0 ? avgScore.toFixed(1) : '—';
    if (elMetricAvgScoreSub) elMetricAvgScoreSub.textContent = `Thang điểm 100`;
    if (elMetricAvgScoreBar) elMetricAvgScoreBar.style.width = `${Math.min(100, avgScore)}%`;

    const durationSec = stats.total_practice_duration_sec || 0;
    const durFormatted = formatDurationHuman(durationSec);
    if (elMetricTimeVal) elMetricTimeVal.textContent = durFormatted.primary;
    if (elMetricTimeSub) elMetricTimeSub.textContent = durFormatted.secondary;
    if (elMetricTimeBar) elMetricTimeBar.style.width = `${Math.min(100, (durationSec / 7200) * 100)}%`;

    // 3. Donut Progress
    renderDonutProgress(completionPct, stats);

    // 4. Trend or Frequency Chart
    renderActiveChart();

    // 5. Device progress grid
    renderDeviceProgress(devices);

    // 6. Populate device filter dropdown
    populateDeviceFilter(devices);

    // 7. Render sessions table
    _filteredSessions = [...sessions];
    _currentPage = 1;
    renderSessionsTable();
  }

  function renderDonutProgress(percent, stats) {
    if (elDonutPercent) elDonutPercent.textContent = `${percent}%`;
    if (elDonutCircle) {
      const radius = 64;
      const circumference = 2 * Math.PI * radius;
      elDonutCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (percent / 100) * circumference;
      elDonutCircle.style.strokeDashoffset = offset;
    }

    if (elStatPassedCount) elStatPassedCount.textContent = `${stats.passed_labs || 0} bài`;
    if (elStatInProgressCount) elStatInProgressCount.textContent = `${stats.in_progress_labs || 0} bài`;
    if (elStatUnstartedCount) elStatUnstartedCount.textContent = `${stats.unstarted_labs || 0} bài`;
  }

  function getAvailableMonths(sessions) {
    const monthsSet = new Set();
    const now = new Date();
    monthsSet.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

    (sessions || []).forEach(s => {
      const timeStr = s.finished_at || s.started_at;
      if (timeStr) {
        const d = new Date(timeStr.replace(' ', 'T'));
        if (!isNaN(d.getTime())) {
          monthsSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }

  function renderActiveChart() {
    if (!_dashboardData) return;
    if (_chartMode === 'frequency') {
      renderMonthlyFrequencyChart(_selectedMonth);
    } else {
      renderTrendChart(_dashboardData.trend);
    }
  }

  function renderMonthlyFrequencyChart(selectedMonthStr) {
    if (!elTrendChartContainer) return;
    elTrendChartContainer.innerHTML = '';

    const sessions = _dashboardData?.sessions || [];
    const availableMonths = getAvailableMonths(sessions);
    if (!selectedMonthStr || !availableMonths.includes(selectedMonthStr)) {
      selectedMonthStr = availableMonths[0] || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    }
    _selectedMonth = selectedMonthStr;

    // Update month dropdown options if needed
    if (elChartMonthSelect) {
      const optionsHtml = availableMonths.map(m => {
        const [y, mon] = m.split('-');
        return `<option value="${m}" ${m === _selectedMonth ? 'selected' : ''}>Tháng ${mon}/${y}</option>`;
      }).join('');
      if (elChartMonthSelect.innerHTML !== optionsHtml) {
        elChartMonthSelect.innerHTML = optionsHtml;
      }
      elChartMonthSelect.value = _selectedMonth;
    }

    const [year, month] = _selectedMonth.split('-').map(Number);
    const totalDays = new Date(year, month, 0).getDate(); // 28 - 31

    // Initialize daily slots
    const daysData = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
      total: 0,
      practice: 0,
      guide: 0,
      passed: 0,
      scores: [],
      duration_sec: 0
    }));

    // Aggregate sessions for this month
    sessions.forEach(sess => {
      const timeStr = sess.finished_at || sess.started_at;
      if (!timeStr) return;
      const dateObj = new Date(timeStr.replace(' ', 'T'));
      if (isNaN(dateObj.getTime())) return;
      if (dateObj.getFullYear() === year && (dateObj.getMonth() + 1) === month) {
        const d = dateObj.getDate();
        if (d >= 1 && d <= totalDays) {
          const item = daysData[d - 1];
          item.total++;
          const isPractice = sess.mode === 'Thực hành' || sess.mode === 'practice' || sess.session_type === 'practice';
          if (isPractice) {
            item.practice++;
            if (sess.is_passed === true || sess.status === 'Đạt' || sess.status === 'Hoàn thành') {
              item.passed++;
            }
            if (sess.score != null) item.scores.push(Number(sess.score));
          } else {
            item.guide++;
          }
          item.duration_sec += (sess.duration_sec || 0);
        }
      }
    });

    const totalMonthSessions = daysData.reduce((sum, d) => sum + d.total, 0);
    const totalMonthPractice = daysData.reduce((sum, d) => sum + d.practice, 0);
    const totalMonthGuide = daysData.reduce((sum, d) => sum + d.guide, 0);
    const totalMonthPassed = daysData.reduce((sum, d) => sum + d.passed, 0);

    const width = elTrendChartContainer.clientWidth || 680;
    const height = 220;
    const padding = { top: 25, right: 25, bottom: 35, left: 42 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const peakSessions = Math.max(0, ...daysData.map(d => d.total));
    const tickStep = peakSessions <= 4 ? 1 : (peakSessions <= 8 ? 2 : (peakSessions <= 16 ? 4 : Math.ceil(peakSessions / 4)));
    const yMax = Math.max(4, Math.ceil(peakSessions / tickStep) * tickStep);
    const yAt = val => padding.top + chartH - (val / yMax * chartH);

    // Y Grid lines
    let gridSvg = '';
    const yTicksCount = Math.round(yMax / tickStep);
    for (let i = 0; i <= yTicksCount; i++) {
      const val = i * tickStep;
      const y = yAt(val);
      gridSvg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${y + 4}" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="end">${val}</text>
      `;
    }

    // Y Axis Title
    const yTitleSvg = `
      <text x="14" y="${padding.top + chartH / 2}" font-size="10.5" font-weight="700" fill="#64748b" text-anchor="middle" transform="rotate(-90 14 ${padding.top + chartH / 2})">Lượt / ngày</text>
    `;

    // Columns / Bars
    const colStep = chartW / totalDays;
    const barW = Math.max(6, Math.min(15, colStep * 0.68));

    let barsSvg = '';
    let xLabelsSvg = '';

    daysData.forEach((d, idx) => {
      const x = padding.left + (idx + 0.5) * colStep;
      
      // X labels on days: 1, 5, 10, 15, 20, 25, totalDays
      const isLabeled = d.day === 1 || d.day % 5 === 0 || d.day === totalDays;
      if (isLabeled) {
        xLabelsSvg += `
          <text x="${x}" y="${height - 10}" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">${d.day}</text>
        `;
      }

      if (d.total > 0) {
        const barH = (d.total / yMax) * chartH;
        const barY = padding.top + chartH - barH;
        const tooltip = `Ngày ${d.day}/${String(month).padStart(2, '0')}/${year}: ${d.total} lượt (${d.practice} thực hành, ${d.guide} hướng dẫn)${d.passed > 0 ? ` • ${d.passed} bài đạt` : ''}`;
        
        barsSvg += `
          <g class="chart-freq-group" tabindex="0">
            <title>${escapeHTML(tooltip)}</title>
            <rect x="${x - barW / 2}" y="${barY}" width="${barW}" height="${barH}" rx="3" fill="url(#freqBarGrad)" class="chart-freq-bar" />
            <circle cx="${x}" cy="${barY}" r="3.5" fill="#4f46e5" stroke="#ffffff" stroke-width="1.5" />
            <text x="${x}" y="${barY - 6}" font-size="10.5" font-weight="700" fill="#4338ca" text-anchor="middle">${d.total}</text>
          </g>
        `;
      } else {
        barsSvg += `
          <circle cx="${x}" cy="${padding.top + chartH}" r="1.5" fill="#cbd5e1" opacity="0.6">
            <title>Ngày ${d.day}/${String(month).padStart(2, '0')}: 0 lượt</title>
          </circle>
        `;
      }
    });

    const summaryHtml = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; flex-wrap: wrap; gap: 8px;">
        <div class="chart-summary-chip">
          <span>📊 Tổng tháng ${String(month).padStart(2, '0')}/${year}:</span>
          <strong>${totalMonthSessions} lượt thực hiện</strong>
          <span>(${totalMonthPractice} thực hành, ${totalMonthGuide} hướng dẫn • ${totalMonthPassed} bài đạt)</span>
        </div>
        <div style="font-size: 11.5px; color: var(--text-muted);">
          Trục ngang: ngày 1 đến ${totalDays} trong tháng ${String(month).padStart(2, '0')}/${year}
        </div>
      </div>
    `;

    elTrendChartContainer.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="freqBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="100%" stop-color="#818cf8" stop-opacity="0.8" />
          </linearGradient>
        </defs>
        ${gridSvg}
        ${yTitleSvg}
        ${barsSvg}
        ${xLabelsSvg}
      </svg>
      ${summaryHtml}
    `;
  }

  function renderTrendChart(trend) {
    if (!elTrendChartContainer) return;
    elTrendChartContainer.innerHTML = '';

    if (!trend || trend.length === 0) {
      elTrendChartContainer.innerHTML = `
        <div class="empty-state-box" style="padding: 20px;">
          <div class="empty-state-icon">📈</div>
          <div class="empty-state-text">Chưa có đủ dữ liệu hoạt động thực hành để vẽ biểu đồ.</div>
        </div>
      `;
      return;
    }

    // Take last 14 days
    const recentTrend = trend.slice(-14);
    const width = elTrendChartContainer.clientWidth || 680;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 35, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxSessions = Math.max(...recentTrend.map(d => d.total_sessions), 5);
    const maxScore = 100;

    // X scale
    const stepX = recentTrend.length > 1 ? chartW / (recentTrend.length - 1) : chartW / 2;

    // Points calculation for Score line
    const scorePoints = recentTrend.map((d, i) => {
      const x = padding.left + (recentTrend.length > 1 ? i * stepX : chartW / 2);
      const scoreVal = d.avg_score != null ? d.avg_score : 0;
      const y = padding.top + chartH - (scoreVal / maxScore) * chartH;
      return { x, y, date: d.date, score: d.avg_score, sessions: d.total_sessions, practice: d.practice_count, guide: d.guide_count };
    });

    let pathD = '';
    let areaD = '';

    if (scorePoints.length === 1) {
      const p = scorePoints[0];
      pathD = `M ${padding.left} ${p.y} L ${padding.left + chartW} ${p.y}`;
      areaD = `M ${padding.left} ${p.y} L ${padding.left + chartW} ${p.y} L ${padding.left + chartW} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;
    } else {
      pathD = `M ${scorePoints[0].x} ${scorePoints[0].y}`;
      for (let i = 1; i < scorePoints.length; i++) {
        const prev = scorePoints[i - 1];
        const curr = scorePoints[i];
        const cpX1 = prev.x + (curr.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (curr.x - prev.x) / 2;
        const cpY2 = curr.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
      }
      areaD = `${pathD} L ${scorePoints[scorePoints.length - 1].x} ${padding.top + chartH} L ${scorePoints[0].x} ${padding.top + chartH} Z`;
    }

    // Grid lines (0, 25, 50, 75, 100)
    let gridSvg = '';
    [0, 25, 50, 75, 100].forEach(val => {
      const y = padding.top + chartH - (val / maxScore) * chartH;
      gridSvg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${padding.left - 8}" y="${y + 4}" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="end">${val}</text>
      `;
    });

    // X Labels
    let xLabelsSvg = '';
    scorePoints.forEach((p, idx) => {
      // Show every 2nd or 3rd label if many items
      const showLabel = recentTrend.length <= 7 || idx % Math.ceil(recentTrend.length / 7) === 0 || idx === recentTrend.length - 1;
      if (showLabel) {
        const parts = p.date.split('-');
        const dateStr = parts.length === 3 ? `${parts[2]}/${parts[1]}` : p.date;
        xLabelsSvg += `
          <text x="${p.x}" y="${height - 10}" font-size="11" font-weight="500" fill="#64748b" text-anchor="middle">${dateStr}</text>
        `;
      }
    });

    // Circles / Tooltip triggers
    let pointsSvg = '';
    scorePoints.forEach(p => {
      const scoreDisplay = p.score != null ? `${p.score} đ` : 'Chưa chấm';
      const tooltipText = `${p.date}: Điểm TB ${scoreDisplay} (${p.practice} thực hành, ${p.guide} hướng dẫn)`;
      pointsSvg += `
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#4f46e5" stroke="#ffffff" stroke-width="2.5" class="chart-dot">
          <title>${escapeHTML(tooltipText)}</title>
        </circle>
      `;
    });

    elTrendChartContainer.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${gridSvg}
        <path d="${areaD}" fill="url(#scoreAreaGradient)" />
        <path d="${pathD}" fill="none" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" />
        ${pointsSvg}
        ${xLabelsSvg}
      </svg>
    `;
  }

  function renderDeviceProgress(devices) {
    if (!elDeviceGrid) return;
    elDeviceGrid.innerHTML = '';

    if (!devices || devices.length === 0) {
      elDeviceGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📱</div>
          <div class="empty-state-text">Chưa có danh sách thiết bị nào được giao cho lớp của bạn.</div>
        </div>
      `;
      return;
    }

    devices.forEach(dev => {
      const card = document.createElement('div');
      card.className = 'device-card';

      const pct = dev.progress_percent || 0;
      let badgeClass = 'unstarted';
      let badgeLabel = 'Chưa bắt đầu';
      if (pct === 100) {
        badgeClass = 'complete';
        badgeLabel = '✓ Đã hoàn thành';
      } else if (pct > 0 || dev.in_progress_labs > 0) {
        badgeClass = 'in-progress';
        badgeLabel = `${dev.passed_labs}/${dev.total_labs} Bài`;
      }

      const labsHtml = (dev.labs || []).map(lab => {
        let iconClass = 'assigned';
        let iconSymbol = '○';
        let statusTitle = 'Chưa làm';
        if (lab.status === 'passed') {
          iconClass = 'passed';
          iconSymbol = '✓';
          statusTitle = 'Đã đạt';
        } else if (lab.status === 'in_progress') {
          iconClass = 'in_progress';
          iconSymbol = '⏳';
          statusTitle = 'Chưa đạt';
        }

        const attemptInfo = lab.first_pass_attempt_no
          ? `(Đạt lần ${lab.first_pass_attempt_no})`
          : '';

        return `
          <div class="lab-item-row">
            <div class="lab-left-info" title="${escapeHTML(lab.lab_name)}">
              <div class="lab-status-icon ${iconClass}" title="${statusTitle}">
                ${iconSymbol}
              </div>
              <span class="lab-title-text">${escapeHTML(lab.lab_name)}</span>
              ${attemptInfo ? `<span class="lab-attempt-tag">${attemptInfo}</span>` : ''}
            </div>
            <a class="btn-start-lab" href="/portal.html?device=${encodeURIComponent(dev.device_id)}&lab=${encodeURIComponent(lab.lab_id)}&mode=practice">
              ${lab.status === 'passed' ? 'Luyện lại ↻' : 'Làm bài →'}
            </a>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="device-card-header">
          <div class="device-title-wrap">
            <div class="device-icon-box">📶</div>
            <div>
              <div class="device-name">${escapeHTML(dev.device_name)}</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">${escapeHTML(dev.model || dev.device_id)}</div>
            </div>
          </div>
          <span class="device-progress-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        
        <div class="metric-progress-wrap" style="height: 6px;">
          <div class="metric-progress-bar ${pct === 100 ? 'emerald' : 'indigo'}" style="width: ${pct}%;"></div>
        </div>

        <div class="lab-checklist">
          ${labsHtml}
        </div>
      `;

      elDeviceGrid.appendChild(card);
    });
  }

  function populateDeviceFilter(devices) {
    if (!elFilterDevice) return;
    elFilterDevice.innerHTML = '<option value="all">Tất cả thiết bị</option>';
    devices.forEach(dev => {
      const opt = document.createElement('option');
      opt.value = dev.device_id;
      opt.textContent = dev.device_name;
      elFilterDevice.appendChild(opt);
    });
  }

  function applySessionFilters() {
    if (!_dashboardData) return;
    const allSessions = (_dashboardData.sessions || []).filter(s =>
      s.status === 'completed' || s.status === 'failed'
    );

    const search = (elFilterSearch ? elFilterSearch.value.trim().toLowerCase() : '');
    const mode = (elFilterMode ? elFilterMode.value : 'all');
    const result = (elFilterResult ? elFilterResult.value : 'all');
    const deviceId = (elFilterDevice ? elFilterDevice.value : 'all');

    _filteredSessions = allSessions.filter(s => {
      if (mode !== 'all') {
        const sMode = s.mode || (s.session_type === 'guide' ? 'Hướng dẫn' : 'Thực hành');
        if (mode === 'Thực hành' && sMode !== 'Thực hành') return false;
        if (mode === 'Hướng dẫn' && sMode !== 'Hướng dẫn') return false;
      }

      if (result !== 'all') {
        if (result === 'passed' && s.is_passed !== true) return false;
        if (result === 'failed' && s.status !== 'failed') return false;
        if (result === 'ungraded' && !((s.mode !== 'Hướng dẫn' && s.session_type !== 'guide') && s.status === 'completed' && s.is_passed == null)) return false;
        if (result === 'not_scored' && !(s.mode === 'Hướng dẫn' || s.session_type === 'guide')) return false;
      }

      if (deviceId !== 'all') {
        if (s.device_id !== deviceId) return false;
      }

      if (search) {
        const matchLab = (s.lab_name || '').toLowerCase().includes(search);
        const matchDev = (s.device_name || '').toLowerCase().includes(search);
        const matchId = String(s.id).includes(search);
        if (!matchLab && !matchDev && !matchId) return false;
      }

      return true;
    });

    _currentPage = 1;
    renderSessionsTable();
  }

  function renderSessionsTable() {
    if (!elSessionsBody) return;
    elSessionsBody.innerHTML = '';

    if (elSessionsCount) {
      elSessionsCount.textContent = `(${_filteredSessions.length} phiên)`;
    }

    if (_filteredSessions.length === 0) {
      elSessionsBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
            <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
            <div>Không tìm thấy phiên thực hành nào phù hợp với bộ lọc.</div>
          </td>
        </tr>
      `;
      updatePaginationControls(0);
      return;
    }

    const totalPages = Math.ceil(_filteredSessions.length / PAGE_SIZE) || 1;
    const startIndex = (_currentPage - 1) * PAGE_SIZE;
    const pageItems = _filteredSessions.slice(startIndex, startIndex + PAGE_SIZE);

    pageItems.forEach(s => {
      const tr = document.createElement('tr');

      // Date format
      const dateStr = formatDateTime(s.finished_at || s.started_at);

      // Mode Badge
      const isGuide = s.mode === 'Hướng dẫn' || s.session_type === 'guide';
      const modeBadge = isGuide
        ? '<span class="badge-pill mode-guide">💡 Hướng dẫn</span>'
        : '<span class="badge-pill mode-practice">⚡ Thực hành</span>';

      // Result Badge
      let resultBadge = isGuide
        ? '<span class="badge-pill result-ungraded">Không chấm</span>'
        : '<span class="badge-pill result-ungraded">Chưa có kết quả</span>';
      if (s.is_passed === true) {
        resultBadge = '<span class="badge-pill result-passed">Đạt</span>';
      } else if (s.is_passed === false) {
        resultBadge = '<span class="badge-pill result-failed">Chưa đạt</span>';
      }

      // Score
      let scoreHtml = '<span style="color: var(--text-muted);">-</span>';
      if (s.score != null) {
        const sc = Number(s.score);
        const scClass = sc >= 80 ? 'high' : (sc >= 50 ? 'mid' : 'low');
        scoreHtml = `<span class="score-text ${scClass}">${sc.toFixed(1)}</span>`;
      }

      // Duration
      const durStr = s.duration_sec ? formatSeconds(s.duration_sec) : '-';

      // Attempt
      const attemptStr = s.practice_attempt_no ? `#${s.practice_attempt_no}` : (isGuide ? 'Hướng dẫn' : '-');

      tr.innerHTML = `
        <td style="color: var(--text-secondary); font-size: 12.5px; white-space: nowrap;">${dateStr}</td>
        <td><strong>${escapeHTML(s.device_name || s.device_id || '—')}</strong></td>
        <td>${escapeHTML(s.lab_name || s.lab_id || '—')}</td>
        <td>${modeBadge}</td>
        <td>${resultBadge}</td>
        <td>${scoreHtml}</td>
        <td style="font-family: monospace; font-size: 12.5px;">${durStr}</td>
        <td style="color: var(--text-muted); text-align: center;">${attemptStr}</td>
      `;

      elSessionsBody.appendChild(tr);
    });

    updatePaginationControls(totalPages);
  }

  function updatePaginationControls(totalPages) {
    if (elPageInfo) {
      elPageInfo.textContent = totalPages > 0 ? `Trang ${_currentPage} / ${totalPages}` : 'Trang 0 / 0';
    }
    if (elBtnPrevPage) {
      elBtnPrevPage.disabled = _currentPage <= 1;
    }
    if (elBtnNextPage) {
      elBtnNextPage.disabled = _currentPage >= totalPages || totalPages === 0;
    }
  }

  function showLoading(show) {
    if (elLoading) elLoading.style.display = show ? 'flex' : 'none';
    if (elContent) elContent.style.display = show ? 'none' : 'flex';
    if (elError) elError.style.display = 'none';
  }

  function showError(msg) {
    if (elLoading) elLoading.style.display = 'none';
    if (elContent) elContent.style.display = 'none';
    if (elError) {
      elError.style.display = 'flex';
      if (elErrorMessage) elErrorMessage.textContent = msg;
    }
  }

  function handleLogout() {
    fetch('/api/index.php/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      window.location.href = '/login/';
    });
  }

  // ── Student AI Learning Coach & Tutor (Part 2) ─────────────────────

  function setupStudentAiEvents() {
    if (studentAiFab) {
      studentAiFab.addEventListener('click', openAiTutorDrawer);
    }
    if (btnHeroOpenTutor) {
      btnHeroOpenTutor.addEventListener('click', openAiTutorDrawer);
    }
    if (studentAiCloseBtn) {
      studentAiCloseBtn.addEventListener('click', closeAiTutorDrawer);
    }
    if (studentAiBackdrop) {
      studentAiBackdrop.addEventListener('click', closeAiTutorDrawer);
    }
    if (studentAiSendBtn) {
      studentAiSendBtn.addEventListener('click', handleStudentAiSend);
    }
    if (studentAiInput) {
      studentAiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleStudentAiSend();
        }
      });
    }
    if (studentAiChipsBar) {
      studentAiChipsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.student-chip-btn');
        if (btn && btn.dataset.query) {
          sendStudentChatMessage(btn.dataset.query);
        }
      });
    }
  }

  function openAiTutorDrawer() {
    if (studentAiDrawer) studentAiDrawer.classList.add('active');
    if (studentAiBackdrop) studentAiBackdrop.classList.add('active');
    if (studentAiInput) {
      setTimeout(() => studentAiInput.focus(), 300);
    }
  }

  function closeAiTutorDrawer() {
    if (studentAiDrawer) studentAiDrawer.classList.remove('active');
    if (studentAiBackdrop) studentAiBackdrop.classList.remove('active');
  }

  function fetchStudentAiAdvice() {
    fetch('/api/index.php/ai/student-advice', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data || !data.data) return;
        _studentAiAdvice = data.data;
        renderStudentAiCoach(_studentAiAdvice);
      })
      .catch(err => {
        console.warn('[PersonalDashboard] Error fetching AI advice:', err);
      });
  }

  function renderStudentAiCoach(advice) {
    if (!advice) return;
    const student = advice.student || {};
    const prog = advice.progress || {};
    const nextLab = advice.next_recommended_lab;
    const mistakes = advice.personal_mistakes || [];

    // 1. Status Pill
    if (elAiStatusPill) {
      elAiStatusPill.className = `ai-status-pill ${prog.status_level || 'on_track'}`;
      let icon = '🎯';
      if (prog.status_level === 'needs_acceleration') icon = '⚡';
      if (prog.status_level === 'excellent') icon = '⭐';
      elAiStatusPill.textContent = `${icon} ${prog.status_text || 'Đang bám sát tiến độ'}`;
    }

    // 2. Feedback Text
    if (elAiFeedbackText) {
      elAiFeedbackText.innerHTML = formatMarkdown(advice.ai_feedback || 'Hãy tiếp tục rèn luyện các bài thực hành được giao.');
    }

    // 3. Mistake Alert
    if (elAiMistakeAlert && elAiMistakeContent) {
      if (mistakes.length > 0) {
        const m = mistakes[0];
        elAiMistakeContent.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong>⚠️ Điểm nghẽn từ bài vừa làm: ${escapeHTML(m.lab_name)} (${escapeHTML(m.device_name)})</strong>
            <span class="ai-mistake-pill actual" style="font-size: 11px;">${escapeHTML(m.category)}</span>
          </div>
          <div style="margin-bottom: 8px; color: #78350f;">
            💡 <strong>Lời khuyên AI:</strong> ${escapeHTML(m.tip)}
          </div>
          <div class="ai-mistake-details">
            <span class="ai-mistake-pill">🎯 Tiêu chí: <strong>${escapeHTML(m.rule_name)}</strong></span>
            <span class="ai-mistake-pill expected">✓ Yêu cầu: <code>${escapeHTML(m.expected)}</code></span>
            <span class="ai-mistake-pill actual">✖ Thực tế: <code>${escapeHTML(m.actual || '(Chưa lưu)')}</code></span>
          </div>
        `;
        elAiMistakeAlert.style.display = 'block';
      } else {
        elAiMistakeAlert.style.display = 'none';
      }
    }

    // 4. Next Lab Card
    if (nextLab) {
      if (elAiNextLabName) elAiNextLabName.textContent = nextLab.lab_name;
      if (elAiNextDeviceName) elAiNextDeviceName.textContent = `Thiết bị: ${nextLab.device_name}`;
      if (btnAiLaunchLab) {
        btnAiLaunchLab.href = nextLab.portal_url || `/portal.html?device=${nextLab.device_id}&lab=${nextLab.lab_id}&mode=practice`;
        btnAiLaunchLab.style.display = 'inline-flex';
      }
    } else {
      if (elAiNextLabName) elAiNextLabName.textContent = '🎉 Bạn đã hoàn thành toàn bộ bài tập!';
      if (elAiNextDeviceName) elAiNextDeviceName.textContent = 'Tất cả bài thực hành đã đạt tiêu chuẩn 100%';
      if (btnAiLaunchLab) btnAiLaunchLab.style.display = 'none';
    }

    initStudentTutorDrawer(advice);
  }

  function initStudentTutorDrawer(advice) {
    if (!studentAiChatBody || studentAiChatBody.children.length > 0) return;
    const student = advice.student || {};
    const prog = advice.progress || {};
    const name = student.display_name || 'bạn';

    const welcomeMsg = `Chào bạn **${name}**! 👋\n\nTôi là **Gia Sư AI** hỗ trợ học tập mạng. Hiện bạn đã hoàn thành **${prog.passed_count || 0}/${prog.total_assigned || 0} bài** (${prog.completion_pct || 0}%).\n\nBạn có thể hỏi tôi:\n- *Tôi cần làm bài nào tiếp theo?*\n- *Tại sao bài trước của tôi bị trừ điểm?*\n- *Hướng dẫn cấu hình PPPoE chuẩn quy trình?*`;
    appendStudentChatMessage('ai', welcomeMsg);
  }

  function handleStudentAiSend() {
    if (!studentAiInput) return;
    const text = studentAiInput.value.trim();
    if (!text) return;
    studentAiInput.value = '';
    sendStudentChatMessage(text);
  }

  function sendStudentChatMessage(text) {
    if (_aiChatLoading) return;
    _aiChatLoading = true;
    if (studentAiSendBtn) studentAiSendBtn.disabled = true;

    appendStudentChatMessage('user', text);
    const typingId = appendStudentTypingIndicator();

    fetch('/api/index.php/ai/student-chat', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message: text })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        removeStudentTypingIndicator(typingId);
        const data = json.data || {};
        appendStudentChatMessage('ai', data.answer || 'Tôi đã tiếp nhận câu hỏi của bạn.', data.model);
        if (data.suggested_questions && data.suggested_questions.length > 0) {
          updateStudentPromptChips(data.suggested_questions);
        }
      })
      .catch(err => {
        removeStudentTypingIndicator(typingId);
        appendStudentChatMessage('ai', `⚠️ Không thể kết nối với Gia Sư AI (${err.message}). Vui lòng thử lại.`);
      })
      .finally(() => {
        _aiChatLoading = false;
        if (studentAiSendBtn) studentAiSendBtn.disabled = false;
      });
  }

  function appendStudentChatMessage(role, text, model = null) {
    if (!studentAiChatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `student-chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'student-chat-avatar';
    avatar.textContent = role === 'ai' ? '🤖' : '👤';

    let badgeHtml = '';
    if (role === 'ai' && (model === 'gemini-1.5-flash' || model === 'gemini-2.0-flash' || (model && model.startsWith('gemini')))) {
      badgeHtml = `<div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 0.68rem; font-weight: 700; margin-bottom: 8px;">
        <span>⚡ Powered by Google Gemini AI</span>
      </div>`;
    } else if (role === 'ai' && model === 'network-expert-engine') {
      badgeHtml = `<div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-size: 0.68rem; font-weight: 700; margin-bottom: 8px;">
        <span>🛡️ UTH NetLab Network Expert Engine</span>
      </div>`;
    } else if (role === 'ai' && model === 'local-rag') {
      badgeHtml = `<div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #f1f5f9; color: #475569; font-size: 0.68rem; font-weight: 600; margin-bottom: 8px;">
        <span>ℹ️ Local RAG Engine</span>
      </div>`;
    }

    const bubble = document.createElement('div');
    bubble.className = 'student-chat-bubble';
    bubble.innerHTML = role === 'user' ? escapeHTML(text).replace(/\n/g, '<br>') : (badgeHtml + formatMarkdown(text));

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    studentAiChatBody.appendChild(msgDiv);
    studentAiChatBody.scrollTop = studentAiChatBody.scrollHeight;
  }

  function appendStudentTypingIndicator() {
    if (!studentAiChatBody) return null;
    const id = 'student_typing_' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'student-chat-msg ai';
    msgDiv.id = id;

    const avatar = document.createElement('div');
    avatar.className = 'student-chat-avatar';
    avatar.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'student-chat-bubble';
    bubble.style.color = '#64748b';
    bubble.innerHTML = '<em>Gia sư AI đang phân tích bài thi và chuẩn bị câu trả lời...</em>';

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    studentAiChatBody.appendChild(msgDiv);
    studentAiChatBody.scrollTop = studentAiChatBody.scrollHeight;
    return id;
  }

  function removeStudentTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function updateStudentPromptChips(questions) {
    if (!studentAiChipsBar || !questions || questions.length === 0) return;
    studentAiChipsBar.innerHTML = '';
    questions.forEach(q => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'student-chip-btn';
      btn.dataset.query = q;
      btn.textContent = q;
      studentAiChipsBar.appendChild(btn);
    });
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = escapeHTML(text);

    escaped = escaped.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    escaped = escaped.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
    escaped = escaped.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    escaped = escaped.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    escaped = escaped.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li>$2</li>');
    escaped = escaped.replace(/\n\n/g, '</p><p>');
    escaped = escaped.replace(/\n/g, '<br>');

    return `<p>${escaped}</p>`;
  }

  // ── Helper Utilities ───────────────────────────────────────────────

  function formatDateTime(isoStr) {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${hh}:${mm} - ${dd}/${MM}/${yyyy}`;
    } catch {
      return isoStr;
    }
  }

  function formatSeconds(sec) {
    if (!sec || sec <= 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const h = Math.floor(m / 60);
    if (h > 0) {
      return `${h}h ${String(m % 60).padStart(2, '0')}m`;
    }
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }

  function formatDurationHuman(sec) {
    if (!sec || sec <= 0) return { primary: '0m', secondary: '0 phút thực hành' };
    const m = Math.floor(sec / 60);
    const h = Math.floor(m / 60);
    const remM = m % 60;
    if (h > 0) {
      return { primary: `${h}h ${remM}m`, secondary: `${m} phút tổng cộng` };
    }
    return { primary: `${m}m`, secondary: `${sec} giây thực hành` };
  }

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DUOLINGO GAMIFICATION, STREAKS & REWARDS MODULE
  // ══════════════════════════════════════════════════════════════════════════

  function fetchGamificationStatus() {
    fetch('/api/index.php/gamification/status', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json.success && json.data) {
          _gamificationData = json.data;
          renderGamification(_gamificationData);
        }
      })
      .catch(err => {
        console.warn('[PersonalDashboard] Error loading gamification status:', err);
      });
  }

  function renderGamification(data) {
    if (!data) return;

    const streak = data.current_streak || 0;
    const longest = data.longest_streak || 0;
    const coins = data.total_points || 0;
    const freeze = data.streak_freeze_count || 0;
    const speedCount = data.speed_records_count || 0;

    if (elStreakCountVal) elStreakCountVal.textContent = streak;
    if (elStreakFlameIcon) {
      elStreakFlameIcon.textContent = streak > 0 ? '🔥' : '❄️';
      elStreakFlameIcon.className = streak > 0 ? 'streak-flame-icon animated-flame' : 'streak-flame-icon';
    }
    if (elStreakLongestBadge) {
      elStreakLongestBadge.textContent = `🏆 Kỷ lục: ${longest} ngày`;
    }
    if (elStreakFreezeBadge) {
      elStreakFreezeBadge.textContent = `🛡️ ${freeze} khiên`;
    }

    // Nav Top Streak Pill
    if (elNavStreakPill) {
      elNavStreakPill.style.display = 'inline-flex';
      if (elNavStreakDays) elNavStreakDays.textContent = streak;
      if (elNavStreakCoins) elNavStreakCoins.textContent = Number(coins).toLocaleString();
    }

    // Modal user coins
    if (elModalUserCoins) {
      elModalUserCoins.textContent = Number(coins).toLocaleString();
    }

    // Netcoins balance
    if (elNetcoinsBalanceVal) {
      elNetcoinsBalanceVal.textContent = Number(coins).toLocaleString();
    }
    if (elNetcoinsSpeedSub) {
      elNetcoinsSpeedSub.textContent = `⚡ ${speedCount} bài đạt Top tốc độ`;
    }

    // Motivational message
    if (elStreakMotivationalText) {
      elStreakMotivationalText.innerHTML = formatMarkdown(data.duo_message || 'Hãy duy trì chuỗi học tập đều đặn mỗi ngày!');
    }

    // Daily check-in button state
    if (btnDailyCheckin) {
      if (data.today_completed) {
        btnDailyCheckin.disabled = true;
        btnDailyCheckin.innerHTML = '<span>✅ Đã Điểm Danh</span>';
      } else {
        btnDailyCheckin.disabled = false;
        btnDailyCheckin.innerHTML = '<span>📅 Điểm Danh</span>';
      }
    }

    // Week Calendar (Mon -> Sun)
    if (elStreakWeekCalendar && Array.isArray(data.week_calendar)) {
      elStreakWeekCalendar.innerHTML = '';
      data.week_calendar.forEach(wd => {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell' + (wd.has_activity ? ' active' : '') + (wd.is_today ? ' today' : '');
        cell.title = `${wd.date}: ${wd.has_activity ? 'Đã hoàn thành' : 'Chưa có hoạt động'}`;

        const label = document.createElement('span');
        label.className = 'cal-day-label';
        label.textContent = wd.day_label || wd.day_name;

        const circle = document.createElement('div');
        circle.className = 'cal-day-circle';
        if (wd.has_activity) {
          circle.innerHTML = wd.is_today ? '🔥' : '✓';
        } else {
          const shortLabel = (wd.day_label || wd.day_name || '').replace('T', '');
          circle.innerHTML = shortLabel === 'CN' ? 'CN' : (shortLabel || '•');
        }

        cell.appendChild(label);
        cell.appendChild(circle);
        elStreakWeekCalendar.appendChild(cell);
      });
    }

    // History count & list
    if (elHistoryCount) {
      elHistoryCount.textContent = (data.recent_redemptions || []).length;
    }
    renderRedemptionsHistory(data.recent_redemptions || []);
  }

  function handleDailyCheckin() {
    if (btnDailyCheckin) btnDailyCheckin.disabled = true;
    fetch('/api/index.php/gamification/check-in', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const award = json.data?.activity?.points_earned || 15;
          const streak = json.data?.streak?.current_streak || 1;
          alert(`🎉 Điểm danh thành công! Bạn nhận được +${award} NetCoins.\n🔥 Chuỗi hiện tại: ${streak} ngày liên tiếp!`);
          fetchGamificationStatus();
        } else {
          alert(json.message || 'Không thể điểm danh lúc này.');
        }
      })
      .catch(err => {
        console.error('[CheckIn] Error:', err);
        alert('Lỗi kết nối khi điểm danh.');
      })
      .finally(() => {
        if (btnDailyCheckin && !_gamificationData?.today_completed) {
          btnDailyCheckin.disabled = false;
        }
      });
  }

  function openRewardModal() {
    if (elRewardModal && elRewardModalBackdrop) {
      elRewardModalBackdrop.removeAttribute('hidden');
      elRewardModal.removeAttribute('hidden');
      elRewardModalBackdrop.classList.add('active');
      elRewardModal.classList.add('active');
      elRewardModalBackdrop.style.setProperty('display', 'block', 'important');
      elRewardModal.style.setProperty('display', 'flex', 'important');
      if (elModalUserCoins && _gamificationData) {
        elModalUserCoins.textContent = Number(_gamificationData.total_points || 0).toLocaleString();
      }
      fetchRewardsCatalog();
      switchRewardTab('catalog');
    }
  }

  function closeRewardModal() {
    if (elRewardModal) {
      elRewardModal.classList.remove('active');
      elRewardModal.classList.remove('show');
      elRewardModal.style.setProperty('display', 'none', 'important');
      elRewardModal.setAttribute('hidden', '');
    }
    if (elRewardModalBackdrop) {
      elRewardModalBackdrop.classList.remove('active');
      elRewardModalBackdrop.classList.remove('show');
      elRewardModalBackdrop.style.setProperty('display', 'none', 'important');
      elRewardModalBackdrop.setAttribute('hidden', '');
    }
  }

  window.closeRewardModalGlobal = closeRewardModal;

  function switchRewardTab(tab) {
    [tabBtnCatalog, tabBtnHistory, tabBtnSpeed].forEach(btn => {
      if (btn) btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    if (tabContentCatalog) tabContentCatalog.style.display = tab === 'catalog' ? 'block' : 'none';
    if (tabContentHistory) tabContentHistory.style.display = tab === 'history' ? 'block' : 'none';
    if (tabContentSpeed) {
      tabContentSpeed.style.display = tab === 'speed' ? 'block' : 'none';
      if (tab === 'speed') fetchSpeedLeaderboard();
    }
  }

  function fetchRewardsCatalog() {
    if (!elRewardItemsGrid) return;
    elRewardItemsGrid.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Đang tải danh sách quà tặng...</div>';

    fetch('/api/index.php/gamification/rewards', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          _rewardsCatalog = json.data;
          renderRewardsCatalog();
        }
      })
      .catch(err => {
        console.error('[Rewards] Error loading catalog:', err);
        elRewardItemsGrid.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444;">Không thể tải danh sách quà tặng.</div>';
      });
  }

  function renderRewardsCatalog() {
    if (!elRewardItemsGrid) return;
    if (_rewardsCatalog.length === 0) {
      elRewardItemsGrid.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Hiện chưa có phần thưởng nào.</div>';
      return;
    }

    const userCoins = _gamificationData?.total_points || 0;
    elRewardItemsGrid.innerHTML = '';

    _rewardsCatalog.forEach(item => {
      const card = document.createElement('div');
      card.className = 'reward-card';

      const canAfford = userCoins >= item.points_cost;

      card.innerHTML = `
        <div class="reward-card-top">
          <div class="reward-item-icon">${escapeHTML(item.icon || '🎁')}</div>
          <div class="reward-card-info">
            <span class="reward-card-category ${escapeHTML(item.category)}">${item.category === 'academic' ? 'Học tập' : (item.category === 'voucher' ? 'Voucher' : 'Lưu niệm')}</span>
            <div class="reward-item-title">${escapeHTML(item.title)}</div>
            <div class="reward-item-desc">${escapeHTML(item.description)}</div>
          </div>
        </div>
        <div class="reward-card-bottom">
          <div class="reward-cost-tag">
            <span>🪙</span>
            <span>${Number(item.points_cost).toLocaleString()} xu</span>
          </div>
          <button type="button" class="btn-redeem-gift" ${canAfford ? '' : 'disabled'} data-item-id="${escapeHTML(item.item_id)}" data-title="${escapeHTML(item.title)}" data-cost="${item.points_cost}">
            ${canAfford ? 'Đổi Quà' : 'Thiếu xu'}
          </button>
        </div>
      `;

      const btnRedeem = card.querySelector('.btn-redeem-gift');
      if (btnRedeem && canAfford) {
        btnRedeem.addEventListener('click', () => {
          handleRedeemReward(item.item_id, item.title, item.points_cost);
        });
      }

      elRewardItemsGrid.appendChild(card);
    });
  }

  function handleRedeemReward(itemId, itemTitle, pointsCost) {
    const note = prompt(`🎁 Bạn xác nhận đổi phần quà:\n"${itemTitle}" với chi phí ${pointsCost} NetCoins?\n\nNhập lời nhắn hoặc ghi chú gửi Giảng viên (ví dụ: Tên môn học cần cộng điểm, địa chỉ nhận quà lưu niệm...):`, '');
    if (note === null) return; // User canceled

    fetch('/api/index.php/gamification/redeem', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        item_id: itemId,
        notes: note
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          alert(`🎉 Đổi quà thành công!\nYêu cầu của bạn đã được chuyển tới Giảng viên để xét duyệt và trao quà. Số dư NetCoins mới: ${json.data?.new_balance} xu.`);
          fetchGamificationStatus();
          switchRewardTab('history');
        } else {
          alert(json.message || 'Không thể đổi quà lúc này.');
        }
      })
      .catch(err => {
        console.error('[Redeem] Error:', err);
        alert('Lỗi kết nối khi gửi yêu cầu đổi quà.');
      });
  }

  function renderRedemptionsHistory(history) {
    if (!elRewardHistoryList) return;
    if (!history || history.length === 0) {
      elRewardHistoryList.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Bạn chưa đổi phần quà nào. Hãy tích lũy NetCoins và đổi quà nhé!</div>';
      return;
    }

    elRewardHistoryList.innerHTML = '';
    history.forEach(h => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const statusMap = {
        'pending': { text: '⏳ Chờ Giảng viên duyệt', cls: 'pending' },
        'fulfilled': { text: '✅ Đã trao quà', cls: 'fulfilled' },
        'rejected': { text: '❌ Bị từ chối (Đã hoàn xu)', cls: 'rejected' }
      };
      const st = statusMap[h.status] || { text: h.status, cls: 'pending' };
      const dateStr = h.requested_at ? new Date(h.requested_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

      item.innerHTML = `
        <div class="history-item-left">
          <div style="font-size:24px;">${escapeHTML(h.item_icon || '🎁')}</div>
          <div>
            <strong style="color:var(--text-main);font-size:13.5px;">${escapeHTML(h.item_title || 'Phần quà')}</strong>
            <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">
              🪙 ${Number(h.points_spent).toLocaleString()} NetCoins • Yêu cầu lúc: ${dateStr}
            </div>
          </div>
        </div>
        <span class="history-status-badge ${st.cls}">${st.text}</span>
      `;
      elRewardHistoryList.appendChild(item);
    });
  }

  function fetchSpeedLeaderboard() {
    if (!elSpeedLeaderboardWrap) return;
    elSpeedLeaderboardWrap.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Đang tải bảng vàng kỷ lục tốc độ...</div>';

    fetch('/api/index.php/gamification/speed-leaderboard', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          renderSpeedLeaderboard(json.data);
        }
      })
      .catch(err => {
        console.error('[Speed] Error loading leaderboard:', err);
        elSpeedLeaderboardWrap.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444;">Không thể tải bảng kỷ lục tốc độ.</div>';
      });
  }

  function renderSpeedLeaderboard(records) {
    if (!elSpeedLeaderboardWrap) return;
    if (!records || records.length === 0) {
      elSpeedLeaderboardWrap.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Chưa có bài thi nào đạt điểm tuyệt đối 100/100 để xác lập kỷ lục.</div>';
      return;
    }

    let html = `
      <div style="margin-bottom:12px;font-size:12.5px;color:#64748b;">
        ⚡ Bảng vàng vinh danh những học viên đạt <strong>100/100 điểm</strong> với tốc độ hoàn thành nhanh nhất trên từng bài lab:
      </div>
      <div style="overflow-x:auto;">
        <table class="speedrun-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Bài Lab</th>
              <th>Thiết Bị</th>
              <th>Học Viên</th>
              <th>Thời Gian</th>
              <th>Ngày Xác Lập</th>
            </tr>
          </thead>
          <tbody>
    `;

    records.forEach(r => {
      const rank = r.rank || 1;
      const medal = rank === 1 ? '🥇 Top 1' : (rank === 2 ? '🥈 Top 2' : (rank === 3 ? '🥉 Top 3' : `#${rank}`));
      const durSec = r.duration_sec || 0;
      const m = Math.floor(durSec / 60);
      const s = durSec % 60;
      const durStr = m > 0 ? `${m}m ${s}s` : `${s}s`;
      const dateStr = r.achieved_at ? new Date(r.achieved_at).toLocaleDateString('vi-VN') : '';

      html += `
        <tr>
          <td><strong style="color:#ea580c;">${medal}</strong></td>
          <td><strong>${escapeHTML(r.lab_name || r.lab_id)}</strong></td>
          <td>${escapeHTML(r.device_name || 'Thiết bị')}</td>
          <td>${escapeHTML(r.display_name || r.email)}</td>
          <td><span style="font-weight:700;color:#0284c7;">⏱️ ${durStr}</span></td>
          <td style="color:#64748b;">${dateStr}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    elSpeedLeaderboardWrap.innerHTML = html;
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
