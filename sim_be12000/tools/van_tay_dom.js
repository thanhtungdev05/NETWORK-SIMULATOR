/* van_tay_dom.js — thu "dau van tay DOM" cua mot trang BE12000.
 *
 * Chay doan nay trong Console cua trinh duyet, tren CA HAI ben:
 *   - thiet bi that   http://192.168.1.1
 *   - ban gia lap     http://localhost:8098
 * roi luu ket qua ra file JSON de tools/so_dom.py doi chieu.
 *
 * Muc dich (CLAUDE.md muc 4.1): bat nhung sai lech ma mat nguoi bo sot —
 * sai thuoc tinh name, thieu input an, lech thu tu phan tu, lech toa do vai pixel.
 *
 * Chi lay phan tu CO Y NGHIA de ban bao cao khong bi loang:
 *   - moi input / select / textarea / button (ke ca dang an)
 *   - phan tu co id hoac name
 *   - the cau truc: h1 h2 h3 table tr th td form a p li
 *   - phan tu la co chu
 */
(function () {
  "use strict";

  function coYNghia(e) {
    var t = e.tagName;
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON|FORM)$/.test(t)) return true;
    if (e.id || e.getAttribute("name")) return true;
    if (/^(H1|H2|H3|TABLE|TR|TH|TD|A|LI|LABEL|SPAN|P)$/.test(t)) {
      return e.children.length === 0 && (e.textContent || "").trim() !== "";
    }
    return false;
  }

  function gonText(s) {
    return (s || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  function vanTay(cssGoc) {
    var goc = document.querySelector(cssGoc);
    if (!goc) return { loi: "khong thay " + cssGoc };

    var dong = [];
    var tatCa = goc.querySelectorAll("*");
    for (var i = 0; i < tatCa.length; i++) {
      var e = tatCa[i];
      if (!coYNghia(e)) continue;

      var cs = window.getComputedStyle(e);
      var r = e.getBoundingClientRect();
      var an = cs.display === "none" || cs.visibility === "hidden" || e.offsetParent === null;

      var phan = [e.tagName];
      if (e.id) phan.push("#" + e.id);
      var ten = e.getAttribute("name");
      if (ten) phan.push("@" + ten);
      var kieu = e.getAttribute("type");
      if (kieu) phan.push(":" + kieu);
      if (e.className && typeof e.className === "string") {
        phan.push("." + e.className.trim().replace(/\s+/g, "."));
      }
      if ("value" in e && e.value !== undefined && e.tagName !== "FORM") {
        phan.push("=" + gonText(String(e.value)));
      }
      if (e.children.length === 0) {
        var txt = gonText(e.textContent);
        if (txt) phan.push('"' + txt + '"');
      }
      phan.push(an ? "[AN]" : "[HIEN]");
      // toa do lam tron 1px; so_dom.py cho dung sai 2px
      phan.push("<" + Math.round(r.left) + "," + Math.round(r.top) +
                "," + Math.round(r.width) + "," + Math.round(r.height) + ">");

      dong.push(phan.join(" "));
    }
    return dong;
  }

  window.vanTayDOM = function (cssGoc) {
    return {
      url: location.origin,
      khoMan: window.innerWidth + "x" + window.innerHeight,
      goc: cssGoc || "#page_content",
      dong: vanTay(cssGoc || "#page_content"),
      hamJS: Object.keys(window).filter(function (k) {
        return typeof window[k] === "function" && !/^webkit|^on/.test(k);
      }).sort(),
    };
  };

  return "vanTayDOM da san sang — goi vanTayDOM('#page_content')";
})();
