/**
 * guide-overlay.js — FTC Network Simulator Guide Popups Engine
 * Injected into simulator frames/pages to display step-by-step red guide tooltips
 */
(function () {
  'use strict';

  let currentPopups = [];
  let isEnabled = true;

  // Injected CSS for the red bubble tooltips (NO red border / outline around target elements)
  function injectStyles() {
    if (!document.head && !document.documentElement) return;
    if (document.getElementById('ftc-guide-style')) return;
    const style = document.createElement('style');
    style.id = 'ftc-guide-style';
    style.textContent = `
      html, body {
        overflow-x: auto !important;
      }
      .ftc-guide-bubble {
        position: absolute !important;
        z-index: 2147483647 !important;
        background-color: #e50019 !important;
        background: #e50019 !important;
        color: #ffffff !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        line-height: 1.4 !important;
        padding: 7px 14px !important;
        border-radius: 5px !important;
        box-shadow: 0 4px 16px rgba(229, 0, 25, 0.45), 0 2px 5px rgba(0, 0, 0, 0.3) !important;
        white-space: nowrap !important;
        pointer-events: none !important;
        user-select: none !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        animation: ftcGuidePopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      }
      .ftc-guide-bubble::before {
        content: '' !important;
        position: absolute !important;
        width: 0 !important;
        height: 0 !important;
        border-style: solid !important;
      }
      /* Position right (arrow points LEFT towards element) */
      .ftc-guide-bubble.pos-right::before {
        top: 50% !important;
        left: -8px !important;
        transform: translateY(-50%) !important;
        border-width: 6px 8px 6px 0 !important;
        border-color: transparent #e50019 transparent transparent !important;
      }
      /* Position left (arrow points RIGHT towards element) */
      .ftc-guide-bubble.pos-left::before {
        top: 50% !important;
        right: -8px !important;
        transform: translateY(-50%) !important;
        border-width: 6px 0 6px 8px !important;
        border-color: transparent transparent transparent #e50019 !important;
      }
      /* Position bottom (arrow points UP towards element) */
      .ftc-guide-bubble.pos-bottom::before {
        left: 50% !important;
        top: -8px !important;
        transform: translateX(-50%) !important;
        border-width: 0 6px 8px 6px !important;
        border-color: transparent transparent #e50019 transparent !important;
      }
      /* Position top (arrow points DOWN towards element) */
      .ftc-guide-bubble.pos-top::before {
        left: 50% !important;
        bottom: -8px !important;
        transform: translateX(-50%) !important;
        border-width: 8px 6px 0 6px !important;
        border-color: #e50019 transparent transparent transparent !important;
      }
      @keyframes ftcGuidePopIn {
        0% { opacity: 0; transform: scale(0.88) translateY(3px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // Clear existing popups in this document
  function clearPopups() {
    document.querySelectorAll('.ftc-guide-bubble').forEach(el => el.remove());
  }

  // Render popups for target elements in this frame
  function renderPopups() {
    if (!document.body) return;
    injectStyles();

    if (!isEnabled || !currentPopups || !currentPopups.length) {
      clearPopups();
      return;
    }

    currentPopups.forEach((item, idx) => {
      let target = null;
      try {
        target = document.querySelector(item.selector);
      } catch (e) {}

      if (!target) return;

      const rect = target.getBoundingClientRect();
      // Skip if completely hidden or zero size
      if (rect.width === 0 && rect.height === 0 && target.offsetParent === null) return;

      let bubble = document.querySelector(`.ftc-guide-bubble[data-guide-index="${idx}"]`);
      if (!bubble) {
        bubble = document.createElement('div');
        const pos = item.position || 'right';
        bubble.className = `ftc-guide-bubble pos-${pos}`;
        bubble.textContent = item.text;
        bubble.dataset.guideIndex = idx;
        document.body.appendChild(bubble);
      }

      const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      const targetTop = rect.top + scrollY;
      const targetLeft = rect.left + scrollX;
      const bWidth = bubble.offsetWidth || 180;
      const bHeight = bubble.offsetHeight || 30;
      let pos = item.position || 'right';

      // Bỏ auto-flip, giữ nguyên vị trí user mong muốn (luôn là right)
      // Nếu dài quá sẽ dùng thanh cuộn ngang

      // Update class to match actual position
      bubble.className = `ftc-guide-bubble pos-${pos}`;

      if (pos === 'right') {
        bubble.style.left = (targetLeft + rect.width + 12) + 'px';
        bubble.style.top = (targetTop + (rect.height / 2) - (bHeight / 2)) + 'px';
      } else if (pos === 'left') {
        bubble.style.left = (targetLeft - bWidth - 12) + 'px';
        bubble.style.top = (targetTop + (rect.height / 2) - (bHeight / 2)) + 'px';
      } else if (pos === 'bottom') {
        bubble.style.left = (targetLeft + (rect.width / 2) - (bWidth / 2)) + 'px';
        bubble.style.top = (targetTop + rect.height + 10) + 'px';
      } else if (pos === 'top') {
        bubble.style.left = (targetLeft + (rect.width / 2) - (bWidth / 2)) + 'px';
        bubble.style.top = (targetTop - bHeight - 10) + 'px';
      }

    });

    // Remove any leftover bubbles for non-matching indices
    document.querySelectorAll('.ftc-guide-bubble').forEach(el => {
      const idx = parseInt(el.dataset.guideIndex, 10);
      if (isNaN(idx) || !currentPopups[idx]) {
        el.remove();
      }
    });
  }

  // Forward message to all child subframes recursively
  function forwardToSubframes(data) {
    if (window.frames && window.frames.length > 0) {
      for (let i = 0; i < window.frames.length; i++) {
        try {
          window.frames[i].postMessage(data, '*');
        } catch (e) {}
      }
    }
  }

  // Handle messages from parent, top, or subframes
  window.addEventListener('message', function (event) {
    const data = event.data;
    if (!data) return;

    if (data.type === 'SET_GUIDE_POPUPS') {
      currentPopups = data.popups || [];
      isEnabled = data.enabled !== false;
      window.__cachedGuidePopups = currentPopups;
      window.__cachedGuideEnabled = isEnabled;

      renderPopups();
      forwardToSubframes(data);
    } else if (data.type === 'CLEAR_GUIDE_POPUPS') {
      isEnabled = false;
      window.__cachedGuidePopups = [];
      window.__cachedGuideEnabled = false;
      clearPopups();
      forwardToSubframes(data);
    } else if (data.type === 'REQUEST_GUIDE_POPUPS') {
      // If we have cached popups (e.g. we are index.asp), answer child frame immediately
      if (window.__cachedGuidePopups && window.__cachedGuidePopups.length > 0) {
        forwardToSubframes({
          type: 'SET_GUIDE_POPUPS',
          popups: window.__cachedGuidePopups,
          enabled: window.__cachedGuideEnabled !== false
        });
      }
      requestPopupsFromTop();
    }
  });

  function requestPopupsFromTop() {
    try {
      if (window.top && window.top !== window) {
        window.top.postMessage({ type: 'REQUEST_GUIDE_POPUPS' }, '*');
      }
    } catch (e) {}
    try {
      if (window.parent && window.parent !== window && window.parent !== window.top) {
        window.parent.postMessage({ type: 'REQUEST_GUIDE_POPUPS' }, '*');
      }
    } catch (e) {}
  }

  function init() {
    injectStyles();
    requestPopupsFromTop();

    // Loop interval to maintain popup positioning
    setInterval(() => {
      // If parent has cached popups, sync
      try {
        if (window.parent && window.parent.__cachedGuidePopups) {
          currentPopups = window.parent.__cachedGuidePopups;
          isEnabled = window.parent.__cachedGuideEnabled !== false;
        }
      } catch (e) {}

      // If we have subframes and cached popups, broadcast to them
      if (window.__cachedGuidePopups && window.__cachedGuidePopups.length > 0) {
        forwardToSubframes({
          type: 'SET_GUIDE_POPUPS',
          popups: window.__cachedGuidePopups,
          enabled: window.__cachedGuideEnabled !== false
        });
      }

      if (isEnabled && currentPopups && currentPopups.length > 0) {
        renderPopups();
      } else if (isEnabled) {
        requestPopupsFromTop();
      } else {
        clearPopups();
      }
    }, 400);

    window.addEventListener('resize', renderPopups);
    window.addEventListener('scroll', renderPopups);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export globally
  window.__ftcGuide = {
    setPopups: function (popups, enabled) {
      currentPopups = popups || [];
      isEnabled = enabled !== false;
      renderPopups();
    },
    clear: clearPopups,
    render: renderPopups
  };
})();
