/* Phu trang cau hinh (HTML tinh khop 100% anh firmware) len vung noi dung .el-main.
   Giu nguyen sidebar + header + breadcrumb + branding THAT cua firmware.
   Khong dung/khong sua he component Vue (rat mong manh khi minify) -> on dinh. */
(function () {
  var PAGES = {
    "/network/wifi": "wifi",
    "/network/wifiadv": "wifiadv",
    "/network/easymesh": "easymesh",
    "/network/wan": "wan",
    "/network/lan": "lan",
    "/network/lan6": "lan6",
    "/network/dhcp": "dhcp",
    "/network/dmz": "dmz",
    "/network/portfwd": "portfwd",
    "/network/ddns": "ddns",
    "/network/upnpd": "upnp",
    "/network/firewall": "firewall",
    "/network/ipv4routing": "ipv4routing",
    "/network/ipv6routing": "ipv6routing",
    "/network/alg": "alg",
    "/network/parentalctl": "parental",
    "/network/websitefilter": "website",
    "/network/speedtest": "speedtest",
    "/network/diagnostics": "diagnostics",
    "/network/tcpdump": "tcpdump",
    "/network/systemlog": "systemlog",
    "/network/techsupportinfo": "techsupportinfo",
    "/status/topology": "topology",
    "/status/easymeshtopo": "easymeshtopo",
    "/services/rtty": "rtty",
    "/system/system": "system",
    "/system/upgrade": "upgrade",
    "/system/wifitimer": "wifitimer",
    "/system/reboottimer": "reboottimer",
    "/system/changepwd": "changepwd",
    "/system/remote": "remote"
  };

  var overlay = null, iframe = null;

  function ensure() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "sim-overlay";
    overlay.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;background:#f4f6f9;z-index:9;";
    iframe = document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.style.cssText = "width:100%;height:100%;border:0;display:block;background:#f4f6f9;";
    overlay.appendChild(iframe);
  }

  function show(name) {
    ensure();
    var main = document.querySelector(".el-main") || document.querySelector("main");
    if (!main) return setTimeout(function () { show(name); }, 120);
    if (getComputedStyle(main).position === "static") main.style.position = "relative";
    
    // Hide original Vue content to prevent bleed-through (scrolling issues)
    Array.prototype.forEach.call(main.children, function(child) {
      if (child !== overlay) {
        child.dataset.oldDisplay = child.style.display || '';
        child.style.display = 'none';
      }
    });

    if (iframe.getAttribute("data-name") !== name) {
      iframe.src = "/sim-pages/" + name + ".html";
      iframe.setAttribute("data-name", name);
    }
    if (overlay.parentNode !== main) main.appendChild(overlay);
    overlay.style.display = "block";
  }

  function hide() { 
    if (overlay) overlay.style.display = "none"; 
    // Restore original Vue content
    var main = document.querySelector(".el-main") || document.querySelector("main");
    if (main) {
      Array.prototype.forEach.call(main.children, function(child) {
        if (child !== overlay && child.dataset.oldDisplay !== undefined) {
          child.style.display = child.dataset.oldDisplay;
          delete child.dataset.oldDisplay;
        }
      });
    }
  }

  function apply(path) {
    if (PAGES[path]) show(PAGES[path]); else hide();
  }

  function ready() {
    var el = document.getElementById("app");
    if (!el || !el.__vue__) return setTimeout(ready, 200);
    var app = el.__vue__;
    var router = app.$router || (app.$root && app.$root.$router);
    if (!router) return setTimeout(ready, 200);

    // Neu URL yeu cau logout (co query logout=1 hoac hash #/login) -> xoa storage va ep ve /login
    var href = window.location.href;
    if (href.indexOf("logout=1") !== -1 || href.indexOf("#/login") !== -1) {
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch (e) {}
      if (router.currentRoute && router.currentRoute.path !== "/login") {
        router.push("/login");
      }
    }

    router.afterEach(function (to) { setTimeout(function () { apply(to.path); }, 80); });
    apply(router.currentRoute && router.currentRoute.path);
    window.addEventListener("hashchange", function () {
      if (router && router.currentRoute) {
        setTimeout(function () { apply(router.currentRoute.path); }, 100);
      }
    });
    console.log("[sim-views] overlay config views active");
  }
  ready();
})();
