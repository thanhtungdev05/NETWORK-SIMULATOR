/* Dieu huong cho ban gia lap H6701Q V3 (BE15000).
   App that la jQuery, nap noi dung tung trang qua AJAX (common_lib.js).
   Ban chup tinh da bo common_lib.js (neu de lai no se AJAX re-render, xoa
   mat noi dung da chup + hien loi vi khong co server that).

   Moi muc menu tren thiet bi co thuoc tinh `menupage` = id trang dich
   (class1 top category, class2, ca tab class3). Chi can bat click cac phan
   tu do va dieu huong toi /page/<menupage>. */
(function () {
  function di(id) { if (id) location.href = '/page/' + id; }

  document.addEventListener('click', function (e) {
    // Logout truoc (co the khong co menupage)
    var t = e.target;
    if (t.id === 'logout' || (t.getAttribute && /LogOff/.test(t.getAttribute('onclick') || ''))) {
      e.preventDefault(); location.href = '/login'; return;
    }
    // tim phan tu gan nhat co menupage (hoac chinh no)
    var el = e.target;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('menupage')) {
        e.preventDefault();
        di(el.getAttribute('menupage'));
        return;
      }
      el = el.parentElement;
    }
  }, true);
})();
