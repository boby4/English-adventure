# English Adventure 🎮

一款面向3-6岁儿童的英语启蒙Web游戏，参考Endless Reader的设计理念，让孩子通过"玩"自然记忆英语单词。

![Vue 3](https://img.shields.io/badge/Vue-3-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)

## ✨ 特色功能

- 🎯 **拖拽学习** - 拖动字母到正确位置，学习单词拼写
- 🔊 **语音播放** - 拖动时播放字母读音，完成时播放单词和句子
- 🎨 **象形字母** - 26个字母设计成可爱的动物形状
- 🎭 **挣扎动画** - 拖动字母时有挣扎抖动效果
- 🌟 **无压力设计** - 不惩罚错误，鼓励孩子尝试
- 📱 **响应式** - 支持桌面、平板、手机

## 🎮 游戏玩法

1. 点击 **LET'S PLAY** 开始游戏
2. 看到单词对应的图片（如 🐱）
3. 拖动散落的字母到正确位置
4. 拼写完成后播放单词读音
5. 显示包含单词的句子
6. 自动进入下一个单词

## 📚 单词内容

### 第一批 50 个单词

| 分类 | 单词 |
|------|------|
| 🐾 Animals | cat, dog, fish, bird, lion, bear, duck, frog, cow, pig, horse, sheep, rabbit, monkey, panda |
| 🍎 Food | apple, milk, banana, cake, bread, egg, rice, cookie, grape, orange |
| 🌿 Nature | sun, tree, star, moon, rain, flower, cloud, snow, leaf, grass |
| 🚗 Vehicles | car, bus, boat, plane, train |
| 📦 Objects | ball, book, house, cup, hat |

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
# 或
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
# 构建生产版本
pnpm build
# 或
npm run build
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **类型系统**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **语音**: Web Speech API
- **部署**: Vercel

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
│   ├── common/      # 通用组件
│   └── game/        # 游戏组件
├── data/            # 数据文件
│   └── levels.ts    # 单词数据
├── router/          # 路由配置
├── stores/          # 状态管理
├── utils/           # 工具函数
└── views/           # 页面视图
```

## 🎨 设计原则

1. **儿童友好** - 大按钮、圆角、柔和颜色
2. **无压力** - 不惩罚错误，鼓励尝试
3. **丰富反馈** - 每个操作都有动画和声音
4. **简单直观** - 一个页面只做一件事

## 📝 开发说明

### 添加新单词

编辑 `src/data/levels.ts`：

```typescript
{
  id: 'new-word',
  word: 'NEW',
  category: 'objects',
  emoji: '🆕',
  image: '/assets/words/new.png',
  letters: ['N', 'E', 'W'],
  sentence: 'This is new.',
  voice: 'New',
  animation: 'bounce'
}
```

### 字母图片

将字母图片放在 `public/img/` 目录下，命名为 `{字母}.png`，如 `A.png`, `B.png`。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**让孩子在游戏中爱上英语！** 🎉
