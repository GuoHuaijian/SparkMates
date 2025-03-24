'use client';

import React from 'react';
// import { SessionProvider } from 'next-auth/react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AuthProvider} from './AuthProvider';
import {Inter} from 'next/font/google';

// 修改字体配置
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// 创建自定义主题
const theme = createTheme({
    palette: {
        primary: {
            light: '#64B5F6', // 浅蓝色
            main: '#1976d2', // 蓝色
            dark: '#0d47a1', // 深蓝色
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#90CAF9',
            main: '#42a5f5', // 蓝色变种
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444', // 红色
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        action: {
            active: '#1976d2',
            hover: 'rgba(33, 150, 243, 0.08)',
            selected: 'rgba(33, 150, 243, 0.12)',
        },
        divider: 'rgba(33, 150, 243, 0.12)',
    },
    typography: {
        fontFamily: inter.style.fontFamily,
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #0d47a1 30%, #1976d2 90%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
                },
                elevation1: {
                    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(33, 150, 243, 0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.12)',
                        transform: 'translateY(-5px)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                },
            },
        },
    },
});

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({children}: ProvidersProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}

// 导出字体以便在布局中使用
export {inter};
