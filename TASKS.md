# Lavro.org 改进任务清单

> 本清单由代码审查产出。按顺序执行，每个任务相互独立，做完一个提交一个（commit message 用任务标题）。
> 标 ⚠️ 的任务动手前需要用户确认，不要自行决定。
> 通用验收方式：本地起一个静态服务器（如 `python -m http.server`）打开页面，确认显示正常、控制台无报错。

---

## 任务 1：修复「禁用 JS 时整页黑屏」 【简单，先做】

**背景**：`index.html` 的 `<style>` 里有 `#root { opacity: 0 }`，靠 `app.js` 挂载 React 后才恢复为 1。如果 JS 被禁用或 app.js 加载失败，页面全黑，尽管 `#root` 里有完整的静态骨架内容。

**做法**：
1. 在 `index.html` 的 `</head>` 前加：
   ```html
   <noscript><style>#root { opacity: 1 !important; }</style></noscript>
   ```
2. 用 grep 在全仓库搜 `opacity: 0` / `opacity:0`，检查其他同模板页面（`en/index.html`、`Projects/index.html`、`en/Projects/index.html`、`Labs/index.html`、`DnD/index.html`）是否对 `#root` 用了同样手法，是则同样处理。

**验收**：浏览器禁用 JavaScript 后打开各页面，能看到静态内容而不是黑屏。

---

## 任务 2：删除 `#seo-content` 隐藏文本块 【简单】

**背景**：`index.html` 第 92–139 行有一个 `position:absolute; left:-9999px` 的 `#seo-content` 区块，属于 Google 明确反对的「隐藏文本」，有判罚风险。`#root` 内已有给爬虫的静态骨架，内容重复，删掉不损失 SEO。

**做法**：
1. 删除 `index.html` 中整个 `<div id="seo-content">...</div>` 区块，以及 `<style>` 里的 `#seo-content { ... }` 规则。
2. 检查 `en/index.html` 是否有同样区块，有则一并删除。
3. 不要动 `#root` 里的静态骨架和 `<script type="application/ld+json">`，那些是正确做法，保留。

**验收**：页面渲染与之前完全一致；HTML 源码中不再有 left:-9999px 的隐藏内容。

---

## 任务 3：清理不应公开部署的杂物文件 【简单】

**背景**：GitHub Pages 会原样发布仓库内一切文件，以下文件目前公开可访问。

**做法**：
1. `git rm` 删除：
   - `_tmp_puhuiti.ttf`（8MB 临时字体）
   - `Temp/1.txt`、`Temp/2.txt`（删除整个 `Temp/` 目录）
   - `Labs/AlbumCoverExplorer/SKILL (1).md`
2. `_subset.py` 和 `_subset_unicodes.txt` 是字体子集化工具，仍有用：移动到 `_src/tools/`（`_src` 已在 .gitignore 中，不会被部署），并 `git rm --cached` 使其退出版本库。
3. 在 `.gitignore` 末尾追加：
   ```
   _tmp_*
   Temp/
   ```

**验收**：`git status` 干净；上述文件不再被 git 跟踪；`_src/tools/_subset.py` 在本地存在。

---

## 任务 4：自托管 Lenis，移除 esm.sh 依赖 【中等】

**背景**：主站（`app.js` / `en/app.js` / `Projects/app.js` / `en/Projects/app.js` / `Labs/app.js` / `DnD/app.js`）通过 `import('https://esm.sh/lenis@1.1.18')` 动态加载平滑滚动库。esm.sh 在中国大陆访问不稳定，而本站主要受众是中文用户。

**做法**：
1. 下载 `https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js`（UMD 版，约 10KB），存为仓库根目录 `lenis.min.js`。
2. 在每个引用 esm.sh 的页面的 HTML 里，于 `app.js` 之前加 `<script src="/lenis.min.js" defer></script>`（注意子目录页面用绝对路径 `/lenis.min.js`）。
3. 把各 `app.js` 里的 `import('https://esm.sh/lenis@1.1.18').then(({ default: Lenis }) => { ... })` 改为直接使用全局 `Lenis`（UMD 暴露为 `window.Lenis`），保留原有的初始化参数和销毁逻辑。注意保持「Lenis 不存在时优雅降级为普通滚动」的容错（用 `if (typeof Lenis !== 'undefined')` 包裹）。
4. 删除各 HTML 中的 `<link rel="preconnect" href="https://esm.sh">`。
5. `QuantumStyleTest/index.html` 和 `DnD/Alberina|Flavilar|Shirul` 用的是 unpkg 的 Lenis `<script>` 标签，同样改为指向 `/lenis.min.js`（版本不同没关系，1.1.18 的 API 向下兼容 1.0.x 的用法；改完逐页验证滚动正常）。

**验收**：grep 全仓库无 `esm.sh`、无 `unpkg.com/.*lenis`；每个改过的页面平滑滚动仍然生效，控制台无报错。

---

## 任务 5：自托管 Anton 字体，移除 Google Fonts 依赖（主站部分） 【中等】

**背景**：多数页面从 `fonts.googleapis.com` 加载 Anton 字体（仅拉丁字符的标题字体）。Google Fonts 在中国大陆被屏蔽，导致标题字体回退。

**做法**：
1. 从 https://fonts.google.com/specimen/Anton 下载 Anton-Regular.ttf，用 fonttools 转成 woff2（只含拉丁字符即可，体积约 15–20KB）：
   ```
   pip install fonttools brotli
   pyftsubset Anton-Regular.ttf --unicodes="U+0000-00FF,U+2000-206F" --flavor=woff2 --output-file=Anton-subset.woff2
   ```
2. 存到 `HomePageAssets/Anton-subset.woff2`。
3. 在使用 Anton 的每个页面（grep `family=Anton` 找全）中，删除 Google Fonts 的 `<link rel="preload">`/`<link rel="stylesheet">`/`@import`，改为本地 `@font-face`：
   ```css
   @font-face {
     font-family: 'Anton';
     src: url('/HomePageAssets/Anton-subset.woff2') format('woff2');
     font-weight: 400;
     font-display: swap;
   }
   ```
   主站 `app.js` 的 `globalCSS` 字符串里已有 PuHuiTi 的 @font-face，Anton 的可以加在旁边；纯 HTML 页面直接写进 `<style>`。
4. 同时删除对应的 `<link rel="preconnect" href="https://fonts.gstatic.com">`。
5. **范围控制**：只处理 Anton。`DnD/Flavilar`、`Labs/AlbumCoverExplorer/dist`、`Projects/LSimulator` 还引用了其他 Google Fonts 字族，本任务不动它们（涉及中文大字体，需要单独子集化，见任务 9）。

**验收**：断网（或屏蔽 fonts.googleapis.com）打开主站，LAVRO 大标题仍是 Anton 字体；Anton 的 Google Fonts 引用全部消失。

---

## 任务 6：消除滚动时的全应用重渲染 【中等，需仔细】

**背景**：`app.js`（及 `en/app.js`）的 `updateParallax()` 末尾调用 `setScrollY(scroll)`，导致每个滚动帧整个 React 树重渲染。`scrollY` state 只有两个消费方，都可以不用每帧 state。

**做法**（`app.js` 和 `en/app.js` 同步修改，两文件结构几乎一样）：
1. **滚动提示箭头**：当前用 `scrollY > 50` 控制透明度。改为独立 state `const [scrolled, setScrolled] = useState(false)`，在 `updateParallax` 里只在跨越阈值时更新：
   ```js
   const next = scroll > 50;
   if (next !== scrolledRef.current) { scrolledRef.current = next; setScrolled(next); }
   ```
   （配一个 `scrolledRef = useRef(false)` 避免重复 setState。）
2. **MonumentalLink 图标水印透明度**：当前靠 `scrollY` prop 触发 effect 重新计算。改为不再传 `scrollY` prop，组件内部自己监听：在 `MonumentalLink` 的 `useEffect` 里订阅一个全局滚动通知（最简单：`window.addEventListener('scroll', handler, { passive: true })` 在 Lenis 模式下不触发，所以改用组件内自己的 rAF 节流 + 直接写 DOM：`iconRef.current.style.opacity = ...`，不经过 `setLogoStyle` state）。具体实现：
   - 给 icon svg 加 `ref: iconRef`；
   - 把原 effect 里的计算逻辑改成直接 `iconRef.current.style.opacity = String(opacity)`；
   - 触发时机：在父组件 `updateParallax` 之外，维护一个简单的订阅列表（模块级 `const parallaxSubscribers = new Set()`，`updateParallax` 末尾遍历调用），`MonumentalLink` 挂载时注册、卸载时注销。
3. 删除 `setScrollY` 调用和 `scrollY` state 本身，以及所有 `h(MonumentalLink, { scrollY, ... })` 中的 `scrollY` 传参。
4. **回归检查**（重要）：滚动时——hero 视差、标题缩放、clip 斜切层、SYNCING 背景字、about/hobby 视差、图标水印渐显、滚动箭头淡出，全部仍正常；初次加载的入场动画不受影响。

**验收**：功能与改动前肉眼无差异；React DevTools Profiler 中滚动不再引起 `LavroPortfolio` 整树 render。

---

## 任务 7：GitHub Actions 同步工作流瘦身 【简单】

**背景**：`.github/workflows/sync-projects.yml` 每 10 分钟跑一次（约 4300 次/月），且每次 `apt-get update && install jq rsync`——这两个工具在 ubuntu-latest 上是预装的。

**做法**：
1. 删除 "Install tools" 整个 step。
2. cron 从 `*/10 * * * *` 改为每天一次：`0 4 * * *`（保留 `workflow_dispatch` 手动触发和 `projects.json` push 触发）。
3. 在 rsync 排除项中追加，避免把源仓库内部文档发布上线：
   ```
   --exclude "*.md" --exclude "docs" --exclude "tests" --exclude ".vscode" --exclude "package-lock.json"
   ```
   注意：`Projects/LSimulator/assets/fonts/README.md` 这类被排除无影响；如果某项目页面运行时真的需要某个 .md，再单独放行。
4. push 的目标分支 `HEAD:main` 是正确的（main 为默认分支兼部署分支），不要改动。

**验收**：YAML 语法有效（可用 `gh workflow view` 或在线 lint 校验）；改动点仅限上述三处。

---

## 任务 8：sitemap 与 OG 小修 【简单】

**做法**：
1. `sitemap.xml`：把所有 `<lastmod>` 更新为当前日期（格式 YYYY-MM-DD）。
2. OG 图片：微信/QQ 爬虫不支持 webp。把 `HomePageAssets/OGImage.webp` 转一份 jpg（质量 85 左右，命名 `OGImage.jpg`），将 `index.html` 和 `en/index.html` 里 `og:image` / `twitter:image` 的 URL 改为指向 `.jpg`。webp 原文件保留不删。
3. 给 `og:image` 加上 `og:image:width` / `og:image:height` meta（按实际像素填写）。

**验收**：sitemap 能通过 XML 校验；`og:image` 指向的 jpg 文件存在且小于 300KB。

---

## 任务 9：DnD/Shirul 巨型字体子集化 【中等，需要 Python 环境】

**背景**：`DnD/Shirul/` 下有 `HanYiFangSongJian-1.ttf`（4.5MB）和 `No.335-ShangShouXianYunTi-2.ttf`（3.6MB）两个完整中文字体直接上线。同站 `DnD/Alberina` 已示范过正确做法（子集化到 163KB 的 woff2）。仓库根目录的 `_subset.py`（任务 3 后位于 `_src/tools/`）就是干这个的工具。

**做法**：
1. 读 `_subset.py` 了解用法（它配合 `_subset_unicodes.txt` 使用）。
2. 从 `DnD/Shirul/index.html` 提取页面实际用到的全部汉字字符集（写个小脚本去重收集页面文本）。
3. 用 fonttools 将两个 ttf 按该字符集子集化为 woff2，输出到 `DnD/Shirul/fonts/`。
4. 修改 `DnD/Shirul/index.html` 的 @font-face 指向新 woff2，删除原 ttf 两个大文件。`Cinzel-VariableFont_wght.ttf`（123KB，拉丁字体）可顺手转 woff2，不强制。
5. **注意**：如果页面文字未来还会改，子集会缺字。在 `DnD/Shirul/fonts/` 旁放一个 `README.md` 说明「改文案后需重新子集化，工具在 _src/tools/_subset.py」。

**验收**：Shirul 页面所有文字渲染无缺字（肉眼逐屏检查）；两个原 ttf 已删除；新字体合计小于 500KB。

---

## 任务 10：中英文 app.js 合并为单份 + 文案字典 【较大，最后做，谨慎】

**背景**：`app.js`（571 行）与 `en/app.js`（565 行）差异约 128 行，几乎全是文案。双份维护容易漏改。

**做法**：
1. 先 diff 两文件，确认差异确实只有文案与个别链接（如语言切换按钮 zh↔en、href 指向）。若发现结构性差异，停下来在提交说明里列出，不要强行合并。
2. 新建 `i18n.js`：导出 `const I18N = { zh: {...}, en: {...} }`，包含所有差异文案（hero 副标题、各 section 描述、MonumentalLink 的 label/desc、语言切换按钮的 href 和文字等）。
3. 改造 `app.js`：开头用 `const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'zh'; const T = I18N[LANG];`，全部文案改为引用 `T.xxx`。
4. `index.html` 与 `en/index.html` 都改为加载同一份 `/i18n.js` + `/app.js`（注意 en 页用绝对路径）；删除 `en/app.js`。
5. **回归检查**：中英两版逐屏对比改动前后截图，文案、布局、动画一致；`en/index.html` 的 `<html lang="en">` 确认无误。

**验收**：`en/app.js` 已删除；两个语言版本页面与改动前肉眼无差异。

---

## 附：明确不做 / 留给用户决定的事项

- **分支已统一**：默认分支为 `main`，本地已切换到 `main` 并跟踪 `origin/main`。所有提交都推到 `main`。远程残留的旧 `master` 分支（单个 init 提交，内容与 main 重复）由用户手动删除，模型不要操作分支。
- DnD 页面的 `cdn.tailwindcss.com` 运行时编译：换成预编译需要把 DnD 页面纳入 Tailwind content 扫描重新构建，牵涉构建流程，暂不在本清单内。
- `favicon.png`（203KB）压缩、`prefers-reduced-motion` 支持：锦上添花，可作为后续任务。
