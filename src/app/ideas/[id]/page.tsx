'use client';

import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Skeleton,
    TextField,
    Typography
} from '@mui/material';
import {
    ArrowBack,
    Bookmark,
    BookmarkBorder,
    Comment as CommentIcon,
    Send as SendIcon,
    Share,
    ThumbUp,
    ThumbUpOutlined,
    Visibility
} from '@mui/icons-material';
import {useParams, useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {IdeasTestApi, UsersTestApi} from '@/services/test-api';
import {Idea, User} from '@/types';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

const IdeaDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const {user} = useAuth();
    const ideaId = params?.id as string;

    const [idea, setIdea] = useState<Idea | null>(null);
    const [creator, setCreator] = useState<User | null>(null);
    const [collaborators, setCollaborators] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>('');
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const fetchIdeaDetails = async () => {
            if (!ideaId) return;

            try {
                setLoading(true);
                const ideaData = await IdeasTestApi.getById(ideaId);

                if (!ideaData) {
                    setError('创意不存在或已被删除');
                    return;
                }

                setIdea(ideaData);

                // 获取创建者信息
                if (ideaData.userId) {
                    const creatorData = await UsersTestApi.getById(ideaData.userId);
                    setCreator(creatorData);
                }

                // 获取协作者信息
                const collaboratorsData = await Promise.all(
                    ideaData.collaborators.map(id => typeof id === 'string' ? UsersTestApi.getById(id) : null)
                );
                setCollaborators(collaboratorsData.filter(Boolean) as User[]);

                // 模拟评论数据
                setComments([
                    {
                        id: '1',
                        userId: 'user2',
                        userName: '张伟',
                        userAvatar: '/avatars/user2.jpg',
                        content: '这个创意非常有前景，我认为可以从用户体验方面进一步完善。',
                        createdAt: '2023-08-25T09:30:00Z',
                        likes: 3
                    },
                    {
                        id: '2',
                        userId: 'user3',
                        userName: '王芳',
                        userAvatar: '/avatars/user3.jpg',
                        content: '我有一些市场推广的想法，这个创意如果结合我们的营销策略，可以吸引更多目标用户。',
                        createdAt: '2023-08-26T14:15:00Z',
                        likes: 2
                    }
                ]);

            } catch (err) {
                console.error('Error fetching idea details:', err);
                setError('加载创意详情时出错');
            } finally {
                setLoading(false);
            }
        };

        fetchIdeaDetails();
    }, [ideaId]);

    const handleLike = () => {
        setLiked(!liked);
        if (!liked && idea) {
            // 增加点赞数
            setIdea({
                ...idea,
                likes: idea.likes + 1
            });
        } else if (liked && idea) {
            // 减少点赞数
            setIdea({
                ...idea,
                likes: idea.likes - 1
            });
        }
    };

    const handleSave = () => {
        setSaved(!saved);
    };

    const handleSubmitComment = () => {
        if (!commentText.trim() || !user) return;

        const newComment = {
            id: `comment-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar || '',
            content: commentText,
            createdAt: new Date().toISOString(),
            likes: 0
        };

        setComments([newComment, ...comments]);
        setCommentText('');

        // 增加评论数
        if (idea) {
            setIdea({
                ...idea,
                comments: typeof idea.comments === 'number'
                    ? idea.comments + 1
                    : (Array.isArray(idea.comments)
                        ? [...idea.comments, newComment]
                        : [newComment])
            });
        }
    };

    const handleCreateProject = async () => {
        if (!idea || !user) return;

        try {
            // 在实际应用中，会调用API创建项目
            // 这里我们直接跳转到新建项目页面
            router.push(`/projects/new?ideaId=${idea.id}`);
        } catch (err) {
            console.error('Error creating project:', err);
        }
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

    if (error || !idea) {
        return (
            <PageLayout sx={{mt: 8}}>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{mt: 4}}>
                        {error || '无法加载创意详情'}
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

    return (
        <PageLayout sx={{mt: 8}}>
            <Container maxWidth="lg">
                {/* 返回按钮和标题 */}
                <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                    <IconButton onClick={handleGoBack} sx={{mr: 2}}>
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        {idea.title}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* 左侧主要内容 */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{p: 3, mb: 4, borderRadius: 2}}>
                            {/* 创建者信息 */}
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                                <Avatar
                                    src={getAvatarUrl(creator?.avatar)}
                                    alt={creator?.name || ''}
                                    sx={{width: 50, height: 50, mr: 2}}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {creator?.name || '未知用户'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        发布于 {formatDate(idea.createdAt)}
                                        {idea.updatedAt !== idea.createdAt && ` · 更新于 ${formatDate(idea.updatedAt)}`}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 分类和标签 */}
                            <Box sx={{mb: 3}}>
                                <Chip
                                    label={idea.category}
                                    color="primary"
                                    sx={{mr: 1, mb: 1}}
                                />
                                {idea.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        variant="outlined"
                                        sx={{mr: 1, mb: 1}}
                                    />
                                ))}
                                <Chip
                                    label={idea.visibility === 'PUBLIC' ? '公开' : '私密'}
                                    color={idea.visibility === 'PUBLIC' ? 'success' : 'default'}
                                    variant="outlined"
                                    sx={{mr: 1, mb: 1}}
                                />
                            </Box>

                            <Divider sx={{my: 3}}/>

                            {/* 创意描述 */}
                            <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line'}}>
                                {idea.description}
                            </Typography>

                            <Divider sx={{my: 3}}/>

                            {/* 操作按钮 */}
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Box>
                                    <IconButton color={liked ? 'primary' : 'default'} onClick={handleLike}>
                                        {liked ? <ThumbUp/> : <ThumbUpOutlined/>}
                                    </IconButton>
                                    <Typography variant="body2" component="span" sx={{mr: 2}}>
                                        {idea.likes}
                                    </Typography>

                                    <IconButton color="default">
                                        <Visibility/>
                                    </IconButton>
                                    <Typography variant="body2" component="span" sx={{mr: 2}}>
                                        {idea.views}
                                    </Typography>

                                    <IconButton color="default">
                                        <CommentIcon/>
                                    </IconButton>
                                    <Typography variant="body2" component="span">
                                        {idea.comments}
                                    </Typography>
                                </Box>

                                <Box>
                                    <IconButton color={saved ? 'primary' : 'default'} onClick={handleSave}>
                                        {saved ? <Bookmark/> : <BookmarkBorder/>}
                                    </IconButton>
                                    <IconButton color="default">
                                        <Share/>
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCreateProject}
                                        sx={{ml: 1}}
                                    >
                                        创建项目
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>

                        {/* 评论区 */}
                        <Paper elevation={0} sx={{p: 3, borderRadius: 2}}>
                            <Typography variant="h6" gutterBottom>
                                评论 ({idea.comments})
                            </Typography>

                            {/* 评论输入框 */}
                            {user && (
                                <Box sx={{display: 'flex', mb: 4}}>
                                    <Avatar
                                        src={getAvatarUrl(user.avatar)}
                                        alt={user.name}
                                        sx={{mr: 2}}
                                    />
                                    <TextField
                                        fullWidth
                                        placeholder="添加评论..."
                                        multiline
                                        rows={2}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    color="primary"
                                                    onClick={handleSubmitComment}
                                                    disabled={!commentText.trim()}
                                                    sx={{alignSelf: 'flex-end'}}
                                                >
                                                    <SendIcon/>
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Box>
                            )}

                            {/* 评论列表 */}
                            <List>
                                {comments.map((comment) => (
                                    <React.Fragment key={comment.id}>
                                        <ListItem alignItems="flex-start" sx={{px: 0}}>
                                            <ListItemAvatar>
                                                <Avatar src={getAvatarUrl(comment.userAvatar)} alt={comment.userName}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Typography variant="subtitle2">
                                                            {comment.userName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(comment.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{mt: 1}}>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.primary"
                                                            sx={{whiteSpace: 'pre-line'}}
                                                        >
                                                            {comment.content}
                                                        </Typography>
                                                        <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                                                            <IconButton size="small">
                                                                <ThumbUpOutlined fontSize="small"/>
                                                            </IconButton>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {comment.likes}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li"/>
                                    </React.Fragment>
                                ))}

                                {comments.length === 0 && (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <Typography color="text.secondary">
                                            暂无评论，成为第一个评论的人吧！
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* 右侧边栏 */}
                    <Grid item xs={12} md={4}>
                        {/* 协作者 */}
                        <Card elevation={0} sx={{mb: 4, borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    协作者
                                </Typography>
                                <List>
                                    {collaborators.length > 0 ? (
                                        collaborators.map((collaborator) => (
                                            <ListItem key={collaborator.id} sx={{px: 0}}>
                                                <ListItemAvatar>
                                                    <Avatar src={getAvatarUrl(collaborator.avatar)}
                                                            alt={collaborator.name}/>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={collaborator.name}
                                                    secondary={collaborator.role}
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{py: 2}}>
                                            暂无协作者
                                        </Typography>
                                    )}
                                </List>
                                {user && user.id !== idea.userId && (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{mt: 1}}
                                    >
                                        申请协作
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* 相关创意 */}
                        <Card elevation={0} sx={{borderRadius: 2}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    相关创意
                                </Typography>
                                <List>
                                    <ListItem
                                        component="div"
                                        sx={{px: 0, cursor: 'pointer'}}
                                        onClick={() => router.push(`/ideas/idea2`)}
                                    >
                                        <ListItemText
                                            primary="可持续时尚电商平台"
                                            secondary="创建一个专注于可持续和道德时尚的电商平台..."
                                        />
                                    </ListItem>
                                    <Divider component="li"/>
                                    <ListItem
                                        component="div"
                                        sx={{px: 0, cursor: 'pointer'}}
                                        onClick={() => router.push(`/ideas/idea3`)}
                                    >
                                        <ListItemText
                                            primary="社区农业连接应用"
                                            secondary="开发一个应用，连接本地农民与消费者..."
                                        />
                                    </ListItem>
                                    <Divider component="li"/>
                                    <ListItem
                                        component="div"
                                        sx={{px: 0, cursor: 'pointer'}}
                                        onClick={() => router.push(`/ideas/idea4`)}
                                    >
                                        <ListItemText
                                            primary="学习技能交换平台"
                                            secondary="创建一个平台，让用户可以交换技能学习时间..."
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

export default IdeaDetailPage;
