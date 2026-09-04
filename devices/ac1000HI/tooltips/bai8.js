/**
 * devices/ac1000HI/tooltips/bai8.js - Tooltip Hng dn cho Bi 8: WiFi Timer
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_08'] = [
    // Bc 1: Chn Maintenance  Header
    {
        selector: 'a[onclick*="change_maint"]',
        text: 'Bc 1: chn Maintenance',
        position: 'top'
    },
    // Bc 2: Chn WiFi Timer  Menu bn tri (Nav frame)
    {
        selector: 'a[href*="tools_wifitimer.asp"]',
        text: 'Bc 2: chn WiFi Timer',
        position: 'top'
    },
    // Bc 3: Chn Enable  mc WiFi Timer Status
    {
        selector: 'input[name="wifitimer_enable"][value="1"], input[name="wifitimer_enable"]',
        text: 'Bc 3: chn Enable',
        position: 'top'
    },
    // Bc 4: Nhp thi gian bt u pht Wifi
    {
        selector: 'input[name="starttime"]',
        text: 'Bc 4: nhp thi gian bt u pht Wifi, v d 8:00',
        position: 'right'
    },
    // Bc 5: Nhp thi gian kt thc pht Wifi
    {
        selector: 'input[name="endtime"]',
        text: 'Bc 5: nhp thi gian kt thc pht Wifi, v d 17:00',
        position: 'right'
    },
    // Bc 6: Chn ngy trong tun pht Wifi
    {
        selector: 'input[name="fri"]',
        text: 'Bc 6: chn ngy trong tun pht Wifi, v d th 2, 3, 4, 5, 6',
        position: 'bottom'
    },
    // Bc 7: Chn Save lu cu hnh
    {
        selector: 'input[name="SaveBtn"], input[value="Save"], input[onclick*="uiSave"], #save, #btnSave, .button1',
        text: 'Bc 7: chn Save lu cu hnh',
        position: 'right'
    }
];
