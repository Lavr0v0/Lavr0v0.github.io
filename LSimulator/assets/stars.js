// 高性能星空背景 - 批量渲染 + 流星 + GPU优化
(function () {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let w, h, stars, shootingStars = [];
    const STAR_COUNT = 180;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
            stars[off + 2] = Math.random() * 1.4 + 0.3;
            stars[off + 3] = Math.random() * 6.28;
        }
    }

    function maybeSpawnShootingStar() {
        if (Math.random() < 0.003 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * w * 0.8,
                y: Math.random() * h * 0.3,
                len: 60 + Math.random() * 80,
                speed: 4 + Math.random() * 4,
                angle: 0.6 + Math.random() * 0.4,
                life: 1
            });
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, w, h);
        const t = time * 0.0008;

        // 批量绘制星星 - 按亮度分组减少fillStyle切换
        for (let batch = 0; batch < 4; batch++) {
            const alphaBase = 0.3 + batch * 0.18;
            ctx.fillStyle = `rgba(255,255,255,${alphaBase})`;
            ctx.beginPath();
            for (let i = batch; i < STAR_COUNT; i += 4) {
                const off = i * 4;
                const alpha = 0.35 + 0.65 * Math.sin(t + stars[off + 3]);
                if (Math.abs(alpha - alphaBase) < 0.15) {
                    ctx.moveTo(stars[off] + stars[off + 2], stars[off + 1]);
                    ctx.arc(stars[off], stars[off + 1], stars[off + 2], 0, 6.28);
                }
            }
            ctx.fill();
        }

        // 流星
        maybeSpawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            const dx = Math.cos(s.angle) * s.len;
            const dy = Math.sin(s.angle) * s.len;
            const grad = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
            grad.addColorStop(0, `rgba(255,255,255,${s.life * 0.8})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + dx, s.y + dy);
            ctx.stroke();
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.life -= 0.015;
            if (s.life <= 0 || s.x > w || s.y > h) shootingStars.splice(i, 1);
        }

        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); createStars(); });
})();
