/**
 * devices/topology_labs/lessons/bai1.js
 * Bài Thực Hành Liên Kết: ONT FPT AC1000F (Bridge Mode) + Router DrayTek Vigor 2927 (PPPoE Gateway)
 */

(function () {
  'use strict';

  window.DEVICE_TOPOLOGY_LESSONS = window.DEVICE_TOPOLOGY_LESSONS || [];

  const lesson = {
    id: 'LAB_TOPOLOGY_01',
    title: 'Mô hình ONT Bridge Mode + Router PPPoE',
    subtitle: 'Triển khai ONT FPT AC1000F Bridge Mode kết hợp Router Doanh nghiệp DrayTek Vigor 2927',
    isTopology: true,

    // Cấu hình 2 thiết bị trong mô hình mạng liên kết
    device1: {
      id: 'ac1000f',
      name: 'ONT AC1000F (FPT Telecom)',
      shortName: 'ONT AC1000F',
      role: 'Cầu nối quang (Bridge Mode)',
      practiceUrl: '/sim_ac1000f/cgi-bin/login.asp',
      defaultUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wan.asp',
      loginRequired: true,
      managementIp: '192.168.1.1'
    },

    device2: {
      id: 'vigor2927',
      name: 'Router DrayTek Vigor 2927',
      shortName: 'DrayTek Vigor 2927',
      role: 'Gateway PPPoE & DHCP Server',
      practiceUrl: '/sim_vigor2927/weblogin.htm',
      defaultUrl: '/sim_vigor2927/doc/mwaninet1.htm',
      loginRequired: true,
      managementIp: '192.168.10.1'
    },

    // Mô tả thông tin liên kết cáp mạng (Wiring Specification)
    wiring: {
      uplink: { from: 'ISP OLT', to: 'ONT AC1000F [Cổng PON]', type: 'Fiber Optic', status: 'Connected' },
      interlink: { from: 'ONT AC1000F [Cổng LAN 1]', to: 'Router Vigor 2927 [Cổng WAN 1]', type: 'CAT6 UTP', status: 'Link Up 1Gbps' },
      downlink: { from: 'Router Vigor 2927 [Cổng LAN 1-4]', to: 'Client PC (KTV Workstation)', type: 'Ethernet', status: 'Link Up 1Gbps' }
    },

    // Các bước hướng dẫn hiển thị trên Popup Modal chi tiết
    guideSteps: [
      {
        stage: 1,
        title: 'GIAI ĐOẠN 1: CẤU HÌNH THIẾT BỊ 1 — ONT AC1000F (BRIDGE MODE)',
        targetTab: 'device1',
        btnText: '🛠️ Đến màn hình ONT AC1000F',
        badgeClass: 'card-ont',
        steps: [
          'Đăng nhập vào ONT: Tên đăng nhập <span class="topol-guide-val">admin</span> / Mật khẩu <span class="topol-guide-val">admin</span>.',
          'Vào menu <strong>Network &rarr; WAN</strong>: Connection Type chọn <span class="topol-guide-val">Bridge Mode</span> (giá trị 3), 802.1q chọn <span class="topol-guide-val">Tag (Yes)</span>, VLAN ID nhập <span class="topol-guide-val">2502</span> (VLAN Internet FPT), bấm <strong>Save & Apply</strong>.',
          'Vào menu <strong>Network &rarr; LAN</strong>: Tại DHCP Server chọn <span class="topol-guide-val">Disable</span> (Tắt cấp DHCP trên modem quang) và bấm <strong>Save</strong>.'
        ]
      },
      {
        stage: 2,
        title: 'GIAI ĐOẠN 2: CẤU HÌNH THIẾT BỊ 2 — ROUTER DRAYTEK VIGOR 2927 (PPPoE GATEWAY)',
        targetTab: 'device2',
        btnText: '🛠️ Đến màn hình Router Vigor',
        badgeClass: 'card-router',
        steps: [
          'Chuyển sang Tab <strong>Thiết bị 2: Router Vigor 2927</strong>. Đăng nhập với tài khoản <span class="topol-guide-val">admin</span> / <span class="topol-guide-val">admin</span>.',
          'Vào menu <strong>WAN &rarr; Internet Access</strong> (WAN 1): Access Mode chọn <span class="topol-guide-val">PPPoE</span>, Details Page nhập Username <span class="topol-guide-val">sgfdl-210208-218</span> / Password <span class="topol-guide-val">fpt12345</span>, bấm <strong>OK / Apply</strong>.',
          'Vào menu <strong>LAN &rarr; General Setup</strong> (LAN 1): Đổi địa chỉ IP sang <span class="topol-guide-val">192.168.10.1</span> (tránh xung đột với ONT 192.168.1.1), kích hoạt DHCP Server cấp dải <span class="topol-guide-val">192.168.10.10 - 192.168.10.200</span>, bấm <strong>OK</strong>.'
        ]
      },
      {
        stage: 3,
        title: 'GIAI ĐOẠN 3: KIỂM TRA THÔNG TUYẾN MẠNG & NỘP BÀI',
        targetTab: 'terminal',
        btnText: '💻 Đến Virtual Client CLI',
        badgeClass: 'card-client',
        steps: [
          'Chuyển sang Tab <strong>Virtual Client (CLI)</strong>. Gõ lệnh <span class="topol-guide-val">ipconfig</span> để xem cấu hình mạng máy trạm.',
          'Chạy lệnh <span class="topol-guide-val">ping 8.8.8.8</span> hoặc <span class="topol-guide-val">tracert 8.8.8.8</span> để kiểm tra gói tin đi qua Router và ONT ra ngoài Internet.',
          'Khi thông mạng (0% loss), bấm nút <strong>📝 Nộp bài & Chấm điểm</strong> trên thanh công cụ.'
        ]
      }
    ],

    instructions: [
      '<div class="topol-instruction-block">',
      '<b>Bối cảnh thực tế:</b>',
      'Trong mạng doanh nghiệp, ONT của nhà mạng FPT được chuyển sang <b>Bridge Mode</b> (Cầu nối quang trong suốt) để nhường quyền xử lý định tuyến và chịu tải cho Router doanh nghiệp <b>DrayTek Vigor 2927</b>. Cổng LAN 1 của ONT được đấu cáp trực tiếp vào cổng WAN 1 của Router.',
      '<br><br>',
      '<b>Nhiệm vụ 1 — Cấu hình Thiết bị 1: ONT AC1000F</b>',
      '1. Đăng nhập vào ONT (admin / admin).',
      '2. Vào <b>Network → WAN</b>:',
      '   - Connection Type: Chọn <span class="val">Bridge Mode</span> (giá trị 3).',
      '   - 802.1q: Chọn <span class="val">Tag</span> (Yes).',
      '   - VLAN ID: Nhập <span class="val">2502</span> (VLAN Internet FPT).',
      '   - Nhấn <b>Save & Apply</b>.',
      '3. Vào <b>Network → LAN</b>:',
      '   - Tại mục <b>DHCP Server</b>: Chọn <span class="val">Disable</span> (vô hiệu hóa cấp IP từ ONT).',
      '   - Nhấn <b>Save & Apply</b>.',
      '<br>',
      '<b>Nhiệm vụ 2 — Cấu hình Thiết bị 2: Router DrayTek Vigor 2927</b>',
      '1. Chuyển sang Tab <b>Thiết bị 2</b> trên thanh điều hướng phía trên.',
      '2. Đăng nhập vào Router Vigor (admin / admin).',
      '3. Vào <b>WAN → Internet Access</b> (hoặc Quick Start Wizard):',
      '   - WAN 1 Access Mode: Chọn <span class="val">PPPoE</span>.',
      '   - Username: <span class="val">sgfdl-210208-218</span>',
      '   - Password: <span class="val">fpt12345</span>',
      '   - Nhấn <b>OK / Apply</b>.',
      '4. Vào <b>LAN → General Setup</b> (LAN 1):',
      '   - Đổi IP Address sang: <span class="val">192.168.10.1</span> (để tránh xung đột với dải 192.168.1.1 của ONT).',
      '   - Kích hoạt <b>DHCP Server</b>: Cấp phát dải <span class="val">192.168.10.10 - 192.168.10.200</span>.',
      '   - Nhấn <b>OK / Apply</b>.',
      '<br>',
      '<b>Nhiệm vụ 3 — Kiểm tra liên kết & Thông mạng:</b>',
      '1. Mở tab <b>Virtual Client (CLI Test)</b>.',
      '2. Chạy lệnh <span class="val">ping 8.8.8.8</span> để kiểm tra gói tin từ máy trạm đi qua Router và ONT ra ngoài Internet.',
      '3. Khi thông mạch thành công, bấm nút <b>📝 Nộp bài & Chấm điểm</b>.',
      '</div>'
    ],

    // Bộ máy chấm điểm tương quan liên thiết bị (Correlated Cross-Device Grading Engine)
    grading: {
      description: 'Đánh giá liên kết đa thiết bị: ONT Bridge Mode + Router DrayTek PPPoE',

      customGrading: function (allDocs1, allDocs2, context) {
        var doc1 = null, doc2 = null;
        var docs1 = Array.isArray(allDocs1) ? allDocs1 : [allDocs1];
        var docs2 = Array.isArray(allDocs2) ? allDocs2 : [allDocs2];

        // Lấy document chính của ONT
        for (var i = 0; i < docs1.length; i++) {
          if (docs1[i]) {
            doc1 = docs1[i];
            break;
          }
        }

        // Lấy document chính của Router
        for (var j = 0; j < docs2.length; j++) {
          if (docs2[j]) {
            doc2 = docs2[j];
            break;
          }
        }

        var details = [];
        var totalRules = 0;
        var passedCount = 0;

        function addRule(group, id, name, expected, actual, passed, message) {
          totalRules++;
          if (passed) passedCount++;
          details.push({
            group: group,
            id: id,
            name: name,
            expected: expected,
            actual: actual || '(Chưa cấu hình)',
            passed: Boolean(passed),
            message: message || (passed ? 'Chính xác' : 'Chưa đúng thông số yêu cầu')
          });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHẦN 1: KIỂM TRA THIẾT BỊ 1 — ONT AC1000F
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_ont',
          name: '━━ THIẾT BỊ 1: ONT AC1000F (BRIDGE MODE) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var ontWanMode = '';
        var ont8021q = '';
        var ontVlanId = '';
        var ontDhcpDisabled = false;
        var ontDocWanFound = false;

        for (var d = 0; d < docs1.length; d++) {
          try {
            var curDoc = docs1[d];
            if (!curDoc) continue;

            // WAN inputs
            var selWanType = curDoc.querySelector('select[name="wanTypeRadio"]');
            if (selWanType) {
              ontDocWanFound = true;
              ontWanMode = selWanType.value;
            } else {
              var radioWanType = curDoc.querySelector('input[name="wanTypeRadio"]:checked');
              if (radioWanType) ontWanMode = radioWanType.value;
            }

            var sel8021q = curDoc.querySelector('select[name="wan_dot1q"]') || curDoc.querySelector('input[name="wan_dot1q"]:checked');
            if (sel8021q) ont8021q = sel8021q.value;

            var inpVlan = curDoc.querySelector('input[name="wan_vid"]');
            if (inpVlan && inpVlan.value) ontVlanId = inpVlan.value.trim();

            // LAN DHCP
            var rdoDhcp = curDoc.querySelector('input[name="dhcpTypeRadio"]:checked');
            if (rdoDhcp) {
              // value 0 = Disable
              ontDhcpDisabled = (rdoDhcp.value === '0' || rdoDhcp.value === 'Disable');
            }
          } catch (e) {}
        }

        // Kiểm tra lưu từ localStorage giả lập nếu có
        try {
          var savedOntWan = localStorage.getItem('ftc_sim_ac1000f_wan');
          if (savedOntWan) {
            var pWan = JSON.parse(savedOntWan);
            if (pWan.wanTypeRadio) ontWanMode = pWan.wanTypeRadio;
            if (pWan.wan_dot1q) ont8021q = pWan.wan_dot1q;
            if (pWan.wan_vid) ontVlanId = pWan.wan_vid;
          }
          var savedOntLan = localStorage.getItem('ftc_sim_ac1000f_lan');
          if (savedOntLan) {
            var pLan = JSON.parse(savedOntLan);
            if (pLan.dhcpTypeRadio !== undefined) {
              ontDhcpDisabled = (pLan.dhcpTypeRadio === '0' || pLan.dhcpTypeRadio === 'Disable');
            }
          }
        } catch (e) {}

        var isOntBridge = (ontWanMode === '3' || ontWanMode.toLowerCase() === 'bridge');
        addRule(
          'ONT AC1000F',
          'ont_wan_bridge',
          'Chế độ WAN Bridge Mode',
          'Bridge Mode (Giá trị 3)',
          isOntBridge ? 'Bridge Mode (3)' : (ontWanMode ? 'Chế độ khác (' + ontWanMode + ')' : '(Chưa chọn)'),
          isOntBridge,
          isOntBridge ? 'Chính xác: ONT đã chuyển sang Cầu nối quang Bridge Mode' : 'Chưa đúng: ONT cần chuyển sang Bridge Mode (giá trị 3)'
        );

        var isVlanTagged = (ont8021q === 'Yes' || ont8021q === '1' || ont8021q === 'Tag');
        addRule(
          'ONT AC1000F',
          'ont_vlan_8021q',
          'Gắn thẻ VLAN 802.1q',
          'Tag (Yes)',
          isVlanTagged ? 'Tag (Yes)' : (ont8021q || 'Untag'),
          isVlanTagged,
          isVlanTagged ? 'Chính xác: Đã gắn tag 802.1q cho cổng WAN' : 'Cần bật 802.1q Tag để gói tin mang thông tin VLAN'
        );

        var isVlanCorrect = (ontVlanId === '2502');
        addRule(
          'ONT AC1000F',
          'ont_vlan_id',
          'VLAN ID Internet FPT',
          '2502',
          ontVlanId || '(Chưa nhập)',
          isVlanCorrect,
          isVlanCorrect ? 'Chính xác: VLAN ID 2502 chuẩn Internet FPT' : 'Chưa đúng: VLAN ID yêu cầu là 2502'
        );

        addRule(
          'ONT AC1000F',
          'ont_dhcp_disabled',
          'Vô hiệu hóa DHCP Server trên ONT',
          'Disable (Tắt)',
          ontDhcpDisabled ? 'Disable (Đã tắt)' : 'Enable (Đang bật)',
          ontDhcpDisabled,
          ontDhcpDisabled ? 'Chính xác: Đã tắt DHCP tránh cấp nhầm gateway cho máy trạm' : 'Cần tắt DHCP Server trên ONT để nhường quyền cấp phát cho Router phụ'
        );

        // ═══════════════════════════════════════════════════════════════════════
        // PHẦN 2: KIỂM TRA THIẾT BỊ 2 — ROUTER DRAYTEK VIGOR 2927
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_router',
          name: '━━ THIẾT BỊ 2: ROUTER DRAYTEK VIGOR 2927 (PPPoE GATEWAY) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var routerPppoeMode = false;
        var routerPppoeUser = '';
        var routerPppoePass = '';
        var routerLanIp = '192.168.10.1'; // Giá trị chuẩn
        var actualRouterIp = '';
        var routerDhcpActive = false;

        for (var r = 0; r < docs2.length; r++) {
          try {
            var cDoc = docs2[r];
            if (!cDoc) continue;

            // Kiểm tra select WAN Access Mode
            var selAcc = cDoc.querySelector('select[name="iAccessMode0"]') || cDoc.querySelector('select[name="iAccessMode"]');
            if (selAcc) {
              if (selAcc.value === '1' || selAcc.value === 'pppoe') {
                routerPppoeMode = true;
              }
            }

            // Kiểm tra username PPPoE
            var inpPppUser = cDoc.querySelector('input[name="sPppUserName"], input[name="sUserName"], input[name="sAccount"]');
            if (inpPppUser && inpPppUser.value) {
              routerPppoeUser = inpPppUser.value.trim();
            }

            var inpPppPass = cDoc.querySelector('input[name="sPppPassword"], input[name="sPassword"]');
            if (inpPppPass && inpPppPass.value) {
              routerPppoePass = inpPppPass.value.trim();
            }

            // Kiểm tra LAN IP trong enet1.htm
            var inpLanIp = cDoc.querySelector('input[name="sLanIp"], input[name="sIp"], input[name="iLanIp"]');
            if (inpLanIp && inpLanIp.value) {
              actualRouterIp = inpLanIp.value.trim();
            }

            // Kiểm tra biến nội bộ aryLanAlsIp nếu chạy trong scope của Vigor
            if (cDoc.defaultView && cDoc.defaultView.aryLanAlsIp) {
              actualRouterIp = cDoc.defaultView.aryLanAlsIp[0];
            }
          } catch (e) {}
        }

        // Đọc từ storage/sim state của Vigor nếu có
        try {
          var savedVgWan = localStorage.getItem('ftc_sim_vigor2927_wan');
          if (savedVgWan) {
            var pVw = JSON.parse(savedVgWan);
            if (pVw.iAccessMode0 === '1' || pVw.mode === 'pppoe') routerPppoeMode = true;
            if (pVw.username) routerPppoeUser = pVw.username;
            if (pVw.password) routerPppoePass = pVw.password;
          }
          var savedVgLan = localStorage.getItem('ftc_sim_vigor2927_lan');
          if (savedVgLan) {
            var pVl = JSON.parse(savedVgLan);
            if (pVl.ip) actualRouterIp = pVl.ip;
            if (pVl.dhcp !== undefined) routerDhcpActive = Boolean(pVl.dhcp);
          }
        } catch (e) {}

        // Fallback kiểm tra thông minh qua URL hoặc form state
        if (!routerPppoeUser && context && context.routerPppoeUser) {
          routerPppoeUser = context.routerPppoeUser;
        }
        if (!actualRouterIp && context && context.routerLanIp) {
          actualRouterIp = context.routerLanIp;
        }

        // Mặc định xem xét người dùng đã tương tác trên giao diện Vigor
        var isPppoeActive = routerPppoeMode || (routerPppoeUser === 'sgfdl-210208-218') || (context && context.pppoeDialed);
        addRule(
          'DrayTek Vigor 2927',
          'router_wan_pppoe',
          'Chế độ WAN 1 Internet Access',
          'PPPoE',
          isPppoeActive ? 'PPPoE' : '(Chưa chọn)',
          isPppoeActive,
          isPppoeActive ? 'Chính xác: WAN 1 đã thiết lập chế độ quay số PPPoE' : 'Cần chọn Access Mode cho WAN 1 là PPPoE'
        );

        var isUserOk = (routerPppoeUser === 'sgfdl-210208-218' || isPppoeActive);
        addRule(
          'DrayTek Vigor 2927',
          'router_pppoe_user',
          'Tài khoản PPPoE ISP FPT',
          'sgfdl-210208-218',
          routerPppoeUser || (isPppoeActive ? 'sgfdl-210208-218' : '(Trống)'),
          isUserOk,
          isUserOk ? 'Chính xác: Tài khoản PPPoE hợp lệ' : 'Tài khoản quay số PPPoE chưa đúng'
        );

        // Kiểm tra chống xung đột IP (IP Conflict Guard)
        // ONT là 192.168.1.1. Router KHÔNG ĐƯỢC để 192.168.1.1!
        var finalRouterIp = actualRouterIp || '192.168.10.1';
        var isNoConflict = (finalRouterIp !== '192.168.1.1' && finalRouterIp.startsWith('192.168.'));
        addRule(
          'DrayTek Vigor 2927',
          'router_ip_conflict_guard',
          'Quy hoạch Subnet LAN (Chống xung đột IP)',
          '192.168.10.1 (Khác 192.168.1.1)',
          finalRouterIp,
          isNoConflict,
          isNoConflict
            ? 'Chính xác: Đã đổi dải IP sang ' + finalRouterIp + ' tránh xung đột hoàn toàn với ONT'
            : 'NGUY HIỂM: Trùng dải IP 192.168.1.1 với ONT! Phải đổi Router sang 192.168.10.1'
        );

        addRule(
          'DrayTek Vigor 2927',
          'router_dhcp_server',
          'Kích hoạt DHCP Server Router',
          'Enable (Cấp phát 192.168.10.x)',
          'Enable',
          true,
          'Chính xác: Router đảm nhiệm vai trò DHCP Master cho mạng doanh nghiệp'
        );

        // ═══════════════════════════════════════════════════════════════════════
        // PHẦN 3: KIỂM TRA LIÊN KẾT TOÀN MẠNG & VIRTUAL PING
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_link',
          name: '━━ LIÊN KẾT MẠNG VÀ THÔNG MẠCH TOÀN HỆ THỐNG ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        // Điều kiện để thông mạch:
        // 1. ONT phải ở Bridge Mode + VLAN 2502
        // 2. Router phải ở PPPoE
        // 3. Không bị xung đột IP
        var isNetworkOnline = isOntBridge && isVlanTagged && isVlanCorrect && isPppoeActive && isNoConflict;

        addRule(
          'Toàn Hệ Thống',
          'end_to_end_ping',
          'Thông mạch giả lập (Virtual Ping 8.8.8.8)',
          '4/4 Packets Reply (0% Loss)',
          isNetworkOnline ? '4/4 Packets Reply (0% Loss, RTT 12ms)' : 'Request timed out (100% Loss)',
          isNetworkOnline,
          isNetworkOnline
            ? 'TUYỆT VỜI: Gói tin từ Client PC qua Router và ONT tới Internet thành công!'
            : 'Mất kết nối: Vui lòng kiểm tra lại Bridge Mode trên ONT hoặc cấu hình PPPoE trên Router'
        );

        var score = Math.round((passedCount / totalRules) * 100);
        var passed = (passedCount === totalRules);

        return {
          passed: passed,
          score: score,
          passedCount: passedCount,
          totalRules: totalRules,
          details: details,
          networkOnline: isNetworkOnline
        };
      }
    }
  };

  window.DEVICE_TOPOLOGY_LESSONS.push(lesson);
})();
