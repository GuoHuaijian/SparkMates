'use client';

import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    Add as AddIcon,
    ArrowBack,
    Assignment as AssignmentIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Forum as ForumIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import {useParams, useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {IdeasTestApi, ProjectsTestApi, UsersTestApi} from '@/services/test-api';
import {Idea, Project, User} from '@/types';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

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
            id={`project-tabpanel-${index}`}
            aria-labelledby={`project-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{py: 3}}>{children}</Box>}
        </div>
    );
}

const ProjectDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const {user} = useAuth();
    const projectId = params?.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [idea, setIdea] = useState<Idea | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [creator, setCreator] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState<number>(0);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                const projectData = await ProjectsTestApi.getById(projectId);

                if (!projectData) {
                    setError('项目不存在或已被删除');
                    return;
                }

                setProject(projectData);

                // 获取创建者信息
                const creatorData = await UsersTestApi.getById(projectData.creatorId);
                setCreator(creatorData);

                // 获取成员信息
                const membersData = await Promise.all(
                    projectData.members.map(id => UsersTestApi.getById(id))
                );
                setMembers(membersData.filter(Boolean) as User[]);

                // 获取关联创意信息（如果有）
                if (projectData.ideaId) {
                    const ideaData = await IdeasTestApi.getById(projectData.ideaId);
                    setIdea(ideaData);
                }

            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('加载项目详情时出错');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleUpdateTaskStatus = (taskId: string, newStatus: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED') => {
        if (!project) return;

        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? {...task, status: newStatus} : task
        );

        // 计算新的进度
        const completedTasks = updatedTasks.filter(task => task.status === 'COMPLETED').length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);

        setProject({
            ...project,
            tasks: updatedTasks,
            progress
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <PageLayout sx={{mt: 8}}>
                <Container maxWidth="lg">
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                        <IconButton onClick={handleGoBack} sx={{mr: 2}}>
                            <ArrowBack/>
                        </IconButton>
                        <Skeleton variant="text" width="50%" height={40}/>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Skeleton variant="rectangular" height={200} sx={{mb: 2}}/>
                            <Skeleton variant="text" height={30} sx={{mb: 1}}/>
                            <Skeleton variant="text" height={20}/>
                            <Skeleton variant="text" height={20}/>
                            <Skeleton variant="text" height={20}/>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Skeleton variant="rectangular" height={300}/>
                        </Grid>
                    </Grid>
                </Container>
            </PageLayout>
        );
    }

    if (error || !project) {
        return (
            <PageLayout sx={{mt: 8}}>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{mt: 4}}>
                        {error || '无法加载项目详情'}
                    </Alert>
                    <Box sx={{mt: 2, textAlign: 'center'}}>
                        <Button variant="outlined" onClick={handleGoBack}>
                            返回上一页
                        </Button>
                    </Box>
                </Container>
            </PageLayout>
        );
    }

    const isCreator = user?.id === project.creatorId;
    const isMember = project.members.includes(user?.id || '');

    return (
        <PageLayout sx={{mt: 8}}>
            <Container maxWidth="lg">
                {/* 返回按钮和标题 */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <IconButton onClick={handleGoBack} sx={{mr: 2}}>
                            <ArrowBack/>
                        </IconButton>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {project.title}
                        </Typography>
                    </Box>

                    {(isCreator || isMember) && (
                        <Box>
                            <IconButton onClick={handleOpenMenu}>
                                <MoreVertIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={menuAnchorEl}
                                open={Boolean(menuAnchorEl)}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem onClick={() => {
                                    handleCloseMenu();
                                    router.push(`/projects/${projectId}/edit`);
                                }}>
                                    <ListItemIcon>
                                        <EditIcon fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText>编辑项目</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleCloseMenu}>
                                    <ListItemIcon>
                                        <ShareIcon fontSize="small"/>
                                    </ListItemIcon>
                                    <ListItemText>分享项目</ListItemText>
                                </MenuItem>
                                {isCreator && (
                                    <MenuItem onClick={handleCloseMenu} sx={{color: 'error.main'}}>
                                        <ListItemIcon>
                                            <DeleteIcon fontSize="small" color="error"/>
                                        </ListItemIcon>
                                        <ListItemText>删除项目</ListItemText>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                    )}
                </Box>

                <Grid container spacing={4}>
                    {/* 左侧主要内容 */}
                    <Grid item xs={12} md={8}>
                        {/* 项目信息卡片 */}
                        <Paper elevation={0} sx={{p: 3, mb: 4, borderRadius: 2}}>
                            {/* 项目基本信息 */}
                            <Box sx={{mb: 3}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Chip
                                        label={project.status}
                                        color={
                                            project.status === '已完成' ? 'success' :
                                                project.status === '进行中' ? 'primary' :
                                                    project.status === '规划中' ? 'info' :
                                                        'default'
                                        }
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        创建于 {formatDate(project.createdAt)}
                                    </Typography>
                                </Box>

                                <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line'}}>
                                    {project.description}
                                </Typography>
                            </Box>

                            {/* 分类和标签 */}
                            <Box sx={{mb: 3}}>
                                <Chip
                                    label={project.category}
                                    color="primary"
                                    variant="outlined"
                                    sx={{mr: 1, mb: 1}}
                                />
                                {project.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        variant="outlined"
                                        sx={{mr: 1, mb: 1}}
                                    />
                                ))}
                            </Box>

                            {/* 进度 */}
                            <Box sx={{mb: 3}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        项目进度
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {project.progress}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{height: 8, borderRadius: 4}}
                                />
                            </Box>

                            {/* 时间表 */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                    项目时间表
                                </Typography>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <AccessTimeIcon fontSize="small" color="action" sx={{mr: 1}}/>
                                        <Typography variant="body2">
                                            开始时间: {project.startDate ? formatDate(project.startDate) : '未设置'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <ScheduleIcon fontSize="small" color="action" sx={{mr: 1}}/>
                                        <Typography variant="body2">
                                            结束时间: {project.endDate ? formatDate(project.endDate) : '未设置'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* 相关创意 */}
                            {idea && (
                                <Box sx={{mb: 3}}>
                                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                                        关联创意
                                    </Typography>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {boxShadow: 1}
                                        }}
                                        onClick={() => router.push(`/ideas/${idea.id}`)}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {idea.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                                {idea.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}
                        </Paper>

                        {/* 标签页 */}
                        <Paper elevation={0} sx={{borderRadius: 2}}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                >
                                    <Tab label="任务"/>
                                    <Tab label="成员"/>
                                    <Tab label="讨论"/>
                                </Tabs>
                            </Box>

                            {/* 任务列表 */}
                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6">
                                        项目任务 ({project.tasks.length})
                                    </Typography>
                                    {(isCreator || isMember) && (
                                        <Button
                                            startIcon={<AddIcon/>}
                                            variant="contained"
                                            size="small"
                                        >
                                            添加任务
                                        </Button>
                                    )}
                                </Box>

                                {project.tasks.length > 0 ? (
                                    <List>
                                        {project.tasks.map((task) => {
                                            const assignee = members.find(member => member.id === task.assigneeId);

                                            return (
                                                <Paper
                                                    key={task.id}
                                                    variant="outlined"
                                                    sx={{mb: 2, borderRadius: 2}}
                                                >
                                                    <ListItem sx={{py: 2}}>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="subtitle1" component="div"
                                                                            sx={{mb: 1}}>
                                                                    {task.title}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Stack spacing={1}>
                                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                                        <PersonIcon fontSize="small" color="action"
                                                                                    sx={{mr: 1}}/>
                                                                        <Typography variant="body2"
                                                                                    color="text.secondary"
                                                                                    component="span">
                                                                            负责人: {assignee?.name || '未指派'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Chip
                                                                label={
                                                                    task.status === 'COMPLETED' ? '已完成' :
                                                                        task.status === 'IN_PROGRESS' ? '进行中' :
                                                                            '计划中'
                                                                }
                                                                color={
                                                                    task.status === 'COMPLETED' ? 'success' :
                                                                        task.status === 'IN_PROGRESS' ? 'primary' :
                                                                            'default'
                                                                }
                                                                size="small"
                                                            />
                                                            {(isCreator || user?.id === task.assigneeId) && task.status !== 'COMPLETED' && (
                                                                <IconButton
                                                                    color="success"
                                                                    size="small"
                                                                    sx={{ml: 1}}
                                                                    onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                                                                >
                                                                    <CheckIcon fontSize="small"/>
                                                                </IconButton>
                                                            )}
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </Paper>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <Typography color="text.secondary">
                                            暂无任务
                                        </Typography>
                                        {(isCreator || isMember) && (
                                            <Button
                                                startIcon={<AddIcon/>}
                                                variant="outlined"
                                                sx={{mt: 2}}
                                            >
                                                添加第一个任务
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </TabPanel>

                            {/* 成员列表 */}
                            <TabPanel value={tabValue} index={1}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6">
                                        项目成员 ({members.length})
                                    </Typography>
                                    {isCreator && (
                                        <Button
                                            startIcon={<AddIcon/>}
                                            variant="contained"
                                            size="small"
                                        >
                                            邀请成员
                                        </Button>
                                    )}
                                </Box>

                                <List sx={{bgcolor: 'background.paper'}}>
                                    {members.map((member) => (
                                        <ListItem key={member.id} sx={{borderRadius: 2, mb: 1}}>
                                            <ListItemAvatar>
                                                <Avatar src={getAvatarUrl(member.avatar)} alt={member.name}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={member.name}
                                                secondary={
                                                    <Box component="span">
                                                        <Typography component="span" variant="body2"
                                                                    color="text.primary">
                                                            {member.role}
                                                        </Typography>
                                                        {member.id === project.creatorId && (
                                                            <Chip
                                                                label="创建者"
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ml: 1, height: 20}}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </TabPanel>

                            {/* 讨论区 */}
                            <TabPanel value={tabValue} index={2}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6">
                                        项目讨论
                                    </Typography>
                                    {(isCreator || isMember) && (
                                        <Button
                                            startIcon={<ForumIcon/>}
                                            variant="contained"
                                            size="small"
                                            onClick={() => router.push(`/messages?projectId=${project.id}`)}
                                        >
                                            发起讨论
                                        </Button>
                                    )}
                                </Box>

                                <Box sx={{textAlign: 'center', py: 4}}>
                                    <Typography color="text.secondary">
                                        项目讨论功能正在开发中
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{mt: 2}}
                                        onClick={() => router.push('/messages')}
                                    >
                                        进入消息中心
                                    </Button>
                                </Box>
                            </TabPanel>
                        </Paper>
                    </Grid>

                    {/* 右侧边栏 */}
                    <Grid item xs={12} md={4}>
                        {/* 创建者信息 */}
                        <Card elevation={0} sx={{mb: 4, borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    项目创建者
                                </Typography>
                                {creator && (
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Avatar
                                            src={getAvatarUrl(creator.avatar)}
                                            alt={creator.name}
                                            sx={{width: 50, height: 50, mr: 2}}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1">
                                                {creator.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {creator.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* 项目成员 */}
                        <Card elevation={0} sx={{mb: 4, borderRadius: 2}}>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6">
                                        团队成员
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {members.length} 人
                                    </Typography>
                                </Box>
                                <AvatarGroup max={5} sx={{mb: 2, justifyContent: 'flex-start'}}>
                                    {members.map((member) => (
                                        <Avatar key={member.id} src={getAvatarUrl(member.avatar)} alt={member.name}/>
                                    ))}
                                </AvatarGroup>
                                {(!isCreator && !isMember) && (
                                    <Button variant="outlined" fullWidth>
                                        申请加入
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* 项目统计 */}
                        <Card elevation={0} sx={{borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    项目统计
                                </Typography>
                                <List disablePadding>
                                    <ListItem sx={{px: 0}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <AssignmentIcon fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="总任务数"
                                            secondary={project.tasks.length}
                                        />
                                    </ListItem>
                                    <ListItem sx={{px: 0}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <CheckIcon fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="已完成任务"
                                            secondary={`${project.tasks.filter(t => t.status === 'COMPLETED').length} 个 (${project.progress}%)`}
                                        />
                                    </ListItem>
                                    <ListItem sx={{px: 0}}>
                                        <ListItemIcon sx={{minWidth: 36}}>
                                            <PersonIcon fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="成员数量"
                                            secondary={members.length}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </PageLayout>
    );
};

export default ProjectDetailPage;
