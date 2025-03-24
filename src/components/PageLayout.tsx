'use client';

import React, {ReactNode} from 'react';
import {Box, Container, Paper, useTheme} from '@mui/material';
import Navigation from './Navigation';

type PageLayoutProps = {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    withPaper?: boolean;
    padding?: number | string;
    sx?: Record<string, any>;
};

const PageLayout: React.FC<PageLayoutProps> = ({
                                                   children,
                                                   maxWidth = 'lg',
                                                   withPaper = true,
                                                   padding,
                                                   sx = {}
                                               }) => {
    const theme = useTheme();

    // 默认内边距根据屏幕尺寸调整
    const defaultPadding = {
        xs: 2,
        sm: 3,
        md: 4
    };

    const containerSx = {
        pt: {xs: 2, sm: 3},
        pb: 6,
        ...sx
    };

    const paperSx = {
        p: padding || defaultPadding,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        bgcolor: 'background.paper',
        minHeight: '70vh',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid',
        borderColor: 'rgba(33, 150, 243, 0.1)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'linear-gradient(90deg, #1976d2, #64B5F6)',
        }
    };

    return (
        <>
            <Navigation/>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(25, 118, 210, 0.02) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    paddingBottom: 10,
                    paddingTop: {xs: 0, sm: 0}
                }}
            >
                {/* 顶部装饰性元素 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '200px',
                        background: 'radial-gradient(circle at 50% 0%, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0) 70%)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                />

                <Container maxWidth={maxWidth} sx={containerSx}>
                    {withPaper ? (
                        <Paper elevation={1} sx={paperSx}>
                            {children}
                        </Paper>
                    ) : (
                        <Box>{children}</Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default PageLayout;
