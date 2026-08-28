# 4岁儿童英语启蒙游戏开发 Prompt

## 一、项目目标

开发一款面向 **3～6 岁儿童**的英语启蒙 Web 游戏。

整体体验参考 **Endless Reader** 这一类幼儿英语启蒙产品的核心设计理念：

- 操作极其简单
- 大量动画反馈
- 单词学习与游戏结合
- 拖拽字母完成单词
- 点击即可听发音
- 单词完成后出现有趣动画
- 使用短句帮助孩子理解单词
- 不依赖复杂菜单
- 不需要阅读复杂说明
- 让孩子通过“玩”自然记忆英语单词

注意：

**不要直接复制 Endless Reader 的 Logo、角色、插画、声音、动画资源、字体、UI 素材、具体故事内容或代码。**

可以参考其：

- 信息架构
- 游戏节奏
- 操作逻辑
- 儿童交互方式
- 动画反馈方式
- 英语启蒙教学模式

所有视觉资源、角色、音效、单词内容必须使用原创设计。

---

# 二、技术要求

使用：

- Vue 3
- Vite
- TypeScript
- Pinia
- CSS / SCSS
- Web Speech API
- HTML5 Audio
- SVG
- Canvas（仅在确实需要时使用）

项目要求：

- 支持桌面浏览器
- 支持平板
- 支持手机
- 支持触摸操作
- 支持鼠标
- 响应式布局
- 支持 Vercel 部署
- 不需要后端即可运行
- 第一版使用本地数据
- 不使用复杂数据库
- 所有游戏进度保存到 localStorage
- npm / pnpm 均可运行

必须能够：

```bash
pnpm install
pnpm dev
pnpm build
```

构建完成后可以直接部署到 Vercel。

---

# 三、产品定位

产品不是传统英语学习 App。

不要出现：

- 课程表
- 复杂登录
- 大量文字
- 成人化设置
- 复杂表单
- 枯燥的单词列表
- 考试
- 分数排名

核心理念：

> “孩子看到一个东西 → 听到一个单词 → 玩一下 → 拼出单词 → 听到单词 → 看到动画 → 自然记住。”

---

# 四、整体游戏结构

首页进入后，不要展示复杂菜单。

页面中央展示：

## LET'S PLAY!

下面显示一个可爱的原创角色。

例如：

一只小怪兽、小恐龙、小熊或者小机器人。

角色拥有：

- 待机动画
- 开心动画
- 惊讶动画
- 鼓掌动画
- 跳跃动画
- 睡觉动画

点击角色可以触发随机动画和语音。

---

# 五、核心玩法

整个产品最重要的是：

## 单词学习关卡

每个单词对应一个小游戏。

例如：

```text
CAT
DOG
SUN
BALL
APPLE
CAR
BOOK
FISH
TREE
MILK
```

第一阶段先实现：

```text
CAT
DOG
SUN
BALL
FISH
APPLE
CAR
BOOK
TREE
MILK
```

后续扩展到：

```text
50 个单词
100 个单词
300 个单词
500 个单词
```

---

# 六、单词游戏流程

每个单词按照下面流程运行：

```text
展示物体
↓
角色说出单词
↓
字母散落
↓
孩子拖拽字母
↓
放入对应位置
↓
字母自动吸附
↓
拼写完成
↓
单词播放发音
↓
角色出现庆祝动画
↓
出现简单英语句子
↓
句子出现动画
↓
完成关卡
↓
进入下一个单词
```

例如学习：

```text
DOG
```

画面中央出现一只原创卡通小狗。

角色：

> DOG!

然后：

```text
D
O
G
```

以气泡、积木、卡片等形式散落在屏幕上。

儿童拖动：

```text
D → 第一个位置
O → 第二个位置
G → 第三个位置
```

成功后：

```text
DOG!
```

播放：

> Dog!

并显示可爱的狗狗动画。

---

# 七、单词页面设计

屏幕采用儿童友好的全屏游戏布局。

## 顶部

顶部只保留：

- 返回按钮
- 当前进度
- 音量按钮

例如：

```text
←                    3 / 10                    🔊
```

不要出现复杂导航。

---

# 八、中央区域

中央显示：

## 单词对应插画

例如：

CAT

显示一只巨大的原创卡通猫。

要求：

- 大尺寸
- 高饱和但舒服
- 圆润
- 可爱
- 具有动画效果

猫可以：

- 摇尾巴
- 跳跃
- 喵叫
- 打滚
- 睡觉

---

# 九、英语发音

每个单词都必须可以点击播放。

例如：

```text
DOG
🔊
```

点击：

播放：

> Dog.

建议支持：

```javascript
SpeechSynthesis
```

使用英语：

```text
en-US
```

例如：

```javascript
const utterance = new SpeechSynthesisUtterance('Dog')
utterance.lang = 'en-US'
speechSynthesis.speak(utterance)
```

注意：

不要默认使用中文解释。

主要通过：

- 图片
- 动画
- 声音
- 游戏

帮助孩子理解。

---

# 十、字母拖拽玩法

这是最核心的交互。

例如：

```text
CAT
```

底部出现：

```text
      [ _ ] [ _ ] [ _ ]


 C       A       T
```

孩子把字母拖进去。

正确：

```text
C → [ C ]
```

产生：

- 弹跳动画
- Glow
- 音效
- 小粒子

错误：

不要出现：

```text
错误！
Wrong!
```

不要制造挫败感。

而是：

- 字母轻微晃动
- 自动弹回
- 角色做提示动作
- 播放轻柔提示音

例如：

> Try again!

但不要责怪孩子。

---

# 十一、字母吸附

拖动字母接近目标位置时：

自动：

```text
吸附
```

例如：

```text
distance < 60px
```

自动进入位置。

让操作非常简单。

---

# 十二、Touch 操作

必须同时支持：

```text
touchstart
touchmove
touchend
```

不能只依赖：

```text
dragstart
dragend
```

因为手机和平板需要流畅拖拽。

建议统一封装：

```text
useDragLetter()
```

支持：

- mouse
- touch
- pointer

优先使用：

```text
Pointer Events
```

实现跨设备拖拽。

---

# 十三、儿童操作原则

所有按钮都必须：

- 足够大
- 圆角
- 有明显反馈
- 点击后立即反馈
- 不要求精准点击

按钮建议：

```text
最小点击区域 ≥ 56px
```

拖拽目标建议：

```text
≥ 100px
```

---

# 十四、声音系统

建立统一：

```text
AudioManager
```

负责：

```text
playCorrect()
playDrop()
playComplete()
playClick()
playHint()
playCelebration()
```

声音风格：

- 清脆
- 柔和
- 可爱
- 不刺耳

禁止：

- 爆炸声
- 强烈失败音
- 恐怖音效
- 成人游戏风格音效

---

# 十五、动画系统

使用：

```text
CSS Animation
+
Vue Transition
```

必要时使用：

```text
requestAnimationFrame
```

不要引入过于复杂的游戏引擎。

动画必须非常丰富。

至少实现：

## 角色动画

```text
idle
happy
jump
clap
surprise
sleep
```

## 字母动画

```text
float
bounce
shake
pop
sparkle
```

## 单词完成动画

```text
scale
rotate
bounce
particles
confetti
```

---

# 十六、完成关卡动画

例如：

孩子完成：

```text
APPLE
```

立刻：

```text
APPLE
```

放大。

然后：

🍎🍎🍎

苹果从屏幕中飞出来。

角色：

```text
跳跃
```

同时：

播放：

> Apple!

最后显示：

```text
Awesome!
```

持续约：

```text
1.5 秒
```

自动进入下一关。

---

# 十七、句子学习

完成单词以后，增加非常简单的短句。

例如：

```text
DOG
```

显示：

```text
The dog runs.
```

对应画面：

小狗奔跑。

语音：

> The dog runs.

不要让孩子必须阅读句子。

主要让孩子：

```text
看图
+
听声音
```

形成语义理解。

---

# 十八、句子动画

句子中的关键词需要动画。

例如：

```text
The DOG runs.
```

DOG 具有：

```text
bounce
```

RUN 具有：

```text
跑步动画
```

让儿童理解：

```text
DOG
+
RUN
```

之间的关系。

---

# 十九、示例关卡

第一批设计 10 个单词。

## LEVEL 01

```text
CAT
```

句子：

```text
The cat jumps.
```

动画：

猫跳跃。

---

## LEVEL 02

```text
DOG
```

句子：

```text
The dog runs.
```

动画：

狗奔跑。

---

## LEVEL 03

```text
SUN
```

句子：

```text
The sun is bright.
```

动画：

太阳升起。

---

## LEVEL 04

```text
BALL
```

句子：

```text
The ball bounces.
```

动画：

球弹跳。

---

## LEVEL 05

```text
FISH
```

句子：

```text
The fish swims.
```

动画：

鱼游泳。

---

## LEVEL 06

```text
APPLE
```

句子：

```text
I see an apple.
```

动画：

苹果旋转。

---

## LEVEL 07

```text
CAR
```

句子：

```text
The car goes fast.
```

动画：

汽车快速驶过。

---

## LEVEL 08

```text
BOOK
```

句子：

```text
I read a book.
```

动画：

书本打开。

---

## LEVEL 09

```text
TREE
```

句子：

```text
The tree is tall.
```

动画：

树慢慢长高。

---

## LEVEL 10

```text
MILK
```

句子：

```text
I like milk.
```

动画：

牛奶杯轻轻摇晃。

---

# 二十、关卡地图

完成单词以后逐步解锁。

不要设计传统复杂地图。

可以设计成：

```text
☁️
   ⭐
      🐻
          ⭐
             🐱
                 ⭐
```

或者：

```text
Home
 ↓
Forest
 ↓
Farm
 ↓
Ocean
 ↓
Space
```

每个区域包含不同单词。

---

# 二十一、学习区域

未来扩展：

## Animals

```text
cat
dog
fish
bird
lion
bear
duck
frog
```

## Food

```text
apple
banana
milk
cake
bread
egg
```

## Vehicles

```text
car
bus
train
boat
plane
```

## Nature

```text
sun
tree
moon
star
rain
cloud
```

## Home

```text
book
chair
table
bed
door
```

---

# 二十二、无压力设计

这是儿童产品。

不要：

- Game Over
- 失败
- 扣血
- 扣分
- 排名
- 时间限制
- 倒计时

即使孩子错误操作：

也只是：

```text
提示
+
重新尝试
```

永远保持：

```text
成功率接近 100%
```

---

# 二十三、激励系统

完成一个单词：

获得：

```text
⭐
```

连续完成：

```text
⭐⭐⭐
```

不要使用复杂金币体系。

可以收集：

```text
Stars
Stickers
Characters
```

例如：

完成 5 个单词：

```text
获得一个贴纸
```

完成 10 个：

```text
解锁一个小角色
```

---

# 二十四、首页结构

首页只需要：

```text
Logo

[ LET'S PLAY ]

[ WORDS ]

[ COLLECTION ]

小角色
```

但不要堆大量按钮。

核心入口永远是：

```text
LET'S PLAY
```

---

# 二十五、Collection

增加收集系统。

例如：

```text
🐱 Cat
✅ Learned

🐶 Dog
✅ Learned

☀️ Sun
✅ Learned

🐟 Fish
🔒 Locked
```

已经学习的单词：

点击即可重新播放：

```text
单词
+
发音
+
动画
```

---

# 二十六、数据结构

创建：

```typescript
interface WordLevel {
  id: string
  word: string
  category: string
  image: string
  letters: string[]
  sentence: string
  sentenceTranslation?: string
  voice: string
  animation: string
}
```

示例：

```typescript
const levels: WordLevel[] = [
  {
    id: 'cat',
    word: 'CAT',
    category: 'animals',
    image: '/assets/words/cat.png',
    letters: ['C', 'A', 'T'],
    sentence: 'The cat jumps.',
    voice: 'Cat',
    animation: 'jump'
  }
]
```

---

# 二十七、状态管理

Pinia 管理：

```text
currentLevel
completedLevels
unlockedLevels
stars
soundEnabled
musicEnabled
```

保存到：

```text
localStorage
```

页面刷新后不能丢失学习进度。

---

# 二十八、组件设计

建议组件：

```text
AppShell
HomePage
GamePage
WordScene
WordIllustration
LetterBoard
DraggableLetter
DropSlot
Character
SentenceScene
ProgressBar
SoundButton
LevelComplete
CollectionPage
```

进一步拆分：

```text
components/game/
```

---

# 二十九、目录结构

生成类似：

```text
src/
├── assets/
│   ├── images/
│   ├── sounds/
│   └── animations/
│
├── components/
│   ├── game/
│   │   ├── WordScene.vue
│   │   ├── LetterBoard.vue
│   │   ├── LetterCard.vue
│   │   ├── DropSlot.vue
│   │   ├── Character.vue
│   │   └── SentenceScene.vue
│   │
│   ├── common/
│   │   ├── AppButton.vue
│   │   ├── ProgressBar.vue
│   │   └── SoundButton.vue
│
├── data/
│   └── levels.ts
│
├── stores/
│   └── game.ts
│
├── views/
│   ├── HomeView.vue
│   ├── GameView.vue
│   └── CollectionView.vue
│
├── composables/
│   ├── useAudio.ts
│   ├── useSpeech.ts
│   └── useDrag.ts
│
├── router/
│   └── index.ts
│
├── App.vue
└── main.ts
```

---

# 三十、视觉风格

整体视觉参考：

```text
3D / 2D Cartoon
+
幼儿绘本
+
玩具
+
动画片
```

视觉关键词：

```text
cute
friendly
playful
soft
colorful
rounded
clean
high contrast
child friendly
```

避免：

```text
赛博朋克
暗黑
复杂渐变
成人 SaaS
科技风
游戏充值 UI
```

---

# 三十一、背景

不同场景拥有不同背景。

例如：

## Farm

```text
蓝天
白云
草地
小山
```

## Ocean

```text
海洋
气泡
鱼
珊瑚
```

## Space

```text
星空
星球
火箭
```

背景元素需要轻微动画。

例如：

```text
cloud → slowly move
star → twinkle
grass → sway
bubble → float
```

---

# 三十二、角色系统

设计一个原创主角色。

例如：

## 小恐龙 Dino

特征：

```text
大眼睛
圆身体
短手
短脚
大嘴
```

状态：

```text
idle
happy
thinking
excited
sleeping
celebrating
```

角色可以成为整个产品的“老师”。

角色不是负责讲大量文字。

而是：

```text
说单词
做动作
提示孩子
庆祝成功
```

---

# 三十三、交互原则

所有操作都必须符合：

```text
一个页面
一个目标
一个动作
一个反馈
```

例如：

当前任务：

```text
完成 DOG
```

屏幕上就不要出现大量其他东西。

---

# 三十四、错误提示

孩子放错：

不要：

```text
❌ WRONG
```

改为：

```text
角色摇摇头
```

然后：

```text
Try again!
```

并把字母弹回。

如果连续错误两次：

自动：

```text
高亮正确位置
```

连续错误三次：

允许：

```text
自动吸附
```

保证孩子最终一定能成功。

---

# 三十五、辅助模式

增加：

```text
Parent Mode
```

家长可以设置：

```text
自动播放声音
重复次数
是否显示英文
是否允许自动提示
```

但默认不要让儿童看到复杂设置。

进入方式：

```text
长按设置按钮 3 秒
```

避免儿童误操作。

---

# 三十六、学习模式

增加：

## Listen

只听单词。

例如：

```text
CAT
🔊
```

点击图片播放：

> Cat.

---

## Play

拖拽字母。

---

## Review

复习已经学过的单词。

---

# 三十七、自动复习

根据 localStorage：

如果某个单词：

```text
连续错误
```

或者：

```text
很久没有出现
```

增加复习概率。

例如：

```text
CAT
DOG
SUN
CAT
BALL
DOG
```

通过重复出现进行自然复习。

---

# 三十八、适配手机

移动端：

```text
100vw
100dvh
```

禁止：

```text
页面滚动
```

游戏区域：

```css
height: 100dvh;
overflow: hidden;
```

同时处理：

```text
safe-area-inset
```

避免 iPhone 刘海区域遮挡。

---

# 三十九、性能

要求：

- 首屏快速加载
- 图片合理压缩
- 音频懒加载
- 进入游戏后预加载当前关卡资源
- 下一关资源提前预加载
- 避免大量 DOM
- 避免连续创建 Audio 实例

游戏动画尽量使用：

```text
transform
opacity
```

减少：

```text
layout
reflow
paint
```

---

# 四十、PWA

增加：

```text
manifest.json
```

支持：

```text
Add to Home Screen
```

允许产品像一个儿童小游戏 App 一样打开。

---

# 四十一、页面必须做到“像成品”

不要生成：

```text
普通后台管理系统
```

不要出现：

```text
Element Plus 默认按钮
Ant Design 默认组件
```

不要使用：

```text
大量表格
```

不要让页面看起来像程序员 Demo。

必须做到：

```text
儿童教育产品
+
游戏产品
+
动画绘本
```

---

# 四十二、第一版 MVP

第一版本必须完整实现：

### 首页

```text
LET'S PLAY
```

### 10 个单词

```text
CAT
DOG
SUN
BALL
FISH
APPLE
CAR
BOOK
TREE
MILK
```

### 核心玩法

```text
看图
↓
听单词
↓
拖字母
↓
完成单词
↓
播放发音
↓
动画奖励
↓
播放句子
↓
下一关
```

### 必须支持

```text
PC
Mobile
Tablet
Touch
Mouse
```

---

# 四十三、重要要求

开发时必须优先保证：

## 1. 好玩

孩子打开后不用学习规则也知道怎么玩。

## 2. 简单

一个页面只做一件事。

## 3. 动画丰富

任何操作都需要有反馈。

## 4. 声音丰富

单词、句子、按钮、完成都应该有声音反馈。

## 5. 鼓励式设计

不要惩罚孩子。

## 6. 重复学习

让孩子自然重复单词。

## 7. 视觉吸引力

第一眼就应该像儿童游戏，而不是英语学习网站。

---

# 四十四、AI 开发执行要求

现在不要只给出方案。

直接开始创建完整项目。

要求：

1. 创建 Vue 3 + Vite + TypeScript 项目。
2. 完成真实页面。
3. 完成完整游戏流程。
4. 完成拖拽字母。
5. 完成 Touch / Mouse。
6. 完成语音播放。
7. 完成动画。
8. 完成关卡数据。
9. 完成 localStorage。
10. 完成 Collection。
11. 完成响应式。
12. 完成 Vercel 部署配置。
13. 完成 production build。

不要使用：

```text
TODO
Coming Soon
这里以后实现
```

不能只生成静态 UI。

核心游戏必须真正可以玩。

---

# 四十五、最终体验标准

打开网站：

```text
→ 看到可爱角色
→ 点击 LET'S PLAY
→ 进入 CAT
→ 看到猫
→ 听到 CAT
→ 字母飞出来
→ 拖动 C
→ 拖动 A
→ 拖动 T
→ CAT 完成
→ 猫跳起来
→ 播放 CAT
→ 播放 The cat jumps.
→ 出现庆祝动画
→ 自动进入 DOG
```

整个流程应该连续、自然、没有复杂操作。

最终效果目标：

> **“让一个 4 岁孩子第一次打开网页，不需要家长教操作，也能自己玩下去。”**

---

# 四十六、设计底线

牢记：

```text
不是英语题库
不是单词背诵软件
不是课程系统
不是后台管理系统
不是普通 H5 页面
```

而是：

> **一个可以让 4 岁儿童自己玩、自己听、自己拖、自己发现英语单词的互动动画游戏。**

最终视觉和交互体验应该达到：

```text
High-quality preschool game
+
Interactive picture book
+
English phonics / vocabulary learning
+
Playful animation
```

并在此基础上形成自己的原创角色、视觉体系、音效和内容。