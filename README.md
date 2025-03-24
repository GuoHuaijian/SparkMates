# SparkMates | 创意协作平台

一个连接创意、人才和项目的在线协作平台，旨在为用户提供一个在线环境，用于发布创意、寻找合作伙伴、讨论和实现项目。

## 项目名称说明

SparkMates（创意火花伙伴）是一个独特而富有意义的名称：

- **Spark**：代表创意的火花，象征着每一个想法的诞生和激发
- **Mates**：代表伙伴、同伴，强调平台连接志同道合的人共同实现创意的理念

在这个平台上，每一个创意火花都能找到共鸣，汇聚成璀璨星河，让创意不再孤独，而是在协作中绽放光芒。

## 预览

### 在线预览

- **预览地址**: [https://guohuaijian.github.io/app/sparkmates](https://guohuaijian.github.io/app/sparkmates)
- **测试账号**: test@example.com
- **密码**: password

### 预览图片

![首页预览](/public/hero-image.svg)
*主页中的创意火花动画效果，展示创意连接和协作的视觉体验*

![仪表盘欢迎界面](/public/dashboard-welcome.svg)
*用户仪表盘界面，提供个性化的项目和创意管理*

#### 主要页面:

- **首页** - 展示创意火花动画、平台特色和热门创意
- **创意库** - 浏览和发布创意，支持分类筛选和标签查询
- **项目页面** - 查看项目详情，管理任务和协作成员
- **探索页面** - 发现创作者和精选内容，寻找志同道合的伙伴
- **消息中心** - 实时沟通，促进团队协作
- **个人中心** - 管理个人资料、创意和项目

#### 平台亮点

- **创意火花动画** - 视觉化展示创意协作过程，每个火花代表一个创意，多个火花连接形成星河
- **直观的用户界面** - 采用Material UI设计，提供流畅且美观的用户体验
- **多维度连接** - 通过创意、技能、项目多个维度，促进用户之间的连接
- **全方位协作工具** - 提供从创意发布到项目实现的完整工具链

## 功能特点

- 用户系统: 注册、登录、个人主页和消息中心
- 发布系统: 用户可以发布创意或需求，并将其转化为项目
- 搜索与匹配: 关键词搜索和根据用户技能的推荐系统
- 讨论与协作: 评论、实时聊天和任务管理
- 资源共享: 上传与下载项目相关文件
- 评价与反馈: 项目评价和平台反馈提交

## 技术栈

- **前端框架**: Next.js 14
- **UI 库**: Material UI (MUI)
- **状态管理**: React Hooks
- **认证**: NextAuth.js
- **数据获取**: Axios
- **实时通信**: Socket.io
- **表单处理**: React Hook Form
- **样式**: Tailwind CSS

## 开始使用

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装

1. 克隆仓库

```bash
git clone https://github.com/your-username/creativity.git
cd creativity
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 环境配置

创建一个 `.env.local` 文件，参考 `.env.example`:

```
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3000 启动。

## 项目结构

```
src/
  ├── app/                    # 应用页面
  │   ├── (auth)/             # 认证相关页面
  │   ├── dashboard/          # 用户仪表板
  │   ├── ideas/              # 创意相关页面
  │   ├── projects/           # 项目相关页面
  │   ├── profile/            # 用户个人资料
  │   ├── messages/           # 消息页面
  │   └── explore/            # 探索功能
  ├── components/             # 可复用组件
  ├── lib/                    # 库文件和配置
  ├── hooks/                  # 自定义 React Hooks
  ├── services/               # API 服务
  ├── types/                  # TypeScript 类型定义
  └── styles/                 # 全局样式和主题
```

## 数据结构

我们使用TypeScript严格定义了系统中的核心数据结构，确保类型安全和代码质量：

### 主要数据模型

```typescript
// 用户模型
interface User {
    id: string;
    name: string;
    email: string;
    bio: string;
    role: string;
    avatar?: string;
    createdAt: string;
}

// 创意模型
interface Idea {
    id: string;
    title: string;
    description: string;
    userId: string;
    category: string;
    tags: string[];
    visibility: 'PUBLIC' | 'PRIVATE';
    collaborators: string[];
    likes: number;
    views: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
}

// 项目模型
interface Project {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    category: string;
    status: '规划中' | '进行中' | '已完成' | '已暂停';
    progress: number;
    startDate: string;
    endDate: string;
    ideaId: string;
    members: string[];
    tags: string[];
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}
```

## 开发路线图

- [x] 用户认证系统
- [x] 创意管理功能
- [x] 项目管理功能
- [x] 实时消息系统
- [x] 探索页面
- [ ] 高级搜索和推荐算法
- [ ] 评分和反馈系统
- [ ] 协作编辑功能
- [ ] 移动端适配优化
- [ ] 国际化支持

## 贡献指南

1. Fork 该仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull 请求

## 许可证

此项目采用 MIT 许可证 - 详情见 [LICENSE](LICENSE) 文件

## 团队成员

- **项目负责人**: [张三](https://github.com/zhangsan) - 架构设计、技术选型
- **前端开发**: [李四](https://github.com/lisi) - UI/UX设计与实现
- **后端开发**: [王五](https://github.com/wangwu) - API设计与数据库设计
- **产品设计**: [赵六](https://github.com/zhaoliu) - 产品需求与用户体验

## 致谢

- 感谢所有为本项目提供反馈和建议的用户
- 感谢 [Next.js](https://nextjs.org/) 和 [Material UI](https://mui.com/) 团队提供的优秀框架
- 特别感谢 [GitHub](https://github.com) 提供的开源环境

## 联系方式

项目维护者 - [@your-username](https://github.com/your-username)

项目链接: [https://github.com/your-username/creativity](https://github.com/your-username/creativity)
