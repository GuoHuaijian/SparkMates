'use client';

import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {Add as AddIcon, Comment, FavoriteBorder, Search, Visibility} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {IdeasTestApi} from '@/services/test-api';
import {Idea} from '@/types';
import {formatDate, formatNumber, getAvatarUrl} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

const IdeasPage: React.FC = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('all');
    const [sort, setSort] = useState<string>('newest');
    const [page, setPage] = useState<number>(1);
    const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);

    const ideasPerPage = 8;

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                setLoading(true);
                const allIdeas = await IdeasTestApi.getAll();
                setIdeas(allIdeas);
            } catch (error) {
                console.error('Error fetching ideas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    useEffect(() => {
        // 筛选和排序创意
        let result = [...ideas];

        // 根据搜索关键词筛选
        if (searchQuery) {
            result = result.filter(idea =>
                idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // 根据分类筛选
        if (category !== 'all') {
            result = result.filter(idea => idea.category === category);
        }

        // 排序
        if (sort === 'newest') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'popular') {
            result.sort((a, b) => b.likes - a.likes);
        } else if (sort === 'views') {
            result.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        setFilteredIdeas(result);
    }, [ideas, searchQuery, category, sort]);

    // 分页处理
    const startIndex = (page - 1) * ideasPerPage;
    const displayedIdeas = filteredIdeas.slice(startIndex, startIndex + ideasPerPage);
    const pageCount = Math.ceil(filteredIdeas.length / ideasPerPage);

    // 获取所有可用的分类
    const categories = ['all', ...Array.from(new Set(ideas.map(idea => idea.category)))];

    if (loading) {
        return (
            <PageLayout>
                <Box sx={{textAlign: 'center', py: 8}}>
                    <Typography>加载中...</Typography>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout sx={{mt: 8}}>
            <Box sx={{
                mb: 4,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    width: 4,
                    height: '40px',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(to bottom, #1976d2, #42a5f5)',
                    borderRadius: '0 4px 4px 0'
                },
                pl: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 700}}>
                    创意库
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    浏览社区分享的创意，或发布您自己的创意
                </Typography>
            </Box>

            {/* 搜索和筛选 */}
            <Box
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, rgba(25, 118, 210, 0.03), rgba(66, 165, 245, 0.07))',
                    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(33, 150, 243, 0.08)'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <TextField
                            fullWidth
                            placeholder="搜索创意、标签或描述"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{color: 'primary.main'}}/>
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 1.5,
                                    '&.MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.light',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">分类</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                label="分类"
                                onChange={(e) => setCategory(e.target.value)}
                                sx={{borderRadius: 1.5}}
                            >
                                <MenuItem value="all">全部分类</MenuItem>
                                {categories.filter(cat => cat !== 'all').map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="sort-label">排序</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sort}
                                label="排序"
                                onChange={(e) => setSort(e.target.value)}
                                sx={{borderRadius: 1.5}}
                            >
                                <MenuItem value="newest">最新发布</MenuItem>
                                <MenuItem value="popular">最受欢迎</MenuItem>
                                <MenuItem value="views">浏览最多</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={() => router.push('/ideas/new')}
                            sx={{
                                height: '100%',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #0d47a1 30%, #1976d2 90%)',
                                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            发布创意
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* 创意卡片列表 */}
            <Grid container spacing={3}>
                {displayedIdeas.length > 0 ? (
                    displayedIdeas.map((idea) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idea.id}>
                            <Card
                                elevation={1}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(33, 150, 243, 0.08)',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)'
                                    },
                                    cursor: 'pointer',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #1976d2, #64B5F6)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    },
                                    '&:hover::after': {
                                        opacity: 1,
                                    }
                                }}
                                onClick={() => router.push(`/ideas/${idea.id}`)}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={getAvatarUrl()}
                                            alt={`用户${idea.userId || 'Unknown'}`}
                                            sx={{
                                                border: '2px solid rgba(33, 150, 243, 0.2)',
                                            }}
                                        />
                                    }
                                    title={idea.title}
                                    subheader={formatDate(idea.createdAt)}
                                    titleTypographyProps={{
                                        noWrap: true,
                                        fontWeight: 600,
                                        color: '#1e293b'
                                    }}
                                    subheaderTypographyProps={{
                                        color: 'text.secondary'
                                    }}
                                    sx={{pb: 1}}
                                />
                                <Divider/>
                                <CardContent sx={{flexGrow: 1, pt: 2}}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 2,
                                            height: 60,
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {idea.description}
                                    </Typography>

                                    <Box sx={{mb: 2}}>
                                        <Chip
                                            label={idea.category}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{mr: 1, borderRadius: '6px'}}
                                        />
                                        {idea.tags.slice(0, 3).map((tag, index) => (
                                            <Typography key={index} component="span" sx={{display: 'inline-block'}}>
                                                <Chip
                                                    label={tag}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{mr: 0.5, mb: 0.5}}
                                                />
                                            </Typography>
                                        ))}
                                        {idea.tags.length > 3 && (
                                            <Typography variant="caption" component="span">
                                                +{idea.tags.length - 3}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        pt: 1,
                                        borderTop: '1px solid rgba(33, 150, 243, 0.08)',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <FavoriteBorder sx={{fontSize: 18, color: 'error.main', mr: 0.5}}/>
                                                <Typography variant="caption"
                                                            color="text.secondary">{formatNumber(idea.likes)}</Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Visibility sx={{fontSize: 18, color: 'primary.main', mr: 0.5}}/>
                                                <Typography variant="caption"
                                                            color="text.secondary">{formatNumber(idea.views || 0)}</Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Comment sx={{fontSize: 18, color: 'text.secondary', mr: 0.5}}/>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatNumber(typeof idea.comments === 'number' ? idea.comments :
                                                        (Array.isArray(idea.comments) ? idea.comments.length : 0))}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Chip
                                            label={idea.visibility === 'PUBLIC' ? "公开" : "私密"}
                                            size="small"
                                            color={idea.visibility === 'PUBLIC' ? "success" : "default"}
                                            sx={{
                                                borderRadius: '6px',
                                                height: '22px',
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                    py: 0.1,
                                                    fontSize: '0.65rem'
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            bgcolor: 'rgba(33, 150, 243, 0.03)',
                            borderRadius: 2,
                            border: '1px dashed rgba(33, 150, 243, 0.2)'
                        }}>
                            <Typography variant="h6" color="text.secondary"
                                        gutterBottom>没有找到符合条件的创意</Typography>
                            <Typography variant="body2"
                                        color="text.secondary">尝试调整搜索条件或发布一个新创意</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                sx={{mt: 3}}
                                onClick={() => router.push('/ideas/new')}
                            >
                                发布创意
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* 分页 */}
            {pageCount > 1 && (
                <Box sx={{mt: 6, display: 'flex', justifyContent: 'center'}}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: 1
                            }
                        }}
                    />
                </Box>
            )}
        </PageLayout>
    );
};

export default IdeasPage;
