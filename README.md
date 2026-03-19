# Lavro.org

个人作品集网站，托管于 GitHub Pages。

**🔗 https://lavro.org**

## 项目结构

```
├── index.html / app.js     主站（React 客户端渲染，无构建工具）
├── CForge/                  Character Forge – 角色构建与数据核心逻辑工具
├── LSimulator/              Life Simulator – 多分支事件模拟游戏
├── DnD/
│   ├── Alberina/            D&D 同人自设 · 阿尔贝莉娜（高精灵法师）
│   └── Flavilar/           D&D 同人自设 · 芙勒维拉（龙裔野蛮人）
├── HomePageAssets/           主站图片资源（WebP）
├── tailwind.css              主站预编译 Tailwind CSS
├── react.production.min.js   自托管 React 18
├── react-dom.production.min.js
├── sitemap.xml
├── robots.txt
└── llms.txt                  AI 爬虫友好摘要
```

## 技术栈

- **主站**：React 18（自托管，无 CDN）+ Tailwind CSS 3（预编译）+ Lenis 平滑滚动（esm.sh）
- **DnD 页面**：纯 HTML + Tailwind CDN + Lenis + Lucide Icons
- **CForge / LSimulator**：独立单页应用
- **部署**：GitHub Pages + 自定义域名（lavro.org）

## 开发备注

主站修改 Tailwind class 后需重新编译：

```bash
npx tailwindcss -i src/input.css -o tailwind.css --minify
```

主站字体使用子集化的阿里巴巴普惠体（47KB），SVG 图标内联替代 Font Awesome。

## 版权说明

- D&D 角色页面为基于龙与地下城规则的同人自设（OC），非威世智官方内容
- Alberina 角色人设 by SSnO，界面与文案 by Lavro
- Flavilar 角色人设 by 椿，界面与文案 by Lavro

© 2026 Lavro
