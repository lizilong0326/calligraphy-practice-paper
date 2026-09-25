<p align="center"><strong>CALLIGRAPHY PRACTICE PAPER · WEB</strong></p>

# 练字帖 Web 版

<p>
  <a href="https://lizilong0326.github.io/calligraphy-practice-paper/">在线体验 ↗</a>
  &nbsp;·&nbsp;
  <a href="../README.md">项目概览</a>
  &nbsp;·&nbsp;
  <a href="assets/fonts/README.md">字体来源与许可</a>
</p>

一个可直接部署的静态网页：模板、拼音数据、练字字体和排版逻辑都在 `web/` 目录内。选模板、写内容、调样式，预览完成后通过浏览器打印或保存 PDF。

## 快速开始

在 `web/` 目录执行：

```bash
python3 -m http.server 8770
```

打开 [http://127.0.0.1:8770/](http://127.0.0.1:8770/)。如果从项目根目录操作，先运行 `cd web`。本地运行不需要 npm 包、账号或后端 API。

## 页面地图

| 页面 | 文件 | 入口与用途 |
| --- | --- | --- |
| 首页 | `index.html` | 功能概览及各模块入口 |
| 工作台 | `studio.html` | 内容编辑、拼音校对、字帖预览、打印与配置导出 |
| 模板库 | `gallery.html` | 选中模板后进入工作台继续调整 |
| 使用说明 | `guide.html` | 常见制作步骤 |
| 手机外壳预览 | `mobile.html` | 在手机尺寸中体验工作台 |

访问 `studio.html?phone=1` 可以只使用手机布局。桌面版与手机版复用相同的状态和排版逻辑。

## 从模板到打印

1. **选版式**：31 种预设版式覆盖拼音田字格、米字格描红、硬笔横线格、古诗竖排、英文四线三格、基本笔画和控笔训练等场景。
2. **填内容**：输入汉字、词句、古诗、拼音、英文或数字。拼音、英文、数字模板会过滤不适合该版式的字符；需要汉字拼音时，可在「拼音校对」中切换多音字读音。
3. **调参数**：字格、字体、描红、页眉和纸张分组展示；修改后预览随即更新。
4. **导出成品**：点击「打印 / 存 PDF」，在浏览器打印窗口选择与工作台一致的纸张尺寸，并将缩放设为 100%；建议开启「背景图形」。选择「另存为 PDF」即可得到电子版。

> [!TIP]
> 工作台的「导出配置」会下载包含当前内容和参数的 JSON 文件。页面目前没有 JSON 导入入口。

## 可调范围

| 设置组 | 当前选项 |
| --- | --- |
| 字格与排版 | 13 种字格或线格；列数、每字占格数、行距、格距、字身大小等 |
| 笔墨样式 | 字体、配色、格线与辅助线颜色、辅助线虚线、线条粗细 |
| 描红与拼音 | 练习格描红、描红深浅、拼音显示、拼音标注方式 |
| 纸张与页眉 | A4、A5、B5、16 开、Letter；方向、边距、标题与信息栏 |

当前设置保存在浏览器 `localStorage` 中。清理站点数据或更换浏览器后，设置不会自动同步。

## 代码导航

```text
web/
├── index.html · studio.html · gallery.html · guide.html · mobile.html
└── assets/
    ├── css/                   页面、移动布局、字体与打印样式
    ├── data/pinyin-data.js     本地拼音数据
    ├── fonts/                 WOFF2 字体、来源与授权文本
    └── js/
        ├── core/
        │   ├── templates.js   模板、字体、配色和纸张选项
        │   ├── grids.js       字格与控笔图案
        │   ├── pinyin.js      拼音查询与多音字
        │   ├── layout.js      内容解析和分页
        │   ├── render.js      预览与打印内容
        │   └── store.js       设置状态和本地保存
        └── ui/
            ├── controls.js    工作台设置项
            ├── app.js         工作台交互与打印
            ├── catalog-page.js 模板库交互
            └── ...            导航与预览组件
```

`core/` 处理数据和排版，`ui/` 处理网页交互。增加模板时查看 `assets/js/core/templates.js`；调整设置面板时查看 `assets/js/ui/controls.js`。

## 资源与署名

本地字体的项目来源与授权文本列在 [字体说明](assets/fonts/README.md) 中，字体许可与署名应随字体保留。部分扩充版式参考了字典吧的模板目录，来源备注保留在 `assets/js/core/templates.js` 中。
