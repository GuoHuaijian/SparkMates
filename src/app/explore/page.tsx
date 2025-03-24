'use client';

import React, {useEffect, useState} from 'react';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    Assignment as AssignmentIcon,
    Comment as CommentIcon,
    Favorite as FavoriteIcon,
    Lightbulb as LightbulbIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {IdeasTestApi, ProjectsTestApi} from '@/services/test-api';
import {Idea, Project, User} from '@/types';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

// 扩展用户类型，添加统计信息
interface UserStats {
    ideas: number;
    projects: number;
    followers: number;
}

interface UserWithStats extends User {
    stats: UserStats;
}

// 自定义User类型，用于模拟数据
interface MockUser {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    role?: string;
}

// 模拟用户数据
const MOCK_USERS: MockUser[] = [
    {
        id: 'user1',
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: '/avatars/avatar1.jpg',
        bio: '资深UI设计师，热爱创意与创新',
        role: 'designer',
        createdAt: '2023-01-15T08:00:00Z',
        updatedAt: '2023-09-20T15:30:00Z'
    },
    {
        id: 'user2',
        name: '李四',
        email: 'lisi@example.com',
        avatar: '/avatars/avatar2.jpg',
        bio: '前端开发工程师，5年经验',
        role: 'developer',
        createdAt: '2023-02-20T10:15:00Z',
        updatedAt: '2023-10-05T09:45:00Z'
    },
    {
        id: 'user3',
        name: '王五',
        email: 'wangwu@example.com',
        avatar: '/avatars/avatar3.jpg',
        bio: '产品经理，致力于用户体验优化',
        role: 'manager',
        createdAt: '2023-03-10T14:30:00Z',
        updatedAt: '2023-09-28T16:20:00Z'
    },
    {
        id: 'user4',
        name: '赵六',
        email: 'zhaoliu@example.com',
        avatar: '/avatars/avatar4.jpg',
        bio: 'UI/UX设计师，喜欢简约风格',
        role: 'designer',
        createdAt: '2023-04-05T11:45:00Z',
        updatedAt: '2023-10-10T13:15:00Z'
    },
    {
        id: 'user5',
        name: '钱七',
        email: 'qianqi@example.com',
        avatar: '/avatars/avatar5.jpg',
        bio: '全栈开发者，热爱开源项目',
        role: 'developer',
        createdAt: '2023-05-12T09:30:00Z',
        updatedAt: '2023-10-15T10:40:00Z'
    },
    {
        id: 'user6',
        name: '孙八',
        email: 'sunba@example.com',
        avatar: '/avatars/avatar6.jpg',
        bio: '创意总监，10年行业经验',
        role: 'manager',
        createdAt: '2023-06-18T16:00:00Z',
        updatedAt: '2023-10-20T14:25:00Z'
    }
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{pt: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// 创建者卡片组件
const CreatorCard: React.FC<{ user: UserWithStats }> = ({user}) => {
    const router = useRouter();

    return (
        <Card
            elevation={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
            onClick={() => router.push(`/profile/${user.id}`)}
        >
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{width: 80, height: 80, mb: 2}}
                />
                <Typography variant="h6" align="center" gutterBottom>
                    {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center"
                            sx={{mb: 2, height: 40, overflow: 'hidden'}}>
                    {user.bio}
                </Typography>

                <Grid container spacing={1} sx={{mt: 1}}>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant="h6">{user.stats.ideas}</Typography>
                            <Typography variant="caption" color="text.secondary">创意</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant="h6">{user.stats.projects}</Typography>
                            <Typography variant="caption" color="text.secondary">项目</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant="h6">{user.stats.followers}</Typography>
                            <Typography variant="caption" color="text.secondary">粉丝</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};

// 创作者列表面板
const CreatorsPanel: React.FC<{ users: UserWithStats[] }> = ({users}) => {
    const isXs = useMediaQuery((theme: any) => theme.breakpoints.only('xs'));
    const router = useRouter();

    return (
        <Box sx={{mt: 3}}>
            <Grid container spacing={3}>
                {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <CreatorCard user={user}/>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForwardIcon/>}
                    onClick={() => router.push('/creators')}
                    sx={{borderRadius: 4}}
                >
                    查看所有创作者
                </Button>
            </Box>
        </Box>
    );
};

const ExplorePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {user} = useAuth();
    const router = useRouter();
    const [tabValue, setTabValue] = useState(0);

    const [trendingIdeas, setTrendingIdeas] = useState<Idea[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [popularUsers, setPopularUsers] = useState<UserWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 获取热门创意
                const ideas = await IdeasTestApi.getAll();
                // 处理数据以符合类型
                const enhancedIdeas: Idea[] = ideas.map(idea => {
                    // 如果comments是数组，计算长度；否则保留原值
                    const commentsCount = Array.isArray(idea.comments)
                        ? idea.comments.length
                        : (typeof idea.comments === 'number' ? idea.comments : 0);

                    return {
                        ...idea,
                        comments: commentsCount
                    };
                });

                const sortedIdeas = [...enhancedIdeas].sort((a, b) => b.likes - a.likes);
                setTrendingIdeas(sortedIdeas.slice(0, 6));

                // 获取精选项目
                const projects = await ProjectsTestApi.getAll();
                // 以进度和最新为排序依据
                const sortedProjects = [...projects].sort((a, b) => {
                    if (b.progress === a.progress) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return (b.progress || 0) - (a.progress || 0);
                });
                setFeaturedProjects(sortedProjects.slice(0, 6));

                // 使用模拟用户数据，转换为符合User接口的格式
                const usersWithStats: UserWithStats[] = MOCK_USERS.map(mockUser => {
                    // 从模拟用户中提取符合User接口的字段
                    const user: User = {
                        id: mockUser.id,
                        name: mockUser.name,
                        email: mockUser.email,
                        bio: mockUser.bio,
                        avatar: mockUser.avatar,
                        role: mockUser.role || 'user',
                        createdAt: mockUser.createdAt
                    };

                    // 添加统计信息
                    return {
                        ...user,
                        stats: {
                            ideas: Math.floor(Math.random() * 20) + 1,
                            projects: Math.floor(Math.random() * 10) + 1,
                            followers: Math.floor(Math.random() * 100) + 10
                        }
                    };
                });

                // 简单地按注册时间排序
                const sortedUsers = [...usersWithStats].sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                setPopularUsers(sortedUsers);

            } catch (error) {
                console.error('加载探索页数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // 处理导航的函数，避免在渲染过程中直接调用router.push
    const handleNavigation = (path: string) => () => {
        router.push(path);
    };

    return (
        <PageLayout withPaper={false} sx={{mt: 8}}>
            <Box
                sx={{
                    bgcolor: 'background.default',
                    pb: 8
                }}
            >
                {/* 头部横幅 */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        color: 'white',
                        py: {xs: 6, md: 10},
                        mb: 6,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{position: 'relative', zIndex: 2}}>
                            <Typography
                                variant="h2"
                                component="h1"
                                fontWeight="bold"
                                sx={{mb: 2, fontSize: {xs: '2.5rem', md: '3.5rem'}}}
                            >
                                探索创意世界
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 4,
                                    maxWidth: 600,
                                    fontWeight: 'normal',
                                    opacity: 0.9
                                }}
                            >
                                发现最新、最热门的创意和项目，连接志同道合的创作者
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        px: 3,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        }
                                    }}
                                    onClick={handleNavigation('/ideas')}
                                >
                                    浏览创意库
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: 'white',
                                        px: 3,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                    onClick={handleNavigation('/projects')}
                                >
                                    探索项目
                                </Button>
                            </Stack>
                        </Box>
                    </Container>

                    {/* 装饰元素 */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 1
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -100,
                            left: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            zIndex: 1
                        }}
                    />
                </Box>

                <Container maxWidth="lg">
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <>
                            {/* 内容导航标签 */}
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant={isMobile ? "fullWidth" : "standard"}
                                    centered={!isMobile}
                                >
                                    <Tab label="热门创意" icon={<LightbulbIcon/>} iconPosition="start"/>
                                    <Tab label="精选项目" icon={<AssignmentIcon/>} iconPosition="start"/>
                                    <Tab label="推荐创作者" icon={<PeopleIcon/>} iconPosition="start"/>
                                </Tabs>
                            </Box>

                            {/* 热门创意标签页 */}
                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{
                                    mb: 4,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        本周热门创意
                                    </Typography>
                                    <Button
                                        endIcon={<ArrowForwardIcon/>}
                                        onClick={handleNavigation('/ideas')}
                                    >
                                        查看更多
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    {trendingIdeas.map((idea) => (
                                        <Grid item xs={12} sm={6} md={4} key={idea.id}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: 6
                                                    },
                                                    position: 'relative',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <CardActionArea
                                                    onClick={handleNavigation(`/ideas/${idea.id}`)}
                                                    sx={{
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'stretch'
                                                    }}
                                                >
                                                    <CardContent sx={{flexGrow: 1, pb: 1}}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 2
                                                        }}>
                                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                                <Avatar
                                                                    src={getAvatarUrl(idea.userId || '')}
                                                                    alt={idea.userId ? idea.userId.toString() : 'User'}
                                                                    sx={{mr: 1, width: 32, height: 32}}
                                                                />
                                                                <Typography variant="subtitle2">
                                                                    User {idea.userId || 'Unknown'}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                label={idea.visibility}
                                                                size="small"
                                                                color={idea.visibility === 'PUBLIC' ? 'success' : 'default'}
                                                            />
                                                        </Box>

                                                        <Typography
                                                            variant="h6"
                                                            component="h2"
                                                            gutterBottom
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                minHeight: 60
                                                            }}
                                                        >
                                                            {idea.title}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mb: 2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                                minHeight: 60
                                                            }}
                                                        >
                                                            {idea.description}
                                                        </Typography>

                                                        <Box sx={{mb: 2}}>
                                                            {idea.tags.slice(0, 3).map((tag, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={tag}
                                                                    size="small"
                                                                    sx={{mr: 0.5, mb: 0.5}}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </CardContent>
                                                </CardActionArea>

                                                <Divider/>

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    px: 2,
                                                    py: 1
                                                }}>
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <Box sx={{display: 'flex', alignItems: 'center', mr: 2}}>
                                                            <FavoriteIcon color="error" fontSize="small"
                                                                          sx={{mr: 0.5}}/>
                                                            <Typography variant="body2">{idea.likes}</Typography>
                                                        </Box>
                                                        <Box sx={{display: 'flex', alignItems: 'center', mr: 2}}>
                                                            <CommentIcon color="action" fontSize="small"
                                                                         sx={{mr: 0.5}}/>
                                                            <Typography variant="body2">{idea.comments}</Typography>
                                                        </Box>
                                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                            <VisibilityIcon color="action" fontSize="small"
                                                                            sx={{mr: 0.5}}/>
                                                            <Typography variant="body2">{idea.views}</Typography>
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(idea.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* 精选项目标签页 */}
                            <TabPanel value={tabValue} index={1}>
                                <Box sx={{
                                    mb: 4,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        精选项目
                                    </Typography>
                                    <Button
                                        endIcon={<ArrowForwardIcon/>}
                                        onClick={handleNavigation('/projects')}
                                    >
                                        查看更多
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    {featuredProjects.map((project) => (
                                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: 6
                                                    },
                                                    position: 'relative',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <CardActionArea
                                                    onClick={handleNavigation(`/projects/${project.id}`)}
                                                    sx={{
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'stretch'
                                                    }}
                                                >
                                                    <CardContent sx={{flexGrow: 1, pb: 1}}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 2
                                                        }}>
                                                            <Chip
                                                                label={project.category}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
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

                                                        <Typography
                                                            variant="h6"
                                                            component="h2"
                                                            gutterBottom
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                minHeight: 60
                                                            }}
                                                        >
                                                            {project.title}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mb: 2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                                minHeight: 60
                                                            }}
                                                        >
                                                            {project.description}
                                                        </Typography>

                                                        <Box sx={{mb: 3}}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                mb: 1
                                                            }}>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    项目进度
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {project.progress || 0}%
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={project.progress || 0}
                                                                sx={{height: 6, borderRadius: 3}}
                                                            />
                                                        </Box>

                                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                            <AvatarGroup max={3} sx={{mr: 1}}>
                                                                {(project.members as any[]).map((member, index) => (
                                                                    <Avatar
                                                                        key={index}
                                                                        src={getAvatarUrl()}
                                                                        alt={typeof member === 'object' && member.name ? member.name : `成员${index + 1}`}
                                                                        sx={{width: 28, height: 28}}
                                                                    />
                                                                ))}
                                                            </AvatarGroup>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {project.members.length} 名成员
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </CardActionArea>

                                                <Divider/>

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    px: 2,
                                                    py: 1
                                                }}>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {project.tasks.length} 个任务
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        创建于 {formatDate(project.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* 推荐创作者标签页 */}
                            <TabPanel value={tabValue} index={2}>
                                <Box sx={{
                                    mb: 4,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        推荐创作者
                                    </Typography>
                                    <Button
                                        endIcon={<ArrowForwardIcon/>}
                                        onClick={handleNavigation('/community')}
                                    >
                                        查看社区
                                    </Button>
                                </Box>

                                <CreatorsPanel users={popularUsers}/>
                            </TabPanel>

                            {/* 底部区域：社区数据统计 */}
                            <Box sx={{mt: 8, py: 4, textAlign: 'center'}}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    创意社区活力数据
                                </Typography>
                                <Typography variant="body1" color="text.secondary"
                                            sx={{mb: 4, maxWidth: 700, mx: 'auto'}}>
                                    加入我们不断壮大的创作者社区，连接志同道合的伙伴，一起将创意变为现实
                                </Typography>

                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={6} md={3}>
                                        <Paper elevation={0} sx={{p: 3, borderRadius: 2, bgcolor: 'primary.light'}}>
                                            <Typography variant="h3" fontWeight="bold" color="primary.contrastText">
                                                {trendingIdeas.length * 42}+
                                            </Typography>
                                            <Typography variant="body1" color="primary.contrastText">
                                                创意分享
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Paper elevation={0} sx={{p: 3, borderRadius: 2, bgcolor: 'secondary.light'}}>
                                            <Typography variant="h3" fontWeight="bold" color="secondary.contrastText">
                                                {featuredProjects.length * 15}+
                                            </Typography>
                                            <Typography variant="body1" color="secondary.contrastText">
                                                进行中的项目
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Paper elevation={0} sx={{p: 3, borderRadius: 2, bgcolor: 'success.light'}}>
                                            <Typography variant="h3" fontWeight="bold" color="success.contrastText">
                                                {popularUsers.length * 24}+
                                            </Typography>
                                            <Typography variant="body1" color="success.contrastText">
                                                活跃创作者
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Paper elevation={0} sx={{p: 3, borderRadius: 2, bgcolor: 'info.light'}}>
                                            <Typography variant="h3" fontWeight="bold" color="info.contrastText">
                                                {(trendingIdeas.length + featuredProjects.length) * 32}+
                                            </Typography>
                                            <Typography variant="body1" color="info.contrastText">
                                                成功合作
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    )}
                </Container>
            </Box>
        </PageLayout>
    );
};

export default ExplorePage;
