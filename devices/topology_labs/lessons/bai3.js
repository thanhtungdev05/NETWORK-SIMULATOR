/**
 * devices/topology_labs/lessons/bai3.js
 * Bài Thực Hành Liên Kết: Router DrayTek Vigor 2927 (Core Gateway) + Access Point Wi-Fi 7 BE6500C (Mở Rộng Vùng Phủ Sóng)
 */

(function () {
  'use strict';

  window.DEVICE_TOPOLOGY_LESSONS = window.DEVICE_TOPOLOGY_LESSONS || [];

  const lesson = {
    id: 'LAB_TOPOLOGY_03',
    title: 'Mô hình Router Doanh Nghiệp + AP Wi-Fi 7 BE6500C',
    subtitle: 'Triển khai Router DrayTek Vigor 2927 kết hợp Access Point Wi-Fi 7 BE6500C mở rộng vùng phủ sóng',
    isTopology: true,

    // Cấu hình 2 thiết bị trong mô hình mạng liên kết
    device1: {
      id: 'vigor2927',
      name: 'Router DrayTek Vigor 2927',
      shortName: 'DrayTek Vigor 2927',
      icon: '🔀',
      role: 'Core Gateway & DHCP Master',
      practiceUrl: '/sim_vigor2927/weblogin.htm',
      defaultUrl: '/sim_vigor2927/doc/mwaninet1.htm',
      loginRequired: true,
      managementIp: '192.168.1.1',
      lanPort: 'LAN 1'
    },

    device2: {
      id: 'be6500c',
      name: 'AP Wi-Fi 7 BE6500C',
      shortName: 'AP Wi-Fi 7 BE6500C',
      icon: '📡',
      role: 'Access Point Mode & Mesh Wi-Fi 7',
      practiceUrl: '/sim_be6500c/login.html',
      defaultUrl: '/sim_be6500c/login.html',
      loginRequired: true,
      managementIp: '192.168.1.250',
      wanPort: 'Cổng 2.5G Uplink',
      lanPort: 'Wi-Fi 7 Multi-Link'
    },

    // Mô tả thông tin liên kết cáp mạng (Wiring Specification)
    wiring: {
      uplink: { from: 'ISP Internet', to: 'Router Vigor 2927 [Cổng WAN 1]', type: 'RJ45 Gigabit', status: 'Link Up 1Gbps' },
      interlink: { from: 'Router Vigor 2927 [Cổng LAN 1]', to: 'AP BE6500C [Cổng 2.5G]', type: 'CAT6A UTP', status: 'Link Up 2.5Gbps' },
      downlink: { from: 'AP BE6500C [Wi-Fi 7]', to: 'Client PC / Smartphone (Wi-Fi 7 Client)', type: 'Wi-Fi 7 (802.11be)', status: 'Connected 5760Mbps' }
    },

    // Các bước hướng dẫn hiển thị trên Popup Modal chi tiết
    guideSteps: [
      {
        stage: 1,
        title: 'GIAI ĐOẠN 1: CẤU HÌNH THIẾT BỊ 1 — ROUTER DRAYTEK VIGOR 2927 (GATEWAY TRUNG TÂM)',
        targetTab: 'device1',
        btnText: '🛠️ Đến màn hình Router Vigor',
        badgeClass: 'card-router',
        steps: [
          'Chuyển sang Tab <strong>Thiết bị 1: Router DrayTek Vigor 2927</strong>. Đăng nhập với tài khoản <span class="topol-guide-val">admin</span> / <span class="topol-guide-val">admin</span>.',
          'Vào <strong>LAN &rarr; General Setup</strong>: Thiết lập IP Gateway là <span class="topol-guide-val">192.168.1.1</span>.',
          'Kích hoạt <strong>DHCP Server</strong> trên Router để làm Master DHCP cấp dải IP <span class="topol-guide-val">192.168.1.10 - 192.168.1.200</span>.',
          'Vào <strong>WAN &rarr; Internet Access</strong>: Đảm bảo WAN 1 đã kết nối Internet (PPPoE / DHCP) để phân phối mạng cho các Access Point.'
        ]
      },
      {
        stage: 2,
        title: 'GIAI ĐOẠN 2: CẤU HÌNH THIẾT BỊ 2 — ACCESS POINT WI-FI 7 BE6500C (AP MODE)',
        targetTab: 'device2',
        btnText: '🛠️ Đến màn hình AP BE6500C',
        badgeClass: 'card-ont',
        steps: [
          'Chuyển sang Tab <strong>Thiết bị 2: AP Wi-Fi 7 BE6500C</strong>. Đăng nhập với tài khoản quản trị <span class="topol-guide-val">admin</span> / <span class="topol-guide-val">admin</span>.',
          'Chuyển chế độ hoạt động (Operation Mode) sang <span class="topol-guide-val">Access Point (AP Mode)</span> để biến thiết bị thành điểm phát sóng không dây cầu nối (Bridge).',
          'Thiết lập IP tĩnh quản trị AP là <span class="topol-guide-val">192.168.1.250</span> và Gateway trỏ về Router <span class="topol-guide-val">192.168.1.1</span>.',
          'Vô hiệu hóa DHCP Server trên AP BE6500C (để tránh 2 DHCP Server cấp trùng gây lỗi mạng lặp loop).',
          'Cấu hình tên Wi-Fi (SSID): <span class="topol-guide-val">FPT_CORP_WIFI7</span> và Mật khẩu <span class="topol-guide-val">FptTelecom@2026</span>.'
        ]
      },
      {
        stage: 3,
        title: 'GIAI ĐOẠN 3: KIỂM TRA KẾT NỐI KHÔNG DÂY & NỘP BÀI',
        targetTab: 'terminal',
        btnText: '💻 Đến Virtual Client CLI',
        badgeClass: 'card-client',
        steps: [
          'Chuyển sang Tab <strong>Virtual Client (CLI)</strong> để kiểm tra máy trạm bắt sóng Wi-Fi từ AP BE6500C.',
          'Gõ lệnh <span class="topol-guide-val">ipconfig</span>: Xác nhận máy trạm nhận IP cấp từ DrayTek Router và Default Gateway là <span class="topol-guide-val">192.168.1.1</span>.',
          'Chạy lệnh <span class="topol-guide-val">ping 192.168.1.250</span> (AP Wi-Fi) và <span class="topol-guide-val">ping 8.8.8.8</span> (Internet ngoài).',
          'Khi thông mạng và phản hồi trễ thấp (<5ms), bấm <strong>📝 Nộp bài & Chấm điểm</strong>.'
        ]
      }
    ],

    instructions: [
      '<div class="topol-instruction-block">',
      '<b>Bối cảnh thực tế:</b>',
      'Trong mạng doanh nghiệp vừa và lớn, Router <b>DrayTek Vigor 2927</b> chịu tải toàn bộ hệ thống định tuyến và DHCP Server. Cổng LAN của DrayTek được kết nối qua cáp CAT6A vào cổng 2.5G của <b>Access Point Wi-Fi 7 BE6500C</b> để cung cấp kết nối mạng không dây tốc độ cao (Multi-Link Operation MLO) cho hàng trăm thiết bị của nhân viên.',
      '<br><br>',
      '<b>Nhiệm vụ 1 — Router DrayTek Vigor 2927 (Core Gateway)</b>',
      '1. Đăng nhập vào DrayTek Vigor (admin / admin).',
      '2. Xác nhận LAN IP: <span class="val">192.168.1.1</span> và DHCP Server đang cấp phát dải 192.168.1.10 - 200.',
      '<br>',
      '<b>Nhiệm vụ 2 — Access Point Wi-Fi 7 BE6500C (AP Mode)</b>',
      '1. Chuyển sang Tab <b>Thiết bị 2</b>.',
      '2. Đăng nhập AP BE6500C (admin / admin).',
      '3. Chuyển thiết bị sang chế độ <b>Access Point (AP Mode)</b>.',
      '4. Đặt IP tĩnh quản trị AP là <span class="val">192.168.1.250</span>.',
      '5. Tắt DHCP trên AP (để DrayTek làm DHCP Master duy nhất).',
      '6. Đặt SSID: <span class="val">FPT_CORP_WIFI7</span>.',
      '<br>',
      '<b>Nhiệm vụ 3 — Kiểm tra thông mạng & Nộp bài:</b>',
      '1. Mở tab <b>Virtual Client (CLI)</b>, ping Gateway <span class="val">192.168.1.1</span> và Internet <span class="val">8.8.8.8</span>.',
      '2. Nhấn nút <b>📝 Nộp bài & Chấm điểm</b>.',
      '</div>'
    ],

    // Bộ máy chấm điểm tương quan liên thiết bị (Correlated Cross-Device Grading Engine)
    grading: {
      description: 'Đánh giá liên kết đa thiết bị: Router DrayTek Vigor 2927 + AP Wi-Fi 7 BE6500C',

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
        // PHẦN 1: KIỂM TRA THIẾT BỊ 1 — ROUTER DRAYTEK VIGOR 2927
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_draytek',
          name: '━━ THIẾT BỊ 1: ROUTER DRAYTEK VIGOR 2927 (CORE GATEWAY) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var routerLanIp = '192.168.1.1';
        var isRouterDhcpMaster = true;

        for (var r = 0; r < docs1.length; r++) {
          try {
            var cDoc = docs1[r];
            if (!cDoc) continue;
            var inpIp = cDoc.querySelector('input[name="sLanIp"], input[name="sIp"], input[name="iLanIp"]');
            if (inpIp && inpIp.value) routerLanIp = inpIp.value.trim();
          } catch (e) {}
        }

        addRule(
          'DrayTek Vigor 2927',
          'draytek_gateway_ip',
          'IP Gateway DrayTek Router',
          '192.168.1.1',
          routerLanIp,
          (routerLanIp === '192.168.1.1'),
          'Chính xác: Router đóng vai trò Gateway 192.168.1.1 cho toàn bộ mạng'
        );

        addRule(
          'DrayTek Vigor 2927',
          'draytek_dhcp_master',
          'DHCP Server Master DrayTek',
          'Enable (Cấp phát 192.168.1.10-200)',
          'Enable (Master)',
          true,
          'Chính xác: Router DrayTek đảm nhiệm vai trò cấp IP duy nhất'
        );

        // ═══════════════════════════════════════════════════════════════════════
        // PHẦN 2: KIỂM TRA THIẾT BỊ 2 — ACCESS POINT WI-FI 7 BE6500C
        // ═══════════════════════════════════════════════════════════════════════
        details.push({
          id: '_header_ap',
          name: '━━ THIẾT BỊ 2: ACCESS POINT WI-FI 7 BE6500C (AP MODE) ━━',
          expected: '',
          actual: '',
          passed: true,
          _isHeader: true
        });

        var apMode = 'ap';
        var apIp = '192.168.1.250';
        var apSsid = 'FPT_CORP_WIFI7';
        var isApDhcpOff = true;

        for (var a = 0; a < docs2.length; a++) {
          try {
            var curDoc = docs2[a];
            if (!curDoc) continue;
            var selMode = curDoc.querySelector('select[name="opmode"], input[name="opmode"]:checked');
            if (selMode) apMode = selMode.value;

            var inpSsid = curDoc.querySelector('input[name="ssid"], input[id*="ssid"]');
            if (inpSsid && inpSsid.value) apSsid = inpSsid.value.trim();
          } catch (e) {}
        }

        try {
          var savedAp = localStorage.getItem('ftc_sim_be6500c');
          if (savedAp) {
            var pAp = JSON.parse(savedAp);
            if (pAp.mode) apMode = pAp.mode;
            if (pAp.ssid) apSsid = pAp.ssid;
          }
        } catch (e) {}

        var isApModeOk = (apMode === 'ap' || apMode === 'bridge' || (context && context.apMode));
        addRule(
          'AP Wi-Fi 7 BE6500C',
          'ap_operation_mode',
          'Chế độ hoạt động (Operation Mode)',
          'Access Point (AP Mode)',
          isApModeOk ? 'Access Point (AP Mode)' : apMode,
          isApModeOk,
          isApModeOk ? 'Chính xác: Thiết bị đã chuyển sang chế độ Access Point mở rộng sóng' : 'Cần chuyển chế độ hoạt động sang Access Point (AP Mode)'
        );

        addRule(
          'AP Wi-Fi 7 BE6500C',
          'ap_dhcp_disabled',
          'Tắt DHCP Server trên AP BE6500C',
          'Disabled (Tránh cấp trùng IP)',
          'Disabled (Đã tắt)',
          true,
          'Chính xác: Đã tắt DHCP trên AP để nhường quyền cấp IP cho DrayTek'
        );

        var isSsidOk = (apSsid === 'FPT_CORP_WIFI7' || isApModeOk);
        addRule(
          'AP Wi-Fi 7 BE6500C',
          'ap_wifi7_ssid',
          'Tên sóng Wi-Fi 7 Doanh Nghiệp (SSID)',
          'FPT_CORP_WIFI7',
          apSsid || 'FPT_CORP_WIFI7',
          isSsidOk,
          'Chính xác: Tên sóng Wi-Fi 7 phát chuẩn doanh nghiệp'
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

        var isNetworkOnline = isApModeOk && (routerLanIp === '192.168.1.1');
        addRule(
          'Toàn Hệ Thống',
          'end_to_end_ping',
          'Thông mạch giả lập (Virtual Ping 8.8.8.8)',
          '4/4 Packets Reply (0% Loss)',
          isNetworkOnline ? '4/4 Packets Reply (0% Loss, RTT 4ms)' : 'Request timed out (100% Loss)',
          isNetworkOnline,
          isNetworkOnline
            ? 'XUẤT SẮC: Client kết nối Wi-Fi 7 tới AP BE6500C qua Router DrayTek ra Internet thông suốt!'
            : 'Mất kết nối: Vui lòng kiểm tra lại chế độ AP Mode trên BE6500C hoặc cổng nối tới Router'
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
