// 优化版星空背景 - 可控性能
(function () {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

    let w, h, stars, shootingStars = [];
    let animationId = null;
    let isRunning = true;
    const STAR_COUNT = 100;

    // 【性能】缓存静态颜色字符串，避免每帧拼接
    const BG_COLOR = '#0a0e1a';
    const STAR_COLOR = 'rgba(255,255,255,0.6)';
    const TAU = 6.283185307; // 2 * Math.PI 预计算

    function resize() {
        const dpr = window.devicePixelRatio > 1 ? 1.5 : 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createStars() {
        stars = new Float32Array(STAR_COUNT * 4); // x, y, r, phase
        for (let i = 0; i < STAR_COUNT; i++) {
            const off = i * 4;
            stars[off] = Math.random() * w;
            stars[off + 1] = Math.random() * h;
            stars[off + 2] = Math.random() * 1.2 + 0.4;
            stars[off + 3] = Math.random() * TAU;
        }
    }

    function maybeSpawnShootingStar() {
        if (Math.random() < 0.002 && shootingStars.length < 1) {
            shootingStars.push({
                x: Math.random() * w * 0.8,
                y: Math.random() * h * 0.3,
                len: 50 + Math.random() * 60,
                speed: 5 + Math.random() * 3,
                angle: 0.7 + Math.random() * 0.3,
                // 【性能】预计算 cos/sin，避免每帧重复计算
                cos: 0, sin: 0,
                life: 1
            });
            const s = shootingStars[shootingStars.length - 1];
            s.cos = Math.cos(s.angle);
            s.sin = Math.sin(s.angle);
        }
    }

    // 【性能】帧计数器，星星闪烁隔帧更新
    let frameCount = 0;
    let cachedAlphas = new Uint8Array(STAR_COUNT); // 0 = skip, 1 = draw

    function draw(time) {
        if (!isRunning) return;
        
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);
        
        // 【性能】每 2 帧才重新计算星星可见性，减少 Math.sin 调用 50%
        if (frameCount % 2 === 0) {
            const t = time * 0.0006;
            for (let i = 0; i < STAR_COUNT; i++) {
                const alpha = 0.4 + 0.6 * Math.sin(t + stars[i * 4 + 3]);
                cachedAlphas[i] = alpha > 0.5 ? 1 : 0;
            }
        }
        frameCount++;

        ctx.fillStyle = STAR_COLOR;
        ctx.beginPath();
        for (let i = 0; i < STAR_COUNT; i++) {
            if (cachedAlphas[i]) {
                const off = i * 4;
                ctx.moveTo(stars[off] + stars[off + 2], stars[off + 1]);
                ctx.arc(stars[off], stars[off + 1], stars[off + 2], 0, TAU);
            }
        }
        ctx.fill();

        // 流星
        if (Math.random() < 0.5) maybeSpawnShootingStar();
        
        // 【性能】用 writeIdx 替代 splice，避免数组重排
        let writeIdx = 0;
        for (let i = 0; i < shootingStars.length; i++) {
            const s = shootingStars[i];
            const dx = s.cos * s.len;
            const dy = s.sin * s.len;
            const grad = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
            grad.addColorStop(0, `rgba(255,255,255,${s.life * 0.7})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + dx, s.y + dy);
            ctx.stroke();
            s.x += s.cos * s.speed;
            s.y += s.sin * s.speed;
            s.life -= 0.02;
            if (s.life > 0 && s.x <= w && s.y <= h) {
                shootingStars[writeIdx++] = s;
            }
        }
        shootingStars.length = writeIdx;

        animationId = requestAnimationFrame(draw);
    }

    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);
    }

    function start() {
        if (isRunning) return;
        isRunning = true;
        requestAnimationFrame(draw);
    }

    window.starsControl = { stop, start, isRunning: () => isRunning };

    resize();
    createStars();
    requestAnimationFrame(draw);
    
    let resizeTimer;
    // 【性能】passive: true 让浏览器知道不会 preventDefault，优化滚动/resize 性能
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            createStars();
            // 【性能】resize 后重新分配 cachedAlphas
            cachedAlphas = new Uint8Array(STAR_COUNT);
        }, 200);
    }, { passive: true });
})();
