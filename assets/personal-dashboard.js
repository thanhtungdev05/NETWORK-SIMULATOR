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

  // Trend Chart
  const elTrendChartContainer = document.getElementById('trend-chart-container');

  function init() {
    setupEventListeners();
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

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', handleLogout);
    }
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

    if (elTagEmployeeId) {
      elTagEmployeeId.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Mã KTV: <strong>${escapeHTML(user.employee_id || 'Chưa có')}</strong></span>
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
      const regionName = user.region_name || user.unit_name || 'FTC Toàn quốc';
      elTagRegion.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
        <span>Khu vực: <strong>${escapeHTML(regionName)}</strong></span>
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

    // 4. Trend Chart
    renderTrendChart(trend);

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
          statusTitle = 'Đang làm';
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
            <a class="btn-start-lab" href="/portal.html?device=${encodeURIComponent(dev.device_id)}&lab=${encodeURIComponent(lab.lab_id)}">
              Làm bài →
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
    const allSessions = _dashboardData.sessions || [];

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
        if (result === 'failed' && (s.is_passed !== false || s.status === 'in_progress')) return false;
        if (result === 'in_progress' && s.status !== 'in_progress') return false;
        if (result === 'abandoned' && s.status !== 'abandoned') return false;
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
          <td colspan="7" style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
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

      // Status Badge
      let statusBadge = '';
      if (s.status === 'in_progress') {
        statusBadge = '<span class="badge-pill status-in_progress">Đang thực hiện</span>';
      } else if (s.status === 'abandoned') {
        statusBadge = '<span class="badge-pill status-abandoned">Bỏ dở</span>';
      } else if (s.status === 'failed') {
        statusBadge = '<span class="badge-pill status-failed">Không đạt</span>';
      } else {
        statusBadge = '<span class="badge-pill status-completed">Hoàn thành</span>';
      }

      // Result Badge
      let resultBadge = '<span style="color: var(--text-muted);">-</span>';
      if (s.is_passed === true) {
        resultBadge = '<span class="badge-pill result-passed">Đạt</span>';
      } else if (s.is_passed === false) {
        resultBadge = '<span class="badge-pill result-failed">Không đạt</span>';
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
        <td>${statusBadge}</td>
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

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
