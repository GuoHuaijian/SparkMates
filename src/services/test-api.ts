'use client';

import {Idea, Message, Notification, Project, User} from '@/types';

// 模拟用户数据
const testUsers: User[] = [
    {
        id: 'user1',
        name: '李明',
        email: 'test@example.com',
        bio: '创意设计师和产品经理，热爱创新和解决问题。',
        role: 'DESIGNER',
        avatar: '/avatars/user1.jpg',
        createdAt: '2023-01-15T08:30:00Z',
    },
    {
        id: 'user2',
        name: '张伟',
        email: 'zhang@example.com',
        bio: '资深软件工程师，专注于Web开发和人工智能应用。',
        role: 'DEVELOPER',
        avatar: '/avatars/user2.jpg',
        createdAt: '2023-02-20T10:15:00Z',
    },
    {
        id: 'user3',
        name: '王芳',
        email: 'wang@example.com',
        bio: '市场营销专家，擅长品牌策略和用户增长。',
        role: 'MARKETER',
        avatar: '/avatars/user3.jpg',
        createdAt: '2023-03-10T14:45:00Z',
    },
    {
        id: 'user4',
        name: '赵静',
        email: 'zhao@example.com',
        bio: '内容创作者，专注于讲述引人入胜的故事和视频制作。',
        role: 'CONTENT_CREATOR',
        avatar: '/avatars/user4.jpg',
        createdAt: '2023-04-05T09:20:00Z',
    },
    {
        id: 'user5',
        name: '陈强',
        email: 'chen@example.com',
        bio: '项目管理专家，擅长团队协作和资源优化。',
        role: 'PROJECT_MANAGER',
        avatar: '/avatars/user5.jpg',
        createdAt: '2023-05-12T11:30:00Z',
    },
];

// 模拟创意库数据
const testIdeas: Idea[] = [
    {
        id: 'idea1',
        title: '智能家居控制中心',
        description: '开发一个集成所有智能家居设备的控制中心，通过AI助手实现语音和自动化控制，提高生活便利性。',
        userId: 'user1',
        category: '科技',
        tags: ['智能家居', 'AI', '自动化'],
        visibility: 'PUBLIC',
        collaborators: ['user2', 'user3'],
        likes: 42,
        views: 156,
        comments: 15,
        createdAt: '2023-06-15T08:30:00Z',
        updatedAt: '2023-06-15T08:30:00Z',
    },
    {
        id: 'idea2',
        title: '可持续时尚电商平台',
        description: '创建一个专注于可持续和道德时尚的电商平台，连接环保品牌与意识消费者，并提供透明的供应链信息。',
        userId: 'user3',
        category: '时尚',
        tags: ['可持续发展', '电商', '道德消费'],
        visibility: 'PUBLIC',
        collaborators: ['user4'],
        likes: 35,
        views: 128,
        comments: 9,
        createdAt: '2023-06-18T10:15:00Z',
        updatedAt: '2023-06-18T10:15:00Z',
    },
    {
        id: 'idea3',
        title: '社区农业连接应用',
        description: '开发一个应用，连接本地农民与消费者，促进农产品直销，减少食物里程，支持社区农业发展。',
        userId: 'user2',
        category: '农业',
        tags: ['本地农业', '可持续发展', '社区支持'],
        visibility: 'PUBLIC',
        collaborators: ['user5'],
        likes: 28,
        views: 112,
        comments: 14,
        createdAt: '2023-06-20T14:45:00Z',
        updatedAt: '2023-06-21T09:30:00Z',
    },
    {
        id: 'idea4',
        title: '学习技能交换平台',
        description: '创建一个平台，让用户可以交换技能学习时间，例如语言交换、音乐课程交换等，促进社区学习和文化交流。',
        userId: 'user5',
        category: '教育',
        tags: ['技能交换', '社区学习', '知识共享'],
        visibility: 'PUBLIC',
        collaborators: [],
        likes: 22,
        views: 95,
        comments: 7,
        createdAt: '2023-06-22T09:20:00Z',
        updatedAt: '2023-06-22T09:20:00Z',
    },
    {
        id: 'idea5',
        title: '心理健康追踪和支持应用',
        description: '开发一个应用，帮助用户追踪情绪变化，提供个性化的心理健康建议，并在需要时连接专业咨询师。',
        userId: 'user4',
        category: '健康',
        tags: ['心理健康', '自我照顾', '健康科技'],
        visibility: 'PRIVATE',
        collaborators: ['user1'],
        likes: 19,
        views: 82,
        comments: 5,
        createdAt: '2023-06-25T11:30:00Z',
        updatedAt: '2023-06-26T15:45:00Z',
    },
    {
        id: 'idea6',
        title: '城市绿化众筹平台',
        description: '创建一个平台，让市民可以为当地的城市绿化项目众筹，并参与规划和实施过程，增加城市绿地和可持续性。',
        userId: 'user1',
        category: '环境',
        tags: ['城市绿化', '众筹', '社区参与'],
        visibility: 'PUBLIC',
        collaborators: ['user2', 'user5'],
        likes: 31,
        views: 118,
        comments: 12,
        createdAt: '2023-06-28T16:20:00Z',
        updatedAt: '2023-06-29T10:10:00Z',
    },
];

// 模拟项目数据
const testProjects: Project[] = [
    {
        id: 'project1',
        title: '智能家居控制系统开发',
        description: '基于创意"智能家居控制中心"，我们正在开发一个集成所有智能家居设备的控制系统，通过AI助手实现语音和自动化控制。',
        creatorId: 'user1',
        category: '科技开发',
        status: '进行中',
        progress: 65,
        startDate: '2023-07-01T00:00:00Z',
        endDate: '2023-10-30T00:00:00Z',
        ideaId: 'idea1',
        members: ['user1', 'user2', 'user3'],
        tags: ['智能家居', 'AI', '软件开发'],
        tasks: [
            {id: 'task1', title: '系统架构设计', status: 'COMPLETED', assigneeId: 'user2'},
            {id: 'task2', title: '前端界面开发', status: 'IN_PROGRESS', assigneeId: 'user1'},
            {id: 'task3', title: 'AI语音识别集成', status: 'PLANNED', assigneeId: 'user3'},
        ],
        createdAt: '2023-07-01T09:00:00Z',
        updatedAt: '2023-08-15T14:30:00Z',
    },
    {
        id: 'project2',
        title: '可持续时尚品牌孵化',
        description: '基于创意"可持续时尚电商平台"，我们正在孵化3个可持续时尚品牌，并开发线上销售渠道，推广环保理念。',
        creatorId: 'user3',
        category: '时尚创业',
        status: '规划中',
        progress: 25,
        startDate: '2023-08-01T00:00:00Z',
        endDate: '2024-02-28T00:00:00Z',
        ideaId: 'idea2',
        members: ['user3', 'user4', 'user5'],
        tags: ['可持续时尚', '品牌建设', '电商'],
        tasks: [
            {id: 'task4', title: '市场调研', status: 'COMPLETED', assigneeId: 'user3'},
            {id: 'task5', title: '品牌策略制定', status: 'IN_PROGRESS', assigneeId: 'user4'},
            {id: 'task6', title: '供应商筛选', status: 'PLANNED', assigneeId: 'user5'},
        ],
        createdAt: '2023-08-01T10:15:00Z',
        updatedAt: '2023-08-20T16:45:00Z',
    },
    {
        id: 'project3',
        title: '社区农业网络构建',
        description: '基于创意"社区农业连接应用"，我们正在建立一个连接当地农民与消费者的网络，促进有机农产品直销。',
        creatorId: 'user2',
        category: '农业创新',
        status: '进行中',
        progress: 45,
        startDate: '2023-07-15T00:00:00Z',
        endDate: '2023-12-15T00:00:00Z',
        ideaId: 'idea3',
        members: ['user2', 'user5', 'user1'],
        tags: ['社区农业', '本地食品', '可持续发展'],
        tasks: [
            {id: 'task7', title: '农民需求调研', status: 'COMPLETED', assigneeId: 'user5'},
            {id: 'task8', title: '平台原型设计', status: 'COMPLETED', assigneeId: 'user1'},
            {id: 'task9', title: '初步农民网络建设', status: 'IN_PROGRESS', assigneeId: 'user2'},
        ],
        createdAt: '2023-07-15T08:30:00Z',
        updatedAt: '2023-08-10T11:20:00Z',
    },
    {
        id: 'project4',
        title: '心理健康应用开发',
        description: '基于创意"心理健康追踪和支持应用"，我们正在开发一款情绪追踪应用，帮助用户了解和改善心理健康状态。',
        creatorId: 'user4',
        category: '健康科技',
        status: '已完成',
        progress: 100,
        startDate: '2023-06-01T00:00:00Z',
        endDate: '2023-08-31T00:00:00Z',
        ideaId: 'idea5',
        members: ['user4', 'user1', 'user2'],
        tags: ['心理健康', '应用开发', '健康科技'],
        tasks: [
            {id: 'task10', title: '用户研究', status: 'COMPLETED', assigneeId: 'user4'},
            {id: 'task11', title: '应用设计和开发', status: 'COMPLETED', assigneeId: 'user2'},
            {id: 'task12', title: '心理健康专家咨询', status: 'COMPLETED', assigneeId: 'user1'},
        ],
        createdAt: '2023-06-01T14:00:00Z',
        updatedAt: '2023-08-31T09:45:00Z',
    },
    {
        id: 'project5',
        title: '技能交换平台测试',
        description: '基于创意"学习技能交换平台"，我们正在测试一个允许用户交换技能学习时间的平台原型，收集用户反馈。',
        creatorId: 'user5',
        category: '教育创新',
        status: '进行中',
        progress: 80,
        startDate: '2023-08-15T00:00:00Z',
        endDate: '2023-09-30T00:00:00Z',
        ideaId: 'idea4',
        members: ['user5', 'user3'],
        tags: ['技能交换', '平台测试', '教育科技'],
        tasks: [
            {id: 'task13', title: '平台设计', status: 'COMPLETED', assigneeId: 'user5'},
            {id: 'task14', title: '原型开发', status: 'COMPLETED', assigneeId: 'user3'},
            {id: 'task15', title: '用户测试', status: 'IN_PROGRESS', assigneeId: 'user5'},
        ],
        createdAt: '2023-08-15T11:30:00Z',
        updatedAt: '2023-09-10T15:20:00Z',
    },
];

// 模拟消息数据
const testMessages: Message[] = [
    {
        id: 'msg1',
        conversationId: 'conv1',
        sender: 'user2',
        content: '你好，关于智能家居项目，我们需要讨论一下接口设计问题。',
        createdAt: '2023-08-20T09:15:00Z',
        read: true
    },
    {
        id: 'msg2',
        conversationId: 'conv1',
        sender: 'user1',
        content: '没问题，我已经准备了一些想法。你什么时候有空？',
        createdAt: '2023-08-20T09:20:00Z',
        read: true
    },
    {
        id: 'msg3',
        conversationId: 'conv1',
        sender: 'user2',
        content: '今天下午3点如何？我们可以线上会议讨论。',
        createdAt: '2023-08-20T09:25:00Z',
        read: true
    },
    {
        id: 'msg4',
        conversationId: 'conv1',
        sender: 'user1',
        content: '3点可以，我会发会议链接给你。',
        createdAt: '2023-08-20T09:30:00Z',
        read: true
    },
    {
        id: 'msg5',
        conversationId: 'conv2',
        sender: 'user3',
        content: '嗨，关于可持续时尚品牌的市场定位，你有什么建议？',
        createdAt: '2023-08-21T10:15:00Z',
        read: false
    },
    {
        id: 'msg6',
        conversationId: 'conv2',
        sender: 'user4',
        content: '我认为我们应该定位于25-35岁的环保意识较强的年轻专业人士。',
        createdAt: '2023-08-21T10:20:00Z',
        read: false
    },
    {
        id: 'msg7',
        conversationId: 'conv3',
        sender: 'user5',
        content: '社区农业项目的调研报告已经完成，你要看一下吗？',
        createdAt: '2023-08-22T14:30:00Z',
        read: false
    },
    {
        id: 'msg8',
        conversationId: 'conv3',
        sender: 'user2',
        content: '当然，请分享给我。我们需要基于这个报告调整我们的策略。',
        createdAt: '2023-08-22T14:35:00Z',
        read: true
    },
];

// 模拟对话数据
const testConversations = [
    {
        id: 'conv1',
        participants: [
            testUsers.find(u => u.id === 'user1')!,
            testUsers.find(u => u.id === 'user2')!
        ],
        lastMessage: {
            content: '3点可以，我会发会议链接给你。',
            timestamp: '2023-08-20T09:30:00Z'
        },
        unreadCount: 0,
        online: true
    },
    {
        id: 'conv2',
        participants: [
            testUsers.find(u => u.id === 'user3')!,
            testUsers.find(u => u.id === 'user4')!
        ],
        lastMessage: {
            content: '我认为我们应该定位于25-35岁的环保意识较强的年轻专业人士。',
            timestamp: '2023-08-21T10:20:00Z'
        },
        unreadCount: 2,
        online: false
    },
    {
        id: 'conv3',
        participants: [
            testUsers.find(u => u.id === 'user2')!,
            testUsers.find(u => u.id === 'user5')!
        ],
        lastMessage: {
            content: '当然，请分享给我。我们需要基于这个报告调整我们的策略。',
            timestamp: '2023-08-22T14:35:00Z'
        },
        unreadCount: 1,
        online: true
    }
];

// 模拟通知数据
const testNotifications: Notification[] = [
    {
        id: 'notif1',
        userId: 'user1',
        type: 'NEW_COLLABORATOR',
        content: '张伟加入了您的项目"智能家居控制系统开发"',
        relatedId: 'project1',
        createdAt: '2023-08-15T09:00:00Z',
        read: false
    },
    {
        id: 'notif2',
        userId: 'user1',
        type: 'COMMENT',
        content: '张伟在您的创意"智能家居控制中心"上发表了评论',
        relatedId: 'idea1',
        createdAt: '2023-08-16T10:30:00Z',
        read: true
    },
    {
        id: 'notif3',
        userId: 'user1',
        type: 'TASK_ASSIGNED',
        content: '您被分配了任务"前端界面开发"',
        relatedId: 'task2',
        createdAt: '2023-08-17T11:15:00Z',
        read: false
    },
    {
        id: 'notif4',
        userId: 'user1',
        type: 'LIKE',
        content: '王芳赞了您的创意"智能家居控制中心"',
        relatedId: 'idea1',
        createdAt: '2023-08-18T14:20:00Z',
        read: false
    }
];

// API实现
export const UsersTestApi = {
    getById: async (id: string): Promise<User | null> => {
        const user = testUsers.find(user => user.id === id);
        return user ? {...user} : null;
    },

    login: async (email: string, password: string): Promise<User | null> => {
        // 简单测试登录，任何邮箱都可以，密码为"password"
        if (password !== 'password') return null;
        const user = testUsers.find(user => user.email === email);
        return user ? {...user} : null;
    },

    register: async (userData: Partial<User>): Promise<User> => {
        // 简单测试注册
        const newUser: User = {
            id: `user${testUsers.length + 1}`,
            name: userData.name || 'New User',
            email: userData.email || `user${testUsers.length + 1}@example.com`,
            bio: userData.bio || '',
            role: userData.role || 'USER',
            avatar: userData.avatar || '',
            createdAt: new Date().toISOString(),
        };

        // 在真实应用中会保存到数据库
        return {...newUser};
    }
};

export const IdeasTestApi = {
    getAll: async (): Promise<Idea[]> => {
        return [...testIdeas];
    },

    getById: async (id: string): Promise<Idea | null> => {
        const idea = testIdeas.find(idea => idea.id === id);
        return idea ? {...idea} : null;
    },

    getByUser: async (userId: string): Promise<Idea[]> => {
        const userIdeas = testIdeas.filter(
            idea => idea.userId === userId || idea.collaborators.includes(userId)
        );
        return [...userIdeas];
    },

    create: async (ideaData: Partial<Idea>): Promise<Idea> => {
        const newIdea: Idea = {
            id: `idea${testIdeas.length + 1}`,
            title: ideaData.title || 'New Idea',
            description: ideaData.description || '',
            userId: ideaData.userId || 'user1',
            category: ideaData.category || 'Other',
            tags: ideaData.tags || [],
            visibility: ideaData.visibility || 'PRIVATE',
            collaborators: ideaData.collaborators || [],
            likes: 0,
            views: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // 在真实应用中会保存到数据库
        return {...newIdea};
    }
};

export const ProjectsTestApi = {
    getAll: async (): Promise<Project[]> => {
        return [...testProjects];
    },

    getById: async (id: string): Promise<Project | null> => {
        const project = testProjects.find(project => project.id === id);
        return project ? {...project} : null;
    },

    getByUser: async (userId: string): Promise<Project[]> => {
        const userProjects = testProjects.filter(
            project => project.creatorId === userId || project.members.includes(userId)
        );
        return [...userProjects];
    },

    create: async (projectData: Partial<Project>): Promise<Project> => {
        const newProject: Project = {
            id: `project${testProjects.length + 1}`,
            title: projectData.title || 'New Project',
            description: projectData.description || '',
            creatorId: projectData.creatorId || 'user1',
            category: projectData.category || 'Other',
            status: projectData.status || '规划中',
            progress: projectData.progress || 0,
            startDate: projectData.startDate || new Date().toISOString(),
            endDate: projectData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            ideaId: projectData.ideaId || '',
            members: projectData.members || [],
            tags: projectData.tags || [],
            tasks: projectData.tasks || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // 在真实应用中会保存到数据库
        return {...newProject};
    }
};

export const MessagesTestApi = {
    getMessages: async (userId: string): Promise<Message[]> => {
        const userMessages = testMessages.filter(
            msg => msg.sender === userId ||
                testConversations.some(conv =>
                    conv.id === msg.conversationId &&
                    conv.participants.some(p => p.id === userId)
                )
        );
        return [...userMessages];
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const unreadCount = testMessages.filter(
            msg => msg.sender !== userId && !msg.read &&
                testConversations.some(conv =>
                    conv.id === msg.conversationId &&
                    conv.participants.some(p => p.id === userId)
                )
        ).length;
        return unreadCount;
    },

    sendMessage: async (message: Partial<Message>): Promise<Message> => {
        const newMessage: Message = {
            id: `msg${testMessages.length + 1}`,
            conversationId: message.conversationId || 'conv1',
            sender: message.sender || 'user1',
            content: message.content || '',
            createdAt: new Date().toISOString(),
            read: false
        };

        // 在真实应用中会保存到数据库
        return {...newMessage};
    },

    // 新增 - 获取所有对话
    getConversations: async (): Promise<any[]> => {
        return [...testConversations];
    },

    // 新增 - 获取特定对话的消息
    getMessagesByConversation: async (conversationId: string): Promise<Message[]> => {
        const conversationMessages = testMessages.filter(
            msg => msg.conversationId === conversationId
        );
        return [...conversationMessages];
    },
};

export const NotificationsTestApi = {
    getByUser: async (userId: string): Promise<Notification[]> => {
        const userNotifications = testNotifications.filter(
            notification => notification.userId === userId
        );
        return [...userNotifications];
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const unreadCount = testNotifications.filter(
            notification => notification.userId === userId && !notification.read
        ).length;
        return unreadCount;
    },

    markAsRead: async (notificationId: string): Promise<boolean> => {
        // 在真实应用中会更新数据库
        return true;
    }
};
