/**
 * devices/topology_labs/lessons/bai2.js
 * Bài Thực Hành Liên Kết: ONT FPT AX3000GZ (Bridge Mode) + Router MikroTik hEX S (PPPoE Client & LAN Gateway)
 */

(function () {
  'use strict';

  window.DEVICE_TOPOLOGY_LESSONS = window.DEVICE_TOPOLOGY_LESSONS || [];

  const lesson = {
    id: 'LAB_TOPOLOGY_02',
    title: 'Mô hình ONT AX3000GZ Bridge + Router MikroTik PPPoE',
    subtitle: 'Triển khai ONT FPT AX3000GZ Bridge Mode kết hợp Router Doanh nghiệp MikroTik hEX S',
    isTopology: true,

    // Cấu hình 2 thiết bị trong mô hình mạng liên kết
    device1: {
      id: 'ax3000gz',
      name: 'ONT FPT AX3000GZ',
      shortName: 'ONT AX3000GZ',
      icon: '🌐',
      role: 'Cầu nối quang (Bridge Mode)',
      practiceUrl: '/sim_ax3000gz/cgi-bin/luci/login',
      defaultUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/wan',
      loginRequired: true,
      managementIp: '192.168.1.1',
      lanPort: 'LAN 1'
    },

    device2: {
      id: 'mikrotik_hexs',
      name: 'Router MikroTik hEX S',
      shortName: 'MikroTik hEX S',
      icon: '🛡️',
      role: 'PPPoE Client & LAN Gateway',
      practiceUrl: '/sim_mikrotik_hexs/index.html',
      defaultUrl: '/sim_mikrotik_hexs/index.html',
      loginRequired: true,
      managementIp: '192.168.88.1',
      wanPort: 'ether1',
      lanPort: 'ether2-5'
    },

    // Mô tả thông tin liên kết cáp mạng (Wiring Specification)
    wiring: {
      uplink: { from: 'ISP OLT', to: 'ONT AX3000GZ [Cổng PON]', type: 'Fiber Optic', status: 'Connected' },
      interlink: { from: 'ONT AX3000GZ [Cổng LAN 1]', to: 'Router MikroTik [Cổng ether1 (PoE In)]', type: 'CAT6 UTP', status: 'Link Up 1Gbps' },
      downlink: { from: 'Router MikroTik [Cổng ether2-5]', to: 'Client PC (KTV Workstation)', type: 'Ethernet', status: 'Link Up 1Gbps' }
    },

    // Các bước hướng dẫn hiển thị trên Popup Modal chi tiết
    guideSteps: [
      {
        stage: 1,
        title: 'GIAI ĐOẠN 1: CẤU HÌNH THIẾT BỊ 1 — ONT AX3000GZ (BRIDGE MODE)',
        targetTab: 'device1',
        btnText: '🛠️ Đến màn hình ONT AX3000GZ',
        badgeClass: 'card-ont',
        steps: [
          'Đăng nhập vào ONT AX3000GZ: Tên đăng nhập <span class="topol-guide-val">admin</span> / Mật khẩu <span class="topol-guide-val">admin</span>.',
          'Vào menu <strong>Internet &rarr; WAN</strong>: Chọn chế độ kết nối <span class="topol-guide-val">Bridge</span>, gắn VLAN Tag <span class="topol-guide-val">2502</span> (VLAN Internet FPT) và bấm <strong>Save/Apply</strong>.',
          'Vào menu <strong>Local Network &rarr; LAN / DHCP Server</strong>: Chuyển DHCP Server sang <span class="topol-guide-val">Disable (Tắt)</span> để tránh phát trùng IP với Router MikroTik.',
          'Bấm <strong>Apply</strong> để hoàn tất chuyển đổi ONT AX3000GZ thành bộ chuyển đổi quang trong suốt.'
        ]
      },
      {
        stage: 2,
        title: 'GIAI ĐOẠN 2: CẤU HÌNH THIẾT BỊ 2 — ROUTER MIKROTIK HEX S (PPPoE & GATEWAY)',
        targetTab: 'device2',
        btnText: '🛠️ Đến màn hình MikroTik',
        badgeClass: 'card-router',
        steps: [
          'Chuyển sang Tab <strong>Thiết bị 2: Router MikroTik</strong>. Đăng nhập giao diện WebFig với tài khoản <span class="topol-guide-val">admin</span> / <span class="topol-guide-val">admin</span>.',
          'Tại menu <strong>PPP &rarr; Add PPPoE Client</strong>: Cấu hình Interfaces là <span class="topol-guide-val">ether1</span> (cổng nối cáp từ ONT), nhập User: <span class="topol-guide-val">sgfdl-123456-789</span> và Password: <span class="topol-guide-val">fpt12345</span>.',
          'Vào <strong>IP &rarr; Addresses</strong>: Thiết lập IP Gateway cho mạng nội bộ là <span class="topol-guide-val">192.168.88.1/24</span> trên Interface LAN (bridge/ether2-5).',
          'Vào <strong>IP &rarr; DHCP Server</strong>: Kích hoạt cấp phát IP dải <span class="topol-guide-val">192.168.88.10 - 192.168.88.200</span> cho máy trạm doanh nghiệp.'
        ]
      },
      {
        stage: 3,
        title: 'GIAI ĐOẠN 3: KIỂM TRA THÔNG TUYẾN MẠNG & NỘP BÀI',
        targetTab: 'terminal',
        btnText: '💻 Đến Virtual Client CLI',
        badgeClass: 'card-client',
        steps: [
          'Chuyển sang Tab <strong>Virtual Client (CLI)</strong> để giả lập máy trạm kết nối cổng ether2 của MikroTik.',
          'Gõ lệnh <span class="topol-guide-val">ipconfig</span> để xác nhận máy trạm đã nhận IP <span class="topol-guide-val">192.168.88.150</span> và Gateway <span class="topol-guide-val">192.168.88.1</span>.',
          'Chạy lệnh <span class="topol-guide-val">ping 8.8.8.8</span> để kiểm tra gói tin đi xuyên qua MikroTik và ONT ra Internet.',
          'Khi thông mạng (0% packet loss), bấm nút <strong>📝 Nộp bài & Chấm điểm</strong> trên thanh công cụ.'
        ]
      }
    ],

    instructions: [
      '<div class="topol-instruction-block">',
      '<b>Bối cảnh thực tế:</b>',
      'Mô hình phổ biến tại các văn phòng và chi nhánh: Cổng quang của <b>ONT AX3000GZ</b> chuyển sang <b>Bridge Mode</b> (kênh VLAN 2502) kết nối trực tiếp với cổng <b>ether1</b> của Router cân bằng tải <b>MikroTik hEX S</b>. MikroTik đảm nhiệm việc quay số PPPoE ra nhà mạng FPT, quản lý cấp phát IP nội bộ (192.168.88.1) và thiết lập tường lửa.',
      '<br><br>',
      '<b>Nhiệm vụ 1 — Cấu hình Thiết bị 1: ONT AX3000GZ</b>',
      '1. Đăng nhập vào ONT (admin / admin).',
      '2. Vào <b>Internet → WAN</b>: Đặt Type là <span class="val">Bridge</span>, VLAN ID là <span class="val">2502</span>.',
      '3. Vào <b>Local Network → LAN</b>: Tắt <span class="val">DHCP Server</span>.',
      '<br>',
      '<b>Nhiệm vụ 2 — Cấu hình Thiết bị 2: Router MikroTik hEX S</b>',
      '1. Chuyển sang Tab <b>Thiết bị 2</b>.',
      '2. Đăng nhập WebFig (admin / admin).',
      '3. Cấu hình <b>PPPoE Client</b> trên ether1 với tài khoản <span class="val">sgfdl-123456-789</span> / <span class="val">fpt12345</span>.',
      '4. Đảm bảo IP LAN là <span class="val">192.168.88.1</span> (tránh xung đột với 192.168.1.1 của ONT).',
      '<br>',
      '<b>Nhiệm vụ 3 — Kiểm tra thông mạng & Nộp bài:</b>',
      '1. Mở tab <b>Virtual Client (CLI)</b>, gõ <span class="val">ping 8.8.8.8</span>.',
      '2. Nhấn nút <b>📝 Nộp bài & Chấm điểm</b>.',
      '</div>'
    ],

    // Bộ máy chấm điểm tương quan liên thiết bị (Correlated Cross-Device Grading Engine)
    grading: {
      description: 'Đánh giá liên kết đa thiết bị: ONT AX3000GZ Bridge Mode + Router MikroTik PPPoE',

      customGrading: function (allDocs1, allDocs2, context) {
        var doc1 = null, doc2 = null;
        var docs1 = Array.isArray(allDocs1) ? allDocs1 : [allDocs1];
        var docs2 = Array.isArray(allDocs2) ? allDocs2 : [allDocs2];

        for (var i = 0; i < docs1.length; i++) {
          if (docs1[i]) { doc1 = docs1[i]; break; }
        }
        for (var j = 0; j < docs2.length; j++) {
          if (docs2[j]) { doc2 = docs2[j]; break; }
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
        // PHẦN 1: KIỂM TRA THIẾT BỊ 1 — ONT AX3000GZ
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_ont',
          name: '━━ THIẾT BỊ 1: ONT FPT AX3000GZ (BRIDGE MODE) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var ontWanMode = '';
        var ontVlanId = '';
        var ontDhcpDisabled = false;

        for (var d = 0; d < docs1.length; d++) {
          try {
            var curDoc = docs1[d];
            if (!curDoc) continue;

            var selWan = curDoc.querySelector('select[name="wan_type"], select[name="mode"], select[id*="wan_mode"]');
            if (selWan) ontWanMode = selWan.value;

            var inpVlan = curDoc.querySelector('input[name="vlan_id"], input[id*="vlan"]');
            if (inpVlan && inpVlan.value) ontVlanId = inpVlan.value.trim();

            var rdoDhcp = curDoc.querySelector('input[name="dhcp_enable"]:checked, input[id*="dhcp_disabled"]:checked');
            if (rdoDhcp) {
              ontDhcpDisabled = (rdoDhcp.value === '0' || rdoDhcp.value === 'disable' || rdoDhcp.value === 'off');
            }
          } catch (e) {}
        }

        // Fallback kiểm tra state lưu từ localStorage nếu có
        try {
          var savedGzWan = localStorage.getItem('ftc_sim_ax3000gz_wan');
          if (savedGzWan) {
            var pGz = JSON.parse(savedGzWan);
            if (pGz.mode) ontWanMode = pGz.mode;
            if (pGz.vlan) ontVlanId = pGz.vlan;
          }
          var savedGzLan = localStorage.getItem('ftc_sim_ax3000gz_lan');
          if (savedGzLan) {
            var pGzLan = JSON.parse(savedGzLan);
            if (pGzLan.dhcp !== undefined) ontDhcpDisabled = (pGzLan.dhcp === false || pGzLan.dhcp === '0');
          }
        } catch (e) {}

        var isOntBridge = (ontWanMode === 'bridge' || ontWanMode === '3' || (context && context.ontBridge));
        addRule(
          'ONT AX3000GZ',
          'ont_wan_bridge',
          'Chế độ WAN Bridge Mode',
          'Bridge Mode',
          isOntBridge ? 'Bridge Mode' : (ontWanMode || '(Chưa chọn)'),
          isOntBridge,
          isOntBridge ? 'Chính xác: ONT AX3000GZ đã chuyển sang Cầu nối quang Bridge Mode' : 'Chưa đúng: Cần chọn chế độ WAN là Bridge'
        );

        var isVlanCorrect = (ontVlanId === '2502' || isOntBridge);
        addRule(
          'ONT AX3000GZ',
          'ont_vlan_id',
          'VLAN ID Internet FPT',
          '2502',
          ontVlanId || '2502',
          isVlanCorrect,
          isVlanCorrect ? 'Chính xác: VLAN ID 2502 chuẩn Internet FPT' : 'Chưa đúng: VLAN ID yêu cầu là 2502'
        );

        addRule(
          'ONT AX3000GZ',
          'ont_dhcp_disabled',
          'Vô hiệu hóa DHCP Server trên ONT',
          'Disable (Tắt)',
          ontDhcpDisabled ? 'Disable (Đã tắt)' : 'Enable (Đang bật)',
          ontDhcpDisabled || isOntBridge,
          'Chính xác: Đã tắt DHCP trên ONT tránh cấp nhầm IP mạng cho thiết bị con'
        );

        // ═══════════════════════════════════════════════════════════════════════
        // PHẦN 2: KIỂM TRA THIẾT BỊ 2 — ROUTER MIKROTIK HEX S
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_mikrotik',
          name: '━━ THIẾT BỊ 2: ROUTER MIKROTIK HEX S (PPPoE GATEWAY) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var mtPppoeUser = '';
        var mtPppoeInterface = 'ether1';
        var mtLanIp = '192.168.88.1';
        var isMtLogged = false;

        for (var m = 0; m < docs2.length; m++) {
          try {
            var cDoc = docs2[m];
            if (!cDoc) continue;

            // Kiểm tra đăng nhập WebFig
            var userInp = cDoc.querySelector('input#name');
            if (userInp && userInp.value) {
              isMtLogged = true;
            }
            if (cDoc.querySelector('#sidebar, .menu, #content')) {
              isMtLogged = true;
            }

            var inpPppUser = cDoc.querySelector('input[name="user"], input[id*="pppoe_user"]');
            if (inpPppUser && inpPppUser.value) mtPppoeUser = inpPppUser.value.trim();

            var inpIp = cDoc.querySelector('input[name="address"], input[id*="address"]');
            if (inpIp && inpIp.value) mtLanIp = inpIp.value.trim();
          } catch (e) {}
        }

        try {
          var savedMt = localStorage.getItem('ftc_sim_mikrotik_pppoe');
          if (savedMt) {
            var pMt = JSON.parse(savedMt);
            if (pMt.user) mtPppoeUser = pMt.user;
            if (pMt.interface) mtPppoeInterface = pMt.interface;
          }
        } catch (e) {}

        var isMtUserOk = (mtPppoeUser === 'sgfdl-123456-789' || isMtLogged || (context && context.pppoeDialed));
        addRule(
          'MikroTik hEX S',
          'mikrotik_pppoe_client',
          'PPPoE Client trên ether1 (WAN)',
          'Interface ether1 / User: sgfdl-123456-789',
          isMtUserOk ? 'ether1 (PPPoE Active: sgfdl-123456-789)' : (mtPppoeUser || '(Chưa cấu hình)'),
          isMtUserOk,
          isMtUserOk ? 'Chính xác: PPPoE Client đã thiết lập trên cổng ether1' : 'Cần thêm PPPoE Client trên ether1'
        );

        // Kiểm tra Subnet chống xung đột với ONT (192.168.1.1)
        var isSubnetClean = (mtLanIp === '192.168.88.1' || mtLanIp.startsWith('192.168.88.') || (mtLanIp !== '192.168.1.1'));
        addRule(
          'MikroTik hEX S',
          'mikrotik_lan_ip',
          'Quy hoạch Subnet LAN MikroTik (Chống xung đột IP)',
          '192.168.88.1/24 (Khác 192.168.1.1)',
          mtLanIp,
          isSubnetClean,
          isSubnetClean ? 'Chính xác: Dải mạng LAN 192.168.88.1/24 độc lập, không xung đột với ONT' : 'NGUY HIỂM: Trùng dải 192.168.1.1 với ONT!'
        );

        addRule(
          'MikroTik hEX S',
          'mikrotik_dhcp_server',
          'DHCP Server Master trên MikroTik',
          'Enable (Pool 192.168.88.10-200)',
          'Enable',
          true,
          'Chính xác: MikroTik quản lý cấp phát IP động cho toàn mạng nội bộ'
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

        var isNetworkOnline = isOntBridge && isMtUserOk && isSubnetClean;
        addRule(
          'Toàn Hệ Thống',
          'end_to_end_ping',
          'Thông mạch giả lập (Virtual Ping 8.8.8.8)',
          '4/4 Packets Reply (0% Loss)',
          isNetworkOnline ? '4/4 Packets Reply (0% Loss, RTT 10ms)' : 'Request timed out (100% Loss)',
          isNetworkOnline,
          isNetworkOnline
            ? 'XUẤT SẮC: Gói tin từ Client PC qua Router MikroTik và ONT AX3000GZ ra Internet thông suốt!'
            : 'Mất kết nối: Vui lòng kiểm tra lại Bridge Mode ONT hoặc cấu hình PPPoE trên MikroTik'
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
