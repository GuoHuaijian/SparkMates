'use client';

import React, {useRef, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    TextField,
    Typography
} from '@mui/material';
import {ArrowBack, CloudUpload as CloudUploadIcon, Delete as DeleteIcon,} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import PageLayout from '@/components/PageLayout';
import {Project} from '@/types';
import {ProjectsTestApi} from '@/services/test-api';

const NewProjectPage: React.FC = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(
        new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    );
    const [budget, setBudget] = useState<number>(0);
    const [teamSize, setTeamSize] = useState<number>(1);
    const [status, setStatus] = useState<'规划中' | '进行中' | '已完成' | '已暂停'>('规划中');
    const [progress, setProgress] = useState<number>(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['技术开发', '艺术创作', '社会公益', '教育培训', '环境保护', '健康医疗', '其他'];
    const statusOptions = [
        {value: '规划中', label: '规划中'},
        {value: '进行中', label: '进行中'},
        {value: '已完成', label: '已完成'},
        {value: '已暂停', label: '已暂停'}
    ];

    const handleAddTag = () => {
        if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
            setTags([...tags, tagInput]);
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !category || !startDate || !endDate) {
            setError('请填写所有必填字段');
            return;
        }

        if (startDate && endDate && startDate > endDate) {
            setError('结束日期必须晚于开始日期');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 创建项目对象
            const newProject: Partial<Project> = {
                title,
                description,
                category,
                tags,
                creatorId: user?.id || '',
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                status,
                progress,
                members: [user?.id || ''],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tasks: [],
            };

            // 调用API保存项目
            const createdProject = await ProjectsTestApi.create(newProject);

            // 显示成功消息
            setSuccess(true);

            // 延迟后跳转到项目详情页
            setTimeout(() => {
                router.push(`/projects/${createdProject.id}`);
            }, 1500);

        } catch (err) {
            console.error('Error creating project:', err);
            setError('创建项目时出错，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <PageLayout>
                <Box sx={{textAlign: 'center', py: 8}}>
                    <Typography variant="h6" gutterBottom>请先登录</Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        您需要登录才能创建项目
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/login')}
                        sx={{mt: 2}}
                    >
                        前往登录
                    </Button>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout sx={{mt: 8}}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
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
                <Button
                    startIcon={<ArrowBack/>}
                    onClick={() => router.back()}
                    sx={{mr: 2}}
                >
                    返回
                </Button>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 700}}>
                        创建新项目
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        创建一个新项目并邀请团队成员加入协作
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{mb: 3}}>
                    项目创建成功！正在跳转到项目详情页...
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(246, 249, 252, 0.9))'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="项目名称"
                                placeholder="给您的项目起一个名称"
                                fullWidth
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    sx: {borderRadius: 1.5}
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="项目描述"
                                placeholder="详细描述您的项目，包括目标、背景、预期成果等"
                                fullWidth
                                required
                                multiline
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    sx: {borderRadius: 1.5}
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="category-label">项目分类</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={category}
                                    label="项目分类"
                                    onChange={(e) => setCategory(e.target.value)}
                                    sx={{borderRadius: 1.5}}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">项目状态</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={status}
                                    label="项目状态"
                                    onChange={(e) => setStatus(e.target.value as '规划中' | '进行中' | '已完成' | '已暂停')}
                                    sx={{borderRadius: 1.5}}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="开始日期"
                                type="date"
                                fullWidth
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{shrink: true}}
                                sx={{'.MuiOutlinedInput-root': {borderRadius: 1.5}}}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="预计完成日期"
                                type="date"
                                fullWidth
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{shrink: true}}
                                sx={{'.MuiOutlinedInput-root': {borderRadius: 1.5}}}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="预算"
                                type="number"
                                fullWidth
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                                    sx: {borderRadius: 1.5}
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{px: 2}}>
                                <Typography gutterBottom>团队规模</Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs>
                                        <Slider
                                            value={teamSize}
                                            onChange={(_, newValue) => setTeamSize(newValue as number)}
                                            min={1}
                                            max={10}
                                            valueLabelDisplay="auto"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography>{teamSize} 人</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{px: 2}}>
                                <Typography gutterBottom>项目进度 ({progress}%)</Typography>
                                <Slider
                                    value={progress}
                                    onChange={(_, newValue) => setProgress(newValue as number)}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{my: 1}}/>
                            <Box sx={{mb: 1}}>
                                <Typography variant="subtitle2" gutterBottom>标签（最多5个）</Typography>
                                <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                                    <TextField
                                        placeholder="添加标签"
                                        fullWidth
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        sx={{mr: 1}}
                                        InputProps={{
                                            sx: {borderRadius: 1.5}
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddTag}
                                        disabled={!tagInput || tags.length >= 5}
                                    >
                                        添加
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleDeleteTag(tag)}
                                        sx={{
                                            borderRadius: '6px',
                                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                            color: '#1976d2',
                                            border: '1px solid rgba(33, 150, 243, 0.12)'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{my: 2}}/>
                            <Typography variant="subtitle2" gutterBottom>
                                上传项目封面（可选）
                            </Typography>

                            <input
                                type="file"
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />

                            {!imagePreview ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon/>}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    选择图片
                                </Button>
                            ) : (
                                <Box sx={{mt: 2, position: 'relative'}}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleRemoveImage}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.8)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={12} sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                variant="outlined"
                                onClick={() => router.back()}
                                sx={{mr: 2}}
                            >
                                取消
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !title || !description || !category || !startDate || !endDate}
                                startIcon={loading && <CircularProgress size={20} color="inherit"/>}
                                sx={{
                                    minWidth: 120,
                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #0d47a1 30%, #1976d2 90%)',
                                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {loading ? '提交中...' : '创建项目'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageLayout>
    );
};

export default NewProjectPage;
