/* 首页与资料页面共用的顶栏行为。 */
(function () {
  'use strict';
  function init() {
    var bar = document.getElementById('topbar');
    function onScroll() { if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
