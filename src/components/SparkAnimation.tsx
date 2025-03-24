'use client';

import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';

interface Spark {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    color: string;
    alpha: number;
    speed: number;
    life: number;
    maxLife: number;
}

const SparkAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = parent.clientWidth * dpr;
                canvas.height = parent.clientHeight * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = `${parent.clientWidth}px`;
                canvas.style.height = `${parent.clientHeight}px`;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const sparks: Spark[] = [];
        const starField: { x: number, y: number, size: number, alpha: number }[] = [];

        // 蓝色调的火花颜色，增加更多色彩变化
        const sparkColors = [
            '#4A90E2', // 中蓝色
            '#5D9CEC', // 亮蓝色
            '#73B1F4', // 淡蓝色
            '#297EFF', // 明亮蓝色
            '#1A5DC6', // 深蓝色
            '#2196F3', // 天蓝色
            '#8BB9FF', // 淡天蓝色
            '#A2D2FF', // 非常淡的蓝色
            '#64B5F6', // Material蓝色
            '#82B1FF', // Material亮蓝色
            '#448AFF', // Material深蓝色
            '#B3E5FC'  // 极淡蓝色
        ];

        // 创建星空背景 - 增加星星数量
        const createStarField = () => {
            const realWidth = canvas.clientWidth;
            const realHeight = canvas.clientHeight;
            const stars = Math.floor((realWidth * realHeight) / 600); // 进一步增加星星密度

            for (let i = 0; i < stars; i++) {
                starField.push({
                    x: Math.random() * realWidth,
                    y: Math.random() * realHeight,
                    size: Math.random() * 1.5, // 稍微增加星星大小
                    alpha: Math.random() * 0.8 + 0.2
                });
            }
        };

        // 初始化火花 - 增加火花数量
        const initSparks = () => {
            const realWidth = canvas.clientWidth;
            const realHeight = canvas.clientHeight;
            // 根据屏幕尺寸适当增加火花数量，确保大屏幕上有更多的火花
            const totalSparks = Math.min(Math.floor(realWidth * realHeight / 8000), 200);

            for (let i = 0; i < totalSparks; i++) {
                createSpark(
                    Math.random() * realWidth,
                    Math.random() * realHeight,
                    true
                );
            }
        };

        // 创建新火花
        const createSpark = (x: number, y: number, isInitial = false) => {
            const speed = isInitial ? Math.random() * 0.5 + 0.1 : Math.random() * 1 + 0.5;
            const maxLife = isInitial ? 100 + Math.random() * 300 : 50 + Math.random() * 150; // 增加生命周期

            const spark: Spark = {
                x,
                y,
                size: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
                alpha: Math.random() * 0.7 + 0.3,
                speed,
                life: 0,
                maxLife
            };

            sparks.push(spark);
            return spark;
        };

        // 更新火花位置，改进边界检测以更自然地循环
        const updateSparks = () => {
            const realWidth = canvas.clientWidth;
            const realHeight = canvas.clientHeight;

            // 检查是否有鼠标互动，增加火花创建概率
            if (mouseRef.current && Math.random() < 0.4) {
                createSpark(
                    mouseRef.current.x,
                    mouseRef.current.y
                );
            }

            for (let i = sparks.length - 1; i >= 0; i--) {
                const spark = sparks[i];

                // 增加生命周期
                spark.life++;

                // 如果超过最大生命周期，移除火花
                if (spark.life > spark.maxLife) {
                    sparks.splice(i, 1);
                    continue;
                }

                // 生命周期末尾透明度降低
                if (spark.life > spark.maxLife * 0.8) {
                    spark.alpha *= 0.95;
                }

                // 移动火花
                spark.x += spark.vx;
                spark.y += spark.vy;

                // 边界检测 - 让火花循环出现在画布的另一边，创造无限空间的感觉
                if (spark.x < -10) spark.x = realWidth + 10;
                if (spark.x > realWidth + 10) spark.x = -10;
                if (spark.y < -10) spark.y = realHeight + 10;
                if (spark.y > realHeight + 10) spark.y = -10;

                // 随机调整速度，模拟自然运动
                if (Math.random() < 0.03) {
                    spark.vx += (Math.random() - 0.5) * 0.1;
                    spark.vy += (Math.random() - 0.5) * 0.1;

                    // 限制最大速度
                    const speed = Math.sqrt(spark.vx * spark.vx + spark.vy * spark.vy);
                    if (speed > spark.speed) {
                        spark.vx = (spark.vx / speed) * spark.speed;
                        spark.vy = (spark.vy / speed) * spark.speed;
                    }
                }
            }

            // 保持最小数量的火花
            const minSparks = Math.min(Math.floor(realWidth * realHeight / 10000), 150);
            if (sparks.length < minSparks && Math.random() < 0.1) {
                createSpark(
                    Math.random() * realWidth,
                    Math.random() * realHeight,
                    true
                );
            }
        };

        // 根据距离获取连线不透明度
        const getLineOpacity = (distance: number, maxDistance: number) => {
            // 二次函数，使得不透明度随距离增加而快速下降
            return Math.pow(1 - distance / maxDistance, 2) * 0.3; // 提高连线不透明度
        };

        // 绘制连接线，增加最大连接距离
        const drawConnections = () => {
            const maxDistance = canvas.clientWidth * 0.2; // 增加连接距离

            for (let i = 0; i < sparks.length; i++) {
                for (let j = i + 1; j < sparks.length; j++) {
                    const spark1 = sparks[i];
                    const spark2 = sparks[j];

                    const dx = spark1.x - spark2.x;
                    const dy = spark1.y - spark2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // 距离越近线越粗，颜色混合
                        const lineOpacity = getLineOpacity(distance, maxDistance);

                        // 渐变线条
                        const gradient = ctx.createLinearGradient(
                            spark1.x, spark1.y, spark2.x, spark2.y
                        );
                        gradient.addColorStop(0, spark1.color.replace(')', `, ${lineOpacity})`).replace('rgb', 'rgba'));
                        gradient.addColorStop(1, spark2.color.replace(')', `, ${lineOpacity})`).replace('rgb', 'rgba'));

                        ctx.beginPath();
                        ctx.moveTo(spark1.x, spark1.y);
                        ctx.lineTo(spark2.x, spark2.y);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = (1 - distance / maxDistance) * 1.5; // 加粗连线
                        ctx.stroke();
                    }
                }
            }
        };

        // 绘制星空背景
        const drawStarField = () => {
            starField.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                // 使用蓝色调星星而不是白色星星，更符合整体颜色风格
                ctx.fillStyle = `rgba(173, 216, 255, ${star.alpha * (0.5 + Math.sin(Date.now() * 0.001) * 0.5)})`;
                ctx.fill();
            });
        };

        // 绘制火花
        const drawSparks = () => {
            for (let i = 0; i < sparks.length; i++) {
                const spark = sparks[i];

                // 绘制发光效果
                const gradient = ctx.createRadialGradient(
                    spark.x, spark.y, 0,
                    spark.x, spark.y, spark.size * 3
                );
                gradient.addColorStop(0, spark.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(spark.x, spark.y, spark.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.globalAlpha = spark.alpha * 0.6; // 增加光晕效果
                ctx.fill();

                // 绘制火花本体
                ctx.beginPath();
                ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                ctx.fillStyle = spark.color;
                ctx.globalAlpha = spark.alpha;
                ctx.fill();

                ctx.globalAlpha = 1.0;
            }
        };

        // 绘制动画帧
        const animate = () => {
            const realWidth = canvas.clientWidth;
            const realHeight = canvas.clientHeight;

            // 清除画布并设置渐变背景，改为蓝色深色背景而非黑色
            ctx.clearRect(0, 0, realWidth, realHeight);

            // 蓝色渐变背景，从深蓝到较深蓝
            const bgGradient = ctx.createLinearGradient(0, 0, 0, realHeight);
            bgGradient.addColorStop(0, '#0c2c63'); // 深蓝色
            bgGradient.addColorStop(1, '#061a3c'); // 更深蓝色

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, realWidth, realHeight);

            // 画星星
            drawStarField();

            // 更新火花位置
            updateSparks();

            // 绘制连接线
            drawConnections();

            // 绘制火花
            drawSparks();

            animationRef.current = requestAnimationFrame(animate);
        };

        // 添加鼠标交互
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = null;
        };

        // 添加触摸交互
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouseRef.current = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };

                // 在移动设备上防止页面滚动
                e.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            mouseRef.current = null;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        createStarField();
        initSparks();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <Box sx={{position: 'relative', width: '100%', height: '100%', minHeight: '100%'}}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block'
                }}
            />
        </Box>
    );
};

export default SparkAnimation;
