import {io, Socket} from 'socket.io-client';
import {Message, Notification} from '@/types';

let socket: Socket;

export const initializeSocket = (token: string) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
            auth: {
                token,
            },
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

// 项目聊天消息监听
export const subscribeToProjectChat = (projectId: string, callback: (message: Message) => void) => {
    if (!socket) return;

    socket.on(`chat:${projectId}`, callback);

    return () => {
        socket.off(`chat:${projectId}`, callback);
    };
};

// 发送项目聊天消息
export const sendProjectMessage = (projectId: string, content: string) => {
    if (!socket) return;

    socket.emit('chat:send', {
        projectId,
        content,
    });
};

// 私人消息监听
export const subscribeToPrivateMessages = (userId: string, callback: (message: Message) => void) => {
    if (!socket) return;

    socket.on(`message:${userId}`, callback);

    return () => {
        socket.off(`message:${userId}`, callback);
    };
};

// 发送私人消息
export const sendPrivateMessage = (receiverId: string, content: string) => {
    if (!socket) return;

    socket.emit('message:send', {
        receiverId,
        content,
    });
};

// 通知监听
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
    if (!socket) return;

    socket.on('notification', callback);

    return () => {
        socket.off('notification', callback);
    };
};

// 在线状态监听
export const subscribeToUserStatus = (callback: (data: { userId: string; online: boolean }) => void) => {
    if (!socket) return;

    socket.on('user:status', callback);

    return () => {
        socket.off('user:status', callback);
    };
};

export default {
    initializeSocket,
    disconnectSocket,
    subscribeToProjectChat,
    sendProjectMessage,
    subscribeToPrivateMessages,
    sendPrivateMessage,
    subscribeToNotifications,
    subscribeToUserStatus,
};
