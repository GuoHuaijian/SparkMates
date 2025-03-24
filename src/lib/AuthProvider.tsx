'use client';

import React, {createContext, useContext, useState} from 'react';
import {useRouter} from 'next/navigation';
import {User} from '@/types';
import {UsersTestApi} from '@/services/test-api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            // 使用测试API进行登录
            const userData = await UsersTestApi.login(email, password);

            if (!userData) {
                throw new Error('邮箱或密码错误');
            }

            setUser(userData);

            // 登录成功后重定向到仪表板
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('登录失败'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            // 使用测试API进行注册
            const newUser = await UsersTestApi.register({
                name,
                email,
                bio: '',
                role: 'USER',
            });

            setUser(newUser);

            // 注册成功后重定向到仪表板
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('注册失败'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        router.push('/');
    };

    const updateUser = async (data: Partial<User>) => {
        try {
            if (!user) return;

            // 在真实应用中,这里应该调用API更新用户信息
            // 目前我们简单地合并更新
            const updatedUser = {
                ...user,
                ...data,
            };

            setUser(updatedUser);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('更新用户信息失败'));
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
