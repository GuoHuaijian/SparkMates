import {Idea, Message, Notification, Project, User} from '@/types';

// 测试用户数据
export const users: User[] = [
    {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        password: 'password123', // 实际应用中应该使用加密密码
        bio: '资深产品经理，热爱创新科技，对人工智能和可穿戴设备有专业研究',
        skills: ['产品管理', '用户体验', '市场分析', '需求分析'],
        avatar: '/avatars/user1.jpg',
        createdAt: new Date('2023-01-01').toISOString(),
        role: 'product_manager',
    },
    {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        password: 'password123',
        bio: 'UI/UX 设计师，专注于移动应用设计，拥有5年互联网公司工作经验',
        skills: ['UI设计', 'UX设计', '原型设计', 'Figma'],
        avatar: '/avatars/user2.jpg',
        createdAt: new Date('2023-01-15').toISOString(),
        role: 'designer',
    },
    {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        password: 'password123',
        bio: '全栈开发工程师，精通前后端技术，对新技术有强烈兴趣',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        avatar: '/avatars/user3.jpg',
        createdAt: new Date('2023-02-01').toISOString(),
        role: 'developer',
    },
    {
        id: '4',
        name: '赵六',
        email: 'zhaoliu@example.com',
        password: 'password123',
        bio: '市场营销专家，擅长社交媒体营销和内容策划',
        skills: ['市场营销', '内容创作', '社媒运营', '品牌推广'],
        avatar: '/avatars/user4.jpg',
        createdAt: new Date('2023-02-15').toISOString(),
        role: 'marketer',
    },
    {
        id: '5',
        name: '孙七',
        email: 'sunqi@example.com',
        password: 'password123',
        bio: '视觉设计师，专注品牌形象设计和视频制作',
        skills: ['视觉设计', 'After Effects', 'Photoshop', '品牌设计'],
        avatar: '/avatars/user5.jpg',
        createdAt: new Date('2023-03-01').toISOString(),
        role: 'designer',
    },
];

// 测试创意数据
export const ideas: Idea[] = [
    {
        id: '1',
        title: '智能家居助手应用',
        description: '开发一款智能家居助手应用，使用户能够通过手机集中控制家中的智能设备，并提供智能场景建议。',
        creatorId: '1',
        category: '移动应用',
        tags: ['智能家居', 'IoT', '移动应用'],
        status: 'OPEN',
        likes: 18,
        views: 75,
        collaborators: [],
        comments: [
            {
                id: '101',
                userId: '3',
                content: '这个想法很有潜力，需要考虑如何解决不同品牌设备的兼容性问题。',
                createdAt: new Date('2023-04-05').toISOString(),
            },
            {
                id: '102',
                userId: '2',
                content: '用户界面设计对这类应用至关重要，需要简洁直观。',
                createdAt: new Date('2023-04-06').toISOString(),
            },
        ],
        createdAt: new Date('2023-04-01').toISOString(),
        updatedAt: new Date('2023-04-01').toISOString(),
    },
    {
        id: '2',
        title: '社区共享技能平台',
        description: '创建一个社区共享技能平台，让人们可以互相教授技能，交换服务，促进社区互助。',
        creatorId: '4',
        category: '社交平台',
        tags: ['社区', '技能共享', '互助'],
        status: 'OPEN',
        likes: 24,
        views: 92,
        collaborators: [
            {
                userId: '5',
                role: '视觉设计',
            },
        ],
        comments: [
            {
                id: '103',
                userId: '1',
                content: '这个平台如何确保服务质量和用户安全？',
                createdAt: new Date('2023-04-18').toISOString(),
            },
        ],
        createdAt: new Date('2023-04-15').toISOString(),
        updatedAt: new Date('2023-04-15').toISOString(),
    },
    {
        id: '3',
        title: '可持续发展教育游戏',
        description: '开发一款针对儿童的教育游戏，通过游戏化方式教授可持续发展理念和环保知识。',
        creatorId: '2',
        category: '教育',
        tags: ['教育游戏', '可持续发展', '环保'],
        status: 'IN_PROGRESS',
        likes: 32,
        views: 103,
        collaborators: [
            {
                userId: '3',
                role: '开发',
            },
            {
                userId: '5',
                role: '视觉设计',
            },
        ],
        comments: [
            {
                id: '104',
                userId: '1',
                content: '建议增加社交元素，让孩子们可以分享自己的环保成就。',
                createdAt: new Date('2023-05-03').toISOString(),
            },
            {
                id: '105',
                userId: '4',
                content: '如何平衡游戏乐趣和教育内容是关键。',
                createdAt: new Date('2023-05-05').toISOString(),
            },
        ],
        createdAt: new Date('2023-05-01').toISOString(),
        updatedAt: new Date('2023-05-01').toISOString(),
    },
    {
        id: '4',
        title: '个人财务管理工具',
        description: '开发一款直观易用的个人财务管理工具，帮助用户追踪支出、收入和投资，提供财务分析和建议。',
        creatorId: '3',
        category: '工具',
        tags: ['财务管理', '个人理财', '数据分析'],
        status: 'OPEN',
        likes: 15,
        views: 68,
        collaborators: [],
        comments: [
            {
                id: '106',
                userId: '1',
                content: '数据安全和隐私保护是此类应用的重要考虑因素。',
                createdAt: new Date('2023-05-22').toISOString(),
            },
        ],
        createdAt: new Date('2023-05-20').toISOString(),
        updatedAt: new Date('2023-05-20').toISOString(),
    },
    {
        id: '5',
        title: '健康饮食配餐规划应用',
        description: '设计一款基于用户健康目标和饮食偏好的个性化配餐规划应用，提供健康食谱和营养分析。',
        creatorId: '5',
        category: '健康',
        tags: ['健康', '饮食', '个性化'],
        status: 'OPEN',
        likes: 27,
        views: 89,
        collaborators: [
            {
                userId: '2',
                role: 'UI设计',
            },
        ],
        comments: [
            {
                id: '107',
                userId: '4',
                content: '市场上有许多类似应用，需要找到差异化卖点。',
                createdAt: new Date('2023-06-05').toISOString(),
            },
            {
                id: '108',
                userId: '3',
                content: '建议整合食材采购功能，提高实用性。',
                createdAt: new Date('2023-06-07').toISOString(),
            },
        ],
        createdAt: new Date('2023-06-01').toISOString(),
        updatedAt: new Date('2023-06-01').toISOString(),
    },
];

// 测试项目数据
export const projects: Project[] = [
    {
        id: '1',
        title: '智能家居助手应用',
        description: '开发一款智能家居助手应用，使用户能够通过手机集中控制家中的智能设备，并提供智能场景建议。',
        ideaId: '1',
        creatorId: '1',
        status: 'IN_PROGRESS',
        progress: 35,
        category: '移动应用',
        tags: ['智能家居', 'IoT', '移动应用'],
        members: [
            {
                userId: '1',
                role: '产品经理',
            },
            {
                userId: '2',
                role: 'UI设计师',
            },
            {
                userId: '3',
                role: '开发工程师',
            },
        ],
        tasks: [
            {
                id: '201',
                title: '需求分析与规划',
                description: '分析市场需求，确定产品功能范围和开发计划',
                assigneeId: '1',
                status: 'COMPLETED',
                createdAt: new Date('2023-04-10').toISOString(),
                dueDate: new Date('2023-04-20').toISOString(),
            },
            {
                id: '202',
                title: '用户界面设计',
                description: '设计应用的用户界面，包括设备控制面板和场景设置页面',
                assigneeId: '2',
                status: 'IN_PROGRESS',
                createdAt: new Date('2023-04-21').toISOString(),
                dueDate: new Date('2023-05-05').toISOString(),
            },
            {
                id: '203',
                title: '后端架构开发',
                description: '开发支持多设备连接和控制的后端服务',
                assigneeId: '3',
                status: 'NOT_STARTED',
                createdAt: new Date('2023-04-21').toISOString(),
                dueDate: new Date('2023-05-20').toISOString(),
            },
        ],
        milestones: [
            {
                id: '301',
                title: '产品原型完成',
                description: '完成产品交互原型和基本设计',
                status: 'COMPLETED',
                dueDate: new Date('2023-05-01').toISOString(),
            },
            {
                id: '302',
                title: '应用测试版发布',
                description: '发布应用测试版，开始内部测试',
                status: 'NOT_STARTED',
                dueDate: new Date('2023-06-15').toISOString(),
            },
        ],
        createdAt: new Date('2023-04-10').toISOString(),
        updatedAt: new Date('2023-04-10').toISOString(),
    },
    {
        id: '2',
        title: '可持续发展教育游戏',
        description: '开发一款针对儿童的教育游戏，通过游戏化方式教授可持续发展理念和环保知识。',
        ideaId: '3',
        creatorId: '2',
        status: 'IN_PROGRESS',
        progress: 50,
        category: '教育',
        tags: ['教育游戏', '可持续发展', '环保'],
        members: [
            {
                userId: '2',
                role: '设计主管',
            },
            {
                userId: '3',
                role: '开发工程师',
            },
            {
                userId: '5',
                role: '视觉设计师',
            },
        ],
        tasks: [
            {
                id: '204',
                title: '游戏概念设计',
                description: '设计游戏核心玩法和教育内容',
                assigneeId: '2',
                status: 'COMPLETED',
                createdAt: new Date('2023-05-05').toISOString(),
                dueDate: new Date('2023-05-15').toISOString(),
            },
            {
                id: '205',
                title: '角色和场景设计',
                description: '设计游戏角色和环境场景',
                assigneeId: '5',
                status: 'COMPLETED',
                createdAt: new Date('2023-05-16').toISOString(),
                dueDate: new Date('2023-05-30').toISOString(),
            },
            {
                id: '206',
                title: '游戏核心功能开发',
                description: '开发游戏核心功能和互动系统',
                assigneeId: '3',
                status: 'IN_PROGRESS',
                createdAt: new Date('2023-06-01').toISOString(),
                dueDate: new Date('2023-06-20').toISOString(),
            },
        ],
        milestones: [
            {
                id: '303',
                title: '游戏设计文档完成',
                description: '完成游戏设计文档和资源规划',
                status: 'COMPLETED',
                dueDate: new Date('2023-05-20').toISOString(),
            },
            {
                id: '304',
                title: '游戏测试版发布',
                description: '发布游戏测试版，收集反馈',
                status: 'NOT_STARTED',
                dueDate: new Date('2023-07-01').toISOString(),
            },
        ],
        createdAt: new Date('2023-05-05').toISOString(),
        updatedAt: new Date('2023-05-05').toISOString(),
    },
];

// 测试消息数据
export const messages: Message[] = [
    {
        id: '1',
        senderId: '1',
        receiverId: '2',
        content: '你好，我看了你的设计作品集，对你的风格很感兴趣，想邀请你参与我的智能家居应用项目。',
        isRead: true,
        createdAt: new Date('2023-04-05').toISOString(),
    },
    {
        id: '2',
        senderId: '2',
        receiverId: '1',
        content: '谢谢关注！我很有兴趣了解更多关于这个项目的信息。',
        isRead: true,
        createdAt: new Date('2023-04-05').toISOString(),
    },
    {
        id: '3',
        senderId: '1',
        receiverId: '2',
        content: '太好了！这个项目主要是开发一款智能家居控制应用，需要直观的UI设计。我们可以安排时间详细讨论一下吗？',
        isRead: true,
        createdAt: new Date('2023-04-06').toISOString(),
    },
    {
        id: '4',
        senderId: '2',
        receiverId: '1',
        content: '没问题，我这周五下午有空，可以安排视频会议吗？',
        isRead: false,
        createdAt: new Date('2023-04-06').toISOString(),
    },
    {
        id: '5',
        senderId: '3',
        receiverId: '1',
        content: '我看到了你的智能家居应用项目，我有丰富的IoT开发经验，很有兴趣参与。',
        isRead: false,
        createdAt: new Date('2023-04-07').toISOString(),
    },
];

// 测试通知数据
export const notifications: Notification[] = [
    {
        id: '1',
        userId: '1',
        type: 'PROJECT_INVITE',
        content: '李四邀请您加入项目"可持续发展教育游戏"',
        isRead: false,
        createdAt: new Date('2023-05-06').toISOString(),
        link: '/projects/2',
    },
    {
        id: '2',
        userId: '1',
        type: 'IDEA_COMMENT',
        content: '王五评论了您的创意"智能家居助手应用"',
        isRead: true,
        createdAt: new Date('2023-04-05').toISOString(),
        link: '/ideas/1',
    },
    {
        id: '3',
        userId: '1',
        type: 'TASK_ASSIGNED',
        content: '您有一个新的任务"市场需求调研"需要完成',
        isRead: false,
        createdAt: new Date('2023-04-11').toISOString(),
        link: '/projects/1/tasks/204',
    },
    {
        id: '4',
        userId: '1',
        type: 'MILESTONE_COMPLETED',
        content: '项目"智能家居助手应用"的里程碑"产品原型完成"已达成',
        isRead: false,
        createdAt: new Date('2023-05-01').toISOString(),
        link: '/projects/1',
    },
    {
        id: '5',
        userId: '2',
        type: 'PROJECT_UPDATE',
        content: '项目"可持续发展教育游戏"有新的更新',
        isRead: false,
        createdAt: new Date('2023-05-20').toISOString(),
        link: '/projects/2',
    },
];

// 获取当前用户名下的所有数据
export const getUserData = (userId: string) => {
    const userData = {
        user: users.find(user => user.id === userId),
        ideas: ideas.filter(idea => idea.creatorId === userId),
        projects: projects.filter(project =>
            project.creatorId === userId ||
            project.members.some(member => member.userId === userId)
        ),
        messages: messages.filter(message =>
            message.receiverId === userId ||
            message.senderId === userId
        ),
        notifications: notifications.filter(notification =>
            notification.userId === userId
        ),
        // 获取未读消息数
        unreadMessagesCount: messages.filter(
            message => message.receiverId === userId && !message.isRead
        ).length,
        // 获取未读通知数
        unreadNotificationsCount: notifications.filter(
            notification => notification.userId === userId && !notification.isRead
        ).length,
    };

    return userData;
};
