# Lavro.org

个人作品集网站，托管于 GitHub Pages。

**🔗 https://lavro.org**

## 项目结构

```
├── index.html                主站入口
├── app.js                    主站 React 应用
├── 404.html                  自定义 404 页面
├── credits/index.html        借物表 / 致谢页
├── DnD/
│   ├── Alberina/             D&D 同人自设 · 阿尔贝丽娜（高精灵法师）
│   └── Flavilar/             D&D 同人自设 · 芙勒维拉（龙裔野蛮人）
├── CForge/                   Character Forge – 角色构建工具
├── LSimulator/               Life Simulator – 多分支事件模拟
├── HomePageAssets/            图片、字体等静态资源
├── tailwind.css               预编译 Tailwind CSS
├── react.production.min.js    自托管 React 18
├── react-dom.production.min.js
├── sitemap.xml / robots.txt / llms.txt
└── autogit.ps1                自动 Git 提交脚本
```

## 技术栈

- **主站**：React 18（自托管）+ Tailwind CSS 3（预编译）+ Lenis 平滑滚动
- **DnD 页面**：纯 HTML + Tailwind CDN + Lenis + Lucide Icons
- **CForge / LSimulator**：独立单页应用
- **部署**：GitHub Pages + Porkbun 自定义域名

## 开发备注

修改 Tailwind class 后需重新编译：

```bash
npx tailwindcss -i src/input.css -o tailwind.css --minify
```

## 版权

- D&D 角色页面为同人自设（OC），非官方内容
- Alberina 角色人设 by SSnO，界面与文案 by Lavro
- Flavilar 角色人设 by 椿，界面与文案 by Lavro

© 2026 Lavro
