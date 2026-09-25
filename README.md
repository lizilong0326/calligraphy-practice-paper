<p align="center">
  <img src="docs/readme-cover.svg" alt="Calligraphy Practice Paper · 练字帖" width="100%">
</p>

<h1 align="center">Calligraphy Practice Paper</h1>

<p align="center">
  <strong>练字帖</strong> · 在浏览器里制作、预览和打印专属练习纸
</p>

<p align="center">
  <a href="https://lizilong0326.github.io/calligraphy-practice-paper/"><strong>打开在线 Demo ↗</strong></a>
  &nbsp;·&nbsp;
  <a href="web/README.md">使用与开发文档</a>
  &nbsp;·&nbsp;
  <a href="web/assets/fonts/README.md">字体授权</a>
</p>

---

无需注册，也无需安装应用。选好版式，输入汉字、拼音、英文、数字或古诗；调整字格、字体、描红和纸张后，即可实时预览，并通过浏览器打印或保存为 PDF。

| 31 种预设版式 | 13 种字格与线格 | 5 种纸张规格 |
| :---: | :---: | :---: |
| 从启蒙描红到古诗竖排 | 格线、辅助线与留白可调 | A4 / A5 / B5 / 16 开 / Letter |

## 体验入口

| 页面 | 在线访问 | 可以做什么 |
| --- | --- | --- |
| 首页 | [进入首页 ↗](https://lizilong0326.github.io/calligraphy-practice-paper/) | 了解功能与制作流程 |
| 工作台 | [开始制作 ↗](https://lizilong0326.github.io/calligraphy-practice-paper/studio.html) | 输入、排版、拼音校对、打印 |
| 模板库 | [浏览模板 ↗](https://lizilong0326.github.io/calligraphy-practice-paper/gallery.html) | 选择预设版式并继续编辑 |
| 使用说明 | [查看指南 ↗](https://lizilong0326.github.io/calligraphy-practice-paper/guide.html) | 快速了解常用操作 |
| 手机预览 | [打开手机预览 ↗](https://lizilong0326.github.io/calligraphy-practice-paper/mobile.html) | 在手机尺寸的界面中操作 |

## 主要功能

| 制作 | 排版与输出 |
| --- | --- |
| 汉字、拼音、英文、数字、古诗等练习内容 | 实时分页预览，支持横排与古诗竖排 |
| 多音字读音校对、带声调或无声调标注 | 字格、行距、边距、字体及笔墨颜色可调 |
| 示范格、描红深浅与留白练习格 | 浏览器打印或另存为 PDF |
| 当前浏览器自动保存设置 | 下载包含内容与参数的 JSON 配置 |

> [!NOTE]
> 设置保存在当前浏览器中，不会自动同步到其他设备。JSON 配置目前可以导出，页面没有导入入口。

## 在本地运行

需要 Python 3。在项目根目录执行：

```bash
cd web
python3 -m http.server 8770
```

然后打开 [http://127.0.0.1:8770/](http://127.0.0.1:8770/)。按 `Ctrl+C` 停止服务。项目使用原生 HTML、CSS 和 JavaScript，无需安装 npm 包或运行构建命令。

## 项目结构

```text
.
├── README.md                项目概览
├── docs/                    README 展示素材
├── .github/workflows/       GitHub Pages 自动发布
└── web/
    ├── *.html               首页、工作台、模板库、指南、手机预览
    ├── README.md            详细使用与开发说明
    └── assets/
        ├── css/             页面、字体和打印样式
        ├── data/            本地拼音数据
        ├── fonts/           本地字体与授权文件
        └── js/
            ├── core/        模板、字格、拼音、排版、渲染、状态
            └── ui/          页面交互与预览控件
```

网站从 `web/` 目录发布到 GitHub Pages；推送到 `main` 后，部署工作流会更新在线 Demo。实现细节、使用方法和资源来源见 [Web 版文档](web/README.md)。
