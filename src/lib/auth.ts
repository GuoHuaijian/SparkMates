import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {User} from '@/types';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "邮箱", type: "email"},
                password: {label: "密码", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // 在实际应用中，这里会请求后端 API 进行验证
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const user = await response.json();
                    return user;
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
        newUser: '/register',
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = (user as User).id;
                token.name = (user as User).name;
                token.email = (user as User).email;
                token.picture = (user as User).avatar;
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture as string | undefined,
                    avatar: token.picture as string | undefined,
                };
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// 类型扩展
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
            avatar?: string;
        };
    }
}
