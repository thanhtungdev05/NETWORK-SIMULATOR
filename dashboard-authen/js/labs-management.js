/**
 * FTC Dashboard - Lecturer Lab Studio (Soạn & Quản lý Bài Thực Hành)
 * Dành cho Giảng viên và Quản trị viên
 */
(function () {
    'use strict';

    let currentDevices = [];
    let currentLabs = [];
    let currentSelectedDevice = '';

    // Danh mục gợi ý các trang cấu hình và tiêu chí mẫu
    const PRESET_TEMPLATES = {
        custom: {
            url: '',
            rules: []
        },
        wan_pppoe: {
            url: '/cgi-bin/index.asp?page=home_wan.asp',
            rules: [
                { name: 'Tài khoản PPPoE', selector: 'input[name="wan_PPPUsername"]', expected: 'fpt-student-2026', type: 'text_exact' },
                { name: 'Mật khẩu PPPoE', selector: 'input[name="wan_PPPPassword"]', expected: 'fpt12345', type: 'text_exact' }
            ]
        },
        wifi_ssid: {
            url: '/cgi-bin/index.asp?page=home_wlan.asp',
            rules: [
                { name: 'Tên Wi-Fi (SSID)', selector: 'input[name="wlSsid"]', expected: 'FPT_Telecom_Lab', type: 'text_exact' },
                { name: 'Mật khẩu Wi-Fi', selector: 'input[name="wlWpaPsk"]', expected: '88888888', type: 'text_exact' }
            ]
        },
        lan_ip: {
            url: '/cgi-bin/index.asp?page=home_lan.asp',
            rules: [
                { name: 'Địa chỉ IP LAN', selector: 'input[name="lan_ip"]', expected: '192.168.10.1', type: 'text_exact' },
                { name: 'Subnet Mask', selector: 'input[name="lan_mask"]', expected: '255.255.255.0', type: 'text_exact' }
            ]
        },
        port_forwarding: {
            url: '/cgi-bin/index.asp?page=adv_nat_top_VirtualServer.asp',
            rules: [
                { name: 'Cổng dịch vụ (Port)', selector: 'input[name="srvPort"]', expected: '8080', type: 'text_exact' },
                { name: 'IP máy chủ LAN', selector: 'input[name="srvIp"]', expected: '192.168.1.100', type: 'text_exact' }
            ]
        },
        dns_config: {
            url: '/cgi-bin/index.asp?page=home_dns.asp',
            rules: [
                { name: 'Primary DNS', selector: 'input[name="dns1"]', expected: '8.8.8.8', type: 'text_exact' },
                { name: 'Secondary DNS', selector: 'input[name="dns2"]', expected: '8.8.4.4', type: 'text_exact' }
            ]
        }
    };

    // Tải danh sách thiết bị và bài lab
    async function loadLabsManagementList() {
        const grid = document.getElementById('labsGrid');
        const deviceSelect = document.getElementById('labsDeviceFilter');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
                <span style="display: inline-block; animation: spin 1s linear infinite; font-size: 20px;">⏳</span>
                <p style="margin-top: 8px;">Đang tải danh sách bài thực hành...</p>
            </div>
        `;

        try {
            // 1. Tải danh mục thiết bị nếu chưa có
            if (!currentDevices.length) {
                const devRes = await fetch('/api/index.php/learning/catalog', { credentials: 'include' });
                if (devRes.ok) {
                    const devData = await devRes.json();
                    currentDevices = devData.devices || [];
                    populateDeviceDropdown(currentDevices);
                }
            }

            // 2. Tải bài lab theo thiết bị được chọn (hoặc tất cả)
            const deviceId = deviceSelect ? deviceSelect.value : '';
            let url = '/api/index.php/labs';
            if (deviceId) url += '?device_id=' + encodeURIComponent(deviceId);

            const res = await fetch(url, { credentials: 'include' });
            if (!res.ok) throw new Error('Máy chủ báo lỗi: ' + res.status);

            const data = await res.json();
            currentLabs = data.items || [];
            renderLabsGrid(currentLabs);
        } catch (err) {
            console.error('[LabsManagement] Error loading labs:', err);
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ef4444;">
                    ⚠️ Không thể tải danh sách bài thực hành: ${err.message || 'Lỗi kết nối'}
                </div>
            `;
        }
    }

    function populateDeviceDropdown(devices) {
        const deviceSelect = document.getElementById('labsDeviceFilter');
        const modalDeviceSelect = document.getElementById('modalLabDevice');
        if (!devices.length) return;

        const optionsHtml = devices.map(d => `<option value="${escapeHtml(d.device_id)}">${escapeHtml(d.device_name || d.model)}</option>`).join('');

        if (deviceSelect) {
            const currentVal = deviceSelect.value;
            deviceSelect.innerHTML = `<option value="">-- Tất cả các dòng thiết bị --</option>` + optionsHtml;
            if (currentVal) deviceSelect.value = currentVal;
        }

        if (modalDeviceSelect) {
            modalDeviceSelect.innerHTML = optionsHtml;
        }
    }

    function renderLabsGrid(labs) {
        const grid = document.getElementById('labsGrid');
        if (!grid) return;

        if (!labs || labs.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--ui-surface); border: 1px dashed var(--ui-border); border-radius: 12px; color: var(--text-muted);">
                    📁 Chưa có bài thực hành nào cho thiết bị này. Nhấn nút <strong>"+ Soạn bài thực hành mới"</strong> để thêm bài học!
                </div>
            `;
            return;
        }

        grid.innerHTML = labs.map(lab => {
            const labId = escapeHtml(lab.lab_id);
            const labName = escapeHtml(lab.lab_name || lab.title || 'Bài thực hành');
            const deviceName = escapeHtml(lab.device_name || lab.model || lab.device_id);
            const isCustom = Boolean(lab.is_custom);
            const isActive = Boolean(lab.is_active);
            const subtitle = escapeHtml(lab.subtitle || 'Thực hành cấu hình thiết bị');
            const rulesCount = Array.isArray(lab.grading_rules) ? lab.grading_rules.length : 0;
            const practiceUrl = escapeHtml(lab.practice_url || '');

            const badge = isCustom
                ? `<span class="lab-card-badge badge-custom">⭐ Do Giảng viên tạo</span>`
                : `<span class="lab-card-badge badge-builtin">👑 Mặc định hệ thống</span>`;

            const statusBadge = isActive
                ? `<span style="color: #22c55e; font-size: 11.5px; font-weight: 600;">● Đang bật</span>`
                : `<span style="color: #ef4444; font-size: 11.5px; font-weight: 600;">○ Tạm ẩn</span>`;

            let actionsHtml = '';
            if (isCustom) {
                actionsHtml = `
                    <button type="button" class="button secondary" style="padding: 4px 10px; font-size: 12px;" onclick="window.viewLabInstructions('${labId}')">👁️ Đề bài</button>
                    <button type="button" class="button secondary" style="padding: 4px 10px; font-size: 12px; color: #ef4444;" onclick="window.toggleLabStatus('${labId}', ${!isActive})">
                        ${isActive ? 'Ẩn' : 'Bật lại'}
                    </button>
                `;
            } else {
                actionsHtml = `
                    <span style="font-size: 12px; color: var(--text-muted); font-style: italic;">(Bài chuẩn)</span>
                `;
            }

            return `
                <div class="lab-card">
                    <div>
                        <div class="lab-card-header">
                            <div>
                                <span style="font-size: 11.5px; color: #38bdf8; font-weight: 600; text-transform: uppercase;">${deviceName}</span>
                                <div class="lab-card-title">${labName}</div>
                            </div>
                            <div>${badge}</div>
                        </div>
                        <div class="lab-card-desc">${subtitle}</div>
                        ${practiceUrl ? `<div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 12px; font-family: monospace; word-break: break-all;">🔗 ${practiceUrl}</div>` : ''}
                    </div>

                    <div class="lab-card-meta">
                        <div>
                            <span>${statusBadge}</span>
                            ${isCustom ? `<span style="margin-left: 8px; color: var(--text-muted);">• ${rulesCount} tiêu chí chấm</span>` : ''}
                        </div>
                        <div class="lab-card-actions">
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Mở / Đóng Modal
    function openCreateLabModal() {
        const modal = document.getElementById('modalCreateLab');
        if (!modal) return;

        // Reset form
        document.getElementById('formCreateLab')?.reset();
        const rulesContainer = document.getElementById('modalGradingRulesContainer');
        if (rulesContainer) {
            rulesContainer.innerHTML = '';
            addRuleRow('', '', '', 'text_exact'); // Add 1 empty default row
        }

        // Set device to current filter if selected
        const currentFilterDev = document.getElementById('labsDeviceFilter')?.value;
        const modalDevSelect = document.getElementById('modalLabDevice');
        if (currentFilterDev && modalDevSelect) {
            modalDevSelect.value = currentFilterDev;
        }

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeCreateLabModal() {
        const modal = document.getElementById('modalCreateLab');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Thêm dòng tiêu chí chấm điểm trong Modal
    function addRuleRow(name = '', selector = '', expected = '', type = 'text_exact') {
        const container = document.getElementById('modalGradingRulesContainer');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'rule-item-row';
        row.innerHTML = `
            <input type="text" class="form-control rule-name" placeholder="Tên tiêu chí (VD: PPPoE User)" value="${escapeHtml(name)}">
            <input type="text" class="form-control rule-selector" placeholder="CSS Selector (VD: input[name='wan_user'])" value="${escapeHtml(selector)}">
            <input type="text" class="form-control rule-expected" placeholder="Giá trị đúng (VD: fpt123)" value="${escapeHtml(expected)}">
            <button type="button" class="btn-remove-rule" title="Xóa tiêu chí này">✕</button>
        `;

        row.querySelector('.btn-remove-rule')?.addEventListener('click', () => {
            row.remove();
        });

        container.appendChild(row);
    }

    // Áp dụng cấu hình mẫu khi chọn preset
    function handlePresetChange(e) {
        const presetKey = e.target.value;
        const template = PRESET_TEMPLATES[presetKey];
        if (!template) return;

        const urlInput = document.getElementById('modalLabPracticeUrl');
        const rulesContainer = document.getElementById('modalGradingRulesContainer');

        if (urlInput && template.url) {
            // Lấy tiền tố simulator của thiết bị đang chọn
            const deviceId = document.getElementById('modalLabDevice')?.value || 'DEV_AC1000F';
            const devFolder = getSimulatorFolderByDeviceId(deviceId);
            urlInput.value = `/${devFolder}${template.url}`;
        }

        if (rulesContainer && template.rules && template.rules.length > 0) {
            rulesContainer.innerHTML = '';
            template.rules.forEach(r => addRuleRow(r.name, r.selector, r.expected, r.type));
        }
    }

    function getSimulatorFolderByDeviceId(deviceId) {
        const map = {
            DEV_AC1000F: 'sim_ac1000f',
            DEV_AX3000CV2: 'sim_ax3000c',
            DEV_AX3000GZ: 'sim_ax3000gz',
            DEV_AX3000HV2: 'sim_ax3000hv2',
            DEV_AX3000S: 'sim_ax3000s',
            DEV_AC1000HI: 'sim_ac1000HI',
            DEV_BE12000: 'sim_be12000',
            DEV_BE15000: 'sim_be15000',
            DEV_VIGOR2927: 'sim_vigor2927',
            DEV_BE6500C: 'sim_be6500c',
            DEV_ONT_BE6500C: 'sim_ONT_be6500c',
            DEV_MIKROTIK_HEXS: 'sim_mikrotik_hexs'
        };
        return map[deviceId] || 'sim_ac1000f';
    }

    // Lưu bài thực hành mới
    async function handleSaveNewLab(e) {
        e.preventDefault();

        const deviceId = document.getElementById('modalLabDevice')?.value.trim();
        const labName = document.getElementById('modalLabName')?.value.trim();
        const subtitle = document.getElementById('modalLabSubtitle')?.value.trim();
        const practiceUrl = document.getElementById('modalLabPracticeUrl')?.value.trim();
        const instructionsRaw = document.getElementById('modalLabInstructions')?.value.trim();

        if (!deviceId || !labName || !practiceUrl) {
            alert('⚠️ Vui lòng điền đầy đủ: Thiết bị, Tên bài học và Đường dẫn thực hành.');
            return;
        }

        // Parse instructions
        const instructions = instructionsRaw
            ? instructionsRaw.split('\n').map(s => s.trim()).filter(Boolean)
            : ['<b>Yêu cầu:</b>', 'Thực hiện cấu hình các thông số trên thiết bị theo yêu cầu.'];

        // Collect grading rules
        const gradingRules = [];
        document.querySelectorAll('.rule-item-row').forEach((row, idx) => {
            const name = row.querySelector('.rule-name')?.value.trim();
            const selector = row.querySelector('.rule-selector')?.value.trim();
            const expected = row.querySelector('.rule-expected')?.value.trim();
            if (selector) {
                gradingRules.push({
                    id: `rule_${idx + 1}`,
                    name: name || `Tiêu chí ${idx + 1}`,
                    selector: selector,
                    expected: expected || '',
                    type: 'text_exact',
                    trim: true,
                    required: true
                });
            }
        });

        const payload = {
            device_id: deviceId,
            lab_name: labName,
            subtitle: subtitle || labName,
            practice_url: practiceUrl,
            instructions: instructions,
            grading_rules: gradingRules
        };

        const submitBtn = document.getElementById('btnSubmitCreateLab');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang lưu bài học...';
        }

        try {
            const res = await fetch('/api/index.php/labs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = data.error?.message || 'Không thể tạo bài thực hành.';
                alert('⚠️ Lỗi: ' + msg);
                return;
            }

            alert(`✅ Thành công! Đã tạo bài thực hành mới: "${labName}".`);
            closeCreateLabModal();
            loadLabsManagementList();
        } catch (err) {
            console.error('[LabsManagement] Error creating lab:', err);
            alert('⚠️ Lỗi kết nối: ' + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Lưu bài thực hành';
            }
        }
    }

    // Bật/Ẩn bài lab
    async function toggleLabStatus(labId, newActiveState) {
        const actionText = newActiveState ? 'bật lại' : 'tạm ẩn';
        if (!confirm(`Bạn có chắc chắn muốn ${actionText} bài thực hành [${labId}] không?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/index.php/labs/${encodeURIComponent(labId)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ is_active: newActiveState })
            });

            if (!res.ok) throw new Error('Không thể cập nhật trạng thái');
            loadLabsManagementList();
        } catch (err) {
            alert('⚠️ Lỗi: ' + err.message);
        }
    }

    // Xem đề bài
    function viewLabInstructions(labId) {
        const lab = currentLabs.find(l => l.lab_id === labId);
        if (!lab) return;

        let content = `📚 BÀI THỰC HÀNH: ${lab.lab_name}\n\n`;
        content += `Thiết bị: ${lab.device_name || lab.device_id}\n`;
        content += `Đường dẫn: ${lab.practice_url}\n\n`;
        content += `YÊU CẦU ĐỀ BÀI:\n`;
        if (Array.isArray(lab.instructions)) {
            lab.instructions.forEach(ins => {
                content += `• ${ins.replace(/<[^>]+>/g, '')}\n`;
            });
        }
        content += `\nTIÊU CHÍ CHẤM ĐIỂM (${(lab.grading_rules || []).length}):\n`;
        (lab.grading_rules || []).forEach((r, i) => {
            content += `${i + 1}. ${r.name || r.id}: Cần nhập [${r.expected}] vào [${r.selector}]\n`;
        });

        alert(content);
    }

    // Fallback chuyển view
    function switchToLabsViewManual() {
        const masterContainer = document.querySelector('.dashboard-master-container');
        if (masterContainer) masterContainer.hidden = true;

        document.querySelectorAll('.dashboard-page-view').forEach(section => {
            section.hidden = (section.dataset.pageView !== 'labs');
        });

        const labsSection = document.getElementById('labs');
        if (labsSection) labsSection.hidden = false;

        const eyebrow = document.getElementById('pageEyebrow');
        const title = document.getElementById('pageTitle');
        const subtitle = document.getElementById('pageSubtitle');
        if (eyebrow) eyebrow.textContent = 'Không gian Giảng viên & Soạn bài';
        if (title) title.textContent = 'Quản lý Bài Thực Hành (Lab Studio)';
        if (subtitle) subtitle.textContent = 'Xem danh mục bài lab, soạn thảo đề bài và cấu hình quy tắc chấm điểm trên các thiết bị';
        document.title = 'Quản lý Bài Thực Hành | Dashboard Đào Tạo';

        document.querySelectorAll('.sidebar-link[data-dashboard-view]').forEach(link => {
            const isActive = (link.dataset.dashboardView === 'labs');
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        try {
            const url = new URL(window.location.href);
            if (url.searchParams.get('view') !== 'labs') {
                url.searchParams.set('view', 'labs');
                window.history.pushState({}, '', url.toString());
            }
        } catch (_) {}

        if (typeof window.setDataSourceLabel === 'function') {
            window.setDataSourceLabel('Dữ liệu bài thực hành từ cơ sở dữ liệu');
        }

        loadLabsManagementList();
    }

    // Helper escapeHtml
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Khởi tạo sự kiện
    function initLabsManagement() {
        const navLabsLink = document.getElementById('navLabsLink');
        if (navLabsLink) {
            navLabsLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.switchDashboardView === 'function' && window.DASHBOARD_VIEWS && window.DASHBOARD_VIEWS.labs) {
                    window.switchDashboardView('labs');
                } else {
                    switchToLabsViewManual();
                }
            }, true);
        }

        document.getElementById('labsDeviceFilter')?.addEventListener('change', loadLabsManagementList);
        document.getElementById('btnRefreshLabs')?.addEventListener('click', loadLabsManagementList);
        document.getElementById('btnOpenCreateLab')?.addEventListener('click', openCreateLabModal);
        document.getElementById('btnCloseModalCreateLab')?.addEventListener('click', closeCreateLabModal);
        document.getElementById('btnCancelCreateLab')?.addEventListener('click', closeCreateLabModal);
        document.getElementById('btnAddGradingRule')?.addEventListener('click', () => addRuleRow());
        document.getElementById('modalLabPreset')?.addEventListener('change', handlePresetChange);
        document.getElementById('formCreateLab')?.addEventListener('submit', handleSaveNewLab);

        // When device in modal changes, update default preset URL prefix
        document.getElementById('modalLabDevice')?.addEventListener('change', () => {
            const presetSelect = document.getElementById('modalLabPreset');
            if (presetSelect && presetSelect.value !== 'custom') {
                presetSelect.dispatchEvent(new Event('change'));
            }
        });

        // Check if initial view is labs
        const currentView = new URLSearchParams(window.location.search).get('view');
        if (currentView === 'labs') {
            setTimeout(() => {
                if (typeof window.switchDashboardView === 'function' && window.DASHBOARD_VIEWS && window.DASHBOARD_VIEWS.labs) {
                    window.switchDashboardView('labs');
                } else {
                    switchToLabsViewManual();
                }
            }, 60);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLabsManagement);
    } else {
        initLabsManagement();
    }

    window.loadLabsManagementList = loadLabsManagementList;
    window.openCreateLabModal = openCreateLabModal;
    window.closeCreateLabModal = closeCreateLabModal;
    window.toggleLabStatus = toggleLabStatus;
    window.viewLabInstructions = viewLabInstructions;
    window.switchToLabsViewManual = switchToLabsViewManual;
})();
