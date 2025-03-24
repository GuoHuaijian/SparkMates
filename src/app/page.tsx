'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    ArrowForwardIos as ArrowIcon,
    LightbulbOutlined as LightbulbIcon,
    PeopleAltOutlined as PeopleIcon,
    SettingsOutlined as SettingsIcon,
    TrendingUpOutlined as TrendingIcon
} from '@mui/icons-material';
import SparkAnimation from '@/components/SparkAnimation';
import Footer from '@/components/Footer';

export default function HomePage() {
    const router = useRouter();
    const {user, loading: authLoading} = useAuth();
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (authLoading) return;

        setLoading(false);

        // 如果用户已登录，重定向到仪表板
        if (user) {
            router.push('/dashboard');
        }
    }, [authLoading, user, router]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}
        >
            {/* 英雄区域 */}
            <Box
                sx={{
                    pt: {xs: 10, sm: 12, md: 16},
                    pb: {xs: 10, sm: 12, md: 16},
                    position: 'relative',
                    color: 'white',
                    overflow: 'hidden',
                    minHeight: {xs: '80vh', md: '90vh'},
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* 将动画作为全屏背景 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0
                    }}
                >
                    <SparkAnimation/>
                </Box>

                {/* 半透明渐变覆盖层，增强层次感 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(10, 65, 147, 0.6) 0%, rgba(13, 71, 161, 0.5) 50%, rgba(8, 50, 120, 0.7) 100%)',
                        zIndex: 1
                    }}
                />

                {/* 额外的径向渐变，增强中心区域的焦点 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, rgba(10, 50, 120, 0.3) 70%, rgba(8, 40, 100, 0.5) 100%)',
                        zIndex: 1
                    }}
                />

                <Container maxWidth="lg" sx={{position: 'relative', zIndex: 2, py: {xs: 6, md: 0}}}>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={10} lg={8} sx={{textAlign: 'center'}}>
                            <Box sx={{position: 'relative', mb: {xs: 2, md: 4}}}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: {xs: '3rem', sm: '4rem', md: '5rem'},
                                        mb: 2,
                                        background: 'linear-gradient(90deg, #fff, #bbdefb)',
                                        backgroundClip: 'text',
                                        textFillColor: 'transparent',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        position: 'relative',
                                        zIndex: 2,
                                        textShadow: '0 5px 20px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    SparkMates
                                </Typography>

                                {/* 装饰光晕 */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '-40%',
                                        left: '0%',
                                        width: '100%',
                                        height: '180%',
                                        background: 'radial-gradient(ellipse at center, rgba(33, 150, 243, 0.3) 0%, rgba(25, 25, 50, 0) 70%)',
                                        zIndex: 1,
                                        pointerEvents: 'none'
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: {xs: '1.8rem', sm: '2.2rem', md: '2.8rem'},
                                    mb: 4,
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}
                            >
                                创意协作平台
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 5,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    lineHeight: 1.8,
                                    fontSize: {xs: '1.1rem', md: '1.3rem'},
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    px: 2,
                                    textShadow: '0 1px 5px rgba(0,0,0,0.15)'
                                }}
                            >
                                在这里，每一个创意火花都能找到共鸣，汇聚成璀璨星河。
                                连接创作者，共同协作，让思想与灵感交织成现实。
                            </Typography>

                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                spacing={3}
                                justifyContent="center"
                                sx={{mt: 6}}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => router.push('/register')}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #0d47a1 30%, #1976d2 90%)',
                                            boxShadow: '0 6px 25px rgba(25, 118, 210, 0.5)',
                                            transform: 'translateY(-3px)'
                                        }
                                    }}
                                >
                                    立即注册
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => router.push('/explore')}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'translateY(-3px)'
                                        }
                                    }}
                                >
                                    探索创意
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 特色区域 */}
            <Container maxWidth="lg" sx={{py: 10}}>
                <Box sx={{textAlign: 'center', mb: 8}}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary'
                        }}
                    >
                        激发创造力，连接协作者
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            color: 'text.secondary',
                            fontWeight: 'normal'
                        }}
                    >
                        SparkMates 提供一个完整的平台，帮助您从构思到实现，全程追踪创意的发展过程
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                                },
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <LightbulbIcon fontSize="large"/>
                            </Box>
                            <Typography variant="h5" component="h3" sx={{mb: 2, fontWeight: 700}}>
                                创意管理
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                捕捉灵感的每一刻，分类整理您的创意，追踪从构思到实现的全过程。
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                                },
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <PeopleIcon fontSize="large"/>
                            </Box>
                            <Typography variant="h5" component="h3" sx={{mb: 2, fontWeight: 700}}>
                                协作社区
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                找到志同道合的创作者，组建团队，共同将创意转化为现实项目。
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                                },
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <SettingsIcon fontSize="large"/>
                            </Box>
                            <Typography variant="h5" component="h3" sx={{mb: 2, fontWeight: 700}}>
                                项目工具
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                提供专业项目管理工具，任务分配、进度追踪、里程碑设定，一应俱全。
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                                },
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'info.main',
                                    color: 'white',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <TrendingIcon fontSize="large"/>
                            </Box>
                            <Typography variant="h5" component="h3" sx={{mb: 2, fontWeight: 700}}>
                                创意展示
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                展示您的成果，获取反馈，让更多人了解您的创意和项目。
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* 使用流程 */}
            <Box sx={{bgcolor: 'background.paper', py: 10}}>
                <Container maxWidth="lg">
                    <Box sx={{textAlign: 'center', mb: 8}}>
                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary'
                            }}
                        >
                            如何使用 SparkMates
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                color: 'text.secondary',
                                fontWeight: 'normal'
                            }}
                        >
                            简单四步，开启您的创意之旅
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 2,
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        mb: 2,
                                        mx: 'auto'
                                    }}
                                >
                                    1
                                </Box>
                                <Typography variant="h5" component="h3" sx={{mb: 1, fontWeight: 600}}>
                                    记录创意
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    捕捉灵感，记录您的创意，添加详细描述和标签。
                                </Typography>

                                {!isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '30%',
                                            right: '-10%',
                                            zIndex: 1,
                                            display: {xs: 'none', md: 'block'}
                                        }}
                                    >
                                        <ArrowIcon color="disabled" sx={{fontSize: 40}}/>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 2,
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'secondary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        mb: 2,
                                        mx: 'auto'
                                    }}
                                >
                                    2
                                </Box>
                                <Typography variant="h5" component="h3" sx={{mb: 1, fontWeight: 600}}>
                                    寻找伙伴
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    在社区中寻找志同道合的创作者，组建项目团队。
                                </Typography>

                                {!isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '30%',
                                            right: '-10%',
                                            zIndex: 1,
                                            display: {xs: 'none', md: 'block'}
                                        }}
                                    >
                                        <ArrowIcon color="disabled" sx={{fontSize: 40}}/>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 2,
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        mb: 2,
                                        mx: 'auto'
                                    }}
                                >
                                    3
                                </Box>
                                <Typography variant="h5" component="h3" sx={{mb: 1, fontWeight: 600}}>
                                    协作开发
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    共同制定计划，分配任务，协作将创意转化为项目。
                                </Typography>

                                {!isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '30%',
                                            right: '-10%',
                                            zIndex: 1,
                                            display: {xs: 'none', md: 'block'}
                                        }}
                                    >
                                        <ArrowIcon color="disabled" sx={{fontSize: 40}}/>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box sx={{textAlign: 'center', p: 2}}>
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'info.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        mb: 2,
                                        mx: 'auto'
                                    }}
                                >
                                    4
                                </Box>
                                <Typography variant="h5" component="h3" sx={{mb: 1, fontWeight: 600}}>
                                    展示成果
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    分享您的项目进展和成果，获取反馈，不断完善。
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{mt: 6, textAlign: 'center'}}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/register')}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            开始您的创意之旅
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* 行动召唤 */}
            <Box
                sx={{
                    py: 10,
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* 背景装饰 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, rgba(25, 25, 50, 0) 70%)',
                        zIndex: 0
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.08) 0%, rgba(25, 25, 50, 0) 70%)',
                        zIndex: 0
                    }}
                />

                <Container maxWidth="md" sx={{position: 'relative', zIndex: 1}}>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 3
                            }}
                        >
                            准备好开始您的创意之旅了吗？
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                maxWidth: 700,
                                mx: 'auto',
                                mb: 4,
                                fontWeight: 'normal',
                                opacity: 0.9
                            }}
                        >
                            加入 SparkMates，与创作者一起将闪耀的创意火花汇聚成璀璨星河
                        </Typography>

                        <Stack
                            direction={{xs: 'column', sm: 'row'}}
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => router.push('/register')}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    bgcolor: 'white',
                                    color: '#1565c0',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                立即注册
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router.push('/login')}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    borderColor: 'white',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                                    }
                                }}
                            >
                                登录账号
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* 页脚 */}
            <Box sx={{mt: 'auto'}}>
                <Footer/>
            </Box>
        </Box>
    );
}
