'use client';

import './globals.css';
import Head from 'next/head';
import Providers, {inter} from '@/lib/Providers';

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" className={inter.variable}>
        <Head>
            <title>创意协作平台</title>
            <meta name="description" content="一个连接创意、人才和项目的在线协作平台"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
