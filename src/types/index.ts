export interface User {
    id: string;
    name: string;
    email: string;
    bio: string;
    role: string;
    avatar?: string;
    createdAt: string;
    password?: string;
    skills?: string[];
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    userId?: string;
    creatorId?: string;
    category: string;
    tags: string[];
    visibility?: 'PUBLIC' | 'PRIVATE';
    status?: string;
    collaborators: any[];
    likes: number;
    views: number;
    comments: number | any[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
    assigneeId: string;
    description?: string;
    createdAt?: string;
    dueDate?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    category: string;
    status: '规划中' | '进行中' | '已完成' | '已暂停' | 'IN_PROGRESS';
    progress: number;
    startDate?: string;
    endDate?: string;
    ideaId?: string;
    members: any[];
    tags: string[];
    tasks: Task[];
    milestones?: any[];
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    conversationId?: string;
    sender?: string;
    senderId?: string;
    receiverId?: string;
    content: string;
    createdAt: string;
    read?: boolean;
    isRead?: boolean;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage: {
        content: string;
        timestamp: string;
    };
    unreadCount: number;
    online: boolean;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'NEW_COLLABORATOR' | 'COMMENT' | 'TASK_ASSIGNED' | 'LIKE' | 'MESSAGE' |
        'PROJECT_INVITE' | 'IDEA_COMMENT' | 'MILESTONE_COMPLETED' | 'PROJECT_UPDATE';
    content: string;
    relatedId?: string;
    link?: string;
    createdAt: string;
    read?: boolean;
    isRead?: boolean;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
