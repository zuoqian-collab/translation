# Translation Manager

多语言翻译管理工具 - 作为多端翻译的唯一事实来源

## 功能特性

- 📋 管理功能的多语言文案
- 🌍 支持 3 种语言（英文、简中、繁中）
- 📅 版本号和日期追踪
- 🔍 搜索和筛选功能
- 📤 导出为 JSON/CSV 格式
- ☁️ Supabase 云数据库存储

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并创建账号
2. 点击 "New Project" 创建新项目
3. 等待项目初始化完成

### 2. 创建数据库表

在 Supabase Dashboard 中：
1. 点击左侧 "SQL Editor"
2. 复制 `supabase-schema.sql` 文件内容
3. 点击 "Run" 执行

### 3. 获取 API 密钥

在 Supabase Dashboard 中：
1. 点击左侧 "Settings" → "API"
2. 复制 `Project URL` 和 `anon public` 密钥

### 4. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon公钥
```

### 5. 启动开发服务器

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到 Vercel

### 方法一：通过 GitHub

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Environment Variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 点击 Deploy

### 方法二：Vercel CLI

```bash
npm i -g vercel
vercel
```

部署时会提示配置环境变量。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)

## 项目结构

```
translation-manager/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── feature/           # 功能详情和编辑页面
│   └── page.tsx           # 首页
├── components/            # React 组件
├── lib/                   # 工具函数和类型定义
│   ├── supabase.ts       # Supabase 客户端
│   ├── data.ts           # 数据访问层
│   └── types.ts          # TypeScript 类型
├── supabase-schema.sql   # 数据库表结构
└── README.md
```
