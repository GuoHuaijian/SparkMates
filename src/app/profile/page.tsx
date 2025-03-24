'use client';

import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Skeleton,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {IdeasTestApi, ProjectsTestApi, UsersTestApi} from '@/services/test-api';
import {Idea, Project, User as BaseUser} from '@/types';
import {formatDate, getAvatarUrl, truncateText} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

// 扩展User接口
interface ExtendedUser extends BaseUser {
    company?: string;
    location?: string;
    website?: string;
    bio: string; // 保持与BaseUser中的bio类型一致
}

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
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{py: 3}}>{children}</Box>}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const {user, loading: authLoading, logout} = useAuth();

    const [profileData, setProfileData] = useState<ExtendedUser | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState<number>(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        role: '',
        company: '',
        location: '',
        website: '',
        avatar: ''
    });
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (authLoading) return;
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                setLoading(true);

                // 获取用户详细信息
                const userData = await UsersTestApi.getById(user.id) as ExtendedUser;
                if (!userData) {
                    setError('无法加载用户信息');
                    return;
                }

                setProfileData(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    role: userData.role || '',
                    company: userData.company || '',
                    location: userData.location || '',
                    website: userData.website || '',
                    avatar: userData.avatar || ''
                });

                // 获取用户的项目
                const projectsData = await ProjectsTestApi.getByUser(user.id);
                setUserProjects(projectsData || []);

                // 获取用户的创意
                const ideasData = await IdeasTestApi.getByUser(user.id);
                setUserIdeas(ideasData || []);

            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('加载个人信息时出错');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSaveProfile = async () => {
        if (!profileData) return;

        try {
            // 在实际应用中，这里会调用API更新用户资料
            setProfileData({
                ...profileData,
                ...formData
            });
            setEditMode(false);
            // 显示成功消息
            alert('个人资料已更新');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('更新个人资料时出错');
        }
    };

    const handleCancelEdit = () => {
        if (!profileData) return;

        setFormData({
            name: profileData.name || '',
            email: profileData.email || '',
            bio: profileData.bio || '',
            role: profileData.role || '',
            company: profileData.company || '',
            location: profileData.location || '',
            website: profileData.website || '',
            avatar: profileData.avatar || ''
        });
        setEditMode(false);
    };

    const handleLogout = () => {
        setOpenLogoutDialog(true);
    };

    const confirmLogout = () => {
        logout();
        setOpenLogoutDialog(false);
        router.push('/login');
    };

    if (loading || authLoading) {
        return (
            <PageLayout>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{p: 3, mb: 3, borderRadius: 2}}>
                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3}}>
                                    <Skeleton variant="circular" width={100} height={100}/>
                                    <Skeleton variant="text" width="60%" height={40} sx={{mt: 1}}/>
                                    <Skeleton variant="text" width="40%" height={20}/>
                                </Box>
                                <Skeleton variant="text" height={30} sx={{mb: 1}}/>
                                <Skeleton variant="text" height={30} sx={{mb: 1}}/>
                                <Skeleton variant="text" height={30} sx={{mb: 1}}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Skeleton variant="rectangular" height={200} sx={{mb: 3, borderRadius: 2}}/>
                            <Skeleton variant="rectangular" height={300} sx={{borderRadius: 2}}/>
                        </Grid>
                    </Grid>
                </Container>
            </PageLayout>
        );
    }

    if (error || !profileData) {
        return (
            <PageLayout>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{mt: 4}}>
                        {error || '无法加载个人信息'}
                    </Alert>
                    <Box sx={{mt: 2, textAlign: 'center'}}>
                        <Button variant="outlined" onClick={() => router.push('/')}>
                            返回首页
                        </Button>
                    </Box>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout sx={{mt: 8}}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* 左侧个人资料 */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{p: 3, mb: 3, borderRadius: 2}}>
                            {/* 头像和姓名 */}
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3}}>
                                {editMode ? (
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        badgeContent={
                                            <IconButton
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    width: 32,
                                                    height: 32,
                                                    '&:hover': {bgcolor: 'primary.dark'}
                                                }}
                                                component="label"
                                            >
                                                <PhotoCameraIcon fontSize="small"/>
                                                <input hidden accept="image/*" type="file"/>
                                            </IconButton>
                                        }
                                    >
                                        <Avatar
                                            src={getAvatarUrl(formData.avatar)}
                                            alt={formData.name}
                                            sx={{width: 100, height: 100, mb: 2}}
                                        />
                                    </Badge>
                                ) : (
                                    <Avatar
                                        src={getAvatarUrl(profileData.avatar)}
                                        alt={profileData.name}
                                        sx={{width: 100, height: 100, mb: 2}}
                                    />
                                )}

                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="name"
                                        label="姓名"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        sx={{mb: 1}}
                                    />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {profileData.name}
                                    </Typography>
                                )}

                                {!editMode && (
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        {profileData.role || '未设置职位'}
                                    </Typography>
                                )}
                            </Box>

                            {/* 个人资料表单 */}
                            <Box sx={{mb: 3}}>
                                {editMode ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name="role"
                                                label="职位"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name="email"
                                                label="邮箱"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name="company"
                                                label="公司/组织"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name="location"
                                                label="所在地"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name="website"
                                                label="个人网站"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                name="bio"
                                                label="个人简介"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <List disablePadding>
                                        <ListItem disableGutters sx={{py: 1}}>
                                            <ListItemText
                                                primary="邮箱"
                                                secondary={profileData.email || '未设置邮箱'}
                                                primaryTypographyProps={{variant: 'subtitle2'}}
                                            />
                                        </ListItem>
                                        <Divider component="li"/>
                                        <ListItem disableGutters sx={{py: 1}}>
                                            <ListItemText
                                                primary="公司/组织"
                                                secondary={profileData.company || '未设置公司/组织'}
                                                primaryTypographyProps={{variant: 'subtitle2'}}
                                            />
                                        </ListItem>
                                        <Divider component="li"/>
                                        <ListItem disableGutters sx={{py: 1}}>
                                            <ListItemText
                                                primary="所在地"
                                                secondary={profileData.location || '未设置所在地'}
                                                primaryTypographyProps={{variant: 'subtitle2'}}
                                            />
                                        </ListItem>
                                        <Divider component="li"/>
                                        <ListItem disableGutters sx={{py: 1}}>
                                            <ListItemText
                                                primary="个人网站"
                                                secondary={profileData.website || '未设置个人网站'}
                                                primaryTypographyProps={{variant: 'subtitle2'}}
                                            />
                                        </ListItem>
                                        <Divider component="li"/>
                                        <ListItem disableGutters sx={{py: 1}}>
                                            <ListItemText
                                                primary="个人简介"
                                                secondary={profileData.bio || '未设置个人简介'}
                                                primaryTypographyProps={{variant: 'subtitle2'}}
                                                secondaryTypographyProps={{sx: {whiteSpace: 'pre-line'}}}
                                            />
                                        </ListItem>
                                    </List>
                                )}
                            </Box>

                            {/* 操作按钮 */}
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                {editMode ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            startIcon={<CancelIcon/>}
                                            onClick={handleCancelEdit}
                                            color="error"
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon/>}
                                            onClick={handleSaveProfile}
                                        >
                                            保存
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleLogout}
                                        >
                                            退出登录
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon/>}
                                            onClick={() => setEditMode(true)}
                                        >
                                            编辑资料
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Paper>

                        {/* 统计信息 */}
                        <Paper elevation={0} sx={{p: 3, borderRadius: 2}}>
                            <Typography variant="h6" gutterBottom>
                                统计数据
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box sx={{textAlign: 'center', p: 2}}>
                                        <Typography variant="h4" color="primary">
                                            {userProjects.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            项目
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{textAlign: 'center', p: 2}}>
                                        <Typography variant="h4" color="primary">
                                            {userIdeas.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            创意
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* 右侧内容标签页 */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{borderRadius: 2}}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                >
                                    <Tab label="我的项目"/>
                                    <Tab label="我的创意"/>
                                </Tabs>
                            </Box>

                            {/* 我的项目 */}
                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h6">
                                        我的项目 ({userProjects.length})
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon/>}
                                        onClick={() => router.push('/projects/new')}
                                    >
                                        创建项目
                                    </Button>
                                </Box>

                                {userProjects.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {userProjects.map((project) => (
                                            <Grid item xs={12} sm={6} key={project.id}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {boxShadow: 3}
                                                    }}
                                                    onClick={() => router.push(`/projects/${project.id}`)}
                                                >
                                                    <CardContent>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            mb: 1
                                                        }}>
                                                            <Typography variant="h6" noWrap sx={{maxWidth: '80%'}}>
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
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mb: 2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}
                                                        >
                                                            {truncateText(project.description, 100)}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Chip
                                                                label={project.category}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                创建于 {formatDate(project.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <Typography color="text.secondary" paragraph>
                                            你还没有创建任何项目
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            onClick={() => router.push('/projects/new')}
                                        >
                                            创建第一个项目
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* 我的创意 */}
                            <TabPanel value={tabValue} index={1}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h6">
                                        我的创意 ({userIdeas.length})
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon/>}
                                        onClick={() => router.push('/ideas/new')}
                                    >
                                        分享创意
                                    </Button>
                                </Box>

                                {userIdeas.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {userIdeas.map((idea) => (
                                            <Grid item xs={12} key={idea.id}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {boxShadow: 3}
                                                    }}
                                                    onClick={() => router.push(`/ideas/${idea.id}`)}
                                                >
                                                    <CardContent>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            mb: 1
                                                        }}>
                                                            <Typography variant="h6">
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
                                                            }}
                                                        >
                                                            {idea.description}
                                                        </Typography>
                                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
                                                            {idea.tags.map((tag, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={tag}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                创建于 {formatDate(idea.createdAt)}
                                                            </Typography>
                                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {idea.likes || 0} 赞
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {idea.comments || 0} 评论
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <Typography color="text.secondary" paragraph>
                                            你还没有分享任何创意
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            onClick={() => router.push('/ideas/new')}
                                        >
                                            分享第一个创意
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* 退出登录确认对话框 */}
            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
            >
                <DialogTitle>确认退出登录</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        你确定要退出登录吗？退出后需要重新登录才能访问个人账户。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)}>取消</Button>
                    <Button onClick={confirmLogout} color="error" autoFocus>
                        确认退出
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default ProfilePage;
