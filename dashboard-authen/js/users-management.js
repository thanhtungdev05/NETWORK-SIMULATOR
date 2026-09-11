/**
 * FTC Dashboard - User & Role Management (Admin Exclusive)
 * Phân quyền & Quản lý Người dùng dành cho Quản trị viên
 */
(function () {
    'use strict';

    let searchDebounceTimer = null;
    let currentUsersData = [];

    // Tải danh sách người dùng từ API
    async function loadUsersManagementList() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        const searchInput = document.getElementById('usersSearchInput');
        const roleFilter = document.getElementById('usersRoleFilter');
        const q = searchInput ? searchInput.value.trim() : '';
        const role = roleFilter ? roleFilter.value.trim() : '';

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 32px; color: var(--text-muted);">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span>
                        <span>Đang tải danh sách tài khoản...</span>
                    </div>
                </td>
            </tr>
        `;

        try {
            let url = '/api/index.php/users?limit=100';
            if (q) url += '&q=' + encodeURIComponent(q);
            if (role) url += '&role=' + encodeURIComponent(role);

            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });

            if (!res.ok) {
                if (res.status === 403) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 32px; color: #ef4444;">
                                ⚠️ Bạn cần quyền Quản trị viên (Admin) để truy cập chức năng này.
                            </td>
                        </tr>
                    `;
                    return;
                }
                throw new Error('Lỗi máy chủ: ' + res.status);
            }

            const json = await res.json();
            const users = json.items || json.data || [];
            currentUsersData = users;

            renderUsersTable(users);
        } catch (err) {
            console.error('[UsersManagement] Error loading users:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 32px; color: #ef4444;">
                        Không thể tải danh sách tài khoản: ${err.message || 'Lỗi kết nối'}
                    </td>
                </tr>
            `;
        }
    }

    // Hiển thị danh sách ra bảng
    function renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (!users || users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 32px; color: var(--text-muted);">
                        🔍 Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map(u => {
            const email = escapeHtml(u.email || '');
            const displayName = escapeHtml(u.displayName || u.display_name || u.email || '—');
            const employeeId = escapeHtml(u.employeeId || u.employee_id || '—');
            const role = (u.role || 'KTV').toUpperCase();
            const initials = getInitials(u.displayName || u.email || 'U');

            let roleBadge = '';
            let actionBtn = '';

            if (role === 'ADMIN') {
                roleBadge = '<span class="badge-role badge-admin">👑 Quản trị viên</span>';
                actionBtn = '<span style="color: var(--text-muted); font-size: 12px; font-style: italic;">(Toàn quyền hệ thống)</span>';
            } else if (role === 'DEV') {
                roleBadge = '<span class="badge-role badge-dev">💻 Developer</span>';
                actionBtn = '<span style="color: var(--text-muted); font-size: 12px; font-style: italic;">(Tài khoản kỹ thuật)</span>';
            } else if (role === 'GIANGVIEN') {
                roleBadge = '<span class="badge-role badge-instructor">👨‍🏫 Giảng viên</span>';
                actionBtn = `
                    <button type="button" class="btn-role-action btn-demote" 
                        onclick="window.changeUserRole('${email}', 'KTV', '${escapeJsStr(displayName)}')">
                        🎓 Chuyển về Học viên
                    </button>
                `;
            } else {
                // KTV / Học viên
                roleBadge = '<span class="badge-role badge-student">🎓 Học viên</span>';
                actionBtn = `
                    <button type="button" class="btn-role-action btn-promote" 
                        onclick="window.changeUserRole('${email}', 'GIANGVIEN', '${escapeJsStr(displayName)}')">
                        ⭐ Đặt làm Giảng viên
                    </button>
                `;
            }

            return `
                <tr>
                    <td style="font-weight: 500;">
                        <span class="user-avatar-circle">${initials}</span>
                        <span>${displayName}</span>
                    </td>
                    <td><code style="font-size: 13px; color: #38bdf8;">${email}</code></td>
                    <td>${employeeId}</td>
                    <td>${roleBadge}</td>
                    <td style="text-align: center;">${actionBtn}</td>
                </tr>
            `;
        }).join('');
    }

    // Thay đổi vai trò người dùng (1-Click Promote / Demote)
    async function changeUserRole(email, newRole, displayName) {
        const roleLabel = newRole === 'GIANGVIEN' ? '👨‍🏫 Giảng viên' : '🎓 Học viên';
        const confirmMsg = `Bạn có chắc chắn muốn chuyển tài khoản:\n\n• ${displayName} (${email})\n\nSang vai trò: [ ${roleLabel} ] không?`;
        
        if (!confirm(confirmMsg)) {
            return;
        }

        try {
            const res = await fetch('/api/index.php/users/' + encodeURIComponent(email), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = data.error?.message || 'Không thể cập nhật quyền.';
                alert('⚠️ Lỗi: ' + msg);
                return;
            }

            alert(`✅ Thành công! Đã chuyển tài khoản ${email} thành ${roleLabel}.`);
            // Tải lại bảng để phản ánh dữ liệu mới
            loadUsersManagementList();
        } catch (err) {
            console.error('[UsersManagement] Error changing role:', err);
            alert('⚠️ Lỗi kết nối máy chủ: ' + err.message);
        }
    }

    // Helper functions
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeJsStr(str) {
        return String(str || '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '&quot;');
    }

    function getInitials(name) {
        const parts = String(name || '').trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return (name || 'U').substring(0, 2).toUpperCase();
    }

    // Chuyển trực tiếp sang view Quản lý Người dùng (kể cả khi app.js chưa load xong)
    function switchToUsersViewManual() {
        const masterContainer = document.querySelector('.dashboard-master-container');
        if (masterContainer) masterContainer.hidden = true;

        document.querySelectorAll('.dashboard-page-view').forEach(section => {
            section.hidden = (section.dataset.pageView !== 'users');
        });

        const usersSection = document.getElementById('users');
        if (usersSection) {
            usersSection.hidden = false;
        }

        const eyebrow = document.getElementById('pageEyebrow');
        const title = document.getElementById('pageTitle');
        const subtitle = document.getElementById('pageSubtitle');
        if (eyebrow) eyebrow.textContent = 'Quản trị hệ thống & Phân quyền';
        if (title) title.textContent = 'Quản lý Người dùng & Phân quyền';
        if (subtitle) subtitle.textContent = 'Tìm kiếm tài khoản, kiểm tra thông tin và nâng/hạ quyền Giảng viên & Học viên';
        document.title = 'Quản lý Người dùng & Phân quyền | Dashboard Đào Tạo';

        document.querySelectorAll('.sidebar-link[data-dashboard-view]').forEach(link => {
            const isActive = (link.dataset.dashboardView === 'users');
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        try {
            const url = new URL(window.location.href);
            if (url.searchParams.get('view') !== 'users') {
                url.searchParams.set('view', 'users');
                window.history.pushState({}, '', url.toString());
            }
        } catch (_) {}

        if (typeof window.setDataSourceLabel === 'function') {
            window.setDataSourceLabel('Dữ liệu người dùng từ cơ sở dữ liệu');
        } else {
            const label = document.getElementById('dataSourceLabel');
            if (label) label.textContent = 'Dữ liệu người dùng từ cơ sở dữ liệu';
        }

        loadUsersManagementList();
    }

    // Gắn sự kiện click vào menu sidebar
    function initUsersNavigation() {
        const navUsersLink = document.getElementById('navUsersLink');
        if (navUsersLink) {
            navUsersLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (typeof window.switchDashboardView === 'function' && window.DASHBOARD_VIEWS && window.DASHBOARD_VIEWS.users) {
                    window.switchDashboardView('users');
                } else {
                    switchToUsersViewManual();
                }
            }, true);
        }

        const currentView = new URLSearchParams(window.location.search).get('view');
        if (currentView === 'users') {
            setTimeout(() => {
                if (typeof window.switchDashboardView === 'function' && window.DASHBOARD_VIEWS && window.DASHBOARD_VIEWS.users) {
                    window.switchDashboardView('users');
                } else {
                    switchToUsersViewManual();
                }
            }, 60);
        }
    }

    // Gắn sự kiện khi tài liệu sẵn sàng
    function initUsersManagement() {
        const searchInput = document.getElementById('usersSearchInput');
        const roleFilter = document.getElementById('usersRoleFilter');
        const refreshBtn = document.getElementById('btnRefreshUsers');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                clearTimeout(searchDebounceTimer);
                searchDebounceTimer = setTimeout(loadUsersManagementList, 300);
            });
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', loadUsersManagementList);
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadUsersManagementList);
        }

        initUsersNavigation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUsersManagement);
    } else {
        initUsersManagement();
    }

    // Expose ra window để HTML và app.js gọi
    window.loadUsersManagementList = loadUsersManagementList;
    window.changeUserRole = changeUserRole;
    window.switchToUsersViewManual = switchToUsersViewManual;
})();
