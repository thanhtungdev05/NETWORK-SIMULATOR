/* Dong ho toc do o network/speedtest -- ve bang CHINH ECharts cua thiet bi.
 *
 * Bang chung: reference/source/assets_goc/index-DN0khghO.js (chunk goc cua
 * route speedtest). Trong do:
 *   xs = "speed-gauge"            -> id cua the chua
 *   _t = [0,5,10,50,100,250,500,750,1000]  -> mang vach so
 *   ko = { series: [...] }        -> cau hinh dong ho, 4 series
 *   Zf(...)                       -> component React, doan quan trong:
 *        const a = document.getElementById(xs);
 *        if (a === null) return;
 *        let o = mc(a);                 // getInstanceByDom
 *        o ? o.setOption({...})         // da co -> chi cap nhat value
 *          : (o = S1(a), o.setOption(ko));   // chua co -> init + set ca cau hinh
 *
 * File nay lam DUNG nhanh "chua co" o tren: init roi setOption(ko) nguyen
 * van. KHONG tu che cau hinh, khong tu ve cung tron -- chi goi lai dung
 * trinh tu ma goc da lam. Cung anh nen /assets/axisLine-BB3tN1PU.png da co
 * san trong markup tinh (the <img class="axisLinePng">), khong dung toi.
 *
 * Gia tri ban dau = 0: dung nhu thiet bi that luc chua bam START SPEED TEST
 * (ko.series[0].data[0].value = 0 trong ma goc).
 */
(function () {
  'use strict';

  function ve() {
    var el = document.getElementById('speed-gauge');
    if (!el) return;                       // trang khac, khong co dong ho
    if (!window.__EC_INIT || !window.__GAUGE_OPT) return;   // chua nap vendor
    if (el.__daVe) return;
    el.__daVe = true;

    /* Ban chup tinh da luu san khung <div>+<canvas> ma ECharts sinh ra lan
       truoc (ke ca thuoc tinh _echarts_instance_ cu). Neu de nguyen,
       getInstanceByDom se tra ve undefined (id cu khong con trong bang
       instance) NHUNG init lai se cong them mot canvas thu hai. Xoa phan
       ruot va thuoc tinh cu di, giu nguyen the #speed-gauge -- dung cach
       ECharts tu lam khi mount lan dau tren the rong. */
    el.removeAttribute('_echarts_instance_');
    el.innerHTML = '';

    var bd = window.__EC_GET && window.__EC_GET(el);
    if (!bd) bd = window.__EC_INIT(el);
    bd.setOption(window.__GAUGE_OPT);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ve);
  } else {
    ve();
  }
})();
