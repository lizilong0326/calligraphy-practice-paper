/* 独立模板库；选中后在工作台继续编辑。 */
(function () {
  'use strict';
  var T = window.CBTemplates, S = window.CBStore;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildGallery() {
    var grid = document.getElementById('tplGrid');
    if (!grid) return;
    var preview = window.CBPreview.tplPreview;
    S.load();
    grid.innerHTML = T.TEMPLATES.map(function (t) {
      return '<button type="button" class="tpl-card' +
        (S.get().template === t.id ? ' is-active' : '') + '" data-tpl="' + esc(t.id) + '">' +
        '<span class="tpl-preview">' + preview(t, 3) + '</span>' +
        '<span class="tpl-card-body"><span class="tpl-card-top"><span class="tpl-card-name">' +
        esc(t.name) + '</span>' + (t.tag ? '<span class="tpl-tag">' + esc(t.tag) + '</span>' : '') +
        '</span><span class="tpl-card-desc">' + esc(t.desc) + '</span></span></button>';
    }).join('');
    document.getElementById('galleryDesc').textContent =
      T.TEMPLATES.length + ' 种常用字帖版式，选择后进入工作台继续调整。';
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-tpl]');
      if (!card) return;
      S.applyTemplate(card.getAttribute('data-tpl'));
      location.href = 'studio.html';
    });
    grid.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.tpl-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  function init() { buildGallery(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
