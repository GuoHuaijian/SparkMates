'use client';

import React from 'react';
import {
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    Link as MuiLink,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Link from 'next/link';
import {
    GitHub as GitHubIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(180deg, #fbfcfe 0%, #f0f7ff 100%)',
                borderTop: '1px solid',
                borderColor: 'rgba(33, 150, 243, 0.15)',
                py: {xs: 6, md: 8},
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
                    background: 'radial-gradient(circle, rgba(33, 150, 243, 0.08) 0%, rgba(25, 118, 210, 0) 70%)',
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
                    background: 'radial-gradient(circle, rgba(33, 150, 243, 0.06) 0%, rgba(25, 118, 210, 0) 70%)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{position: 'relative', zIndex: 1}}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" component="div" sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            SparkMates
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{mb: 3, maxWidth: 300}}>
                            在这里，每一个创意火花都能找到共鸣，汇聚成璀璨星河。连接创作者，共同协作，让思想与灵感交织成现实。
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            <IconButton
                                size="small"
                                aria-label="github"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {color: '#1976d2'}
                                }}
                            >
                                <GitHubIcon/>
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="twitter"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {color: '#1976d2'}
                                }}
                            >
                                <TwitterIcon/>
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="instagram"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {color: '#1976d2'}
                                }}
                            >
                                <InstagramIcon/>
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="linkedin"
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {color: '#1976d2'}
                                }}
                            >
                                <LinkedInIcon/>
                            </IconButton>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: '#0d47a1'
                        }}>
                            平台
                        </Typography>

                        <Stack spacing={1.5}>
                            <Link href="/about" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    关于我们
                                </MuiLink>
                            </Link>
                            <Link href="/contact" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    联系我们
                                </MuiLink>
                            </Link>
                            <Link href="/careers" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    加入我们
                                </MuiLink>
                            </Link>
                            <Link href="/faq" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    常见问题
                                </MuiLink>
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: '#0d47a1'
                        }}>
                            发现
                        </Typography>

                        <Stack spacing={1.5}>
                            <Link href="/explore" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    探索创意
                                </MuiLink>
                            </Link>
                            <Link href="/projects" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    项目
                                </MuiLink>
                            </Link>
                            <Link href="/ideas" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    创意库
                                </MuiLink>
                            </Link>
                            <Link href="/creators" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    创作者
                                </MuiLink>
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: '#0d47a1'
                        }}>
                            资源
                        </Typography>

                        <Stack spacing={1.5}>
                            <Link href="/blog" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    博客
                                </MuiLink>
                            </Link>
                            <Link href="/tutorials" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    教程
                                </MuiLink>
                            </Link>
                            <Link href="/resources" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    资源中心
                                </MuiLink>
                            </Link>
                            <Link href="/support" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    帮助中心
                                </MuiLink>
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: '#0d47a1'
                        }}>
                            法律
                        </Typography>

                        <Stack spacing={1.5}>
                            <Link href="/terms" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    服务条款
                                </MuiLink>
                            </Link>
                            <Link href="/privacy" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    隐私政策
                                </MuiLink>
                            </Link>
                            <Link href="/cookies" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    Cookie 政策
                                </MuiLink>
                            </Link>
                            <Link href="/copyright" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    版权声明
                                </MuiLink>
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{my: 4, borderColor: 'rgba(33, 150, 243, 0.1)'}}/>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        justifyContent: 'space-between',
                        alignItems: {xs: 'center', sm: 'flex-start'},
                        textAlign: {xs: 'center', sm: 'left'}
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {currentYear} SparkMates 创意协作平台 · 保留所有权利
                    </Typography>

                    {!isMobile && (
                        <Stack direction="row" spacing={3}>
                            <Link href="/terms" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    服务条款
                                </MuiLink>
                            </Link>
                            <Link href="/privacy" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    隐私政策
                                </MuiLink>
                            </Link>
                            <Link href="/cookies" passHref legacyBehavior>
                                <MuiLink
                                    underline="hover"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{'&:hover': {color: '#1976d2'}}}
                                >
                                    Cookie 政策
                                </MuiLink>
                            </Link>
                        </Stack>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
