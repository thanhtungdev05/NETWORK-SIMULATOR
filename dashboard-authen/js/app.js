const API_BASE_URL = '/api/index.php';

let sessions = [];
let deviceCatalog = [];

const formatNumber = new Intl.NumberFormat('vi-VN');
const LEARNER_TABLE_PAGE_SIZE = 4;
const LEARNER_HISTORY_PAGE_SIZE = 6;

const state = {
    startDate: '',
    endDate: '',
    tempStartDate: '',
    tempEndDate: '',
    calendarMonth: new Date(2026, 6, 1),

    hourlyStartDate: '',
    hourlyEndDate: '',
    hourlyTempStartDate: '',
    hourlyTempEndDate: '',
    hourlyCalendarMonth: new Date(2026, 6, 1),

    selectedLearner: '',

    // Real-time table filters & sort
    realtimeTimeSortDir: 'desc',
    realtimeSelectedKtvs: new Set(),
    realtimeSelectedModes: new Set(['Thực hành', 'Hướng dẫn']),
    realtimeSelectedDevices: new Set(),
    realtimeSelectedStatuses: new Set(['Hoàn thành', 'Đang làm']),
    realtimeSearchKtv: '',
    realtimeSearchDevice: '',
    realtimePage: 1,

    // Instructor class progress workspace
    instructorClasses: [],
    instructorClassesLoaded: false,
    instructorActiveClassId: '',
    instructorSelectedDevice: '',
    instructorImportMembers: [],
    instructorImportFileName: '',
    instructorWorkspaceBound: false,

    // Learner table filters & sort
    learnerSelectedKtvs: new Set(),
    learnerSelectedDevices: new Set(),
    learnerSelectedLabs: new Set(),
    learnerSearchKtv: '',
    learnerTablePage: 1,
    learnerDetailPage: 1,
    sessionsSort: { key: 'lastDate', direction: 'desc' },

    // Learner Detail popup filters & sort
    detailTimeSortDir: 'desc',
    detailDurationSortDir: 'desc',
    detailSortKey: 'time',
    detailSelectedModes: new Set(['Thực hành', 'Hướng dẫn']),
    detailSelectedDevices: new Set(),
    detailSelectedStatuses: new Set(['Hoàn thành', 'Đang làm', 'Chưa thực hiện']),
    detailSearchDevice: '',

    // Lab detail filter & sort
    labSelectedDevices: new Set(),
    labSearchDevice: '',
    labSort: 'attempts_desc',
    analyticsLabsExpanded: false,

    // Device detail filter & sort
    deviceSelectedDevices: new Set(),
    deviceSearchDevice: '',
    deviceSort: 'sessions_desc',
    detailReportExpandedRegions: new Set(['TDDT', 'TNMT']),

    filtersBound: false,
    popoversInitialized: false,
    dataSourceLabel: 'Đang tải dữ liệu từ timer_sessions'
};

const els = {
    activeRangeText: document.getElementById('activeRangeText'),
    kpiRangeLabel: document.getElementById('kpiRangeLabel'),
    sessionsBody: document.getElementById('sessionsBody'),
    learnerTableMeta: document.getElementById('learnerTableMeta'),
    labBars: document.getElementById('labBars'),
    deviceGrid: document.getElementById('deviceGrid'),
    regionBars: document.getElementById('regionBars'),
    detailReportHead: document.getElementById('detailReportHead'),
    detailReportBody: document.getElementById('detailReportBody'),
    detailReportFoot: document.getElementById('detailReportFoot'),
    sessionCountBadge: document.getElementById('sessionCountBadge'),
    learnerDetailCard: document.getElementById('learnerDetailCard'),
    learnerDetailTitle: document.getElementById('learnerDetailTitle'),
    learnerDetailSubtitle: document.getElementById('learnerDetailSubtitle'),
    detailTotalSessions: document.getElementById('detailTotalSessions'),
    detailTotalSessionsSub: document.getElementById('detailTotalSessionsSub'),
    detailUniqueLabs: document.getElementById('detailUniqueLabs'),
    detailUniqueDevices: document.getElementById('detailUniqueDevices'),
    detailLastTime: document.getElementById('detailLastTime'),
    learnerHistoryBody: document.getElementById('learnerHistoryBody'),
    learnerHistoryMeta: document.getElementById('learnerHistoryMeta'),
    learnerDetailClose: document.getElementById('learnerDetailClose')
};

function parseDate(value) {
    if (!value) return new Date(0);
    if (value instanceof Date) return isNaN(value.getTime()) ? new Date(0) : value;
    const str = String(value).trim();
    if (str.includes('-')) {
        const parts = str.split('T')[0].split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
    }
    if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            }
            return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date(0) : d;
}

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getMonthBounds(monthValue) {
    const match = /^(\d{4})-(\d{2})$/.exec(monthValue || '');
    if (!match) return null;
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    if (monthIndex < 0 || monthIndex > 11) return null;
    return {
        start: toDateKey(new Date(year, monthIndex, 1)),
        end: toDateKey(new Date(year, monthIndex + 1, 0)),
        year,
        monthIndex
    };
}

function isFullCalendarMonth(startValue, endValue) {
    if (!startValue || !endValue) return false;
    const start = parseDate(startValue);
    const end = parseDate(endValue);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    return start.getDate() === 1
        && start.getFullYear() === end.getFullYear()
        && start.getMonth() === end.getMonth()
        && end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
}

function formatDate(value) {
    if (!value) return 'Chưa chọn';
    return parseDate(value).toLocaleDateString('vi-VN');
}

function formatDateTime(dateValue, timeValue) {
    if (!dateValue) return 'Chưa chọn';
    const dateFormatted = parseDate(dateValue).toLocaleDateString('vi-VN');
    return timeValue ? `${dateFormatted} ${timeValue}` : dateFormatted;
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function fillSelect(id, values, defaultLabel) {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="">${defaultLabel}</option>` + values
        .map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`)
        .join('');
    if ([...select.options].some(option => option.value === currentValue)) {
        select.value = currentValue;
    }
}

function getStatusClass(status) {
    if (status === 'Hoàn thành') return 'status-done';
    if (status === 'Đang làm') return 'status-running';
    return 'status-notstarted';
}

function formatCompactList(values, limit = 2) {
    const sorted = [...values].sort((a, b) => a.localeCompare(b, 'vi'));
    const visible = sorted.slice(0, limit).join(', ');
    return sorted.length > limit ? `${visible} +${sorted.length - limit}` : visible;
}

function getLatestSession(rows) {
    return [...rows].sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];
}

function getDateFilteredSessions() {
    return sessions.filter(item => {
        if (!item.date) return false;
        const date = parseDate(item.date);
        if (isNaN(date.getTime()) || date.getTime() === 0) return false;

        if (state.startDate) {
            const start = parseDate(state.startDate);
            start.setHours(0, 0, 0, 0);
            if (date < start) return false;
        }

        if (state.endDate) {
            const end = parseDate(state.endDate);
            end.setHours(23, 59, 59, 999);
            if (date > end) return false;
        }

        return true;
    });
}

function compareValues(a, b, direction) {
    const aVal = a ?? '';
    const bVal = b ?? '';
    let result;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal;
    } else {
        result = String(aVal).localeCompare(String(bVal), 'vi');
    }
    return direction === 'asc' ? result : -result;
}

function sortRows(rows, sortState) {
    return [...rows].sort((a, b) => compareValues(a[sortState.key], b[sortState.key], sortState.direction));
}

function renderSortMarks() {
    document.querySelectorAll('.sort-button').forEach(button => {
        const table = button.dataset.table;
        if (table === 'realtime') {
            const mark = button.querySelector('.sort-mark');
            if (mark) mark.textContent = state.realtimeTimeSortDir === 'asc' ? '↑' : '↓';
            return;
        }
        const sortState = state.sessionsSort;
        const mark = button.querySelector('.sort-mark');
        if (mark) {
            const isActive = sortState.key === button.dataset.key;
            mark.textContent = isActive ? (sortState.direction === 'asc' ? '↑' : '↓') : '↕';
            button.classList.toggle('is-sorted', isActive);
        }
    });

    const timeMark = document.querySelector('#detailTimeSort .sort-mark');
    if (timeMark) timeMark.textContent = state.detailSortKey === 'time' ? (state.detailTimeSortDir === 'asc' ? '↑' : '↓') : '↕';
    const durMark = document.querySelector('#detailDurationSort .sort-mark');
    if (durMark) durMark.textContent = state.detailSortKey === 'duration' ? (state.detailDurationSortDir === 'asc' ? '↑' : '↓') : '↕';
}

function getKpiComparisonPeriods() {
    if (state.startDate || state.endDate) {
        const currentStart = parseDate(state.startDate || state.endDate);
        const currentEnd = parseDate(state.endDate || state.startDate);

        if (isFullCalendarMonth(state.startDate, state.endDate)) {
            const year = currentStart.getFullYear();
            const month = currentStart.getMonth();
            const previousMonth = new Date(year, month - 1, 1);
            return {
                currentStart: state.startDate,
                currentEnd: state.endDate,
                previousStart: toDateKey(previousMonth),
                previousEnd: toDateKey(new Date(year, month, 0)),
                currentLabel: `Tháng ${String(month + 1).padStart(2, '0')}/${year}`,
                previousLabel: `tháng ${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`
            };
        }

        const periodLengthMs = Math.max(0, currentEnd.getTime() - currentStart.getTime());
        const previousEnd = new Date(currentStart);
        previousEnd.setDate(previousEnd.getDate() - 1);
        const previousStart = new Date(previousEnd.getTime() - periodLengthMs);

        return {
            currentStart: toDateKey(currentStart),
            currentEnd: toDateKey(currentEnd),
            previousStart: toDateKey(previousStart),
            previousEnd: toDateKey(previousEnd),
            currentLabel: `${formatDate(currentStart)} - ${formatDate(currentEnd)}`,
            previousLabel: 'kỳ liền trước'
        };
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return {
        currentStart: toDateKey(new Date(year, month, 1)),
        currentEnd: toDateKey(new Date(year, month + 1, 0)),
        previousStart: toDateKey(new Date(year, month - 1, 1)),
        previousEnd: toDateKey(new Date(year, month, 0)),
        currentLabel: `Tháng ${String(month + 1).padStart(2, '0')}/${year}`,
        previousLabel: 'tháng trước'
    };
}

function renderKpis() {
    const periods = getKpiComparisonPeriods();
    const currentRows = filterSessionsByDate(periods.currentStart, periods.currentEnd);
    const previousRows = filterSessionsByDate(periods.previousStart, periods.previousEnd);
    const currentMetrics = computeMetrics(currentRows);
    const previousMetrics = computeMetrics(previousRows);
    const lifetimeMetrics = computeMetrics(sessions);

    const definitions = [
        { key: 'totalSessions', valueId: 'kpiSessions', comparisonId: 'kpiSessionsComparison', contextId: 'kpiSessionsContext', type: 'count', unit: 'phiên' },
        { key: 'learners', valueId: 'kpiLearners', comparisonId: 'kpiLearnersComparison', contextId: 'kpiLearnersContext', type: 'count', unit: 'KTV' },
        { key: 'completed', valueId: 'kpiCompleted', comparisonId: 'kpiCompletedComparison', contextId: 'kpiCompletedContext', type: 'count', unit: 'bài' },
        { key: 'rate', valueId: 'kpiCompletionRate', comparisonId: 'kpiCompletionRateComparison', contextId: 'kpiCompletionRateContext', type: 'rate', unit: '%' },
        { key: 'firstTryRate', valueId: 'kpiFirstTryRate', comparisonId: 'kpiFirstTryRateComparison', contextId: 'kpiFirstTryRateContext', type: 'rate', unit: '%' },
        { key: 'avgDuration', valueId: 'kpiAvgDuration', comparisonId: 'kpiAvgDurationComparison', contextId: 'kpiAvgDurationContext', type: 'duration', unit: 'giây', lowerIsBetter: true }
    ];

    const formatMetric = (value, definition) => {
        if (definition.type === 'rate') return `${value}%`;
        if (definition.type === 'duration') return formatDuration(value);
        return formatNumber.format(value);
    };

    const formatDecimal = value => Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 1 });

    definitions.forEach(definition => {
        const currentValue = currentMetrics[definition.key];
        const previousValue = previousMetrics[definition.key];
        const lifetimeValue = lifetimeMetrics[definition.key];
        const difference = Math.round((currentValue - previousValue) * 10) / 10;
        const valueElement = document.getElementById(definition.valueId);
        const comparisonElement = document.getElementById(definition.comparisonId);
        const contextElement = document.getElementById(definition.contextId);

        if (valueElement) valueElement.textContent = formatMetric(currentValue, definition);

        if (comparisonElement) {
            let comparisonClass = 'neutral';
            let changeText = 'Không đổi';
            let arrow = '•';

            if (difference !== 0) {
                comparisonClass = difference > 0 ? 'positive' : 'negative';
                arrow = difference > 0 ? '↑' : '↓';

                if (definition.type === 'rate') {
                    changeText = `${formatDecimal(Math.abs(difference))} điểm %`;
                } else if (definition.type === 'duration') {
                    changeText = formatDuration(Math.abs(difference));
                } else {
                    const percentChange = previousValue
                        ? Math.round((difference / previousValue) * 100)
                        : 100;
                    changeText = `${formatNumber.format(Math.abs(difference))} (${percentChange > 0 ? '+' : ''}${percentChange}%)`;
                }
            }

            comparisonElement.className = `kpi-comparison ${comparisonClass}`;
            comparisonElement.innerHTML = `
                <span class="kpi-delta">${arrow} ${changeText}</span>
                <span class="kpi-comparison-label">so với ${periods.previousLabel}</span>
            `;
        }

        if (contextElement) {
            const noDataLabel = currentRows.length ? '' : ' • Chưa có dữ liệu';
            contextElement.textContent = `${periods.currentLabel}${noDataLabel} • Lũy kế ${formatMetric(lifetimeValue, definition)}${definition.type === 'count' ? ` ${definition.unit}` : ''}`;
        }
    });
}

function buildLearnerSummaries(rows) {
    const map = new Map();
    rows.forEach(item => {
        if (!map.has(item.learner)) {
            map.set(item.learner, {
                learner: item.learner,
                rows: [],
                devices: new Set(),
                labs: new Set(),
                modes: new Set()
            });
        }
        const summary = map.get(item.learner);
        summary.rows.push(item);
        summary.devices.add(item.device);
        summary.labs.add(item.lab);
        if (item.mode) summary.modes.add(item.mode);
    });

    return [...map.values()].map(item => {
        const latest = getLatestSession(item.rows);
        const completed = item.rows.filter(row => row.status === 'Hoàn thành').length;
        const modesArray = [...item.modes];
        const primaryMode = modesArray.length === 1 ? modesArray[0] : (latest?.mode || 'Thực hành');
        return {
            learner: item.learner,
            region: item.rows[0]?.region || getLearnerRegion(item.learner),
            total: item.rows.length,
            devicesCount: item.devices.size,
            labsCount: item.labs.size,
            devicesLabel: formatCompactList(item.devices),
            labsLabel: formatCompactList(item.labs),
            mode: primaryMode,
            modesLabel: formatCompactList(item.modes.size ? item.modes : new Set(['Thực hành'])),
            status: latest?.status || 'N/A',
            lastDate: latest?.date || '',
            lastTime: latest?.time || '',
            lastDateTimeFormatted: formatDateTime(latest?.date, latest?.time),
            lastAction: latest?.lastAction || 'N/A',
            latestDuration: latest?.duration || 0,
            completion: item.rows.length ? Math.round((completed / item.rows.length) * 100) : 0
        };
    });
}

function renderSessions(rows) {
    let filteredRows = rows.filter(item => (
        state.learnerSelectedKtvs.has(item.learner)
        && state.learnerSelectedDevices.has(item.device)
        && state.learnerSelectedLabs.has(item.lab)
    ));
    const learnerKeyword = state.learnerSearchKtv.trim().toLocaleLowerCase('vi');
    if (learnerKeyword) {
        filteredRows = filteredRows.filter(item => item.learner.toLocaleLowerCase('vi').includes(learnerKeyword));
    }

    const summaries = buildLearnerSummaries(filteredRows);
    const sorted = sortRows(summaries, state.sessionsSort);

    if (els.sessionCountBadge) els.sessionCountBadge.textContent = `${summaries.length} KTV / ${filteredRows.length} phiên`;

    if (!sorted.length) {
        if (els.sessionsBody) els.sessionsBody.innerHTML = '<tr><td colspan="7" class="empty">Không có KTV phù hợp với bộ lọc.</td></tr>';
        if (els.learnerTableMeta) els.learnerTableMeta.innerHTML = '';
        return;
    }
    const pageData = getPageSlice(sorted, state.learnerTablePage, LEARNER_TABLE_PAGE_SIZE);
    state.learnerTablePage = pageData.currentPage;
    if (els.sessionsBody) {
        els.sessionsBody.innerHTML = pageData.rows.map(item => `
            <tr class="clickable-row ${state.selectedLearner === item.learner ? 'active' : ''}" data-learner="${escapeHTML(item.learner)}" title="Bấm để xem chi tiết KTV">
                <td>
                    <div class="learner-link" title="${escapeHTML(item.learner)}">${escapeHTML(getLearnerName(item.learner))}</div>
                    <div class="item-sub">${item.completion}% hoàn thành</div>
                </td>
                <td>${escapeHTML(item.learner)}</td>
                <td>${escapeHTML(item.region)}</td>
                <td><strong>${item.total}</strong></td>
                <td>${escapeHTML(item.devicesLabel)}</td>
                <td>${escapeHTML(item.labsLabel)}</td>
                <td>
                    <div><strong>${escapeHTML(item.lastDateTimeFormatted)}</strong></div>
                    <div class="item-sub">Thời gian phiên gần nhất: ${formatDuration(item.latestDuration)}</div>
                </td>
            </tr>
        `).join('');
        els.sessionsBody.querySelectorAll('[data-learner]').forEach(row => {
            row.addEventListener('click', () => {
                const nextLearner = row.getAttribute('data-learner');
                if (state.selectedLearner !== nextLearner) state.learnerDetailPage = 1;
                state.selectedLearner = nextLearner;
                renderAll();
            });
        });
    }
    renderLearnerTableMeta(pageData);
}

function getPageSlice(rows, page, pageSize) {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, rows.length);
    return {
        rows: rows.slice(start, end),
        currentPage,
        totalPages,
        totalRows: rows.length,
        start,
        end
    };
}

function renderLearnerTableMeta(pageData) {
    if (!els.learnerTableMeta) return;
    if (!pageData.totalRows) {
        els.learnerTableMeta.innerHTML = '';
        return;
    }
    els.learnerTableMeta.innerHTML = `
        <span>Hiển thị ${pageData.start + 1}-${pageData.end} / ${pageData.totalRows} KTV</span>
        <span class="table-page-controls">
            <button type="button" class="table-page-btn" data-learner-table-page="prev" ${pageData.currentPage <= 1 ? 'disabled' : ''}>Trước</button>
            <span>Trang ${pageData.currentPage}/${pageData.totalPages}</span>
            <button type="button" class="table-page-btn" data-learner-table-page="next" ${pageData.currentPage >= pageData.totalPages ? 'disabled' : ''}>Sau</button>
        </span>
    `;
    els.learnerTableMeta.querySelectorAll('[data-learner-table-page]').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const action = button.dataset.learnerTablePage;
            state.learnerTablePage += action === 'next' ? 1 : -1;
            renderAll();
        });
    });
}

function renderLearnerHistoryMeta(pageData) {
    if (!els.learnerHistoryMeta) return;
    if (!pageData.totalRows) {
        els.learnerHistoryMeta.innerHTML = '';
        return;
    }
    els.learnerHistoryMeta.innerHTML = `
        <span>Hiển thị ${pageData.start + 1}-${pageData.end} / ${pageData.totalRows} phiên</span>
        <span class="table-page-controls">
            <button type="button" class="table-page-btn" data-learner-page="prev" ${pageData.currentPage <= 1 ? 'disabled' : ''}>Trước</button>
            <span>Trang ${pageData.currentPage}/${pageData.totalPages}</span>
            <button type="button" class="table-page-btn" data-learner-page="next" ${pageData.currentPage >= pageData.totalPages ? 'disabled' : ''}>Sau</button>
        </span>
    `;
    els.learnerHistoryMeta.querySelectorAll('[data-learner-page]').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const action = button.dataset.learnerPage;
            state.learnerDetailPage += action === 'next' ? 1 : -1;
            renderAll();
        });
    });
}

function hideLearnerDetail() {
    state.selectedLearner = '';
    state.learnerDetailPage = 1;
    document.body.classList.remove('detail-open');
    els.learnerDetailCard?.classList.remove('visible');
    els.learnerDetailCard?.setAttribute('aria-hidden', 'true');
}

function renderOverviewMonthlyTrend(rows) {
    const container = document.getElementById('overviewMonthlyTrend');
    const summary = document.getElementById('overviewMonthlySummary');
    if (!container) return;

    container.classList.remove('is-empty');

    const validDates = rows
        .map(item => parseDate(item.date))
        .filter(date => !Number.isNaN(date.getTime()) && date.getTime() > 0);
    if (!validDates.length) {
        container.classList.add('is-empty');
        container.innerHTML = '<div class="empty">Không có dữ liệu theo tháng.</div>';
        if (summary) summary.innerHTML = '';
        return;
    }

    const selectedDate = state.startDate ? parseDate(state.startDate) : new Date();
    const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
    const reportYear = selectedDate.getFullYear();
    const today = new Date();
    const periods = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(reportYear, index, 1);
        const monthRows = rows.filter(item => {
            const itemDate = parseDate(item.date);
            return !Number.isNaN(itemDate.getTime())
                && itemDate.getFullYear() === date.getFullYear()
                && itemDate.getMonth() === date.getMonth();
        });
        const metrics = computeMetrics(monthRows);
        return {
            date,
            key: `${date.getFullYear()}-${date.getMonth()}`,
            label: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
            shortLabel: `T${String(date.getMonth() + 1).padStart(2, '0')}`,
            isFuture: date > new Date(today.getFullYear(), today.getMonth(), 1),
            ...metrics
        };
    });

    if (periods.every(period => period.totalSessions === 0)) {
        container.classList.add('is-empty');
        container.innerHTML = `<div class="empty">Không có dữ liệu trong năm ${reportYear}.</div>`;
        if (summary) summary.innerHTML = '';
        return;
    }

    const maxSessions = Math.max(...periods.map(period => period.totalSessions), 1);
    container.innerHTML = periods.map(period => {
        const height = period.totalSessions ? Math.max(12, Math.round((period.totalSessions / maxSessions) * 100)) : 0;
        const isSelected = period.key === selectedKey;
        return `
            <div class="ktv-month-column ${isSelected ? 'selected' : ''} ${period.isFuture ? 'future' : ''}" title="${period.label}: ${period.totalSessions} phiên, ${period.completed} hoàn thành">
                <strong>${period.totalSessions}</strong>
                <div class="ktv-month-bar-track">
                    <div class="ktv-month-bar" style="height: ${height}%;"></div>
                </div>
                <span class="ktv-month-label">${period.shortLabel}</span>
                <span class="ktv-month-rate">${period.rate}% HT</span>
            </div>
        `;
    }).join('');

    const matchedIndex = periods.findIndex(period => period.key === selectedKey);
    const selectedIndex = matchedIndex >= 0 ? matchedIndex : periods.length - 1;
    const currentPeriod = periods[selectedIndex] || periods[Math.min(today.getMonth(), periods.length - 1)];
    const previousPeriod = periods[Math.max(0, selectedIndex - 1)];
    const difference = currentPeriod.totalSessions - previousPeriod.totalSessions;
    const changeClass = difference > 0 ? 'positive' : (difference < 0 ? 'negative' : 'neutral');
    const changeText = difference === 0 ? 'Không đổi' : `${difference > 0 ? '↑' : '↓'} ${Math.abs(difference)} phiên`;
    if (summary) {
        summary.className = `ktv-monthly-summary ${changeClass}`;
        summary.innerHTML = `
            <strong>${currentPeriod.label}</strong>
            <span>${changeText} so với tháng trước</span>
        `;
    }
}

function renderLearnerDetail(rows) {
    if (!state.selectedLearner) {
        els.learnerDetailCard?.classList.remove('visible');
        els.learnerDetailCard?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('detail-open');
        if (els.learnerHistoryMeta) els.learnerHistoryMeta.innerHTML = '';
        return;
    }

    const allLearnerRows = rows.filter(item => item.learner === state.selectedLearner);

    if (!allLearnerRows.length) {
        els.learnerDetailCard?.classList.remove('visible');
        els.learnerDetailCard?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('detail-open');
        if (els.learnerHistoryMeta) els.learnerHistoryMeta.innerHTML = '';
        return;
    }

    const ktvDevices = [...new Set(allLearnerRows.map(item => item.device))].sort();
    if (state.detailSelectedDevices.size === 0 && !state.detailDevicesTouched) {
        state.detailSelectedDevices = new Set(ktvDevices);
    }
    populatePopoverOptions('detailDeviceOptions', ktvDevices, state.detailSelectedDevices, () => { state.detailDevicesTouched = true; }, state.detailSearchDevice);

    let filteredHistory = [...allLearnerRows];
    filteredHistory = filteredHistory.filter(item => state.detailSelectedModes.has(item.mode || 'Thực hành'));
    filteredHistory = filteredHistory.filter(item => state.detailSelectedDevices.has(item.device));
    filteredHistory = filteredHistory.filter(item => state.detailSelectedStatuses.has(item.status));

    if (state.detailSortKey === 'duration') {
        filteredHistory.sort((a, b) => {
            const durA = Number(a.duration) || 0;
            const durB = Number(b.duration) || 0;
            return state.detailDurationSortDir === 'asc' ? durA - durB : durB - durA;
        });
    } else {
        filteredHistory.sort((a, b) => {
            const timeA = parseDate(a.date).getTime() + (a.time ? parseTimeMs(a.time) : 0);
            const timeB = parseDate(b.date).getTime() + (b.time ? parseTimeMs(b.time) : 0);
            return state.detailTimeSortDir === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }

    const uniqueLabs = new Set(allLearnerRows.map(item => item.lab));
    const uniqueDevices = new Set(allLearnerRows.map(item => item.device));
    const latest = getLatestSession(allLearnerRows);

    const totalCatalogDevices = deviceCatalog.length || 5;
    const totalCatalogLabs = deviceCatalog.reduce((sum, d) => sum + (d.labs ? d.labs.length : 0), 0) || 17;
    const guideSessionsCount = allLearnerRows.filter(item => item.mode === 'Hướng dẫn').length;
    const practiceSessionsCount = allLearnerRows.filter(item => item.mode === 'Thực hành').length;

    if (els.learnerDetailTitle) els.learnerDetailTitle.textContent = getLearnerName(state.selectedLearner);
    if (els.learnerDetailSubtitle) els.learnerDetailSubtitle.textContent = `${allLearnerRows[0]?.region || getLearnerRegion(state.selectedLearner)} • ${state.selectedLearner} • ${allLearnerRows.length} phiên thực hành trong toàn bộ lịch sử.`;
    if (els.detailTotalSessions) els.detailTotalSessions.textContent = allLearnerRows.length;
    if (els.detailTotalSessionsSub) {
        els.detailTotalSessionsSub.innerHTML = `
            <div>${practiceSessionsCount} Thực hành</div>
            <div>${guideSessionsCount} Hướng dẫn</div>
        `;
    }
    if (els.detailUniqueLabs) els.detailUniqueLabs.textContent = `${uniqueLabs.size} / ${totalCatalogLabs}`;
    if (els.detailUniqueDevices) els.detailUniqueDevices.textContent = `${uniqueDevices.size} / ${totalCatalogDevices}`;
    if (els.detailLastTime) els.detailLastTime.textContent = latest ? formatDateTime(latest.date, latest.time) : 'N/A';
    renderDeviceDonutChart(allLearnerRows);
    renderHourlyBarChart(allLearnerRows);

    const pageData = getPageSlice(filteredHistory, state.learnerDetailPage, LEARNER_HISTORY_PAGE_SIZE);
    state.learnerDetailPage = pageData.currentPage;
    if (els.learnerHistoryBody) {
        if (!pageData.rows.length) {
            els.learnerHistoryBody.innerHTML = '<tr><td colspan="6" class="empty">Không có phiên phù hợp với bộ lọc trong nhật ký.</td></tr>';
        } else {
            els.learnerHistoryBody.innerHTML = pageData.rows.map(item => `
                <tr>
                    <td>
                        <div><strong>${escapeHTML(formatDateTime(item.date, item.time))}</strong></div>
                    </td>
                    <td><span class="mode-pill ${item.mode === 'Hướng dẫn' ? 'mode-guide' : 'mode-practice'}">${escapeHTML(item.mode || 'Thực hành')}</span></td>
                    <td>${escapeHTML(item.device)}</td>
                    <td>${escapeHTML(item.lab)}</td>
                    <td><span class="status-pill ${getStatusClass(item.status)}">${escapeHTML(item.status)}</span></td>
                    <td>${formatDuration(item.duration)}</td>
                </tr>
            `).join('');
        }
    }
    renderLearnerHistoryMeta(pageData);
    els.learnerDetailCard?.classList.add('visible');
    els.learnerDetailCard?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('detail-open');
}

function sameDay(a, b) {
    return a && b && toDateKey(a) === toDateKey(b);
}

function renderHourlyCalendar() {
    const monthSelect = document.getElementById('hourlyMonthSelect');
    const yearSelect = document.getElementById('hourlyYearSelect');
    const startText = document.getElementById('hourlyStartText');
    const endText = document.getElementById('hourlyEndText');
    const daysContainer = document.getElementById('hourlyDays');
    if (!daysContainer) return;

    if (monthSelect && !monthSelect.children.length) {
        monthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => `<option value="${index}">Tháng ${index + 1}</option>`).join('');
    }
    if (yearSelect && !yearSelect.children.length) {
        yearSelect.innerHTML = [2025, 2026, 2027].map(year => `<option value="${year}">${year}</option>`).join('');
    }

    const month = state.hourlyCalendarMonth.getMonth();
    const year = state.hourlyCalendarMonth.getFullYear();

    if (monthSelect) monthSelect.value = month;
    if (yearSelect) yearSelect.value = year;
    if (startText) startText.textContent = formatDate(state.hourlyTempStartDate);
    if (endText) endText.textContent = formatDate(state.hourlyTempEndDate);

    const firstOfMonth = new Date(year, month, 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);
    const days = [];
    for (let i = 0; i < 42; i += 1) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + i);
        const key = toDateKey(day);
        const selectedStart = state.hourlyTempStartDate ? parseDate(state.hourlyTempStartDate) : null;
        const selectedEnd = state.hourlyTempEndDate ? parseDate(state.hourlyTempEndDate) : null;
        const inRange = selectedStart && selectedEnd && day >= selectedStart && day <= selectedEnd;
        const isSelected = sameDay(day, selectedStart) || sameDay(day, selectedEnd);
        days.push(`
            <button type="button" class="date-day ${day.getMonth() !== month ? 'outside' : ''} ${inRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''}" data-hourly-date="${key}">
                ${day.getDate()}
            </button>
        `);
    }
    daysContainer.innerHTML = days.join('');
    daysContainer.querySelectorAll('[data-hourly-date]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const selected = button.dataset.hourlyDate;
            if (!state.hourlyTempStartDate || (state.hourlyTempStartDate && state.hourlyTempEndDate)) {
                state.hourlyTempStartDate = selected;
                state.hourlyTempEndDate = '';
            } else if (parseDate(selected) < parseDate(state.hourlyTempStartDate)) {
                state.hourlyTempEndDate = state.hourlyTempStartDate;
                state.hourlyTempStartDate = selected;
            } else {
                state.hourlyTempEndDate = selected;
            }
            renderHourlyCalendar();
        });
    });
}

function initHourlyDatePicker() {
    const picker = document.getElementById('hourlyDatePicker');
    const trigger = document.getElementById('hourlyDateTrigger');
    const panel = document.getElementById('hourlyDatePanel');
    const prevMonth = document.getElementById('hourlyPrevMonth');
    const nextMonth = document.getElementById('hourlyNextMonth');
    const monthSelect = document.getElementById('hourlyMonthSelect');
    const yearSelect = document.getElementById('hourlyYearSelect');
    const applyBtn = document.getElementById('hourlyApplyDate');
    const clearBtn = document.getElementById('hourlyClearDate');

    renderHourlyCalendar();

    trigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyTempStartDate = state.hourlyStartDate;
        state.hourlyTempEndDate = state.hourlyEndDate;
        renderHourlyCalendar();
        picker?.classList.toggle('open');
    });

    panel?.addEventListener('click', (e) => e.stopPropagation());

    prevMonth?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyCalendarMonth.setMonth(state.hourlyCalendarMonth.getMonth() - 1);
        renderHourlyCalendar();
    });

    nextMonth?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyCalendarMonth.setMonth(state.hourlyCalendarMonth.getMonth() + 1);
        renderHourlyCalendar();
    });

    monthSelect?.addEventListener('change', (e) => {
        state.hourlyCalendarMonth.setMonth(parseInt(e.target.value, 10));
        renderHourlyCalendar();
    });

    yearSelect?.addEventListener('change', (e) => {
        state.hourlyCalendarMonth.setFullYear(parseInt(e.target.value, 10));
        renderHourlyCalendar();
    });

    applyBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyStartDate = state.hourlyTempStartDate;
        state.hourlyEndDate = state.hourlyTempEndDate;
        picker?.classList.remove('open');
        if (state.currentLearnerRows) {
            renderHourlyBarChart(state.currentLearnerRows);
        }
    });

    clearBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyStartDate = '';
        state.hourlyEndDate = '';
        state.hourlyTempStartDate = '';
        state.hourlyTempEndDate = '';
        renderHourlyCalendar();
        picker?.classList.remove('open');
        if (state.currentLearnerRows) {
            renderHourlyBarChart(state.currentLearnerRows);
        }
    });

    document.addEventListener('click', () => {
        picker?.classList.remove('open');
    });
}

function renderHourlyBarChart(learnerRows) {
    const container = document.getElementById('hourlyBarChartContainer');
    const dateText = document.getElementById('hourlyDateText');
    if (!container) return;

    state.currentLearnerRows = learnerRows;

    if (dateText) {
        if (state.hourlyStartDate && state.hourlyEndDate) {
            dateText.textContent = `${formatDate(state.hourlyStartDate)} - ${formatDate(state.hourlyEndDate)}`;
        } else if (state.hourlyStartDate) {
            dateText.textContent = `Từ ${formatDate(state.hourlyStartDate)}`;
        } else if (state.hourlyEndDate) {
            dateText.textContent = `Đến ${formatDate(state.hourlyEndDate)}`;
        } else {
            dateText.textContent = 'Tất cả thời gian';
        }
    }

    let filteredRows = learnerRows;
    if (state.hourlyStartDate || state.hourlyEndDate) {
        filteredRows = learnerRows.filter(item => {
            const date = parseDate(item.date);
            const start = state.hourlyStartDate ? parseDate(state.hourlyStartDate) : null;
            const end = state.hourlyEndDate ? parseDate(state.hourlyEndDate) : null;
            if (start && date < start) return false;
            if (end && date > end) return false;
            return true;
        });
    }

    const slots = [
        { label: '00:00 - 02:00', shortLabel: '00h', start: 0, end: 2, count: 0 },
        { label: '02:00 - 04:00', shortLabel: '02h', start: 2, end: 4, count: 0 },
        { label: '04:00 - 06:00', shortLabel: '04h', start: 4, end: 6, count: 0 },
        { label: '06:00 - 08:00', shortLabel: '06h', start: 6, end: 8, count: 0 },
        { label: '08:00 - 10:00', shortLabel: '08h', start: 8, end: 10, count: 0 },
        { label: '10:00 - 12:00', shortLabel: '10h', start: 10, end: 12, count: 0 },
        { label: '12:00 - 14:00', shortLabel: '12h', start: 12, end: 14, count: 0 },
        { label: '14:00 - 16:00', shortLabel: '14h', start: 14, end: 16, count: 0 },
        { label: '16:00 - 18:00', shortLabel: '16h', start: 16, end: 18, count: 0 },
        { label: '18:00 - 20:00', shortLabel: '18h', start: 18, end: 20, count: 0 },
        { label: '20:00 - 22:00', shortLabel: '20h', start: 20, end: 22, count: 0 },
        { label: '22:00 - 24:00', shortLabel: '22h', start: 22, end: 24, count: 0 }
    ];

    filteredRows.forEach(item => {
        let hour = 8;
        if (item.time) {
            const parts = item.time.split(':');
            hour = parseInt(parts[0], 10);
            if (isNaN(hour)) hour = 8;
        }
        const slot = slots.find(s => hour >= s.start && hour < s.end);
        if (slot) slot.count++;
    });

    if (!filteredRows.length) {
        container.innerHTML = '<div class="empty" style="padding: 24px; font-size: 12px;">Không có dữ liệu trong khoảng thời gian đã chọn.</div>';
        return;
    }

    const maxVal = Math.max(...slots.map(s => s.count), 1);

    const svgBars = slots.map((slot, idx) => {
        const x = 24 + idx * 25;
        const height = slot.count > 0 ? Math.max(Math.round((slot.count / maxVal) * 85), 8) : 2;
        const y = 115 - height;
        const HOURLY_BAR_COLORS = ['#e33f86', '#cf438f', '#aa4eac', '#7654c7', '#5d70d5', '#3aaed1'];
        const barColor = slot.count > 0 ? HOURLY_BAR_COLORS[idx % HOURLY_BAR_COLORS.length] : '#e4e7ec';

        return `
            <g class="bar-group">
                <title>${slot.label}: ${slot.count} lần làm bài</title>
                <rect x="${x}" y="${y}" width="16" height="${height}" rx="3" fill="${barColor}" class="bar-rect" />
                ${slot.count > 0 ? `<text x="${x + 8}" y="${y - 4}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1e293b">${slot.count}</text>` : ''}
                <text x="${x + 8}" y="132" text-anchor="middle" font-size="9.5" font-weight="600" fill="#64748b">${slot.shortLabel}</text>
            </g>
        `;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 330 145" width="100%" height="145" style="overflow: visible;">
            <line x1="20" y1="30" x2="325" y2="30" stroke="#f1f5f9" stroke-width="1" />
            <line x1="20" y1="72" x2="325" y2="72" stroke="#f1f5f9" stroke-width="1" />
            <line x1="20" y1="115" x2="325" y2="115" stroke="#e2e8f0" stroke-width="1.5" />

            <text x="15" y="34" text-anchor="end" font-size="9" font-weight="600" fill="#94a3b8">${maxVal}</text>
            <text x="15" y="76" text-anchor="end" font-size="9" font-weight="600" fill="#94a3b8">${Math.round(maxVal / 2)}</text>
            <text x="15" y="119" text-anchor="end" font-size="9" font-weight="600" fill="#94a3b8">0</text>

            ${svgBars}
        </svg>
    `;
}

function aggregateBy(rows, key) {
    const map = new Map();
    rows.forEach(item => {
        if (!map.has(item[key])) {
            map.set(item[key], { name: item[key], sessions: 0, completed: 0, duration: 0 });
        }
        const row = map.get(item[key]);
        row.sessions += 1;
        row.completed += item.status === 'Hoàn thành' ? 1 : 0;
        row.duration += item.duration || 0;
    });
    return [...map.values()].map(item => ({
        ...item,
        completion: item.sessions ? Math.round((item.completed / item.sessions) * 100) : 0,
        avgDuration: item.sessions ? Math.round(item.duration / item.sessions) : 0
    }));
}

function renderLabs(rows) {
    if (!els.labBars) return;

    let filteredRows = rows.filter(item => state.labSelectedDevices.has(item.device));

    const sortSelect = document.getElementById('labSortSelect');
    const sort = sortSelect ? sortSelect.value : 'attempts_desc';
    const labs = aggregateBy(filteredRows, 'lab').sort((a, b) => {
        if (sort === 'completion_asc') return a.completion - b.completion;
        if (sort === 'duration_desc') return b.avgDuration - a.avgDuration;
        return b.sessions - a.sessions; // attempts_desc
    });

    const maxSessions = Math.max(...labs.map(item => item.sessions), 1);
    if (!labs.length) {
        els.labBars.innerHTML = '<div class="empty">Không có dữ liệu lab.</div>';
        return;
    }
    const visibleLabs = state.analyticsLabsExpanded ? labs : labs.slice(0, 8);
    const labRows = visibleLabs.map(item => {
        const width = item.sessions ? Math.max(10, Math.round((item.sessions / maxSessions) * 100)) : 0;
        return `
            <div class="bar-row">
                <div style="font-weight: 600;">${escapeHTML(item.name)}</div>
                <div class="bar-track"><div class="bar-fill" style="width: ${width}%; background: var(--blue);"></div></div>
                <div style="font-weight: 700;">${item.sessions} lần làm</div>
            </div>
        `;
    }).join('');

    const expandControl = labs.length > 8
        ? `<button class="analytics-expand-btn" id="analyticsLabsToggle" type="button">
                ${state.analyticsLabsExpanded ? 'Thu gọn danh sách' : `Xem tất cả ${labs.length} bài lab`}
           </button>`
        : '';

    els.labBars.innerHTML = `${labRows}${expandControl}`;
    document.getElementById('analyticsLabsToggle')?.addEventListener('click', () => {
        state.analyticsLabsExpanded = !state.analyticsLabsExpanded;
        renderLabs(rows);
    });
}

function aggregateDevices(rows) {
    const map = new Map();
    rows.forEach(item => {
        if (!map.has(item.device)) {
            map.set(item.device, { name: item.device, sessions: 0, completed: 0, duration: 0, labsSet: new Set() });
        }
        const row = map.get(item.device);
        row.sessions += 1;
        row.completed += item.status === 'Hoàn thành' ? 1 : 0;
        row.duration += item.duration || 0;
        if (item.lab) row.labsSet.add(item.lab);
    });
    return [...map.values()].map(item => {
        const catalogItem = deviceCatalog.find(d => d.device === item.name || d.device_name === item.name || d.model === item.name);
        const labsCount = catalogItem?.totalLabs || catalogItem?.labs?.length || item.labsSet.size;
        return {
            ...item,
            labsCount,
            completion: item.sessions ? Math.round((item.completed / item.sessions) * 100) : 0,
            avgDuration: item.sessions ? Math.round(item.duration / item.sessions) : 0
        };
    });
}

function renderDevices(rows) {
    if (!els.deviceGrid) return;

    let filteredRows = rows.filter(item => state.deviceSelectedDevices.has(item.device));

    const sortSelect = document.getElementById('deviceSortSelect');
    const sort = sortSelect ? sortSelect.value : 'sessions_desc';
    const devices = aggregateDevices(filteredRows).sort((a, b) => {
        if (sort === 'completion_asc') return a.completion - b.completion;
        if (sort === 'duration_desc') return b.avgDuration - a.avgDuration;
        return b.sessions - a.sessions;
    });
    if (!devices.length) {
        els.deviceGrid.innerHTML = '<div class="empty">Không có dữ liệu thiết bị.</div>';
        return;
    }
    els.deviceGrid.innerHTML = devices.map(item => `
        <div class="device-box">
            <div class="device-name">${escapeHTML(item.name)}</div>
            <div class="device-metrics">
                <div class="metric-small"><strong>${item.sessions}</strong><span>Lượt làm</span></div>
                <div class="metric-small"><strong>${item.labsCount}</strong><span>Số bài lab</span></div>
                <div class="metric-small"><strong>${item.completion}%</strong><span>Hoàn thành</span></div>
                <div class="metric-small"><strong>${formatDurationCompact(item.avgDuration)}</strong><span>Thời gian TB</span></div>
            </div>
        </div>
    `).join('');
}

const REGION_CATALOG = [
    { code: 'DNB' },
    { code: 'HCM' },
    { code: 'TDDT', children: ['TDDT - TIN', 'TDDT - PNC'] },
    { code: 'TNB' },
    { code: 'TNMT', children: ['TNMT - TIN', 'TNMT - PNC'] },
    { code: 'DBB' },
    { code: 'HNI' },
    { code: 'TBB' }
];

const REGION_FILTER_OPTIONS = REGION_CATALOG.flatMap(region => region.children || [region.code]);

function getLearnerRegion(learner) {
    const map = {
        'nguyenvana@fpt.com': 'DNB',
        'tranthib@fpt.com': 'HCM',
        'levanc@fpt.com': 'TDDT - TIN',
        'phamthid@fpt.com': 'TDDT - PNC',
        'hoangvane@fpt.com': 'TNB',
        'vuvanf@fpt.com': 'TNMT - TIN',
        'doanthig@fpt.com': 'TNMT - PNC',
        'buiminhh@fpt.com': 'DBB',
        'dangquangi@fpt.com': 'HNI',
        'nhothij@fpt.com': 'TBB',
        'truongvank@fpt.com': 'DNB',
        'ngothil@fpt.com': 'HCM'
    };
    if (map[learner] && REGION_FILTER_OPTIONS.includes(map[learner])) return map[learner];
    if (!learner) return REGION_FILTER_OPTIONS[0] || 'Chưa phân vùng';
    let sum = 0;
    for (let i = 0; i < learner.length; i++) sum += learner.charCodeAt(i);
    return REGION_FILTER_OPTIONS[sum % REGION_FILTER_OPTIONS.length] || 'Chưa phân vùng';
}

function normalizeRegionName(region, learner) {
    const value = String(region || '').trim();
    if (!value || /^Vùng\s*\d+$/i.test(value)) return getLearnerRegion(learner);
    const directMatch = REGION_FILTER_OPTIONS.find(option => option.toLowerCase() === value.toLowerCase());
    return directMatch || value;
}

function aggregateRegions(rows) {
    const map = new Map();
    rows.forEach(item => {
        const region = item.region || getLearnerRegion(item.learner);
        if (!map.has(region)) {
            map.set(region, { name: region, sessions: 0, completed: 0, duration: 0 });
        }
        const row = map.get(region);
        row.sessions += 1;
        row.completed += item.status === 'Hoàn thành' ? 1 : 0;
        row.duration += item.duration || 0;
    });
    return [...map.values()].map(item => ({
        ...item,
        completion: item.sessions ? Math.round((item.completed / item.sessions) * 100) : 0,
        avgDuration: item.sessions ? Math.round(item.duration / item.sessions) : 0
    }));
}

function renderRegions(rows) {
    if (!els.regionBars) return;
    const regionMap = new Map(aggregateRegions(rows).map(region => [region.name, region]));
    const emptyRegion = name => ({ name, sessions: 0, completed: 0, duration: 0, completion: 0, avgDuration: 0 });
    const combineRegions = (name, childNames) => {
        const children = childNames.map(child => regionMap.get(child) || emptyRegion(child));
        const sessions = children.reduce((sum, child) => sum + child.sessions, 0);
        const completed = children.reduce((sum, child) => sum + child.completed, 0);
        const duration = children.reduce((sum, child) => sum + child.duration, 0);
        return {
            name,
            sessions,
            completed,
            duration,
            completion: sessions ? Math.round((completed / sessions) * 100) : 0,
            avgDuration: sessions ? Math.round(duration / sessions) : 0,
            isParent: true
        };
    };
    const regions = REGION_CATALOG.flatMap(region => {
        if (!region.children) return [{ ...(regionMap.get(region.code) || emptyRegion(region.code)) }];
        return [
            combineRegions(region.code, region.children),
            ...region.children.map(child => ({ ...(regionMap.get(child) || emptyRegion(child)), isChild: true }))
        ];
    });

    const maxSessions = Math.max(...regions.map(item => item.sessions), 1);
    if (!regions.length) {
        els.regionBars.innerHTML = '<div class="empty">Không có dữ liệu vùng.</div>';
        return;
    }
    els.regionBars.innerHTML = regions.map(item => {
        const width = Math.max(10, Math.round((item.sessions / maxSessions) * 100));
        return `
            <div class="bar-row region-tree-row ${item.isParent ? 'region-parent' : ''} ${item.isChild ? 'region-child' : ''}">
                <div class="region-tree-name" title="${escapeHTML(item.name)}">
                    ${item.isParent ? '<span class="region-tree-toggle">▼</span>' : (item.isChild ? '<span class="region-tree-bullet">•</span>' : '')}
                    <span>${escapeHTML(item.name)}</span>
                </div>
                <div class="bar-track"><div class="bar-fill" style="width: ${width}%; background: var(--blue);"></div></div>
                <div style="font-weight: 700;">${item.sessions} lần làm</div>
            </div>
        `;
    }).join('');
}

function getDetailReportDeviceGroups(rows) {
    const groups = [];
    const groupMap = new Map();

    const ensureGroup = (deviceName) => {
        const name = deviceName || 'Thiết bị chưa xác định';
        if (!groupMap.has(name)) {
            const group = { device: name, labs: [] };
            groupMap.set(name, group);
            groups.push(group);
        }
        return groupMap.get(name);
    };

    deviceCatalog.forEach(device => {
        const group = ensureGroup(device.device || device.device_name || device.model);
        (device.labs || []).forEach(lab => {
            if (lab && !group.labs.includes(lab)) group.labs.push(lab);
        });
    });

    rows.forEach(item => {
        const group = ensureGroup(item.device);
        if (item.lab && !group.labs.includes(item.lab)) group.labs.push(item.lab);
    });

    return groups.filter(group => group.labs.length > 0);
}

function detailReportCellKey(region, device, lab) {
    return `${region}\u001f${device}\u001f${lab}`;
}

function buildDetailReportIndex(rows) {
    const index = new Map();
    rows.forEach(item => {
        const region = item.region || getLearnerRegion(item.learner);
        const key = detailReportCellKey(region, item.device, item.lab);
        if (!index.has(key)) index.set(key, { attempts: 0, completed: 0, duration: 0 });
        const cell = index.get(key);
        cell.attempts += 1;
        cell.completed += item.status === 'Hoàn thành' ? 1 : 0;
        cell.duration += Number(item.duration) || 0;
    });
    return index;
}

function getDetailReportCell(index, regionKeys, column) {
    const result = { attempts: 0, completed: 0, duration: 0 };
    regionKeys.forEach(region => {
        const cell = index.get(detailReportCellKey(region, column.device, column.lab));
        if (!cell) return;
        result.attempts += cell.attempts;
        result.completed += cell.completed;
        result.duration += cell.duration;
    });
    result.rate = result.attempts ? Math.round((result.completed / result.attempts) * 100) : 0;
    result.avgDuration = result.attempts ? Math.round(result.duration / result.attempts) : 0;
    return result;
}

function getDetailReportTotal(index, regionKeys, columns) {
    const result = { attempts: 0, completed: 0, duration: 0 };
    columns.forEach(column => {
        const cell = getDetailReportCell(index, regionKeys, column);
        result.attempts += cell.attempts;
        result.completed += cell.completed;
        result.duration += cell.duration;
    });
    result.rate = result.attempts ? Math.round((result.completed / result.attempts) * 100) : 0;
    result.avgDuration = result.attempts ? Math.round(result.duration / result.attempts) : 0;
    return result;
}

function getDetailReportCellClass(cell) {
    if (!cell.attempts) return 'report-cell-zero';
    if (cell.rate >= 80) return 'report-cell-high';
    if (cell.rate >= 50) return 'report-cell-medium';
    return 'report-cell-low';
}

function renderDetailReportMetricCell(cell, extraClass = '') {
    if (!cell.attempts) return `<td class="report-metric-cell report-cell-zero ${extraClass}" title="Chưa có dữ liệu trong khoảng lọc"><strong>0</strong><span>0% HT</span></td>`;
    const title = `${cell.attempts} lượt làm • ${cell.completed} hoàn thành • Trung bình ${formatDuration(cell.avgDuration)}`;
    return `
        <td class="report-metric-cell ${getDetailReportCellClass(cell)} ${extraClass}" title="${escapeHTML(title)}">
            <strong>${formatNumber.format(cell.attempts)}</strong>
            <span>${cell.rate}% HT</span>
        </td>
    `;
}

function renderDetailedReport(rows) {
    if (!els.detailReportHead || !els.detailReportBody || !els.detailReportFoot) return;

    const groups = getDetailReportDeviceGroups(rows);
    const columns = groups.flatMap((group, groupIndex) => group.labs.map((lab, labIndex) => ({
        device: group.device,
        lab,
        groupIndex,
        isFirst: labIndex === 0,
        isLast: labIndex === group.labs.length - 1
    })));
    const cellIndex = buildDetailReportIndex(rows);
    const rowDefinitions = [];

    REGION_CATALOG.forEach(region => {
        if (!region.children) {
            rowDefinitions.push({ name: region.code, regionKeys: [region.code] });
            return;
        }
        rowDefinitions.push({
            name: region.code,
            regionKeys: region.children,
            isParent: true,
            isExpanded: state.detailReportExpandedRegions.has(region.code)
        });
        if (state.detailReportExpandedRegions.has(region.code)) {
            region.children.forEach(child => rowDefinitions.push({ name: child, regionKeys: [child], isChild: true }));
        }
    });

    els.detailReportHead.innerHTML = `
        <tr class="report-device-header-row">
            <th class="report-region-head" rowspan="2" scope="col">
                <strong>Khu vực/CNx</strong>
            </th>
            ${groups.map((group, index) => `
                <th class="report-device-group report-device-tone-${index % 5}" colspan="${group.labs.length}" scope="colgroup">
                    ${escapeHTML(group.device)}
                    <span>${group.labs.length} bài lab</span>
                </th>
            `).join('')}
            <th class="report-summary-head" rowspan="2" scope="col">Tổng</th>
        </tr>
        <tr class="report-lab-header-row">
            ${columns.map(column => `
                <th class="report-lab-head report-device-tone-${column.groupIndex % 5} ${column.isFirst ? 'group-start' : ''} ${column.isLast ? 'group-end' : ''}"
                    scope="col" title="${escapeHTML(`${column.device} • ${column.lab}`)}">
                    ${escapeHTML(column.lab)}
                </th>
            `).join('')}
        </tr>
    `;

    els.detailReportBody.innerHTML = rowDefinitions.map(row => {
        const rowTotal = getDetailReportTotal(cellIndex, row.regionKeys, columns);
        const rowClass = row.isParent ? 'report-region-parent' : (row.isChild ? 'report-region-child' : '');
        const regionLabel = row.isParent
            ? `<button type="button" class="report-region-toggle" data-report-region-toggle="${escapeHTML(row.name)}" aria-expanded="${row.isExpanded}">
                    <span>${row.isExpanded ? '▾' : '▸'}</span>${escapeHTML(row.name)}
               </button>`
            : `<div class="report-region-label">${row.isChild ? '<span class="report-region-bullet">•</span>' : '<span class="report-region-spacer"></span>'}${escapeHTML(row.name)}</div>`;
        return `
            <tr class="${rowClass}">
                <th class="report-region-cell" scope="row">${regionLabel}</th>
                ${columns.map(column => renderDetailReportMetricCell(getDetailReportCell(cellIndex, row.regionKeys, column), column.isFirst ? 'group-start' : '')).join('')}
                ${renderDetailReportMetricCell(rowTotal, 'report-row-total')}
            </tr>
        `;
    }).join('');

    const allRegionKeys = [...REGION_FILTER_OPTIONS];
    const grandTotal = getDetailReportTotal(cellIndex, allRegionKeys, columns);
    els.detailReportFoot.innerHTML = `
        <tr>
            <th class="report-region-cell report-grand-label" scope="row">Tổng hệ thống</th>
            ${columns.map(column => renderDetailReportMetricCell(getDetailReportCell(cellIndex, allRegionKeys, column), column.isFirst ? 'group-start' : '')).join('')}
            ${renderDetailReportMetricCell(grandTotal, 'report-row-total report-grand-total')}
        </tr>
    `;

    const activeRegions = new Set(rows.map(item => item.region || getLearnerRegion(item.learner)));
    const activeLabs = new Set(rows.map(item => `${item.device}\u001f${item.lab}`));
    const completed = rows.filter(item => item.status === 'Hoàn thành').length;
    const completionRate = rows.length ? Math.round((completed / rows.length) * 100) : 0;
    const summaryValues = {
        detailReportPeriod: getRangeLabel(),
        detailReportSessions: formatNumber.format(rows.length),
        detailReportRegions: formatNumber.format(activeRegions.size),
        detailReportLabs: formatNumber.format(activeLabs.size),
        detailReportCompletion: `${completionRate}%`
    };
    Object.entries(summaryValues).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    els.detailReportBody.querySelectorAll('[data-report-region-toggle]').forEach(button => {
        button.addEventListener('click', () => {
            const region = button.dataset.reportRegionToggle;
            if (state.detailReportExpandedRegions.has(region)) state.detailReportExpandedRegions.delete(region);
            else state.detailReportExpandedRegions.add(region);
            renderDetailedReport(rows);
        });
    });

    const scrollContainer = document.getElementById('detailReportScroll');
    if (scrollContainer && scrollContainer.dataset.wheelBound !== 'true') {
        scrollContainer.dataset.wheelBound = 'true';
        scrollContainer.addEventListener('wheel', (event) => {
            if (!event.shiftKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
            event.preventDefault();
            scrollContainer.scrollLeft += event.deltaY;
        }, { passive: false });
    }
}

function getRangeLabel() {
    if (isFullCalendarMonth(state.startDate, state.endDate)) {
        const date = parseDate(state.startDate);
        return `Tháng ${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }
    if (state.startDate && state.endDate) return `${formatDate(state.startDate)} - ${formatDate(state.endDate)}`;
    if (state.startDate) return `Từ ${formatDate(state.startDate)}`;
    if (state.endDate) return `Đến ${formatDate(state.endDate)}`;
    const today = new Date();
    return `Tháng ${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
}

function updateRangeText(rows) {
    const label = getRangeLabel();
    const dateRangeText = document.getElementById('dateRangeText');
    if (dateRangeText) dateRangeText.textContent = label;
    if (els.kpiRangeLabel) els.kpiRangeLabel.textContent = label;
}

function statusToVietnamese(status) {
    const map = {
        completed: 'Hoàn thành',
        in_progress: 'Đang làm',
        stuck: 'Đang làm',
        abandoned: 'Chưa thực hiện',
        failed: 'Đang làm',
        not_started: 'Chưa thực hiện'
    };
    return map[status] || status || 'Chưa thực hiện';
}

function dateOnly(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return toDateKey(date);
}

function timeOnly(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        const match = String(value).match(/T(\d{2}:\d{2})/);
        return match?.[1] || '';
    }
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    if (total < 60) return `${total} giây`;
    const minutes = Math.floor(total / 60);
    const rem = total % 60;
    return rem ? `${minutes} phút ${rem} giây` : `${minutes} phút`;
}

function formatDurationCompact(seconds) {
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    if (total < 60) return `${total}s`;
    const minutes = Math.floor(total / 60);
    const rem = total % 60;
    return rem ? `${minutes}m${rem}s` : `${minutes}m`;
}

function formatMetricValue(unit, key, value) {
    if (unit === '%') return `${value}%`;
    if (key === 'avgDuration') return formatDuration(value);
    return formatNumber.format(value) + (unit ? ` ${unit}` : '');
}

function formatMetricDelta(unit, key, value) {
    const sign = value > 0 ? '+' : (value < 0 ? '-' : '');
    const abs = Math.abs(Math.round(value * 10) / 10);
    if (unit === '%') return `${sign}${abs}%`;
    if (key === 'avgDuration') return `${sign}${formatDuration(abs)}`;
    return `${sign}${abs}${unit ? ` ${unit}` : ''}`;
}

let learnerNameMap = new Map();

function rebuildLearnerNameMap() {
    learnerNameMap = new Map();
    sessions.forEach(item => {
        if (!item.learner || learnerNameMap.has(item.learner)) return;
        learnerNameMap.set(item.learner, item.technicianName || item.learner);
    });
}

function getLearnerName(learner) {
    return learnerNameMap.get(learner) || learner || 'KTV chưa xác định';
}

function normalizeActionText(item) {
    return item?.latest_action?.message || item?.latest_action?.action || item?.last_action || 'N/A';
}

function mapApiSessions(apiSessions = []) {
    return apiSessions.map(item => {
        const learner = item.technician?.email || item.email || item.technician?.full_name || item.full_name || item.technician_id || 'Unknown';
        return {
            sessionId: item.session_id,
            technicianId: item.technician_id || item.technician?.technician_id,
            technicianName: item.technician?.full_name || item.full_name || '',
            date: dateOnly(item.started_at),
            time: timeOnly(item.started_at),
            learner,
            region: normalizeRegionName(item.region_name || item.region || item.technician?.region, learner),
            device: item.device?.device_name || item.device_name || item.device_id || 'N/A',
            lab: item.lab?.lab_name || item.lab_name || item.lab_id || 'N/A',
            skill: item.skill?.skill_name || item.skill?.skill_id || item.lab?.lab_name || item.lab_name || 'N/A',
            mode: item.mode || 'Thực hành',
            status: statusToVietnamese(item.status),
            duration: Number(item.duration_sec) || 0,
            firstTry: Boolean(item.completed_first_try),
            lastAction: normalizeActionText(item)
        };
    });
}

function buildDeviceCatalog(devices = [], labs = []) {
    const labsByDevice = new Map();
    labs.forEach(lab => {
        if (!labsByDevice.has(lab.device_id)) labsByDevice.set(lab.device_id, []);
        labsByDevice.get(lab.device_id).push(lab.lab_name);
    });
    return devices.map(device => {
        const deviceLabs = (labsByDevice.get(device.device_id) || []).filter(Boolean);
        return {
            ...device,
            device: device.device_name || device.model || device.device_id,
            totalLabs: deviceLabs.length,
            labs: deviceLabs
        };
    });
}

function setDataSourceLabel(text) {
    state.dataSourceLabel = text;
    const el = document.getElementById('dataSourceLabel');
    if (el) el.textContent = text;
}

function setDashboardLoading(visible) {
    const el = document.getElementById('dashboardLoading');
    if (!el) return;
    el.hidden = !visible;
    el.setAttribute('aria-hidden', String(!visible));
}

let dashboardPollTimer = null;
let dashboardRefreshInFlight = false;
let lastDashboardSignature = '';
const DASHBOARD_POLL_INTERVAL_MS = 30000;

function buildDashboardSignature(data) {
    const list = data.sessions || [];
    const first = list[0];
    const last = list[list.length - 1];
    return [
        list.length,
        first?.session_id || '',
        first?.finished_at || '',
        last?.session_id || '',
        last?.finished_at || '',
        (data.devices || []).length
    ].join('|');
}

async function fetchDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard/all`);
    if (!response.ok) throw new Error(`API trả về HTTP ${response.status}`);
    const payload = await response.json();
    const data = payload.data || {};
    return {
        sessions: mapApiSessions(data.sessions || []),
        deviceCatalog: (Array.isArray(data.devices) && Array.isArray(data.labs))
            ? buildDeviceCatalog(data.devices, data.labs)
            : [],
        raw: data
    };
}

function applyDashboardData(data) {
    sessions = data.sessions;
    deviceCatalog = data.deviceCatalog;
    rebuildLearnerNameMap();
}

function mergeUntouchedFilterSets(allKtvs, allDevices, allLabs) {
    if (!state.realtimeKtvsTouched) state.realtimeSelectedKtvs = new Set([...state.realtimeSelectedKtvs, ...allKtvs]);
    if (!state.learnerKtvsTouched) state.learnerSelectedKtvs = new Set([...state.learnerSelectedKtvs, ...allKtvs]);
    if (!state.learnerDevicesTouched) state.learnerSelectedDevices = new Set([...state.learnerSelectedDevices, ...allDevices]);
    if (!state.learnerLabsTouched) state.learnerSelectedLabs = new Set([...state.learnerSelectedLabs, ...allLabs]);
    if (!state.realtimeDevicesTouched) state.realtimeSelectedDevices = new Set([...state.realtimeSelectedDevices, ...allDevices]);
    if (!state.labDevicesTouched) state.labSelectedDevices = new Set([...state.labSelectedDevices, ...allDevices]);
    if (!state.deviceDevicesTouched) state.deviceSelectedDevices = new Set([...state.deviceSelectedDevices, ...allDevices]);
}

function mergeDefaultClassLearners() {
    const defaultClass = state.instructorClasses.find(item => item.id === 'class-default');
    if (!defaultClass) return;
    const learners = getInstructorLearners();
    if (!learners.length) return;
    const merged = [...new Set([...(defaultClass.members || []), ...learners])].sort((a, b) => a.localeCompare(b, 'vi'));
    if (merged.length !== defaultClass.members.length) {
        defaultClass.members = merged;
        saveInstructorClasses();
    }
}

function refreshFilterOptionLists() {
    const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
    const allDevices = [...new Set(sessions.map(item => item.device))].sort();
    const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
    populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv);
    populatePopoverOptions('realtimeDeviceOptions', allDevices, state.realtimeSelectedDevices, () => { state.realtimeDevicesTouched = true; }, state.realtimeSearchDevice);
    populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => { state.learnerKtvsTouched = true; }, state.learnerSearchKtv);
    populatePopoverOptions('learnerDeviceOptions', allDevices, state.learnerSelectedDevices, () => { state.learnerDevicesTouched = true; });
    populatePopoverOptions('learnerLabOptions', allLabs, state.learnerSelectedLabs, () => { state.learnerLabsTouched = true; });
    populatePopoverOptions('labDeviceOptions', allDevices, state.labSelectedDevices, () => { state.labDevicesTouched = true; }, state.labSearchDevice);
    populatePopoverOptions('deviceOptions', allDevices, state.deviceSelectedDevices, () => { state.deviceDevicesTouched = true; }, state.deviceSearchDevice);
}

async function refreshDashboardData() {
    if (dashboardRefreshInFlight || document.hidden) return;
    dashboardRefreshInFlight = true;
    try {
        const data = await fetchDashboardData();
        const signature = buildDashboardSignature(data.raw);
        if (signature === lastDashboardSignature) return;
        lastDashboardSignature = signature;
        applyDashboardData(data);
        const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
        const allDevices = [...new Set(sessions.map(item => item.device))].sort();
        const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
        mergeUntouchedFilterSets(allKtvs, allDevices, allLabs);
        refreshFilterOptionLists();
        mergeDefaultClassLearners();
        renderAll();
    } catch (error) {
        console.warn('Poll dữ liệu timer_sessions thất bại (giữ dữ liệu cũ).', error);
    } finally {
        dashboardRefreshInFlight = false;
    }
}

function startDashboardPolling() {
    if (dashboardPollTimer) return;
    dashboardPollTimer = setInterval(refreshDashboardData, DASHBOARD_POLL_INTERVAL_MS);
}

async function loadDashboardFromApi() {
    setDashboardLoading(true);
    try {
        setDataSourceLabel('Đang tải dữ liệu từ timer_sessions');
        renderAll();

        const data = await fetchDashboardData();
        lastDashboardSignature = buildDashboardSignature(data.raw);
        applyDashboardData(data);

        state.selectedLearner = '';
        state.learnerTablePage = 1;
        state.learnerDetailPage = 1;
        setDataSourceLabel('Dữ liệu thực từ timer_sessions');
        initFilters();
        initPopovers();
        renderAll();
    } catch (error) {
        console.warn('Không kết nối được dữ liệu timer_sessions.', error);
        sessions = [];
        deviceCatalog = [];
        rebuildLearnerNameMap();
        setDataSourceLabel('Không tải được dữ liệu timer_sessions');
        initFilters();
        initPopovers();
        renderAll();
    } finally {
        setDashboardLoading(false);
        startDashboardPolling();
    }
}

async function loadInitialDashboardData() {
    await loadDashboardFromApi();

    const requestedLearner = new URLSearchParams(window.location.search).get('learner');
    if (activeDashboardView === 'technicians' && requestedLearner && sessions.some(item => item.learner === requestedLearner)) {
        state.selectedLearner = requestedLearner;
        state.learnerDetailPage = 1;
        renderAll();
    }

    initializeInlineComparison();
}

function initFilters() {
    fillSelect('deviceFilter', [...new Set(sessions.map(item => item.device))].sort(), 'Tất cả thiết bị');
    fillSelect('labDeviceFilter', [...new Set(sessions.map(item => item.device))].sort(), 'Tất cả thiết bị');

    if (state.filtersBound) return;
    state.filtersBound = true;

    document.getElementById('deviceFilter')?.addEventListener('change', (e) => {
        state.deviceFilter = e.target.value;
        renderAll();
    });

    document.getElementById('labDeviceFilter')?.addEventListener('change', (e) => {
        state.labDeviceFilter = e.target.value;
        renderAll();
    });
}

let suppressFilterRender = false;
let deferredFilterCallback = null;

function enhanceHeaderFilterPopovers(root = document) {
    root.querySelectorAll('thead .popover-filter-wrapper').forEach(wrapper => {
        const trigger = wrapper.querySelector('.popover-trigger-btn');
        const dropdown = wrapper.querySelector('.popover-dropdown');
        if (!trigger || !dropdown || dropdown.dataset.headerFilterEnhanced === 'true') return;

        dropdown.dataset.headerFilterEnhanced = 'true';
        dropdown.classList.add('header-filter-menu');
        wrapper.classList.add('header-filter-popover');
        wrapper._headerFilterDropdown = dropdown;
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-expanded', 'false');

        const commandRow = document.createElement('div');
        commandRow.className = 'header-filter-command-row';
        commandRow.innerHTML = `
            <button type="button" data-filter-command="all">Chọn tất cả</button>
            <button type="button" data-filter-command="none">Bỏ chọn</button>
        `;
        dropdown.prepend(commandRow);

        let searchInput = dropdown.querySelector('.popover-search');
        if (!searchInput) {
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'popover-search header-filter-search';
            searchInput.placeholder = 'Tìm giá trị...';
            commandRow.insertAdjacentElement('afterend', searchInput);
        }

        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.trim().toLocaleLowerCase('vi');
            dropdown.querySelectorAll('.popover-option').forEach(option => {
                option.hidden = keyword && !option.textContent.toLocaleLowerCase('vi').includes(keyword);
            });
        });

        const updateVisibleCheckboxes = (checked) => {
            const checkboxes = [...dropdown.querySelectorAll('.popover-option:not([hidden]) input[type="checkbox"]')];
            suppressFilterRender = true;
            deferredFilterCallback = null;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked === checked) return;
                checkbox.checked = checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
            suppressFilterRender = false;
            const callback = deferredFilterCallback;
            deferredFilterCallback = null;
            state.realtimePage = 1;
            state.learnerTablePage = 1;
            state.learnerDetailPage = 1;
            if (callback) callback();
            else renderAll();
        };

        commandRow.querySelector('[data-filter-command="all"]')?.addEventListener('click', () => updateVisibleCheckboxes(true));
        commandRow.querySelector('[data-filter-command="none"]')?.addEventListener('click', () => updateVisibleCheckboxes(false));

        let footer = dropdown.querySelector('.popover-footer');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'popover-footer';
            dropdown.appendChild(footer);
        }
        footer.classList.add('header-filter-footer');
        footer.querySelectorAll('.popover-btn-clear').forEach(clearButton => {
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                dropdown.querySelectorAll('.popover-option').forEach(option => { option.hidden = false; });
            });
        });
        const applyButton = document.createElement('button');
        applyButton.type = 'button';
        applyButton.className = 'header-filter-apply';
        applyButton.textContent = 'Áp dụng';
        applyButton.addEventListener('click', () => {
            wrapper.classList.remove('open');
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            state.realtimePage = 1;
            state.learnerTablePage = 1;
            state.learnerDetailPage = 1;
            renderAll();
        });
        footer.appendChild(applyButton);
    });
}

function positionHeaderFilterDropdown(wrapper, shouldOpen) {
    const trigger = wrapper.querySelector('.popover-trigger-btn, .select-popover-btn, .compact-trigger');
    const dropdown = wrapper._floatingDropdown
        || wrapper._headerFilterDropdown
        || wrapper.querySelector('.popover-dropdown');
    if (!trigger || !dropdown) return;
    wrapper._floatingDropdown = dropdown;

    if (!shouldOpen) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        return;
    }

    const rect = trigger.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
        wrapper.classList.remove('open');
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        return;
    }

    dropdown.classList.add('header-filter-floating', 'open');
    dropdown.style.visibility = 'hidden';
    if (dropdown.parentElement !== document.body) document.body.appendChild(dropdown);

    const dropdownRect = dropdown.getBoundingClientRect();
    const panelWidth = dropdownRect.width || 318;
    const panelHeight = dropdownRect.height || 320;
    const left = Math.max(12, Math.min(window.innerWidth - panelWidth - 12, rect.left));
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const openAbove = spaceBelow < panelHeight && rect.top > panelHeight + 12;
    const top = openAbove ? rect.top - panelHeight - 7 : rect.bottom + 7;

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${Math.max(12, Math.min(window.innerHeight - panelHeight - 12, top))}px`;
    dropdown.style.visibility = 'visible';
    trigger.setAttribute('aria-expanded', 'true');
}

let floatingFilterFrame = 0;
function refreshOpenFilterDropdowns() {
    if (floatingFilterFrame) return;
    floatingFilterFrame = requestAnimationFrame(() => {
        floatingFilterFrame = 0;
        document.querySelectorAll('.popover-filter-wrapper.open').forEach(wrapper => {
            positionHeaderFilterDropdown(wrapper, true);
        });
    });
}

window.addEventListener('resize', refreshOpenFilterDropdowns);
window.addEventListener('scroll', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('.popover-dropdown.open')) return;
    refreshOpenFilterDropdowns();
}, true);

function initPopovers() {
    const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
    const allDevices = [...new Set(sessions.map(item => item.device))].sort();
    const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));

    // Fill sets with all items by default on initial load
    if (state.realtimeSelectedKtvs.size === 0 && !state.realtimeKtvsTouched) {
        state.realtimeSelectedKtvs = new Set(allKtvs);
    }
    if (state.learnerSelectedKtvs.size === 0 && !state.learnerKtvsTouched) {
        state.learnerSelectedKtvs = new Set(allKtvs);
    }
    if (state.learnerSelectedDevices.size === 0 && !state.learnerDevicesTouched) {
        state.learnerSelectedDevices = new Set(allDevices);
    }
    if (state.learnerSelectedLabs.size === 0 && !state.learnerLabsTouched) {
        state.learnerSelectedLabs = new Set(allLabs);
    }
    if (state.realtimeSelectedDevices.size === 0 && !state.realtimeDevicesTouched) {
        state.realtimeSelectedDevices = new Set(allDevices);
    }
    if (state.labSelectedDevices.size === 0 && !state.labDevicesTouched) {
        state.labSelectedDevices = new Set(allDevices);
    }
    if (state.deviceSelectedDevices.size === 0 && !state.deviceDevicesTouched) {
        state.deviceSelectedDevices = new Set(allDevices);
    }

    // 1. Realtime KTV Popover
    populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv);
    document.getElementById('realtimeKtvSearch')?.addEventListener('input', (e) => {
        state.realtimeSearchKtv = e.target.value;
        populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv);
    });
    document.getElementById('realtimeKtvClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedKtvs = new Set(allKtvs);
        state.realtimeKtvsTouched = false;
        state.realtimeSearchKtv = '';
        const searchInput = document.getElementById('realtimeKtvSearch');
        if (searchInput) searchInput.value = '';
        populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; });
        renderAll();
    });

    // 2. Realtime Mode Popover
    document.querySelectorAll('#realtimeModeOptions input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                state.realtimeSelectedModes.add(chk.value);
            } else {
                state.realtimeSelectedModes.delete(chk.value);
            }
            state.realtimePage = 1;
            if (!suppressFilterRender) renderAll();
        });
    });
    document.getElementById('realtimeModeClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedModes = new Set(['Thực hành', 'Hướng dẫn']);
        document.querySelectorAll('#realtimeModeOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // 3. Realtime Device Popover
    populatePopoverOptions('realtimeDeviceOptions', allDevices, state.realtimeSelectedDevices, () => { state.realtimeDevicesTouched = true; }, state.realtimeSearchDevice);
    document.getElementById('realtimeDeviceSearch')?.addEventListener('input', (e) => {
        state.realtimeSearchDevice = e.target.value;
        populatePopoverOptions('realtimeDeviceOptions', allDevices, state.realtimeSelectedDevices, () => { state.realtimeDevicesTouched = true; }, state.realtimeSearchDevice);
    });
    document.getElementById('realtimeDeviceClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedDevices = new Set(allDevices);
        state.realtimeDevicesTouched = false;
        state.realtimeSearchDevice = '';
        const searchInput = document.getElementById('realtimeDeviceSearch');
        if (searchInput) searchInput.value = '';
        populatePopoverOptions('realtimeDeviceOptions', allDevices, state.realtimeSelectedDevices, () => { state.realtimeDevicesTouched = true; });
        renderAll();
    });

    // 4. Realtime Status Popover
    document.querySelectorAll('#realtimeStatusOptions input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                state.realtimeSelectedStatuses.add(chk.value);
            } else {
                state.realtimeSelectedStatuses.delete(chk.value);
            }
            state.realtimePage = 1;
            if (!suppressFilterRender) renderAll();
        });
    });
    document.getElementById('realtimeStatusClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedStatuses = new Set(['Hoàn thành', 'Đang làm']);
        document.querySelectorAll('#realtimeStatusOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // 5. Learner table header filters
    populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => {
        state.learnerKtvsTouched = true;
        updatePopoverTriggerLabels();
    });
    populatePopoverOptions('learnerDeviceOptions', allDevices, state.learnerSelectedDevices, () => {
        state.learnerDevicesTouched = true;
        updatePopoverTriggerLabels();
    });
    populatePopoverOptions('learnerLabOptions', allLabs, state.learnerSelectedLabs, () => {
        state.learnerLabsTouched = true;
        updatePopoverTriggerLabels();
    });
    document.getElementById('learnerKtvSearch')?.addEventListener('input', (e) => {
        state.learnerSearchKtv = e.target.value;
        state.learnerTablePage = 1;
        renderAll();
    });
    const repopulateLearnerFilters = () => {
        populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => { state.learnerKtvsTouched = true; });
        populatePopoverOptions('learnerDeviceOptions', allDevices, state.learnerSelectedDevices, () => { state.learnerDevicesTouched = true; });
        populatePopoverOptions('learnerLabOptions', allLabs, state.learnerSelectedLabs, () => { state.learnerLabsTouched = true; });
    };
    const clearHeaderSearch = (wrapperId) => {
        const searchInput = document.querySelector(`#${wrapperId} .header-filter-search`)
            || document.getElementById(wrapperId)?._floatingDropdown?.querySelector('.header-filter-search');
        if (searchInput) searchInput.value = '';
    };
    const resetLearnerFilters = () => {
        state.learnerSelectedKtvs = new Set(allKtvs);
        state.learnerSelectedDevices = new Set(allDevices);
        state.learnerSelectedLabs = new Set(allLabs);
        state.learnerKtvsTouched = false;
        state.learnerDevicesTouched = false;
        state.learnerLabsTouched = false;
        state.learnerSearchKtv = '';
        state.learnerTablePage = 1;
        const searchInput = document.getElementById('learnerKtvSearch');
        if (searchInput) searchInput.value = '';
        clearHeaderSearch('learnerKtvPopoverWrapper');
        clearHeaderSearch('learnerDevicePopoverWrapper');
        clearHeaderSearch('learnerLabPopoverWrapper');
        repopulateLearnerFilters();
        renderAll();
    };
    document.getElementById('learnerKtvClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.learnerSelectedKtvs = new Set(allKtvs);
        state.learnerKtvsTouched = false;
        clearHeaderSearch('learnerKtvPopoverWrapper');
        repopulateLearnerFilters();
        renderAll();
    });
    document.getElementById('learnerDeviceClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.learnerSelectedDevices = new Set(allDevices);
        state.learnerDevicesTouched = false;
        clearHeaderSearch('learnerDevicePopoverWrapper');
        repopulateLearnerFilters();
        renderAll();
    });
    document.getElementById('learnerLabClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.learnerSelectedLabs = new Set(allLabs);
        state.learnerLabsTouched = false;
        clearHeaderSearch('learnerLabPopoverWrapper');
        repopulateLearnerFilters();
        renderAll();
    });
    document.getElementById('learnerFilterReset')?.addEventListener('click', resetLearnerFilters);

    // 6. Learner Detail Mode Popover
    document.querySelectorAll('#detailModeOptions input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                state.detailSelectedModes.add(chk.value);
            } else {
                state.detailSelectedModes.delete(chk.value);
            }
            state.learnerDetailPage = 1;
            if (!suppressFilterRender) renderAll();
        });
    });
    document.getElementById('detailModeClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.detailSelectedModes = new Set(['Thực hành', 'Hướng dẫn']);
        document.querySelectorAll('#detailModeOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // 7. Learner Detail Device Search
    document.getElementById('detailDeviceSearch')?.addEventListener('input', (e) => {
        state.detailSearchDevice = e.target.value;
        renderAll();
    });
    document.getElementById('detailDeviceClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.detailDevicesTouched = false;
        state.detailSelectedDevices.clear();
        state.detailSearchDevice = '';
        const searchInput = document.getElementById('detailDeviceSearch');
        if (searchInput) searchInput.value = '';
        renderAll();
    });

    // 8. Learner Detail Status Popover
    document.querySelectorAll('#detailStatusOptions input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                state.detailSelectedStatuses.add(chk.value);
            } else {
                state.detailSelectedStatuses.delete(chk.value);
            }
            state.learnerDetailPage = 1;
            if (!suppressFilterRender) renderAll();
        });
    });
    document.getElementById('detailStatusClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.detailSelectedStatuses = new Set(['Hoàn thành', 'Đang làm', 'Chưa thực hiện']);
        document.querySelectorAll('#detailStatusOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // 9. Lab Device Popover
    populatePopoverOptions('labDeviceOptions', allDevices, state.labSelectedDevices, () => { state.labDevicesTouched = true; }, state.labSearchDevice);
    document.getElementById('labDeviceSearch')?.addEventListener('input', (e) => {
        state.labSearchDevice = e.target.value;
        populatePopoverOptions('labDeviceOptions', allDevices, state.labSelectedDevices, () => { state.labDevicesTouched = true; }, state.labSearchDevice);
    });
    document.getElementById('labDeviceClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.labSelectedDevices = new Set(allDevices);
        state.labDevicesTouched = false;
        state.labSearchDevice = '';
        const input = document.getElementById('labDeviceSearch');
        if (input) input.value = '';
        populatePopoverOptions('labDeviceOptions', allDevices, state.labSelectedDevices, () => { state.labDevicesTouched = true; });
        renderAll();
    });

    // 10. Device Section Popover
    populatePopoverOptions('deviceOptions', allDevices, state.deviceSelectedDevices, () => { state.deviceDevicesTouched = true; }, state.deviceSearchDevice);
    document.getElementById('deviceSearch')?.addEventListener('input', (e) => {
        state.deviceSearchDevice = e.target.value;
        populatePopoverOptions('deviceOptions', allDevices, state.deviceSelectedDevices, () => { state.deviceDevicesTouched = true; }, state.deviceSearchDevice);
    });
    document.getElementById('deviceClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.deviceSelectedDevices = new Set(allDevices);
        state.deviceDevicesTouched = false;
        state.deviceSearchDevice = '';
        const input = document.getElementById('deviceSearch');
        if (input) input.value = '';
        populatePopoverOptions('deviceOptions', allDevices, state.deviceSelectedDevices, () => { state.deviceDevicesTouched = true; });
        renderAll();
    });

    // Bind triggers toggle
    document.querySelectorAll('.popover-filter-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.popover-trigger-btn, .select-popover-btn, .compact-trigger');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.popover-filter-wrapper').forEach(w => {
                w.classList.remove('open');
                w.querySelector('.popover-trigger-btn')?.setAttribute('aria-expanded', 'false');
                positionHeaderFilterDropdown(w, false);
            });
            if (!isOpen) {
                wrapper.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                positionHeaderFilterDropdown(wrapper, true);
            }
        });
        wrapper.querySelector('.popover-dropdown')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.popover-filter-wrapper').forEach(w => {
            w.classList.remove('open');
            w.querySelector('.popover-trigger-btn')?.setAttribute('aria-expanded', 'false');
            positionHeaderFilterDropdown(w, false);
        });
    });

    enhanceHeaderFilterPopovers();
}

function renderRealtimeSubmissions(dateSessions) {
    const tbody = document.getElementById('realtimeSubmissionsBody');
    const meta = document.getElementById('realtimeSubmissionsMeta');
    const badge = document.getElementById('realtimeSubmissionBadge');
    if (!tbody) return;

    let filtered = dateSessions.filter(item => item.status !== 'Chưa thực hiện');

    // Filter by KTV popover
    filtered = filtered.filter(item => state.realtimeSelectedKtvs.has(item.learner));
    // Filter by Mode popover
    filtered = filtered.filter(item => state.realtimeSelectedModes.has(item.mode || 'Thực hành'));
    // Filter by Device popover
    filtered = filtered.filter(item => state.realtimeSelectedDevices.has(item.device));
    // Filter by Status popover
    filtered = filtered.filter(item => state.realtimeSelectedStatuses.has(item.status));

    // Sort by Date & Time
    filtered.sort((a, b) => {
        const timeA = parseDate(a.date).getTime() + (a.time ? parseTimeMs(a.time) : 0);
        const timeB = parseDate(b.date).getTime() + (b.time ? parseTimeMs(b.time) : 0);
        return state.realtimeTimeSortDir === 'asc' ? timeA - timeB : timeB - timeA;
    });

    if (badge) badge.textContent = `${filtered.length} bài nộp`;

    if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">Không có bài nộp nào phù hợp với bộ lọc.</td></tr>';
        if (meta) meta.innerHTML = '';
        return;
    }

    const pageSize = 5;
    const pageData = getPageSlice(filtered, state.realtimePage, pageSize);
    state.realtimePage = pageData.currentPage;

    tbody.innerHTML = pageData.rows.map(item => `
        <tr>
            <td><strong>${escapeHTML(formatDateTime(item.date, item.time))}</strong></td>
            <td><div class="learner-link" title="${escapeHTML(item.learner)}">${escapeHTML(getLearnerName(item.learner))}</div></td>
            <td><span class="mode-pill ${item.mode === 'Hướng dẫn' ? 'mode-guide' : 'mode-practice'}">${escapeHTML(item.mode || 'Thực hành')}</span></td>
            <td>${escapeHTML(item.device)}</td>
            <td>${escapeHTML(item.lab)}</td>
            <td><span class="status-pill ${getStatusClass(item.status)}">${escapeHTML(item.status)}</span></td>
        </tr>
    `).join('');

    if (meta) {
        meta.innerHTML = `
            <span>Hiển thị ${pageData.start + 1}-${pageData.end} / ${pageData.totalRows} bài nộp</span>
            <span class="table-page-controls">
                <button type="button" class="table-page-btn" data-realtime-page="prev" ${pageData.currentPage <= 1 ? 'disabled' : ''}>Trước</button>
                <span>Trang ${pageData.currentPage}/${pageData.totalPages}</span>
                <button type="button" class="table-page-btn" data-realtime-page="next" ${pageData.currentPage >= pageData.totalPages ? 'disabled' : ''}>Sau</button>
            </span>
        `;
        meta.querySelectorAll('[data-realtime-page]').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const action = button.dataset.realtimePage;
                state.realtimePage += action === 'next' ? 1 : -1;
                renderAll();
            });
        });
    }
}

function parseTimeMs(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2 || parts.some(isNaN)) return 0;
    return (parts[0] * 3600 + parts[1] * 60) * 1000;
}

const INSTRUCTOR_CLASSES_STORAGE_KEY = 'ftc-instructor-classes-v1';

function getInstructorLearners() {
    return [...new Set(sessions.map(item => item.learner).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'vi'));
}

function getInstructorDeviceGroups() {
    const groups = [];
    const groupMap = new Map();
    const ensureGroup = (deviceName) => {
        const name = deviceName || 'Thiết bị chưa xác định';
        if (!groupMap.has(name)) {
            const group = { device: name, labs: [] };
            groupMap.set(name, group);
            groups.push(group);
        }
        return groupMap.get(name);
    };

    deviceCatalog.forEach(item => {
        const group = ensureGroup(item.device || item.device_name || item.model);
        (item.labs || []).forEach(lab => {
            if (lab && !group.labs.includes(lab)) group.labs.push(lab);
        });
    });
    sessions.forEach(item => {
        const group = ensureGroup(item.device);
        if (item.lab && !group.labs.includes(item.lab)) group.labs.push(item.lab);
    });
    return groups.filter(group => group.labs.length);
}

function saveInstructorClasses() {
    try {
        localStorage.setItem(INSTRUCTOR_CLASSES_STORAGE_KEY, JSON.stringify(state.instructorClasses));
    } catch (error) {
        console.warn('Không thể lưu danh sách lớp trên trình duyệt.', error);
    }
}

function initializeInstructorClasses() {
    if (!state.instructorClassesLoaded) {
        try {
            const stored = JSON.parse(localStorage.getItem(INSTRUCTOR_CLASSES_STORAGE_KEY) || '[]');
            if (Array.isArray(stored)) {
                state.instructorClasses = stored
                    .filter(item => item && item.id && item.name && Array.isArray(item.members))
                    .map(item => ({
                        id: String(item.id),
                        name: String(item.name),
                        members: [...new Set(item.members.map(String).filter(Boolean))]
                    }));
            }
        } catch (error) {
            state.instructorClasses = [];
        }
        state.instructorClassesLoaded = true;
    }

    const learners = getInstructorLearners();
    if (!state.instructorClasses.length && !learners.length) {
        state.instructorActiveClassId = '';
        return;
    }

    if (!state.instructorClasses.length && learners.length) {
        const reportDate = state.startDate ? parseDate(state.startDate) : new Date();
        state.instructorClasses = [{
            id: 'class-default',
            name: `Lớp KTV ${String(reportDate.getMonth() + 1).padStart(2, '0')}/${reportDate.getFullYear()}`,
            members: learners
        }];
        saveInstructorClasses();
    } else {
        const defaultClass = state.instructorClasses.find(item => item.id === 'class-default');
        if (defaultClass && learners.length) {
            const merged = [...new Set([...(defaultClass.members || []), ...learners])].sort((a, b) => a.localeCompare(b, 'vi'));
            if (merged.length !== (defaultClass.members || []).length) {
                defaultClass.members = merged;
                saveInstructorClasses();
            }
        }
    }

    if (!state.instructorClasses.some(item => item.id === state.instructorActiveClassId)) {
        state.instructorActiveClassId = state.instructorClasses[0]?.id || '';
    }
}

function getInstructorClassProgress(selectedClass, selectedGroups) {
    const completedStatus = statusToVietnamese('completed');
    const rowsByLearner = new Map();
    sessions.forEach(item => {
        if (!rowsByLearner.has(item.learner)) rowsByLearner.set(item.learner, []);
        rowsByLearner.get(item.learner).push(item);
    });

    return (selectedClass?.members || []).map(learner => {
        const learnerSessions = rowsByLearner.get(learner) || [];
        const deviceResults = selectedGroups.map(group => {
            const completedLabs = new Set(
                learnerSessions
                    .filter(item => item.device === group.device && item.status === completedStatus)
                    .map(item => item.lab)
            );
            const labResults = group.labs.map(lab => ({ lab, completed: completedLabs.has(lab) }));
            const completed = labResults.filter(item => item.completed).length;
            const total = group.labs.length;
            return { device: group.device, labResults, completed, total, rate: total ? Math.round((completed / total) * 100) : 0 };
        });
        const completed = deviceResults.reduce((sum, item) => sum + item.completed, 0);
        const total = deviceResults.reduce((sum, item) => sum + item.total, 0);
        return {
            learner,
            deviceResults,
            completed,
            total,
            rate: total ? Math.round((completed / total) * 100) : 0
        };
    });
}

function getInstructorLabCellClass(completed) {
    return completed ? 'instructor-progress-complete' : 'instructor-progress-zero';
}

function getInstructorRateClass(rate) {
    if (rate >= 80) return 'instructor-rate-high';
    if (rate >= 50) return 'instructor-rate-medium';
    return 'instructor-rate-low';
}

function renderInstructorClassProgress() {
    const classSelect = document.getElementById('instructorClassSelect');
    const deviceSelect = document.getElementById('instructorDeviceSelect');
    const head = document.getElementById('instructorProgressHead');
    const body = document.getElementById('instructorProgressBody');
    const summary = document.getElementById('instructorProgressSummary');
    const scroll = document.getElementById('instructorProgressScroll');
    const empty = document.getElementById('instructorProgressEmpty');
    if (!classSelect || !deviceSelect || !head || !body || !summary || !scroll || !empty) return;

    initializeInstructorClasses();
    if (state.instructorActiveClassId && !state.instructorClasses.some(item => item.id === state.instructorActiveClassId)) {
        state.instructorActiveClassId = state.instructorClasses[0]?.id || '';
    }

    classSelect.innerHTML = state.instructorClasses.length
        ? state.instructorClasses.map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)} · ${item.members.length} KTV</option>`).join('')
        : '<option value="">Chưa có lớp học</option>';
    classSelect.value = state.instructorActiveClassId;
    classSelect.disabled = !state.instructorClasses.length;

    const allGroups = getInstructorDeviceGroups();
    const selectedDeviceStillExists = !state.instructorSelectedDevice || allGroups.some(item => item.device === state.instructorSelectedDevice);
    if (!selectedDeviceStillExists) state.instructorSelectedDevice = '';
    deviceSelect.innerHTML = '<option value="">Tất cả thiết bị</option>' + allGroups
        .map(item => `<option value="${escapeHTML(item.device)}">${escapeHTML(item.device)}</option>`)
        .join('');
    deviceSelect.value = state.instructorSelectedDevice;

    const deleteButton = document.getElementById('instructorClassDelete');
    const exportButton = document.getElementById('instructorClassExport');
    if (deleteButton) deleteButton.disabled = !state.instructorClasses.length;
    if (exportButton) exportButton.disabled = !state.instructorClasses.length;

    const selectedClass = state.instructorClasses.find(item => item.id === state.instructorActiveClassId);
    if (!selectedClass) {
        head.innerHTML = '';
        body.innerHTML = '';
        summary.innerHTML = '';
        scroll.hidden = true;
        empty.hidden = false;
        empty.textContent = 'Chưa có lớp học. Nhập tên lớp và chọn “Tạo lớp” để bắt đầu.';
        return;
    }

    const selectedGroups = state.instructorSelectedDevice
        ? allGroups.filter(item => item.device === state.instructorSelectedDevice)
        : allGroups;
    const progressRows = getInstructorClassProgress(selectedClass, selectedGroups);
    const completed = progressRows.reduce((sum, item) => sum + item.completed, 0);
    const total = progressRows.reduce((sum, item) => sum + item.total, 0);
    const rate = total ? Math.round((completed / total) * 100) : 0;

    const columns = selectedGroups.flatMap((group, groupIndex) => group.labs.map((lab, labIndex) => ({
        device: group.device,
        lab,
        groupIndex,
        isFirst: labIndex === 0
    })));

    summary.innerHTML = `
        <span class="instructor-summary-chip"><strong>${progressRows.length}</strong> KTV</span>
        <span class="instructor-summary-chip"><strong>${selectedGroups.length}</strong> thiết bị</span>
        <span class="instructor-summary-chip"><strong>${columns.length}</strong> bài lab</span>
        <span class="instructor-summary-chip"><strong>${completed}/${total}</strong> bài hoàn thành</span>
        <span class="instructor-summary-chip"><strong>${rate}%</strong> tiến độ lớp</span>
    `;

    head.innerHTML = `
        <tr class="instructor-progress-group-row">
            <th class="instructor-progress-index" rowspan="2" scope="col">STT</th>
            <th class="instructor-progress-email" rowspan="2" scope="col">KTV</th>
            ${selectedGroups.map((group, index) => `
                <th class="instructor-progress-device instructor-progress-group instructor-progress-tone-${index % 5}" colspan="${group.labs.length}" scope="colgroup">
                    ${escapeHTML(group.device)}
                    <span>${group.labs.length} bài lab</span>
                </th>
            `).join('')}
            <th class="instructor-progress-total" rowspan="2" scope="col">Hoàn thành</th>
            <th class="instructor-progress-rate" rowspan="2" scope="col">Tỷ lệ</th>
        </tr>
        <tr class="instructor-progress-lab-row">
            ${columns.map(column => `
                <th class="instructor-progress-lab instructor-progress-lab-tone-${column.groupIndex % 5} ${column.isFirst ? 'group-start' : ''}" scope="col" title="${escapeHTML(`${column.device} • ${column.lab}`)}">${escapeHTML(column.lab)}</th>
            `).join('')}
        </tr>
    `;
    body.innerHTML = progressRows.map((row, index) => `
        <tr>
            <td class="instructor-progress-index">${index + 1}</td>
            <th class="instructor-progress-email" scope="row" title="${escapeHTML(row.learner)}">${escapeHTML(getLearnerName(row.learner))}</th>
            ${row.deviceResults.flatMap(item => item.labResults.map(lab => `
                <td class="instructor-progress-lab instructor-lab-cell ${getInstructorLabCellClass(lab.completed)}" title="${escapeHTML(`${item.device} • ${lab.lab}: ${lab.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}`)}">
                    ${lab.completed ? '✓' : '0%'}
                </td>
            `)).join('')}
            <td class="instructor-progress-total">${row.completed}/${row.total}</td>
            <td class="instructor-progress-rate ${getInstructorRateClass(row.rate)}">${row.rate}%</td>
        </tr>
    `).join('');

    scroll.hidden = false;
    empty.hidden = true;
}

function setInstructorFeedback(message, type = '') {
    const feedback = document.getElementById('instructorClassFeedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `instructor-class-feedback${type ? ` is-${type}` : ''}`;
}

function createInstructorClass() {
    const input = document.getElementById('instructorClassName');
    const name = input?.value.trim() || '';
    if (!name) {
        setInstructorFeedback('Vui lòng nhập tên lớp trước khi tạo.', 'error');
        input?.focus();
        return;
    }
    if (state.instructorClasses.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        setInstructorFeedback('Tên lớp đã tồn tại. Vui lòng chọn tên khác.', 'error');
        return;
    }
    const members = state.instructorImportMembers.length ? state.instructorImportMembers : getInstructorLearners();
    if (!members.length) {
        setInstructorFeedback('Không có KTV để thêm vào lớp.', 'error');
        return;
    }
    const newClass = { id: `class-${Date.now()}`, name, members: [...new Set(members)] };
    state.instructorClasses.push(newClass);
    state.instructorActiveClassId = newClass.id;
    state.instructorImportMembers = [];
    state.instructorImportFileName = '';
    if (input) input.value = '';
    const fileInput = document.getElementById('instructorClassFile');
    if (fileInput) fileInput.value = '';
    saveInstructorClasses();
    setInstructorFeedback(`Đã tạo lớp “${name}” với ${newClass.members.length} KTV.`, 'success');
    renderInstructorClassProgress();
}

function parseInstructorCsv(text) {
    const emails = String(text || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    return [...new Set(emails.map(item => item.trim().toLowerCase()))];
}

async function handleInstructorClassFile(file) {
    if (!file) return;
    state.instructorImportFileName = file.name;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'txt'].includes(extension)) {
        state.instructorImportMembers = [];
        setInstructorFeedback('Bản dashboard hiện đọc trực tiếp file CSV. Với Excel, hãy lưu thành CSV trước khi nhập.', 'error');
        return;
    }
    try {
        const emails = parseInstructorCsv(await file.text());
        state.instructorImportMembers = emails;
        if (!emails.length) {
            setInstructorFeedback(`Không tìm thấy email hợp lệ trong “${file.name}”.`, 'error');
            return;
        }
        setInstructorFeedback(`Đã đọc ${emails.length} email từ “${file.name}”. Nhập tên lớp và chọn “Tạo lớp”.`, 'success');
    } catch (error) {
        state.instructorImportMembers = [];
        setInstructorFeedback('Không thể đọc file đã chọn. Vui lòng kiểm tra lại định dạng CSV.', 'error');
    }
}

function exportInstructorClassCsv() {
    const selectedClass = state.instructorClasses.find(item => item.id === state.instructorActiveClassId);
    if (!selectedClass) return;
    const groups = getInstructorDeviceGroups().filter(item => !state.instructorSelectedDevice || item.device === state.instructorSelectedDevice);
    const progressRows = getInstructorClassProgress(selectedClass, groups);
    const escapeCsv = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = ['STT', 'KTV', ...groups.flatMap(group => group.labs.map(lab => `${group.device} - ${lab}`)), 'Hoàn thành', 'Tỷ lệ'];
    const csvRows = progressRows.map((row, index) => [
        index + 1,
        row.learner,
        ...row.deviceResults.flatMap(item => item.labResults.map(lab => (lab.completed ? '1' : '0'))),
        `${row.completed}/${row.total}`,
        `${row.rate}%`
    ]);
    const blob = new Blob([`\uFEFF${[header, ...csvRows].map(row => row.map(escapeCsv).join(',')).join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedClass.name.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'lop_ktv'}_tien_do.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function initInstructorWorkspace() {
    if (state.instructorWorkspaceBound) return;
    state.instructorWorkspaceBound = true;
    document.getElementById('instructorClassFileButton')?.addEventListener('click', () => {
        document.getElementById('instructorClassFile')?.click();
    });
    document.getElementById('instructorClassFile')?.addEventListener('change', event => {
        handleInstructorClassFile(event.target.files?.[0]);
    });
    document.getElementById('instructorClassCreate')?.addEventListener('click', createInstructorClass);
    document.getElementById('instructorClassName')?.addEventListener('keydown', event => {
        if (event.key === 'Enter') createInstructorClass();
    });
    document.getElementById('instructorClassSelect')?.addEventListener('change', event => {
        state.instructorActiveClassId = event.target.value;
        renderInstructorClassProgress();
    });
    document.getElementById('instructorDeviceSelect')?.addEventListener('change', event => {
        state.instructorSelectedDevice = event.target.value;
        renderInstructorClassProgress();
    });
    document.getElementById('instructorClassDelete')?.addEventListener('click', () => {
        const selectedClass = state.instructorClasses.find(item => item.id === state.instructorActiveClassId);
        if (!selectedClass || !window.confirm(`Xóa lớp “${selectedClass.name}”?`)) return;
        state.instructorClasses = state.instructorClasses.filter(item => item.id !== selectedClass.id);
        state.instructorActiveClassId = state.instructorClasses[0]?.id || '';
        saveInstructorClasses();
        setInstructorFeedback(`Đã xóa lớp “${selectedClass.name}”.`, 'success');
        renderInstructorClassProgress();
    });
    document.getElementById('instructorClassExport')?.addEventListener('click', exportInstructorClassCsv);
}

function renderAll() {
    const dateSessions = getDateFilteredSessions();

    renderKpis();
    renderOverviewMonthlyTrend(sessions);
    renderInstructorClassProgress();
    renderRealtimeSubmissions(dateSessions);
    renderSessions(sessions);
    renderLearnerDetail(sessions);
    renderDetailedReport(dateSessions);
    renderSortMarks();
    updatePopoverTriggerLabels();
    updateRangeText(dateSessions);
    enhanceHeaderFilterPopovers();
}

function updatePopoverTriggerLabels() {
    const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
    const allDevices = [...new Set(sessions.map(item => item.device))].sort();
    const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
    const learnerReset = document.getElementById('learnerFilterReset');
    const selectedLearners = state.learnerSelectedKtvs.size;
    const ktvFiltered = selectedLearners !== allKtvs.length;
    const deviceFiltered = state.learnerSelectedDevices.size !== allDevices.length;
    const labFiltered = state.learnerSelectedLabs.size !== allLabs.length;
    document.getElementById('learnerKtvPopoverWrapper')?.classList.toggle('has-filter', ktvFiltered);
    document.getElementById('learnerDevicePopoverWrapper')?.classList.toggle('has-filter', deviceFiltered);
    document.getElementById('learnerLabPopoverWrapper')?.classList.toggle('has-filter', labFiltered);
    if (learnerReset) learnerReset.hidden = !ktvFiltered && !deviceFiltered && !labFiltered && !state.learnerSearchKtv.trim();

    const labLabel = document.getElementById('labDeviceTriggerLabel');
    if (labLabel) {
        if (state.labSelectedDevices.size === allDevices.length) labLabel.textContent = 'Tất cả thiết bị';
        else if (state.labSelectedDevices.size === 0) labLabel.textContent = 'Chưa chọn thiết bị';
        else labLabel.textContent = `${state.labSelectedDevices.size} thiết bị`;
    }
    const devLabel = document.getElementById('deviceTriggerLabel');
    if (devLabel) {
        if (state.deviceSelectedDevices.size === allDevices.length) devLabel.textContent = 'Tất cả thiết bị';
        else if (state.deviceSelectedDevices.size === 0) devLabel.textContent = 'Chưa chọn thiết bị';
        else devLabel.textContent = `${state.deviceSelectedDevices.size} thiết bị`;
    }
}

function initSort() {
    document.querySelectorAll('.sort-button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.id === 'realtimeTimeSort') {
                state.realtimeTimeSortDir = state.realtimeTimeSortDir === 'asc' ? 'desc' : 'asc';
                state.realtimePage = 1;
                renderAll();
                return;
            }
            if (button.id === 'detailTimeSort') {
                state.detailSortKey = 'time';
                state.detailTimeSortDir = state.detailTimeSortDir === 'asc' ? 'desc' : 'asc';
                state.learnerDetailPage = 1;
                renderAll();
                return;
            }
            if (button.id === 'detailDurationSort') {
                state.detailSortKey = 'duration';
                state.detailDurationSortDir = state.detailDurationSortDir === 'asc' ? 'desc' : 'asc';
                state.learnerDetailPage = 1;
                renderAll();
                return;
            }
            const sortState = state.sessionsSort;
            if (sortState.key === button.dataset.key) {
                sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortState.key = button.dataset.key;
                sortState.direction = ['total', 'lastDate'].includes(button.dataset.key) ? 'desc' : 'asc';
            }
            if (button.dataset.table === 'sessions') state.learnerTablePage = 1;
            renderAll();
        });
    });
    document.getElementById('labSortSelect')?.addEventListener('change', renderAll);
    document.getElementById('deviceSortSelect')?.addEventListener('change', renderAll);
}

function populateCalendarSelects() {
    const monthSelect = document.getElementById('dateRangeMonthSelect');
    const yearSelect = document.getElementById('dateRangeYearSelect');
    if (monthSelect) {
        monthSelect.innerHTML = Array.from({ length: 12 }, (_, index) => `<option value="${index}">Tháng ${index + 1}</option>`).join('');
    }
    if (yearSelect) {
        yearSelect.innerHTML = [2025, 2026, 2027].map(year => `<option value="${year}">${year}</option>`).join('');
    }
}

function renderCalendar() {
    const monthSelect = document.getElementById('dateRangeMonthSelect');
    const yearSelect = document.getElementById('dateRangeYearSelect');
    const startText = document.getElementById('dateRangeStartText');
    const endText = document.getElementById('dateRangeEndText');

    const month = state.calendarMonth.getMonth();
    const year = state.calendarMonth.getFullYear();

    if (monthSelect) monthSelect.value = month;
    if (yearSelect) yearSelect.value = year;
    if (startText) startText.textContent = formatDate(state.tempStartDate);
    if (endText) endText.textContent = formatDate(state.tempEndDate);

    const firstOfMonth = new Date(year, month, 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);
    const days = [];
    for (let i = 0; i < 42; i += 1) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + i);
        const key = toDateKey(day);
        const selectedStart = state.tempStartDate ? parseDate(state.tempStartDate) : null;
        const selectedEnd = state.tempEndDate ? parseDate(state.tempEndDate) : null;
        const inRange = selectedStart && selectedEnd && day >= selectedStart && day <= selectedEnd;
        const isSelected = sameDay(day, selectedStart) || sameDay(day, selectedEnd);
        days.push(`
            <button type="button" class="date-day ${day.getMonth() !== month ? 'outside' : ''} ${inRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''}" data-date="${key}">
                ${day.getDate()}
            </button>
        `);
    }
    const daysContainer = document.getElementById('dateRangeDays');
    if (daysContainer) {
        daysContainer.innerHTML = days.join('');
        daysContainer.querySelectorAll('.date-day').forEach(button => {
            button.addEventListener('click', () => {
                const selected = button.dataset.date;
                if (!state.tempStartDate || (state.tempStartDate && state.tempEndDate)) {
                    state.tempStartDate = selected;
                    state.tempEndDate = '';
                } else if (parseDate(selected) < parseDate(state.tempStartDate)) {
                    state.tempEndDate = state.tempStartDate;
                    state.tempStartDate = selected;
                } else {
                    state.tempEndDate = selected;
                }
                renderCalendar();
            });
        });
    }
}

function initDateRangePicker() {
    const monthInput = document.getElementById('overviewMonthSelect');
    if (monthInput) {
        const today = new Date();
        const trigger = document.getElementById('overviewMonthTrigger');
        const label = document.getElementById('overviewMonthLabel');
        const panel = document.getElementById('overviewMonthPanel');
        const yearSelect = document.getElementById('overviewYearSelect');
        const monthGrid = document.getElementById('overviewMonthGrid');
        const currentMonthButton = document.getElementById('overviewMonthToday');

        if (panel) {
            panel.classList.add('portal');
            document.body.appendChild(panel);
        }

        const positionMonthPanel = () => {
            if (!trigger || !panel) return;
            const rect = trigger.getBoundingClientRect();
            const panelWidth = 288;
            const left = Math.max(12, Math.min(window.innerWidth - panelWidth - 12, rect.right - panelWidth));
            panel.style.top = `${rect.bottom + 12}px`;
            panel.style.left = `${left}px`;
        };

        const applySelectedMonth = (year, monthIndex, closePanel = true) => {
            monthInput.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            const bounds = getMonthBounds(monthInput.value);
            if (!bounds) return;
            state.startDate = bounds.start;
            state.endDate = bounds.end;
            state.tempStartDate = bounds.start;
            state.tempEndDate = bounds.end;
            state.calendarMonth = new Date(bounds.year, bounds.monthIndex, 1);
            state.learnerTablePage = 1;
            state.learnerDetailPage = 1;
            state.realtimePage = 1;
            if (label) label.textContent = `${String(monthIndex + 1).padStart(2, '0')}/${year}`;
            if (yearSelect) yearSelect.value = String(year);
            if (closePanel) {
                panel?.classList.remove('open');
                trigger?.setAttribute('aria-expanded', 'false');
            }
            renderMonthGrid(year);
            renderAll();
        };

        const renderMonthGrid = (year = Number(yearSelect?.value) || today.getFullYear()) => {
            if (!monthGrid) return;
            const selectedBounds = getMonthBounds(monthInput.value);
            monthGrid.innerHTML = Array.from({ length: 12 }, (_, monthIndex) => {
                const isFuture = year > today.getFullYear()
                    || (year === today.getFullYear() && monthIndex > today.getMonth());
                const isSelected = selectedBounds?.year === year && selectedBounds?.monthIndex === monthIndex;
                return `<button type="button" class="overview-month-option ${isSelected ? 'selected' : ''}" data-report-month="${monthIndex}" ${isFuture ? 'disabled' : ''}>Th ${monthIndex + 1}</button>`;
            }).join('');
            monthGrid.querySelectorAll('[data-report-month]').forEach(button => {
                button.addEventListener('click', () => {
                    applySelectedMonth(year, Number(button.dataset.reportMonth));
                });
            });
        };

        if (yearSelect) {
            yearSelect.innerHTML = Array.from({ length: 3 }, (_, index) => today.getFullYear() - 2 + index)
                .map(year => `<option value="${year}">${year}</option>`)
                .join('');
            yearSelect.value = String(today.getFullYear());
            yearSelect.addEventListener('change', () => renderMonthGrid(Number(yearSelect.value)));
        }

        trigger?.addEventListener('click', (event) => {
            event.stopPropagation();
            const willOpen = !panel?.classList.contains('open');
            panel?.classList.toggle('open', willOpen);
            trigger.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) {
                positionMonthPanel();
                renderMonthGrid(Number(yearSelect?.value) || today.getFullYear());
            }
        });
        panel?.addEventListener('click', event => event.stopPropagation());
        currentMonthButton?.addEventListener('click', () => applySelectedMonth(today.getFullYear(), today.getMonth()));
        document.addEventListener('click', () => {
            panel?.classList.remove('open');
            trigger?.setAttribute('aria-expanded', 'false');
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                panel?.classList.remove('open');
                trigger?.setAttribute('aria-expanded', 'false');
            }
        });
        window.addEventListener('resize', () => {
            if (panel?.classList.contains('open')) positionMonthPanel();
        });
        window.addEventListener('scroll', () => {
            if (panel?.classList.contains('open')) positionMonthPanel();
        }, true);

        applySelectedMonth(today.getFullYear(), today.getMonth(), false);
        return;
    }

    populateCalendarSelects();
    renderCalendar();
    const picker = document.getElementById('dateRangePicker');
    const panel = document.getElementById('dateRangePanel');

    document.getElementById('dateRangeTrigger')?.addEventListener('click', (event) => {
        event.stopPropagation();
        state.tempStartDate = state.startDate;
        state.tempEndDate = state.endDate;
        renderCalendar();
        picker?.classList.toggle('open');
    });

    panel?.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    document.getElementById('dateRangePrev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.calendarMonth.setMonth(state.calendarMonth.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('dateRangeNext')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.calendarMonth.setMonth(state.calendarMonth.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('dateRangeMonthSelect')?.addEventListener('change', (event) => {
        state.calendarMonth.setMonth(Number(event.target.value));
        renderCalendar();
    });

    document.getElementById('dateRangeYearSelect')?.addEventListener('change', (event) => {
        state.calendarMonth.setFullYear(Number(event.target.value));
        renderCalendar();
    });

    document.getElementById('dateRangeApply')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.startDate = state.tempStartDate;
        state.endDate = state.tempEndDate || state.tempStartDate;
        state.learnerTablePage = 1;
        state.learnerDetailPage = 1;
        state.realtimePage = 1;
        picker?.classList.remove('open');
        renderAll();
    });

    document.getElementById('dateRangeClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.tempStartDate = '';
        state.tempEndDate = '';
        state.startDate = '';
        state.endDate = '';
        state.learnerTablePage = 1;
        state.learnerDetailPage = 1;
        state.realtimePage = 1;
        picker?.classList.remove('open');
        renderCalendar();
        renderAll();
    });

    document.addEventListener('click', (event) => {
        if (picker && !picker.contains(event.target)) picker.classList.remove('open');
    });
}

function initExport() {
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const rows = getDateFilteredSessions();
        const header = ['date', 'learner', 'device', 'lab', 'skill', 'status', 'duration'];
        const csv = [header.join(',')]
            .concat(rows.map(row => header.map(key => `"${String(row[key]).replace(/"/g, '""')}"`).join(',')))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const today = new Date();
        const dateStamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        link.download = `bao_cao_ktv_${dateStamp}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    });
}

const DONUT_COLORS = ['#e43f86', '#7953c7', '#39b8da', '#f5a623', '#3dcc72', '#a55bb5'];

function renderDeviceDonutChart(rows) {
    const donutContainer = document.getElementById('learnerDeviceDonut');
    const legendContainer = document.getElementById('learnerDeviceLegend');
    if (!donutContainer || !legendContainer) return;

    const items = aggregateBy(rows, 'device').sort((a, b) => b.sessions - a.sessions);
    const totalSessions = rows.length;

    if (!items.length || !totalSessions) {
        donutContainer.innerHTML = '<div class="empty">Không có dữ liệu.</div>';
        legendContainer.innerHTML = '';
        return;
    }

    const R = 60;
    const C = 2 * Math.PI * R;
    let accumulatedOffset = 0;

    const svgPaths = items.map((item, index) => {
        const color = DONUT_COLORS[index % DONUT_COLORS.length];
        const percent = item.sessions / totalSessions;
        const dashArray = `${percent * C} ${C - percent * C}`;
        const strokeOffset = -accumulatedOffset;
        accumulatedOffset += percent * C;

        return `
            <circle class="donut-segment"
                cx="80" cy="80" r="${R}"
                fill="none"
                stroke="${color}"
                stroke-width="18"
                stroke-dasharray="${dashArray}"
                stroke-dashoffset="${strokeOffset}"
                data-device="${escapeHTML(item.name)}"
                data-sessions="${item.sessions}"
                data-percent="${Math.round(percent * 100)}%"
            />
        `;
    }).join('');

    donutContainer.innerHTML = `
        <svg viewBox="0 0 160 160">
            ${svgPaths}
        </svg>
        <div class="donut-center-text">
            <span class="donut-center-val">${totalSessions}</span>
            <span class="donut-center-lbl">bài đã làm</span>
        </div>
    `;

    legendContainer.innerHTML = items.map((item, index) => {
        const color = DONUT_COLORS[index % DONUT_COLORS.length];
        const percent = Math.round((item.sessions / totalSessions) * 100);
        return `
            <div class="legend-item" data-device="${escapeHTML(item.name)}" title="Click để xem chi tiết bài làm">
                <div class="legend-label-group">
                    <span class="legend-dot" style="background: ${color};"></span>
                    <span class="legend-name">${escapeHTML(item.name)}</span>
                </div>
                <span class="legend-val">${item.sessions} bài (${percent}%)</span>
            </div>
        `;
    }).join('');

    const tooltip = document.getElementById('donutTooltip');
    const updateTooltip = (e, text) => {
        if (!tooltip) return;
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY}px`;
    };
    const hideTooltip = () => {
        if (tooltip) tooltip.style.display = 'none';
    };

    donutContainer.querySelectorAll('.donut-segment').forEach(seg => {
        const device = seg.dataset.device;
        const sessionsCount = seg.dataset.sessions;
        const pct = seg.dataset.percent;
        seg.addEventListener('mousemove', (e) => updateTooltip(e, `${device}: ${sessionsCount} bài đã làm (${pct})`));
        seg.addEventListener('mouseleave', hideTooltip);
        seg.addEventListener('click', () => {
            hideTooltip();
            openDeviceSubModal(device, rows);
        });
    });

    legendContainer.querySelectorAll('.legend-item').forEach(item => {
        const device = item.dataset.device;
        item.addEventListener('click', () => openDeviceSubModal(device, rows));
    });
}

let currentSubModalData = {
    deviceName: '',
    allLabsList: [],
    activeFilter: 'all'
};

function openDeviceSubModal(deviceName, rows) {
    const modal = document.getElementById('deviceSubModal');
    const title = document.getElementById('subModalDeviceTitle');
    const subtitle = document.getElementById('subModalDeviceSubtitle');
    if (!modal) return;

    const catalogItem = deviceCatalog.find(d => d.device === deviceName || d.device_name === deviceName || d.model === deviceName);
    const assignedLabs = catalogItem?.labs || [];
    const deviceSessions = rows.filter(item => item.device === deviceName);

    const labMap = new Map();

    assignedLabs.forEach(labName => {
        labMap.set(labName, {
            labName,
            sessions: []
        });
    });

    deviceSessions.forEach(session => {
        if (!labMap.has(session.lab)) {
            labMap.set(session.lab, {
                labName: session.lab,
                sessions: []
            });
        }
        const entry = labMap.get(session.lab);
        entry.sessions.push(session);
    });

    const allLabsList = [...labMap.values()].map(entry => {
        const guideCount = entry.sessions.filter(s => s.mode === 'Hướng dẫn').length;
        const practiceCount = entry.sessions.filter(s => s.mode === 'Thực hành').length;
        const totalCount = entry.sessions.length;

        let modeText = '';
        if (guideCount > 0 && practiceCount > 0) {
            modeText = `${guideCount} lần Hướng dẫn, ${practiceCount} lần Thực hành`;
        } else if (guideCount > 0) {
            modeText = `${guideCount} lần Hướng dẫn`;
        } else if (practiceCount > 0) {
            modeText = `${practiceCount} lần Thực hành`;
        } else {
            modeText = 'Chưa làm';
        }

        if (!totalCount) {
            return {
                ...entry,
                statusCategory: 'not_started',
                statusLabel: 'Chưa làm',
                badgeClass: 'status-notstarted',
                totalCount: 0,
                guideCount: 0,
                practiceCount: 0,
                modeText: 'Chưa làm',
                lastDateTimeStr: 'N/A',
                lastDuration: '0 giây'
            };
        }
        const latest = [...entry.sessions].sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];
        const isDone = entry.sessions.some(s => s.status === 'Hoàn thành');
        const statusCategory = isDone ? 'done' : 'pending';
        const statusLabel = isDone ? 'Hoàn thành' : 'Đang làm';
        const badgeClass = getStatusClass(statusLabel);
        const lastDateTimeStr = formatDateTime(latest.date, latest.time);
        const lastDuration = formatDuration(latest.duration);

        return {
            ...entry,
            latestSession: latest,
            statusCategory,
            statusLabel,
            badgeClass,
            totalCount,
            guideCount,
            practiceCount,
            modeText,
            lastDateTimeStr,
            lastDuration
        };
    });

    const totalLabsCount = allLabsList.length;
    const doneCount = allLabsList.filter(item => item.statusCategory === 'done').length;
    const pendingCount = allLabsList.filter(item => item.statusCategory === 'pending').length;
    const notStartedCount = allLabsList.filter(item => item.statusCategory === 'not_started').length;

    if (title) title.textContent = `Chi tiết thiết bị: ${deviceName}`;
    if (subtitle) subtitle.textContent = `Tổng số ${totalLabsCount} bài lab thuộc quy trình của thiết bị ${deviceName}`;

    const totalLabsEl = document.getElementById('subModalTotalLabs');
    const completedCountEl = document.getElementById('subModalCompletedCount');
    const uncompletedCountEl = document.getElementById('subModalUncompletedCount');
    const unattemptedCountEl = document.getElementById('subModalUnattemptedCount');

    if (totalLabsEl) totalLabsEl.textContent = `${totalLabsCount} bài`;
    if (completedCountEl) completedCountEl.textContent = `${doneCount} bài`;
    if (uncompletedCountEl) uncompletedCountEl.textContent = `${pendingCount} bài`;
    if (unattemptedCountEl) unattemptedCountEl.textContent = `${notStartedCount} bài`;

    const cntAll = document.getElementById('cntAll');
    const cntDone = document.getElementById('cntDone');
    const cntPending = document.getElementById('cntPending');
    const cntNotStarted = document.getElementById('cntNotStarted');

    if (cntAll) cntAll.textContent = totalLabsCount;
    if (cntDone) cntDone.textContent = doneCount;
    if (cntPending) cntPending.textContent = pendingCount;
    if (cntNotStarted) cntNotStarted.textContent = notStartedCount;

    currentSubModalData = {
        deviceName,
        allLabsList,
        activeFilter: 'all'
    };

    document.querySelectorAll('.sub-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subFilter === 'all');
    });

    renderSubModalLabList('all');

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
}

function renderSubModalLabList(filter) {
    const listEl = document.getElementById('subModalLabList');
    if (!listEl) return;

    let filtered = currentSubModalData.allLabsList || [];
    if (filter === 'done') {
        filtered = filtered.filter(item => item.statusCategory === 'done');
    } else if (filter === 'pending') {
        filtered = filtered.filter(item => item.statusCategory === 'pending');
    } else if (filter === 'not_started') {
        filtered = filtered.filter(item => item.statusCategory === 'not_started');
    }

    if (!filtered.length) {
        listEl.innerHTML = '<div class="empty">Không có bài lab nào phù hợp với bộ lọc.</div>';
        return;
    }

    listEl.innerHTML = filtered.map(item => {
        if (item.statusCategory === 'not_started') {
            return `
                <div class="sub-modal-item">
                    <div class="sub-modal-item-top">
                        <div class="sub-modal-item-title">${escapeHTML(item.labName)}</div>
                        <span class="status-pill status-notstarted">Chưa làm</span>
                    </div>
                    <div class="sub-modal-item-grid2x2">
                        <div class="sub-modal-cell">Gần nhất: <strong>Chưa thực hiện</strong></div>
                        <div class="sub-modal-cell">Số lần Hướng dẫn: <strong>0 lần</strong></div>
                        <div class="sub-modal-cell">Tổng số lần đã làm: <strong>0 lần</strong></div>
                        <div class="sub-modal-cell">Số lần Thực hành: <strong>0 lần</strong></div>
                    </div>
                </div>
            `;
        }
        return `
            <div class="sub-modal-item">
                <div class="sub-modal-item-top">
                    <div class="sub-modal-item-title">${escapeHTML(item.labName)}</div>
                    <span class="status-pill ${item.badgeClass}">${escapeHTML(item.statusLabel)}</span>
                </div>
                <div class="sub-modal-item-grid2x2">
                    <div class="sub-modal-cell">Gần nhất: <strong>${escapeHTML(item.lastDateTimeStr)}</strong> (${item.lastDuration})</div>
                    <div class="sub-modal-cell">Số lần Hướng dẫn: <strong>${item.guideCount} lần</strong></div>
                    <div class="sub-modal-cell">Tổng số lần đã làm: <strong>${item.totalCount} lần</strong></div>
                    <div class="sub-modal-cell">Số lần Thực hành: <strong>${item.practiceCount} lần</strong></div>
                </div>
            </div>
        `;
    }).join('');
}

function initSubModalEvents() {
    const modal = document.getElementById('deviceSubModal');
    const closeBtn = document.getElementById('subModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal?.classList.remove('visible');
            modal?.setAttribute('aria-hidden', 'true');
        });
    }

    document.querySelectorAll('.sub-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.subFilter;
            renderSubModalLabList(filter);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.classList.contains('visible')) {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

function initEvents() {
    els.learnerDetailClose?.addEventListener('click', () => {
        hideLearnerDetail();
        renderAll();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !document.body.classList.contains('detail-open')) return;
        hideLearnerDetail();
        renderAll();
    });

    document.addEventListener('click', (event) => {
        if (!document.body.classList.contains('detail-open')) return;
        const path = event.composedPath();
        const insideCard = path.some(el => el.classList?.contains('learner-detail-card') || el.classList?.contains('sub-modal-card') || el.getAttribute?.('data-learner'));
        if (insideCard) return;
        hideLearnerDetail();
        renderAll();
    });
}

let currentCompareTableTab = 'overview';

function populatePopoverOptions(containerId, values, selectedSet, onCheckChange, searchVal = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredValues = searchVal
        ? values.filter(v => String(v).toLowerCase().includes(searchVal.toLowerCase()))
        : values;

    if (!filteredValues.length) {
        container.innerHTML = '<div class="popover-empty">Không tìm thấy giá trị phù hợp.</div>';
        return;
    }

    container.innerHTML = filteredValues.map(val => {
        const checked = selectedSet.has(val) ? 'checked' : '';
        return `
            <label class="popover-option">
                <input type="checkbox" value="${escapeHTML(val)}" ${checked}>
                <span>${escapeHTML(val)}</span>
            </label>
        `;
    }).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedSet.add(e.target.value);
            } else {
                selectedSet.delete(e.target.value);
            }
            if (typeof onCheckChange === 'function') {
                if (suppressFilterRender) deferredFilterCallback = onCheckChange;
                else onCheckChange();
            }
            if (!containerId.startsWith('compare') && !suppressFilterRender) {
                state.realtimePage = 1;
                state.learnerTablePage = 1;
                state.learnerDetailPage = 1;
                renderAll();
            }
        });
    });
}

function filterSessionsByDate(startStr, endStr) {
    return sessions.filter(item => {
        if (!item.date) return false;
        const date = parseDate(item.date);
        if (isNaN(date.getTime()) || date.getTime() === 0) return false;

        if (startStr) {
            const start = parseDate(startStr);
            start.setHours(0, 0, 0, 0);
            if (date < start) return false;
        }

        if (endStr) {
            const end = parseDate(endStr);
            end.setHours(23, 59, 59, 999);
            if (date > end) return false;
        }

        return true;
    });
}

function computeMetrics(rows) {
    const totalSessions = rows.length;
    const completed = rows.filter(item => item.status === 'Hoàn thành').length;
    const learners = new Set(rows.map(item => item.learner)).size;
    const rate = totalSessions ? Math.round((completed / totalSessions) * 1000) / 10 : 0;

    const firstTryCount = rows.filter(item => item.firstTry && item.status === 'Hoàn thành').length;
    const firstTryRate = completed ? Math.round((firstTryCount / completed) * 100) : (totalSessions ? Math.round((firstTryCount / totalSessions) * 100) : 0);

    const totalDuration = rows.reduce((sum, item) => sum + (item.duration || 0), 0);
    const avgDuration = totalSessions ? Math.round(totalDuration / totalSessions) : 0;

    return {
        totalSessions,
        learners,
        completed,
        rate,
        firstTryRate,
        avgDuration
    };
}

function formatDateRangeLabel(startStr, endStr) {
    if (!startStr && !endStr) return 'Toàn bộ thời gian';
    if (startStr && endStr) return `${formatDate(startStr)} - ${formatDate(endStr)}`;
    if (startStr) return `Từ ${formatDate(startStr)}`;
    return `Đến ${formatDate(endStr)}`;
}

function formatDateShortRange(startStr, endStr) {
    if (!startStr || !endStr) return '';
    const dStart = parseDate(startStr);
    const dEnd = parseDate(endStr);
    const sDay = String(dStart.getDate()).padStart(2, '0');
    const sMonth = String(dStart.getMonth() + 1).padStart(2, '0');
    const eDay = String(dEnd.getDate()).padStart(2, '0');
    const eMonth = String(dEnd.getMonth() + 1).padStart(2, '0');
    return `${sDay}/${sMonth} - ${eDay}/${eMonth}`;
}

const ALL_METRIC_MAP = {
    totalSessions: 'Tổng số phiên làm lab',
    learners: 'Số KTV tham gia',
    completed: 'Số lab đã hoàn thành',
    rate: 'Tỷ lệ hoàn thành',
    firstTryRate: 'Hoàn thành lần đầu',
    avgDuration: 'Thời gian trung bình'
};

const compareState = {
    sortKey: 'name',
    sortDir: 'asc',
    selectedMetrics: new Set(Object.keys(ALL_METRIC_MAP)),
    searchMetric: '',
    selectedRegions: new Set(),
    searchRegion: '',
    selectedKtvs: new Set(),
    searchKtv: ''
};

function renderCompareCards(metricsA, metricsB, startA, endA) {
    const cardsGrid = document.getElementById('compareCardsGrid');
    if (!cardsGrid) return;

    const shortA = formatDateShortRange(startA, endA);
    const labelSubtextSuffix = shortA ? ` (Kỳ A: ${shortA})` : ' so với Kỳ A';

    const cardsDef = [
        {
            key: 'totalSessions',
            title: 'Tổng số phiên làm lab',
            unit: 'phiên',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
            isHigherBetter: true
        },
        {
            key: 'learners',
            title: 'Số KTV tham gia thực hành',
            unit: 'người',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
            isHigherBetter: true
        },
        {
            key: 'completed',
            title: 'Số bài lab đã hoàn thành',
            unit: 'bài',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            isHigherBetter: true
        },
        {
            key: 'rate',
            title: 'Tỷ lệ hoàn thành tổng thể',
            unit: '%',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`,
            isHigherBetter: true
        },
        {
            key: 'firstTryRate',
            title: 'Hoàn thành ngay lần đầu',
            unit: '%',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
            isHigherBetter: true
        },
        {
            key: 'avgDuration',
            title: 'Thời gian làm bài trung bình',
            unit: 'giây',
            icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            isHigherBetter: false
        }
    ];

    cardsGrid.innerHTML = cardsDef.map(card => {
        const valA = metricsA[card.key];
        const valB = metricsB[card.key];
        const diff = Math.round((valB - valA) * 10) / 10;

        let subtext = '';
        let subClass = 'sub-neutral';

        if (diff > 0) {
            const isGood = card.isHigherBetter;
            subClass = isGood ? 'sub-positive' : 'sub-negative';
            subtext = `${formatMetricDelta(card.unit, card.key, diff)}${labelSubtextSuffix}`;
        } else if (diff < 0) {
            const isGood = !card.isHigherBetter;
            subClass = isGood ? 'sub-positive' : 'sub-negative';
            subtext = `${formatMetricDelta(card.unit, card.key, diff)}${labelSubtextSuffix}`;
        } else {
            subtext = `Bằng với Kỳ A${shortA ? ' (' + shortA + ')' : ''}`;
        }

        const valFormatted = formatMetricValue(card.unit, card.key, valB);

        return `
            <div class="compare-stat-card">
                <div class="compare-card-top">
                    <div class="compare-card-title">${card.title}</div>
                    <div class="compare-card-icon">${card.icon}</div>
                </div>
                <div class="compare-card-value">${valFormatted}</div>
                <div class="compare-card-subtext ${subClass}">${subtext}</div>
                <div class="compare-card-watermark"></div>
            </div>
        `;
    }).join('');
}

function renderCompareTable(rowsA, rowsB, metricsA, metricsB, startA, endA, startB, endB) {
    const tableHead = document.getElementById('compareTableHead');
    const tableBody = document.getElementById('compareTableBody');
    const tableFoot = document.getElementById('compareTableFoot');
    if (!tableHead || !tableBody) return;

    const labelA = formatDateRangeLabel(startA, endA);
    const labelB = formatDateRangeLabel(startB, endB);

    if (currentCompareTableTab === 'overview') {
        const allMetricEntries = Object.entries(ALL_METRIC_MAP);
        if (compareState.selectedMetrics.size === 0) {
            allMetricEntries.forEach(([k]) => compareState.selectedMetrics.add(k));
        }

        tableHead.innerHTML = `
            <tr>
                <th>
                    <div class="popover-filter-wrapper" id="compareMetricPopoverWrapper">
                        <button class="sort-button popover-trigger-btn" type="button" data-compare-key="label">
                            Chỉ số <span class="sort-mark">${compareState.sortKey === 'label' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </button>
                        <div class="popover-dropdown" id="compareMetricDropdown">
                            <input type="text" class="popover-search" id="compareMetricSearch" value="${escapeHTML(compareState.searchMetric)}" placeholder="Tìm chỉ số...">
                            <div class="popover-options" id="compareMetricOptions"></div>
                            <div class="popover-footer">
                                <button type="button" class="popover-btn-clear" id="compareMetricClear">Xóa lọc</button>
                            </div>
                        </div>
                    </div>
                </th>
                <th><button class="sort-button" type="button" data-compare-key="valA">Kỳ A <span class="sort-mark">${compareState.sortKey === 'valA' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="valB">Kỳ B <span class="sort-mark">${compareState.sortKey === 'valB' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="diff">Chênh lệch <span class="sort-mark">${compareState.sortKey === 'diff' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="pct">Tỷ lệ thay đổi <span class="sort-mark">${compareState.sortKey === 'pct' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
            </tr>
        `;

        populatePopoverOptions('compareMetricOptions', allMetricEntries.map(([k, v]) => v), new Set([...compareState.selectedMetrics].map(k => ALL_METRIC_MAP[k])), () => {
            const selectedLabels = new Set();
            document.querySelectorAll('#compareMetricOptions input:checked').forEach(cb => selectedLabels.add(cb.value));
            compareState.selectedMetrics = new Set(allMetricEntries.filter(([k, v]) => selectedLabels.has(v)).map(([k]) => k));
            renderCompareResults();
        }, compareState.searchMetric);

        let metricsDef = [
            { key: 'totalSessions', label: 'Tổng số phiên làm lab', unit: 'phiên', isHigherBetter: true },
            { key: 'learners', label: 'Số KTV tham gia', unit: 'người', isHigherBetter: true },
            { key: 'completed', label: 'Số lab đã hoàn thành', unit: 'bài', isHigherBetter: true },
            { key: 'rate', label: 'Tỷ lệ hoàn thành', unit: '%', isHigherBetter: true },
            { key: 'firstTryRate', label: 'Hoàn thành lần đầu', unit: '%', isHigherBetter: true },
            { key: 'avgDuration', label: 'Thời gian trung bình', unit: 'giây', isHigherBetter: false }
        ]
        .filter(m => compareState.selectedMetrics.has(m.key))
        .map(m => {
            const valA = metricsA[m.key];
            const valB = metricsB[m.key];
            const diff = Math.round((valB - valA) * 10) / 10;
            const pct = valA > 0 ? Math.round(((valB - valA) / valA) * 100) : (valB > 0 ? 100 : 0);
            return { ...m, valA, valB, diff, pct };
        });

        metricsDef.sort((a, b) => compareValues(a[compareState.sortKey || 'label'], b[compareState.sortKey || 'label'], compareState.sortDir));

        tableBody.innerHTML = metricsDef.map(m => {
            const valAFormatted = formatMetricValue(m.unit, m.key, m.valA);
            const valBFormatted = formatMetricValue(m.unit, m.key, m.valB);

            let diffText = formatMetricDelta(m.unit, m.key, m.diff);
            if (m.diff !== 0 && m.unit !== '%' && m.key !== 'avgDuration' && m.unit) diffText += ` ${m.unit}`;

            let pctText = m.pct > 0 ? `+${m.pct}%` : `${m.pct}%`;
            if (m.diff === 0) {
                diffText = '0';
                pctText = '0%';
            }

            return `
                <tr>
                    <td><strong>${m.label}</strong></td>
                    <td>${valAFormatted}</td>
                    <td>${valBFormatted}</td>
                    <td><strong style="color: ${m.diff > 0 ? '#16a34a' : (m.diff < 0 ? '#dc2626' : 'inherit')};">${diffText}</strong></td>
                    <td><span class="compare-metric-delta ${m.pct > 0 ? (m.isHigherBetter ? 'delta-up' : 'delta-down') : (m.pct < 0 ? (m.isHigherBetter ? 'delta-down' : 'delta-up') : 'delta-neutral')}">${pctText}</span></td>
                </tr>
            `;
        }).join('');

        if (tableFoot) {
            const totalDiff = rowsB.length - rowsA.length;
            const totalPct = rowsA.length > 0 ? Math.round(((rowsB.length - rowsA.length) / rowsA.length) * 100) : (rowsB.length > 0 ? 100 : 0);

            tableFoot.innerHTML = `
                <tr>
                    <td>Tổng (${metricsDef.length} chỉ số)</td>
                    <td>${formatNumber.format(rowsA.length)} phiên</td>
                    <td>${formatNumber.format(rowsB.length)} phiên</td>
                    <td><strong style="color: ${totalDiff > 0 ? '#16a34a' : (totalDiff < 0 ? '#dc2626' : 'inherit')};">${totalDiff > 0 ? '+' : ''}${totalDiff} phiên</strong></td>
                    <td><span class="compare-metric-delta ${totalPct > 0 ? 'delta-up' : (totalPct < 0 ? 'delta-down' : 'delta-neutral')}">${totalPct > 0 ? '+' : ''}${totalPct}%</span></td>
                </tr>
            `;
        }
    } else if (currentCompareTableTab === 'region') {
        const allRegions = [...new Set(sessions.map(s => s.region || 'Chưa phân vùng'))].sort();
        if (compareState.selectedRegions.size === 0) {
            allRegions.forEach(r => compareState.selectedRegions.add(r));
        }

        tableHead.innerHTML = `
            <tr>
                <th>
                    <div class="popover-filter-wrapper" id="compareRegionPopoverWrapper">
                        <button class="sort-button popover-trigger-btn" type="button" data-compare-key="name">
                            Vùng <span class="sort-mark">${compareState.sortKey === 'name' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </button>
                        <div class="popover-dropdown" id="compareRegionDropdown">
                            <input type="text" class="popover-search" id="compareRegionSearch" value="${escapeHTML(compareState.searchRegion)}" placeholder="Tìm vùng...">
                            <div class="popover-options" id="compareRegionOptions"></div>
                            <div class="popover-footer">
                                <button type="button" class="popover-btn-clear" id="compareRegionClear">Xóa lọc</button>
                            </div>
                        </div>
                    </div>
                </th>
                <th><button class="sort-button" type="button" data-compare-key="totA">Kỳ A <span class="sort-mark">${compareState.sortKey === 'totA' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="totB">Kỳ B <span class="sort-mark">${compareState.sortKey === 'totB' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="rateA">Tỷ lệ HT (A) <span class="sort-mark">${compareState.sortKey === 'rateA' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="rateB">Tỷ lệ HT (B) <span class="sort-mark">${compareState.sortKey === 'rateB' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="diff">Chênh lệch <span class="sort-mark">${compareState.sortKey === 'diff' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="pct">Thay đổi (%) <span class="sort-mark">${compareState.sortKey === 'pct' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
            </tr>
        `;

        populatePopoverOptions('compareRegionOptions', allRegions, compareState.selectedRegions, () => {
            renderCompareResults();
        }, compareState.searchRegion);

        const mapA = new Map();
        rowsA.forEach(r => {
            const reg = r.region || 'Chưa phân vùng';
            if (!mapA.has(reg)) mapA.set(reg, { total: 0, completed: 0 });
            const item = mapA.get(reg);
            item.total++;
            if (r.status === 'Hoàn thành') item.completed++;
        });

        const mapB = new Map();
        rowsB.forEach(r => {
            const reg = r.region || 'Chưa phân vùng';
            if (!mapB.has(reg)) mapB.set(reg, { total: 0, completed: 0 });
            const item = mapB.get(reg);
            item.total++;
            if (r.status === 'Hoàn thành') item.completed++;
        });

        let list = [...new Set([...mapA.keys(), ...mapB.keys()])]
            .filter(reg => compareState.selectedRegions.has(reg))
            .map(reg => {
                const a = mapA.get(reg) || { total: 0, completed: 0 };
                const b = mapB.get(reg) || { total: 0, completed: 0 };
                const rateA = a.total ? Math.round((a.completed / a.total) * 100) : 0;
                const rateB = b.total ? Math.round((b.completed / b.total) * 100) : 0;
                const diff = b.total - a.total;
                const pct = a.total > 0 ? Math.round(((b.total - a.total) / a.total) * 100) : (b.total > 0 ? 100 : 0);
                return { name: reg, totA: a.total, compA: a.completed, totB: b.total, compB: b.completed, rateA, rateB, diff, pct };
            });

        list.sort((a, b) => compareValues(a[compareState.sortKey || 'name'], b[compareState.sortKey || 'name'], compareState.sortDir));

        if (!list.length) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: var(--muted);">Không có dữ liệu vùng phù hợp.</td></tr>';
            if (tableFoot) tableFoot.innerHTML = '';
            return;
        }

        tableBody.innerHTML = list.map(item => `
            <tr>
                <td><strong title="${escapeHTML(item.name)}">${escapeHTML(getLearnerName(item.name))}</strong></td>
                <td>${item.totA} phiên (${item.compA} HT)</td>
                <td>${item.totB} phiên (${item.compB} HT)</td>
                <td>${item.rateA}%</td>
                <td>${item.rateB}%</td>
                <td><strong style="color: ${item.diff > 0 ? '#16a34a' : (item.diff < 0 ? '#dc2626' : 'inherit')};">${item.diff > 0 ? '+' : ''}${item.diff}</strong></td>
                <td><span class="compare-metric-delta ${item.pct > 0 ? 'delta-up' : (item.pct < 0 ? 'delta-down' : 'delta-neutral')}">${item.pct > 0 ? '+' : ''}${item.pct}%</span></td>
            </tr>
        `).join('');

        if (tableFoot) {
            const sumTotA = list.reduce((s, i) => s + i.totA, 0);
            const sumCompA = list.reduce((s, i) => s + i.compA, 0);
            const sumTotB = list.reduce((s, i) => s + i.totB, 0);
            const sumCompB = list.reduce((s, i) => s + i.compB, 0);

            const avgRateA = sumTotA ? Math.round((sumCompA / sumTotA) * 100) : 0;
            const avgRateB = sumTotB ? Math.round((sumCompB / sumTotB) * 100) : 0;
            const sumDiff = sumTotB - sumTotA;
            const sumPct = sumTotA > 0 ? Math.round(((sumTotB - sumTotA) / sumTotA) * 100) : (sumTotB > 0 ? 100 : 0);

            tableFoot.innerHTML = `
                <tr>
                    <td>Tổng (${list.length} Vùng)</td>
                    <td>${sumTotA} phiên (${sumCompA} HT)</td>
                    <td>${sumTotB} phiên (${sumCompB} HT)</td>
                    <td>${avgRateA}%</td>
                    <td>${avgRateB}%</td>
                    <td><strong style="color: ${sumDiff > 0 ? '#16a34a' : (sumDiff < 0 ? '#dc2626' : 'inherit')};">${sumDiff > 0 ? '+' : ''}${sumDiff}</strong></td>
                    <td><span class="compare-metric-delta ${sumPct > 0 ? 'delta-up' : (sumPct < 0 ? 'delta-down' : 'delta-neutral')}">${sumPct > 0 ? '+' : ''}${sumPct}%</span></td>
                </tr>
            `;
        }
    } else if (currentCompareTableTab === 'learner') {
        const allKtvs = [...new Set(sessions.map(s => s.learner || 'Unknown'))].sort();
        if (compareState.selectedKtvs.size === 0) {
            allKtvs.forEach(k => compareState.selectedKtvs.add(k));
        }

        tableHead.innerHTML = `
            <tr>
                <th>
                    <div class="popover-filter-wrapper" id="compareKtvPopoverWrapper">
                        <button class="sort-button popover-trigger-btn" type="button" data-compare-key="name">
                            Technician (KTV) <span class="sort-mark">${compareState.sortKey === 'name' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </button>
                        <div class="popover-dropdown" id="compareKtvDropdown">
                            <input type="text" class="popover-search" id="compareKtvSearch" value="${escapeHTML(compareState.searchKtv)}" placeholder="Tìm KTV...">
                            <div class="popover-options" id="compareKtvOptions"></div>
                            <div class="popover-footer">
                                <button type="button" class="popover-btn-clear" id="compareKtvClear">Xóa lọc</button>
                            </div>
                        </div>
                    </div>
                </th>
                <th><button class="sort-button" type="button" data-compare-key="region">Vùng <span class="sort-mark">${compareState.sortKey === 'region' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="totA">Kỳ A <span class="sort-mark">${compareState.sortKey === 'totA' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="totB">Kỳ B <span class="sort-mark">${compareState.sortKey === 'totB' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="compA">HT (A) <span class="sort-mark">${compareState.sortKey === 'compA' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="compB">HT (B) <span class="sort-mark">${compareState.sortKey === 'compB' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="diff">Chênh lệch <span class="sort-mark">${compareState.sortKey === 'diff' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
                <th><button class="sort-button" type="button" data-compare-key="pct">Thay đổi (%) <span class="sort-mark">${compareState.sortKey === 'pct' ? (compareState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>
            </tr>
        `;

        populatePopoverOptions('compareKtvOptions', allKtvs, compareState.selectedKtvs, () => {
            renderCompareResults();
        }, compareState.searchKtv);

        const mapA = new Map();
        rowsA.forEach(r => {
            const learner = r.learner || 'N/A';
            if (!mapA.has(learner)) mapA.set(learner, { total: 0, completed: 0, region: r.region });
            const item = mapA.get(learner);
            item.total++;
            if (r.status === 'Hoàn thành') item.completed++;
        });

        const mapB = new Map();
        rowsB.forEach(r => {
            const learner = r.learner || 'N/A';
            if (!mapB.has(learner)) mapB.set(learner, { total: 0, completed: 0, region: r.region });
            const item = mapB.get(learner);
            item.total++;
            if (r.status === 'Hoàn thành') item.completed++;
        });

        let list = [...new Set([...mapA.keys(), ...mapB.keys()])]
            .filter(learner => compareState.selectedKtvs.has(learner))
            .map(learner => {
                const a = mapA.get(learner) || { total: 0, completed: 0, region: '' };
                const b = mapB.get(learner) || { total: 0, completed: 0, region: '' };
                const region = b.region || a.region || 'N/A';
                const diff = b.total - a.total;
                const pct = a.total > 0 ? Math.round(((b.total - a.total) / a.total) * 100) : (b.total > 0 ? 100 : 0);
                return { name: learner, region, totA: a.total, compA: a.completed, totB: b.total, compB: b.completed, diff, pct };
            });

        list.sort((a, b) => compareValues(a[compareState.sortKey || 'name'], b[compareState.sortKey || 'name'], compareState.sortDir));

        if (!list.length) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: var(--muted);">Không có dữ liệu KTV phù hợp.</td></tr>';
            if (tableFoot) tableFoot.innerHTML = '';
            return;
        }

        tableBody.innerHTML = list.map(item => `
            <tr>
                <td><strong title="${escapeHTML(item.name)}">${escapeHTML(getLearnerName(item.name))}</strong></td>
                <td>${escapeHTML(item.region)}</td>
                <td>${item.totA}</td>
                <td>${item.totB}</td>
                <td>${item.compA}</td>
                <td>${item.compB}</td>
                <td><strong style="color: ${item.diff > 0 ? '#16a34a' : (item.diff < 0 ? '#dc2626' : 'inherit')};">${item.diff > 0 ? '+' : ''}${item.diff}</strong></td>
                <td><span class="compare-metric-delta ${item.pct > 0 ? 'delta-up' : (item.pct < 0 ? 'delta-down' : 'delta-neutral')}">${item.pct > 0 ? '+' : ''}${item.pct}%</span></td>
            </tr>
        `).join('');

        if (tableFoot) {
            const sumTotA = list.reduce((s, i) => s + i.totA, 0);
            const sumCompA = list.reduce((s, i) => s + i.compA, 0);
            const sumTotB = list.reduce((s, i) => s + i.totB, 0);
            const sumCompB = list.reduce((s, i) => s + i.compB, 0);
            const sumDiff = sumTotB - sumTotA;
            const sumPct = sumTotA > 0 ? Math.round(((sumTotB - sumTotA) / sumTotA) * 100) : (sumTotB > 0 ? 100 : 0);

            tableFoot.innerHTML = `
                <tr>
                    <td>Tổng (${list.length} KTV)</td>
                    <td>-</td>
                    <td>${sumTotA}</td>
                    <td>${sumTotB}</td>
                    <td>${sumCompA}</td>
                    <td>${sumCompB}</td>
                    <td><strong style="color: ${sumDiff > 0 ? '#16a34a' : (sumDiff < 0 ? '#dc2626' : 'inherit')};">${sumDiff > 0 ? '+' : ''}${sumDiff}</strong></td>
                    <td><span class="compare-metric-delta ${sumPct > 0 ? 'delta-up' : (sumPct < 0 ? 'delta-down' : 'delta-neutral')}">${sumPct > 0 ? '+' : ''}${sumPct}%</span></td>
                </tr>
            `;
        }
    }

    // Attach click listeners for sorting on table headers
    tableHead.querySelectorAll('.sort-button[data-compare-key]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.dataset.compareKey;
            if (compareState.sortKey === key) {
                compareState.sortDir = compareState.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                compareState.sortKey = key;
                compareState.sortDir = ['totA', 'totB', 'compA', 'compB', 'diff', 'pct', 'valA', 'valB'].includes(key) ? 'desc' : 'asc';
            }
            renderCompareResults();
        });
    });

    // Attach search & clear event listeners for compare popovers
    document.getElementById('compareMetricSearch')?.addEventListener('input', (e) => {
        compareState.searchMetric = e.target.value;
        const allMetricEntries = Object.entries(ALL_METRIC_MAP);
        populatePopoverOptions('compareMetricOptions', allMetricEntries.map(([k, v]) => v), new Set([...compareState.selectedMetrics].map(k => ALL_METRIC_MAP[k])), () => {
            const selectedLabels = new Set();
            document.querySelectorAll('#compareMetricOptions input:checked').forEach(cb => selectedLabels.add(cb.value));
            compareState.selectedMetrics = new Set(allMetricEntries.filter(([k, v]) => selectedLabels.has(v)).map(([k]) => k));
            renderCompareResults();
        }, compareState.searchMetric);
    });

    document.getElementById('compareMetricClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        compareState.searchMetric = '';
        compareState.selectedMetrics = new Set(Object.keys(ALL_METRIC_MAP));
        renderCompareResults();
    });

    document.getElementById('compareRegionSearch')?.addEventListener('input', (e) => {
        compareState.searchRegion = e.target.value;
        const allRegions = [...new Set(sessions.map(s => s.region || 'Chưa phân vùng'))].sort();
        populatePopoverOptions('compareRegionOptions', allRegions, compareState.selectedRegions, () => {
            renderCompareResults();
        }, compareState.searchRegion);
    });

    document.getElementById('compareRegionClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        compareState.searchRegion = '';
        const allRegions = [...new Set(sessions.map(s => s.region || 'Chưa phân vùng'))].sort();
        compareState.selectedRegions = new Set(allRegions);
        renderCompareResults();
    });

    document.getElementById('compareKtvSearch')?.addEventListener('input', (e) => {
        compareState.searchKtv = e.target.value;
        const allKtvs = [...new Set(sessions.map(s => s.learner || 'Unknown'))].sort();
        populatePopoverOptions('compareKtvOptions', allKtvs, compareState.selectedKtvs, () => {
            renderCompareResults();
        }, compareState.searchKtv);
    });

    document.getElementById('compareKtvClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        compareState.searchKtv = '';
        const allKtvs = [...new Set(sessions.map(s => s.learner || 'Unknown'))].sort();
        compareState.selectedKtvs = new Set(allKtvs);
        renderCompareResults();
    });

    // Re-bind click event for compare popover trigger buttons inside modal header
    tableHead.querySelectorAll('.popover-filter-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.popover-trigger-btn');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.popover-filter-wrapper').forEach(w => w.classList.remove('open'));
            if (!isOpen) wrapper.classList.add('open');
        });
        wrapper.querySelector('.popover-dropdown')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

function renderCompareResults() {
    const startA = document.getElementById('compareStartA')?.value || '';
    const endA = document.getElementById('compareEndA')?.value || '';
    const startB = document.getElementById('compareStartB')?.value || '';
    const endB = document.getElementById('compareEndB')?.value || '';

    const rowsA = filterSessionsByDate(startA, endA);
    const rowsB = filterSessionsByDate(startB, endB);

    const metricsA = computeMetrics(rowsA);
    const metricsB = computeMetrics(rowsB);

    const labelA = formatDateRangeLabel(startA, endA);
    const labelB = formatDateRangeLabel(startB, endB);

    const dataNotice = document.getElementById('compareDataNotice');
    if (dataNotice) {
        const emptyPeriods = [];
        if (!rowsA.length) emptyPeriods.push(`Kỳ A (${labelA})`);
        if (!rowsB.length) emptyPeriods.push(`Kỳ B (${labelB})`);
        dataNotice.hidden = emptyPeriods.length === 0;
        dataNotice.textContent = emptyPeriods.length
            ? `${emptyPeriods.join(' và ')} chưa có dữ liệu; các chỉ số tương ứng được hiển thị là 0.`
            : '';
    }

    const legendContainer = document.getElementById('compareLegend');
    if (legendContainer) {
        legendContainer.innerHTML = `
            <span class="legend-item"><span class="period-dot dot-a"></span> Kỳ A (${escapeHTML(labelA)})</span>
            <span class="legend-item"><span class="period-dot dot-b"></span> Kỳ B (${escapeHTML(labelB)})</span>
        `;
    }

    // 1. Render Section 1 Views (Cards & Bars)
    renderCompareCards(metricsA, metricsB, startA, endA);

    const metricsDef = [
        { key: 'totalSessions', label: 'Tổng số phiên làm lab', unit: 'phiên', isHigherBetter: true },
        { key: 'learners', label: 'Số KTV tham gia', unit: 'người', isHigherBetter: true },
        { key: 'completed', label: 'Số lab đã hoàn thành', unit: 'bài', isHigherBetter: true },
        { key: 'rate', label: 'Tỷ lệ hoàn thành', unit: '%', isHigherBetter: true },
        { key: 'firstTryRate', label: 'Hoàn thành lần đầu', unit: '%', isHigherBetter: true },
        { key: 'avgDuration', label: 'Thời gian trung bình', unit: 'giây', isHigherBetter: false }
    ];

    const barsGrid = document.getElementById('compareBarsGrid');
    if (barsGrid) {
        barsGrid.innerHTML = metricsDef.map(m => {
            const valA = metricsA[m.key];
            const valB = metricsB[m.key];
            const maxVal = Math.max(valA, valB, 1);

            const widthA = valA ? Math.max(8, Math.round((valA / maxVal) * 100)) : 0;
            const widthB = valB ? Math.max(8, Math.round((valB / maxVal) * 100)) : 0;

            const diff = Math.round((valB - valA) * 10) / 10;
            let pct = valA > 0 ? Math.round(((valB - valA) / valA) * 100) : (valB > 0 ? 100 : 0);

            let deltaHtml = '';
            if (diff > 0) {
                const isGood = m.isHigherBetter;
                const cls = isGood ? 'delta-up' : 'delta-down';
                const sign = '+';
                deltaHtml = `<span class="compare-metric-delta ${cls}">↑ ${formatMetricDelta(m.unit, m.key, diff)} (${sign}${pct}%)</span>`;
            } else if (diff < 0) {
                const isGood = !m.isHigherBetter;
                const cls = isGood ? 'delta-up' : 'delta-down';
                deltaHtml = `<span class="compare-metric-delta ${cls}">↓ ${formatMetricDelta(m.unit, m.key, diff)} (${pct}%)</span>`;
            } else {
                deltaHtml = `<span class="compare-metric-delta delta-neutral">Không thay đổi</span>`;
            }

            const valAFormatted = formatMetricValue(m.unit, m.key, valA);
            const valBFormatted = formatMetricValue(m.unit, m.key, valB);

            return `
                <div class="compare-metric-block">
                    <div class="compare-metric-header">
                        <span class="compare-metric-title">${m.label}</span>
                        ${deltaHtml}
                    </div>
                    <div class="compare-bar-pair">
                        <div class="compare-bar-row">
                            <span class="compare-bar-label">Kỳ A</span>
                            <div class="compare-bar-track">
                                <div class="compare-bar-fill fill-a" style="width: ${widthA}%;">${valA > 0 ? valAFormatted : ''}</div>
                            </div>
                            <span class="compare-bar-val">${valAFormatted}</span>
                        </div>
                        <div class="compare-bar-row">
                            <span class="compare-bar-label">Kỳ B</span>
                            <div class="compare-bar-track">
                                <div class="compare-bar-fill fill-b" style="width: ${widthB}%;">${valB > 0 ? valBFormatted : ''}</div>
                            </div>
                            <span class="compare-bar-val">${valBFormatted}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 2. Render Section 2 Detailed Table
    renderCompareTable(rowsA, rowsB, metricsA, metricsB, startA, endA, startB, endB);
}

function setDefaultComparisonDates() {
    const startAInput = document.getElementById('compareStartA');
    const endAInput = document.getElementById('compareEndA');
    const startBInput = document.getElementById('compareStartB');
    const endBInput = document.getElementById('compareEndB');
    if (!startAInput || !endAInput || !startBInput || !endBInput) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    startAInput.value = toDateKey(new Date(currentYear, currentMonth - 1, 1));
    endAInput.value = toDateKey(new Date(currentYear, currentMonth, 0));
    startBInput.value = toDateKey(new Date(currentYear, currentMonth, 1));
    endBInput.value = toDateKey(new Date(currentYear, currentMonth + 1, 0));
}

function initializeInlineComparison() {
    const comparison = document.getElementById('compareModal');
    if (activeDashboardView !== 'overview' || !comparison?.classList.contains('compare-inline')) return;

    const hasDates = document.getElementById('compareStartA')?.value
        && document.getElementById('compareEndA')?.value
        && document.getElementById('compareStartB')?.value
        && document.getElementById('compareEndB')?.value;
    if (!hasDates) setDefaultComparisonDates();
    renderCompareResults();
}

function initCompareModal() {
    const compareBtn = document.getElementById('compareBtn');
    const compareModal = document.getElementById('compareModal');
    const compareModalClose = document.getElementById('compareModalClose');
    const compareApplyBtn = document.getElementById('compareApplyBtn');
    const compareResetBtn = document.getElementById('compareResetBtn');

    const startAInput = document.getElementById('compareStartA');
    const endAInput = document.getElementById('compareEndA');
    const startBInput = document.getElementById('compareStartB');
    const endBInput = document.getElementById('compareEndB');

    // Bind Section 2 Table Tabs (Overview vs Region vs Learner)
    document.querySelectorAll('.compare-table-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.compare-table-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCompareTableTab = btn.dataset.tableTab || 'overview';
            renderCompareResults();
        });
    });

    compareBtn?.addEventListener('click', () => {
        if (!startAInput.value || !endAInput.value || !startBInput.value || !endBInput.value) {
            setDefaultComparisonDates();
        }
        compareModal?.classList.add('visible');
        compareModal?.setAttribute('aria-hidden', 'false');
        renderCompareResults();
    });

    compareModalClose?.addEventListener('click', () => {
        compareModal?.classList.remove('visible');
        compareModal?.setAttribute('aria-hidden', 'true');
    });

    compareApplyBtn?.addEventListener('click', () => {
        renderCompareResults();
    });

    compareResetBtn?.addEventListener('click', () => {
        setDefaultComparisonDates();
        renderCompareResults();
    });

    compareModal?.addEventListener('click', (e) => {
        if (e.target === compareModal && !compareModal.classList.contains('compare-inline')) {
            compareModal.classList.remove('visible');
            compareModal.setAttribute('aria-hidden', 'true');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && compareModal?.classList.contains('visible')) {
            compareModal.classList.remove('visible');
            compareModal.setAttribute('aria-hidden', 'true');
        }
    });
}

const DASHBOARD_VIEWS = {
    overview: {
        eyebrow: 'Dashboard home',
        title: 'Dashboard giám sát thực hành KTV',
        subtitle: 'Theo dõi hoạt động, tiến độ và chất lượng thực hành'
    },
    instructors: {
        eyebrow: 'Instructor workspace',
        title: 'Không gian theo dõi dành cho giảng viên',
        subtitle: 'Theo dõi bài nộp và trạng thái thực hành của KTV'
    },
    analytics: {
        eyebrow: 'Báo cáo vận hành',
        title: 'Báo cáo chi tiết',
        subtitle: 'Ma trận thiết bị và bài lab theo từng Khu vực/CNx'
    },
    technicians: {
        eyebrow: 'Technician performance',
        title: 'Thống kê kỹ thuật viên',
        subtitle: 'Tra cứu lịch sử, thiết bị và kết quả thực hành theo KTV'
    },
};

let activeDashboardView = 'overview';

function initDashboardViewRouting() {
    const requestedView = new URLSearchParams(window.location.search).get('view') || 'overview';
    activeDashboardView = Object.hasOwn(DASHBOARD_VIEWS, requestedView) ? requestedView : 'overview';

    const masterContainer = document.querySelector('.dashboard-master-container');
    const masterViews = new Set(['overview', 'instructors', 'analytics']);
    if (masterContainer) masterContainer.hidden = !masterViews.has(activeDashboardView);

    document.querySelectorAll('.dashboard-page-view').forEach(section => {
        section.hidden = section.dataset.pageView !== activeDashboardView;
    });

    const comparisonWorkspace = document.getElementById('comparisonWorkspace');
    const comparison = document.getElementById('compareModal');
    if (comparisonWorkspace && comparison) {
        comparisonWorkspace.appendChild(comparison);
        comparison.classList.add('compare-inline');
        comparison.classList.remove('visible');
        comparison.setAttribute('aria-hidden', String(activeDashboardView !== 'overview'));
    }

    const viewCopy = DASHBOARD_VIEWS[activeDashboardView];
    const eyebrow = document.getElementById('pageEyebrow');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');
    if (eyebrow) eyebrow.textContent = viewCopy.eyebrow;
    if (title) title.textContent = viewCopy.title;
    if (subtitle) subtitle.textContent = viewCopy.subtitle;
    document.title = `${viewCopy.title} | FTC`;

    const comparePageLink = document.getElementById('comparePageLink');
    if (comparePageLink) {
        comparePageLink.href = '?view=overview#comparisonWorkspace';
        comparePageLink.textContent = 'So sánh thời gian';
    }

    document.querySelectorAll('.sidebar-link[data-dashboard-view]').forEach(link => {
        const isActive = link.dataset.dashboardView === activeDashboardView;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function initSidebarNavigation() {
    const page = document.getElementById('appPage');
    const toggle = document.getElementById('sidebarToggle');

    toggle?.addEventListener('click', () => {
        const collapsed = page?.classList.toggle('sidebar-collapsed') || false;
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute('aria-label', collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboardViewRouting();
    initSidebarNavigation();
    initFilters();
    initSort();
    initDateRangePicker();
    initHourlyDatePicker();
    initExport();
    initInstructorWorkspace();
    initEvents();
    initSubModalEvents();
    initCompareModal();
    loadInitialDashboardData();
});
