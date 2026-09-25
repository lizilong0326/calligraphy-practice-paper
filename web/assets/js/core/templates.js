/* ============================================================
 * core/templates.js —— 字帖模板预设
 * 模板 = 一组 settings 覆盖值；新增模板只需在此追加
 * ========================================================== */
(function (global) {
  'use strict';

  /* ---------------- 模板预设 ---------------- */
  var TEMPLATES = [
    {
      id: 'tianzi-pinyin', name: '拼音田字格', tag: '热门', icon: 'hanzi',
      desc: '生字 + 拼音 + 描红，低年级每日练字标配',
      sample: '天地人你我他一二三四五六七八九十',
      settings: {
        mode: 'hanzi', grid: 'tianzi', showPinyin: true, cols: 9, repeat: 3,
        trace: true, traceOpacity: 0.25, font: 'kaiti', lineColor: '#2b2b2b',
        guideColor: '#c8c2b6', textColor: '#1a1a1a', rowGap: 3, pinyinStyle: 'tone',
        header: { title: '每日练字', fields: ['姓名', '班级', '日期'] }
      }
    },
    {
      id: 'mizi-trace', name: '米字格描红', tag: '进阶', icon: 'hanzi',
      desc: '带对角辅助线，看清起笔收笔与笔画走向',
      sample: '春眠不觉晓处处闻啼鸟',
      settings: {
        mode: 'hanzi', grid: 'mizi', showPinyin: true, cols: 9, repeat: 2,
        trace: true, traceOpacity: 0.3, font: 'kaiti', rowGap: 4,
        header: { title: '硬笔书法练习', fields: ['姓名', '日期'] }
      }
    },
    {
      id: 'mihui-pro', name: '米字回宫格', tag: '结构', icon: 'hanzi',
      desc: '内外框 + 斜线，专治结构松散与重心偏移',
      sample: '结构匀称收放有度',
      settings: {
        mode: 'hanzi', grid: 'mihui', showPinyin: false, cols: 9, repeat: 3,
        trace: true, traceOpacity: 0.22, rowGap: 4
      }
    },
    {
      id: 'hui-gongge', name: '回宫格', tag: '结构', icon: 'hanzi',
      desc: '内宫定位中宫，外宫控制收放',
      sample: '内外相宜中宫收紧',
      settings: {
        mode: 'hanzi', grid: 'hui', showPinyin: false, cols: 9, repeat: 3,
        trace: true, traceOpacity: 0.22, rowGap: 4
      }
    },
    {
      id: 'jiugong', name: '九宫格', tag: '比例', icon: 'hanzi',
      desc: '九等分辅助，精细观察部件布局与占格',
      sample: '比例协调重心平稳',
      settings: {
        mode: 'hanzi', grid: 'jiugong', showPinyin: false, cols: 8, repeat: 2,
        trace: true, traceOpacity: 0.25, rowGap: 4
      }
    },
    {
      id: 'pinyin-4line', name: '拼音四线三格', tag: '拼音', icon: 'pinyin',
      desc: '声母韵母专项，格线贴合教材规范',
      sample: 'b p m f d t n l g k h j q x zh ch sh r z c s y w',
      settings: {
        mode: 'pinyin', grid: 'sixiang', showPinyin: false, cols: 10, repeat: 2,
        trace: true, traceOpacity: 0.3, rowGap: 2, font: 'kaiti'
      }
    },
    {
      id: 'english-4line', name: '英文四线三格', tag: '英语', icon: 'abc',
      desc: '字母占格规范，含大小写对照练习',
      sample: 'A a B b C c D d E e F f G g H h',
      settings: {
        mode: 'english', grid: 'sixiang', showPinyin: false, cols: 10, repeat: 2,
        trace: true, traceOpacity: 0.3, rowGap: 2, font: 'english',
        header: { title: 'English Writing', fields: ['Name', 'Date'] }
      }
    },
    {
      id: 'number', name: '数字练习', tag: '启蒙', icon: 'num',
      desc: '0-9 与算式书写，田字格居中定位',
      sample: '0 1 2 3 4 5 6 7 8 9 10',
      settings: {
        mode: 'number', grid: 'tianzi', showPinyin: false, cols: 9, repeat: 4,
        trace: true, traceOpacity: 0.3, rowGap: 3, font: 'kaiti'
      }
    },
    {
      id: 'gushi-vertical', name: '古诗竖排（右起）', tag: '作品', icon: 'poem',
      desc: '传统竖排右起，含落款列，适合作品展示',
      sample: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡',
      settings: {
        mode: 'vertical', grid: 'fang', showPinyin: false, cols: 0, repeat: 1,
        trace: true, traceOpacity: 0.2, vertical: true, rowGap: 2, font: 'kaiti',
        cellSizeV: 20,
        header: { title: '', fields: [] }
      }
    },
    {
      id: 'gushi-square', name: '古诗方格抄写', tag: '作品', icon: 'poem',
      desc: '方格 + 标点占位，整篇抄写不串行',
      sample: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡',
      settings: {
        mode: 'composition', grid: 'fang', showPinyin: false, cols: 12, repeat: 1,
        trace: false, rowGap: 2, font: 'kaiti',
        header: { title: '古诗抄写', fields: ['姓名'] }
      }
    },
    {
      id: 'composition', name: '作文稿纸', tag: '高年级', icon: 'write',
      desc: '标准方格稿纸，每格一字，标题居中',
      sample: ' ',
      settings: {
        mode: 'composition', grid: 'fang', showPinyin: false, cols: 15, repeat: 1,
        trace: false, rowGap: 0, font: 'songti', keepPunct: true,
        header: { title: '', fields: ['学校', '班级', '姓名'] }
      }
    },
    {
      id: 'name-practice', name: '姓名练习', tag: '启蒙', icon: 'hanzi',
      desc: '大字反复书写，适合学写自己的名字',
      sample: '李小明',
      settings: {
        mode: 'hanzi', grid: 'tianzi', showPinyin: true, cols: 8, repeat: 6,
        trace: true, traceOpacity: 0.18, rowGap: 3, font: 'kaiti',
        header: { title: '姓名练习', fields: ['姓名'] }
      }
    },
    {
      id: 'basic-strokes', name: '基本笔画', tag: '启蒙', icon: 'stroke',
      desc: '24 个基本笔画，一笔一画打基础',
      sample: '',
      settings: {
        mode: 'stroke', grid: 'tianzi', showPinyin: false, cols: 8, repeat: 3,
        trace: true, traceOpacity: 0.25, rowGap: 3
      }
    },
    {
      id: 'pen-control', name: '控笔训练', tag: '启蒙', icon: 'stroke',
      desc: '点连点 / 波浪 / 螺旋，先控笔再写字',
      sample: '',
      settings: {
        mode: 'pattern', grid: 'none', showPinyin: false, cols: 1, repeat: 2,
        trace: false, rowGap: 4, pattern: 'wave', cellRatio: 0.17,
        header: { title: '控笔训练', fields: ['姓名'] }
      }
    },
    {
      id: 'zuoye-blank', name: '空白练习纸', tag: '通用', icon: 'blank',
      desc: '纯格子，任你自由发挥',
      sample: '',
      settings: {
        mode: 'composition', grid: 'none', showPinyin: false, cols: 8, repeat: 1,
        trace: false, rowGap: 3
      }
    },
    {
      id: 'calligraphy-work', name: '硬笔作品纸', tag: '作品', icon: 'poem',
      desc: '田字格大字 + 落款区，比赛投稿可用',
      sample: '床前明月光疑是地上霜举头望明月低头思故乡',
      settings: {
        mode: 'hanzi', grid: 'tianzi', showPinyin: false, cols: 7, repeat: 1,
        trace: false, rowGap: 5, font: 'kaiti', 
        header: { title: '', fields: [] }
      }
    },

    /* ------- 以下为 zidianba.com/templates 去重后补充的模板 ------- */
    {
      id: 'mizi-blank', name: '米字格空白', tag: '通用', icon: 'blank',
      desc: '米字格空白页，可自由书写或打印手写，主题色可切换',
      sample: '',
      settings: {
        mode: 'hanzi', grid: 'mizi', showPinyin: false, cols: 10, repeat: 1,
        trace: false, rowGap: 3
      }
    },
    {
      id: 'fang-blank', name: '方格空白', tag: '通用', icon: 'blank',
      desc: '干净方格空白页，抄写与自由书写两用',
      sample: '',
      settings: {
        mode: 'composition', grid: 'fang', showPinyin: false, cols: 14, repeat: 1,
        trace: false, rowGap: 2
      }
    },
    {
      id: 'shengzi', name: '生字本', tag: '课堂', icon: 'hanzi',
      desc: '田字格 + 拼音 + 头行，贴近小学语文课堂生字纸',
      sample: '天地人你我他山水田上下左右',
      settings: {
        mode: 'hanzi', grid: 'tianzi', showPinyin: true, cols: 9, repeat: 2,
        trace: true, traceOpacity: 0.25, rowGap: 3, font: 'kaiti',
        header: { title: '生字本', fields: ['姓名', '班级', '日期'] }
      }
    },
    {
      id: 'hardpen-hline', name: '硬笔横线格', tag: '硬笔', icon: 'write',
      desc: '实线横线格，稳定行距与水平，适合楷书连写与长句抄写',
      sample: '横平竖直，撇捺舒展，结构匀称，重心平稳。每日一练，贵在坚持。',
      settings: {
        mode: 'hanzi', grid: 'hengxian', showPinyin: false, cols: 18, repeat: 1,
        trace: false, rowGap: 10, dash: false, lineWidth: 1, font: 'kaiti',
        header: { title: '硬笔书法练习', fields: ['姓名', '日期'] }
      }
    },
    {
      id: 'hengxian-dash', name: '横虚线格', tag: '硬笔', icon: 'write',
      desc: '虚线横线提示基线与行距，版面轻盈，整齐不死板',
      sample: '轻盈的虚线，写完卷面更干净。先慢写找齐线，再加快速度。',
      settings: {
        mode: 'hanzi', grid: 'hengxian', showPinyin: false, cols: 18, repeat: 1,
        trace: false, rowGap: 10, dash: true, lineWidth: 1, font: 'kaiti',
        header: { title: '横虚线书写', fields: ['姓名'] }
      }
    },
    {
      id: 'hardpen-vline', name: '硬笔竖线格', tag: '硬笔', icon: 'write',
      desc: '中竖辅助线，看清列齐与相对位置，是方格到无格的过渡',
      sample: '中竖一线，列齐字正。由格入无，渐成章法。',
      settings: {
        mode: 'hanzi', grid: 'shuxian', showPinyin: false, cols: 12, repeat: 1,
        trace: false, rowGap: 4, dash: false, lineWidth: 1, font: 'kaiti',
        header: { title: '竖线格练习', fields: ['姓名', '日期'] }
      }
    },
    {
      id: 'shuxian-dash', name: '竖虚线格', tag: '硬笔', icon: 'write',
      desc: '竖虚线提示对齐，视觉更轻，写完卷面更清爽',
      sample: '虚线不抢笔画，写稳后可逐步减少对它的依赖。',
      settings: {
        mode: 'hanzi', grid: 'shuxian', showPinyin: false, cols: 12, repeat: 1,
        trace: false, rowGap: 4, dash: true, lineWidth: 1, font: 'kaiti',
        header: { title: '竖虚线练习', fields: ['姓名'] }
      }
    },
    {
      id: 'radical-practice', name: '偏旁部首', tag: '启蒙', icon: 'stroke',
      desc: '预填常用偏旁部件，先把偏旁写稳再组字',
      sample: '氵讠亻扌木忄彳辶纟钅火犭口日',
      settings: {
        mode: 'hanzi', grid: 'tianzi', showPinyin: false, cols: 9, repeat: 2,
        trace: true, traceOpacity: 0.25, rowGap: 3, font: 'kaiti',
        header: { title: '偏旁部首练习', fields: ['姓名', '日期'] }
      }
    },
    {
      id: 'number-cards', name: '数字识字卡', tag: '启蒙', icon: 'num',
      desc: '一二到零米字格临摹，含拼音，适合数字汉字启蒙',
      sample: '一二三四五六七八九十零',
      settings: {
        mode: 'hanzi', grid: 'mizi', showPinyin: true, cols: 9, repeat: 2,
        trace: true, traceOpacity: 0.3, rowGap: 3, font: 'kaiti',
        header: { title: '数字识字卡', fields: ['姓名'] }
      }
    },
    {
      id: 'name-mizi', name: '姓名练字帖', tag: '启蒙', icon: 'hanzi',
      desc: '米字格姓名临摹描红，大字反复书写',
      sample: '李小明',
      settings: {
        mode: 'hanzi', grid: 'mizi', showPinyin: true, cols: 8, repeat: 5,
        trace: true, traceOpacity: 0.18, rowGap: 3, font: 'kaiti',
        header: { title: '姓名练习', fields: ['姓名'] }
      }
    },
    {
      id: 'mingpian-trace', name: '名篇描红', tag: '作品', icon: 'poem',
      desc: '竖线格虚线楷体描红，临写名篇，标题可自填',
      sample: '先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。',
      settings: {
        mode: 'vertical', grid: 'shuxian', showPinyin: false, cols: 0, repeat: 1,
        trace: true, traceOpacity: 0.2, vertical: true, rowGap: 2, font: 'kaiti',
        cellSizeV: 20, dash: true,
        header: { title: '出师表（节选）', fields: [] }
      }
    },
    {
      id: 'diary', name: '日记书写纸', tag: '通用', icon: 'write',
      desc: '横线格 + 日期天气栏，适合每日日记与周记',
      sample: '今天天气晴朗，我和爸爸妈妈去公园放风筝。春风暖暖的，真开心！',
      settings: {
        mode: 'hanzi', grid: 'hengxian', showPinyin: false, cols: 18, repeat: 1,
        trace: false, rowGap: 10, dash: false, lineWidth: 1, font: 'kaiti',
        header: { title: '日记', fields: ['日期', '天气'] }
      }
    },
    {
      id: 'growth-log', name: '成长记录', tag: '通用', icon: 'book',
      desc: '横线格 + 日期/心情/事件栏，手账风成长记录',
      sample: '学会了自己系鞋带，还得到了老师的表扬，心里美滋滋的。',
      settings: {
        mode: 'hanzi', grid: 'hengxian', showPinyin: false, cols: 18, repeat: 1,
        trace: false, rowGap: 10, dash: false, lineWidth: 1, font: 'kaiti',
        header: { title: '成长记录', fields: ['日期', '心情', '事件'] }
      }
    },
    {
      id: 'months-card', name: '月份单词卡', tag: '英语', icon: 'abc',
      desc: '1-12 月英文单词卡，临写记忆，标题可自填',
      sample: 'January February March April May June July August September October November December',
      settings: {
        mode: 'english', grid: 'fang', showPinyin: false, cols: 4, repeat: 1,
        trace: true, traceOpacity: 0.3, rowGap: 4, font: 'english',
        header: { title: 'Months 月份单词卡', fields: ['Name', 'Date'] }
      }
    },
    {
      id: 'creative-writing', name: '创意书写纸', tag: '通用', icon: 'write',
      desc: '大方格自由书写，适合主题创作与手抄报配套',
      sample: '',
      settings: {
        mode: 'composition', grid: 'fang', showPinyin: false, cols: 10, repeat: 1,
        trace: false, rowGap: 2, font: 'kaiti',
        header: { title: '创意书写', fields: ['主题', '姓名'] }
      }
    }
  ];

  /* ---------------- 字体预设 ---------------- */
  /* 本地 Web 字体优先；字族名使用单引号，避免截断 render.js 的 style 属性。 */
  var FONTS = [
    { id: 'kaiti', name: '楷体', family: 'CB WenKai', stack: "'CB WenKai','Kaiti SC','STKaiti','KaiTi',serif" },
    { id: 'xingkai', name: '行书', family: 'CB XingShu', stack: "'CB XingShu','STXingkai','华文行楷',cursive,serif" },
    { id: 'songti', name: '宋体', family: 'CB SongTi', stack: "'CB SongTi','Songti SC','SimSun','宋体',serif" },
    { id: 'heiti', name: '黑体', stack: "'PingFang SC','Hiragino Sans GB','Heiti SC','Microsoft YaHei',sans-serif" },
    { id: 'lishu', name: '书法体', family: 'CB ShuFa', stack: "'CB ShuFa','STLibian','LiSu',serif" },
    { id: 'yuanti', name: '圆体', family: 'CB YuanTi', stack: "'CB YuanTi','Yuanti SC','YouYuan',sans-serif" },
    { id: 'songti-bold', name: '宋体加粗', family: 'CB SongTi', stack: "'CB SongTi','Songti SC','SimSun',serif", weight: 700 },
    { id: 'english', name: '英文手写（仅英文）', family: 'CB Handwriting', stack: "'CB Handwriting','Snell Roundhand','Bradley Hand',cursive" }
  ];

  /* ---------------- 配色预设 ---------------- */
  var PALETTES = [
    { id: 'ink', name: '墨黑', line: '#2b2b2b', guide: '#c9c3b7', text: '#1a1a1a' },
    { id: 'textbook', name: '教材绿', line: '#3f7a52', guide: '#9dc3a8', text: '#2f6b45' },
    { id: 'vermilion', name: '朱砂红', line: '#b1392c', guide: '#e0aaa0', text: '#8f2c22' },
    { id: 'blue', name: '靛蓝', line: '#2b4f7a', guide: '#a8bcd4', text: '#1f3f66' },
    { id: 'gray', name: '石墨灰', line: '#6b6b6b', guide: '#c4c4c4', text: '#4a4a4a' }
  ];

  var PAGE_SIZES = [
    { id: 'A4', name: 'A4', w: 210, h: 297 },
    { id: 'A5', name: 'A5', w: 148, h: 210 },
    { id: 'B5', name: 'B5', w: 176, h: 250 },
    { id: '16K', name: '16 开', w: 185, h: 260 },
    { id: 'Letter', name: 'Letter', w: 215.9, h: 279.4 }
  ];

  global.CBTemplates = {
    TEMPLATES: TEMPLATES,
    FONTS: FONTS,
    PALETTES: PALETTES,
    PAGE_SIZES: PAGE_SIZES,
    get: function (id) {
      for (var i = 0; i < TEMPLATES.length; i++) {
        if (TEMPLATES[i].id === id) return TEMPLATES[i];
      }
      return TEMPLATES[0];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
