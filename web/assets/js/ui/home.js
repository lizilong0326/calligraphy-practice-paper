/* 首页纸张轮播。 */
(function () {
  'use strict';
  var T = window.CBTemplates, tplPreview = window.CBPreview.tplPreview;
  /* ---------------- Hero 轮播 ---------------- */
  var heroIdx = 0, heroTimer = null;
  var HERO_INTERVAL = 2800;

  /** 取纸卡内部可用尺寸（mini-sheet 自身还有 6px 内边距） */
  function sheetInner(sheet) {
    var cs = getComputedStyle(sheet);
    var w = sheet.offsetWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 12;
    var h = sheet.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 12;
    return { w: Math.max(60, w), h: Math.max(60, h) };
  }

  function heroShow(i, animate) {
    var sheet = document.querySelector('.hero-visual .sheet-1');
    var badge = document.getElementById('heroBadgeText');
    if (!sheet) return;
    var t = T.TEMPLATES[i % T.TEMPLATES.length];
    /* 按纸卡实际尺寸算行数，让内容铺满整张纸 */
    sheet.innerHTML = '<div class="hero-mini">' + tplPreview(t, 5, sheetInner(sheet)) + '</div>';
    if (animate) {
      var m = sheet.querySelector('.hero-mini');
      if (m) { m.style.animation = 'none'; void m.offsetWidth; m.style.animation = ''; }
    }
    if (badge) badge.textContent = t.name + ' · ' + (i + 1) + ' / ' + T.TEMPLATES.length;
  }

  function heroPlay() {
    stopHero();
    heroTimer = setInterval(function () {
      heroIdx = (heroIdx + 1) % T.TEMPLATES.length;
      heroShow(heroIdx, true);
    }, HERO_INTERVAL);
  }
  function stopHero() { if (heroTimer) { clearInterval(heroTimer); heroTimer = null; } }

  function buildHero() {
    var vis = document.querySelector('.hero-visual');
    if (!vis) return;
    /* 衬纸（静态装饰，同样铺满） */
    var s2 = vis.querySelector('.sheet-2');
    var s3 = vis.querySelector('.sheet-3');
    if (s2) {
      s2.innerHTML = tplPreview(T.get('gushi-square'), 5, sheetInner(s2));
    }
    if (s3) {
      s3.innerHTML = tplPreview(T.get('pinyin-4line'), 5, sheetInner(s3));
    }

    heroShow(0, false);
    heroPlay();

    vis.addEventListener('mouseenter', stopHero);
    vis.addEventListener('mouseleave', heroPlay);
    vis.addEventListener('click', function () {
      heroIdx = (heroIdx + 1) % T.TEMPLATES.length;
      heroShow(heroIdx, true);
      heroPlay();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopHero(); else heroPlay();
    });
    /* 断点变化后按新尺寸重排 */
    var rzTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(rzTimer);
      rzTimer = setTimeout(function () {
        if (s2) s2.innerHTML = tplPreview(T.get('gushi-square'), 5, sheetInner(s2));
        if (s3) s3.innerHTML = tplPreview(T.get('pinyin-4line'), 5, sheetInner(s3));
        heroShow(heroIdx, false);
      }, 220);
    });
  }


  function init() {
    buildHero();
    var n = T.TEMPLATES.length;
    document.getElementById('statTpl').textContent = n;
    document.getElementById('heroTplBtn').textContent = '浏览 ' + n + ' 种模板';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
