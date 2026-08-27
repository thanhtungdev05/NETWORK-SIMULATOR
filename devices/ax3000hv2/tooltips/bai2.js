if (!window.TOOLTIPS_AX3000HV2) window.TOOLTIPS_AX3000HV2 = {};
window.TOOLTIPS_AX3000HV2['LAB_AX3000HV2_02'] = [
    {
        selector: '#MainMenu a:contains("Network")',
        text: 'Bước 1: Chọn Network',
        position: 'top'
    },
    {
        selector: 'a[href*="wifi_basic.asp"], a:contains("Host SSID")',
        text: 'Bước 2: Chọn Host SSID',
        hideOnUrlIncludes: 'wifi_basic.asp',
        position: 'top'
    },
    {
        selector: 'input[name="ESSID"]',
        urlIncludes: 'wifi_basic.asp',
        text: 'Bước 3: Nhập tên Wifi: FPT Telecom',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="PreSharedKey"]',
        urlIncludes: 'wifi_basic.asp',
        text: 'Bước 4: Nhập mật khẩu Wifi: fpt12345',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="ESSID_5g"]',
        urlIncludes: 'wifi_basic.asp',
        text: 'Bước 5: Nhập tên Wifi 5G: FPT Telecom',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[name="PreSharedKey_5g"]',
        urlIncludes: 'wifi_basic.asp',
        text: 'Bước 6: Nhập mật khẩu Wifi 5G: fpt12345',
        position: 'right',
        forcePosition: true
    },
    {
        selector: 'input[value="Save"], input[name="SaveBtn"]',
        urlIncludes: 'wifi_basic.asp',
        text: 'Bước 7: Chọn Save',
        position: 'top'
    }
];
