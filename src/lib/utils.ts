'use client';

/**
 * 获取用户头像 URL
 * 如果用户有头像，返回用户头像；否则返回占位头像
 */
export const getAvatarUrl = (avatar?: string, name?: string): string => {
    if (avatar && !avatar.includes('placeholder')) {
        return avatar;
    }

    // 如果没有头像，返回占位头像
    return `/avatars/placeholder.svg`;
};

/**
 * 获取用户姓名的首字母作为头像文本
 */
export const getInitials = (name: string): string => {
    if (!name) return '';

    // 获取名称的第一个字符
    return name.charAt(0).toUpperCase();
};

/**
 * 格式化日期
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

/**
 * 格式化大数字 (1000 -> 1k)
 */
export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

/**
 * 截断长文本
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
