'use client';

import React, {useEffect, useState} from 'react';
import {
    Avatar,
    AvatarGroup,
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
    LinearProgress,
    ListItemText,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {Add as AddIcon, Assignment as AssignmentIcon, Schedule as ScheduleIcon, Search} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import {ProjectsTestApi} from '@/services/test-api';
import {Project} from '@/types';
import {formatDate, getAvatarUrl} from '@/lib/utils';
import PageLayout from '@/components/PageLayout';

const ProjectsPage: React.FC = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('all');
    const [status, setStatus] = useState<string>('all');
    const [sort, setSort] = useState<string>('newest');
    const [page, setPage] = useState<number>(1);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    const projectsPerPage = 6;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const allProjects = await ProjectsTestApi.getAll();
                setProjects(allProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        // 筛选和排序项目
        let result = [...projects];

        // 根据搜索关键词筛选
        if (searchQuery) {
            result = result.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // 根据分类筛选
        if (category !== 'all') {
            result = result.filter(project => project.category === category);
        }

        // 根据状态筛选
        if (status !== 'all') {
            result = result.filter(project => project.status === status);
        }

        // 排序
        if (sort === 'newest') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'progress') {
            result.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        }

        setFilteredProjects(result);
    }, [projects, searchQuery, category, status, sort]);

    // 分页处理
    const startIndex = (page - 1) * projectsPerPage;
    const displayedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);
    const pageCount = Math.ceil(filteredProjects.length / projectsPerPage);

    // 获取所有可用的分类和状态
    const categories = ['all', ...Array.from(new Set(projects.map(project => project.category)))];
    const statuses = ['all', ...Array.from(new Set(projects.map(project => project.status)))];

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
                    项目列表
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    浏览所有进行中的项目，或创建一个新项目
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
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="搜索项目、标签或描述"
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
                    <Grid item xs={12} sm={6} md={2}>
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
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">状态</InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                label="状态"
                                onChange={(e) => setStatus(e.target.value)}
                                sx={{borderRadius: 1.5}}
                            >
                                <MenuItem value="all">所有状态</MenuItem>
                                {statuses.filter(s => s !== 'all').map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="sort-label">排序</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sort}
                                label="排序"
                                onChange={(e) => setSort(e.target.value)}
                                sx={{borderRadius: 1.5}}
                            >
                                <MenuItem value="newest">最新创建</MenuItem>
                                <MenuItem value="progress">进度优先</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}
                          sx={{display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={() => router.push('/projects/new')}
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
                            创建项目
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* 项目卡片列表 */}
            <Grid container spacing={3}>
                {displayedProjects.length > 0 ? (
                    displayedProjects.map((project) => (
                        <Grid item xs={12} sm={6} md={6} lg={4} key={project.id}>
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
                                onClick={() => router.push(`/projects/${project.id}`)}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={getAvatarUrl()}
                                            alt={`用户${project.creatorId}`}
                                            sx={{
                                                border: '2px solid rgba(33, 150, 243, 0.2)',
                                            }}
                                        />
                                    }
                                    title={project.title}
                                    subheader={formatDate(project.createdAt)}
                                    titleTypographyProps={{
                                        noWrap: true,
                                        fontWeight: 600,
                                        color: '#1e293b'
                                    }}
                                    subheaderTypographyProps={{
                                        color: 'text.secondary'
                                    }}
                                />
                                <Divider/>
                                <CardContent sx={{flexGrow: 1}}>
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
                                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}
                                                            component="span">
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
                                                            <Typography variant="caption" component="span">
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

                                    <Box sx={{mb: 2}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                            <ScheduleIcon sx={{fontSize: 16, color: 'primary.main', mr: 1}}/>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(project.endDate) < new Date()
                                                    ? '已截止'
                                                    : `截止于 ${formatDate(project.endDate)}`}
                                            </Typography>
                                        </Box>

                                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                            <AssignmentIcon sx={{fontSize: 16, color: 'primary.main', mr: 1}}/>
                                            <Typography variant="caption" color="text.secondary">
                                                {`${project.tasks?.filter(t => t.status === 'COMPLETED').length || 0}/${project.tasks?.length || 0} 任务完成`}
                                            </Typography>
                                        </Box>

                                        <Box sx={{mt: 1, mb: 1}}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 0.5
                                            }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    进度: {project.progress || 0}%
                                                </Typography>
                                                <Typography variant="caption" color="text.primary" fontWeight="bold">
                                                    {project.status}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={project.progress || 0}
                                                sx={{
                                                    height: 5,
                                                    borderRadius: 5,
                                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: 'linear-gradient(90deg, #1976d2, #42a5f5)'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Divider sx={{mb: 2, opacity: 0.6}}/>

                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Chip
                                            label={project.category}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{borderRadius: '6px'}}
                                        />

                                        <AvatarGroup max={3} sx={{
                                            '& .MuiAvatar-root': {
                                                width: 28,
                                                height: 28,
                                                fontSize: '0.9rem',
                                                border: '1px solid rgba(33, 150, 243, 0.2)'
                                            }
                                        }}>
                                            {project.members.map((member, idx) => (
                                                <Avatar key={idx} src={getAvatarUrl()} alt={`成员${idx}`}/>
                                            ))}
                                        </AvatarGroup>
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
                                        gutterBottom>没有找到符合条件的项目</Typography>
                            <Typography variant="body2"
                                        color="text.secondary">尝试调整搜索条件或创建一个新项目</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                sx={{mt: 3}}
                                onClick={() => router.push('/projects/new')}
                            >
                                创建项目
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

export default ProjectsPage;
