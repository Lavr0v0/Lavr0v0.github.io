# Resources 资源文件夹

本文件夹包含项目使用的所有静态资源文件。

## 文件夹结构

```
resources/
├── FONT/          # 字体文件
│   ├── LorchinSansP0.ttf
│   ├── Luperca-12-24Caption.ttf
│   ├── Luperca-24-36Subtitle.ttf
│   ├── Luperca-36-48Title.ttf
│   ├── Luperca-48-72Header.ttf
│   ├── Luperca-72-96Banner.ttf
│   └── 上海摩登体.otf
│
└── ICON/          # 图标文件
    ├── bookmark.png
    ├── diskette.png
    ├── female.png
    ├── male-gender.png
    ├── non-binary.png
    ├── translation.png
    └── up-loading.png
```

## 使用说明

### 字体 (FONT/)

- **Lorchin Sans P0**: 用于中文正文
- **上海摩登体**: 用于中文标题
- **Luperca**: 用于英文标题（包含多个字重）

字体在 `pages/assets/app.css` 中通过 `@font-face` 引用。

### 图标 (ICON/)

图标用于界面的各个位置：
- `bookmark.png` - 读取存档按钮
- `diskette.png` - 保存按钮
- `female.png` - 女性性别选项
- `male-gender.png` - 男性性别选项
- `non-binary.png` - 其他性别选项
- `translation.png` - 语言选择标签
- `up-loading.png` - 开始游戏按钮

## 版权信息

所有资源的详细来源和许可信息请查看项目根目录的 [CREDITS.md](../CREDITS.md) 文件。

### 图标来源
- 设计师: Anggra, Freepik, Fathema Khanom
- 平台: Flaticon
- 许可: Flaticon License

### 字体来源
字体来源信息待确认。如果您知道这些字体的确切来源，或者您是版权所有者，请联系项目维护者。

## 注意事项

⚠️ 请勿：
- 单独分发这些资源文件
- 在未经许可的情况下用于其他项目
- 移除或修改版权信息

✅ 可以：
- 在本项目中使用和修改
- 根据需要优化文件大小
- 添加新的资源文件

## 添加新资源

如需添加新的资源文件：

1. 将文件放入对应的文件夹（FONT/ 或 ICON/）
2. 在 `pages/assets/app.css` 或 `pages/index.html` 中引用
3. 在 `CREDITS.md` 中添加来源信息
4. 更新本 README 文件

---

最后更新: 2024年
