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
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {ArrowBack, CloudUpload as CloudUploadIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/AuthProvider';
import PageLayout from '@/components/PageLayout';
import {Idea} from '@/types';
import {IdeasTestApi} from '@/services/test-api';

const NewIdeaPage: React.FC = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['技术创新', '艺术设计', '社会创业', '教育创新', '环保项目', '健康医疗', '其他'];

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

        if (!title || !description || !category) {
            setError('请填写所有必填字段');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 创建创意对象
            const newIdea: Partial<Idea> = {
                title,
                description,
                category,
                visibility,
                tags,
                userId: user?.id || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                likes: 0,
                views: 0,
                comments: 0,
            };

            // 调用API保存创意
            const createdIdea = await IdeasTestApi.create(newIdea);

            // 显示成功消息
            setSuccess(true);

            // 延迟后跳转到创意详情页
            setTimeout(() => {
                router.push(`/ideas/${createdIdea.id}`);
            }, 1500);

        } catch (err) {
            console.error('Error creating idea:', err);
            setError('创建创意时出错，请稍后再试');
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
                        您需要登录才能发布创意
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
                        发布新创意
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        分享您的创意，寻找志同道合的合作伙伴
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
                    创意发布成功！正在跳转到创意详情页...
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
                                label="创意标题"
                                placeholder="为您的创意取一个吸引人的标题"
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
                                label="创意描述"
                                placeholder="详细描述您的创意，包括背景、目标、潜在价值等"
                                fullWidth
                                required
                                multiline
                                rows={6}
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
                                <InputLabel id="category-label">创意分类</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={category}
                                    label="创意分类"
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
                                <InputLabel id="visibility-label">可见性</InputLabel>
                                <Select
                                    labelId="visibility-label"
                                    value={visibility}
                                    label="可见性"
                                    onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')}
                                    sx={{borderRadius: 1.5}}
                                >
                                    <MenuItem value="PUBLIC">公开</MenuItem>
                                    <MenuItem value="PRIVATE">私密</MenuItem>
                                </Select>
                                <FormHelperText>
                                    公开的创意对所有人可见，私密创意仅对您可见
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
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
                                上传封面图片（可选）
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
                                disabled={loading || !title || !description || !category}
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
                                {loading ? '提交中...' : '发布创意'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageLayout>
    );
};

export default NewIdeaPage;
