if (!window.TOOLTIPS_AX3000HV2) window.TOOLTIPS_AX3000HV2 = {};
window.TOOLTIPS_AX3000HV2['LAB_AX3000HV2_05'] = [
    {
        selector: '#topmenu a:contains("Network"), a:contains("Network")',
        text: 'Bước 1: Chọn Network',
        position: 'top'
    },
    {
        selector: 'a[href*="home_lan.asp"], a:contains("LAN")',
        text: 'Bước 2: Chọn LAN',
        position: 'top'
    },
    {
        selector: 'input[name="uiViewIPAddr"]',
        text: 'Bước 3: Nhập IP<br>ví dụ: 192.168.1.1',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="uiViewNetMask"]',
        text: 'Bước 4: Nhập Subnet Mask<br>ví dụ: 255.255.255.0',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="StartIp"]',
        text: 'Bước 5: Nhập IP động đầu tiên<br>ví dụ: 192.168.1.2',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="PoolSize"]',
        text: 'Bước 6: Nhập tổng số IP động<br>ví dụ: 253',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="dhcp_LeaseTime"]',
        text: 'Bước 7: Nhập thời gian thuê IP<br>ví dụ: 86400',
        position: 'bottom',
        forcePosition: true
    },
    {
        selector: 'input[value="Save"], input[name="SaveBtn"]',
        text: 'Bước 8: Chọn Save',
        position: 'bottom'
    }
];
