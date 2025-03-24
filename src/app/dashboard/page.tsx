'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Add as AddIcon,
    Assignment as AssignmentIcon,
    Email as EmailIcon,
    Group as GroupIcon,
    Lightbulb as LightbulbIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import PageLayout from '@/components/PageLayout';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import {IdeasTestApi, MessagesTestApi, NotificationsTestApi, ProjectsTestApi} from '@/services/test-api';
import {Idea, Project} from '@/types';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const {user, loading} = useAuth();

    const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 认证保护：如果未登录，重定向到登录页面
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                // 获取用户创意
                const ideas = await IdeasTestApi.getByUser(user.id);
                setUserIdeas(ideas);

                // 获取用户项目
                const projects = await ProjectsTestApi.getByUser(user.id);
                setUserProjects(projects);

                // 获取未读消息数量
                const msgCount = await MessagesTestApi.getUnreadCount(user.id);
                setUnreadMessages(msgCount);

                // 获取未读通知数量
                const notifCount = await NotificationsTestApi.getUnreadCount(user.id);
                setUnreadNotifications(notifCount);

            } catch (error) {
                console.error('加载仪表盘数据出错:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user]);

    // 身份验证中，显示加载状态
    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    // 如果未登录，显示加载状态（重定向会在useEffect中处理）
    if (!user) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    const quickActions = [
        {
            title: '发布创意',
            icon: <LightbulbIcon/>,
            path: '/ideas/new',
            color: '#2563eb'
        },
        {
            title: '创建项目',
            icon: <AssignmentIcon/>,
            path: '/projects/new',
            color: '#7c3aed'
        },
        {
            title: '查找合作者',
            icon: <GroupIcon/>,
            path: '/community',
            color: '#10b981'
        },
        {
            title: '消息中心',
            icon: <EmailIcon/>,
            path: '/messages',
            color: '#f59e0b'
        }
    ];

    // 处理导航的函数，避免在渲染过程中直接调用router.push
    const handleNavigation = (path: string) => () => {
        router.push(path);
    };

    return (
        <PageLayout sx={{mt: 8}}>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100vh', py: 4}}>
                <Container maxWidth="lg">
                    {/* 欢迎信息 */}
                    <Box sx={{mb: 4}}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            欢迎回来，{user?.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            今天是 {formatDate(new Date().toISOString())}，让我们来看看您的最新动态
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* 左侧内容：用户概览和快速操作 */}
                        <Grid item xs={12} md={4}>
                            {/* 用户信息卡片 */}
                            <Paper elevation={0} sx={{p: 3, mb: 4, borderRadius: 2}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <Avatar
                                        src={getAvatarUrl(user?.avatar)}
                                        alt={user?.name}
                                        sx={{width: 64, height: 64, mr: 2}}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {user?.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.role}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{my: 2}}/>

                                <List disablePadding>
                                    <ListItem disableGutters sx={{px: 0, py: 0.75}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <LightbulbIcon fontSize="small" color="primary"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2">
                                                    创意: <strong>{userIdeas?.length || 0}</strong>
                                                </Typography>
                                            }
                                        />
                                    </ListItem>

                                    <ListItem disableGutters sx={{px: 0, py: 0.75}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <AssignmentIcon fontSize="small" color="primary"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2">
                                                    项目: <strong>{userProjects?.length || 0}</strong>
                                                </Typography>
                                            }
                                        />
                                    </ListItem>

                                    <ListItem disableGutters sx={{px: 0, py: 0.75}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <EmailIcon fontSize="small" color="primary"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2">
                                                    未读消息: <strong>{unreadMessages || 0}</strong>
                                                </Typography>
                                            }
                                        />
                                    </ListItem>

                                    <ListItem disableGutters sx={{px: 0, py: 0.75}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <NotificationsIcon fontSize="small" color="primary"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2">
                                                    未读通知: <strong>{unreadNotifications || 0}</strong>
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </List>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AccountCircleIcon/>}
                                    onClick={handleNavigation('/profile')}
                                    sx={{mt: 2}}
                                >
                                    查看个人资料
                                </Button>
                            </Paper>

                            {/* 快速操作 */}
                            <Paper elevation={0} sx={{p: 3, borderRadius: 2}}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    快速操作
                                </Typography>

                                <Grid container spacing={2} sx={{mt: 1}}>
                                    {quickActions.map((action, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: 2,
                                                        transform: 'translateY(-4px)'
                                                    }
                                                }}
                                                onClick={handleNavigation(action.path)}
                                            >
                                                <CardContent sx={{textAlign: 'center', p: 2}}>
                                                    <Box
                                                        sx={{
                                                            color: action.color,
                                                            mb: 1,
                                                            display: 'flex',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {action.icon}
                                                    </Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {action.title}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* 右侧内容：最近项目和创意 */}
                        <Grid item xs={12} md={8}>
                            {/* 最近项目 */}
                            <Paper elevation={0} sx={{p: 3, borderRadius: 2}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        最近项目
                                    </Typography>
                                    <Button
                                        startIcon={<AddIcon/>}
                                        onClick={handleNavigation('/projects/new')}
                                    >
                                        创建项目
                                    </Button>
                                </Box>

                                {isLoading ? (
                                    <Box sx={{py: 4, textAlign: 'center'}}>
                                        <CircularProgress size={28} sx={{mb: 2}}/>
                                        <Typography>加载中...</Typography>
                                    </Box>
                                ) : userProjects && userProjects.length > 0 ? (
                                    <List>
                                        {userProjects.slice(0, 3).map((project, index) => (
                                            <React.Fragment key={project.id}>
                                                <ListItem
                                                    sx={{
                                                        py: 2,
                                                        px: 0,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={handleNavigation(`/projects/${project.id}`)}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Typography variant="subtitle1" fontWeight="medium">
                                                                    {project.title}
                                                                </Typography>
                                                                <Chip
                                                                    label={project.status}
                                                                    size="small"
                                                                    color={
                                                                        project.status === '已完成' ? 'success' :
                                                                            project.status === '进行中' ? 'primary' :
                                                                                'default'
                                                                    }
                                                                />
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{mt: 1}} component="span">
                                                                <Typography variant="body2" color="text.secondary"
                                                                            sx={{mb: 1}} component="span">
                                                                    {project.description.substring(0, 120)}...
                                                                </Typography>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }} component="span">
                                                                    <Box component="span">
                                                                        {project.tags && project.tags.slice(0, 2).map((tag, tagIndex) => (
                                                                            <Typography key={tagIndex} component="span"
                                                                                        sx={{display: 'inline-block'}}>
                                                                                <Chip
                                                                                    label={tag}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{mr: 0.5}}
                                                                                />
                                                                            </Typography>
                                                                        ))}
                                                                        {project.tags && project.tags.length > 2 && (
                                                                            <Typography variant="caption"
                                                                                        component="span">
                                                                                +{project.tags.length - 2}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                component="span">
                                                                        创建于 {formatDate(project.createdAt)}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < userProjects.slice(0, 3).length - 1 && <Divider/>}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{py: 4, textAlign: 'center'}}>
                                        <Typography color="text.secondary">
                                            您还没有创建任何项目
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            onClick={handleNavigation('/projects/new')}
                                            sx={{mt: 2}}
                                        >
                                            创建第一个项目
                                        </Button>
                                    </Box>
                                )}

                                {userProjects && userProjects.length > 3 && (
                                    <Box sx={{textAlign: 'center', mt: 2}}>
                                        <Button
                                            onClick={handleNavigation('/projects')}
                                            variant="text"
                                        >
                                            查看全部项目
                                        </Button>
                                    </Box>
                                )}
                            </Paper>

                            {/* 最近创意 */}
                            <Paper elevation={0} sx={{p: 3, borderRadius: 2}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        最近创意
                                    </Typography>
                                    <Button
                                        startIcon={<AddIcon/>}
                                        onClick={handleNavigation('/ideas/new')}
                                    >
                                        发布创意
                                    </Button>
                                </Box>

                                {isLoading ? (
                                    <Box sx={{py: 4, textAlign: 'center'}}>
                                        <CircularProgress size={28} sx={{mb: 2}}/>
                                        <Typography>加载中...</Typography>
                                    </Box>
                                ) : userIdeas && userIdeas.length > 0 ? (
                                    <List>
                                        {userIdeas.slice(0, 3).map((idea, index) => (
                                            <React.Fragment key={idea.id}>
                                                <ListItem
                                                    sx={{
                                                        py: 2,
                                                        px: 0,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={handleNavigation(`/ideas/${idea.id}`)}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Typography variant="subtitle1" fontWeight="medium">
                                                                    {idea.title}
                                                                </Typography>
                                                                <Chip
                                                                    label={idea.visibility}
                                                                    size="small"
                                                                    color={
                                                                        idea.visibility === 'PUBLIC' ? 'success' :
                                                                            idea.visibility === 'PRIVATE' ? 'error' :
                                                                                'default'
                                                                    }
                                                                />
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{mt: 1}} component="span">
                                                                <Typography variant="body2" color="text.secondary"
                                                                            sx={{mb: 1}} component="span">
                                                                    {idea.description.substring(0, 120)}...
                                                                </Typography>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }} component="span">
                                                                    <Box component="span">
                                                                        {idea.tags.slice(0, 2).map((tag, tagIndex) => (
                                                                            <Typography key={tagIndex} component="span"
                                                                                        sx={{display: 'inline-block'}}>
                                                                                <Chip
                                                                                    label={tag}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{mr: 0.5}}
                                                                                />
                                                                            </Typography>
                                                                        ))}
                                                                        {idea.tags.length > 2 && (
                                                                            <Typography variant="caption"
                                                                                        component="span">
                                                                                +{idea.tags.length - 2}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                component="span">
                                                                        创建于 {formatDate(idea.createdAt)}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < userIdeas.slice(0, 3).length - 1 && <Divider/>}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{py: 4, textAlign: 'center'}}>
                                        <Typography color="text.secondary">
                                            您还没有发布任何创意
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            onClick={handleNavigation('/ideas/new')}
                                            sx={{mt: 2}}
                                        >
                                            发布第一个创意
                                        </Button>
                                    </Box>
                                )}

                                {userIdeas && userIdeas.length > 3 && (
                                    <Box sx={{textAlign: 'center', mt: 2}}>
                                        <Button
                                            onClick={handleNavigation('/ideas')}
                                            variant="text"
                                        >
                                            查看全部创意
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </PageLayout>
    );
};

export default DashboardPage;
