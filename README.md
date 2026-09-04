# English Adventure 🎮

一款专为 **3～6 岁幼儿**打造的高趣味英语启蒙 Web 游戏。
结合 **Endless Reader** 核心启蒙理念与现代交互设计，让孩子在纯粹的“玩耍与探索”中自然建立自然拼读 (Phonics) 与单词认知。

![Vue 3](https://img.shields.io/badge/Vue-3-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)
![Pinia](https://img.shields.io/badge/Pinia-2-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 核心小游戏与特色

### 🔤 游戏一：Endless 拼词乐园 (Word Speller)
- 👆 **“点选飞入 + 自由拖拽”双交互**：
  - **点选飞入**：针对低幼儿童手部精细动作发育特点，只需轻点候选字母，字母即带流星弧线与呼啸声自动飞入对应空槽。
  - **自由拖拽**：支持手指与鼠标平滑拖拽，自带 90px 宽松磁吸感，抓取点平滑对齐指尖。
- 🗣️ **Phonics 自然拼读萌音**：抓起字母时发出清脆生动的拼读音（如 B 发 "buh"、C 发 "kuh"、A 发 "æ"），强化音形关联。
- 🍬 **无剧透与无压力引导**：空槽位采用果冻虚线，不直接预印图片剧透；放错位置柔软回弹（Boing 音效）；停留 5 秒温柔摇摆提示，零挫败感。
- 📖 **明亮童趣漫画场景**：单词拼装完成瞬间彩虹合体，弹出明亮生动的漫画故事卡片，短句朗读时关键词高亮弹跳。

### 🐾 游戏二：单词小径寻宝 (Word Path Quest)
- 🌈 **真·手指轨迹追踪连线**：彻底告别机械的直角自动寻路，实时跟随手指滑过相邻单元格绘制平滑发光彩虹小径。
- 🐶 **英语语境目标驱动**：按字母顺序连线帮助小动物找到喜爱的物品（小猫找鱼 C-A-T、小狗找骨头 D-O-G、小鱼游大海 F-I-S-H）。
- ↩️ **顺滑回退与单条撤销**：手指倒退一格即可撤回；点击已完成的连线即可一键擦除重画。
- 🛡️ **100% 保证有解**：经过严格的拓扑逻辑设计，关卡完全杜绝死锁冲突。

### 📚 收集册与图鉴 (My Words)
- 单词分类查看（Animals, Food, Nature, Vehicles, Objects 等）。
- 记录学习星级，随时点击复习标准美式发音与情境例句。

---

## 🎵 单例音频架构 (AudioManager)

- **Web Audio Context 单例管理**：彻底根除旧版本中频繁 `new AudioContext()` 触发浏览器 6 个上限导致全游戏声音瘫痪的静音 Bug。
- **纯合成低延迟音效**：包含气泡声 (`Pop`)、磁吸归位声 (`Snap`)、果冻弹回声 (`Boing`)、飞入呼啸声 (`Whoosh`)、胜利和弦 (`Success`) 与星级弹射音 (`Star`)，零静态资源网络消耗。
- **多引擎语音兜底**：智能匹配高质量系统英文语音包（Google US English / Microsoft David / Zira），音调活泼童趣。

---

## 🚀 快速开始

### 1. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 2. 本地开发

```bash
npm run dev
```
打开浏览器访问控制台提示的本地地址（默认 `http://localhost:5173`）。

### 3. 构建生产版本

```bash
npm run build
```
执行 TypeScript 类型检查与 Vite 生产打包，产物输出至 `dist/` 目录。

### 4. 预览构建产物

```bash
npm run preview
```

---

## 📁 项目结构

```
English-adventure/
├── public/
│   └── img/                 # 26 个字母动物彩色图形 (A.png ~ Z.png)
├── src/
│   ├── components/
│   │   ├── common/          # 语音选择与通用设置
│   │   ├── connect/         # 单词连线游戏核心组件 (ConnectGrid.vue)
│   │   └── game/            # 拼词乐园组件 (WordScene.vue, Character.vue, LevelComplete.vue)
│   ├── data/
│   │   ├── connectLevels.ts # 连线关卡与拓扑路径数据
│   │   └── levels.ts        # 拼词关卡题库与分类数据
│   ├── router/              # 路由配置 (/game, /connect, /collection)
│   ├── stores/              # Pinia 状态持久化 (game.ts, connect.ts)
│   ├── utils/
│   │   └── audio.ts         # 单例音频管理器与自然拼读发音引擎
│   ├── views/
│   │   ├── HomeView.vue        # 游戏大厅与角色互动
│   │   ├── GameView.vue        # 拼词游戏关卡视图
│   │   ├── ConnectGameView.vue # 单词连线游戏主视图
│   │   └── CollectionView.vue  # 单词收藏图鉴
│   ├── App.vue
│   └── main.ts
├── package.json
└── README.md
```

---

## 💡 儿童交互设计原则

1. **零阅读门槛**：全场景图形化、符号化引导，无需家长协助阅读冗长说明。
2. **正面激励机制**：全流程无失败惩罚、无倒计时压力、无扣分机制，只给予正向鼓励与探索乐趣。
3. **触控极简防误触**：全屏禁用默认手势滚动与缩放，大点击热区（≥ 56px），自适应手机、平板及横竖屏。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
