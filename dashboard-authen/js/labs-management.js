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
            name: '',
            subtitle: '',
            instructions: [],
            url: '',
            rules: []
        },
        wan_pppoe: {
            name: 'Cấu hình WAN PPPoE Internet',
            subtitle: 'Thiết lập kết nối Internet qua giao thức PPPoE với tài khoản nhà mạng',
            instructions: [
                'Bước 1: Đăng nhập giao diện quản trị thiết bị',
                'Bước 2: Điều hướng đến Cài đặt mạng WAN (WAN Setup)',
                'Bước 3: Chọn chế độ kết nối PPPoE',
                'Bước 4: Nhập Username và Password do ISP cung cấp',
                'Bước 5: Nhấn Lưu cấu hình / Áp dụng để hoàn tất'
            ],
            url: '/cgi-bin/index.asp?page=home_wan.asp',
            rules: [
                { name: 'Tài khoản PPPoE', selector: 'input[name="wan_PPPUsername"]', expected: 'fpt-student-2026', type: 'text_exact' },
                { name: 'Mật khẩu PPPoE', selector: 'input[name="wan_PPPPassword"]', expected: 'fpt12345', type: 'text_exact' }
            ]
        },
        wifi_ssid: {
            name: 'Cấu hình Wi-Fi SSID & Mật khẩu WPA2',
            subtitle: 'Thiết lập tên mạng Wi-Fi và mật khẩu bảo mật chuẩn WPA2-PSK',
            instructions: [
                'Bước 1: Điều hướng đến mục Cài đặt Wi-Fi (WLAN Setup)',
                'Bước 2: Đổi tên sóng Wi-Fi (SSID) theo yêu cầu bài thực hành',
                'Bước 3: Chọn chế độ bảo mật WPA2-PSK / AES',
                'Bước 4: Đặt mật khẩu bảo mật (Pre-Shared Key)',
                'Bước 5: Nhấn Áp dụng để lưu thông số Wi-Fi'
            ],
            url: '/cgi-bin/index.asp?page=home_wlan.asp',
            rules: [
                { name: 'Tên Wi-Fi (SSID)', selector: 'input[name="wlSsid"]', expected: 'FPT_Telecom_Lab', type: 'text_exact' },
                { name: 'Mật khẩu Wi-Fi', selector: 'input[name="wlWpaPsk"]', expected: '88888888', type: 'text_exact' }
            ]
        },
        wifi_config: {
            name: 'Cấu hình Wi-Fi SSID & Mật khẩu WPA2',
            subtitle: 'Thiết lập tên mạng Wi-Fi và mật khẩu bảo mật chuẩn WPA2-PSK',
            instructions: [
                'Bước 1: Điều hướng đến mục Cài đặt Wi-Fi (WLAN Setup)',
                'Bước 2: Đổi tên sóng Wi-Fi (SSID) theo yêu cầu bài thực hành',
                'Bước 3: Chọn chế độ bảo mật WPA2-PSK / AES',
                'Bước 4: Đặt mật khẩu bảo mật (Pre-Shared Key)',
                'Bước 5: Nhấn Áp dụng để lưu thông số Wi-Fi'
            ],
            url: '/cgi-bin/index.asp?page=home_wlan.asp',
            rules: [
                { name: 'Tên Wi-Fi (SSID)', selector: 'input[name="wlSsid"]', expected: 'FPT_Telecom_Lab', type: 'text_exact' },
                { name: 'Mật khẩu Wi-Fi', selector: 'input[name="wlWpaPsk"]', expected: '88888888', type: 'text_exact' }
            ]
        },
        lan_ip: {
            name: 'Cấu hình Địa chỉ IP LAN & Subnet Mask',
            subtitle: 'Thiết lập phân dải mạng nội bộ và địa chỉ IP Gateway của modem',
            instructions: [
                'Bước 1: Mở phần Cài đặt mạng cục bộ (LAN Setup)',
                'Bước 2: Thay đổi địa chỉ IP LAN của modem sang lớp mạng chỉ định',
                'Bước 3: Đảm bảo Subnet Mask phù hợp (255.255.255.0)',
                'Bước 4: Nhấn Áp dụng để cập nhật cấu hình mạng nội bộ'
            ],
            url: '/cgi-bin/index.asp?page=home_lan.asp',
            rules: [
                { name: 'Địa chỉ IP LAN', selector: 'input[name="lan_ip"]', expected: '192.168.10.1', type: 'text_exact' },
                { name: 'Subnet Mask', selector: 'input[name="lan_mask"]', expected: '255.255.255.0', type: 'text_exact' }
            ]
        },
        lan_dhcp: {
            name: 'Cấu hình Địa chỉ IP LAN & Subnet Mask',
            subtitle: 'Thiết lập phân dải mạng nội bộ và địa chỉ IP Gateway của modem',
            instructions: [
                'Bước 1: Mở phần Cài đặt mạng cục bộ (LAN Setup)',
                'Bước 2: Thay đổi địa chỉ IP LAN của modem sang lớp mạng chỉ định',
                'Bước 3: Đảm bảo Subnet Mask phù hợp (255.255.255.0)',
                'Bước 4: Nhấn Áp dụng để cập nhật cấu hình mạng nội bộ'
            ],
            url: '/cgi-bin/index.asp?page=home_lan.asp',
            rules: [
                { name: 'Địa chỉ IP LAN', selector: 'input[name="lan_ip"]', expected: '192.168.10.1', type: 'text_exact' },
                { name: 'Subnet Mask', selector: 'input[name="lan_mask"]', expected: '255.255.255.0', type: 'text_exact' }
            ]
        },
        port_forwarding: {
            name: 'Cấu hình Mở Port / Virtual Server (NAT)',
            subtitle: 'Chuyển tiếp cổng dịch vụ Internet vào máy chủ nội bộ LAN',
            instructions: [
                'Bước 1: Vào mục Nâng cao (Advanced) -> Virtual Server / Port Forwarding',
                'Bước 2: Thêm một quy tắc NAT chuyển tiếp cổng mới',
                'Bước 3: Nhập Port dịch vụ bên ngoài và Port nội bộ',
                'Bước 4: Nhập IP máy chủ đích trong mạng LAN',
                'Bước 5: Kích hoạt quy tắc và nhấn Áp dụng'
            ],
            url: '/cgi-bin/index.asp?page=adv_nat_top_VirtualServer.asp',
            rules: [
                { name: 'Cổng dịch vụ (Port)', selector: 'input[name="srvPort"]', expected: '8080', type: 'text_exact' },
                { name: 'IP máy chủ LAN', selector: 'input[name="srvIp"]', expected: '192.168.1.100', type: 'text_exact' }
            ]
        },
        port_forward: {
            name: 'Cấu hình Mở Port / Virtual Server (NAT)',
            subtitle: 'Chuyển tiếp cổng dịch vụ Internet vào máy chủ nội bộ LAN',
            instructions: [
                'Bước 1: Vào mục Nâng cao (Advanced) -> Virtual Server / Port Forwarding',
                'Bước 2: Thêm một quy tắc NAT chuyển tiếp cổng mới',
                'Bước 3: Nhập Port dịch vụ bên ngoài và Port nội bộ',
                'Bước 4: Nhập IP máy chủ đích trong mạng LAN',
                'Bước 5: Kích hoạt quy tắc và nhấn Áp dụng'
            ],
            url: '/cgi-bin/index.asp?page=adv_nat_top_VirtualServer.asp',
            rules: [
                { name: 'Cổng dịch vụ (Port)', selector: 'input[name="srvPort"]', expected: '8080', type: 'text_exact' },
                { name: 'IP máy chủ LAN', selector: 'input[name="srvIp"]', expected: '192.168.1.100', type: 'text_exact' }
            ]
        },
        dns_config: {
            name: 'Cấu hình Máy chủ DNS Phân giải tên miền',
            subtitle: 'Thay đổi địa chỉ DNS Primary và Secondary sang hệ thống DNS đáng tin cậy',
            instructions: [
                'Bước 1: Truy cập mục Cài đặt DNS (DNS Configuration)',
                'Bước 2: Bỏ chọn nhận DNS tự động từ ISP nếu có',
                'Bước 3: Điền Primary DNS Server (8.8.8.8)',
                'Bước 4: Điền Secondary DNS Server (8.8.4.4)',
                'Bước 5: Nhấn Lưu để áp dụng cấu hình DNS'
            ],
            url: '/cgi-bin/index.asp?page=home_dns.asp',
            rules: [
                { name: 'Primary DNS', selector: 'input[name="dns1"]', expected: '8.8.8.8', type: 'text_exact' },
                { name: 'Secondary DNS', selector: 'input[name="dns2"]', expected: '8.8.4.4', type: 'text_exact' }
            ]
        }
    };

    // Helper escapeHtml
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

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
                    ⚠️ Không thể tải danh sách bài thực hành: ${escapeHtml(err.message || 'Lỗi kết nối')}
                </div>
            `;
        }
    }

    function populateDeviceDropdown(devices) {
        const deviceSelect = document.getElementById('labsDeviceFilter');
        const modalDeviceSelect = document.getElementById('modalLabDevice');
        if (!devices || !devices.length) return;

        const optionsHtml = devices.map(d => `<option value="${escapeHtml(d.device_id)}">${escapeHtml(d.device_name || d.model || d.device_id)}</option>`).join('');

        if (deviceSelect) {
            const currentVal = deviceSelect.value;
            deviceSelect.innerHTML = `<option value="">-- Tất cả các dòng thiết bị --</option>` + optionsHtml;
            if (currentVal) deviceSelect.value = currentVal;
        }

        if (modalDeviceSelect) {
            const curModalVal = modalDeviceSelect.value;
            modalDeviceSelect.innerHTML = optionsHtml;
            if (curModalVal) modalDeviceSelect.value = curModalVal;
        }
    }

    function renderLabsGrid(labs) {
        const grid = document.getElementById('labsGrid');
        if (!grid) return;

        const searchKeyword = (document.getElementById('labsSearchInput')?.value || '').toLowerCase().trim();
        const filteredLabs = (labs || []).filter(lab => {
            if (!searchKeyword) return true;
            const text = `${lab.lab_name || ''} ${lab.lab_id || ''} ${lab.device_name || ''} ${lab.subtitle || ''}`.toLowerCase();
            return text.includes(searchKeyword);
        });

        if (!filteredLabs.length) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--ui-surface); border: 1px dashed var(--ui-border); border-radius: 12px; color: var(--text-muted);">
                    📁 Chưa có bài thực hành nào phù hợp. Nhấn nút <strong>"+ Tạo Bài Lab Mới"</strong> để biên soạn bài học!
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredLabs.map(lab => {
            const labId = escapeHtml(lab.lab_id);
            const labName = escapeHtml(lab.lab_name || lab.title || 'Bài thực hành');
            const deviceName = escapeHtml(lab.device_name || lab.model || lab.device_id);
            const isCustom = Boolean(lab.is_custom);
            const isActive = Boolean(lab.is_active);
            const subtitle = escapeHtml(lab.subtitle || 'Thực hành cấu hình thiết bị');
            const rulesCount = Array.isArray(lab.grading_rules) ? lab.grading_rules.length : 0;
            const practiceUrl = escapeHtml(lab.practice_url || '');

            const badge = isCustom
                ? `<span class="lab-card-badge badge-custom">⭐ Giảng viên tạo</span>`
                : `<span class="lab-card-badge badge-builtin">👑 Chuẩn hệ thống</span>`;

            const statusBadge = isActive
                ? `<span style="color: #22c55e; font-size: 11.5px; font-weight: 600;">● Đang bật</span>`
                : `<span style="color: #ef4444; font-size: 11.5px; font-weight: 600;">○ Tạm ẩn</span>`;

            let actionsHtml = '';
            if (isCustom) {
                actionsHtml = `
                    <button type="button" class="button secondary" style="padding: 4px 10px; font-size: 12px;" onclick="window.viewLabInstructions('${labId}')">👁️ Đề bài</button>
                    <button type="button" class="button secondary" style="padding: 4px 10px; font-size: 12px; color: ${isActive ? '#ef4444' : '#22c55e'};" onclick="window.toggleLabStatus('${labId}', ${!isActive})">
                        ${isActive ? 'Ẩn' : 'Bật lại'}
                    </button>
                `;
            } else {
                actionsHtml = `
                    <button type="button" class="button secondary" style="padding: 4px 10px; font-size: 12px;" onclick="window.viewLabInstructions('${labId}')">👁️ Xem đề bài</button>
                `;
            }

            return `
                <div class="lab-card">
                    <div>
                        <div class="lab-card-header">
                            <div>
                                <span style="font-size: 11.5px; color: #0284c7; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${deviceName}</span>
                                <div class="lab-card-title" style="margin-top: 4px;">${labName}</div>
                            </div>
                            <div>${badge}</div>
                        </div>
                        <div class="lab-card-desc">${subtitle}</div>
                        ${practiceUrl ? `<div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 12px; font-family: monospace; word-break: break-all;">🔗 ${practiceUrl}</div>` : ''}
                    </div>

                    <div class="lab-card-meta">
                        <div>
                            <span>${statusBadge}</span>
                            ${isCustom ? `<span style="margin-left: 8px; color: var(--text-muted);">• ${rulesCount} tiêu chuẩn chấm</span>` : ''}
                        </div>
                        <div class="lab-card-actions">
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Mở Modal Soạn Lab
    function openCreateLabModal() {
        const modal = document.getElementById('modalCreateLab');
        if (!modal) return;

        // Reset form
        document.getElementById('formCreateLab')?.reset();
        const rulesContainer = document.getElementById('modalGradingRulesContainer');
        if (rulesContainer) {
            rulesContainer.innerHTML = '';
        }

        // Đảm bảo dropdown thiết bị có dữ liệu
        const modalDevSelect = document.getElementById('modalLabDevice');
        if (modalDevSelect && (!modalDevSelect.options || modalDevSelect.options.length <= 1) && currentDevices.length > 0) {
            populateDeviceDropdown(currentDevices);
        }

        // Ưu tiên dòng thiết bị đang được lọc ở thanh công cụ ngoài
        const currentFilterDev = document.getElementById('labsDeviceFilter')?.value;
        if (currentFilterDev && modalDevSelect) {
            modalDevSelect.value = currentFilterDev;
        } else if (modalDevSelect && modalDevSelect.options.length > 0 && !modalDevSelect.value) {
            modalDevSelect.selectedIndex = 0;
        }

        // Mặc định chọn preset wan_pppoe để điền sẵn gợi ý
        const presetSelect = document.getElementById('modalLabPreset');
        if (presetSelect) {
            presetSelect.value = 'wan_pppoe';
            handlePresetChange({ target: presetSelect });
        } else {
            addRuleRow('', '', '', 'text_exact');
        }

        modal.hidden = false;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');

        // Focus vào ô tên bài học
        setTimeout(() => {
            document.getElementById('modalLabName')?.focus();
        }, 100);
    }

    // Đóng Modal Soạn Lab
    function closeCreateLabModal() {
        const modal = document.getElementById('modalCreateLab');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modal.hidden = true;
    }

    // Thêm dòng tiêu chí chấm điểm trong Modal
    function addRuleRow(name = '', selector = '', expected = '', type = 'text_exact') {
        const container = document.getElementById('modalGradingRulesContainer');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'rule-item-row';
        row.innerHTML = `
            <input type="text" class="form-control rule-name" placeholder="Tên tiêu chí (VD: PPPoE User)" value="${escapeHtml(name)}">
            <input type="text" class="form-control rule-selector" placeholder="CSS Selector (VD: input[name='wan_PPPUsername'])" value="${escapeHtml(selector)}">
            <input type="text" class="form-control rule-expected" placeholder="Giá trị đúng (VD: fpt-student-2026)" value="${escapeHtml(expected)}">
            <button type="button" class="btn-remove-rule" title="Xóa tiêu chí này">✕</button>
        `;

        row.querySelector('.btn-remove-rule')?.addEventListener('click', () => {
            row.remove();
        });

        container.appendChild(row);
    }

    // Áp dụng cấu hình mẫu khi chọn preset
    function handlePresetChange(e) {
        const presetKey = e ? e.target.value : (document.getElementById('modalLabPreset')?.value || 'custom');
        const template = PRESET_TEMPLATES[presetKey];
        if (!template) return;

        const urlInput = document.getElementById('modalLabPracticeUrl');
        const rulesContainer = document.getElementById('modalGradingRulesContainer');
        const nameInput = document.getElementById('modalLabName');
        const subtitleInput = document.getElementById('modalLabSubtitle');
        const instructionsInput = document.getElementById('modalLabInstructions');

        const deviceId = document.getElementById('modalLabDevice')?.value || 'DEV_AC1000F';
        const devFolder = getSimulatorFolderByDeviceId(deviceId);

        if (urlInput) {
            if (template.url) {
                urlInput.value = `/${devFolder}${template.url}`;
            } else if (presetKey === 'custom' && !urlInput.value) {
                urlInput.value = `/${devFolder}/index.html`;
            }
        }

        if (nameInput && template.name) {
            nameInput.value = template.name;
        }
        if (subtitleInput && template.subtitle) {
            subtitleInput.value = template.subtitle;
        }
        if (instructionsInput && Array.isArray(template.instructions) && template.instructions.length > 0) {
            instructionsInput.value = template.instructions.join('\n');
        }

        if (rulesContainer) {
            rulesContainer.innerHTML = '';
            if (template.rules && template.rules.length > 0) {
                template.rules.forEach(r => addRuleRow(r.name, r.selector, r.expected, r.type));
            } else {
                addRuleRow('', '', '', 'text_exact');
            }
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

        if (!deviceId) {
            notify('⚠️ Vui lòng chọn dòng thiết bị áp dụng bài thực hành.', 'error');
            document.getElementById('modalLabDevice')?.focus();
            return;
        }

        if (!labName) {
            notify('⚠️ Vui lòng nhập tên bài thực hành.', 'error');
            document.getElementById('modalLabName')?.focus();
            return;
        }

        if (!practiceUrl) {
            notify('⚠️ Vui lòng nhập đường dẫn trang thực hành (Practice URL).', 'error');
            document.getElementById('modalLabPracticeUrl')?.focus();
            return;
        }

        // Parse instructions
        const instructions = instructionsRaw
            ? instructionsRaw.split('\n').map(s => s.trim()).filter(Boolean)
            : ['<b>Yêu cầu:</b>', 'Thực hiện cấu hình các thông số trên thiết bị theo yêu cầu.'];

        // Collect grading rules
        const gradingRules = [];
        document.querySelectorAll('#modalGradingRulesContainer .rule-item-row').forEach((row, idx) => {
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
        const origContent = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>⏳ Đang lưu bài học...</span>';
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
                const msg = data.error?.message || data.message || 'Không thể tạo bài thực hành.';
                notify('⚠️ Lỗi: ' + msg, 'error');
                return;
            }

            notify(`✅ Đã tạo thành công bài thực hành mới: "${labName}"!`, 'success');
            closeCreateLabModal();

            // Chuyển bộ lọc thiết bị về đúng dòng thiết bị vừa tạo để hiển thị ngay
            const deviceFilter = document.getElementById('labsDeviceFilter');
            if (deviceFilter) {
                deviceFilter.value = deviceId;
            }

            await loadLabsManagementList();
        } catch (err) {
            console.error('[LabsManagement] Error creating lab:', err);
            notify('⚠️ Lỗi kết nối máy chủ: ' + (err.message || 'Không gửi được bài thực hành'), 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origContent || '<span>Lưu & Phát hành Bài Lab</span>';
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
            notify(`Đã ${actionText} bài thực hành thành công!`, 'info');
            loadLabsManagementList();
        } catch (err) {
            notify('⚠️ Lỗi: ' + err.message, 'error');
        }
    }

    // Xem đề bài
    function viewLabInstructions(labId) {
        const lab = currentLabs.find(l => l.lab_id === labId);
        if (!lab) return;

        const viewModal = document.getElementById('modalViewLabInstructions');
        const viewTitle = document.getElementById('modalInstructionsTitle');
        const viewSubtitle = document.getElementById('modalInstructionsSubtitle');
        const viewBody = document.getElementById('modalInstructionsBody');

        if (viewModal && viewBody) {
            if (viewTitle) viewTitle.textContent = lab.lab_name || lab.title || 'Đề bài thực hành';
            if (viewSubtitle) viewSubtitle.textContent = `${lab.device_name || lab.device_id} • ${lab.subtitle || ''}`;

            let stepsHtml = '';
            if (Array.isArray(lab.instructions) && lab.instructions.length > 0) {
                stepsHtml = `<h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px;">📋 Các bước thực hiện:</h4><ol style="margin: 0 0 16px 20px; padding: 0; line-height: 1.6; color: #334155;">` +
                    lab.instructions.map(step => `<li>${step}</li>`).join('') +
                    `</ol>`;
            } else {
                stepsHtml = `<p style="color: #64748b; font-style: italic;">Chưa có bước hướng dẫn chi tiết.</p>`;
            }

            let rulesHtml = '';
            if (Array.isArray(lab.grading_rules) && lab.grading_rules.length > 0) {
                rulesHtml = `<h4 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 14px;">🎯 Tiêu chuẩn chấm điểm tự động (${lab.grading_rules.length} tiêu chí):</h4><div style="display: flex; flex-direction: column; gap: 8px;">` +
                    lab.grading_rules.map((r, i) => `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 13px;">
                            <strong style="color: #0f172a;">${i + 1}. ${escapeHtml(r.name || r.id)}</strong><br>
                            <span style="color: #64748b; font-family: monospace; font-size: 12px;">Selector: ${escapeHtml(r.selector)}</span> •
                            <span style="color: #0284c7; font-weight: 600;">Giá trị đúng: [${escapeHtml(r.expected)}]</span>
                        </div>
                    `).join('') + `</div>`;
            }

            let pathHtml = lab.practice_url
                ? `<div style="margin-top: 14px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569;">🔗 <strong>Đường dẫn trang thực hành:</strong> <span style="font-family: monospace;">${escapeHtml(lab.practice_url)}</span></div>`
                : '';

            viewBody.innerHTML = stepsHtml + rulesHtml + pathHtml;
            viewModal.hidden = false;
            viewModal.classList.add('open');
            viewModal.setAttribute('aria-hidden', 'false');
            return;
        }

        // Fallback alert
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

    function closeViewInstructionsModal() {
        const modal = document.getElementById('modalViewLabInstructions');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modal.hidden = true;
    }

    // Helper notification
    function notify(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            alert(message);
        }
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

        // Filter & Search
        document.getElementById('labsDeviceFilter')?.addEventListener('change', loadLabsManagementList);
        document.getElementById('labsSearchInput')?.addEventListener('input', () => renderLabsGrid(currentLabs));
        document.getElementById('btnRefreshLabs')?.addEventListener('click', loadLabsManagementList);

        // Mở modal tạo lab (bắt cả 2 ID để tránh lệch)
        document.getElementById('btnOpenCreateLabModal')?.addEventListener('click', openCreateLabModal);
        document.getElementById('btnOpenCreateLab')?.addEventListener('click', openCreateLabModal);

        // Đóng modal tạo lab
        document.getElementById('btnCloseModalCreateLab')?.addEventListener('click', closeCreateLabModal);
        document.getElementById('btnCancelCreateLab')?.addEventListener('click', closeCreateLabModal);

        // Đóng modal xem hướng dẫn
        document.getElementById('btnCloseInstructionsModal')?.addEventListener('click', closeViewInstructionsModal);

        // Click ngoài backdrop để đóng
        const modalCreate = document.getElementById('modalCreateLab');
        if (modalCreate) {
            modalCreate.addEventListener('click', function (e) {
                if (e.target === modalCreate) closeCreateLabModal();
            });
        }
        const modalView = document.getElementById('modalViewLabInstructions');
        if (modalView) {
            modalView.addEventListener('click', function (e) {
                if (e.target === modalView) closeViewInstructionsModal();
            });
        }

        // Bấm Escape để đóng modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeCreateLabModal();
                closeViewInstructionsModal();
            }
        });

        // Thêm tiêu chí chấm
        document.getElementById('btnAddGradingRule')?.addEventListener('click', () => addRuleRow());

        // Thay đổi preset
        document.getElementById('modalLabPreset')?.addEventListener('change', handlePresetChange);

        // Form submit
        document.getElementById('formCreateLab')?.addEventListener('submit', handleSaveNewLab);

        // Khi đổi thiết bị trong modal, cập nhật prefix URL
        document.getElementById('modalLabDevice')?.addEventListener('change', () => {
            const presetSelect = document.getElementById('modalLabPreset');
            if (presetSelect && presetSelect.value !== 'custom') {
                handlePresetChange({ target: presetSelect });
            } else {
                const urlInput = document.getElementById('modalLabPracticeUrl');
                const deviceId = document.getElementById('modalLabDevice')?.value || 'DEV_AC1000F';
                const devFolder = getSimulatorFolderByDeviceId(deviceId);
                if (urlInput) urlInput.value = `/${devFolder}/index.html`;
            }
        });

        // Kiểm tra nếu view hiện tại là labs khi vừa tải trang
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
    window.closeViewInstructionsModal = closeViewInstructionsModal;
    window.toggleLabStatus = toggleLabStatus;
    window.viewLabInstructions = viewLabInstructions;
    window.switchToLabsViewManual = switchToLabsViewManual;
})();
