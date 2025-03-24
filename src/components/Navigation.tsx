'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    IconButton,
    Link as MuiLink,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    AssignmentTurnedIn as ProjectIcon,
    Dashboard as DashboardIcon,
    Lightbulb as LightbulbIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {useAuth} from '@/lib/AuthProvider';

const Navigation: React.FC = () => {
    const {user, logout} = useAuth();
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    const menuItems = [
        {text: '仪表板', icon: <DashboardIcon/>, path: '/dashboard'},
        {text: '探索', icon: <SearchIcon/>, path: '/explore'},
        {text: '创意库', icon: <LightbulbIcon/>, path: '/ideas'},
        {text: '项目', icon: <ProjectIcon/>, path: '/projects'},
        {text: '消息', icon: <MessageIcon/>, path: '/messages'},
    ];

    const renderMobileDrawer = () => (
        <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{keepMounted: true}}
        >
            <Box
                sx={{
                    width: 250,
                    background: 'linear-gradient(180deg, #0a4193 0%, #0d47a1 100%)',
                    height: '100%',
                    color: 'white'
                }}
                role="presentation"
            >
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        mb: 1
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        SparkMates
                    </Typography>
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            onClick={handleDrawerToggle}
                            sx={{
                                color: isActive(item.path) ? '#64B5F6' : 'rgba(255, 255, 255, 0.85)',
                                backgroundColor: isActive(item.path) ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                }
                            }}
                        >
                            <Link href={item.path} style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                                width: '100%'
                            }}>
                                <ListItemIcon
                                    sx={{color: isActive(item.path) ? '#64B5F6' : 'rgba(255, 255, 255, 0.7)'}}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'linear-gradient(90deg, #0a4193, #0d47a1)',
                    borderBottom: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, fontWeight: 'bold'}}
                    >
                        <Link href="/" passHref legacyBehavior>
                            <MuiLink color="inherit" underline="none">
                                SparkMates | 创意协作平台
                            </MuiLink>
                        </Link>
                    </Typography>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}, fontWeight: 'bold'}}
                    >
                        <Link href="/" passHref legacyBehavior>
                            <MuiLink color="inherit" underline="none">
                                SparkMates
                            </MuiLink>
                        </Link>
                    </Typography>

                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    )}

                    {!isMobile && (
                        <Box sx={{flexGrow: 1, display: 'flex'}}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    component={Link}
                                    href={item.path}
                                    startIcon={item.icon}
                                    color="inherit"
                                    sx={{
                                        mr: 1,
                                        fontWeight: isActive(item.path) ? 600 : 400,
                                        color: isActive(item.path) ? '#90CAF9' : 'inherit',
                                        position: 'relative',
                                        '&::after': isActive(item.path) ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: '50%',
                                            bottom: 0,
                                            width: '50%',
                                            height: 3,
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#64B5F6',
                                            borderRadius: '2px'
                                        } : {},
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{flexGrow: 0}}>
                        {user ? (
                            <>
                                <IconButton color="inherit" sx={{mr: 1}}>
                                    <Link href="/notifications" style={{color: 'inherit'}}>
                                        <Badge badgeContent={4} color="error">
                                            <NotificationsIcon/>
                                        </Badge>
                                    </Link>
                                </IconButton>

                                <IconButton
                                    edge="end"
                                    onClick={handleProfileMenuOpen}
                                    sx={{
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        padding: '3px',
                                        '&:hover': {
                                            border: '2px solid rgba(255, 255, 255, 0.5)'
                                        }
                                    }}
                                >
                                    <Avatar
                                        alt={user.name}
                                        src={user.avatar || undefined}
                                        sx={{width: 32, height: 32}}
                                    />
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            backgroundColor: '#0a4193',
                                            color: 'white',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleMenuClose}
                                              sx={{'&:hover': {backgroundColor: 'rgba(33, 150, 243, 0.1)'}}}>
                                        <Link href="/profile" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            width: '100%'
                                        }}>
                                            <ListItemIcon>
                                                <PersonIcon fontSize="small" sx={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                                            </ListItemIcon>
                                            个人资料
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}
                                              sx={{'&:hover': {backgroundColor: 'rgba(33, 150, 243, 0.1)'}}}>退出登录</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Link href="/login" style={{textDecoration: 'none'}}>
                                    <Button
                                        color="inherit"
                                        sx={{
                                            marginRight: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        登录
                                    </Button>
                                </Link>
                                <Link href="/register" style={{textDecoration: 'none'}}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#2196F3',
                                            '&:hover': {
                                                backgroundColor: '#1976D2'
                                            }
                                        }}
                                    >
                                        注册
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {renderMobileDrawer()}
        </>
    );
};

export default Navigation;
