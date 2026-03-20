# 字体文件说明

请将以下字体文件放置在此文件夹中：

## 中文字体

### Lorchin（正文）
- `lorchin.woff2`
- `lorchin.woff`
- `lorchin.ttf`

用于：中文正文内容

### Shanghai Modern（上海摩登，标题）
- `shanghai-modern.woff2`
- `shanghai-modern.woff`
- `shanghai-modern.ttf`

用于：中文标题（h1, h2, h3等）

## 英文字体

### Luperca（标题）
- `luperca.woff2`
- `luperca.woff`
- `luperca.ttf`

用于：英文标题（h1, h2, h3等）

## 字体格式优先级

1. `.woff2` - 最优先，现代浏览器支持，文件最小
2. `.woff` - 备用，兼容性好
3. `.ttf` - 最后备用，兼容性最好但文件较大

## 字体应用规则

- **中文模式**：
  - 正文：Lorchin
  - 标题：Shanghai Modern（上海摩登）
  
- **英文模式**：
  - 正文：Inter（Google Fonts）
  - 标题：Luperca

## 注意事项

1. 确保字体文件名与CSS中的引用一致
2. 建议提供所有三种格式以确保最佳兼容性
3. 字体文件应该有合法的使用授权
4. 如果字体文件较大，考虑使用字体子集化工具减小文件大小
