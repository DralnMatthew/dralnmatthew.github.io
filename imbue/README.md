# IMBUE 项目主页

NeurIPS 2026 论文 *Amortized Bayesian Experimental Design with In-Context
Knowledge Conditioning* 的项目主页，发布在 <https://zhanghu-zhao.com/imbue/>。

纯静态页面：`index.html` + `style.css` + `script.js`，没有构建步骤，也不依赖任何框架。页面上的文字以论文源文件
`_source/neurips_2026.tex`（2026-10-23 版）为准。摘要和致谢保留原文，其余部分按项目主页的阅读顺序压缩改写。

**论文 PDF**：“Paper” 按钮和正文里的 paper 链接都指向 arXiv 版 <https://arxiv.org/pdf/2611.11512>（2026-11-08 的
v1，已包含 10-23 对 .tex 的修改）。仓库里的 `static/pdfs/IMBUE_camera_ready.pdf` 已在 2026-11-10 换成同样包含
10-23 修改的 38 页版本，作为本站留存的副本；页面上没有链接指向它。

有几处是为网页新写的，内容都以论文的结果和数字为依据，改动时请保持这一点：

- 页头的一句话（TL;DR）：“Use priors and past experiments at deployment without retraining, while staying
  robust to unreliable inputs.” meta description、og/twitter 描述与它一致。分享卡片上仍是较短的前半句
  “Use priors and past experiments at deployment, without retraining.”，卡片版面放不下整句。
- Overview 里的三条 Highlights：由 tex 引言的三条 contributions 压缩而来，每条链接到对应的结果。
- 问题介绍，以及四个应用结果的简短解读。
- Method 的四个小节（Problem setup、In-context token interface、Reliability filter、Training）：仿照 ALINE 项目页
  的写法，按 tex 第 3 节的顺序用文字讲清每一步，再给出对应公式。内容和公式都取自 tex 第 3 节与附录
  （训练算法、prior 生成、per-instance encoder、架构细节），没有新增结论；改论文时要一并核对。
- 主要图表图注的第一句（加粗）：先说这张图说明什么，后面再列指标、rollout 数和置信区间。

## 页面结构

叙事参考 [ALINE 项目主页](https://www.huangdaolang.com/aline/)，主线是“问题 → 方法 → 四个应用结果 → 局限与引用”。
正文保留 IMBUE 自己的图表、配色和统一对齐规则；不按论文的小节顺序逐段搬运结果。

| 区块 | 内容 | 默认收起的部分 |
| --- | --- | --- |
| 顶栏 | Overview / Method / Results / Citation 链接、主题按钮；滚动时高亮当前区块 | — |
| 页头 | 蓝色背景、完整论文标题（`h1`）、TL;DR、作者与单位、Paper / Code / Poster / Cite | 手机上单位只写学校名 |
| Overview（`#overview`） | 总览图（紧接页头，作 teaser）、部署时利用已有知识的问题、三条 Highlights | 论文摘要原文 |
| Method（`#method`） | 与 ALINE 的关系、架构图，以及四个小节：Problem setup（`#problem-setup`）、In-context token interface（`#token-interface`）、Reliability filter（`#filter`）、Training（`#training`），公式用 KaTeX 渲染 | 注意力掩码图 |
| Results（`#results`） | Location Finding、CES、GP active learning、Psychometric，提供四个跳转入口 | Setup（四个基准、指标、术语） |
| 消融结论（`#ablations`） | Results 末尾的一段归因说明，区分接口/训练与过滤器的贡献 | — |
| Scope and limitations | 一段范围与局限说明 | — |
| Citation（`#citation`）、Acknowledgments | BibTeX、致谢原文 | — |

独立的 Ablations 长章节、分阶段表、过滤器曲线、soft gating 与敏感性分析，以及 More results 附录图表库已从
页面移除，完整细节引导读者查看论文。原始 PNG 和论文材料仍保留，便于以后复用。

## 目录结构

```
imbue/                          → https://zhanghu-zhao.com/imbue/
├── index.html                  页面：结构、全部文字、SEO 与社交分享 meta 标签
├── style.css                   样式；所有颜色都是 :root 上的 CSS 变量
├── script.js                   明暗主题、公式渲染（KaTeX）、顶栏、图片放大、折叠区、BibTeX 复制
├── README.md                   本文件
├── static/
│   ├── images/                 网页用的 PNG，由论文矢量图转换而来，文件名、子目录与 fig/ 一致
│   │   ├── overview.png  architecture.png  attention_masks.png
│   │   ├── *.webp              页面上显示的图另有一份无损 WebP（同名），浏览器优先加载，见下文“WebP”
│   │   ├── *-mobile.png        宽图的手机版（子图竖排），见下文“手机版图片”
│   │   ├── social-card.png     社交分享卡片（1200×630：IMBUE、一句话、IMBUE 部分的示意图）
│   │   └── ces/  gp/  location/  prior/  psy/
│   ├── pdfs/
│   │   └── IMBUE_camera_ready.pdf   论文的本地副本（2026-11-10 更新）；页面上的论文链接都指向 arXiv
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
- 原始图中的 `gp/gp_training_samples.pdf` 和 `prior/prior_reliability_labels.pdf` 尚未转换；已生成的 PNG 中也有
  部分不再用于精简后的页面，保留作后续复用。

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
2. 修改 `index.html` 里的绝对地址：`canonical`、`og:url`、`og:image`、`twitter:image`，以及页脚的
   “More publications” 链接（论文 PDF 指向 arXiv，不用改）。
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
5. 页面上显示的图（及其手机版）还要重新生成同名的 WebP，见下文“WebP”。

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

分享卡片要单独生成，见下文“分享卡片”；WebP 见下文“WebP”。

宽度的取法：通栏图 2160 px（栏宽 960 px 的 2 倍多，高分屏依然清晰），方形小图 1200–1400 px（页面上显示 600 px
宽，正好 2 倍；点开放大时也够清晰）。

不在 macOS 上时，用任何工具导出同名、同宽度的 PNG 即可，比如 `pdftoppm -png -r 300`，或者在 matplotlib 里直接
`savefig(..., dpi=...)`。

### 手机版图片

当前页面的三张宽图在手机上（视口 ≤ 600 px）换成子图竖排的版本，否则缩到手机宽度后文字过小：

| 原图 | 手机版 | 排法 |
| --- | --- | --- |
| `overview.png` | `overview-mobile.png` | 三栏上下排，右栏两张小图并排、图例在下 |
| `architecture.png` | `architecture-mobile.png` | 网络结构在上，Reliability Filtering 框在下 |
| `gp/gp_mixed_relevance.png` | `…-mobile.png` | 图例在上，四个基准逐张上下排 |

此前生成的 `ces/ces_naive_concatenation_k5-mobile.png` 仍保留在资源目录中，但精简后的页面已不再引用。

页面里用 `<picture>` 切换，`<source>` 依次是：手机版 WebP、手机版 PNG（都带 `media="(max-width: 600px)"`
和手机版的 `width`、`height`），然后是桌面版 WebP；`<img>` 仍指向原图 PNG（不支持 `<picture>` 的浏览器、
没有 JavaScript 时点开放大的链接都用它）。宽高要和 PNG 一致，用 `sips` 查看。

这些 PNG 由 `_tools/pdflayout.js` 直接从矢量 PDF 渲染，画布 1080 px 宽（手机内容区约 340 px，3 倍屏约
1020 px），规则写在 `_tools/layouts.json`：每个区域是
`[x0, y0, x1, y1]`，单位是整页宽高的比例，从左上角量起。**原图的版式一旦改变（子图位置、图例位置），对应
的比例就要重新量**，否则会裁到相邻子图。GP 图相邻子图之间只有约 1.4 个像素（2160 px 宽时）的空隙，切线
正好放在中间，`erase` 把左侧子图伸过来的横轴末端涂白。手机上也可以通过 “Tap to enlarge” 打开当前显示的
图片，按两倍尺寸平移查看。

### WebP

页面上显示的 9 张图（overview、architecture、attention_masks、location_spce_baselines、gp_mixed_relevance、
psy_rmse_baselines，以及 overview、architecture、gp_mixed_relevance 的手机版）各有一份同名的无损 WebP，体积是
PNG 的 31–42%：桌面端从约 0.97 MB 降到 0.37 MB，手机端从约 1.29 MB 降到 0.44 MB（不含折叠起来的
attention_masks）。9 张都在 Chrome 里逐像素比对过（2026-10-25、10-26），与 PNG 完全相同（PNG 带的是 sRGB
配置文件，即浏览器默认色彩空间，WebP 不带也不影响颜色）。

`<picture>` 里 WebP 的 `<source type="image/webp">` 排在 PNG 前面，浏览器优先用它；`<img>` 和放大链接仍指向
PNG 兜底。分享卡片继续用 PNG，社交平台对 WebP 的支持不一。

换图后重新生成（需要 Homebrew 的 webp 包：`brew install webp`）：

```sh
cd imbue/static/images
for f in overview overview-mobile architecture architecture-mobile attention_masks \
         location/location_spce_baselines gp/gp_mixed_relevance gp/gp_mixed_relevance-mobile \
         psy/psy_rmse_baselines; do
  cwebp -quiet -lossless -z 9 "$f.png" -o "$f.webp"
done
```

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

页面上所有指向论文的链接都用 arXiv 的 PDF 地址 `https://arxiv.org/pdf/2611.11512`，共五处：“Paper” 按钮、Method 末尾的
“paper”、Results 末尾的 “Read the full ablations in the paper” 和 “paper and its appendix”，以及 `<head>` 里给 Google
Scholar 的 `citation_pdf_url`。地址不带版本号，arXiv 上传新版本后会自动指向最新版，页面不用改。

`.tex` 改过之后，要在 arXiv 上传新版本，否则页面和 PDF 的措辞对不上。`_source/` 里不能直接编译出 PDF：`.tex` 末尾
`\input{checklist.tex}` 的文件不在这里。请在 Overleaf 编译。

### 视频（目前没有）

1. 把 mp4（H.264 编码，尽量控制在几 MB 以内）放进 `static/videos/`，再导出一帧作为封面图，放进 `static/images/`。
2. 在 `index.html` 的 Overview 后添加带 `id="video"` 的区块，使用 `.container` 外框和 `.video` 视频元素，
   设置 `controls playsinline preload="metadata"` 并填写封面图。若是静音循环演示，可按需使用 `muted autoplay loop`。
3. 在按钮栏加上 Video 按钮（模板在按钮栏下方的注释里）。

### 链接按钮

按钮顺序：Paper、Code、Poster、Cite，2026-11-10 起全部是可点击的链接。按作者的决定，论文只放一个 Paper 按钮
（指向 arXiv 的 PDF），不单独放 arXiv 摘要页和 OpenReview 链接。

| 按钮 | 指向 |
| --- | --- |
| Paper | <https://arxiv.org/pdf/2611.11512>（arXiv v1，2026-11-08；见上文“论文 PDF”） |
| Code | <https://github.com/DralnMatthew/IMBUE> |
| Poster | 论文在 NeurIPS 2026 官网的海报页 <https://neurips.cc/virtual/2026/loc/paris/poster/152127>（Paris 会场，有场次时间和摘要）。有海报 PDF 后可以放进 `static/pdfs/` 并改指向 PDF |
| Cite | 本页的 BibTeX（`#citation`） |

- 没有 `href` 的按钮会显示为虚线 “soon” 占位、不可点击，和 Publications 页的约定一样；加上 `href` 就变成正常按钮。
- **Video / Data / Demo**：按钮栏下方的注释里有现成的 `<li>`，复制到按钮列表并填上链接。没有的就不要加。

### 作者

- 作者主页链接在 `.authors` 列表里。Samuel Kaski 原来链接的 Aalto 个人页（`https://www.aalto.fi/en/people/samuel-kaski`）
  2026-10-25 起会跳转到 Aalto 的登录页，外部访客打不开，现改为他领导的 PML 课题组主页
  `https://research.cs.aalto.fi/pml/`。站点首页也用了旧链接，需要另改。
- 论文没有标注共同一作或通讯作者。需要的话，在对应作者的 `<sup>` 后加 `*` 或 `†`，再取消注释下方的
  `author-note` 一行。

### 文字

页面文字以 `_source/neurips_2026.tex` 为准，最近一次按 2026-10-23 的版本更新（第 4 节、结论与局限、致谢、方法里的
损失函数，以及附录里的几处图注和说明）。`.tex` 再改时，可以把新旧两版的句子逐条对照，找出改动过的句子再改页面。

图都来自 `_source/fig/`，与 `.tex` 引用的文件一一对应。页面只展示总览、架构和四个主要实验的代表性证据；
更新论文时，应同时核对这些图的结论、指标、置信区间，以及文末对消融贡献的归因。

### 公式

页面上的公式直接写 LaTeX，由 KaTeX（`index.html` 的 `<head>` 里从 jsDelivr 加载，版本 0.16.47）在浏览器里排版，
不需要构建步骤：

- 行内公式写成 `\(\theta_l\)`，行间公式写成 `\[ … \]`，并放进 `<div class="eq">…</div>`。不用 `$…$`，以免和正文里的
  美元符号混淆。多行对齐用 `\begin{aligned} … \end{aligned}`。
- 上下标里的 `\text{…}` 要加花括号，如 `\mathbf{e}_l^{\text{prior}}`，否则 KaTeX 会报错。需要小于号时写 `\lt`
  （直接写 `<` 会被浏览器当成 HTML 标签的开头）；`aligned` 里的对齐符 `&` 照常写即可。
- 写错的公式会以红字显示，不会让整页失效。改完后在浏览器里看一遍 Method 部分。
- 升级 KaTeX 时，三个文件（`katex.min.css`、`katex.min.js`、`contrib/auto-render.min.js`）的版本号和 `integrity`
  要一起改。新的 `integrity` 可以这样算（把 `$f` 换成对应文件路径）：

  ```sh
  curl -s "https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/$f" | openssl dgst -sha384 -binary | openssl base64 -A
  ```

## 修改配色与字体

所有颜色都在 `style.css` 开头：`:root` 是亮色主题，`:root[data-theme="dark"]` 是暗色主题，两边用同一套变量名。

| 变量 | 用途 | 亮色 / 暗色 |
| --- | --- | --- |
| `--accent` | 链接、强调、表格中本文方法的标记；取自论文图里代表 IMBUE 的蓝色 | `#0173b2` / `#56b4e9` |
| `--ink`、`--ink-strong`、`--muted` | 正文、标题、图注 | 见文件 |
| `--bg`、`--bg-tint`、`--surface` | 页面底色、交替色带、卡片和表格 | 见文件 |
| `--btn-bg`、`--btn-ink` | 链接按钮 | 深底白字 / 浅底深字 |
| `--accent-soft` | 表格里 IMBUE 一行的底色 | 半透明的 `--accent` |
| `--swatch-prior`、`--swatch-instance` | Method 里 “Prior tokens”“Instance tokens” 小标题前的色块，对应 overview 图里的配色 | 橙 / 紫 |
| `--topbar-bg` | 顶栏的半透明底色（下面的内容模糊透出） | 白 / 深灰，86% 不透明 |
| `--hero-*` | 页首的背景、标题、作者和按钮颜色 | 蓝色背景，浅色文字 |

改色时注意对比度：正文和图注的颜色相对各自背景至少 4.5:1，现有取值的对比度写在注释里。图都放在白色卡片上
（`--figure-bg`），因为论文的图是白底的，暗色主题下也保持白底。

字体：

- `--font-sans`：Inter（Google Fonts），回退到系统 UI 字体。不想用 Google Fonts 时，删掉 `index.html` 里加载
  字体的三个 `<link>` 即可，页面会直接用系统字体。
- 数学公式：由 KaTeX 用它自带的字体排版（与 LaTeX 的 Computer Modern 一致），见下文“公式”。
- `--font-mono`：BibTeX 区块，使用系统等宽字体。

版面参照 ALINE 项目主页：页头以下只有一条居中的 960 px 栏（`--measure`），所有内容的左右边线一致。

- `.container` 负责栏宽居中和页面边距。章节标题、正文、图、表、折叠框都填满这条栏，正文不再单独限宽；
  正文 18 px，一行约 100 个字符。
- 图注、表注与所属图表同宽。
- Method 的四个小节用 `h3.subsection`，小节内再用 `h4` 分段；行间公式放在 `<div class="eq">` 里居中，过宽时只在
  自己的框内横向滚动（390 px 宽的手机上目前全部放得下）。
- 四个实验结果统一为“标签、小标题、文字在上，图或表在下”。两张接近正方形的图（location_spce_baselines、
  psy_rmse_baselines）通栏显示会有一屏高，所以加了 `.figure--narrow`：在栏内居中，宽 600 px（`--narrow`），
  图注随之同宽。
- 总览图紧接在页头下面作为 teaser。页头上下留白较小，标题最大 42 px，桌面端排两行；1440×900 的首屏能看到
  总览图的上半部分。
- Setup 表格填满折叠框内部可用宽度，保留组件内边距；BibTeX 使用完整栏宽。表格与代码在窄屏上只在各自容器内
  横向滚动。
- 页面边距通常为 24 px，视口不超过 600 px 时为 16 px。页首的标题、作者与按钮保持居中。

## 交互与无障碍

- **顶栏**：吸附在窗口顶部，链接到 Overview / Method / Results / Citation，滚动时用 `aria-current` 标出当前
  区块；滚过页头后左侧出现 “IMBUE”，点它回到顶部。锚点跳转会留出顶栏的高度（`scroll-padding-top`）。
- **主题**：默认跟随访客的系统设置（`prefers-color-scheme`），系统切换明暗时页面随之切换。顶栏右侧的按钮在
  “自动 → 亮 → 暗”之间循环（手机上只显示图标）。手动选择存在 `localStorage` 键 `theme-mode` 里，和站点其他页面
  共用，所以选过亮或暗之后整个站点一致；“自动”在本页指跟随系统，在站点其他页面仍是按赫尔辛基日出日落切换。
- **图片放大**：点击任意一张图，会在原生 `<dialog>` 中打开大图和图注。Esc、关闭按钮或点击遮罩都能关闭，关闭后焦点
  回到原图。打开的是屏幕上正显示的那一版（手机上是竖排的手机版），手机上按 2 倍尺寸打开，可以左右拖动查看。
  触屏设备上每张图的右上角都有 “Tap to enlarge” 提示。按住 ⌘/Ctrl 点击仍会在新标签页打开 PNG。
- **折叠区**：`<details>`。链接（或分享的网址）指向折叠区里的内容时自动展开，打印时全部展开、打印后恢复。
- **结果导航**：Results 开头的四个链接直接跳到对应实验，小节标题沿用原有锚点。
- **BibTeX 复制**：先用 Clipboard API，失败时退回 `execCommand('copy')`，再失败就选中全文、提示手动复制。结果会通过
  `aria-live` 播报。
- **公式**：KaTeX 在页面加载后渲染（先于锚点跳转，避免跳转后位置偏移）。渲染出的公式可被屏幕阅读器读出
  （KaTeX 同时输出 MathML）。
- **没有 JavaScript 时**：页面用亮色主题；顶栏和结果导航链接照常可用，只是不标当前区块；折叠区照常可以点开；
  点图直接打开 PNG；复制按钮和主题按钮隐藏；公式显示为 LaTeX 源码（KaTeX 的 CDN 打不开时也是这样）。
- 其他：有“跳到正文”链接，焦点样式可见，所有控件都是原生的 `<a>` 或 `<button>`。图片都有描述内容的 alt 文本，
  表格有表头关联；宽表格在自己的框内横向滚动，不会撑宽页面，窄屏上第一列（方法名）固定不动。

## 缓存

改了 `style.css` 或 `script.js` 之后，把 `index.html` 里对应的 `?v=` 数字加 1，让老访客拿到新文件（与站点其他页面的做法一致）。

## SEO 与社交分享

`index.html` 的 `<head>` 里有：

- `title`、`description`、`canonical`；
- Open Graph 和 X/Twitter 卡片（`summary_large_image`，图片为 `social-card.png`，生成方法见上文“分享卡片”）；
- Google Scholar 的 `citation_*` 标签（标题、作者、会议、年份，以及指向 arXiv 的 PDF 地址）。

社交平台只认绝对地址，所以这些标签都写成 `https://zhanghu-zhao.com/imbue/...`。

## 待补充

`index.html` 里不确定的地方都用 `TODO` 注释标出了，列出它们：

```sh
grep -n "TODO" imbue/index.html
```
