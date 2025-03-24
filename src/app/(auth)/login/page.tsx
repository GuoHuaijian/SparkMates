'use client';

import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    Link as MuiLink,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {EmailOutlined, LockOutlined, Visibility, VisibilityOff} from '@mui/icons-material';
import Link from 'next/link';
import {useAuth} from '@/lib/AuthProvider';
import {useRouter} from 'next/navigation';

// 创建一个装饰性动画组件
const FloatingParticles: React.FC = () => {
    const theme = useTheme();

    useEffect(() => {
        const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 调整画布大小
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 创建粒子
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;

                // 从主题色中随机选择
                const colors = [
                    theme.palette.primary.main + '80',
                    theme.palette.secondary.main + '80',
                    theme.palette.primary.light + '80',
                    theme.palette.secondary.light + '80',
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // 边界检查
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // 创建粒子数组
        const particlesArray: Particle[] = [];
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));

        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }

        // 绘制连接线
        function drawConnections() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        if (!ctx) return;
                        const opacity = 1 - distance / 120;
                        ctx.strokeStyle = `rgba(150, 150, 255, ${opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [theme]);

    return (
        <canvas
            id="particles-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};

const LoginPage: React.FC = () => {
    const {login, loading, error} = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // 预填测试账户信息
    const [email, setEmail] = useState<string>('test@example.com');
    const [password, setPassword] = useState<string>('password');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // 表单验证
        if (!email.trim()) {
            setFormError('请输入邮箱地址');
            return;
        }

        if (!password.trim()) {
            setFormError('请输入密码');
            return;
        }

        try {
            await login(email, password);
            // 登录成功，重定向由AuthProvider处理
        } catch (error) {
            // 错误已在AuthProvider中处理
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}25)`,
            }}
        >
            <FloatingParticles/>

            {/* 装饰性背景元素 */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '40vh',
                    height: '40vh',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}30, transparent 70%)`,
                    top: '-15vh',
                    right: '-10vh',
                    zIndex: 0,
                    filter: 'blur(40px)',
                    animation: 'pulse 15s infinite alternate',
                    '@keyframes pulse': {
                        '0%': {opacity: 0.5, transform: 'scale(1)'},
                        '100%': {opacity: 0.7, transform: 'scale(1.1)'}
                    }
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '50vh',
                    height: '50vh',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.secondary.main}20, transparent 70%)`,
                    bottom: '-20vh',
                    left: '-15vh',
                    zIndex: 0,
                    filter: 'blur(40px)',
                    animation: 'float 20s infinite alternate',
                    '@keyframes float': {
                        '0%': {transform: 'translateY(0) scale(1)'},
                        '100%': {transform: 'translateY(-30px) scale(1.1)'}
                    }
                }}
            />

            {/* 装饰性图形 */}
            {!isMobile && (
                <>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '15%',
                            left: '10%',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                            animation: 'twinkle 4s infinite alternate',
                            '@keyframes twinkle': {
                                '0%': {opacity: 0.3, transform: 'scale(1)'},
                                '100%': {opacity: 1, transform: 'scale(1.3)'}
                            }
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '25%',
                            right: '15%',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: theme.palette.secondary.main,
                            boxShadow: `0 0 15px ${theme.palette.secondary.main}`,
                            animation: 'twinkle 6s 1s infinite alternate',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '60%',
                            left: '15%',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: theme.palette.primary.light,
                            boxShadow: `0 0 15px ${theme.palette.primary.light}`,
                            animation: 'twinkle 5s 0.5s infinite alternate',
                        }}
                    />
                </>
            )}

            <Container
                maxWidth="xs"
                sx={{
                    zIndex: 1,
                    my: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        p: {xs: 3, sm: 4},
                        borderRadius: 4,
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.85)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        width: '100%',
                        '&:hover': {
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                            transform: 'translateY(-5px)',
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Typography component="h1" variant="h4" fontWeight="bold"
                                    sx={{
                                        mb: 1,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        textFillColor: 'transparent',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '0.5px',
                                    }}>
                            SparkMates
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" align="center">
                            登录您的账户，开启创意之旅
                        </Typography>
                    </Box>

                    {(formError || error) && (
                        <Alert severity="error" sx={{mb: 2, borderRadius: 2}}>
                            {formError || (error && error.message)}
                        </Alert>
                    )}

                    <Alert
                        severity="info"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.info.light}30`
                        }}
                        icon={<Box component="span" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: theme.palette.info.light,
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>i</Box>}
                    >
                        <Typography variant="body2">
                            <strong>测试账户信息：</strong><br/>
                            邮箱: test@example.com<br/>
                            密码: password
                        </Typography>
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="邮箱地址"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color="primary"/>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    transition: 'all 0.3s',
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    }
                                },
                                mb: 2
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined color="primary"/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    transition: 'all 0.3s',
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    }
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 4,
                                mb: 2,
                                py: 1.5,
                                borderRadius: 10,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
                                transition: 'all 0.3s',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                    transition: 'all 0.5s',
                                },
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                                    '&::before': {
                                        left: '100%',
                                    }
                                },
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                letterSpacing: '0.5px'
                            }}
                            disabled={loading}
                        >
                            {loading ? '登录中...' : '登录'}
                        </Button>

                        <Divider sx={{my: 2}}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    px: 1,
                                    fontSize: '0.8rem',
                                    opacity: 0.8
                                }}
                            >
                                或者
                            </Typography>
                        </Divider>

                        <Box sx={{textAlign: 'center'}}>
                            <Link href="/register" passHref legacyBehavior>
                                <MuiLink
                                    component="span"
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        fontWeight: 'medium',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: theme.palette.secondary.main,
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    没有账号？注册一个
                                </MuiLink>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
