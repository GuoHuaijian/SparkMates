'use client';

import {users} from './test-data';

/**
 * 模拟登录验证
 * @param email 邮箱
 * @param password 密码
 * @returns 登录成功返回用户信息，失败返回 null
 */
export const testLogin = (email: string, password: string) => {
    const user = users.find(
        (user) => user.email === email && user.password === password
    );

    // 如果找到用户，则返回用户信息（不包含密码）
    if (user) {
        const {password, ...userInfo} = user;
        return userInfo;
    }

    return null;
};

/**
 * 通过 ID 获取用户信息
 * @param id 用户ID
 * @returns 用户信息或 null
 */
export const getUserById = (id: string) => {
    const user = users.find((user) => user.id === id);

    if (user) {
        const {password, ...userInfo} = user;
        return userInfo;
    }

    return null;
};

/**
 * 通过邮箱获取用户信息
 * @param email 用户邮箱
 * @returns 用户信息或 null
 */
export const getUserByEmail = (email: string) => {
    const user = users.find((user) => user.email === email);

    if (user) {
        const {password, ...userInfo} = user;
        return userInfo;
    }

    return null;
};
