/**
 * devices/ac1000HI/tooltips/bai7.js - Tooltip Hng dn cho Bi 7: Backup/Restore file cu hnh
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_07'] = [
  // Bc 1: Chn Maintenance  Header
  {
    selector: 'a[onclick*="change_maint"]',
    text: 'Bc 1: chn Maintenance',
    position: 'top'
  },
  // Bc 2: Chn Firmware  Menu bn tri (Nav frame)
  {
    selector: 'a[href*="tools_update.asp"]',
    text: 'Bc 2: chn Firmware',
    position: 'top'
  },
  // Bc 3: Chn Download  ti file cu hnh
  {
    selector: 'input[value="Download"], input[onclick*="backup_settings"]',
    text: 'Bc 3: chn Download  ti file cu hnh',
    position: 'right'
  },
  // Bc 4: Chn Browse  chn file cu hnh bn ang c
  {
    selector: 'label[for="xFile0"], input[name="tools_FW_UploadFile0"], #xFile0',
    text: 'Bc 4: chn Browse  chn file cu hnh bn ang c',
    position: 'right'
  },
  // Bc 5: Chn Restore  cp nht file cu hnh ny
  {
    selector: 'input[value="Restore"], input[onclick*="uiDoUpdate0"]',
    text: 'Bc 5: chn Restore  cp nht file cu hnh ny',
    position: 'right'
  }
];
