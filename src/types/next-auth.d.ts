declare module "next-auth" {
    /**
     * 扩展 NextAuth 中的 Session 类型
     */
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        }
    }

    /**
     * 扩展 NextAuth 中的 User 类型
     */
    interface User {
        id: string;
        name: string;
        email: string;
        image?: string;
    }
}

declare module "next-auth/jwt" {
    /**
     * 扩展 JWT 中的 Token 类型
     */
    interface JWT {
        id: string;
        name: string;
        email: string;
        image?: string;
    }
}
