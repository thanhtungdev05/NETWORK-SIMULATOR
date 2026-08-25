const API_BASE_URL = '/api/index.php';

let sessions = [];
let deviceCatalog = [];
let technicianCatalog = [];
let trainingAssignments = [];
let dashboardReport = null;
let technicianByIdentity = new Map();
let technicianCatalogAuthoritative = false;
let instructorSearchTimer = null;
let reportExportReturnFocus = null;
let reportExportBusy = false;
let activeToastTimer = null;
let rosterEditReturnFocus = null;
let dashboardLoadRequest = null;
let deviceSubModalReturnFocus = null;
let learnerDetailReturnIdentity = '';

const formatNumber = new Intl.NumberFormat('vi-VN');
const LEARNER_TABLE_PAGE_SIZE = 4;
const LEARNER_HISTORY_PAGE_SIZE = 6;

const now = new Date();
const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
const currentMonthLast = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const fmtDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const state = {
    currentUser: null,
    isAdmin: false,
    canExportReports: false,
    startDate: fmtDate(currentMonthFirst),
    endDate: fmtDate(currentMonthLast),
    tempStartDate: '',
    tempEndDate: '',
    calendarMonth: new Date(now.getFullYear(), now.getMonth(), 1),

    hourlyStartDate: '',
    hourlyEndDate: '',
    hourlyTempStartDate: '',
    hourlyTempEndDate: '',
    hourlyCalendarMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    hourlyCalendarFocusDate: fmtDate(now),

    selectedLearner: '',

    // Real-time table filters & sort
    realtimeTimeSortDir: 'desc',
    realtimeSelectedKtvs: new Set(),
    realtimeSelectedModes: new Set(['Thực hành', 'Hướng dẫn']),
    realtimeSelectedDevices: new Set(),
    realtimeSelectedStatuses: new Set(['Hoàn thành', 'Đang làm', 'Không đạt', 'Đã dừng']),
    realtimeSearchKtv: '',
    realtimeSearchDevice: '',
    realtimeSearchLab: '',
    realtimePage: 1,
    realtimeSelectedLabs: new Set(),
    realtimeLabsTouched: false,

    // Instructor class progress workspace
    instructorClasses: [],
    instructorClassesLoaded: false,
    instructorActiveClassId: '',
    instructorSelectedDevice: '',
    instructorSearchKtv: '',
    instructorCompletionFilter: 'all',
    instructorImportMembers: [],
    instructorImportFileName: '',
    instructorWorkspaceBound: false,
    assignmentsLoaded: false,

    // Class Matrix state
    classMatrixSelectedClass: '',
    classMatrixSelectedDevice: '',
    classMatrixSearch: '',

    // Learner table filters & sort
    learnerSelectedKtvs: new Set(),
    learnerSelectedDevices: new Set(),
    learnerSelectedLabs: new Set(),
    learnerSearchKtv: '',
    learnerSelectedEmails: new Set(),
    learnerEmailsTouched: false,
    learnerSelectedRegions: new Set(),
    learnerRegionsTouched: false,
    learnerTablePage: 1,
    learnerDetailPage: 1,
    sessionsSort: { key: 'lastDateTimeMs', direction: 'desc' },

    // Learner Detail popup filters & sort
    detailTimeSortDir: 'desc',
    detailDurationSortDir: 'desc',
    detailSortKey: 'time',
    detailSelectedModes: new Set(['Thực hành', 'Hướng dẫn']),
    detailSelectedDevices: new Set(),
    detailSelectedStatuses: new Set(['Hoàn thành', 'Đang làm', 'Không đạt', 'Đã dừng', 'Chưa thực hiện']),
    detailSearchDevice: '',
    detailSelectedLabs: new Set(),
    detailLabsTouched: false,
    detailSearchLab: '',

    detailReportExpandedRegions: new Set(['TDDT', 'TNMT']),

    filtersBound: false,
    popoversInitialized: false,
    dataSourceLabel: 'Đang đồng bộ dữ liệu vận hành',
    dashboardDataLoaded: false,
    lastSuccessfulRefreshAt: null,

    // Roster (Quản lý KTV) — Admin
    rosterTab: 'list',
    rosterItems: [],
    rosterRegions: [],
    rosterRegionsLoaded: false,
    rosterStats: null,
    rosterPage: 1,
    rosterTotal: 0,
    rosterSearch: '',
    rosterStatusFilter: 'active',
    rosterHistoryItems: [],
    rosterPreviewData: null,
    rosterImportFile: null,
    rosterImportBatchId: '',
    rosterImportBusy: false,
    rosterLoaded: false,
    rosterHistoryLoaded: false,
    rosterEditEmployeeId: '',
    rosterInitialized: false,
    rosterRequestSequence: 0,
    rosterHistoryRequestSequence: 0,
};

const els = {
    sessionsBody: document.getElementById('sessionsBody'),
    learnerTableMeta: document.getElementById('learnerTableMeta'),
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

function safeStorageGet(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        // Storage có thể bị vô hiệu hóa bởi chính sách trình duyệt; giao diện vẫn hoạt động bình thường.
    }
}

function showToast(message, type = 'info', duration = 4200) {
    const region = document.getElementById('toastRegion');
    if (!region || !message) return;
    window.clearTimeout(activeToastTimer);
    region.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    const toast = document.createElement('div');
    toast.className = `dashboard-toast is-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const icon = document.createElement('span');
    icon.className = 'dashboard-toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = type === 'success' ? '✓' : (type === 'error' ? '!' : 'i');
    const copy = document.createElement('span');
    copy.className = 'dashboard-toast-copy';
    copy.textContent = message;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dashboard-toast-close';
    close.setAttribute('aria-label', 'Đóng thông báo');
    close.textContent = '×';
    close.addEventListener('click', () => toast.remove());
    toast.append(icon, copy, close);
    region.replaceChildren(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    activeToastTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
        window.setTimeout(() => toast.remove(), 180);
    }, duration);
}

function getFocusableElements(container) {
    if (!container) return [];
    return [...container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(element => !element.hidden && element.offsetParent !== null);
}

function trapDialogFocus(event, container) {
    if (event.key !== 'Tab' || !container) return;
    const focusable = getFocusableElements(container);
    if (!focusable.length) {
        event.preventDefault();
        container.focus();
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function getStatusClass(status) {
    if (status === 'Hoàn thành') return 'status-done';
    if (status === 'Đang làm') return 'status-running';
    if (status === 'Không đạt' || status === 'Đã dừng') return 'status-risk';
    return 'status-notstarted';
}

function formatCompactList(values, limit = 2) {
    const sorted = [...values].sort((a, b) => a.localeCompare(b, 'vi'));
    const visible = sorted.slice(0, limit).join(', ');
    return sorted.length > limit ? `${visible} +${sorted.length - limit}` : visible;
}

function sessionTimestampMs(item) {
    const base = item?.date ? parseDate(item.date).getTime() : 0;
    return (Number.isFinite(base) ? base : 0) + (item?.time ? parseTimeMs(item.time) : 0);
}

function getLatestSession(rows) {
    return [...rows].sort((a, b) => sessionTimestampMs(b) - sessionTimestampMs(a))[0];
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
        const header = button.closest('th');
        if (table === 'realtime') {
            const mark = button.querySelector('.sort-mark');
            if (mark) mark.textContent = state.realtimeTimeSortDir === 'asc' ? '↑' : '↓';
            if (header) header.setAttribute('aria-sort', state.realtimeTimeSortDir === 'asc' ? 'ascending' : 'descending');
            return;
        }
        const sortState = state.sessionsSort;
        const mark = button.querySelector('.sort-mark');
        if (mark) {
            const isActive = sortState.key === button.dataset.key;
            mark.textContent = isActive ? (sortState.direction === 'asc' ? '↑' : '↓') : '↕';
            button.classList.toggle('is-sorted', isActive);
            if (header) header.setAttribute('aria-sort', isActive ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none');
        }
    });

    const timeMark = document.querySelector('#detailTimeSort .sort-mark');
    if (timeMark) timeMark.textContent = state.detailSortKey === 'time' ? (state.detailTimeSortDir === 'asc' ? '↑' : '↓') : '↕';
    document.getElementById('detailTimeSort')?.closest('th')?.setAttribute(
        'aria-sort',
        state.detailSortKey === 'time' ? (state.detailTimeSortDir === 'asc' ? 'ascending' : 'descending') : 'none'
    );
    const durMark = document.querySelector('#detailDurationSort .sort-mark');
    if (durMark) durMark.textContent = state.detailSortKey === 'duration' ? (state.detailDurationSortDir === 'asc' ? '↑' : '↓') : '↕';
    document.getElementById('detailDurationSort')?.closest('th')?.setAttribute(
        'aria-sort',
        state.detailSortKey === 'duration' ? (state.detailDurationSortDir === 'asc' ? 'ascending' : 'descending') : 'none'
    );
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

const MIN_DURATION_SAMPLE_COUNT = 30;
const MIN_DURATION_COVERAGE_RATE = 10;

function mapReportMetrics(metric) {
    const practiceAttempts = Number(metric?.practice_attempts) || 0;
    const durationKnown = Number(metric?.duration_known_count) || 0;
    const durationCoverage = metric?.duration_coverage_rate === null || metric?.duration_coverage_rate === undefined
        ? (practiceAttempts ? Math.round((durationKnown / practiceAttempts) * 1000) / 10 : null)
        : Number(metric.duration_coverage_rate);
    const durationReliable = durationKnown >= MIN_DURATION_SAMPLE_COUNT
        && durationCoverage !== null
        && durationCoverage >= MIN_DURATION_COVERAGE_RATE;

    return {
        assigned: Number(metric?.assigned_count) || 0,
        graded: Number(metric?.graded_count) || 0,
        totalSessions: practiceAttempts,
        guideSessions: Number(metric?.guide_attempts) || 0,
        learners: Number(metric?.participating_technicians) || 0,
        completed: Number(metric?.completed_count) || 0,
        rate: metric?.completion_rate === null || metric?.completion_rate === undefined
            ? null
            : Number(metric.completion_rate),
        passRate: metric?.pass_rate === null || metric?.pass_rate === undefined
            ? null
            : Number(metric.pass_rate),
        firstTryRate: metric?.first_try_rate === null || metric?.first_try_rate === undefined
            ? null
            : Number(metric.first_try_rate),
        avgDuration: durationReliable && metric?.avg_duration_sec !== null && metric?.avg_duration_sec !== undefined
            ? Number(metric.avg_duration_sec)
            : null,
        durationKnown,
        durationAttempts: practiceAttempts,
        durationCoverage,
        durationReliable
    };
}

function renderKpis() {
    const periods = getKpiComparisonPeriods();
    const practiceOnly = item => item.mode === 'Thực hành';
    const periodMetrics = rows => {
        const all = computeMetrics(rows);
        const practiceRows = rows.filter(practiceOnly);
        const practice = computeMetrics(practiceRows);
        const gradedRows = practiceRows.filter(item => item.isPassed === true || item.isPassed === false);
        const passedRows = gradedRows.filter(item => item.isPassed === true);
        const durationRows = practiceRows.filter(item => Number(item.duration) > 0);
        const durationCoverage = practiceRows.length
            ? Math.round((durationRows.length / practiceRows.length) * 1000) / 10
            : null;
        const durationReliable = durationRows.length >= MIN_DURATION_SAMPLE_COUNT
            && durationCoverage !== null
            && durationCoverage >= MIN_DURATION_COVERAGE_RATE;
        return {
            assigned: 0,
            graded: gradedRows.length,
            totalSessions: practice.totalSessions,
            guideSessions: rows.filter(item => item.mode === 'Hướng dẫn').length,
            learners: all.learners,
            completed: practice.completed,
            rate: practice.rate,
            passRate: gradedRows.length ? Math.round((passedRows.length / gradedRows.length) * 1000) / 10 : null,
            firstTryRate: practice.firstTryRate,
            avgDuration: durationReliable
                ? Math.round(durationRows.reduce((sum, item) => sum + Number(item.duration), 0) / durationRows.length)
                : null,
            durationKnown: durationRows.length,
            durationAttempts: practiceRows.length,
            durationCoverage,
            durationReliable
        };
    };
    const currentRows = filterSessionsByDate(periods.currentStart, periods.currentEnd);
    const previousRows = filterSessionsByDate(periods.previousStart, periods.previousEnd);
    const authoritativeSummary = dashboardReport?.summary;
    const currentMetrics = authoritativeSummary
        ? mapReportMetrics(authoritativeSummary.current)
        : periodMetrics(currentRows);
    const previousMetrics = authoritativeSummary
        ? mapReportMetrics(authoritativeSummary.previous)
        : periodMetrics(previousRows);
    const lifetimeMetrics = authoritativeSummary?.lifetime
        ? mapReportMetrics(authoritativeSummary.lifetime)
        : periodMetrics(sessions);

    const definitions = [
        { key: 'totalSessions', valueId: 'kpiSessions', comparisonId: 'kpiSessionsComparison', contextId: 'kpiSessionsContext', type: 'count', unit: 'phiên' },
        { key: 'guideSessions', valueId: 'kpiGuideSessions', comparisonId: 'kpiGuideSessionsComparison', contextId: 'kpiGuideSessionsContext', type: 'count', unit: 'lượt' },
        { key: 'learners', valueId: 'kpiLearners', comparisonId: 'kpiLearnersComparison', contextId: 'kpiLearnersContext', type: 'count', unit: 'KTV' },
        { key: 'completed', valueId: 'kpiCompleted', comparisonId: 'kpiCompletedComparison', contextId: 'kpiCompletedContext', type: 'count', unit: 'bài' },
        { key: 'rate', valueId: 'kpiCompletionRate', comparisonId: 'kpiCompletionRateComparison', contextId: 'kpiCompletionRateContext', type: 'rate', unit: '%' },
        { key: 'passRate', valueId: 'kpiPassRate', comparisonId: 'kpiPassRateComparison', contextId: 'kpiPassRateContext', type: 'rate', unit: '%' },
        { key: 'firstTryRate', valueId: 'kpiFirstTryRate', comparisonId: 'kpiFirstTryRateComparison', contextId: 'kpiFirstTryRateContext', type: 'rate', unit: '%' },
        { key: 'avgDuration', valueId: 'kpiAvgDuration', comparisonId: 'kpiAvgDurationComparison', contextId: 'kpiAvgDurationContext', type: 'duration', unit: 'giây', lowerIsBetter: true }
    ];

    const formatMetric = (value, definition) => {
        if (value === null || value === undefined) return '—';
        if (definition.type === 'rate') return `${value}%`;
        if (definition.type === 'duration') return formatDuration(value);
        return formatNumber.format(value);
    };

    const formatDecimal = value => Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 1 });

    definitions.forEach(definition => {
        const currentValue = currentMetrics[definition.key];
        const previousValue = previousMetrics[definition.key];
        const lifetimeValue = lifetimeMetrics[definition.key];
        const comparable = currentValue !== null && previousValue !== null;
        const difference = comparable ? Math.round((currentValue - previousValue) * 10) / 10 : null;
        const valueElement = document.getElementById(definition.valueId);
        const comparisonElement = document.getElementById(definition.comparisonId);
        const contextElement = document.getElementById(definition.contextId);

        if (valueElement) valueElement.textContent = formatMetric(currentValue, definition);

        if (comparisonElement) {
            let comparisonClass = 'neutral';
            let changeText = 'Không đổi';
            let arrow = '•';

            if (difference === null) {
                changeText = 'Chưa đủ mẫu số';
            } else if (difference !== 0) {
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
            const hasCurrentData = authoritativeSummary
                ? Number(authoritativeSummary.current?.assigned_count || authoritativeSummary.current?.practice_attempts) > 0
                : currentRows.length > 0;
            const noDataLabel = hasCurrentData ? '' : ' • Chưa có dữ liệu';
            if (definition.key === 'avgDuration' && !currentMetrics.durationReliable) {
                const known = formatNumber.format(currentMetrics.durationKnown || 0);
                const attempts = formatNumber.format(currentMetrics.durationAttempts || 0);
                contextElement.textContent = `${periods.currentLabel} • ${known}/${attempts} lượt có thời lượng • Chưa đủ mẫu tin cậy`;
            } else {
                contextElement.textContent = `${periods.currentLabel}${noDataLabel} • Lũy kế ${formatMetric(lifetimeValue, definition)}${definition.type === 'count' ? ` ${definition.unit}` : ''}`;
            }
        }
    });

    renderDashboardDataNotice(currentMetrics);
}

function renderDashboardDataNotice(currentMetrics) {
    const notice = document.getElementById('dashboardDataNotice');
    if (!notice) return;

    const messages = [];
    const unassignedRegions = (dashboardReport?.matrix?.rows || []).filter(row => {
        const region = row?.region || {};
        return !region.region_id || String(region.code || region.region_code || '').toUpperCase() === 'UNASSIGNED';
    });
    const unassignedAssignments = unassignedRegions.reduce(
        (sum, row) => sum + Number(row?.total?.assigned_count || row?.total?.eligible || 0),
        0
    );
    if (unassignedAssignments > 0) {
        messages.push(`${formatNumber.format(unassignedAssignments)} lượt KTV–lab chưa có khu vực nên đang được gom vào “Chưa xác định”.`);
    }
    if (currentMetrics.completed > 0 && currentMetrics.graded === 0) {
        messages.push('Có dữ liệu hoàn thành nhưng chưa có kết quả chấm; tỷ lệ đạt và đạt lần đầu chưa thể tính tin cậy.');
    }

    notice.hidden = messages.length === 0;
    notice.replaceChildren();
    if (!messages.length) return;

    const icon = document.createElement('span');
    icon.className = 'dashboard-data-notice-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '!';
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = 'Cần hoàn thiện dữ liệu trước khi dùng báo cáo chính thức';
    const list = document.createElement('ul');
    messages.forEach(message => {
        const item = document.createElement('li');
        item.textContent = message;
        list.appendChild(item);
    });
    content.append(title, list);
    notice.append(icon, content);
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
            lastDateTimeMs: latest ? sessionTimestampMs(latest) : 0,
            lastDateTimeFormatted: formatDateTime(latest?.date, latest?.time),
            lastAction: latest?.lastAction || 'N/A',
            latestDuration: latest?.duration ?? null,
            completion: item.rows.length ? Math.round((completed / item.rows.length) * 100) : 0
        };
    });
}

function renderSessions(rows) {
    let filteredRows = rows.filter(item => (
        state.learnerSelectedKtvs.has(item.learner)
        && state.learnerSelectedEmails.has(item.learner)
        && state.learnerSelectedDevices.has(item.device)
        && state.learnerSelectedLabs.has(item.lab)
        && state.learnerSelectedRegions.has(item.region)
    ));
    const learnerKeyword = state.learnerSearchKtv.trim().toLocaleLowerCase('vi');
    if (learnerKeyword) {
        filteredRows = filteredRows.filter(item => {
            const haystack = `${item.learner} ${getLearnerName(item.learner)}`.toLocaleLowerCase('vi');
            return haystack.includes(learnerKeyword);
        });
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
            <tr class="clickable-row ${state.selectedLearner === item.learner ? 'active' : ''}">
                <td>
                    <button type="button" class="learner-link" data-open-learner data-learner="${escapeHTML(item.learner)}" title="Mở chi tiết ${escapeHTML(item.learner)}">${escapeHTML(getLearnerName(item.learner))}</button>
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
        els.sessionsBody.querySelectorAll('[data-open-learner]').forEach(button => {
            const openLearner = () => {
                const nextLearner = button.getAttribute('data-learner');
                if (state.selectedLearner !== nextLearner) state.learnerDetailPage = 1;
                learnerDetailReturnIdentity = nextLearner;
                state.selectedLearner = nextLearner;
                renderAll();
            };
            button.addEventListener('click', openLearner);
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
    const returnIdentity = state.selectedLearner || learnerDetailReturnIdentity;
    state.selectedLearner = '';
    state.learnerDetailPage = 1;
    document.body.classList.remove('detail-open');
    els.learnerDetailCard?.classList.remove('visible');
    els.learnerDetailCard?.setAttribute('aria-hidden', 'true');
    state.currentLearnerRows = null;
    document.getElementById('learnerDeviceDonut')?.replaceChildren();
    document.getElementById('learnerDeviceLegend')?.replaceChildren();
    learnerDetailReturnIdentity = '';
    if (returnIdentity) {
        window.requestAnimationFrame(() => {
            [...(els.sessionsBody?.querySelectorAll('[data-open-learner]') || [])]
                .find(button => button.dataset.learner === returnIdentity)
                ?.focus({ preventScroll: true });
        });
    }
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

    const latestDataDate = new Date(Math.max(...validDates.map(date => date.getTime())));
    const selectedDate = state.startDate ? parseDate(state.startDate) : latestDataDate;
    const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
    const reportYear = selectedDate.getFullYear();
    const today = new Date();
    const monthlyReport = new Map((dashboardReport?.monthly || []).map(item => [item.month, item]));
    const periods = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(reportYear, index, 1);
        const monthRows = rows.filter(item => {
            const itemDate = parseDate(item.date);
            return !Number.isNaN(itemDate.getTime())
                && itemDate.getFullYear() === date.getFullYear()
                && itemDate.getMonth() === date.getMonth();
        });
        const reportMonth = monthlyReport.get(`${reportYear}-${String(index + 1).padStart(2, '0')}`);
        const fallbackMetrics = computeMetrics(monthRows.filter(item => item.mode === 'Thực hành'));
        const metrics = dashboardReport
            ? (reportMonth ? {
                totalSessions: Number(reportMonth.practice_attempts) || 0,
                learners: Number(reportMonth.participating_technicians) || 0,
                completed: Number(reportMonth.completed_count) || 0,
                rate: reportMonth.completion_rate === null ? null : Number(reportMonth.completion_rate),
                passRate: reportMonth.pass_rate === null ? null : Number(reportMonth.pass_rate),
                firstTryRate: reportMonth.first_try_rate === null ? null : Number(reportMonth.first_try_rate),
                avgDuration: reportMonth.avg_duration_sec === null ? null : Number(reportMonth.avg_duration_sec)
            } : { totalSessions: 0, learners: 0, completed: 0, rate: null, passRate: null, firstTryRate: null, avgDuration: null })
            : fallbackMetrics;
        return {
            date,
            key: `${date.getFullYear()}-${date.getMonth()}`,
            label: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
            shortLabel: `T${String(date.getMonth() + 1).padStart(2, '0')}`,
            isFuture: Boolean(reportMonth?.is_future) || date > new Date(today.getFullYear(), today.getMonth(), 1),
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
            <div class="ktv-month-column ${isSelected ? 'selected' : ''} ${period.isFuture ? 'future' : ''}" title="${period.label}: ${period.totalSessions} lượt thực hành, ${period.completed} bài hoàn thành lũy kế">
                <strong>${period.totalSessions}</strong>
                <div class="ktv-month-bar-track">
                    <div class="ktv-month-bar" style="height: ${height}%;"></div>
                </div>
                <span class="ktv-month-label">${period.shortLabel}</span>
                <span class="ktv-month-rate">${period.rate === null ? '—' : `${period.rate}% HT`}</span>
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

    const wasVisible = els.learnerDetailCard?.classList.contains('visible');
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

    const ktvLabs = [...new Set(allLearnerRows.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
    if (state.detailSelectedLabs.size === 0 && !state.detailLabsTouched) {
        state.detailSelectedLabs = new Set(ktvLabs);
    }
    populatePopoverOptions('detailLabOptions', ktvLabs, state.detailSelectedLabs, () => { state.detailLabsTouched = true; }, state.detailSearchLab);

    let filteredHistory = [...allLearnerRows];
    filteredHistory = filteredHistory.filter(item => state.detailSelectedModes.has(item.mode || 'Thực hành'));
    filteredHistory = filteredHistory.filter(item => state.detailSelectedDevices.has(item.device));
    filteredHistory = filteredHistory.filter(item => state.detailSelectedLabs.has(item.lab));
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
    if (!wasVisible) window.requestAnimationFrame(() => els.learnerDetailClose?.focus());
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
    const todayKey = fmtDate(new Date());
    const focusKey = state.hourlyCalendarFocusDate || todayKey;
    const days = [];
    for (let i = 0; i < 42; i += 1) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + i);
        const key = toDateKey(day);
        const selectedStart = state.hourlyTempStartDate ? parseDate(state.hourlyTempStartDate) : null;
        const selectedEnd = state.hourlyTempEndDate ? parseDate(state.hourlyTempEndDate) : null;
        const inRange = selectedStart && selectedEnd && day >= selectedStart && day <= selectedEnd;
        const isSelected = sameDay(day, selectedStart) || sameDay(day, selectedEnd);
        const fullDateLabel = day.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        days.push(`
            <button type="button" role="gridcell" class="date-day ${day.getMonth() !== month ? 'outside' : ''} ${inRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''}" data-hourly-date="${key}"
                tabindex="${key === focusKey ? '0' : '-1'}" aria-label="${escapeHTML(fullDateLabel)}" aria-selected="${isSelected ? 'true' : 'false'}" ${key === todayKey ? 'aria-current="date"' : ''}>
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
            state.hourlyCalendarFocusDate = selected;
            renderHourlyCalendar();
            document.querySelector(`[data-hourly-date="${selected}"]`)?.focus();
        });
        button.addEventListener('keydown', event => {
            const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
            let nextDate = parseDate(button.dataset.hourlyDate);
            if (Object.hasOwn(offsets, event.key)) {
                nextDate.setDate(nextDate.getDate() + offsets[event.key]);
            } else if (event.key === 'PageUp' || event.key === 'PageDown') {
                nextDate.setMonth(nextDate.getMonth() + (event.key === 'PageUp' ? -1 : 1));
            } else if (event.key === 'Home' || event.key === 'End') {
                const weekday = (nextDate.getDay() + 6) % 7;
                nextDate.setDate(nextDate.getDate() + (event.key === 'Home' ? -weekday : 6 - weekday));
            } else {
                return;
            }
            event.preventDefault();
            const nextKey = fmtDate(nextDate);
            state.hourlyCalendarFocusDate = nextKey;
            state.hourlyCalendarMonth = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
            renderHourlyCalendar();
            document.querySelector(`[data-hourly-date="${nextKey}"]`)?.focus();
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

    const closeHourlyPanel = ({ restoreFocus = false } = {}) => {
        picker?.classList.remove('open');
        trigger?.setAttribute('aria-expanded', 'false');
        if (restoreFocus) trigger?.focus();
    };

    renderHourlyCalendar();

    trigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyTempStartDate = state.hourlyStartDate;
        state.hourlyTempEndDate = state.hourlyEndDate;
        state.hourlyCalendarFocusDate = state.hourlyStartDate || fmtDate(new Date());
        renderHourlyCalendar();
        const willOpen = !picker?.classList.contains('open');
        picker?.classList.toggle('open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) {
            window.requestAnimationFrame(() => {
                const focusDay = document.querySelector(`[data-hourly-date="${state.hourlyCalendarFocusDate}"]`);
                if (focusDay) focusDay.focus();
                else panel?.focus();
            });
        }
    });

    panel?.addEventListener('click', (e) => e.stopPropagation());
    panel?.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            closeHourlyPanel({ restoreFocus: true });
            return;
        }
        trapDialogFocus(event, panel);
    });

    prevMonth?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyCalendarMonth.setMonth(state.hourlyCalendarMonth.getMonth() - 1);
        state.hourlyCalendarFocusDate = fmtDate(state.hourlyCalendarMonth);
        renderHourlyCalendar();
    });

    nextMonth?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyCalendarMonth.setMonth(state.hourlyCalendarMonth.getMonth() + 1);
        state.hourlyCalendarFocusDate = fmtDate(state.hourlyCalendarMonth);
        renderHourlyCalendar();
    });

    monthSelect?.addEventListener('change', (e) => {
        state.hourlyCalendarMonth.setMonth(parseInt(e.target.value, 10));
        state.hourlyCalendarFocusDate = fmtDate(state.hourlyCalendarMonth);
        renderHourlyCalendar();
    });

    yearSelect?.addEventListener('change', (e) => {
        state.hourlyCalendarMonth.setFullYear(parseInt(e.target.value, 10));
        state.hourlyCalendarFocusDate = fmtDate(state.hourlyCalendarMonth);
        renderHourlyCalendar();
    });

    applyBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.hourlyStartDate = state.hourlyTempStartDate;
        state.hourlyEndDate = state.hourlyTempEndDate;
        closeHourlyPanel({ restoreFocus: true });
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
        closeHourlyPanel({ restoreFocus: true });
        if (state.currentLearnerRows) {
            renderHourlyBarChart(state.currentLearnerRows);
        }
    });

    document.addEventListener('click', () => {
        closeHourlyPanel();
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
            map.set(item[key], { name: item[key], sessions: 0, completed: 0, duration: 0, durationCount: 0 });
        }
        const row = map.get(item[key]);
        row.sessions += 1;
        row.completed += item.status === 'Hoàn thành' ? 1 : 0;
        if (Number(item.duration) > 0) {
            row.duration += Number(item.duration);
            row.durationCount += 1;
        }
    });
    return [...map.values()].map(item => ({
        ...item,
        completion: item.sessions ? Math.round((item.completed / item.sessions) * 100) : 0,
        avgDuration: item.durationCount ? Math.round(item.duration / item.durationCount) : null
    }));
}

const BASE_REGION_CATALOG = [
    { code: 'DNB' },
    { code: 'HCM' },
    { code: 'TDDT', children: ['TDDT - TIN', 'TDDT - PNC'] },
    { code: 'TNB' },
    { code: 'TNMT', children: ['TNMT - TIN', 'TNMT - PNC'] },
    { code: 'DBB' },
    { code: 'HNI' },
    { code: 'TBB' }
];

let REGION_CATALOG = BASE_REGION_CATALOG.map(region => ({
    ...region,
    children: region.children ? [...region.children] : undefined
}));
let REGION_FILTER_OPTIONS = REGION_CATALOG.flatMap(region => region.children || [region.code]);

function getLearnerRegion(learner) {
    const key = String(learner || '').trim().toLowerCase();
    return technicianByIdentity.get(key)?.dashboardRegion || 'Chưa phân vùng';
}

function normalizeRegionName(region, learner) {
    const value = String(region || '').trim();
    if (!value) return getLearnerRegion(learner);
    const directMatch = REGION_FILTER_OPTIONS.find(option => option.toLowerCase() === value.toLowerCase());
    return directMatch || value;
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

function renderAuthoritativeDetailedReport(reportMatrix) {
    if (!els.detailReportHead || !els.detailReportBody || !els.detailReportFoot) return;
    const groups = reportMatrix.device_groups || [];
    const columns = groups.flatMap((group, groupIndex) => (group.labs || []).map((lab, labIndex) => ({
        device: group.device?.name || group.device?.device_name || group.device_name || '',
        deviceId: group.device?.device_id || group.device_id || '',
        lab: lab.name || lab.lab_name || '',
        labId: lab.lab_id || '',
        groupIndex,
        isFirst: labIndex === 0,
        isLast: labIndex === group.labs.length - 1
    })));
    const metricCell = (cell = {}, extraClass = '') => {
        const assigned = Number(cell.assigned_count) || 0;
        const completed = Number(cell.completed_count) || 0;
        const rate = cell.completion_rate === null || cell.completion_rate === undefined
            ? null
            : Number(cell.completion_rate);
        if (!assigned || rate === null) {
            return `<td class="report-metric-cell report-cell-zero ${extraClass}" title="Bài lab chưa được giao trong kỳ"><strong>—</strong><span>Chưa giao</span></td>`;
        }
        const cssClass = rate >= 80 ? 'report-cell-high' : (rate >= 50 ? 'report-cell-medium' : 'report-cell-low');
        const attempted = Number(cell.attempted_count) || 0;
        const attempts = Number(cell.attempt_count) || 0;
        return `<td class="report-metric-cell ${cssClass} ${extraClass}" title="${escapeHTML(`${completed}/${assigned} KTV hoàn thành • ${attempted} KTV đã thực hành • ${attempts} lượt thực hành`)}"><strong>${completed}/${assigned}</strong><span>${rate}% HT</span></td>`;
    };
    els.detailReportHead.innerHTML = `
        <tr class="report-device-header-row">
            <th class="report-region-head" rowspan="2" scope="col"><strong>Khu vực/CNx</strong></th>
            ${groups.map((group, index) => `<th class="report-device-group report-device-tone-${index % 5}" colspan="${(group.labs || []).length}" scope="colgroup">${escapeHTML(group.device?.name || group.device_name || '')}<span>${(group.labs || []).length} bài lab</span></th>`).join('')}
            <th class="report-summary-head" rowspan="2" scope="col">Tổng</th>
        </tr>
        <tr class="report-lab-header-row">${columns.map(column => `<th class="report-lab-head report-device-tone-${column.groupIndex % 5} ${column.isFirst ? 'group-start' : ''} ${column.isLast ? 'group-end' : ''}" scope="col" title="${escapeHTML(`${column.device} • ${column.lab}`)}">${escapeHTML(column.lab)}</th>`).join('')}</tr>`;
    els.detailReportBody.innerHTML = (reportMatrix.rows || []).map(row => {
        const region = row.region || {};
        const regionName = region.name || region.region_name || region.code || region.region_code || '';
        const locationLabel = region.branch_name ? `${region.branch_name} · ${regionName}` : regionName;
        return `<tr><th class="report-region-cell" scope="row"><div class="report-region-label"><span class="report-region-spacer"></span>${escapeHTML(locationLabel)}</div></th>${columns.map(column => metricCell(row.cells?.[column.labId], column.isFirst ? 'group-start' : '')).join('')}${metricCell(row.total, 'report-row-total')}</tr>`;
    }).join('') || `<tr><td colspan="${columns.length + 2}" class="empty">Không có assignment phù hợp với kỳ báo cáo.</td></tr>`;
    const grand = reportMatrix.grand_total || {};
    els.detailReportFoot.innerHTML = `<tr><th class="report-region-cell report-grand-label" scope="row">Tổng hệ thống</th>${columns.map(column => metricCell(grand.cells?.[column.labId], column.isFirst ? 'group-start' : '')).join('')}${metricCell(grand.total || grand, 'report-row-total report-grand-total')}</tr>`;
    const summaryValues = {
        detailReportPeriod: dashboardReport?.meta?.period?.label || getRangeLabel(),
        detailReportSessions: formatNumber.format(Number(grand.total?.attempt_count || grand.attempt_count) || 0),
        detailReportRegions: formatNumber.format((reportMatrix.rows || []).length),
        detailReportLabs: formatNumber.format(columns.length),
        detailReportCompletion: grand.total?.completion_rate === null || grand.completion_rate === null
            ? '—'
            : `${Number(grand.total?.completion_rate ?? grand.completion_rate) || 0}%`
    };
    Object.entries(summaryValues).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function buildDetailReportIndex(rows) {
    const index = new Map();
    rows.forEach(item => {
        const region = item.region || getLearnerRegion(item.learner);
        const key = detailReportCellKey(region, item.device, item.lab);
        if (!index.has(key)) index.set(key, { attempts: 0, learners: new Set(), completedLearners: new Set(), duration: 0 });
        const cell = index.get(key);
        cell.attempts += 1;
        cell.learners.add(item.learner);
        if (item.status === 'Hoàn thành') cell.completedLearners.add(item.learner);
        cell.duration += Number(item.duration) || 0;
    });
    return index;
}

function getDetailReportEligibleLearners(regionKeys) {
    const regions = new Set(regionKeys);
    return new Set(technicianCatalog
        .filter(item => !item.isTerminated && item.email && regions.has(item.dashboardRegion))
        .map(item => item.email));
}

function getDetailReportCell(index, regionKeys, column) {
    const eligibleLearners = getDetailReportEligibleLearners(regionKeys);
    const result = { attempts: 0, learners: new Set(), completedLearners: new Set(), duration: 0 };
    regionKeys.forEach(region => {
        const cell = index.get(detailReportCellKey(region, column.device, column.lab));
        if (!cell) return;
        result.attempts += cell.attempts;
        cell.learners.forEach(learner => result.learners.add(learner));
        cell.completedLearners.forEach(learner => result.completedLearners.add(learner));
        result.duration += cell.duration;
    });
    result.eligible = eligibleLearners.size;
    result.attempted = result.learners.size;
    result.completed = result.completedLearners.size;
    result.rate = result.eligible ? Math.round((result.completed / result.eligible) * 100) : null;
    result.avgDuration = result.attempts ? Math.round(result.duration / result.attempts) : 0;
    return result;
}

function getDetailReportTotal(index, regionKeys, columns) {
    const eligibleLearners = getDetailReportEligibleLearners(regionKeys);
    const result = { attempts: 0, attempted: 0, completed: 0, eligible: eligibleLearners.size * columns.length, duration: 0, isAggregate: true };
    columns.forEach(column => {
        const cell = getDetailReportCell(index, regionKeys, column);
        result.attempts += cell.attempts;
        result.attempted += cell.attempted;
        result.completed += cell.completed;
        result.duration += cell.duration;
    });
    result.rate = result.eligible ? Math.round((result.completed / result.eligible) * 100) : null;
    result.avgDuration = result.attempts ? Math.round(result.duration / result.attempts) : 0;
    return result;
}

function getDetailReportCellClass(cell) {
    if (cell.rate === null || !cell.attempts) return 'report-cell-zero';
    if (cell.rate >= 80) return 'report-cell-high';
    if (cell.rate >= 50) return 'report-cell-medium';
    return 'report-cell-low';
}

function renderDetailReportMetricCell(cell, extraClass = '') {
    if (!cell.eligible) return `<td class="report-metric-cell report-cell-zero ${extraClass}" title="Không có KTV trong phạm vi này"><strong>—</strong><span>N/A</span></td>`;
    if (!cell.attempts) return `<td class="report-metric-cell report-cell-zero ${extraClass}" title="Chưa có KTV thực hiện trong khoảng lọc"><strong>—</strong><span>Chưa có dữ liệu</span></td>`;
    const coverageUnit = cell.isAggregate ? 'lượt KTV-lab' : 'KTV';
    const title = `${cell.completed}/${cell.eligible} ${coverageUnit} hoàn thành • ${cell.attempted} ${coverageUnit} đã làm • ${cell.attempts} phiên • Trung bình ${formatDuration(cell.avgDuration)}`;
    return `
        <td class="report-metric-cell ${getDetailReportCellClass(cell)} ${extraClass}" title="${escapeHTML(title)}">
            <strong>${formatNumber.format(cell.completed)}/${formatNumber.format(cell.eligible)}</strong>
            <span>${cell.rate}% HT</span>
        </td>
    `;
}

function renderDetailedReport(rows) {
    if (!els.detailReportHead || !els.detailReportBody || !els.detailReportFoot) return;
    if (dashboardReport?.matrix) {
        renderAuthoritativeDetailedReport(dashboardReport.matrix);
        return;
    }

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
    const completedPairs = new Set(rows
        .filter(item => item.status === 'Hoàn thành')
        .map(item => `${item.learner}\u001f${item.device}\u001f${item.lab}`)).size;
    const eligiblePairs = technicianCatalog.filter(item => !item.isTerminated && item.email).length * columns.length;
    const completionRate = eligiblePairs ? Math.round((completedPairs / eligiblePairs) * 100) : 0;
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
}

function statusToVietnamese(status) {
    const map = {
        completed: 'Hoàn thành',
        in_progress: 'Đang làm',
        stuck: 'Đang làm',
        abandoned: 'Đã dừng',
        failed: 'Không đạt',
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
    if (seconds === null || seconds === undefined || seconds === '') return '—';
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    if (total < 60) return `${total} giây`;
    const minutes = Math.floor(total / 60);
    const rem = total % 60;
    return rem ? `${minutes} phút ${rem} giây` : `${minutes} phút`;
}

let learnerNameMap = new Map();

function normalizeTechnicianCatalog(apiTechnicians = []) {
    return apiTechnicians.map(item => ({
        userId: item.user_id || item.userId || item.id || '',
        employeeId: item.employee_id || item.employeeId || '',
        email: String(item.email || '').trim().toLowerCase(),
        displayName: item.display_name || item.displayName || item.email || 'KTV chưa xác định',
        jobTitle: item.job_title || item.jobTitle || '',
        classCode: item.class_code || item.classCode || '',
        className: item.class_name || item.className || item.class_code || item.classCode || '',
        unitCode: item.unit_code || item.unitCode || '',
        unitName: item.unit_name || item.unitName || '',
        regionId: item.region_id || item.regionId || '',
        regionCode: item.region_code || item.regionCode || '',
        regionName: item.region_name || item.regionName || item.dashboard_region || item.dashboardRegion || 'Chưa phân vùng',
        branchName: item.branch_name || item.branchName || '',
        dashboardRegion: item.dashboard_region || item.dashboardRegion || item.region_name || item.regionName || 'Chưa phân vùng',
        locationAssigned: Boolean(item.location_assigned ?? item.locationAssigned ?? item.region_id ?? item.regionId),
        isTerminated: Boolean(item.is_terminated ?? item.isTerminated)
    }));
}

function normalizeTrainingAssignments(apiAssignments = []) {
    return apiAssignments.map(item => ({
        learner: String(item.email || item.learner || '').trim().toLowerCase(),
        classCode: item.class_code || item.classCode || '',
        className: item.class_name || item.className || item.class_code || item.classCode || '',
        device: item.device_name || item.deviceName || item.device || 'N/A',
        lab: item.lab_name || item.labName || item.lab || 'N/A',
        status: item.status || 'assigned',
        completed: ['completed', 'passed'].includes(item.status) || Boolean(item.completed),
        completedAt: item.completed_at || item.completedAt || null
    }));
}

function rebuildTechnicianIndex() {
    technicianByIdentity = new Map();
    REGION_CATALOG = BASE_REGION_CATALOG.map(region => ({
        ...region,
        children: region.children ? [...region.children] : undefined
    }));
    REGION_FILTER_OPTIONS = REGION_CATALOG.flatMap(region => region.children || [region.code]);
    technicianCatalog.forEach(item => {
        [item.email, item.employeeId, item.userId].filter(Boolean).forEach(identity => {
            technicianByIdentity.set(String(identity).trim().toLowerCase(), item);
        });
    });
    const dynamicRegions = [...new Set(technicianCatalog.map(item => item.dashboardRegion).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'vi'));
    dynamicRegions.forEach(region => {
        if (REGION_FILTER_OPTIONS.includes(region)) return;
        REGION_CATALOG.push({ code: region });
        REGION_FILTER_OPTIONS.push(region);
    });
}

function rebuildLearnerNameMap() {
    learnerNameMap = new Map();
    technicianCatalog.forEach(item => {
        if (item.email) learnerNameMap.set(item.email, item.displayName || item.email);
    });
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
        const technician = technicianByIdentity.get(String(item.technician_id || '').trim().toLowerCase())
            || technicianByIdentity.get(String(item.email || '').trim().toLowerCase());
        return {
            sessionId: item.session_id,
            technicianId: item.technician_id || item.technician?.technician_id,
            technicianName: technician?.displayName || item.technician?.full_name || item.full_name || '',
            date: dateOnly(item.started_at),
            time: timeOnly(item.started_at),
            learner,
            region: normalizeRegionName(technician?.regionName || item.region_name || item.region || item.technician?.region, learner),
            classCode: technician?.classCode || item.class_code || '',
            jobTitle: technician?.jobTitle || item.job_title || '',
            unitCode: technician?.unitCode || item.unit_code || '',
            unitName: technician?.unitName || item.unit_name || '',
            branchName: technician?.branchName || item.branch_name || '',
            device: item.device?.device_name || item.device_name || item.device_id || 'N/A',
            lab: item.lab?.lab_name || item.lab_name || item.lab_id || 'N/A',
            skill: item.skill?.skill_name || item.skill?.skill_id || item.lab?.lab_name || item.lab_name || 'N/A',
            mode: item.mode || 'Thực hành',
            status: statusToVietnamese(item.status),
            duration: item.duration_sec === null || item.duration_sec === undefined
                ? null
                : Number(item.duration_sec),
            isPassed: item.is_passed === null || item.is_passed === undefined
                ? null
                : item.is_passed === true || item.is_passed === 1
                    || ['1', 't', 'true', 'yes'].includes(String(item.is_passed).trim().toLowerCase()),
            firstTry: item.completed_first_try === null || item.completed_first_try === undefined
                ? null
                : item.completed_first_try === true || item.completed_first_try === 1
                    || ['1', 't', 'true', 'yes'].includes(String(item.completed_first_try).trim().toLowerCase()),
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

function formatDashboardSyncDetail(date = new Date()) {
    return `Cập nhật lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

function setDashboardSyncState(status = 'ready', detail = '') {
    const sync = document.getElementById('dashboardSyncStatus');
    const title = document.getElementById('dashboardSyncTitle');
    const detailEl = document.getElementById('dashboardSyncDetail');
    const sidebarDot = document.getElementById('sidebarStatusDot');
    const titles = {
        syncing: 'Đang đồng bộ',
        ready: 'Dữ liệu mới nhất',
        stale: 'Đang dùng dữ liệu gần nhất',
        offline: 'Mất kết nối'
    };
    if (sync) sync.className = `dashboard-sync-status is-${status}`;
    if (title) title.textContent = titles[status] || titles.ready;
    if (detailEl) detailEl.textContent = detail || (state.lastSuccessfulRefreshAt
        ? formatDashboardSyncDetail(state.lastSuccessfulRefreshAt)
        : 'Chưa có dữ liệu đồng bộ');
    if (sidebarDot) sidebarDot.className = `sidebar-status-dot is-${status}`;
}

function setRefreshButtonBusy(busy) {
    const button = document.getElementById('refreshDashboardBtn');
    if (!button) return;
    button.disabled = busy;
    button.classList.toggle('is-busy', busy);
    button.setAttribute('aria-label', busy ? 'Đang làm mới dữ liệu dashboard' : 'Làm mới dữ liệu dashboard');
}

function setDashboardLoading(visible, message = '') {
    const el = document.getElementById('dashboardLoading');
    if (el) {
        el.hidden = !visible;
        el.setAttribute('aria-hidden', String(!visible));
        const copy = el.querySelector('.dashboard-loading-text');
        if (copy && message) copy.textContent = message;
    }
    document.getElementById('appPage')?.setAttribute('aria-busy', String(visible));
}

let dashboardPollTimer = null;
let dashboardRefreshInFlight = false;
let lastDashboardSignature = '';
let lastDashboardVersion = '';
let dashboardReportRequestSequence = 0;
const DASHBOARD_POLL_INTERVAL_MS = 30000;

function dashboardReportQuery() {
    const periods = getKpiComparisonPeriods();
    return new URLSearchParams({
        from: periods.currentStart,
        to: periods.currentEnd,
        compare_from: periods.previousStart,
        compare_to: periods.previousEnd,
        cohort: 'assigned_as_of_period_end'
    });
}

async function fetchDashboardReport(query = dashboardReportQuery()) {
    const response = await fetch(`${API_BASE_URL}/dashboard/report?${query}`);
    if (!response.ok) throw new Error(`API báo cáo trả về HTTP ${response.status}`);
    const payload = await response.json();
    return payload.data || null;
}

async function fetchDashboardVersion() {
    const response = await fetch(`${API_BASE_URL}/dashboard/version`);
    if (!response.ok) throw new Error(`API phiên bản dashboard trả về HTTP ${response.status}`);
    const payload = await response.json();
    return String(payload.data?.data_version || '');
}

async function reloadDashboardReport() {
    const requestSequence = ++dashboardReportRequestSequence;
    try {
        const report = await fetchDashboardReport();
        if (requestSequence !== dashboardReportRequestSequence) return;
        dashboardReport = report;
        renderAll();
    } catch (error) {
        console.warn('Không tải được báo cáo assignment theo kỳ.', error);
    }
}

function buildDashboardSignature(data) {
    const list = data.sessions || [];
    const technicians = data.technicians || [];
    const first = list[0];
    const last = list[list.length - 1];
    const latestTechnicianUpdate = technicians.reduce((latest, item) => {
        const value = item.updated_at || item.updatedAt || '';
        return value > latest ? value : latest;
    }, '');
    const completedCount = list.filter(item => item.status === 'completed').length;
    const knownFirstTryCount = list.filter(item => item.completed_first_try !== null && item.completed_first_try !== undefined).length;
    const firstTryCount = list.filter(item => item.completed_first_try === true).length;
    return [
        list.length,
        first?.session_id || '',
        first?.started_at || '',
        last?.session_id || '',
        last?.started_at || '',
        (data.devices || []).length,
        technicians.length,
        latestTechnicianUpdate,
        completedCount,
        knownFirstTryCount,
        firstTryCount,
        data.report_meta?.data_version || ''
    ].join('|');
}

async function fetchDashboardData(versionHint = '') {
    const allParams = new URLSearchParams();
    // The current curriculum assigns every active catalog lab to every active KTV.
    // Sending the expanded KTV x lab matrix duplicates data already represented by
    // technicianCatalog + deviceCatalog and can add tens of thousands of rows.
    const assignmentsRequested = false;
    allParams.set('include_assignments', '0');
    const reportRequest = fetch(`${API_BASE_URL}/dashboard/report?${dashboardReportQuery()}`).then(async response => {
        if (!response.ok) throw new Error(`API báo cáo trả về HTTP ${response.status}`);
        return (await response.json()).data || null;
    });
    const versionRequest = versionHint
        ? Promise.resolve(versionHint)
        : fetchDashboardVersion();
    const optionalRequests = Promise.allSettled([reportRequest, versionRequest]);
    const response = await fetch(`${API_BASE_URL}/dashboard/all?${allParams}`);
    if (!response.ok) throw new Error(`API dữ liệu chi tiết trả về HTTP ${response.status}`);
    const [payload, [reportResult, versionResult]] = await Promise.all([response.json(), optionalRequests]);
    const data = payload.data || {};
    const report = reportResult.status === 'fulfilled' ? reportResult.value : dashboardReport;
    const version = versionResult.status === 'fulfilled' ? String(versionResult.value || '') : String(versionHint || lastDashboardVersion || '');
    if (reportResult.status === 'rejected') console.warn('Không đồng bộ được báo cáo tổng hợp; giữ dữ liệu gần nhất.', reportResult.reason);
    if (versionResult.status === 'rejected') console.warn('Không đọc được phiên bản dữ liệu dashboard.', versionResult.reason);
    const techniciansAuthoritative = Array.isArray(data.technicians);
    const technicians = normalizeTechnicianCatalog(techniciansAuthoritative ? data.technicians : []);
    technicianCatalog = technicians;
    technicianCatalogAuthoritative = techniciansAuthoritative;
    rebuildTechnicianIndex();
    return {
        sessions: mapApiSessions(data.sessions || []),
        deviceCatalog: (Array.isArray(data.devices) && Array.isArray(data.labs))
            ? buildDeviceCatalog(data.devices, data.labs)
            : [],
        technicians,
        techniciansAuthoritative,
        assignments: normalizeTrainingAssignments(data.assignments || []),
        assignmentsRequested,
        report,
        version,
        raw: { ...data, report_meta: report?.meta || null }
    };
}

function applyDashboardData(data) {
    sessions = data.sessions;
    deviceCatalog = data.deviceCatalog;
    technicianCatalog = data.technicians || [];
    if (data.assignmentsRequested) {
        trainingAssignments = data.assignments || [];
        state.assignmentsLoaded = true;
    }
    if (data.report !== undefined) dashboardReport = data.report;
    technicianCatalogAuthoritative = Boolean(data.techniciansAuthoritative);
    state.dashboardDataLoaded = true;
    rebuildTechnicianIndex();
    rebuildLearnerNameMap();
}

function mergeUntouchedFilterSets(allKtvs, allDevices, allLabs, allRegions) {
    if (!state.realtimeKtvsTouched) state.realtimeSelectedKtvs = new Set(allKtvs);
    if (!state.learnerKtvsTouched) state.learnerSelectedKtvs = new Set(allKtvs);
    if (!state.learnerEmailsTouched) state.learnerSelectedEmails = new Set(allKtvs);
    if (!state.learnerRegionsTouched) state.learnerSelectedRegions = new Set(allRegions);
    if (!state.learnerDevicesTouched) state.learnerSelectedDevices = new Set(allDevices);
    if (!state.learnerLabsTouched) state.learnerSelectedLabs = new Set(allLabs);
    if (!state.realtimeDevicesTouched) state.realtimeSelectedDevices = new Set(allDevices);
    if (!state.realtimeLabsTouched) state.realtimeSelectedLabs = new Set(allLabs);
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
    const allRegions = [...new Set(sessions.map(item => item.region))].sort((a, b) => a.localeCompare(b, 'vi'));
    const universes = state.popoverUniverses;
    if (universes) {
        universes.allKtvs.splice(0, universes.allKtvs.length, ...allKtvs);
        universes.allDevices.splice(0, universes.allDevices.length, ...allDevices);
        universes.allLabs.splice(0, universes.allLabs.length, ...allLabs);
        universes.allRegions.splice(0, universes.allRegions.length, ...allRegions);
    }
    populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv, getLearnerName);
    populatePopoverOptions('realtimeDeviceOptions', allDevices, state.realtimeSelectedDevices, () => { state.realtimeDevicesTouched = true; }, state.realtimeSearchDevice);
    populatePopoverOptions('realtimeLabOptions', allLabs, state.realtimeSelectedLabs, () => { state.realtimeLabsTouched = true; }, state.realtimeSearchLab);
    populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => { state.learnerKtvsTouched = true; }, state.learnerSearchKtv, getLearnerName);
    populatePopoverOptions('learnerEmailOptions', allKtvs, state.learnerSelectedEmails, () => { state.learnerEmailsTouched = true; });
    populatePopoverOptions('learnerRegionOptions', allRegions, state.learnerSelectedRegions, () => { state.learnerRegionsTouched = true; });
    populatePopoverOptions('learnerDeviceOptions', allDevices, state.learnerSelectedDevices, () => { state.learnerDevicesTouched = true; });
    populatePopoverOptions('learnerLabOptions', allLabs, state.learnerSelectedLabs, () => { state.learnerLabsTouched = true; });
}

async function refreshDashboardData({ force = false, announce = false } = {}) {
    if (activeDashboardView === 'roster' && !force) return false;
    if (dashboardRefreshInFlight || (document.hidden && !force)) return false;
    dashboardRefreshInFlight = true;
    setRefreshButtonBusy(true);
    setDashboardSyncState('syncing', 'Đang kiểm tra dữ liệu mới nhất');
    try {
        let version = '';
        try {
            version = await fetchDashboardVersion();
        } catch (error) {
            console.warn('Không đọc được phiên bản dashboard; tiếp tục đồng bộ dữ liệu chính.', error);
        }
        if (!force && version !== '' && version === lastDashboardVersion) {
            state.lastSuccessfulRefreshAt = new Date();
            setDashboardSyncState('ready');
            return false;
        }
        const data = await fetchDashboardData(version);
        const signature = buildDashboardSignature(data.raw);
        if (!force && signature === lastDashboardSignature) {
            state.lastSuccessfulRefreshAt = new Date();
            setDashboardSyncState('ready');
            return false;
        }
        lastDashboardSignature = signature;
        lastDashboardVersion = data.version || version;
        applyDashboardData(data);
        const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
        const allDevices = [...new Set(sessions.map(item => item.device))].sort();
        const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
        const allRegions = [...new Set(sessions.map(item => item.region))].sort((a, b) => a.localeCompare(b, 'vi'));
        mergeUntouchedFilterSets(allKtvs, allDevices, allLabs, allRegions);
        refreshFilterOptionLists();
        mergeDefaultClassLearners();
        renderAll();
        state.lastSuccessfulRefreshAt = new Date();
        setDashboardSyncState('ready');
        if (announce) showToast('Dashboard đã được cập nhật với dữ liệu mới nhất.', 'success');
        return true;
    } catch (error) {
        console.warn('Đồng bộ dashboard thất bại; giữ dữ liệu gần nhất.', error);
        setDashboardSyncState(navigator.onLine ? 'stale' : 'offline', state.lastSuccessfulRefreshAt
            ? formatDashboardSyncDetail(state.lastSuccessfulRefreshAt)
            : 'Không thể kết nối tới máy chủ');
        if (announce) showToast('Không thể làm mới dữ liệu. Dashboard vẫn giữ bản gần nhất.', 'error');
        return false;
    } finally {
        dashboardRefreshInFlight = false;
        setRefreshButtonBusy(false);
    }
}

function startDashboardPolling() {
    if (dashboardPollTimer) return;
    dashboardPollTimer = setInterval(refreshDashboardData, DASHBOARD_POLL_INTERVAL_MS);
}

async function loadDashboardFromApi() {
    if (dashboardLoadRequest) return dashboardLoadRequest;
    dashboardLoadRequest = (async () => {
        setDashboardLoading(!state.dashboardDataLoaded, 'Đang đồng bộ dữ liệu dashboard...');
        setDashboardSyncState('syncing', 'Đang tải dữ liệu vận hành');
        try {
            setDataSourceLabel('Đang đồng bộ dữ liệu vận hành');
            renderAll();

            const data = await fetchDashboardData();
            lastDashboardSignature = buildDashboardSignature(data.raw);
            lastDashboardVersion = data.version || '';
            applyDashboardData(data);

            state.selectedLearner = '';
            state.learnerTablePage = 1;
            state.learnerDetailPage = 1;
            state.lastSuccessfulRefreshAt = new Date();
            setDataSourceLabel('Dữ liệu vận hành đã đồng bộ');
            setDashboardSyncState('ready');
            mergeUntouchedFilterSets(
                [...new Set(sessions.map(item => item.learner))].sort(),
                [...new Set(sessions.map(item => item.device))].sort(),
                [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi')),
                [...new Set(sessions.map(item => item.region))].sort((a, b) => a.localeCompare(b, 'vi'))
            );
            initFilters();
            initPopovers();
            renderAll();
            return true;
        } catch (error) {
            console.warn('Không kết nối được dữ liệu dashboard.', error);
            if (!state.dashboardDataLoaded) {
                sessions = [];
                deviceCatalog = [];
                technicianCatalog = [];
                trainingAssignments = [];
                dashboardReport = null;
                technicianCatalogAuthoritative = false;
                rebuildTechnicianIndex();
                rebuildLearnerNameMap();
            }
            setDataSourceLabel('Không thể đồng bộ dữ liệu');
            setDashboardSyncState(navigator.onLine ? 'stale' : 'offline', 'Không thể kết nối tới máy chủ');
            initFilters();
            initPopovers();
            renderAll();
            return false;
        } finally {
            setDashboardLoading(false);
            dashboardLoadRequest = null;
            startDashboardPolling();
        }
    })();
    return dashboardLoadRequest;
}

async function guardDashboardAdmin() {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/auth/session`);
    } catch (error) {
        console.warn('Không thể xác minh phiên quản trị.', error);
        setDataSourceLabel('Không thể xác minh phiên quản trị');
        setDashboardLoading(false);
        return false;
    }
    const user = response.ok ? (await response.json().catch(() => null))?.user : null;
    const role = String(user?.role || '').toUpperCase();
    const isAdmin = Boolean(user && (user.isAdmin ?? user.is_admin ?? user.permissions?.admin ?? ['ADMIN', 'DEV'].includes(role)));
    if (!isAdmin) {
        window.location.replace(`${window.location.origin}/`);
        return false;
    }
    state.currentUser = user;
    state.isAdmin = true;
    state.canExportReports = Boolean(
        user.canExportReports
        ?? user.can_export_reports
        ?? user.permissions?.exportReports
        ?? user.permissions?.export_reports
        ?? role === 'DEV'
    );
    applyReportExportPermission();
    return true;
}

function applyReportExportPermission() {
    const button = document.getElementById('exportBtn');
    if (!button) return;
    button.hidden = !state.canExportReports;
    button.disabled = !state.canExportReports;
    button.setAttribute('aria-hidden', state.canExportReports ? 'false' : 'true');
}

function ensureReportExportAllowed() {
    if (state.canExportReports) return true;
    showToast('Chỉ tài khoản có role DEV mới được xuất báo cáo.', 'error');
    return false;
}

async function loadInitialDashboardData() {
    if (!(await guardDashboardAdmin())) return;
    if (activeDashboardView === 'roster') {
        setDataSourceLabel('Hồ sơ KTV từ cơ sở dữ liệu');
        await loadRosterList();
        setDashboardLoading(false);
        return;
    }
    await loadDashboardFromApi();

    const requestedLearner = new URLSearchParams(window.location.search).get('learner');
    if (activeDashboardView === 'technicians' && requestedLearner && sessions.some(item => item.learner === requestedLearner)) {
        state.selectedLearner = requestedLearner;
        state.learnerDetailPage = 1;
        renderAll();
    }

}

function initFilters() {
    if (state.filtersBound) return;
    state.filtersBound = true;

}

let suppressFilterRender = false;
let deferredFilterCallback = null;
let headerFilterSequence = 0;

function getHeaderFilterDropdown(wrapper) {
    return wrapper?._floatingDropdown
        || wrapper?._headerFilterDropdown
        || wrapper?.querySelector('.popover-dropdown');
}

function closeHeaderFilterPopover(wrapper, { restoreFocus = false } = {}) {
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.popover-trigger-btn, .select-popover-btn, .compact-trigger');
    const dropdown = getHeaderFilterDropdown(wrapper);
    wrapper.classList.remove('open');
    dropdown?.classList.remove('open');
    trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus();
}

function openHeaderFilterPopover(wrapper) {
    if (!wrapper) return;
    document.querySelectorAll('.header-filter-popover.open').forEach(openWrapper => {
        if (openWrapper !== wrapper) closeHeaderFilterPopover(openWrapper);
    });
    wrapper.classList.add('open');
    positionHeaderFilterDropdown(wrapper, true);
    const dropdown = getHeaderFilterDropdown(wrapper);
    window.requestAnimationFrame(() => {
        const target = dropdown?.querySelector('.header-filter-search, input:not([disabled]), button:not([disabled])');
        target?.focus();
    });
}

function enhanceHeaderFilterPopovers(root = document) {
    root.querySelectorAll('thead .popover-filter-wrapper').forEach(wrapper => {
        if (wrapper.closest('#rosterListPanel')) return;
        const trigger = wrapper.querySelector('.popover-trigger-btn');
        const dropdown = wrapper.querySelector('.popover-dropdown');
        if (!trigger || !dropdown || dropdown.dataset.headerFilterEnhanced === 'true') return;

        dropdown.dataset.headerFilterEnhanced = 'true';
        dropdown.classList.add('header-filter-menu');
        wrapper.classList.add('header-filter-popover');
        wrapper._headerFilterDropdown = dropdown;
        if (!dropdown.id) dropdown.id = `headerFilterMenu${++headerFilterSequence}`;
        dropdown.setAttribute('role', 'dialog');
        dropdown.setAttribute('aria-modal', 'false');
        dropdown.setAttribute('aria-label', `Bộ lọc ${trigger.textContent.trim() || 'bảng dữ liệu'}`);
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', dropdown.id);

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
        searchInput.setAttribute('aria-label', `Tìm trong ${dropdown.getAttribute('aria-label').toLocaleLowerCase('vi')}`);

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
            closeHeaderFilterPopover(wrapper, { restoreFocus: true });
            state.realtimePage = 1;
            state.learnerTablePage = 1;
            state.learnerDetailPage = 1;
            renderAll();
        });
        footer.appendChild(applyButton);
        dropdown.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeHeaderFilterPopover(wrapper, { restoreFocus: true });
                return;
            }
            trapDialogFocus(event, dropdown);
        });
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
    if (state.popoversInitialized) {
        refreshFilterOptionLists();
        return;
    }
    state.popoversInitialized = true;
    const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
    const allDevices = [...new Set(sessions.map(item => item.device))].sort();
    const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
    const allRegions = [...new Set(sessions.map(item => item.region))].sort((a, b) => a.localeCompare(b, 'vi'));
    state.popoverUniverses = { allKtvs, allDevices, allLabs, allRegions };
    let learnerSearchTimer = null;
    let detailDeviceSearchTimer = null;
    let detailLabSearchTimer = null;

    // Fill sets with all items by default on initial load
    if (state.realtimeSelectedKtvs.size === 0 && !state.realtimeKtvsTouched) {
        state.realtimeSelectedKtvs = new Set(allKtvs);
    }
    if (state.realtimeSelectedLabs.size === 0 && !state.realtimeLabsTouched) {
        state.realtimeSelectedLabs = new Set(allLabs);
    }
    if (state.learnerSelectedKtvs.size === 0 && !state.learnerKtvsTouched) {
        state.learnerSelectedKtvs = new Set(allKtvs);
    }
    if (state.learnerSelectedEmails.size === 0 && !state.learnerEmailsTouched) {
        state.learnerSelectedEmails = new Set(allKtvs);
    }
    if (state.learnerSelectedRegions.size === 0 && !state.learnerRegionsTouched) {
        state.learnerSelectedRegions = new Set(allRegions);
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
    // 1. Realtime KTV Popover
    populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv, getLearnerName);
    document.getElementById('realtimeKtvSearch')?.addEventListener('input', (e) => {
        state.realtimeSearchKtv = e.target.value;
        populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, state.realtimeSearchKtv, getLearnerName);
    });
    document.getElementById('realtimeKtvClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedKtvs = new Set(allKtvs);
        state.realtimeKtvsTouched = false;
        state.realtimeSearchKtv = '';
        const searchInput = document.getElementById('realtimeKtvSearch');
        if (searchInput) searchInput.value = '';
        populatePopoverOptions('realtimeKtvOptions', allKtvs, state.realtimeSelectedKtvs, () => { state.realtimeKtvsTouched = true; }, undefined, getLearnerName);
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

    // 4. Realtime Lab Popover
    populatePopoverOptions('realtimeLabOptions', allLabs, state.realtimeSelectedLabs, () => { state.realtimeLabsTouched = true; }, state.realtimeSearchLab);
    document.getElementById('realtimeLabClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.realtimeSelectedLabs = new Set(allLabs);
        state.realtimeLabsTouched = false;
        state.realtimeSearchLab = '';
        const searchInput = document.querySelector('#realtimeLabDropdown .header-filter-search');
        if (searchInput) searchInput.value = '';
        populatePopoverOptions('realtimeLabOptions', allLabs, state.realtimeSelectedLabs, () => { state.realtimeLabsTouched = true; });
        renderAll();
    });

    // 5. Realtime Status Popover
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
        state.realtimeSelectedStatuses = new Set(['Hoàn thành', 'Đang làm', 'Không đạt', 'Đã dừng']);
        document.querySelectorAll('#realtimeStatusOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // 5. Learner table header filters
    populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => {
        state.learnerKtvsTouched = true;
        updatePopoverTriggerLabels();
    }, state.learnerSearchKtv, getLearnerName);
    populatePopoverOptions('learnerEmailOptions', allKtvs, state.learnerSelectedEmails, () => {
        state.learnerEmailsTouched = true;
        updatePopoverTriggerLabels();
    });
    populatePopoverOptions('learnerRegionOptions', allRegions, state.learnerSelectedRegions, () => {
        state.learnerRegionsTouched = true;
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
        window.clearTimeout(learnerSearchTimer);
        learnerSearchTimer = window.setTimeout(renderAll, 180);
    });
    const repopulateLearnerFilters = () => {
        populatePopoverOptions('learnerKtvOptions', allKtvs, state.learnerSelectedKtvs, () => { state.learnerKtvsTouched = true; }, undefined, getLearnerName);
        populatePopoverOptions('learnerEmailOptions', allKtvs, state.learnerSelectedEmails, () => { state.learnerEmailsTouched = true; });
        populatePopoverOptions('learnerRegionOptions', allRegions, state.learnerSelectedRegions, () => { state.learnerRegionsTouched = true; });
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
        state.learnerSelectedEmails = new Set(allKtvs);
        state.learnerSelectedRegions = new Set(allRegions);
        state.learnerSelectedDevices = new Set(allDevices);
        state.learnerSelectedLabs = new Set(allLabs);
        state.learnerKtvsTouched = false;
        state.learnerEmailsTouched = false;
        state.learnerRegionsTouched = false;
        state.learnerDevicesTouched = false;
        state.learnerLabsTouched = false;
        state.learnerSearchKtv = '';
        state.learnerTablePage = 1;
        const searchInput = document.getElementById('learnerKtvSearch');
        if (searchInput) searchInput.value = '';
        clearHeaderSearch('learnerKtvPopoverWrapper');
        clearHeaderSearch('learnerEmailPopoverWrapper');
        clearHeaderSearch('learnerRegionPopoverWrapper');
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
    document.getElementById('learnerEmailClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.learnerSelectedEmails = new Set(allKtvs);
        state.learnerEmailsTouched = false;
        clearHeaderSearch('learnerEmailPopoverWrapper');
        repopulateLearnerFilters();
        renderAll();
    });
    document.getElementById('learnerRegionClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.learnerSelectedRegions = new Set(allRegions);
        state.learnerRegionsTouched = false;
        clearHeaderSearch('learnerRegionPopoverWrapper');
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
        window.clearTimeout(detailDeviceSearchTimer);
        detailDeviceSearchTimer = window.setTimeout(renderAll, 180);
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

    // 8. Learner Detail Lab Search
    document.getElementById('detailLabSearch')?.addEventListener('input', (e) => {
        state.detailSearchLab = e.target.value;
        window.clearTimeout(detailLabSearchTimer);
        detailLabSearchTimer = window.setTimeout(renderAll, 180);
    });
    document.getElementById('detailLabClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.detailLabsTouched = false;
        state.detailSelectedLabs.clear();
        state.detailSearchLab = '';
        const searchInput = document.getElementById('detailLabSearch');
        if (searchInput) searchInput.value = '';
        renderAll();
    });

    // 9. Learner Detail Status Popover
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
        state.detailSelectedStatuses = new Set(['Hoàn thành', 'Đang làm', 'Không đạt', 'Đã dừng', 'Chưa thực hiện']);
        document.querySelectorAll('#detailStatusOptions input[type="checkbox"]').forEach(chk => chk.checked = true);
        renderAll();
    });

    // Bind triggers toggle
    document.querySelectorAll('.popover-filter-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.popover-trigger-btn, .select-popover-btn, .compact-trigger');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.popover-filter-wrapper').forEach(w => {
                if (w.classList.contains('header-filter-popover')) closeHeaderFilterPopover(w);
                else {
                    w.classList.remove('open');
                    w.querySelector('.popover-trigger-btn')?.setAttribute('aria-expanded', 'false');
                    positionHeaderFilterDropdown(w, false);
                }
            });
            if (!isOpen) {
                if (wrapper.classList.contains('header-filter-popover')) openHeaderFilterPopover(wrapper);
                else {
                    wrapper.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                    positionHeaderFilterDropdown(wrapper, true);
                }
            }
        });
        wrapper.querySelector('.popover-dropdown')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.popover-filter-wrapper').forEach(w => {
            if (w.classList.contains('header-filter-popover')) closeHeaderFilterPopover(w);
            else {
                w.classList.remove('open');
                w.querySelector('.popover-trigger-btn')?.setAttribute('aria-expanded', 'false');
                positionHeaderFilterDropdown(w, false);
            }
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
    // Filter by Lab popover
    filtered = filtered.filter(item => state.realtimeSelectedLabs.has(item.lab));
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
    const rosterLearners = technicianCatalog
        .filter(item => !item.isTerminated && item.email)
        .map(item => item.email);
    return [...new Set([...rosterLearners, ...sessions.map(item => item.learner).filter(Boolean)])]
        .sort((a, b) => a.localeCompare(b, 'vi'));
}

function getDatabaseInstructorClasses() {
    const classes = new Map();
    technicianCatalog
        .filter(item => !item.isTerminated && item.email)
        .forEach(item => {
            const classCode = item.classCode || '';
            const key = classCode || '__unassigned__';
            if (!classes.has(key)) {
                classes.set(key, {
                    code: classCode,
                    name: item.className || classCode || 'Chưa xếp lớp',
                    members: []
                });
            }
            classes.get(key).members.push(item.email);
        });
    return [...classes.entries()]
        .sort(([, left], [, right]) => left.name.localeCompare(right.name, 'vi'))
        .map(([key, item]) => ({
            id: `db-class-${key}`,
            code: item.code,
            name: item.name,
            members: [...new Set(item.members)].sort((a, b) => a.localeCompare(b, 'vi')),
            source: 'database'
        }));
}

function normalizeInstructorSearchText(value) {
    return String(value || '')
        .trim()
        .toLocaleLowerCase('vi')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
}

function getInstructorLabNumber(label) {
    const match = String(label || '').match(/(?:^|\s)bài\s*0*(\d+)/i);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function compareInstructorLabels(left, right) {
    const leftNumber = getInstructorLabNumber(left);
    const rightNumber = getInstructorLabNumber(right);
    if (leftNumber !== rightNumber) return leftNumber - rightNumber;
    return String(left || '').localeCompare(String(right || ''), 'vi', { numeric: true, sensitivity: 'base' });
}

function sortInstructorDeviceGroups(groups) {
    const deviceOrder = new Map();
    const labOrderByDevice = new Map();
    deviceCatalog.forEach((item, deviceIndex) => {
        const deviceName = item.device || item.device_name || item.model || '';
        if (!deviceName || deviceOrder.has(deviceName)) return;
        deviceOrder.set(deviceName, deviceIndex);
        labOrderByDevice.set(deviceName, new Map((item.labs || []).map((lab, labIndex) => [lab, labIndex])));
    });

    const rank = (map, key) => map?.has(key) ? map.get(key) : Number.POSITIVE_INFINITY;
    return groups
        .map(group => {
            const labOrder = labOrderByDevice.get(group.device);
            const labs = [...group.labs].sort((left, right) => {
                const leftRank = rank(labOrder, left);
                const rightRank = rank(labOrder, right);
                if (leftRank !== rightRank) return leftRank - rightRank;
                return compareInstructorLabels(left, right);
            });
            return { ...group, labs };
        })
        .sort((left, right) => {
            const leftRank = rank(deviceOrder, left.device);
            const rightRank = rank(deviceOrder, right.device);
            if (leftRank !== rightRank) return leftRank - rightRank;
            return left.device.localeCompare(right.device, 'vi', { numeric: true, sensitivity: 'base' });
        });
}

function getInstructorDeviceGroups(selectedClass = null) {
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

    if (trainingAssignments.length && selectedClass) {
        const members = new Set(selectedClass.members || []);
        trainingAssignments
            .filter(item => item.classCode === selectedClass.code && members.has(item.learner))
            .forEach(item => {
                const group = ensureGroup(item.device);
                if (item.lab && !group.labs.includes(item.lab)) group.labs.push(item.lab);
            });
        return sortInstructorDeviceGroups(groups.filter(group => group.labs.length));
    }

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
    return sortInstructorDeviceGroups(groups.filter(group => group.labs.length));
}

function saveInstructorClasses() {
    try {
        localStorage.setItem(INSTRUCTOR_CLASSES_STORAGE_KEY, JSON.stringify(state.instructorClasses));
    } catch (error) {
        console.warn('Không thể lưu danh sách lớp trên trình duyệt.', error);
    }
}

function initializeInstructorClasses() {
    const databaseClasses = getDatabaseInstructorClasses();
    if (technicianCatalogAuthoritative) {
        state.instructorClasses = databaseClasses;
        state.instructorClassesLoaded = true;
        if (!state.instructorClasses.some(item => item.id === state.instructorActiveClassId)) {
            state.instructorActiveClassId = state.instructorClasses[0]?.id || '';
        }
        return;
    }
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
    if (trainingAssignments.length) {
        const selectedMembers = new Set(selectedClass?.members || []);
        const assignmentByLearnerLab = new Map();
        trainingAssignments
            .filter(item => item.classCode === selectedClass?.code && selectedMembers.has(item.learner))
            .forEach(item => assignmentByLearnerLab.set(`${item.learner}\u001f${item.device}\u001f${item.lab}`, item));
        return (selectedClass?.members || []).map(learner => {
            const deviceResults = selectedGroups.map(group => {
                const labResults = group.labs.map(lab => {
                    const assignment = assignmentByLearnerLab.get(`${learner}\u001f${group.device}\u001f${lab}`);
                    return { lab, assigned: Boolean(assignment), completed: Boolean(assignment?.completed) };
                });
                const assignedResults = labResults.filter(item => item.assigned);
                const completed = assignedResults.filter(item => item.completed).length;
                const total = assignedResults.length;
                return { device: group.device, labResults, completed, total, rate: total ? Math.round((completed / total) * 100) : null };
            });
            const completed = deviceResults.reduce((sum, item) => sum + item.completed, 0);
            const total = deviceResults.reduce((sum, item) => sum + item.total, 0);
            return { learner, deviceResults, completed, total, rate: total ? Math.round((completed / total) * 100) : null };
        });
    }
    const completedStatus = statusToVietnamese('completed');
    const rowsByLearner = new Map();
    sessions.forEach(item => {
        if (item.mode === 'Hướng dẫn') return;
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

function getInstructorLabCellClass(completed, assigned = true) {
    if (!assigned) return 'instructor-progress-unassigned';
    return completed ? 'instructor-progress-complete' : 'instructor-progress-pending';
}

function getInstructorRateClass(rate) {
    if (rate >= 80) return 'instructor-rate-high';
    if (rate >= 50) return 'instructor-rate-medium';
    return 'instructor-rate-low';
}

function getInstructorCompletionStatus(row) {
    if (!row.total || row.rate === null) return 'unassigned';
    if (row.completed >= row.total) return 'completed';
    if (row.completed > 0) return 'in_progress';
    return 'not_started';
}

function filterInstructorProgressRows(rows) {
    const search = normalizeInstructorSearchText(state.instructorSearchKtv);
    return rows
        .filter(row => {
            const technician = technicianByIdentity.get(String(row.learner || '').trim().toLowerCase());
            const searchable = normalizeInstructorSearchText([
                getLearnerName(row.learner),
                row.learner,
                technician?.employeeId
            ].filter(Boolean).join(' '));
            const matchesSearch = !search || searchable.includes(search);
            const status = getInstructorCompletionStatus(row);
            const matchesStatus = state.instructorCompletionFilter === 'all' || status === state.instructorCompletionFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((left, right) => {
            const byName = getLearnerName(left.learner).localeCompare(getLearnerName(right.learner), 'vi', { numeric: true, sensitivity: 'base' });
            return byName || left.learner.localeCompare(right.learner, 'vi', { numeric: true, sensitivity: 'base' });
        });
}

function renderInstructorLabHeader(label) {
    const text = String(label || '');
    const match = text.match(/^(Bài\s*\d+)\s*[:.\-–]?\s*(.*)$/i);
    if (!match) return `<span class="instructor-lab-name">${escapeHTML(text)}</span>`;
    return `
        <span class="instructor-lab-order">${escapeHTML(match[1])}</span>
        ${match[2] ? `<span class="instructor-lab-name">${escapeHTML(match[2])}</span>` : ''}
    `;
}

function renderInstructorLearner(learner) {
    const name = getLearnerName(learner);
    const technician = technicianByIdentity.get(String(learner || '').trim().toLowerCase());
    const showEmail = normalizeInstructorSearchText(name) !== normalizeInstructorSearchText(learner);
    return `
        <span class="instructor-progress-learner-name">${escapeHTML(name)}</span>
        ${showEmail ? `<span class="instructor-progress-learner-email">${escapeHTML(learner)}</span>` : ''}
        ${technician?.employeeId ? `<span class="instructor-progress-learner-id">Mã NV: ${escapeHTML(technician.employeeId)}</span>` : ''}
    `;
}

function renderInstructorClassProgress() {
    const classSelect = document.getElementById('instructorClassSelect');
    const deviceSelect = document.getElementById('instructorDeviceSelect');
    const head = document.getElementById('instructorProgressHead');
    const body = document.getElementById('instructorProgressBody');
    const foot = document.getElementById('instructorProgressFoot');
    const summary = document.getElementById('instructorProgressSummary');
    const scroll = document.getElementById('instructorProgressScroll');
    const scrollHint = document.getElementById('instructorProgressScrollHint');
    const empty = document.getElementById('instructorProgressEmpty');
    const searchInput = document.getElementById('instructorKtvSearch');
    const completionFilter = document.getElementById('instructorCompletionFilter');
    const filterReset = document.getElementById('instructorProgressFilterReset');
    const filterMeta = document.getElementById('instructorProgressFilterMeta');
    if (!classSelect || !deviceSelect || !head || !body || !foot || !summary || !scroll || !empty) return;

    if (searchInput && searchInput.value !== state.instructorSearchKtv) searchInput.value = state.instructorSearchKtv;
    if (completionFilter) completionFilter.value = state.instructorCompletionFilter;

    initializeInstructorClasses();
    if (state.instructorActiveClassId && !state.instructorClasses.some(item => item.id === state.instructorActiveClassId)) {
        state.instructorActiveClassId = state.instructorClasses[0]?.id || '';
    }

    classSelect.innerHTML = state.instructorClasses.length
        ? state.instructorClasses.map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)} · ${item.members.length} KTV</option>`).join('')
        : '<option value="">Chưa có lớp học</option>';
    classSelect.value = state.instructorActiveClassId;
    classSelect.disabled = !state.instructorClasses.length;

    const selectedClass = state.instructorClasses.find(item => item.id === state.instructorActiveClassId);
    if (searchInput) searchInput.disabled = !selectedClass;
    if (completionFilter) completionFilter.disabled = !selectedClass;
    const allGroups = getInstructorDeviceGroups(selectedClass);
    const selectedDeviceStillExists = !state.instructorSelectedDevice || allGroups.some(item => item.device === state.instructorSelectedDevice);
    if (!selectedDeviceStillExists) state.instructorSelectedDevice = '';
    deviceSelect.innerHTML = '<option value="">Tất cả thiết bị</option>' + allGroups
        .map(item => `<option value="${escapeHTML(item.device)}">${escapeHTML(item.device)}</option>`)
        .join('');
    deviceSelect.value = state.instructorSelectedDevice;

    const deleteButton = document.getElementById('instructorClassDelete');
    if (deleteButton) deleteButton.disabled = !state.instructorClasses.length || selectedClass?.source === 'database';

    if (!selectedClass) {
        head.innerHTML = '';
        body.innerHTML = '';
        foot.innerHTML = '';
        summary.innerHTML = '';
        if (filterMeta) filterMeta.textContent = '';
        if (filterReset) filterReset.hidden = true;
        scroll.hidden = true;
        if (scrollHint) scrollHint.hidden = true;
        empty.hidden = false;
        empty.textContent = technicianCatalogAuthoritative
            ? 'Chưa có lớp học trong hồ sơ nhân viên trên cơ sở dữ liệu.'
            : 'Chưa có lớp học.';
        return;
    }

    const selectedGroups = state.instructorSelectedDevice
        ? allGroups.filter(item => item.device === state.instructorSelectedDevice)
        : allGroups;
    const allProgressRows = getInstructorClassProgress(selectedClass, selectedGroups);
    const progressRows = filterInstructorProgressRows(allProgressRows);
    const completed = progressRows.reduce((sum, item) => sum + item.completed, 0);
    const total = progressRows.reduce((sum, item) => sum + item.total, 0);
    const rate = total ? Math.round((completed / total) * 100) : null;

    const columns = selectedGroups.flatMap((group, groupIndex) => group.labs.map((lab, labIndex) => ({
        device: group.device,
        lab,
        groupIndex,
        isFirst: labIndex === 0
    })));

    const filtersActive = Boolean(state.instructorSearchKtv.trim()) || state.instructorCompletionFilter !== 'all';
    if (filterReset) filterReset.hidden = !filtersActive;
    if (filterMeta) {
        filterMeta.textContent = filtersActive
            ? `Đang hiển thị ${progressRows.length}/${allProgressRows.length} KTV`
            : `${allProgressRows.length} KTV trong lớp`;
    }

    summary.innerHTML = `
        <span class="instructor-summary-chip"><strong>${progressRows.length}${filtersActive ? `/${allProgressRows.length}` : ''}</strong> KTV hiển thị</span>
        <span class="instructor-summary-chip"><strong>${selectedGroups.length}</strong> thiết bị</span>
        <span class="instructor-summary-chip"><strong>${columns.length}</strong> bài lab</span>
        <span class="instructor-summary-chip"><strong>${completed}/${total}</strong> bài hoàn thành</span>
        <span class="instructor-summary-chip"><strong>${rate === null ? '—' : `${rate}%`}</strong> tiến độ lớp</span>
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
                <th class="instructor-progress-lab instructor-progress-lab-tone-${column.groupIndex % 5} ${column.isFirst ? 'group-start' : ''}" scope="col" title="${escapeHTML(`${column.device} • ${column.lab}`)}">${renderInstructorLabHeader(column.lab)}</th>
            `).join('')}
        </tr>
    `;
    body.innerHTML = progressRows.length ? progressRows.map((row, index) => `
        <tr>
            <td class="instructor-progress-index">${index + 1}</td>
            <th class="instructor-progress-email" scope="row" title="${escapeHTML(row.learner)}">${renderInstructorLearner(row.learner)}</th>
            ${row.deviceResults.flatMap(item => item.labResults.map(lab => `
                <td class="instructor-progress-lab instructor-lab-cell ${getInstructorLabCellClass(lab.completed, lab.assigned !== false)}" title="${escapeHTML(`${item.device} • ${lab.lab}: ${lab.assigned === false ? 'Chưa giao' : (lab.completed ? 'Hoàn thành' : 'Chưa hoàn thành')}`)}">
                    ${lab.assigned === false ? '—' : (lab.completed ? '✓' : '○')}
                </td>
            `)).join('')}
            <td class="instructor-progress-total">${row.completed}/${row.total}</td>
            <td class="instructor-progress-rate ${getInstructorRateClass(row.rate || 0)}">${row.rate === null ? '—' : `${row.rate}%`}</td>
        </tr>
    `).join('') : `
        <tr>
            <td class="instructor-progress-filter-empty" colspan="${columns.length + 4}">
                Không có KTV phù hợp với tìm kiếm hoặc trạng thái đã chọn.
            </td>
        </tr>
    `;

    if (progressRows.length) {
        const columnTotals = columns.map((column, columnIndex) => progressRows.reduce((result, row) => {
            const lab = row.deviceResults.flatMap(item => item.labResults)[columnIndex];
            if (lab && lab.assigned !== false) result.assigned++;
            if (lab?.completed) result.completed++;
            return result;
        }, { assigned: 0, completed: 0 }));
        foot.innerHTML = `
            <tr>
                <th class="instructor-progress-index instructor-progress-grand-index" scope="row">Σ</th>
                <th class="instructor-progress-email instructor-progress-grand-label" scope="row">Tổng ${progressRows.length} KTV</th>
                ${columnTotals.map((item, index) => {
                    const columnRate = item.assigned ? Math.round((item.completed / item.assigned) * 100) : null;
                    return `
                        <td class="instructor-progress-lab instructor-progress-column-total ${columns[index].isFirst ? 'group-start' : ''}" title="${escapeHTML(`${columns[index].device} • ${columns[index].lab}: ${item.completed}/${item.assigned} KTV hoàn thành`)}">
                            <strong>${item.assigned ? `${item.completed}/${item.assigned}` : '—'}</strong>
                            ${columnRate === null ? '' : `<small>${columnRate}%</small>`}
                        </td>
                    `;
                }).join('')}
                <td class="instructor-progress-total">${completed}/${total}</td>
                <td class="instructor-progress-rate ${getInstructorRateClass(rate || 0)}">${rate === null ? '—' : `${rate}%`}</td>
            </tr>
        `;
    } else {
        foot.innerHTML = '';
    }

    scroll.hidden = false;
    if (scrollHint) scrollHint.hidden = false;
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
    document.getElementById('instructorKtvSearch')?.addEventListener('input', event => {
        state.instructorSearchKtv = event.target.value;
        window.clearTimeout(instructorSearchTimer);
        instructorSearchTimer = window.setTimeout(renderInstructorClassProgress, 160);
    });
    document.getElementById('instructorCompletionFilter')?.addEventListener('change', event => {
        state.instructorCompletionFilter = event.target.value;
        renderInstructorClassProgress();
    });
    document.getElementById('instructorProgressFilterReset')?.addEventListener('click', () => {
        state.instructorSearchKtv = '';
        state.instructorCompletionFilter = 'all';
        renderInstructorClassProgress();
        document.getElementById('instructorKtvSearch')?.focus();
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
}

/* ============================================================
   Báo cáo Ma trận Thực hành KTV theo Lớp học
   ============================================================ */

function getClassMatrixData() {
    initializeInstructorClasses();

    let classes = state.instructorClasses || [];
    if (!classes.length) {
        classes = getDatabaseInstructorClasses();
    }

    if (!state.classMatrixSelectedClass && classes.length) {
        state.classMatrixSelectedClass = classes[0].id;
    }

    let selectedClass = classes.find(c => c.id === state.classMatrixSelectedClass) || null;
    let learners = [];
    if (state.classMatrixSelectedClass === 'all') {
        learners = getInstructorLearners();
    } else if (selectedClass) {
        learners = selectedClass.members || [];
    } else if (classes.length) {
        selectedClass = classes[0];
        state.classMatrixSelectedClass = selectedClass.id;
        learners = selectedClass.members || [];
    } else {
        learners = getInstructorLearners();
    }

    const allGroups = getInstructorDeviceGroups(selectedClass);
    const selectedGroups = state.classMatrixSelectedDevice
        ? allGroups.filter(g => g.device === state.classMatrixSelectedDevice)
        : allGroups;

    const columns = selectedGroups.flatMap((group, groupIndex) => (group.labs || []).map((lab, labIndex) => ({
        device: group.device,
        lab,
        groupIndex,
        isFirst: labIndex === 0,
        isLast: labIndex === group.labs.length - 1
    })));

    // Filter learners by search
    const search = (state.classMatrixSearch || '').trim().toLowerCase();
    const mappedLearners = learners.map(email => {
        const tech = technicianByIdentity.get(String(email).toLowerCase());
        const name = tech?.displayName || getLearnerName(email) || email;
        const code = tech?.employeeId || '';
        const region = tech?.dashboardRegion || getLearnerRegion(email) || '';
        const classCode = tech?.classCode || selectedClass?.code || '';
        const className = tech?.className || selectedClass?.name || '';
        return { email, tech, name, code, region, classCode, className };
    });

    const filteredLearners = search
        ? mappedLearners.filter(l =>
            l.name.toLowerCase().includes(search) ||
            l.email.toLowerCase().includes(search) ||
            l.code.toLowerCase().includes(search) ||
            l.region.toLowerCase().includes(search)
        )
        : mappedLearners;

    // Build assignment map if trainingAssignments exists
    const assignmentMap = new Map();
    if (trainingAssignments.length) {
        trainingAssignments.forEach(a => {
            const key = `${String(a.classCode || '')}\u001f${String(a.learner || '').toLowerCase()}\u001f${a.device}\u001f${a.lab}`;
            assignmentMap.set(key, a);
        });
    }

    // Index sessions once so every learner/lab cell is an O(1) lookup.
    const sessionsByCell = new Map();
    sessions.forEach(s => {
        if (s.mode === 'Hướng dẫn') return;
        const sessionClassCode = String(s.classCode || technicianByIdentity.get(String(s.learner || '').toLowerCase())?.classCode || '');
        if (state.classMatrixSelectedClass !== 'all' && selectedClass?.code && sessionClassCode && sessionClassCode !== String(selectedClass.code)) return;
        const learnerKey = String(s.learner || '').toLowerCase();
        const cellKey = `${learnerKey}\u001f${s.device}\u001f${s.lab}`;
        if (!sessionsByCell.has(cellKey)) sessionsByCell.set(cellKey, []);
        sessionsByCell.get(cellKey).push(s);
    });

    let totalClassAttempts = 0;
    const labStats = new Map(); // colKey -> { assigned, completed, attempted, attempts }
    columns.forEach(col => {
        labStats.set(`${col.device}\u001f${col.lab}`, { assigned: 0, completed: 0, attempted: 0, attempts: 0 });
    });

    const rows = filteredLearners.map(l => {
        const learnerKey = l.email.toLowerCase();
        let ktvCompleted = 0;
        let ktvAssigned = 0;
        let ktvAttempts = 0;

        const cells = columns.map(col => {
            const colKey = `${col.device}\u001f${col.lab}`;
            const learnerClassCode = String(l.classCode || selectedClass?.code || '');
            const assignKey = `${learnerClassCode}\u001f${l.email.toLowerCase()}\u001f${col.device}\u001f${col.lab}`;
            const assign = assignmentMap.get(assignKey);
            const labSessions = sessionsByCell.get(`${learnerKey}\u001f${col.device}\u001f${col.lab}`) || [];
            const isAssigned = trainingAssignments.length === 0 ? true : Boolean(assign);
            const isCompleted = isAssigned && (Boolean(assign?.completed) || labSessions.some(s => s.status === 'Hoàn thành' || s.status === 'completed'));
            const attempts = labSessions.length;
            const attempted = attempts > 0;

            if (isAssigned) {
                ktvAssigned += 1;
                const stat = labStats.get(colKey);
                if (stat) stat.assigned += 1;
            }
            if (isCompleted) {
                ktvCompleted += 1;
                const stat = labStats.get(colKey);
                if (stat) stat.completed += 1;
            }
            if (attempted) {
                const stat = labStats.get(colKey);
                if (stat) {
                    stat.attempted += 1;
                    stat.attempts += attempts;
                }
            }
            ktvAttempts += attempts;
            totalClassAttempts += attempts;

            return {
                device: col.device,
                lab: col.lab,
                assigned: isAssigned,
                completed: isCompleted,
                attempts,
                lastSession: labSessions[labSessions.length - 1] || null
            };
        });

        const rate = ktvAssigned > 0 ? Math.round((ktvCompleted / ktvAssigned) * 100) : null;

        return {
            ...l,
            cells,
            completed: ktvCompleted,
            assigned: ktvAssigned,
            attempts: ktvAttempts,
            rate
        };
    });

    const totalAssignedAll = rows.reduce((s, r) => s + r.assigned, 0);
    const totalCompletedAll = rows.reduce((s, r) => s + r.completed, 0);
    const overallRate = totalAssignedAll > 0 ? Math.round((totalCompletedAll / totalAssignedAll) * 100) : 0;

    return {
        classes,
        selectedClass,
        allGroups,
        selectedGroups,
        columns,
        rows,
        filteredCount: rows.length,
        totalKtv: mappedLearners.length,
        totalSessions: totalClassAttempts,
        totalAssignedAll,
        totalCompletedAll,
        overallRate,
        labStats
    };
}

function renderClassMatrixReport() {
    const classSelect = document.getElementById('classMatrixClassSelect');
    const deviceSelect = document.getElementById('classMatrixDeviceSelect');
    const head = document.getElementById('classMatrixHead');
    const body = document.getElementById('classMatrixBody');
    const foot = document.getElementById('classMatrixFoot');
    const emptyEl = document.getElementById('classMatrixEmpty');
    const scrollEl = document.getElementById('classMatrixScroll');
    if (!head || !body || !foot) return;

    const data = getClassMatrixData();

    // Populate class select
    if (classSelect) {
        const optionsHtml = [
            `<option value="all">Tất cả lớp (${getInstructorLearners().length} KTV)</option>`,
            ...data.classes.map(c => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} · ${c.members.length} KTV</option>`)
        ].join('');
        if (classSelect.innerHTML !== optionsHtml) {
            classSelect.innerHTML = optionsHtml;
        }
        classSelect.value = state.classMatrixSelectedClass || 'all';
    }

    // Populate device select
    if (deviceSelect) {
        const deviceOptionsHtml = '<option value="">Tất cả thiết bị</option>' + data.allGroups
            .map(g => `<option value="${escapeHTML(g.device)}">${escapeHTML(g.device)}</option>`)
            .join('');
        if (deviceSelect.innerHTML !== deviceOptionsHtml) {
            deviceSelect.innerHTML = deviceOptionsHtml;
        }
        deviceSelect.value = state.classMatrixSelectedDevice || '';
    }

    // Update KPI summary cards
    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    setEl('classMatrixTotalSessions', formatNumber.format(data.totalSessions));
    setEl('classMatrixTotalKtvs', formatNumber.format(data.rows.length));
    setEl('classMatrixTotalLabs', formatNumber.format(data.columns.length));
    setEl('classMatrixCompletionRate', `${data.overallRate}%`);

    // Title
    const titleEl = document.getElementById('classMatrixTableTitle');
    if (titleEl) {
        const className = data.selectedClass?.name || 'Tất cả lớp học';
        titleEl.textContent = `Ma trận thực hành KTV — ${className}`;
    }

    if (!data.rows.length) {
        head.innerHTML = '';
        body.innerHTML = '';
        foot.innerHTML = '';
        if (scrollEl) scrollEl.hidden = true;
        if (emptyEl) {
            emptyEl.hidden = false;
            emptyEl.textContent = state.classMatrixSearch
                ? `Không tìm thấy KTV nào phù hợp với từ khóa "${state.classMatrixSearch}".`
                : 'Chưa có KTV trong lớp này.';
        }
        return;
    }

    if (scrollEl) scrollEl.hidden = false;
    if (emptyEl) emptyEl.hidden = true;

    // Render thead
    head.innerHTML = `
        <tr class="report-device-header-row">
            <th class="ktv-stt-head" scope="col" rowspan="2">STT</th>
            <th class="ktv-info-head" scope="col" rowspan="2">Kỹ thuật viên</th>
            ${data.selectedGroups.map((group, index) => `
                <th class="report-device-group report-device-tone-${index % 5}" scope="colgroup" colspan="${(group.labs || []).length}">
                    ${escapeHTML(group.device)}
                    <span>${(group.labs || []).length} bài lab</span>
                </th>
            `).join('')}
            <th class="ktv-total-head" scope="col" rowspan="2">Hoàn thành</th>
            <th class="ktv-rate-head" scope="col" rowspan="2">Tỷ lệ</th>
        </tr>
        <tr class="report-lab-header-row">
            ${data.columns.map(col => `
                <th class="report-lab-head report-device-tone-${col.groupIndex % 5} ${col.isFirst ? 'group-start' : ''} ${col.isLast ? 'group-end' : ''}" scope="col" title="${escapeHTML(`${col.device} • ${col.lab}`)}">
                    ${escapeHTML(col.lab)}
                </th>
            `).join('')}
        </tr>
    `;

    // Render tbody
    body.innerHTML = data.rows.map((row, index) => {
        const rateClass = row.rate === null ? 'report-cell-zero' : (row.rate >= 80 ? 'report-cell-high' : (row.rate >= 50 ? 'report-cell-medium' : 'report-cell-low'));
        return `
            <tr>
                <td class="ktv-stt-cell">${index + 1}</td>
                <th class="ktv-info-cell" scope="row" title="${escapeHTML(`${row.name} (${row.email})`)}">
                    <div class="ktv-info-wrap">
                        <div class="ktv-info-top">
                            <span class="ktv-info-name">${escapeHTML(row.name)}</span>
                            ${row.region ? `<span class="ktv-info-badge">${escapeHTML(row.region)}</span>` : ''}
                        </div>
                        <div class="ktv-info-meta">
                            ${row.code ? `<span class="ktv-info-code">${escapeHTML(row.code)}</span> • ` : ''}
                            <span>${escapeHTML(row.email)}</span>
                        </div>
                    </div>
                </th>
                ${row.cells.map(cell => {
                    if (!cell.assigned) {
                        return `<td class="report-metric-cell report-cell-zero" title="Bài lab chưa được giao"><strong>—</strong><span>Chưa giao</span></td>`;
                    }
                    if (cell.completed) {
                        const tooltip = `${row.name} • ${cell.device} • ${cell.lab}: Đã hoàn thành (${cell.attempts} lượt thực hành)`;
                        return `<td class="report-metric-cell report-cell-high" title="${escapeHTML(tooltip)}"><strong>1/1</strong><span>100% HT</span></td>`;
                    }
                    if (cell.attempts > 0) {
                        const tooltip = `${row.name} • ${cell.device} • ${cell.lab}: Đang làm / Chưa đạt (${cell.attempts} lượt thực hành)`;
                        return `<td class="report-metric-cell report-cell-low" title="${escapeHTML(tooltip)}"><strong>0/1</strong><span>0% HT</span></td>`;
                    }
                    const tooltip = `${row.name} • ${cell.device} • ${cell.lab}: Chưa thực hiện`;
                    return `<td class="report-metric-cell report-cell-zero" title="${escapeHTML(tooltip)}"><strong>0/1</strong><span>Chưa làm</span></td>`;
                }).join('')}
                <td class="ktv-total-cell ${rateClass}">
                    <strong>${row.completed}/${row.assigned}</strong>
                </td>
                <td class="ktv-rate-cell ${rateClass}">
                    ${row.rate === null ? '—' : `${row.rate}%`}
                </td>
            </tr>
        `;
    }).join('');

    // Render tfoot
    foot.innerHTML = `
        <tr>
            <th class="ktv-footer-label" scope="row" colspan="2">Tổng lớp (${data.rows.length} KTV)</th>
            ${data.columns.map(col => {
                const colKey = `${col.device}\u001f${col.lab}`;
                const stat = data.labStats.get(colKey) || { assigned: 0, completed: 0, attempts: 0 };
                const rate = stat.assigned > 0 ? Math.round((stat.completed / stat.assigned) * 100) : null;
                const cellClass = rate === null ? 'report-cell-zero' : (rate >= 80 ? 'report-cell-high' : (rate >= 50 ? 'report-cell-medium' : 'report-cell-low'));
                const tooltip = `${stat.completed}/${stat.assigned} KTV hoàn thành • ${stat.attempts} lượt thực hành`;
                if (!stat.assigned) {
                    return `<td class="report-metric-cell report-cell-zero ${col.isFirst ? 'group-start' : ''}" title="Chưa giao trong lớp này"><strong>—</strong><span>Chưa giao</span></td>`;
                }
                return `
                    <td class="report-metric-cell ${cellClass} ${col.isFirst ? 'group-start' : ''}" title="${escapeHTML(tooltip)}">
                        <strong>${stat.completed}/${stat.assigned}</strong>
                        <span>${rate}% HT</span>
                    </td>
                `;
            }).join('')}
            <td class="ktv-footer-total report-row-total">
                <strong>${data.totalCompletedAll}/${data.totalAssignedAll}</strong>
            </td>
            <td class="ktv-footer-rate report-grand-total">
                <strong>${data.overallRate}%</strong>
            </td>
        </tr>
    `;

    // Bind horizontal wheel scroll
    if (scrollEl && scrollEl.dataset.wheelBound !== 'true') {
        scrollEl.dataset.wheelBound = 'true';
        scrollEl.addEventListener('wheel', (event) => {
            if (!event.shiftKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
            event.preventDefault();
            scrollEl.scrollLeft += event.deltaY;
        }, { passive: false });
    }
}

function initClassMatrix() {
    document.getElementById('classMatrixClassSelect')?.addEventListener('change', (e) => {
        state.classMatrixSelectedClass = e.target.value;
        renderClassMatrixReport();
    });
    document.getElementById('classMatrixDeviceSelect')?.addEventListener('change', (e) => {
        state.classMatrixSelectedDevice = e.target.value;
        renderClassMatrixReport();
    });
    let searchDebounce;
    document.getElementById('classMatrixSearchInput')?.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            state.classMatrixSearch = e.target.value;
            renderClassMatrixReport();
        }, 200);
    });
    // Matrix view toggle buttons (tab switch between Region matrix & KTV Class matrix)
    document.querySelectorAll('[data-matrix-tab-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.dataset.matrixTabTarget;
            switchDashboardView(target);
        });
    });
}

function renderAll() {
    const dateSessions = getDateFilteredSessions();

    if (activeDashboardView === 'overview') {
        renderKpis();
        renderOverviewMonthlyTrend(sessions);
        updateRangeText(dateSessions);
    } else if (activeDashboardView === 'instructors') {
        renderInstructorClassProgress();
        renderRealtimeSubmissions(dateSessions);
        updateRangeText(dateSessions);
    } else if (activeDashboardView === 'analytics') {
        renderDetailedReport(dateSessions.filter(item => item.mode === 'Thực hành'));
    } else if (activeDashboardView === 'class_matrix') {
        renderClassMatrixReport();
    } else if (activeDashboardView === 'technicians') {
        renderSessions(sessions);
        renderLearnerDetail(sessions);
        updatePopoverTriggerLabels();
        updateRangeText(dateSessions);
    }
    renderSortMarks();
    enhanceHeaderFilterPopovers();
}

function updatePopoverTriggerLabels() {
    const allKtvs = [...new Set(sessions.map(item => item.learner))].sort();
    const allDevices = [...new Set(sessions.map(item => item.device))].sort();
    const allLabs = [...new Set(sessions.map(item => item.lab))].sort((a, b) => a.localeCompare(b, 'vi'));
    const allRegions = [...new Set(sessions.map(item => item.region))].sort((a, b) => a.localeCompare(b, 'vi'));
    const learnerReset = document.getElementById('learnerFilterReset');
    const selectedLearners = state.learnerSelectedKtvs.size;
    const ktvFiltered = selectedLearners !== allKtvs.length;
    const emailFiltered = state.learnerSelectedEmails.size !== allKtvs.length;
    const regionFiltered = state.learnerSelectedRegions.size !== allRegions.length;
    const deviceFiltered = state.learnerSelectedDevices.size !== allDevices.length;
    const labFiltered = state.learnerSelectedLabs.size !== allLabs.length;
    document.getElementById('learnerKtvPopoverWrapper')?.classList.toggle('has-filter', ktvFiltered);
    document.getElementById('learnerEmailPopoverWrapper')?.classList.toggle('has-filter', emailFiltered);
    document.getElementById('learnerRegionPopoverWrapper')?.classList.toggle('has-filter', regionFiltered);
    document.getElementById('learnerDevicePopoverWrapper')?.classList.toggle('has-filter', deviceFiltered);
    document.getElementById('learnerLabPopoverWrapper')?.classList.toggle('has-filter', labFiltered);
    if (learnerReset) learnerReset.hidden = !ktvFiltered && !emailFiltered && !regionFiltered && !deviceFiltered && !labFiltered && !state.learnerSearchKtv.trim();

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
                sortState.direction = ['total', 'lastDateTimeMs'].includes(button.dataset.key) ? 'desc' : 'asc';
            }
            if (button.dataset.table === 'sessions') state.learnerTablePage = 1;
            renderAll();
        });
    });
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
                trigger?.focus();
            }
            renderMonthGrid(year);
            renderAll();
            if (dashboardReport || sessions.length) reloadDashboardReport();
        };

        const renderMonthGrid = (year = Number(yearSelect?.value) || today.getFullYear()) => {
            if (!monthGrid) return;
            const selectedBounds = getMonthBounds(monthInput.value);
            monthGrid.innerHTML = Array.from({ length: 12 }, (_, monthIndex) => {
                const isFuture = year > today.getFullYear()
                    || (year === today.getFullYear() && monthIndex > today.getMonth());
                const isSelected = selectedBounds?.year === year && selectedBounds?.monthIndex === monthIndex;
                return `<button type="button" class="overview-month-option ${isSelected ? 'selected' : ''}" data-report-month="${monthIndex}" aria-label="Tháng ${monthIndex + 1} năm ${year}" aria-pressed="${isSelected ? 'true' : 'false'}" ${isFuture ? 'disabled' : ''}>Th ${monthIndex + 1}</button>`;
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
                window.requestAnimationFrame(() => {
                    const selectedMonth = monthGrid?.querySelector('[aria-pressed="true"]');
                    if (selectedMonth) selectedMonth.focus();
                    else yearSelect?.focus();
                });
            }
        });
        panel?.addEventListener('click', event => event.stopPropagation());
        panel?.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                panel.classList.remove('open');
                trigger?.setAttribute('aria-expanded', 'false');
                trigger?.focus();
                return;
            }
            trapDialogFocus(event, panel);
        });
        currentMonthButton?.addEventListener('click', () => applySelectedMonth(today.getFullYear(), today.getMonth()));
        document.addEventListener('click', () => {
            panel?.classList.remove('open');
            trigger?.setAttribute('aria-expanded', 'false');
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && panel?.classList.contains('open')) {
                event.preventDefault();
                panel?.classList.remove('open');
                trigger?.setAttribute('aria-expanded', 'false');
                trigger?.focus();
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
        if (dashboardReport || sessions.length) reloadDashboardReport();
    });

    document.getElementById('dateRangeClear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowClear = new Date();
        const first = new Date(nowClear.getFullYear(), nowClear.getMonth(), 1);
        const last = new Date(nowClear.getFullYear(), nowClear.getMonth() + 1, 0);
        state.tempStartDate = fmtDate(first);
        state.tempEndDate = fmtDate(last);
        state.startDate = fmtDate(first);
        state.endDate = fmtDate(last);
        state.learnerTablePage = 1;
        state.learnerDetailPage = 1;
        state.realtimePage = 1;
        picker?.classList.remove('open');
        renderCalendar();
        renderAll();
        if (dashboardReport || sessions.length) reloadDashboardReport();
    });

    document.addEventListener('click', (event) => {
        if (picker && !picker.contains(event.target)) picker.classList.remove('open');
    });
}

const REPORT_EXPORT_TEMPLATE_VERSION = 'FTC-XLSX-1.0';
const REPORT_EXPORT_DEFAULT_BY_VIEW = {
    overview: 'activity',
    technicians: 'activity',
    analytics: 'region',
    instructors: 'class_matrix',
    class_matrix: 'class_matrix',
    roster: 'roster'
};

function getDefaultReportExportType() {
    return REPORT_EXPORT_DEFAULT_BY_VIEW[activeDashboardView] || 'activity';
}

function normalizeReportFilenamePart(value, fallback = 'bao_cao') {
    const normalized = String(value || '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_')
        .slice(0, 72);
    return normalized || fallback;
}

function buildReportFilename(prefix, scope = '') {
    const timestamp = new Date();
    const timePart = `${String(timestamp.getHours()).padStart(2, '0')}${String(timestamp.getMinutes()).padStart(2, '0')}`;
    const safePrefix = normalizeReportFilenamePart(prefix, 'FTC_Bao_cao');
    const safeScope = scope ? `_${normalizeReportFilenamePart(scope, '')}` : '';
    return `${safePrefix}${safeScope}_${fmtDate(timestamp)}_${timePart}.xlsx`;
}

function triggerReportDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function buildReportExportPayload(type, descriptor) {
    const base = {
        type,
        version: REPORT_EXPORT_TEMPLATE_VERSION,
        filename: descriptor.filename,
        period: descriptor.period,
        scope: descriptor.scope
    };
    if (type === 'roster') {
        return {
            ...base,
            filters: {
                status: state.rosterStatusFilter || 'active',
                search: state.rosterSearch.trim()
            }
        };
    }
    if (!Array.isArray(descriptor.rows) || !descriptor.rows.length) {
        throw new Error('Không có dữ liệu phù hợp để xuất báo cáo.');
    }
    if (!Array.isArray(descriptor.headers) || !descriptor.headers.length) {
        throw new Error('Báo cáo chưa có cột dữ liệu để xuất.');
    }
    return {
        ...base,
        metadata: descriptor.metadata || [],
        headers: descriptor.headers,
        columnTypes: descriptor.columnTypes || descriptor.headers.map(() => 'text'),
        rows: descriptor.rows
    };
}

async function downloadXlsxReport(type, descriptor) {
    const response = await fetch(`${API_BASE_URL}/reports/export`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildReportExportPayload(type, descriptor))
    });
    if (!response.ok) throw new Error(await getReportResponseError(response));

    const blob = await response.blob();
    if (!blob.size) throw new Error('Máy chủ trả về file Excel rỗng.');
    const signature = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    if (signature.length !== 4 || signature[0] !== 0x50 || signature[1] !== 0x4B
        || signature[2] !== 0x03 || signature[3] !== 0x04) {
        throw new Error('File tải về không phải là workbook Excel hợp lệ.');
    }

    const filename = getResponseDownloadFilename(response, descriptor.filename);
    triggerReportDownload(blob, filename);
    return filename;
}

function getTechnicianFilteredExportRows() {
    let rows = [...sessions];
    const applySetFilter = (set, touched, getValue) => {
        if (!touched && !set.size) return;
        rows = rows.filter(item => set.has(getValue(item)));
    };
    applySetFilter(state.learnerSelectedKtvs, state.learnerKtvsTouched, item => item.learner);
    applySetFilter(state.learnerSelectedEmails, state.learnerEmailsTouched, item => item.learner);
    applySetFilter(state.learnerSelectedRegions, state.learnerRegionsTouched, item => item.region);
    applySetFilter(state.learnerSelectedDevices, state.learnerDevicesTouched, item => item.device);
    applySetFilter(state.learnerSelectedLabs, state.learnerLabsTouched, item => item.lab);
    const keyword = state.learnerSearchKtv.trim().toLocaleLowerCase('vi');
    if (keyword) {
        rows = rows.filter(item => `${getLearnerName(item.learner)} ${item.learner}`.toLocaleLowerCase('vi').includes(keyword));
    }
    return rows;
}

function buildActivityReportDescriptor() {
    const sourceRows = activeDashboardView === 'technicians'
        ? getTechnicianFilteredExportRows()
        : getDateFilteredSessions();
    const orderedRows = [...sourceRows].sort((left, right) => sessionTimestampMs(right) - sessionTimestampMs(left));
    const period = activeDashboardView === 'technicians' ? 'Dữ liệu lũy kế' : getRangeLabel();
    const scope = activeDashboardView === 'technicians'
        ? 'Các bộ lọc đang áp dụng tại trang Thống kê kỹ thuật viên'
        : 'Tất cả phiên hoạt động trong kỳ đã chọn';
    return {
        type: 'activity',
        title: 'FTC - BÁO CÁO CHI TIẾT HOẠT ĐỘNG KTV',
        period,
        scope,
        filename: buildReportFilename('FTC_Chi_tiet_hoat_dong_KTV'),
        countLabel: `${formatNumber.format(orderedRows.length)} phiên hoạt động`,
        available: orderedRows.length > 0,
        metadata: [
            ['Quy ước thời lượng', 'Giây và định dạng đọc nhanh'],
            ['Thứ tự dữ liệu', 'Mới nhất đến cũ nhất']
        ],
        headers: [
            'STT', 'Ngày', 'Giờ', 'Mã phiên', 'Mã NV', 'Họ và tên', 'Email', 'Vị trí',
            'Khu vực/CNx', 'Chi nhánh', 'Đơn vị', 'Lớp', 'Thiết bị', 'Bài lab', 'Kỹ năng',
            'Chế độ', 'Trạng thái', 'Kết quả', 'Hoàn thành lần đầu', 'Thời lượng (giây)',
            'Thời lượng', 'Hành động cuối'
        ],
        columnTypes: [
            'integer', 'date', 'time', 'text', 'text', 'text', 'text', 'text',
            'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text',
            'text', 'text', 'text', 'integer', 'text', 'text'
        ],
        rows: orderedRows.map((row, index) => {
            const technician = technicianByIdentity.get(String(row.learner || '').trim().toLowerCase())
                || technicianByIdentity.get(String(row.technicianId || '').trim().toLowerCase());
            const email = technician?.email || (String(row.learner || '').includes('@') ? row.learner : '');
            return [
                index + 1,
                row.date || '',
                row.time || '',
                row.sessionId || '',
                technician?.employeeId || row.technicianId || '',
                technician?.displayName || row.technicianName || getLearnerName(row.learner),
                email,
                technician?.jobTitle || row.jobTitle || '',
                technician?.dashboardRegion || row.region || '',
                technician?.branchName || row.branchName || '',
                technician?.unitName || row.unitName || row.unitCode || '',
                technician?.className || technician?.classCode || row.classCode || '',
                row.device || '',
                row.lab || '',
                row.skill || '',
                row.mode || '',
                row.status || '',
                row.isPassed === true ? 'Đạt' : (row.isPassed === false ? 'Không đạt' : ''),
                row.firstTry === true ? 'Có' : (row.firstTry === false ? 'Không' : ''),
                row.duration ?? '',
                row.duration === null || row.duration === undefined ? '' : formatDuration(row.duration),
                row.lastAction || ''
            ];
        })
    };
}

function formatAuthoritativeRegionMetric(cell = {}) {
    const assigned = Number(cell.assigned_count) || 0;
    if (!assigned) return '—';
    const completed = Number(cell.completed_count) || 0;
    const attempts = Number(cell.attempt_count) || 0;
    const rate = cell.completion_rate === null || cell.completion_rate === undefined
        ? Math.round((completed / assigned) * 100)
        : Number(cell.completion_rate);
    return `${completed}/${assigned} (${rate}%) · ${attempts} lượt`;
}

function buildAuthoritativeRegionReportDescriptor(matrix) {
    const groups = matrix.device_groups || [];
    const columns = groups.flatMap(group => (group.labs || []).map(lab => ({
        device: group.device?.name || group.device?.device_name || group.device_name || '',
        lab: lab.name || lab.lab_name || '',
        labId: lab.lab_id || ''
    })));
    const rows = (matrix.rows || []).map((row, index) => {
        const region = row.region || {};
        const regionName = region.name || region.region_name || region.code || region.region_code || '';
        const location = region.branch_name ? `${region.branch_name} · ${regionName}` : regionName;
        return [
            index + 1,
            location,
            ...columns.map(column => formatAuthoritativeRegionMetric(row.cells?.[column.labId])),
            formatAuthoritativeRegionMetric(row.total)
        ];
    });
    return {
        type: 'region',
        title: 'FTC - BÁO CÁO TIẾN ĐỘ THỰC HÀNH THEO CHI NHÁNH',
        period: dashboardReport?.meta?.period?.label || getRangeLabel(),
        scope: 'Ma trận Khu vực/CNx theo thiết bị và bài lab',
        filename: buildReportFilename('FTC_Tien_do_theo_chi_nhanh'),
        countLabel: `${formatNumber.format(rows.length)} khu vực · ${formatNumber.format(columns.length)} bài lab`,
        available: rows.length > 0 && columns.length > 0,
        metadata: [['Quy ước ô dữ liệu', 'Hoàn thành/phạm vi (tỷ lệ) · lượt thực hành']],
        headers: ['STT', 'Khu vực/CNx', ...columns.map(column => `${column.device} - ${column.lab}`), 'Tổng khu vực'],
        columnTypes: ['integer', 'text', ...columns.map(() => 'text'), 'text'],
        rows
    };
}

function formatLocalRegionMetric(cell) {
    if (!cell?.eligible) return '—';
    if (!cell.attempts) return `0/${cell.eligible} (0%) · 0 lượt`;
    return `${cell.completed}/${cell.eligible} (${cell.rate ?? 0}%) · ${cell.attempts} lượt`;
}

function buildRegionReportDescriptor() {
    if (dashboardReport?.matrix) return buildAuthoritativeRegionReportDescriptor(dashboardReport.matrix);
    const sourceRows = getDateFilteredSessions().filter(item => item.mode === 'Thực hành');
    const groups = getDetailReportDeviceGroups(sourceRows);
    const columns = groups.flatMap(group => group.labs.map(lab => ({ device: group.device, lab })));
    const index = buildDetailReportIndex(sourceRows);
    const regionNames = [...new Set([
        ...REGION_FILTER_OPTIONS,
        ...sourceRows.map(item => item.region).filter(Boolean)
    ])];
    const rows = regionNames.map((region, rowIndex) => {
        const regionKeys = [region];
        const total = getDetailReportTotal(index, regionKeys, columns);
        return [
            rowIndex + 1,
            region,
            ...columns.map(column => formatLocalRegionMetric(getDetailReportCell(index, regionKeys, column))),
            formatLocalRegionMetric(total)
        ];
    });
    return {
        type: 'region',
        title: 'FTC - BÁO CÁO TIẾN ĐỘ THỰC HÀNH THEO CHI NHÁNH',
        period: getRangeLabel(),
        scope: 'Ma trận Khu vực/CNx theo thiết bị và bài lab',
        filename: buildReportFilename('FTC_Tien_do_theo_chi_nhanh'),
        countLabel: `${formatNumber.format(rows.length)} khu vực · ${formatNumber.format(columns.length)} bài lab`,
        available: rows.length > 0 && columns.length > 0,
        metadata: [
            ['Quy ước ô dữ liệu', 'Hoàn thành/phạm vi (tỷ lệ) · lượt thực hành'],
            ['Nguồn phạm vi', 'Danh mục KTV đang hoạt động và danh mục bài lab']
        ],
        headers: ['STT', 'Khu vực/CNx', ...columns.map(column => `${column.device} - ${column.lab}`), 'Tổng khu vực'],
        columnTypes: ['integer', 'text', ...columns.map(() => 'text'), 'text'],
        rows
    };
}

function buildClassMatrixReportDescriptor() {
    const data = getClassMatrixData();
    const classLabel = data.selectedClass?.name || (state.classMatrixSelectedClass === 'all' ? 'Tất cả lớp' : 'Chưa xếp lớp');
    const deviceLabel = state.classMatrixSelectedDevice || 'Tất cả thiết bị';
    const searchLabel = state.classMatrixSearch.trim() ? ` · Tìm kiếm: “${state.classMatrixSearch.trim()}”` : '';
    const scope = `${classLabel} · ${deviceLabel}${searchLabel}`;
    return {
        type: 'class_matrix',
        title: 'FTC - BÁO CÁO TIẾN ĐỘ KTV THEO LỚP',
        period: 'Dữ liệu lũy kế',
        scope,
        filename: buildReportFilename('FTC_Tien_do_KTV_theo_lop', classLabel),
        countLabel: `${formatNumber.format(data.rows.length)} KTV · ${formatNumber.format(data.columns.length)} bài lab`,
        available: data.rows.length > 0 && data.columns.length > 0,
        metadata: [
            ['Lớp học', classLabel],
            ['Thiết bị', deviceLabel],
            ['Tiến độ tổng', `${data.totalCompletedAll}/${data.totalAssignedAll} (${data.overallRate}%)`],
            ['Tổng lượt thực hành', data.totalSessions],
            ['Quy ước trạng thái', 'Hoàn thành · Đang thực hiện · Chưa thực hiện · Ngoài phạm vi']
        ],
        headers: [
            'STT', 'Mã NV', 'Họ và tên', 'Email', 'Khu vực/CNx', 'Lớp học',
            ...data.columns.map(column => `${column.device} - ${column.lab}`),
            'Bài hoàn thành', 'Bài trong phạm vi', 'Tỷ lệ hoàn thành (%)', 'Lượt thực hành'
        ],
        columnTypes: [
            'integer', 'text', 'text', 'text', 'text', 'text',
            ...data.columns.map(() => 'text'),
            'integer', 'integer', 'percent', 'integer'
        ],
        rows: data.rows.map((row, index) => [
            index + 1,
            row.code || '',
            row.name || '',
            row.email || '',
            row.region || '',
            row.className || row.classCode || classLabel,
            ...row.cells.map(cell => {
                if (!cell.assigned) return 'Ngoài phạm vi';
                if (cell.completed) return cell.attempts ? `Hoàn thành · ${cell.attempts} lượt` : 'Hoàn thành';
                if (cell.attempts > 0) return `Đang thực hiện · ${cell.attempts} lượt`;
                return 'Chưa thực hiện';
            }),
            row.completed,
            row.assigned,
            row.rate === null || row.rate === undefined ? '' : row.rate / 100,
            row.attempts
        ])
    };
}

function getRosterExportScope() {
    const statusLabels = { active: 'Đang làm', terminated: 'Đã nghỉ', all: 'Tất cả trạng thái' };
    const status = statusLabels[state.rosterStatusFilter] || 'Đang làm';
    const keyword = state.rosterSearch.trim();
    return keyword ? `${status} · Tìm kiếm: “${keyword}”` : status;
}

function getRosterReportPreview() {
    return {
        type: 'roster',
        period: 'Tại thời điểm xuất',
        scope: getRosterExportScope(),
        filename: buildReportFilename('FTC_Danh_sach_KTV'),
        countLabel: state.rosterLoaded ? `${formatNumber.format(state.rosterTotal)} hồ sơ KTV` : 'Toàn bộ kết quả phù hợp',
        available: true
    };
}

function getReportExportPreview(type) {
    if (type === 'region') return buildRegionReportDescriptor();
    if (type === 'class_matrix') return buildClassMatrixReportDescriptor();
    if (type === 'roster') return getRosterReportPreview();
    return buildActivityReportDescriptor();
}

async function ensureTrainingAssignmentsLoaded({ force = false } = {}) {
    if (state.assignmentsLoaded && !force) return trainingAssignments;
    // Empty assignments intentionally activates the catalog-based calculation:
    // every active lab is assigned and completion is derived from session data.
    trainingAssignments = [];
    state.assignmentsLoaded = true;
    initializeInstructorClasses();
    if (['instructors', 'class_matrix', 'analytics'].includes(activeDashboardView)) renderAll();
    return trainingAssignments;
}

async function refreshAssignmentsForClassExport() {
    return ensureTrainingAssignmentsLoaded({ force: true });
}

function getResponseDownloadFilename(response, fallback) {
    const disposition = response.headers.get('Content-Disposition') || '';
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match) {
        try { return decodeURIComponent(utf8Match[1]); } catch (error) { /* use fallback below */ }
    }
    const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
    return plainMatch?.[1] || fallback;
}

async function getReportResponseError(response) {
    const payload = await response.clone().json().catch(() => null);
    return payload?.error?.message || payload?.message || `Yêu cầu xuất báo cáo thất bại (HTTP ${response.status}).`;
}

function getSelectedReportExportType() {
    return document.querySelector('input[name="reportExportType"]:checked')?.value || getDefaultReportExportType();
}

function setReportExportStatus(message = '', type = 'info') {
    const status = document.getElementById('reportExportStatus');
    if (!status) return;
    status.hidden = !message;
    status.textContent = message;
    status.classList.toggle('is-error', type === 'error');
    status.classList.toggle('is-info', type === 'info');
}

function setReportExportBusy(busy) {
    reportExportBusy = busy;
    const download = document.getElementById('reportExportDownload');
    const close = document.getElementById('reportExportClose');
    const cancel = document.getElementById('reportExportCancel');
    document.querySelectorAll('input[name="reportExportType"]').forEach(input => { input.disabled = busy; });
    document.querySelectorAll('.report-export-option').forEach(option => option.classList.toggle('is-disabled', busy));
    if (download) {
        download.disabled = busy;
        download.classList.toggle('is-busy', busy);
        const label = download.querySelector('span');
        if (label) label.textContent = busy ? 'Đang tạo file…' : 'Tải báo cáo';
    }
    if (close) close.disabled = busy;
    if (cancel) cancel.disabled = busy;
}

function updateReportExportDialog() {
    const type = getSelectedReportExportType();
    document.querySelectorAll('.report-export-option').forEach(option => {
        option.classList.toggle('is-selected', option.dataset.reportOption === type);
    });
    let preview;
    try {
        preview = getReportExportPreview(type);
    } catch (error) {
        preview = { period: '—', scope: 'Không thể đọc bộ lọc hiện tại', countLabel: 'Không có dữ liệu', filename: 'FTC_Bao_cao.xlsx', available: false };
    }
    const values = {
        reportExportPeriod: preview.period,
        reportExportScope: preview.scope,
        reportExportCount: preview.countLabel,
        reportExportFilename: preview.filename
    };
    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value || '—';
    });
    const download = document.getElementById('reportExportDownload');
    if (download && !reportExportBusy) download.disabled = preview.available === false;
}

function openReportExportDialog() {
    if (!ensureReportExportAllowed()) return;
    const backdrop = document.getElementById('reportExportBackdrop');
    if (!backdrop) return;
    reportExportReturnFocus = document.activeElement;
    const defaultType = getDefaultReportExportType();
    const input = document.querySelector(`input[name="reportExportType"][value="${defaultType}"]`)
        || document.querySelector('input[name="reportExportType"]');
    if (input) input.checked = true;
    setReportExportStatus();
    setReportExportBusy(false);
    updateReportExportDialog();
    backdrop.hidden = false;
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('report-export-open');
    window.setTimeout(() => document.getElementById('reportExportClose')?.focus(), 0);
}

function closeReportExportDialog() {
    if (reportExportBusy) return;
    const backdrop = document.getElementById('reportExportBackdrop');
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('report-export-open');
    if (reportExportReturnFocus instanceof HTMLElement) reportExportReturnFocus.focus();
    reportExportReturnFocus = null;
}

async function handleReportExportDownload() {
    if (reportExportBusy || !ensureReportExportAllowed()) return;
    const type = getSelectedReportExportType();
    setReportExportBusy(true);
    setReportExportStatus(type === 'class_matrix' ? 'Đang đồng bộ dữ liệu lớp mới nhất…' : 'Đang chuẩn bị file báo cáo…', 'info');
    try {
        if (type === 'class_matrix') await refreshAssignmentsForClassExport();
        const descriptor = getReportExportPreview(type);
        const filename = await downloadXlsxReport(type, descriptor);
        setReportExportStatus(`Đã tạo “${filename}”. Trình duyệt đang tải file xuống.`, 'success');
    } catch (error) {
        console.error('Không thể xuất báo cáo.', error);
        setReportExportStatus(error?.message || 'Không thể tạo báo cáo. Vui lòng thử lại.', 'error');
    } finally {
        setReportExportBusy(false);
        updateReportExportDialog();
    }
}

function initReportExport() {
    document.getElementById('exportBtn')?.addEventListener('click', openReportExportDialog);
    document.getElementById('reportExportClose')?.addEventListener('click', closeReportExportDialog);
    document.getElementById('reportExportCancel')?.addEventListener('click', closeReportExportDialog);
    document.getElementById('reportExportDownload')?.addEventListener('click', handleReportExportDownload);
    document.querySelectorAll('input[name="reportExportType"]').forEach(input => {
        input.addEventListener('change', () => {
            setReportExportStatus();
            updateReportExportDialog();
        });
    });
    document.getElementById('reportExportBackdrop')?.addEventListener('click', event => {
        if (event.target === event.currentTarget) closeReportExportDialog();
    });
    document.addEventListener('keydown', event => {
        const backdrop = document.getElementById('reportExportBackdrop');
        if (backdrop?.hidden) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeReportExportDialog();
            return;
        }
        trapDialogFocus(event, backdrop.querySelector('.report-export-dialog'));
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
        <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
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
            <button type="button" class="legend-item" data-device="${escapeHTML(item.name)}" title="Mở chi tiết bài làm">
                <div class="legend-label-group">
                    <span class="legend-dot" style="background: ${color};"></span>
                    <span class="legend-name">${escapeHTML(item.name)}</span>
                </div>
                <span class="legend-val">${item.sessions} bài (${percent}%)</span>
            </button>
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

    deviceSubModalReturnFocus = document.activeElement;
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
        const isActive = btn.dataset.subFilter === 'all';
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    renderSubModalLabList('all');

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => document.getElementById('subModalClose')?.focus(), 0);
}

function closeDeviceSubModal() {
    const modal = document.getElementById('deviceSubModal');
    if (!modal?.classList.contains('visible')) return;
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    currentSubModalData = { deviceName: '', allLabsList: [], activeFilter: 'all' };
    document.getElementById('subModalLabList')?.replaceChildren();
    if (deviceSubModalReturnFocus instanceof HTMLElement) deviceSubModalReturnFocus.focus();
    deviceSubModalReturnFocus = null;
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
        closeBtn.addEventListener('click', closeDeviceSubModal);
    }

    document.querySelectorAll('.sub-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sub-filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            const filter = btn.dataset.subFilter;
            renderSubModalLabList(filter);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (!modal?.classList.contains('visible')) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDeviceSubModal();
            return;
        }
        trapDialogFocus(event, modal.querySelector('.sub-modal-card'));
    });
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            event.stopPropagation();
            closeDeviceSubModal();
        }
    });
}

function initEvents() {
    els.learnerDetailClose?.addEventListener('click', () => {
        hideLearnerDetail();
        renderAll();
    });

    document.addEventListener('keydown', (event) => {
        if (event.defaultPrevented || !document.body.classList.contains('detail-open')) return;
        if (document.getElementById('deviceSubModal')?.classList.contains('visible')) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            hideLearnerDetail();
            renderAll();
            return;
        }
        trapDialogFocus(event, els.learnerDetailCard);
    });

    document.addEventListener('click', (event) => {
        if (!document.body.classList.contains('detail-open')) return;
        const path = event.composedPath();
        const insideCard = path.some(el => el.classList?.contains('learner-detail-card') || el.classList?.contains('sub-modal-backdrop') || el.classList?.contains('sub-modal-card') || el.getAttribute?.('data-learner'));
        if (insideCard) return;
        hideLearnerDetail();
        renderAll();
    });
}

function populatePopoverOptions(containerId, values, selectedSet, onCheckChange, searchVal = '', labelFn = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const labelOf = (val) => (labelFn ? labelFn(val) : val);
    const filteredValues = searchVal
        ? values.filter(v => String(labelOf(v)).toLowerCase().includes(searchVal.toLowerCase()))
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
                <span>${escapeHTML(labelOf(val))}</span>
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
            if (!suppressFilterRender) {
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

    const evaluatedCompletions = rows.filter(item => item.status === 'Hoàn thành' && item.firstTry !== null);
    const firstTryCount = evaluatedCompletions.filter(item => item.firstTry).length;
    const firstTryRate = evaluatedCompletions.length ? Math.round((firstTryCount / evaluatedCompletions.length) * 100) : null;

    const durationRows = rows.filter(item => Number(item.duration) > 0);
    const totalDuration = durationRows.reduce((sum, item) => sum + Number(item.duration), 0);
    const avgDuration = durationRows.length ? Math.round(totalDuration / durationRows.length) : null;

    return {
        totalSessions,
        learners,
        completed,
        rate,
        firstTryRate,
        evaluatedFirstTry: evaluatedCompletions.length,
        avgDuration
    };
}

const DASHBOARD_VIEWS = {
    overview: {
        eyebrow: 'Tổng quan vận hành',
        title: 'Dashboard giám sát thực hành KTV',
        subtitle: 'Theo dõi hoạt động, tiến độ và chất lượng thực hành'
    },
    instructors: {
        eyebrow: 'Không gian giảng viên',
        title: 'Không gian theo dõi dành cho giảng viên',
        subtitle: 'Theo dõi bài nộp và trạng thái thực hành của KTV'
    },
    analytics: {
        eyebrow: 'Báo cáo vận hành',
        title: 'Báo cáo chi nhánh',
        subtitle: 'Ma trận thiết bị và bài lab theo từng Khu vực/CNx'
    },
    class_matrix: {
        eyebrow: 'Báo cáo đào tạo',
        title: 'Báo cáo KTV theo lớp',
        subtitle: 'Ma trận tiến độ thực hành bài lab theo từng Kỹ thuật viên'
    },
    technicians: {
        eyebrow: 'Hiệu suất kỹ thuật viên',
        title: 'Thống kê kỹ thuật viên',
        subtitle: 'Tra cứu lịch sử, thiết bị và kết quả thực hành theo KTV'
    },
    roster: {
        eyebrow: 'Quản trị nhân sự',
        title: 'Quản lý KTV',
        subtitle: 'Import, theo dõi và quản lý danh sách kỹ thuật viên'
    },
};

let activeDashboardView = 'overview';

function switchDashboardView(viewName, { updateHistory = true, focusHeading = true } = {}) {
    if (!Object.hasOwn(DASHBOARD_VIEWS, viewName)) return;
    document.querySelectorAll('.header-filter-popover.open').forEach(wrapper => closeHeaderFilterPopover(wrapper));
    activeDashboardView = viewName;
    if (updateHistory) {
        const url = new URL(window.location.href);
        if (url.searchParams.get('view') !== viewName) {
            url.searchParams.set('view', viewName);
            window.history.pushState({}, '', url.toString());
        }
    }

    const masterContainer = document.querySelector('.dashboard-master-container');
    const masterViews = new Set(['overview', 'instructors', 'analytics', 'class_matrix']);
    if (masterContainer) masterContainer.hidden = !masterViews.has(activeDashboardView);

    document.querySelectorAll('.dashboard-page-view').forEach(section => {
        section.hidden = section.dataset.pageView !== activeDashboardView;
    });

    const viewCopy = DASHBOARD_VIEWS[activeDashboardView];
    const eyebrow = document.getElementById('pageEyebrow');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');
    if (eyebrow) eyebrow.textContent = viewCopy.eyebrow;
    if (title) title.textContent = viewCopy.title;
    if (subtitle) subtitle.textContent = viewCopy.subtitle;
    document.title = `${viewCopy.title} | FTC`;

    document.querySelectorAll('.sidebar-link[data-dashboard-view]').forEach(link => {
        const isActive = link.dataset.dashboardView === activeDashboardView;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    // Update matrix tab toggle buttons active state
    document.querySelectorAll('[data-matrix-tab-target]').forEach(btn => {
        const isActive = btn.dataset.matrixTabTarget === activeDashboardView;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    renderAll();
    if (activeDashboardView === 'roster') {
        setDataSourceLabel('Hồ sơ KTV từ cơ sở dữ liệu');
        if (!state.rosterLoaded) loadRosterList();
    } else if (activeDashboardView !== 'roster' && state.isAdmin) {
        setDataSourceLabel(state.dashboardDataLoaded ? 'Dữ liệu vận hành đã đồng bộ' : 'Đang đồng bộ dữ liệu vận hành');
        if (!state.dashboardDataLoaded) {
            loadDashboardFromApi().then(() => {
                if (['instructors', 'class_matrix', 'analytics'].includes(activeDashboardView) && !state.assignmentsLoaded) {
                    ensureTrainingAssignmentsLoaded().catch(error => {
                        console.warn('Không đồng bộ được tiến độ lớp.', error);
                        showToast('Chưa thể đồng bộ dữ liệu tiến độ lớp.', 'error');
                    });
                }
            });
        } else if (['instructors', 'class_matrix', 'analytics'].includes(activeDashboardView) && !state.assignmentsLoaded) {
            ensureTrainingAssignmentsLoaded().catch(error => {
                console.warn('Không đồng bộ được tiến độ lớp.', error);
                showToast('Chưa thể đồng bộ dữ liệu tiến độ lớp.', 'error');
            });
        }
    }
    if (focusHeading) window.requestAnimationFrame(() => document.getElementById('pageTitle')?.focus({ preventScroll: true }));
}

function initDashboardViewRouting() {
    let requestedView = new URLSearchParams(window.location.search).get('view') || 'overview';
    if (requestedView === 'instructors') requestedView = 'class_matrix';
    activeDashboardView = Object.hasOwn(DASHBOARD_VIEWS, requestedView) ? requestedView : 'overview';

    const masterContainer = document.querySelector('.dashboard-master-container');
    const masterViews = new Set(['overview', 'analytics', 'class_matrix']);
    if (masterContainer) masterContainer.hidden = !masterViews.has(activeDashboardView);

    document.querySelectorAll('.dashboard-page-view').forEach(section => {
        section.hidden = section.dataset.pageView !== activeDashboardView;
    });

    const viewCopy = DASHBOARD_VIEWS[activeDashboardView];
    const eyebrow = document.getElementById('pageEyebrow');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');
    if (eyebrow) eyebrow.textContent = viewCopy.eyebrow;
    if (title) title.textContent = viewCopy.title;
    if (subtitle) subtitle.textContent = viewCopy.subtitle;
    document.title = `${viewCopy.title} | FTC`;

    document.querySelectorAll('.sidebar-link[data-dashboard-view]').forEach(link => {
        const isActive = link.dataset.dashboardView === activeDashboardView;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.dashboardView;
            if (view) switchDashboardView(view);
        });
    });

    document.querySelectorAll('[data-matrix-tab-target]').forEach(btn => {
        const isActive = btn.dataset.matrixTabTarget === activeDashboardView;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    window.addEventListener('popstate', () => {
        const currentView = new URLSearchParams(window.location.search).get('view') || 'overview';
        if (Object.hasOwn(DASHBOARD_VIEWS, currentView) && currentView !== activeDashboardView) {
            switchDashboardView(currentView, { updateHistory: false, focusHeading: true });
        }
    });
}

function initSidebarNavigation() {
    const page = document.getElementById('appPage');
    const toggle = document.getElementById('sidebarToggle');

    const prefersCollapsed = safeStorageGet('ftc-dashboard-sidebar-collapsed') === 'true';
    if (prefersCollapsed && window.matchMedia('(min-width: 961px)').matches) {
        page?.classList.add('sidebar-collapsed');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Mở rộng thanh điều hướng');
    }

    toggle?.addEventListener('click', () => {
        const collapsed = page?.classList.toggle('sidebar-collapsed') || false;
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute('aria-label', collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng');
        safeStorageSet('ftc-dashboard-sidebar-collapsed', String(collapsed));
    });
}

function initDashboardExperience() {
    document.getElementById('refreshDashboardBtn')?.addEventListener('click', async () => {
        if (activeDashboardView === 'roster') {
            setRefreshButtonBusy(true);
            const succeeded = await loadRosterList();
            if (state.rosterTab === 'history') await loadRosterHistory();
            setRefreshButtonBusy(false);
            showToast(succeeded ? 'Danh sách KTV đã được cập nhật.' : 'Không thể làm mới danh sách KTV.', succeeded ? 'success' : 'error');
            return;
        }
        if (!state.dashboardDataLoaded) {
            const succeeded = await loadDashboardFromApi();
            showToast(succeeded ? 'Dashboard đã được cập nhật.' : 'Không thể tải dữ liệu dashboard.', succeeded ? 'success' : 'error');
            return;
        }
        await refreshDashboardData({ force: true, announce: true });
    });

    window.addEventListener('offline', () => {
        setDashboardSyncState('offline', state.lastSuccessfulRefreshAt
            ? formatDashboardSyncDetail(state.lastSuccessfulRefreshAt)
            : 'Thiết bị đang ngoại tuyến');
    });
    window.addEventListener('online', () => {
        setDashboardSyncState('syncing', 'Đã có kết nối, đang đồng bộ lại');
        if (activeDashboardView === 'roster') loadRosterList();
        else if (state.dashboardDataLoaded) refreshDashboardData({ force: true });
        else if (state.isAdmin) loadDashboardFromApi();
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && state.dashboardDataLoaded && activeDashboardView !== 'roster') refreshDashboardData();
    });
}

/* ============================================================
   Roster (Quản lý KTV) — Admin
   ============================================================ */

function activateRosterTab(tabName, { focus = false } = {}) {
    state.rosterTab = tabName;
    const tabs = [...document.querySelectorAll('[data-roster-tab]')];
    tabs.forEach(tab => {
        const isActive = tab.dataset.rosterTab === tabName;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focus) tab.focus();
    });
    const panels = {
        list: document.getElementById('rosterListPanel'),
        import: document.getElementById('rosterImportPanel'),
        history: document.getElementById('rosterHistoryPanel')
    };
    Object.entries(panels).forEach(([name, panel]) => {
        if (panel) panel.hidden = name !== tabName;
    });
    if (tabName === 'list' && !state.rosterLoaded) loadRosterList();
    if (tabName === 'history' && !state.rosterHistoryLoaded) loadRosterHistory();
}

function initRoster() {
    if (state.rosterInitialized) return;
    state.rosterInitialized = true;

    document.querySelectorAll('[data-roster-tab]').forEach(btn => {
        btn.addEventListener('click', () => activateRosterTab(btn.dataset.rosterTab));
        btn.addEventListener('keydown', event => {
            const tabs = [...document.querySelectorAll('[data-roster-tab]')];
            const currentIndex = tabs.indexOf(btn);
            let nextIndex = currentIndex;
            if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabs.length - 1;
            else return;
            event.preventDefault();
            activateRosterTab(tabs[nextIndex].dataset.rosterTab, { focus: true });
        });
    });

    const searchInput = document.getElementById('rosterSearchInput');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                state.rosterSearch = searchInput.value;
                state.rosterPage = 1;
                loadRosterList();
            }, 300);
        });
    }

    document.getElementById('rosterStatusFilter')?.addEventListener('change', e => {
        state.rosterStatusFilter = e.target.value;
        state.rosterPage = 1;
        loadRosterList();
    });

    const uploadZone = document.getElementById('rosterUploadZone');
    const fileInput = document.getElementById('rosterFileInput');
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
        uploadZone.addEventListener('drop', e => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const file = e.dataTransfer?.files?.[0];
            if (file) handleRosterFile(file);
        });
        document.getElementById('rosterFileBtn')?.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files?.[0]) handleRosterFile(fileInput.files[0]);
        });
    }

    document.getElementById('rosterConfirmImportBtn')?.addEventListener('click', confirmRosterImport);
    document.getElementById('rosterCancelImportBtn')?.addEventListener('click', cancelRosterImport);

    document.getElementById('rosterEditClose')?.addEventListener('click', closeRosterEdit);
    document.getElementById('rosterEditCancelBtn')?.addEventListener('click', closeRosterEdit);
    document.getElementById('rosterEditBackdrop')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeRosterEdit();
    });
    document.getElementById('rosterEditBackdrop')?.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeRosterEdit();
            return;
        }
        trapDialogFocus(event, document.getElementById('rosterEditDialog'));
    });
    document.getElementById('rosterEditForm')?.addEventListener('submit', submitRosterEdit);
    document.getElementById('rosterEditRegionId')?.addEventListener('change', updateRosterEditBranch);

    document.getElementById('rosterTableBody')?.addEventListener('click', e => {
        if (e.target.closest('[data-roster-retry]')) {
            loadRosterList();
            return;
        }
        const btn = e.target.closest('.roster-edit-btn');
        if (btn?.dataset.employeeId) openRosterEdit(btn.dataset.employeeId);
    });

    document.getElementById('rosterPagination')?.addEventListener('click', e => {
        const btn = e.target.closest('.roster-page-btn');
        if (btn && !btn.disabled && btn.dataset.page) rosterGoPage(Number(btn.dataset.page));
    });
}

function rosterFilterQuerystring() {
    const params = new URLSearchParams();
    params.set('status', state.rosterStatusFilter);
    if (state.rosterSearch) params.set('search', state.rosterSearch);
    return params.toString();
}

async function loadRosterList() {
    const requestSequence = ++state.rosterRequestSequence;
    state.rosterLoaded = false;
    const tbody = document.getElementById('rosterTableBody');
    if (tbody) {
        tbody.setAttribute('aria-busy', 'true');
        tbody.innerHTML = '<tr class="table-loading-row"><td colspan="9"><div class="table-state"><span class="table-state-spinner" aria-hidden="true"></span><span>Đang tải danh sách KTV…</span></div></td></tr>';
    }
    if (activeDashboardView === 'roster') setDashboardSyncState('syncing', 'Đang tải hồ sơ KTV');
    try {
        const params = new URLSearchParams();
        params.set('status', state.rosterStatusFilter);
        params.set('page', String(state.rosterPage));
        if (state.rosterSearch) params.set('search', state.rosterSearch);
        const resp = await fetch(`${API_BASE_URL}/roster/list?${params}`);
        if (!resp.ok) throw new Error('Failed to load roster');
        const json = await resp.json();
        if (requestSequence !== state.rosterRequestSequence) return false;
        const data = json.data || {};
        state.rosterItems = data.items || [];
        state.rosterStats = data.stats || null;
        state.rosterTotal = data.total || 0;
        state.rosterLoaded = true;
        renderRosterList();
        if (activeDashboardView === 'roster') {
            state.lastSuccessfulRefreshAt = new Date();
            setDashboardSyncState('ready');
        }
        return true;
    } catch (err) {
        if (requestSequence !== state.rosterRequestSequence) return false;
        console.error('loadRosterList error:', err);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9"><div class="table-state is-error"><strong>Không tải được danh sách KTV</strong><span>Vui lòng kiểm tra kết nối và thử lại.</span><button type="button" class="button secondary" data-roster-retry>Thử lại</button></div></td></tr>';
        }
        if (activeDashboardView === 'roster') setDashboardSyncState(navigator.onLine ? 'stale' : 'offline', 'Không thể tải hồ sơ KTV');
        return false;
    } finally {
        if (requestSequence === state.rosterRequestSequence) tbody?.removeAttribute('aria-busy');
    }
}

async function loadRosterRegions() {
    if (state.rosterRegionsLoaded) return;
    const resp = await fetch(`${API_BASE_URL}/roster/regions`);
    if (!resp.ok) throw new Error('Không tải được danh mục khu vực.');
    const json = await resp.json();
    state.rosterRegions = json.data?.items || [];
    state.rosterRegionsLoaded = true;
}

function renderRosterRegionOptions(selectedRegionId = '') {
    const select = document.getElementById('rosterEditRegionId');
    if (!select) return;
    const options = state.rosterRegions.map(region => {
        const id = region.region_id || region.regionId || '';
        const name = region.region_name || region.regionName || region.region_code || region.regionCode || '';
        const branch = region.branch_name || region.branchName || 'Chưa có chi nhánh';
        const code = region.region_code || region.regionCode || '';
        const label = `${name} · ${branch}${code ? ` (${code})` : ''}`;
        return `<option value="${escapeHTML(id)}">${escapeHTML(label)}</option>`;
    }).join('');
    select.innerHTML = '<option value="">Chưa phân vùng</option>' + options;
    select.value = selectedRegionId || '';
}

function updateRosterEditBranch() {
    const regionId = document.getElementById('rosterEditRegionId')?.value || '';
    const region = state.rosterRegions.find(item => (item.region_id || item.regionId) === regionId);
    const branchInput = document.getElementById('rosterEditBranchName');
    if (branchInput) branchInput.value = region?.branch_name || region?.branchName || '';
}

function renderRosterList() {
    renderRosterTableBody();
    renderRosterPagination();
}

function renderRosterTableBody() {
    const tbody = document.getElementById('rosterTableBody');
    if (!tbody) return;
    if (!state.rosterItems.length) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="table-state"><strong>Không tìm thấy hồ sơ KTV</strong><span>Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái.</span></div></td></tr>';
        return;
    }
    tbody.innerHTML = state.rosterItems.map(item => {
        const terminated = item.is_terminated || item.isTerminated;
        const badge = terminated ? '<span class="badge-terminated">Đã nghỉ</span>' : '<span class="badge-active">Đang làm</span>';
        const rawEmployeeId = item.employee_id || item.employeeId || '';
        const eid = escapeHTML(rawEmployeeId);
        const employeeCell = eid || '<span title="Có thể bổ sung qua lần import hồ sơ nhân sự sau">Chưa cập nhật</span>';
        const region = escapeHTML(item.region_name || item.regionName || item.dashboard_region || item.dashboardRegion || 'Chưa phân vùng');
        const branch = escapeHTML(item.branch_name || item.branchName || '—');
        const editButton = rawEmployeeId
            ? `<button type="button" class="button secondary roster-edit-btn" data-employee-id="${eid}" aria-label="Sửa hồ sơ ${escapeHTML(item.display_name || item.displayName || rawEmployeeId)}">Sửa</button>`
            : '<button type="button" class="button secondary roster-edit-btn" title="Bổ sung mã nhân viên bằng chức năng import hồ sơ" disabled>Chờ MNV</button>';
        return `<tr>
            <td>${employeeCell}</td>
            <td>${escapeHTML(item.display_name || item.displayName || '')}</td>
            <td>${escapeHTML(item.email || '')}</td>
            <td>${escapeHTML(item.job_title || item.jobTitle || '')}</td>
            <td>${region}</td>
            <td>${branch}</td>
            <td>${escapeHTML(item.class_code || item.classCode || '')}</td>
            <td>${badge}</td>
            <td>${editButton}</td>
        </tr>`;
    }).join('');
}

function renderRosterPagination() {
    const el = document.getElementById('rosterPagination');
    if (!el) return;
    const totalPages = Math.max(1, Math.ceil(state.rosterTotal / 50));
    el.innerHTML = `
        <span>Trang ${state.rosterPage} / ${totalPages} — ${formatNumber.format(state.rosterTotal)} kết quả</span>
        <div class="roster-pagination-btns">
            <button type="button" class="roster-page-btn" data-page="${state.rosterPage - 1}" aria-label="Trang trước" ${state.rosterPage <= 1 ? 'disabled' : ''}>Trước</button>
            <button type="button" class="roster-page-btn" data-page="${state.rosterPage + 1}" aria-label="Trang sau" ${state.rosterPage >= totalPages ? 'disabled' : ''}>Sau</button>
        </div>
    `;
}

function rosterGoPage(page) {
    state.rosterPage = page;
    loadRosterList();
}

/* --- Import --- */

function handleRosterFile(file) {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
        showToast('Vui lòng chọn đúng file Excel định dạng .xlsx.', 'error');
        return;
    }
    state.rosterImportFile = file;
    state.rosterPreviewData = null;
    const info = document.getElementById('rosterFileInfo');
    if (info) {
        info.hidden = false;
        info.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
    document.getElementById('rosterPreview').hidden = true;
    document.getElementById('rosterImportResult').hidden = true;
    document.getElementById('rosterImportActions').hidden = false;
    const importButton = document.getElementById('rosterConfirmImportBtn');
    if (importButton) {
        importButton.disabled = true;
        importButton.textContent = 'Đang kiểm tra file...';
    }
    doRosterPreview(file);
}

async function doRosterPreview(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dry_run', 'true');
    try {
        const resp = await fetch(`${API_BASE_URL}/roster/import`, { method: 'POST', body: formData });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(json.error?.message || `Preview thất bại (HTTP ${resp.status})`);
        if (state.rosterImportFile !== file) return;
        const data = json.data || {};
        state.rosterPreviewData = data;
        renderRosterPreview(data);
        const importButton = document.getElementById('rosterConfirmImportBtn');
        if (importButton) {
            const canImport = data.canImport !== false
                && data.can_import !== false
                && Number(data.totalRows || data.total_rows || 0) > 0
                && Number(data.error_count || data.errorCount || 0) === 0;
            importButton.disabled = !canImport;
            importButton.textContent = canImport ? 'Import danh sách KTV' : 'File chưa hợp lệ';
        }
    } catch (err) {
        if (state.rosterImportFile !== file) return;
        state.rosterPreviewData = null;
        console.error('Preview error:', err);
        renderRosterPreviewFailure(err.message || String(err));
        const importButton = document.getElementById('rosterConfirmImportBtn');
        if (importButton) {
            importButton.disabled = true;
            importButton.textContent = 'Không thể import';
        }
    }
}

function renderRosterPreviewFailure(message) {
    const container = document.getElementById('rosterPreview');
    if (!container) return;
    container.hidden = false;

    document.getElementById('rosterPreviewStats')?.replaceChildren();
    document.getElementById('rosterPreviewChanges')?.replaceChildren();
    const errorsEl = document.getElementById('rosterPreviewErrors');
    if (errorsEl) {
        errorsEl.hidden = false;
        errorsEl.classList.add('is-visible');
        errorsEl.innerHTML = `<h4>Không thể đọc file</h4><p>${escapeHTML(message)}</p>`;
    }
}

function renderRosterPreview(data) {
    const container = document.getElementById('rosterPreview');
    if (!container) return;
    container.hidden = false;

    const statsEl = document.getElementById('rosterPreviewStats');
    if (statsEl) {
        statsEl.innerHTML = `
            <span class="roster-preview-stat stat-insert">Thêm mới: ${data.inserted || 0}</span>
            <span class="roster-preview-stat stat-update">Cập nhật: ${data.updated || 0}</span>
            <span class="roster-preview-stat stat-terminate">Nghỉ việc: ${data.terminated || 0}</span>
            <span class="roster-preview-stat stat-reactivate">Khôi phục: ${data.reactivated || 0}</span>
            <span class="roster-preview-stat stat-error">Lỗi: ${data.error_count || data.errorCount || 0}</span>
        `;
    }

    const errorsEl = document.getElementById('rosterPreviewErrors');
    if (errorsEl) {
        const errors = data.errors || [];
        errorsEl.classList.toggle('is-visible', errors.length > 0);
        if (errors.length) {
            errorsEl.hidden = false;
            errorsEl.innerHTML = `<h4>Lỗi (${errors.length})</h4><ul>${errors.map(e => `<li>Dòng ${e.row || '?'}: ${escapeHTML(e.message || '')}</li>`).join('')}</ul>`;
        } else {
            errorsEl.hidden = true;
        }
    }

    const changesEl = document.getElementById('rosterPreviewChanges');
    if (changesEl) {
        let html = '';
        const changes = data.changes || {};
        [['inserted', 'Thêm mới', 'stat-insert'], ['updated', 'Cập nhật', 'stat-update'], ['terminated', 'Nghỉ việc', 'stat-terminate'], ['reactivated', 'Khôi phục', 'stat-reactivate']].forEach(([key, label, cls]) => {
            const items = changes[key] || [];
            if (!items.length) return;
            html += `<div class="roster-change-group"><h4 class="roster-preview-stat ${cls}">${label} (${items.length})</h4><table><thead><tr><th>Mã NV</th><th>Tên</th><th>Email</th><th>Khu vực</th><th>Chi nhánh</th></tr></thead><tbody>${items.map(i => `<tr><td>${escapeHTML(i.employee_id || '')}</td><td>${escapeHTML(i.display_name || '')}</td><td>${escapeHTML(i.email || '')}</td><td>${escapeHTML(i.region || '')}</td><td>${escapeHTML(i.branch || '')}</td></tr>`).join('')}</tbody></table></div>`;
        });
        changesEl.innerHTML = html || '<p class="roster-preview-empty">Không có thay đổi nào.</p>';
    }
}

async function confirmRosterImport() {
    if (state.rosterImportBusy || !state.rosterImportFile) return;
    const data = state.rosterPreviewData;
    if (!data) {
        showToast('Vui lòng đợi hệ thống kiểm tra file xong trước khi import.', 'info');
        return;
    }
    if ((data.error_count || data.errorCount || 0) > 0) {
        showToast('File còn lỗi dữ liệu. Vui lòng sửa các dòng được đánh dấu trước khi import.', 'error');
        return;
    }
    if (data.canImport === false || data.can_import === false || Number(data.totalRows || data.total_rows || 0) <= 0) {
        showToast('File không có dòng KTV hợp lệ để import.', 'error');
        return;
    }
    const terminationCount = Number(data.terminated || 0);
    if (terminationCount > 0) {
        const confirmed = window.confirm(
            `Cảnh báo: ${terminationCount} KTV không còn trong file sẽ bị đánh dấu Đã nghỉ. Bạn có chắc muốn tiếp tục?`
        );
        if (!confirmed) return;
    }
    state.rosterImportBusy = true;
    let importSucceeded = false;
    const btn = document.getElementById('rosterConfirmImportBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Đang import...'; }

    const formData = new FormData();
    formData.append('file', state.rosterImportFile);
    if (data.batch_id || data.batchId) formData.append('batch_id', data.batch_id || data.batchId);
    if (terminationCount > 0) formData.append('confirm_termination', 'true');
    try {
        const resp = await fetch(`${API_BASE_URL}/roster/import`, { method: 'POST', body: formData });
        const json = await resp.json();
        if (!resp.ok) {
            const errData = json.error || {};
            showRosterResult(errData.message || 'Import thất bại.', false, errData.details);
        } else {
            const result = json.data || {};
            importSucceeded = true;
            const batchId = result.batch_id || result.batchId || '';
            showRosterResult(
                `Đã thêm ${result.inserted || 0}, cập nhật ${result.updated || 0}, đánh dấu nghỉ ${result.terminated || 0} và khôi phục ${result.reactivated || 0} KTV.${batchId ? ` Mã đợt: ${batchId}.` : ''}`,
                true
            );
            state.rosterLoaded = false;
            state.rosterHistoryLoaded = false;
            await Promise.allSettled([loadRosterList(), loadRosterHistory(), refreshDashboardData()]);
        }
    } catch (err) {
        showRosterResult('Lỗi khi import: ' + err.message, false);
    } finally {
        state.rosterImportBusy = false;
        if (btn) {
            btn.disabled = importSucceeded;
            btn.textContent = importSucceeded ? 'Đã import' : 'Import danh sách KTV';
        }
        if (importSucceeded) {
            state.rosterImportFile = null;
            const fileInput = document.getElementById('rosterFileInput');
            if (fileInput) fileInput.value = '';
        }
    }
}

function showRosterResult(message, success, details) {
    const el = document.getElementById('rosterImportResult');
    if (!el) return;
    el.hidden = false;
    el.className = 'roster-import-result ' + (success ? 'result-success' : 'result-error');
    el.setAttribute('role', success ? 'status' : 'alert');
    el.setAttribute('aria-live', success ? 'polite' : 'assertive');

    const title = success ? 'Import thành công' : 'Import không thành công';
    const icon = success ? '✓' : '!';
    let html = `
        <div class="roster-import-result-icon" aria-hidden="true">${icon}</div>
        <div class="roster-import-result-content">
            <h3>${title}</h3>
            <p>${escapeHTML(message)}</p>
    `;
    if (details && details.length) {
        html += '<ul class="roster-import-result-details">';
        details.forEach(d => { html += `<li>${escapeHTML(d.message || d)}</li>`; });
        html += '</ul>';
    }
    if (success) {
        html += '<p class="roster-import-result-hint">Kiểm tra lại tại Danh sách KTV hoặc Lịch sử import.</p>';
    }
    html += '</div>';
    el.innerHTML = html;

    window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
    });
}

function cancelRosterImport() {
    state.rosterImportFile = null;
    state.rosterPreviewData = null;
    const info = document.getElementById('rosterFileInfo');
    if (info) info.hidden = true;
    document.getElementById('rosterPreview').hidden = true;
    document.getElementById('rosterImportResult').hidden = true;
    document.getElementById('rosterImportActions').hidden = true;
    document.getElementById('rosterFileInput').value = '';
    const importButton = document.getElementById('rosterConfirmImportBtn');
    if (importButton) {
        importButton.disabled = true;
        importButton.textContent = 'Import danh sách KTV';
    }
}

/* --- History --- */

async function loadRosterHistory() {
    const requestSequence = ++state.rosterHistoryRequestSequence;
    const tbody = document.getElementById('rosterHistoryBody');
    const emptyEl = document.getElementById('rosterHistoryEmpty');
    tbody?.setAttribute('aria-busy', 'true');
    if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.innerHTML = '<span class="table-state-spinner" aria-hidden="true"></span><span>Đang tải lịch sử import…</span>';
    }
    try {
        const resp = await fetch(`${API_BASE_URL}/roster/history`);
        if (!resp.ok) throw new Error('Failed to load history');
        const json = await resp.json();
        if (requestSequence !== state.rosterHistoryRequestSequence) return false;
        state.rosterHistoryItems = (json.data || {}).items || [];
        state.rosterHistoryLoaded = true;
        renderRosterHistory();
        return true;
    } catch (err) {
        if (requestSequence !== state.rosterHistoryRequestSequence) return false;
        console.error('loadRosterHistory error:', err);
        if (tbody) tbody.innerHTML = '';
        if (emptyEl) {
            emptyEl.hidden = false;
            emptyEl.innerHTML = '<strong>Không tải được lịch sử import</strong><button type="button" class="button secondary" data-roster-history-retry>Thử lại</button>';
            emptyEl.querySelector('[data-roster-history-retry]')?.addEventListener('click', loadRosterHistory, { once: true });
        }
        return false;
    } finally {
        if (requestSequence === state.rosterHistoryRequestSequence) tbody?.removeAttribute('aria-busy');
    }
}

function renderRosterHistory() {
    const tbody = document.getElementById('rosterHistoryBody');
    const emptyEl = document.getElementById('rosterHistoryEmpty');
    if (!tbody) return;
    if (!state.rosterHistoryItems.length) {
        tbody.innerHTML = '';
        if (emptyEl) {
            emptyEl.hidden = false;
            emptyEl.textContent = 'Chưa có lịch sử import nào.';
        }
        return;
    }
    if (emptyEl) emptyEl.hidden = true;
    tbody.innerHTML = state.rosterHistoryItems.map(item => {
        const dt = item.importedAt || item.imported_at;
        const dateStr = dt ? new Date(dt).toLocaleString('vi-VN') : '-';
        return `<tr>
            <td><code>${escapeHTML(item.batchId || item.batch_id || '')}</code></td>
            <td>${escapeHTML(item.fileName || item.file_name || '')}</td>
            <td>${escapeHTML(item.importedByName || item.imported_by_name || item.importedByEmail || '-')}</td>
            <td>${formatNumber.format(Number(item.totalRows || item.total_rows || 0))}</td>
            <td class="roster-value-success">${formatNumber.format(Number(item.inserted || 0))}</td>
            <td class="roster-value-info">${formatNumber.format(Number(item.updated || 0))}</td>
            <td class="roster-value-danger">${formatNumber.format(Number(item.terminated || 0))}</td>
            <td class="roster-value-warning">${formatNumber.format(Number(item.reactivated || 0))}</td>
            <td>${formatNumber.format(Number(item.errorCount || item.error_count || 0))}</td>
            <td>${dateStr}</td>
        </tr>`;
    }).join('');
}

/* --- Edit KTV --- */

async function openRosterEdit(employeeId) {
    const item = state.rosterItems.find(i => (i.employee_id || i.employeeId) === employeeId);
    if (!item) return;
    try {
        await loadRosterRegions();
    } catch (err) {
        showToast(err.message || 'Không tải được danh mục khu vực.', 'error');
        return;
    }
    rosterEditReturnFocus = document.activeElement;
    state.rosterEditEmployeeId = employeeId;
    document.getElementById('rosterEditSubtitle').textContent = employeeId + ' — ' + (item.display_name || item.displayName || '');
    document.getElementById('rosterEditEmployeeId').value = employeeId;
    document.getElementById('rosterEditDisplayName').value = item.display_name || item.displayName || '';
    document.getElementById('rosterEditEmail').value = item.email || '';
    document.getElementById('rosterEditJobTitle').value = item.job_title || item.jobTitle || '';
    renderRosterRegionOptions(item.region_id || item.regionId || '');
    updateRosterEditBranch();
    document.getElementById('rosterEditUnitCode').value = item.unit_code || item.unitCode || '';
    document.getElementById('rosterEditUnitName').value = item.unit_name || item.unitName || '';
    document.getElementById('rosterEditClassCode').value = item.class_code || item.classCode || '';
    document.getElementById('rosterEditTerminated').value = (item.is_terminated || item.isTerminated) ? '1' : '0';
    const backdrop = document.getElementById('rosterEditBackdrop');
    if (backdrop) {
        backdrop.hidden = false;
        backdrop.classList.add('visible');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        window.setTimeout(() => document.getElementById('rosterEditDisplayName')?.focus(), 0);
    }
}

function closeRosterEdit() {
    const backdrop = document.getElementById('rosterEditBackdrop');
    if (backdrop) { backdrop.hidden = true; backdrop.classList.remove('visible'); backdrop.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('modal-open');
    state.rosterEditEmployeeId = '';
    if (rosterEditReturnFocus instanceof HTMLElement) rosterEditReturnFocus.focus();
    rosterEditReturnFocus = null;
}

async function submitRosterEdit(e) {
    e.preventDefault();
    const employeeId = state.rosterEditEmployeeId;
    if (!employeeId) return;
    const payload = {
        display_name: document.getElementById('rosterEditDisplayName').value.trim(),
        email: document.getElementById('rosterEditEmail').value.trim(),
        job_title: document.getElementById('rosterEditJobTitle').value.trim() || null,
        region_id: document.getElementById('rosterEditRegionId').value || null,
        unit_code: document.getElementById('rosterEditUnitCode').value.trim() || null,
        unit_name: document.getElementById('rosterEditUnitName').value.trim() || null,
        class_code: document.getElementById('rosterEditClassCode').value.trim() || null,
        is_terminated: document.getElementById('rosterEditTerminated').value === '1',
    };
    try {
        const resp = await fetch(`${API_BASE_URL}/roster/${encodeURIComponent(employeeId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            showToast(err.error?.message || 'Cập nhật hồ sơ thất bại.', 'error');
            return;
        }
        closeRosterEdit();
        state.rosterLoaded = false;
        await loadRosterList();
        showToast('Đã cập nhật hồ sơ KTV.', 'success');
    } catch (err) {
        showToast(`Không thể cập nhật hồ sơ: ${err.message}`, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboardViewRouting();
    initSidebarNavigation();
    initDashboardExperience();
    initFilters();
    initSort();
    initDateRangePicker();
    initHourlyDatePicker();
    initReportExport();
    initInstructorWorkspace();
    initClassMatrix();
    initRoster();
    initEvents();
    initSubModalEvents();
    loadInitialDashboardData();
});
