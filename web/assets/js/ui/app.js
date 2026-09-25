/* ============================================================
 * ui/app.js —— 应用装配：面板 / 预览 / 模板 / 素材 / 打印
 * ========================================================== */
(function () {
  'use strict';

  var S = window.CBStore, T = window.CBTemplates, R = window.CBRender,
    L = window.CBLayout, G = window.CBGrids, P = window.CBPinyin, C = window.CBControls;

  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* 受限制输入的模板模式：输入时自动过滤掉不适合的字符 */
  var RESTRICTED_MODES = { pinyin: 1, english: 1, number: 1 };
  var MODE_HINTS = {
    pinyin: '拼音模板已自动过滤汉字，仅保留拼音字母与声调。',
    english: '英文模板已自动过滤汉字，仅保留英文字母与空格。',
    number: '数字模板已自动过滤汉字与字母，仅保留数字与算式符号。'
  };
  function sanitizeText(value, mode) {
    if (!RESTRICTED_MODES[mode]) return value;
    var s = String(value || '');
    // 全角数字/字母转半角
    s = s.replace(/[\uFF10-\uFF19]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
    s = s.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
    // 过滤 CJK 汉字/扩展 A / CJK 标点 / 全角符号
    s = s.replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303F\uFF00-\uFFEF]+/g, ' ');
    if (mode === 'number') s = s.replace(/[a-zA-Z]/g, '');
    // 折叠多余空格，保留换行
    return s.replace(/[ \t]+/g, ' ').replace(/^[ \t]+|[ \t]+$/gm, '');
  }
  function updateInputHint() {
    var el = $('#inputHint');
    if (!el) return;
    var mode = S.get().mode;
    if (RESTRICTED_MODES[mode]) {
      el.textContent = MODE_HINTS[mode];
      el.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
    }
  }

  var ICONS = {
    hanzi: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M12 3.5v17M3.5 12h17"/>',
    pinyin: '<path d="M3 6.5h18M3 11h18M3 15.5h18"/><path d="M8.5 6.5v5M15 11v4.5"/>',
    abc: '<path d="M3 18l5-12 5 12M4.6 14.6h6.8"/><path d="M15 18v-4.5a2.6 2.6 0 0 1 5.2 0V18"/>',
    num: '<path d="M6 6v12M11 6v12M16 6v12"/><path d="M4 9h4M13 15h4"/>',
    poem: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>',
    write: '<path d="M4 20l3.2-.8L18.4 8 16 5.6 4.8 16.8z"/><path d="M14.4 4.4l3.6 3.6"/>',
    stroke: '<path d="M6 5c2.6 4 4.6 8 5.6 14M18 5c-2.6 4-4.6 8-5.6 14"/>',
    blank: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5A1.5 1.5 0 0 0 20 18.5z"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.hanzi) + '</svg>';
  }

  /* ---------------- 状态 ---------------- */
  var zoom = 1, lastSize = null, rafId = 0;
  var PANEL_REBUILD_KEYS = { trace: 1, showPinyin: 1, mode: 1, template: 1 };
  var PHONE = /[?&]phone=1/.test(location.search);

  /* ---------------- Toast ---------------- */
  function toast(msg, kind) {
    var wrap = $('#toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = (kind === 'ok'
      ? '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
      : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.2v.3"/></svg>') +
      '<span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 260);
    }, 2400);
  }

  var tplPreview = window.CBPreview.tplPreview;

  /* ---------------- 模板库 ---------------- */
  function buildGallery() {
    var wrap = $('#tplGrid');
    wrap.innerHTML = T.TEMPLATES.map(function (t) {
      var preview = tplPreview(t, 3);
      return '<button type="button" class="tpl-card" data-tpl="' + t.id + '">' +
        '<span class="tpl-preview">' + preview + '</span>' +
        '<span class="tpl-card-body">' +
        '<span class="tpl-card-top"><span class="tpl-card-name">' + esc(t.name) + '</span>' +
        (t.tag ? '<span class="tpl-tag">' + esc(t.tag) + '</span>' : '') + '</span>' +
        '<span class="tpl-card-desc">' + esc(t.desc) + '</span></span></button>';
    }).join('');

    wrap.addEventListener('click', function (e) {
      var card = e.target.closest('.tpl-card');
      if (!card) return;
      applyTemplate(card.getAttribute('data-tpl'));
      document.getElementById('studio').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    /* 卡片光标跟随高光 */
    wrap.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.tpl-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  function applyTemplate(id) {
    var tpl = S.applyTemplate(id);
    buildPanel(true);
    var clean = sanitizeText(S.get().text, S.get().mode);
    if (clean !== S.get().text) S.set('text', clean, true);
    $('#textInput').value = S.get().text || '';
    updateInputHint();
    updateTplCurrent();
    renderPyCheck();
    schedulePreview();
    markActiveTemplate();
    toast('已套用「' + tpl.name + '」', 'ok');
  }

  function markActiveTemplate() {
    $$('.tpl-card').forEach(function (c) {
      c.classList.toggle('is-active', c.getAttribute('data-tpl') === S.get().template);
    });
  }

  function updateTplCurrent() {
    var t = T.get(S.get().template);
    $('#tplCurrentName').textContent = t.name;
    $('#tplCurrentDesc').textContent = t.desc;
    $('#tplCurrentIco').innerHTML = icon(t.icon);
  }

  /* ---------------- 控制面板 ---------------- */
  function buildPanel(keepScroll) {
    var wrap = $('#panelSettings');
    var openState = {};
    $$('.pgroup').forEach(function (g) { openState[g.getAttribute('data-group')] = g.classList.contains('is-open'); });
    var scroll = keepScroll ? $('.panel-scroll').scrollTop : null;

    wrap.innerHTML = C.renderPanel(S.get());
    $$('.pgroup').forEach(function (g) {
      var id = g.getAttribute('data-group');
      var open = openState[id] !== undefined ? openState[id] : g.classList.contains('is-open');
      g.classList.toggle('is-open', open);
    });
    syncVisibility();
    if (scroll !== null) $('.panel-scroll').scrollTop = scroll;
  }

  /** 按 visible() 显隐每一行 */
  function syncVisibility() {
    var state = S.get();
    C.SCHEMA.forEach(function (g) {
      g.items.forEach(function (item) {
        var row = document.querySelector('[data-row="' + item.key + '"]');
        if (!row) return;
        var show = !item.visible || item.visible(state);
        row.hidden = !show;
      });
    });
  }

  function setPath(obj, path, value) {
    var parts = path.split('.'), o = obj, i;
    for (i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]]) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = value;
  }

  function handleBind(key, rawValue, type) {
    var value = rawValue;
    if (type === 'number') value = parseFloat(rawValue);
    if (type === 'bool') value = !!rawValue;

    if (key === 'palette') {
      var pal = null;
      T.PALETTES.forEach(function (p) { if (p.id === value) pal = p; });
      if (pal) {
        S.set('lineColor', pal.line, true);
        S.set('guideColor', pal.guide, true);
        S.set('textColor', pal.text, true);
        buildPanel(true);
        schedulePreview();
      }
      return;
    }
    S.set(key, value);
    if (PANEL_REBUILD_KEYS[key]) buildPanel(true);
    else syncVisibility();
    /* 手动切换内容类型时同步输入提示。 */
    if (key === 'mode') {
      var clean = sanitizeText(S.get().text, value);
      if (clean !== S.get().text) { S.set('text', clean, true); $('#textInput').value = clean; }
      updateInputHint();
      }
    /* 内容类型或「显示拼音」开关变化后，拼音校对区要跟着显隐 */
    if (key === 'mode' || key === 'showPinyin') renderPyCheck();
    schedulePreview();
  }

  function bindPanel() {
    var panel = $('#panelSettings');

    panel.addEventListener('click', function (e) {
      var seg = e.target.closest('.seg-btn');
      if (seg) {
        var box = seg.closest('[data-bind]');
        Array.prototype.forEach.call(box.querySelectorAll('.seg-btn'), function (b) { b.classList.remove('is-on'); });
        seg.classList.add('is-on');
        handleBind(box.getAttribute('data-bind'), seg.getAttribute('data-seg'), box.getAttribute('data-type'));
        return;
      }
      var chip = e.target.closest('.chip');
      if (chip) {
        var box2 = chip.closest('[data-bind]');
        var arr = (C.getPath(S.get(), box2.getAttribute('data-bind')) || []).slice();
        var v = chip.getAttribute('data-chip');
        var idx = arr.indexOf(v);
        if (idx >= 0) arr.splice(idx, 1); else arr.push(v);
        chip.classList.toggle('is-on', idx < 0);
        handleBind(box2.getAttribute('data-bind'), arr, 'array');
        return;
      }
      var sw = e.target.closest('.sw');
      if (sw) {
        var box3 = sw.closest('.ctl-color');
        var key = box3.querySelector('input[type=color]').getAttribute('data-bind');
        var color = sw.getAttribute('data-swatch');
        box3.querySelector('input[type=color]').value = color;
        box3.querySelector('.color-well span').style.background = color;
        $$('.sw', box3).forEach(function (s) { s.classList.toggle('is-on', s === sw); });
        handleBind(key, color, 'string');
        return;
      }
      var head = e.target.closest('.pgroup-head');
      if (head) {
        head.closest('.pgroup').classList.toggle('is-open');
      }
    });

    panel.addEventListener('input', function (e) {
      var t = e.target;
      var bind = t.getAttribute && t.getAttribute('data-bind');
      if (!bind) return;
      var type = t.getAttribute('data-type') || 'string';
      var v = type === 'bool' ? t.checked : t.value;
      if (t.type === 'range') {
        var out = t.closest('.ctl-range').querySelector('.ctl-out');
        var item = findItem(bind);
        out.textContent = v + ((item && item.unit) || '');
      }
      if (t.type === 'color') {
        t.closest('.ctl-color').querySelector('.color-well span').style.background = v;
      }
      if (t.type === 'text') {
        handleBind(bind, v, type);
        return;
      }
      handleBind(bind, v, type);
    });

    panel.addEventListener('change', function (e) {
      var t = e.target;
      if (t.tagName === 'SELECT' || (t.type === 'checkbox')) {
        var bind = t.getAttribute('data-bind');
        if (!bind) return;
        handleBind(bind, t.type === 'checkbox' ? t.checked : t.value, t.getAttribute('data-type') || 'string');
      }
    });
  }

  function findItem(key) {
    var f = null;
    C.SCHEMA.forEach(function (g) {
      g.items.forEach(function (i) { if (i.key === key) f = i; });
    });
    return f;
  }

  /* ---------------- 拼音校对 ---------------- */
  function renderPyCheck() {
    var box = $('#pyCheck');
    var s = S.get();
    /* 只有真正在字帖上显示拼音的模板（mode=hanzi 且 showPinyin）才需要校对 */
    if (s.mode !== 'hanzi' || !s.showPinyin) {
      $('#pyBlock').hidden = true;
      return;
    }
    $('#pyBlock').hidden = false;
    var tokens = L.parseContent(s.text || '', s);
    var seen = {}, list = [];
    tokens.forEach(function (t) {
      if (!t.c || seen[t.c] || !P.isHanzi(t.c)) return;
      seen[t.c] = 1;
      list.push(t);
    });
    box.innerHTML = list.slice(0, 120).map(function (t) {
      var cands = P.candidates(t.c);
      var multi = cands.length > 1;
      var cur = S.getPinyinOverride(t.c) || t.py || cands[0] || '';
      return '<button type="button" class="py-item' + (multi ? ' is-multi' : '') +
        '" data-ch="' + esc(t.c) + '" data-i="' + (cands.indexOf(cur) >= 0 ? cands.indexOf(cur) : 0) + '">' +
        '<span class="py-c">' + esc(t.c) + '</span>' +
        '<span class="py-p">' + esc(cur || '—') + '</span></button>';
    }).join('');
    var n = list.filter(function (t) { return P.candidates(t.c).length > 1; }).length;
    $('#pyNote').textContent = n ? n + ' 个多音字待确认' : '点击拼音可切换多音字';
  }

  function bindPyCheck() {
    $('#pyCheck').addEventListener('click', function (e) {
      var item = e.target.closest('.py-item');
      if (!item) return;
      var ch = item.getAttribute('data-ch');
      var cands = P.candidates(ch);
      if (cands.length <= 1) { toast('「' + ch + '」只有一种读音'); return; }
      var i = (parseInt(item.getAttribute('data-i'), 10) + 1) % cands.length;
      S.setPinyinOverride(ch, cands[i]);
      item.setAttribute('data-i', i);
      item.querySelector('.py-p').textContent = cands[i];
      schedulePreview();
    });
  }

  /* ---------------- 预览 ---------------- */
  function renderPreview() {
    var s = S.get();
    var res = R.render(s);
    $('#pages').innerHTML = res.html;
    lastSize = res.size;
    $('#stageInfo').textContent = res.pageCount + ' 页 · ' + res.cellCount + ' 格';
    $('#studioMeta').textContent = T.get(s.template).name + ' · ' + res.pageCount + ' 页 · ' +
      res.cellCount + ' 格 · ' + s.pageSize;
    updatePrintRule(res.size);
    applyZoom();
    if (PHONE) phoneFit();
  }

  /** 手机版：预览宽度自适应（不裁剪） */
  function phoneFit() {
    if (!lastSize) return;
    var cw = ($('#canvas').clientWidth || 360) - 24;
    zoom = Math.max(0.25, Math.min(1.5, cw / lastSize.w));
    applyZoom();
  }

  function schedulePreview() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () { rafId = 0; renderPreview(); });
  }

  function applyZoom() {
    $('#pages').style.transform = 'scale(' + zoom + ')';
    $('#zoomVal').textContent = Math.round(zoom * 100) + '%';
  }
  function fitZoom() {
    if (!lastSize) return;
    var cw = $('#canvas').clientWidth - 60;
    zoom = Math.max(0.3, Math.min(1.4, cw / lastSize.w));
    applyZoom();
  }

  function updatePrintRule(size) {
    var el = document.getElementById('printPageRule');
    if (!el) {
      el = document.createElement('style');
      el.id = 'printPageRule';
      document.head.appendChild(el);
    }
    el.textContent = '@media print{@page{size:' + size.mmW + 'mm ' + size.mmH + 'mm;margin:0}}';
  }

  /* ---------------- 打印 / 导出 ---------------- */
  function doPrint() {
    renderPreview();
    var font = R.fontStack(S.get().font);
    var ready = font.family && document.fonts
      ? document.fonts.load((font.weight || 400) + ' 48px "' + font.family + '"', S.get().text || '天地人')
      : Promise.resolve();
    ready.then(function () {
      toast('已唤起打印，PDF 请选择「另存为 PDF」');
      window.print();
    }, function () {
      toast('字体加载失败，打印时将使用备用字体');
      window.print();
    });
  }

  function exportConfig() {
    var s = S.get();
    var data = JSON.stringify(s, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '练字帖-配置-' + (s.template || 'custom') + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1200);
    toast('配置已导出', 'ok');
  }

  /* ---------------- 杂项 ---------------- */
  function initScroll() {
    var bar = $('#topbar');
    function onScroll() { bar.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

  }

  function bindGlobal() {
    /* 内容输入 */
    var ta = $('#textInput');
    ta.addEventListener('input', function () {
      var mode = S.get().mode;
      var clean = sanitizeText(ta.value, mode);
      if (clean !== ta.value) {
        var start = ta.selectionStart;
        var oldLen = ta.value.length;
        ta.value = clean;
        // 尽量保留光标位置：移除的字符在光标前则回退；否则保持
        var diff = oldLen - clean.length;
        if (diff > 0 && start > 0) start = Math.max(0, start - diff);
        ta.setSelectionRange(start, start);
      }
      S.set('text', ta.value);
      renderPyCheck();
      schedulePreview();
    });

    /* 快捷 */
    $$('.quick').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-quick');
        if (k === 'clear') { ta.value = ''; S.set('text', ''); renderPyCheck(); schedulePreview(); return; }
        if (k === 'name') { applyTemplate('name-practice'); ta.focus(); return; }
      });
    });

    /* 缩放 */
    $('#zoomIn').addEventListener('click', function () { zoom = Math.min(2, zoom + 0.1); applyZoom(); });
    $('#zoomOut').addEventListener('click', function () { zoom = Math.max(0.25, zoom - 0.1); applyZoom(); });
    $('#zoomFit').addEventListener('click', fitZoom);
    window.addEventListener('resize', function () { if (zoom <= 1) fitZoom(); });

    /* 打印 / 导出 */
    $('#btnPrint').addEventListener('click', doPrint);
    $('#btnPrintTop').addEventListener('click', doPrint);
    $('#btnSavePreset').addEventListener('click', exportConfig);
    $('#btnResetTop').addEventListener('click', function () {
      S.reset(); buildPanel(); ta.value = S.get().text; updateTplCurrent();
      renderPyCheck(); schedulePreview(); markActiveTemplate(); toast('已恢复默认设置', 'ok');
    });

    /* 当前模板按钮 */
    $('#tplCurrent').addEventListener('click', function () {
      if (PHONE) {
        var tab = document.querySelector('.ptab[data-tab=tpl]');
        if (tab) tab.click();
      } else location.href = 'gallery.html';
    });
  }

  /* ---------------- 手机版（iPhone 外壳内） ---------------- */
  function initPhone() {
    document.body.classList.add('phone');

    /* 状态栏 + 灵动岛 */
    var status = document.createElement('div');
    status.className = 'phone-status';
    var now = new Date();
    var hh = now.getHours(), mm = ('0' + now.getMinutes()).slice(-2);
    status.innerHTML = '<span class="ps-time">' + hh + ':' + mm + '</span>' +
      '<span class="island" aria-hidden="true"></span>' +
      '<span class="ps-right" aria-hidden="true">●‌‌ ●‌ ●‌ 5G ▮</span>';

    /* 预览主区：把桌面 .stage 移入 */
    var main = document.createElement('div');
    main.className = 'phone-main';
    var stage = document.querySelector('.stage');
    if (stage) main.appendChild(stage);

    /* 底部工具栏 */
    var TABS = [
      { tab: 'tpl', label: '模板', html: icon('book') },
      { tab: 'content', label: '内容', html: icon('write') },
      { tab: 'set', label: '设置', html: icon('hanzi') },
      { tab: 'print', label: '打印', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 9V3.5h11V9M6.5 18H5a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 5 10.5h14A1.5 1.5 0 0 1 20.5 12v4.5A1.5 1.5 0 0 1 19 18h-1.5M6.5 14h11v6.5h-11z"/></svg>' }
    ];
    var tabbar = document.createElement('div');
    tabbar.className = 'phone-tabbar';
    tabbar.innerHTML = TABS.map(function (t) {
      return '<button type="button" class="ptab" data-tab="' + t.tab + '">' + t.html +
        '<span>' + t.label + '</span></button>';
    }).join('');

    /* 底部抽屉 */
    var sheet = document.createElement('div');
    sheet.className = 'phone-sheet';
    sheet.innerHTML = '<div class="sheet-grab"><span></span></div>' +
      '<div class="sheet-head"><h2 class="sheet-title">设置</h2><button type="button" class="sheet-done">完成</button></div>' +
      '<div class="sheet-content"></div>';
    var sheetContent = sheet.querySelector('.sheet-content');

    document.body.appendChild(status);
    document.body.appendChild(main);
    document.body.appendChild(tabbar);
    document.body.appendChild(sheet);

    /* 重排控件：把桌面面板里的各区块移入对应面板容器（拼音校对并入「内容」） */
    var pans = {};
    ['tpl', 'content', 'set'].forEach(function (k) {
      var d = document.createElement('div');
      d.className = 'phone-pan';
      d.setAttribute('data-pan', k);
      d.hidden = true;
      sheetContent.appendChild(d);
      pans[k] = d;
    });
    var gallery = document.getElementById('gallery');
    if (gallery) pans.tpl.appendChild(gallery);
    var contentBlock = document.querySelector('#panel .block');
    if (contentBlock) pans.content.appendChild(contentBlock);
    var pyBlock = document.getElementById('pyBlock');
    if (pyBlock) pans.content.appendChild(pyBlock);
    var panelSettings = document.getElementById('panelSettings');
    if (panelSettings) pans.set.appendChild(panelSettings);
    var panelFoot = document.querySelector('.panel-foot');
    if (panelFoot) panelFoot.style.display = 'none';

    var TITLES = { tpl: '模板库', content: '练习内容', set: '字格与样式' };

    function openSheet(k) {
      ['tpl', 'content', 'set'].forEach(function (x) { pans[x].hidden = x !== k; });
      sheet.querySelector('.sheet-title').textContent = TITLES[k] || '设置';
      sheet.classList.add('open');
      tabbar.querySelectorAll('.ptab').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-tab') === k);
      });
    }
    function closeSheet() {
      sheet.classList.remove('open');
      tabbar.querySelectorAll('.ptab').forEach(function (b) { b.classList.remove('is-active'); });
    }

    tabbar.addEventListener('click', function (e) {
      var b = e.target.closest('.ptab');
      if (!b) return;
      var k = b.getAttribute('data-tab');
      if (k === 'print') { closeSheet(); doPrint(); return; }
      if (sheet.classList.contains('open') && sheet.querySelector('.sheet-title').textContent === (TITLES[k] || '设置')) {
        closeSheet();
      } else {
        openSheet(k);
      }
    });

    sheet.querySelector('.sheet-done').addEventListener('click', closeSheet);
    sheet.querySelector('.sheet-grab').addEventListener('click', closeSheet);

    /* 模板选中后关闭抽屉（预览已实时更新） */
    var tplGrid = document.getElementById('tplGrid');
    if (tplGrid) tplGrid.addEventListener('click', function (e) {
      if (e.target.closest('.tpl-card')) setTimeout(closeSheet, 0);
    });

    /* 初始自适应 + 尺寸变化重排 */
    phoneFit();
    window.addEventListener('resize', function () { if (PHONE) phoneFit(); });
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    var loaded = S.load();
    if (!loaded) S.applyTemplate('tianzi-pinyin');
    buildGallery();
    buildPanel();
    bindPanel();
    bindPyCheck();
    bindGlobal();
    initScroll();
    updateTplCurrent();
    markActiveTemplate();
    var ta = $('#textInput');
    var clean = sanitizeText(S.get().text, S.get().mode);
    if (clean !== S.get().text) S.set('text', clean, true);
    ta.value = S.get().text || '';
    updateInputHint();
    renderPyCheck();
    renderPreview();
    fitZoom();
    var tplN = T.TEMPLATES.length;
    var stat = $('#statTpl'); if (stat) stat.textContent = tplN;
    var heroBtn = $('#heroTplBtn'); if (heroBtn) heroBtn.textContent = '浏览 ' + tplN + ' 种模板';
    var gDesc = $('#galleryDesc'); if (gDesc) gDesc.textContent = tplN + ' 种常用字帖版式，点一下即可套用，再微调成自己的。';
    if (PHONE) initPhone();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
