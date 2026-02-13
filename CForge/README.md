# Character Forge V7.0

一个基于 AI 的角色生成工具，通过 5 步流程创建详细的角色档案。

## 特点

- 🎨 **5 步创建流程**：基础档案 → 外貌 → 心理 → 深度细化 → 报告生成
- 🤖 **AI 辅助生成**：DeepSeek API 驱动的智能内容生成
- 🔄 **人机协作**：Step 4 采用全新的交互式问答流程
- 📝 **灵活修改**：支持小改（直接编辑）和大改（给 AI 提建议）
- 📊 **多种报告格式**：小说、TRPG、档案、访谈、日记、医疗档案
- 💾 **导出/导入**：完整保存和恢复角色数据

## 快速开始

1. 打开 `index.html`
2. 按照 5 个步骤填写信息
3. 在 Step 5 生成报告

详细使用方法请查看 [docs/使用指南.md](docs/使用指南.md)

## Step 4 新交互流程

Step 4 采用全新的 5 步人机协作流程：

```
1. AI 问问题 → 你简要回答
2. AI 根据你的回答生成详细内容
3. 你查看内容，选择满意/不满意
4. 如果不满意，选择修改方式：
   📝 小改：直接修改文本
   💬 大改：给 AI 提建议
5. 通过，进入下一题
```

这是一个真正的"人机协作"流程，让你和 AI 共同创造角色的深度细节。

## 文件结构

```
Character Forge/
├── index.html              # 主程序
├── README.md               # 项目说明
├── docs/                   # 文档目录
│   ├── 使用指南.md         # 完整使用说明
│   ├── 快速参考.txt        # 快速参考卡
│   └── CHANGELOG.md        # 更新日志
└── tests/                  # 测试工具目录
    ├── test-step4.html     # Step 4 交互流程测试
    ├── test-api.html       # API 连接测试
    ├── test-render.html    # 渲染功能测试
    └── quick-test.html     # 快速功能验证
```

## API 配置

程序已预配置 DeepSeek API：
- URL: `https://api.deepseek.com`
- Key: `sk-a6158402691b45cf82f26fa841f2cd27`
- Model: `deepseek-chat`

## 系统要求

- 现代浏览器（Chrome、Firefox、Edge、Safari）
- 网络连接（用于 AI API 调用）
- 无需安装，直接打开 HTML 文件即可使用

## 版本历史

### V7.0 (当前)
- 全新的 Step 4 交互流程
- 支持小改和大改两种修改方式
- 可以多次迭代优化
- 完整的导出/导入功能

### V6.1
- Step 4 自动生成深度细节
- 多选功能
- 基础导出/导入

详细更新记录请查看 [docs/CHANGELOG.md](docs/CHANGELOG.md)

## 使用技巧

### Step 4 最佳实践

**写好简要回答**：
- ✅ 简单描述即可，AI 会帮你扩展
- ✅ 例如："五年前在战斗中受伤"

**选择修改方式**：
- 📝 小改：内容基本满意，只需微调
- 💬 大改：需要改变方向或增加内容

**写好修改建议**：
- ✅ 具体明确："增加更多情感描写"
- ❌ 太模糊："改一下"

## 常见问题

**Q: Step 4 没有生成问题？**  
A: 需要在 Step 2/3 选择特殊选项（如疤痕、创伤、物品等）

**Q: AI 生成失败？**  
A: 使用 `tests/test-api.html` 测试 API 连接

**Q: 可以多次修改吗？**  
A: 可以，"大改"可以反复生成直到满意

更多问题请查看 [docs/使用指南.md](docs/使用指南.md)

## 测试

推荐测试顺序：
1. `tests/test-step4.html` - 快速体验 Step 4 流程（5分钟）
2. `index.html` - 完整流程测试（20分钟）

## 技术栈

- HTML5 + JavaScript (Vanilla)
- Tailwind CSS (CDN)
- Font Awesome (CDN)
- DeepSeek API

## 许可

本项目仅供学习和个人使用。

---

**开始创造你的角色吧！** 🎉

详细使用方法请查看 [docs/使用指南.md](docs/使用指南.md)
