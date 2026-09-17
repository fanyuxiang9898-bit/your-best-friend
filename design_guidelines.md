# 设计指南 — "你最好的朋友"性格测试小程序

## 品牌定位
- **应用类型**：治愈系人格测试
- **设计风格**：温暖、沉浸、诗意
- **目标用户**：18-35岁，关注自我探索与情感连接的年轻人

## 配色方案

### 主色板（Tailwind 类名）
| 用途 | 色值 | Tailwind 类名 |
|------|------|---------------|
| 主色-薰衣草紫 | #8B7EC8 | `bg-[#8B7EC8]` → 通过 CSS 变量 |
| 主色-浅紫 | #C4B5E0 | 用于渐变 |
| 辅色-暖珊瑚 | #E8A0BF | 用于渐变和高亮 |
| 辅色-柔粉 | #F5D0E0 | 用于背景渐变 |
| 强调-青碧 | #7EC8B0 | 用于按钮和交互元素 |
| 背景-暖白 | #FFF8F0 | 页面底色 |

### 中性色
- 深文字：`text-gray-800`
- 副文字：`text-gray-500`
- 分割线：`border-gray-200`

### 语义色
- 成功/确认：`text-emerald-500`
- 温暖提示：`text-amber-500`

## 字体规范
- 大标题：`text-2xl font-bold`
- 场景描述：`text-lg font-medium`
- 选项文字：`text-base font-medium`
- 辅助说明：`text-sm text-gray-500`
- 极小提示：`text-xs text-gray-400`

## 间距系统
- 页面水平边距：`px-6`
- 卡片内边距：`p-6`
- 元素间距：`gap-4` 或 `gap-6`
- 紧凑间距：`gap-2` 或 `gap-3`

## 容器样式
- 卡片圆角：`rounded-2xl`
- 按钮圆角：`rounded-full`
- 选项卡片：`rounded-2xl` + `border-2` + 选中时边框变主色
- 阴影：`shadow-sm`（轻量，不喧宾夺主）

## 组件使用原则
- **按钮**：优先使用 `@/components/ui/button`，变体 variant="default" 或自定义渐变
- **卡片**：优先使用 `@/components/ui/card` (Card, CardContent, CardHeader, CardTitle)
- **进度条**：使用 `@/components/ui/progress`
- **徽章/标签**：使用 `@/components/ui/badge`
- **弹窗确认**：使用 `@/components/ui/dialog`
- **轻提示**：使用 `@/components/ui/sonner`
- **通用 UI 组件**：统一优先来自 `@/components/ui/*`，禁止页面内手搓

## 导航结构
无 TabBar，纯线性流程：
1. 首页（落地页 + 答题流程）→ `pages/index/index`
2. 结果页（性格卡片展示）→ `pages/result/index`

页面跳转：`Taro.navigateTo` 到结果页

## 页面视觉节奏
- 落地页：全屏渐变背景 + 居中标题 + 单按钮
- 答题页：顶部进度条 + 中间大字场景 + 底部两个选项卡
- 结果页：渐变卡片翻转展示 + 散点词云

## 空状态/加载态
- 答题中切换：使用 opacity 过渡，不显示独立 loading
- 结果计算中：显示呼吸动画 + "正在解读你的灵魂密码..."文字
- 骨架屏不适用此场景，使用简洁动画替代

## 小程序约束
- 不使用本地图片资源（TabBar 图标除外）
- 图标使用 `lucide-react-taro` 图标库
- 渐变背景使用 CSS gradient（Tailwind 或 inline style）
- 跨端兼容：Text 加 `block`，Input 用 View 包裹，fixed+flex 用 inline style
