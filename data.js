/**
 * data.js — Alias & Wrapper giữ tương thích cho Portal
 * Tất cả dữ liệu thiết bị và chấm thao tác chi tiết hiện được quản lý theo mô-đun trong thư mục devices/
 */

if (!window.DEVICES || window.DEVICES.length === 0) {
  if (typeof window.DEVICES === 'undefined') {
    window.DEVICES = [
      window.DEVICE_AC1000F,
      window.DEVICE_AX3000C,
      window.DEVICE_AX3000GZ,
      window.DEVICE_AX3000HV2,
      window.DEVICE_AX3000S,
      window.DEVICE_AC1000HI,
    ].filter(Boolean);
  }
}

if (!window.DEVICE_CONFLICT_PORTS) {
  window.DEVICE_CONFLICT_PORTS = {
    8080: ['ac1000f', 'ax3000hv2', 'ax3000s'],
  };
}
