import axios from 'axios';
import {Comment, Idea, Message, Notification, Project, Task, User} from '@/types';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 用户相关API
export const userApi = {
    getCurrentUser: async (): Promise<User> => {
        const {data} = await api.get('/user');
        return data;
    },
    updateProfile: async (profile: Partial<User>): Promise<User> => {
        const {data} = await api.put('/user', profile);
        return data;
    },
    getUserById: async (id: string): Promise<User> => {
        const {data} = await api.get(`/user/${id}`);
        return data;
    },
};

// 创意相关API
export const ideaApi = {
    getIdeas: async (params?: { category?: string; tags?: string[]; search?: string }): Promise<Idea[]> => {
        const {data} = await api.get('/ideas', {params});
        return data;
    },
    getIdeaById: async (id: string): Promise<Idea> => {
        const {data} = await api.get(`/ideas/${id}`);
        return data;
    },
    createIdea: async (idea: Partial<Idea>): Promise<Idea> => {
        const {data} = await api.post('/ideas', idea);
        return data;
    },
    updateIdea: async (id: string, idea: Partial<Idea>): Promise<Idea> => {
        const {data} = await api.put(`/ideas/${id}`, idea);
        return data;
    },
    deleteIdea: async (id: string): Promise<void> => {
        await api.delete(`/ideas/${id}`);
    },
    likeIdea: async (id: string): Promise<{ likes: number }> => {
        const {data} = await api.post(`/ideas/${id}/like`);
        return data;
    },
    commentOnIdea: async (id: string, comment: { content: string }): Promise<Comment> => {
        const {data} = await api.post(`/ideas/${id}/comments`, comment);
        return data;
    },
};

// 项目相关API
export const projectApi = {
    getProjects: async (params?: { status?: string; category?: string; search?: string }): Promise<Project[]> => {
        const {data} = await api.get('/projects', {params});
        return data;
    },
    getProjectById: async (id: string): Promise<Project> => {
        const {data} = await api.get(`/projects/${id}`);
        return data;
    },
    createProject: async (project: Partial<Project>): Promise<Project> => {
        const {data} = await api.post('/projects', project);
        return data;
    },
    updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
        const {data} = await api.put(`/projects/${id}`, project);
        return data;
    },
    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
    addMember: async (projectId: string, userId: string): Promise<void> => {
        await api.post(`/projects/${projectId}/members`, {userId});
    },
    removeMember: async (projectId: string, userId: string): Promise<void> => {
        await api.delete(`/projects/${projectId}/members/${userId}`);
    },
};

// 任务相关API
export const taskApi = {
    createTask: async (projectId: string, task: Partial<Task>): Promise<Task> => {
        const {data} = await api.post(`/projects/${projectId}/tasks`, task);
        return data;
    },
    updateTask: async (projectId: string, taskId: string, task: Partial<Task>): Promise<Task> => {
        const {data} = await api.put(`/projects/${projectId}/tasks/${taskId}`, task);
        return data;
    },
    deleteTask: async (projectId: string, taskId: string): Promise<void> => {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    },
};

// 消息相关API
export const messageApi = {
    getMessages: async (params?: { userId?: string; projectId?: string }): Promise<Message[]> => {
        const {data} = await api.get('/messages', {params});
        return data;
    },
    sendMessage: async (message: Partial<Message>): Promise<Message> => {
        const {data} = await api.post('/messages', message);
        return data;
    },
    markAsRead: async (messageId: string): Promise<void> => {
        await api.put(`/messages/${messageId}/read`);
    },
};

// 通知相关API
export const notificationApi = {
    getNotifications: async (): Promise<Notification[]> => {
        const {data} = await api.get('/notifications');
        return data;
    },
    markAsRead: async (notificationId: string): Promise<void> => {
        await api.put(`/notifications/${notificationId}/read`);
    },
    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },
};

export default api;
