/* 模板卡片与首页纸张预览共用。 */
(function (global) {
  'use strict';
  var T = global.CBTemplates, G = global.CBGrids, P = global.CBPinyin;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------------- 迷你预览 ---------------- */
  function miniHTML(settings, chars, rows, cols) {
    var grid = settings.grid || 'tianzi';
    var svg = G.gridSVG(grid, { line: '#9a9386', guide: '#c8c2b6', width: 0.8, dash: true });
    var pySvg = G.gridSVG('sixiang', { line: '#c8c2b6', guide: '#c8c2b6', width: 0.7, dash: false });
    var showPy = !!settings.showPinyin && settings.mode === 'hanzi';
    var charsArr = String(chars || '天地人').split('');
    var html = '<div class="mini-sheet" style="--cols:' + cols + '">';
    var k = 0;
    for (var r = 0; r < rows; r++) {
      html += '<div class="mini-row">';
      for (var c = 0; c < cols; c++) {
        var ch = charsArr[k % charsArr.length]; k++;
        var isTrace = c % 3 !== 0 && !!settings.trace;
        html += '<div class="mini-cell' + (isTrace ? ' is-trace' : '') + '">' +
          (showPy ? '<div class="mini-py">' + pySvg + '<span>' +
            (isTrace ? '' : esc(P.pinyinOf(ch))) + '</span></div>' : '') +
          '<b style="top:' + (showPy ? '36%' : '0') + '">' +
          esc(ch) + '</b>' + svg + '</div>';
      }
      html += '</div>';
    }
    return html + '</div>';
  }

  /* 模板演示文本（缩略图 / Hero 轮播共用） */
  var DEMO_TEXT = {
    'tianzi-pinyin': '天地人', 'mizi-trace': '春晓眠', 'mihui-pro': '结构美', 'hui-gongge': '内外收',
    'jiugong': '比例匀', 'pinyin-4line': 'aoei', 'english-4line': 'AaBb',
    'number': '1234', 'gushi-vertical': '床前明月光疑是地上霜', 'gushi-square': '床前明月光疑是地上霜',
    'composition': '春天来了小草发芽', 'name-practice': '李小明', 'basic-strokes': '横竖撇',
    'pen-control': '', 'zuoye-blank': '', 'calligraphy-work': '静夜思'
  };

  /**
   * 按可用宽高反推能填满的行数（保持格子正方形）
   * @return {number} 行数
   */
  function calcRows(s, cols, w, h) {
    var cellW = w / cols;
    /* 迷你预览中拼音画在格内，行高即格高（四线三格略高） */
    var rowH = s.grid === 'sixiang' ? cellW * 1.15 : cellW;
    if (!rowH) return 4;
    return Math.max(2, Math.min(18, Math.floor(h / rowH)));
  }

  /** 生成某模板的迷你预览（mini-sheet HTML）
   * @param {object} t   模板对象
   * @param {number} rows 固定行数（未传尺寸时使用）
   * @param {object} opts { w, h } 可用宽高（px），传入则自动填满
   */
  function tplPreview(t, rows, opts) {
    var s = t.settings || {};
    var chars = DEMO_TEXT[t.id] || '天地人';
    var cols = Math.min(parseInt(s.cols, 10) || 6, 7);
    opts = opts || {};
    var fill = opts.h > 0 && opts.w > 0;
    var w = opts.w || 0, h = opts.h || 0;

    if (t.id === 'pen-control') {
      var pats = ['wave', 'dots_h', 'loops', 'zigzag', 'spring'];
      var pRows = fill ? Math.max(3, Math.round(h / 48)) : rows + 1;
      var lines = '';
      for (var pi = 0; pi < pRows; pi++) {
        lines += '<div style="' + (fill ? 'flex:1;min-height:14px;' : 'height:16px;') + 'color:#9a9386">' +
          G.patternSVG(pats[pi % pats.length], 100, 24).replace('<svg ', '<svg style="width:100%;height:100%" ') +
          '</div>';
      }
      return '<div class="mini-sheet" style="--cols:6;padding:10px' + (fill ? ';height:100%' : '') + '">' +
        '<div style="display:flex;flex-direction:column;gap:6px' + (fill ? ';height:100%' : '') + '">' +
        lines + '</div></div>';
    }
    if (t.id === 'basic-strokes') {
      var bcols = 4;
      var brows = fill ? Math.max(2, Math.floor(h / (w / bcols))) : rows;
      var rowsHtml = '';
      for (var ri = 0; ri < brows; ri++) {
        rowsHtml += '<div class="mini-row">' +
          G.BASIC_STROKES.map(function (b, bi) { return b; })
            .slice(ri * bcols, ri * bcols + bcols)
            .concat(G.BASIC_STROKES.slice(0, Math.max(0, ri * bcols + bcols - G.BASIC_STROKES.length)))
            .map(function (b) {
              return '<div class="mini-cell">' + G.strokeSVG(b.p) + '</div>';
            }).join('') + '</div>';
      }
      return '<div class="mini-sheet" style="--cols:' + bcols + '">' + rowsHtml + '</div>';
    }
    if (s.mode === 'vertical') {
      var cell = fill ? Math.max(16, Math.min(w / 4, h / 9)) : 16;
      var colCount = Math.max(2, Math.floor((w + 4) / (cell + 4)));
      var perCol = Math.max(3, Math.floor(h / cell));
      var src = (chars || '天地人').split('');
      var colsHtml = '', k2 = 0;
      for (var ci = 0; ci < colCount; ci++) {
        var colItems = '';
        for (var vj = 0; vj < perCol; vj++) {
          colItems += '<div class="mini-cell" style="width:' + cell + 'px">' +
            '<b style="font-size:' + (cell * 0.55) + 'px">' + src[k2++ % src.length] + '</b>' +
            G.gridSVG('fang', { line: '#9a9386', guide: '#c8c2b6', width: 0.8 }) + '</div>';
        }
        colsHtml += '<div style="display:flex;flex-direction:column">' + colItems + '</div>';
      }
      return '<div class="mini-sheet" style="--cols:' + colCount + '">' +
        '<div style="display:flex;flex-direction:row-reverse;gap:4px;justify-content:center">' +
        colsHtml + '</div></div>';
    }
    return miniHTML(s, chars, fill ? calcRows(s, cols, w, h) : rows, cols);
  }

  global.CBPreview = { tplPreview: tplPreview };
})(typeof window !== 'undefined' ? window : globalThis);
