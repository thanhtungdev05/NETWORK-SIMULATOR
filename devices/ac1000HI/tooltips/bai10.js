/**
 * devices/ac1000HI/tooltips/bai10.js - Tooltip Hng dn cho Bi 10: Chn Web (URL Filter)
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_10'] = [
  // Bc 1: Chn Access  Header
  {
    selector: 'a[onclick*="change_access"]',
    text: 'Bc 1: chn Access',
    position: 'top'
  },
  // Bc 2: Chn Filter  Menu bn tri (Nav frame)
  {
    selector: 'a[href*="access_URLfilter.asp"], a[href*="access_ipfilter.asp"]',
    text: 'Bc 2: chn Filter',
    position: 'top'
  },
  // Bc 3: Chn URL Filter  Filter Type Selection
  {
    selector: 'select[name="FILTERTYPE_index"]',
    text: 'Bc 3: chn URL Filter',
    position: 'right'
  },
  // Bc 4: Chn Enable  mc URL Filter Editing Individual active
  {
    selector: 'input[name="SingleRule_active"][value="1"], input[name="SingleRule_active"]',
    text: 'Bc 4: chn Enable',
    position: 'top'
  },
  // Bc 5: in a ch Web mun chn
  {
    selector: 'input[name="UrlFilter_URL"]',
    text: 'Bc 5: in a ch Web mun chn v d: https://facebook.com',
    position: 'right'
  },
  // Bc 6: Chn Save lu cu hnh
  {
    selector: 'input[name="UrlFilterApply"], input[value="Save"], input[onclick*="doSubmit"], #save, #btnSave, .button1',
    text: 'Bc 6: chn Save lu cu hnh',
    position: 'right'
  }
];
