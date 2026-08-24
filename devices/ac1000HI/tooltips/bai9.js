/**
 * devices/ac1000HI/tooltips/bai9.js - Tooltip Hng dn cho Bi 9: Reboot Timer
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_09'] = [
    // Bc 1: Chn Maintenance  Header
    {
        selector: 'a[onclick*="change_maint"]',
        text: 'Bc 1: chn Maintenance',
        position: 'top'
    },
    // Bc 2: Chn Reboot Timer  Menu bn tri (Nav frame)
    {
        selector: 'a[href*="tools_reboottimer.asp"]',
        text: 'Bc 2: chn Reboot Timer',
        position: 'top'
    },
    // Bc 3: Chn Enable  mc Reboot Timer Status
    {
        selector: 'input[name="reboottimer_enable"][value="1"], input[name="reboottimer_enable"]',
        text: 'Bc 3: chn Enable',
        position: 'top'
    },
    // Bc 4: Chn thi gian khi ng
    {
        selector: 'input[name="time"]',
        text: 'Bc 4: chn thi gian khi ng, v d 3:00',
        position: 'right'
    },
    // Bc 5: Chn ngy trong tun khi ng
    {
        selector: 'input[name="fri"]',
        text: 'Bc 5: chn ngy trong tun khi ng, v d th 2, 4, 6',
        position: 'bottom'
    },
    // Bc 6: Chn Save lu cu hnh
    {
        selector: 'input[name="SaveBtn"], input[value="Save"], input[onclick*="uiSave"], #save, #btnSave, .button1',
        text: 'Bc 6: chn Save lu cu hnh',
        position: 'right'
    }
];
