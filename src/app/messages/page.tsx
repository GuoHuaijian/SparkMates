'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    styled,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import {
    AttachFile as AttachFileIcon,
    Circle as CircleIcon,
    EmojiEmotions as EmojiIcon,
    Image as ImageIcon,
    MoreVert as MoreVertIcon,
    Search,
    Send as SendIcon
} from '@mui/icons-material';
import {useAuth} from '@/lib/AuthProvider';
import {MessagesTestApi} from '@/services/test-api';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import {Conversation, Message, User} from '@/types';
import PageLayout from '@/components/PageLayout';

// 自定义Tab样式
const StyledTab = styled(Tab)(({theme}) => ({
    minHeight: '48px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
}));

const MessagesPage: React.FC = () => {
    const {user} = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageText, setMessageText] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tabValue, setTabValue] = useState<number>(0);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 获取对话列表
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const data = await MessagesTestApi.getConversations();
                setConversations(data);
                if (data.length > 0) {
                    setActiveConversation(data[0]);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // 获取当前对话的消息
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeConversation) return;

            try {
                setLoading(true);
                const data = await MessagesTestApi.getMessagesByConversation(activeConversation.id);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [activeConversation]);

    // 滚动到最后一条消息
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
            }, 100);
        }
    }, [messages]);

    // 筛选对话列表
    const filteredConversations = conversations.filter(conv => {
        const participantNames = conv.participants
            .map((p: User) => p.name)
            .join(' ')
            .toLowerCase();
        const lastMessageContent = conv.lastMessage?.content.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return participantNames.includes(query) || lastMessageContent.includes(query);
    });

    // 处理发送消息
    const handleSendMessage = () => {
        if (!messageText.trim() || !activeConversation) return;

        // 模拟发送消息
        const newMessage: Message = {
            id: String(Math.random()),
            conversationId: activeConversation.id,
            sender: user?.id || '',
            content: messageText,
            createdAt: new Date().toISOString(),
            read: true
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
    };

    // 处理回车键发送
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 渲染对话列表项
    const renderConversationItem = (conversation: Conversation) => {
        const otherParticipants = conversation.participants.filter(
            (p: User) => p.id !== user?.id
        );
        const conversationName = otherParticipants.map((p: User) => p.name).join(', ');
        const isActive = activeConversation?.id === conversation.id;
        const hasUnread = conversation.unreadCount > 0;

        return (
            <ListItem
                key={conversation.id}
                alignItems="flex-start"
                sx={{
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'action.selected' : 'background.paper',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    },
                    borderRadius: 1,
                    mb: 0.5,
                    px: 2,
                    py: 1.5
                }}
                onClick={() => setActiveConversation(conversation)}
            >
                <ListItemAvatar>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        badgeContent={
                            conversation.online && (
                                <CircleIcon
                                    sx={{
                                        color: 'success.main',
                                        fontSize: 12,
                                        backgroundColor: 'background.paper',
                                        borderRadius: '50%'
                                    }}
                                />
                            )
                        }
                    >
                        <Avatar src={getAvatarUrl(otherParticipants[0]?.avatar)} alt={conversationName}/>
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: hasUnread ? 'bold' : 'normal',
                                    color: hasUnread ? 'text.primary' : 'text.secondary'
                                }}
                            >
                                {conversationName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(conversation.lastMessage?.timestamp)}
                            </Typography>
                        </Box>
                    }
                    secondary={
                        <Box component="span"
                             sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontWeight: hasUnread ? 'bold' : 'normal',
                                    color: hasUnread ? 'text.primary' : 'text.secondary',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '180px'
                                }}
                            >
                                {conversation.lastMessage?.content}
                            </Typography>
                            {hasUnread && (
                                <Chip
                                    component="span"
                                    label={conversation.unreadCount}
                                    color="primary"
                                    size="small"
                                    sx={{height: 20, width: 20, borderRadius: '50%'}}
                                />
                            )}
                        </Box>
                    }
                />
            </ListItem>
        );
    };

    // 渲染消息气泡
    const renderMessageItem = (message: Message) => {
        const isCurrentUser = message.sender === user?.id;
        const sender = conversations
            .flatMap(c => c.participants)
            .find((p: User) => p.id === message.sender);

        return (
            <Box
                key={message.id}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 2
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                    {!isCurrentUser && (
                        <Avatar
                            src={getAvatarUrl(sender?.avatar)}
                            alt={sender?.name || '用户'}
                            sx={{width: 32, height: 32, mr: 1}}
                        />
                    )}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: '70%',
                            backgroundColor: isCurrentUser ? 'primary.main' : 'grey.100',
                            color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                            ml: isCurrentUser ? 1 : 0,
                            mr: isCurrentUser ? 0 : 1
                        }}
                    >
                        <Typography variant="body2">{message.content}</Typography>
                    </Paper>
                    {isCurrentUser && (
                        <Avatar
                            src={getAvatarUrl(user?.avatar)}
                            alt={user?.name || '当前用户'}
                            sx={{width: 32, height: 32, ml: 1}}
                        />
                    )}
                </Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{mt: 0.5, mx: 6}}
                >
                    {formatDate(message.createdAt)}
                </Typography>
            </Box>
        );
    };

    if (!user) {
        return (
            <PageLayout>
                <Box sx={{textAlign: 'center', py: 8}}>
                    <Typography>请先登录以查看您的消息</Typography>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout sx={{mt: 8}} withPaper={false}>
            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    height: 'calc(100vh - 180px)',
                    maxHeight: '80vh',
                    borderRadius: 2,
                    display: 'flex',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'rgba(33, 150, 243, 0.1)'
                }}
            >
                <Grid container sx={{height: '100%', flexWrap: 'nowrap'}}>
                    {/* 左侧对话列表 */}
                    <Grid
                        item
                        sx={{
                            width: {xs: '100%', sm: '320px'},
                            height: '100%',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            display: {xs: activeConversation ? 'none' : 'flex', sm: 'flex'},
                            flexDirection: 'column',
                            backgroundColor: '#f5f7fa'
                        }}
                    >
                        <Box sx={{p: 2, backgroundColor: 'white'}}>
                            <Typography variant="h6" sx={{mb: 2, fontWeight: 600}}>
                                消息
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="搜索对话"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small"/>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{mb: 2}}
                            />
                            <Tabs
                                value={tabValue}
                                onChange={(_, newValue) => setTabValue(newValue)}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                sx={{
                                    backgroundColor: '#f5f7fa',
                                    borderRadius: 1,
                                    '& .MuiTabs-indicator': {
                                        height: '3px',
                                        borderRadius: '3px'
                                    }
                                }}
                            >
                                <StyledTab label="全部"/>
                                <StyledTab label="未读"/>
                            </Tabs>
                        </Box>

                        <List sx={{
                            overflow: 'auto',
                            flexGrow: 1,
                            p: 1,
                            backgroundColor: '#f5f7fa',
                            height: '100%',
                            overflowY: 'auto'
                        }}>
                            {loading && conversations.length === 0 ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                                    <CircularProgress size={24}/>
                                </Box>
                            ) : filteredConversations.length > 0 ? (
                                filteredConversations
                                    .filter(conv => tabValue === 0 || conv.unreadCount > 0)
                                    .map(renderConversationItem)
                            ) : (
                                <Box sx={{textAlign: 'center', p: 3}}>
                                    <Typography color="text.secondary">
                                        {searchQuery ? '没有找到匹配的对话' : '暂无消息'}
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* 右侧聊天区域 */}
                    <Grid
                        item
                        sx={{
                            flexGrow: 1,
                            height: '100%',
                            display: {xs: activeConversation ? 'flex' : 'none', sm: 'flex'},
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {activeConversation ? (
                            <>
                                {/* 聊天头部 */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Avatar
                                            src={getAvatarUrl(activeConversation.participants[0]?.avatar)}
                                            alt={activeConversation.participants[0]?.name}
                                            sx={{mr: 1}}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                                {activeConversation.participants
                                                    .filter((p: User) => p.id !== user?.id)
                                                    .map((p: User) => p.name)
                                                    .join(', ')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {activeConversation.online ? '在线' : '离线'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton>
                                        <MoreVertIcon/>
                                    </IconButton>
                                </Box>

                                {/* 消息内容区域 */}
                                <Box
                                    sx={{
                                        p: 2,
                                        flexGrow: 1,
                                        overflow: 'auto',
                                        backgroundColor: '#f9f9f9',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative'
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                                            <CircularProgress size={24}/>
                                        </Box>
                                    ) : messages.length > 0 ? (
                                        <Box sx={{flexGrow: 1, overflowY: 'auto', pb: 2}}>
                                            {messages.map(renderMessageItem)}
                                            <div ref={messagesEndRef}/>
                                        </Box>
                                    ) : (
                                        <Box sx={{textAlign: 'center', p: 3}}>
                                            <Typography color="text.secondary">
                                                暂无消息，开始对话吧
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* 输入区域 */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: 'white',
                                        position: 'sticky',
                                        bottom: 0,
                                        width: '100%',
                                        zIndex: 2,
                                        minHeight: '100px'
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        maxRows={4}
                                        placeholder="输入消息..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" sx={{color: 'text.secondary'}}>
                                                        <EmojiIcon/>
                                                    </IconButton>
                                                    <IconButton size="small" sx={{color: 'text.secondary'}}>
                                                        <AttachFileIcon/>
                                                    </IconButton>
                                                    <IconButton size="small" sx={{color: 'text.secondary'}}>
                                                        <ImageIcon/>
                                                    </IconButton>
                                                    <Button
                                                        variant="contained"
                                                        endIcon={<SendIcon/>}
                                                        onClick={handleSendMessage}
                                                        disabled={!messageText.trim()}
                                                        sx={{ml: 1}}
                                                    >
                                                        发送
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Typography color="text.secondary">
                                    选择一个对话开始聊天
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </PageLayout>
    );
};

export default MessagesPage;
