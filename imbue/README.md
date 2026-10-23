# IMBUE 项目主页

NeurIPS 2026 论文 *Amortized Bayesian Experimental Design with In-Context
Knowledge Conditioning* 的项目主页，发布在 <https://zhanghu-zhao.com/imbue/>。

纯静态页面：`index.html` + `style.css` + `script.js`，没有构建步骤，也不依赖任何框架。页面上的文字以论文源文件
`_source/neurips_2026.tex`（2026-10-23 版）为准。摘要和致谢是原文，其余部分是对论文原文的轻度压缩。

**注意**：`static/pdfs/IMBUE_camera_ready.pdf`（“Paper” 按钮指向它）还是 2026-10-17 的版本，不含 10-23 对
.tex 的修改（第 4 节和结论的措辞、致谢等）。从 Overleaf 导出新 PDF 后，按下文“论文 PDF”替换。

有几处是为网页新写的，内容都以论文的结果和数字为依据，改动时请保持这一点：

- 页头的一句话：“Use priors and past experiments at deployment, without retraining.”（分享卡片上也有）。
- Key findings 的三条结论、代表图的图注。
- 主要图表图注的第一句（加粗）：先说这张图说明什么，后面再列指标、rollout 数和置信区间。

## 页面结构

主线是“问题 → 方法直觉 → 关键证据 → 局限”，细节默认收起：

| 区块 | 内容 | 默认收起的部分 |
| --- | --- | --- |
| 顶栏 | Overview / Method / Results / Citation 链接、主题按钮；滚动时高亮当前区块 | — |
| 页头 | 会议、IMBUE、一句话、论文标题（`h1`）、缩写展开、作者与单位、Paper / Code / Cite | 手机上单位只写学校名 |
| Overview（`#overview`） | 论文的总览图 | — |
| Key findings（`#findings`） | 三条结论，各自链接到证据；旁边是带编号标注的代表图 | — |
| Abstract | 原文 | — |
| Method（`#method`） | 问题、架构图、三张卡片 | Training and loss、Attention masks |
| Results（`#results`） | 4.1–4.6 | Setup（四个基准、指标、术语） |
| Ablations | 4.4、附录 E.1/E.5/E.6 | 分阶段消融表、Binary vs soft gating、敏感性分析 |
| More results | 附录图，按基准分标签页 | 非当前标签页 |
| Limitations、Citation（`#citation`）、Acknowledgments | — | — |

## 目录结构

```
imbue/                          → https://zhanghu-zhao.com/imbue/
├── index.html                  页面：结构、全部文字、SEO 与社交分享 meta 标签
├── style.css                   样式；所有颜色都是 :root 上的 CSS 变量
├── script.js                   明暗主题、顶栏、图片放大、More results 标签页、折叠区、BibTeX 复制
├── README.md                   本文件
├── static/
│   ├── images/                 网页用的 PNG，由论文矢量图转换而来，文件名、子目录与 fig/ 一致
│   │   ├── overview.png  architecture.png  attention_masks.png
│   │   ├── *-mobile.png        四张宽图的手机版（子图竖排），见下文“手机版图片”
│   │   ├── social-card.png     社交分享卡片（1200×630：IMBUE、一句话、IMBUE 部分的示意图）
│   │   └── ces/  gp/  location/  prior/  psy/
│   ├── pdfs/
│   │   └── IMBUE_camera_ready.pdf   “Paper” 按钮指向它
│   └── videos/                 暂无视频（只有 .gitkeep）
├── _tools/
│   ├── pdf2png.js              PDF 图 → PNG 的转换脚本（macOS 自带工具即可运行）
│   ├── pdflayout.js            把 PDF 图的子图裁出来重新排列（手机版图片、卡片示意图）
│   ├── layouts.json            pdflayout.js 的版式：每张图裁哪些区域、怎么排
│   ├── social-card.html        分享卡片的源文件，用 Chrome 截图生成 social-card.png
│   └── card-schematic.png      卡片上的示意图（overview 中间一栏），由 layouts.json 生成
└── _source/                    论文原始材料：neurips_2026.tex / .sty、ref.bib、fig/*.pdf
```

- **`_source/`** 已写进仓库根目录的 `.gitignore`，不会被提交，自然也不会被发布。仓库是公开的，这样
  LaTeX 源码（包括里面注释掉的旧段落）不会随网站一起公开。它只存在于本机，请另行备份（例如 Overleaf）。
- **`_tools/`** 会被提交。但 GitHub Pages 用 Jekyll 构建站点时会跳过下划线开头的目录，所以它不会出现在网站上。
- 页面上有两张图没有用到，所以没有转换：`gp/gp_training_samples.pdf` 和 `prior/prior_reliability_labels.pdf`。

## 本地预览

在仓库根目录（不是 `imbue/`）运行：

```sh
python3 -m http.server 8000
```

然后打开 <http://localhost:8000/imbue/>。在根目录起服务，`../images/favicon/` 下的站点图标才能找到；在 `imbue/`
里起服务时页面照样能用，只是没有图标。不建议直接双击打开 `index.html`（`file://`），以 HTTP 方式预览才和线上一致。

## 部署到 GitHub Pages

这个仓库就是个人主页仓库（自定义域名 `zhanghu-zhao.com`，见根目录 `CNAME`）。把改动提交并推送到 `master`，
GitHub Pages 一般在一两分钟内发布：

```sh
git add .gitignore README.md imbue
git status          # 确认 imbue/_source/ 没有出现在待提交列表里
git commit -m "Add the IMBUE project page"
git push
```

如果以后想把这个页面放到别处（比如代码仓库的 gh-pages 分支），要做三件事：

1. 复制 `index.html`、`style.css`、`script.js` 和 `static/`。
2. 修改 `index.html` 里的绝对地址：`canonical`、`og:url`、`og:image`、`twitter:image`、`citation_pdf_url`，
   以及页脚的 “More publications” 链接。
3. 处理站点图标：`../images/favicon/` 改成新位置，或者直接删掉这几行。

另外请注意：用户主页配置了自定义域名后，同一账号下其他仓库开启的 Pages 也会挂在这个域名下。如果将来给
`DralnMatthew/IMBUE` 代码仓库开启 Pages，它会出现在 `zhanghu-zhao.com/IMBUE/`。为了不和这里的 `/imbue/`
混淆，二者只保留一个。

## 替换素材

### 图

页面上的每张图都是 `static/images/` 下的 PNG，路径与 `_source/fig/` 一一对应（例如
`fig/gp/gp_mixed_relevance.pdf` → `static/images/gp/gp_mixed_relevance.png`）。更新一张图的步骤：

1. 用新的 PDF 覆盖 `_source/fig/` 里的旧文件，文件名不变。
2. 重新生成 PNG（在仓库根目录运行，最后一个参数是输出宽度，单位像素）：

   ```sh
   osascript -l JavaScript imbue/_tools/pdf2png.js \
     imbue/_source/fig/gp/gp_mixed_relevance.pdf imbue/static/images/gp/gp_mixed_relevance.png 2160
   ```

3. 如果图的长宽比变了，把 `index.html` 里对应 `<img>` 的 `width`、`height` 改成新 PNG 的像素尺寸，避免加载时页面跳动。
   查看尺寸：`sips -g pixelWidth -g pixelHeight <png>`。
4. 如果这张图有手机版或在分享卡片上（overview、architecture、ces_naive_concatenation_k5、gp_mixed_relevance），
   还要重新生成它们（见下文“手机版图片”“分享卡片”）；子图位置变了的话，`layouts.json` 的裁剪比例要重新量。

整批换图时（例如整个 `fig/` 文件夹被替换），文件大小和修改时间都说明不了哪张真的变了：先把每张图按下面的宽度渲染到
临时目录，再和 `static/images/` 里的 PNG 逐像素比较，只替换内容变了的那些。2026-10-23 换图时，变了的是 overview、
architecture（都只是虚线框的样式）、ces_posterior（去掉子图标题，高度 701 → 709）、gp_benchmark_functions、
gp_previous_instance_samples（核的名字改成 Matérn 5/2、RBF）、prior_samples、psy_rmse_baselines（图例收紧，高度
1118 → 1126），以及改名的 psy_rmse_by_k（原 psy_main_aux_ablation，只改了横轴标题）。

一次重新生成全部图片（宽度与现在页面上的一致）：

```sh
cd imbue
while read -r rel w; do
  osascript -l JavaScript _tools/pdf2png.js "_source/fig/$rel.pdf" "static/images/$rel.png" "$w"
done <<'LIST'
overview 2160
architecture 2160
attention_masks 2160
ces/ces_naive_concatenation_k5 1400
ces/ces_naive_concatenation_by_k 2160
ces/ces_k_sweep 1800
ces/ces_posterior 2160
ces/ces_filter_ablation 2160
ces/ces_binary_vs_soft_gating 2160
location/location_spce_baselines 1200
location/location_filter_alpha 1400
location/location_spce_prior_types 1200
location/location_design_trajectory 1200
location/location_filter_ablation 2160
location/location_sensitivity_pgood_lambda 1800
gp/gp_mixed_relevance 2160
gp/gp_mixed_relevance_per_step 2160
gp/gp_design_trajectory 2160
gp/gp_baselines_extended 2160
gp/gp_benchmark_functions 2160
gp/gp_previous_instance_samples 1400
prior/prior_samples 1400
psy/psy_rmse_baselines 1200
psy/psy_rmse_by_k 2160
LIST
osascript -l JavaScript _tools/pdflayout.js _tools/layouts.json   # 手机版图片和卡片示意图
```

分享卡片要单独生成，见下文“分享卡片”。

宽度的取法：通栏图 2160 px（栏宽 1080 px 的 2 倍，高分屏依然清晰），方形小图 1200–1400 px（点开放大时也够清晰）。

不在 macOS 上时，用任何工具导出同名、同宽度的 PNG 即可，比如 `pdftoppm -png -r 300`，或者在 matplotlib 里直接
`savefig(..., dpi=...)`。

### 手机版图片

四张宽图在手机上（视口 ≤ 600 px）换成子图竖排的版本，否则缩到手机宽度后字只有 4–6 px：

| 原图 | 手机版 | 排法 |
| --- | --- | --- |
| `overview.png` | `overview-mobile.png` | 三栏上下排，右栏两张小图并排、图例在下 |
| `architecture.png` | `architecture-mobile.png` | 网络结构在上，Reliability Filtering 框在下 |
| `ces/ces_naive_concatenation_k5.png` | `…-mobile.png` | 图例在上，Relevant / Irrelevant 两张上下排 |
| `gp/gp_mixed_relevance.png` | `…-mobile.png` | 图例在上，四个基准逐张上下排 |

页面里用 `<picture>` 切换：`<source media="(max-width: 600px)" srcset="…-mobile.png" width="…" height="…">`，
`<img>` 仍指向原图（桌面、不支持 `<picture>` 的浏览器、点开放大时的链接都用它）。宽高要和 PNG 一致，
用 `sips` 查看。

这些 PNG 由 `_tools/pdflayout.js` 直接从矢量 PDF 渲染，画布 1080 px 宽（手机内容区约 340 px，3 倍屏约
1020 px），规则写在 `_tools/layouts.json`：每个区域是
`[x0, y0, x1, y1]`，单位是整页宽高的比例，从左上角量起。**原图的版式一旦改变（子图位置、图例位置），对应
的比例就要重新量**，否则会裁到相邻子图。GP 图相邻子图之间只有约 1.4 个像素（2160 px 宽时）的空隙，切线
正好放在中间，`erase` 把左侧子图伸过来的横轴末端涂白。12 个子图的消融图等其余多子图只在手机上提示
“Tap to enlarge”，点开后按两倍尺寸平移查看。

### 分享卡片

`static/images/social-card.png` 由 `_tools/social-card.html` 截图生成，卡片上的一句话、标题和作者都写在这个
HTML 里，示意图是同目录的 `card-schematic.png`。改完后在仓库根目录运行（需要联网加载 Inter 字体）：

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=10000 \
  --screenshot="$PWD/imbue/static/images/social-card.png" "file://$PWD/imbue/_tools/social-card.html"
```

社交平台会缓存卡片，换图后可以用各平台的调试工具（如 LinkedIn Post Inspector）刷新。

### 论文 PDF

用新文件覆盖 `static/pdfs/IMBUE_camera_ready.pdf`，文件名保持不变。如果改了文件名，要同步改 `index.html` 里的两处：
“Paper” 按钮的 `href`，以及 `citation_pdf_url`。`.tex` 改过之后，PDF 也要跟着换，否则页面和 PDF 的措辞对不上。

`_source/` 里不能直接编译出 PDF：`.tex` 末尾 `\input{checklist.tex}` 的文件不在这里。请在 Overleaf 编译。

### 视频（目前没有）

1. 把 mp4（H.264 编码，尽量控制在几 MB 以内）放进 `static/videos/`，再导出一帧作为封面图，放进 `static/images/`。
2. 在 `index.html` 的 Abstract 后面，取消注释现成的 Video 区块，填上文件名。它已按要求设置了
   `muted autoplay loop playsinline preload="metadata"`。
3. 在按钮栏加上 Video 按钮（模板在按钮栏下方的注释里）。

### 链接按钮

- **Code**：仓库公开后，在 Code 按钮的 `<a>` 上加 `href="https://github.com/DralnMatthew/IMBUE"`，按钮上的
  “soon” 标记会自动消失。这和 Publications 页的约定一样：没有 `href` 的按钮显示为虚线占位、不可点击。
- **arXiv / Poster / Data / Demo**：按钮栏下方的注释里有现成的 `<li>`，复制到按钮列表并填上链接。没有的就不要加。

### 作者

- 作者主页链接在 `.authors` 列表里。
- 论文没有标注共同一作或通讯作者。需要的话，在对应作者的 `<sup>` 后加 `*` 或 `†`，再取消注释下方的
  `author-note` 一行。

### 文字

页面文字以 `_source/neurips_2026.tex` 为准，最近一次按 2026-10-23 的版本更新（第 4 节、结论与局限、致谢、方法里的
损失函数，以及附录里的几处图注和说明）。`.tex` 再改时，可以把新旧两版的句子逐条对照，找出改动过的句子再改页面。

图都来自 `_source/fig/`，与 `.tex` 引用的文件一一对应；附录的心理测量图是 `psy/psy_rmse_by_k`（More results →
Psychometric）。

## 修改配色与字体

所有颜色都在 `style.css` 开头：`:root` 是亮色主题，`:root[data-theme="dark"]` 是暗色主题，两边用同一套变量名。

| 变量 | 用途 | 亮色 / 暗色 |
| --- | --- | --- |
| `--accent` | 链接、强调、表格中本文方法的标记；取自论文图里代表 IMBUE 的蓝色 | `#0173b2` / `#56b4e9` |
| `--ink`、`--ink-strong`、`--muted` | 正文、标题、图注 | 见文件 |
| `--bg`、`--bg-tint`、`--surface` | 页面底色、交替色带、卡片和表格 | 见文件 |
| `--btn-bg`、`--btn-ink` | 链接按钮、选中的标签 | 深底白字 / 浅底深字 |
| `--accent-soft` | 表格里 IMBUE 一行的底色 | 半透明的 `--accent` |
| `--swatch-prior`、`--swatch-instance` | Method 卡片标题前的色块，对应 overview 图里的配色 | 橙 / 紫 |
| `--topbar-bg` | 顶栏的半透明底色（下面的内容模糊透出） | 白 / 深灰，86% 不透明 |
| `--mark-bg`、`--mark-ink` | 代表图上的编号标注；图在两种主题下都是白底，所以不随主题变 | 深底白字 |

改色时注意对比度：正文和图注的颜色相对各自背景至少 4.5:1，现有取值的对比度写在注释里。图都放在白色卡片上
（`--figure-bg`），因为论文的图是白底的，暗色主题下也保持白底。

字体：

- `--font-sans`：Inter（Google Fonts），回退到系统 UI 字体。不想用 Google Fonts 时，删掉 `index.html` 里加载
  字体的三个 `<link>` 即可，页面会直接用系统字体。
- `--font-math`：数学符号（K、θ、∈、ℝ…），依次使用 STIX Two（macOS 自带）、Cambria Math（Windows 自带），最后回退到 Times。
- `--font-mono`：BibTeX 区块，使用系统等宽字体。

版面宽度：`--wide`（图、表，1080 px）和 `--prose`（正文，760 px）。

## 交互与无障碍

- **顶栏**：吸附在窗口顶部，链接到 Overview / Method / Results / Citation，滚动时用 `aria-current` 标出当前
  区块；滚过页头后左侧出现 “IMBUE”，点它回到顶部。锚点跳转会留出顶栏的高度（`scroll-padding-top`）。
- **主题**：规则与站点其他页面相同，白天亮色、赫尔辛基日落后暗色。顶栏右侧的按钮在“自动 → 亮 → 暗”之间
  循环（手机上只显示图标），选择存在同一个 `localStorage` 键（`theme-mode`）里，整个站点共享。
- **图片放大**：点击任意一张图，会在原生 `<dialog>` 中打开大图和图注。Esc、关闭按钮或点击遮罩都能关闭，关闭后焦点
  回到原图。打开的是屏幕上正显示的那一版（手机上是竖排的手机版），手机上按 2 倍尺寸打开，可以左右拖动查看。
  触屏设备上每张图的右上角都有 “Tap to enlarge” 提示。按住 ⌘/Ctrl 点击仍会在新标签页打开 PNG。
- **编号标注**：Key findings 的代表图上叠了 1、2 两个标注（`.mark`，位置用 `--x`、`--y` 按图片宽高的比例
  指定），对应左侧的结论编号；放大视图里没有标注，图注里指向标注的 “(mark 1)” 也随之隐藏（对读屏软件始终
  隐藏，标注本身也是 `aria-hidden`）。
- **折叠区**：`<details>`。链接（或分享的网址）指向折叠区里的内容时自动展开，打印时全部展开、打印后恢复。
- **More results 标签页**：支持方向键和 Home/End。地址里的片段（如 `#more-gp`、`#more-shifts`）会直接打开
  对应标签，便于分享链接。
- **BibTeX 复制**：先用 Clipboard API，失败时退回 `execCommand('copy')`，再失败就选中全文、提示手动复制。结果会通过
  `aria-live` 播报。
- **没有 JavaScript 时**：页面用亮色主题；顶栏链接照常可用，只是不标当前区块；折叠区照常可以点开；六个结果
  面板依次全部显示；点图直接打开 PNG；复制按钮和主题按钮隐藏。
- 其他：有“跳到正文”链接，焦点样式可见，所有控件都是原生的 `<a>` 或 `<button>`。图片都有描述内容的 alt 文本，
  表格有表头关联；宽表格在自己的框内横向滚动，不会撑宽页面，窄屏上第一列（方法名）固定不动。

## 缓存

改了 `style.css` 或 `script.js` 之后，把 `index.html` 里对应的 `?v=` 数字加 1，让老访客拿到新文件（与站点其他页面的做法一致）。

## SEO 与社交分享

`index.html` 的 `<head>` 里有：

- `title`、`description`、`canonical`；
- Open Graph 和 X/Twitter 卡片（`summary_large_image`，图片为 `social-card.png`，生成方法见上文“分享卡片”）；
- Google Scholar 的 `citation_*` 标签（标题、作者、会议、年份、PDF 地址）。

社交平台只认绝对地址，所以这些标签都写成 `https://zhanghu-zhao.com/imbue/...`。

## 待补充

`index.html` 里不确定的地方都用 `TODO` 注释标出了，列出它们：

```sh
grep -n "TODO" imbue/index.html
```
