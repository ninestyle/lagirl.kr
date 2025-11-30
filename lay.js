/*
    Version: 3.2.2 (Standard)
    Framework: User Configuration (Tier 3)
    Last Modified: 2025-11-30
    Theme: CHUU - Pastel Dream
*/

const siteConfig = {
    // [Core Options]
    language: 'ko',
    TURNSTILE_SITE_KEY: '', // 데모 모드

    // [Canvas Options]
    canvas_effect: 'heartEffect',
    canvas_image_type: 'cover',
    canvas_image_path: './section/home/',
    canvas_image_count: 3,
    canvas_image_format: 'jpg',
    canvas_image_slide: 10,
    canvas_indicators: true,
    canvas_overlay: 'dotted',

    // [Action Buttons]
    icon_buttons: [
        { name: 'Profile', icon: 'mail', url: '#profile' },
        { name: 'Search', icon: 'search', url: '#search' },
        { name: 'Request', icon: 'auto_awesome', url: '#demo' }
    ],
    
    // [Dev Options]
    demo_mode: true
};

/* [Custom Effect] Heart Effect (Lightweight V3.2)
    - Core provides: ctx, width, height, canvas
    - User implements: init, resize, animate
*/
const heartEffect = {
    ctx: null,
    width: 0,
    height: 0,
    hearts: [],
    sparkles: [],
    mouse: { x: null, y: null, radius: 100 },
    animationFrameId: null,
    heartBaseColors: [ [224, 187, 228], [255, 181, 197], [255, 244, 224], [201, 134, 150] ],

    // Core가 호출 (환경 주입)
    init: function({ ctx, width, height, canvas }) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.canvas = canvas; // 이벤트 리스너용

        this.createHearts();
        this.addListeners();
        this.animate();
    },

    // Core가 리사이즈 시 호출
    resize: function(width, height) {
        this.width = width;
        this.height = height;
        if(this.hearts.length === 0) this.createHearts();
    },

    addListeners: function() {
        // canvas 요소에 직접 바인딩
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    },

    createHearts: function() {
        this.hearts = [];
        for (let i = 0; i < 40; i++) this.addHeart();
    },

    addHeart: function() {
        let size = (Math.random() * 20) + 10;
        let x = Math.random() * this.width;
        let y = Math.random() * this.height;
        let directionX = (Math.random() * 0.6) - 0.3;
        let directionY = (Math.random() * 0.6) - 0.3;
        const base = this.heartBaseColors[Math.floor(Math.random() * 4)];
        const color = `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${Math.random() * 0.5 + 0.3})`;
        const rotation = (Math.random() - 0.5) * 0.8;
        
        this.hearts.push({
            x, y, directionX, directionY, size, color, rotation,
            update: (parent) => {
                if (this.x > parent.width + this.size || this.x < -this.size) this.x = (this.directionX > 0) ? -this.size : parent.width + this.size;
                if (this.y > parent.height + this.size || this.y < -this.size) this.y = (this.directionY > 0) ? -this.size : parent.height + this.size;
                
                if (parent.mouse.x !== null) {
                    let dx = parent.mouse.x - this.x;
                    let dy = parent.mouse.y - this.y;
                    if (Math.sqrt(dx*dx + dy*dy) < parent.mouse.radius + this.size) { this.x -= dx/20; this.y -= dy/20; }
                }
                this.x += this.directionX; this.y += this.directionY;
                parent.drawHeart(this.x, this.y, this.size, this.color, this.rotation);
            }
        });
    },

    drawHeart: function(x, y, size, color, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.translate(-x, -y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const topY = y + size * 0.3;
        const bottomY = y + size;
        const centerX = x;
        const leftX = x - size / 2;
        const rightX = x + size / 2;
        this.ctx.moveTo(centerX, topY);
        this.ctx.bezierCurveTo(centerX, y, leftX, y, leftX, topY);
        this.ctx.bezierCurveTo(leftX, y + (size + size * 0.3) / 2, centerX, y + (size + size * 0.3) / 1.5, centerX, bottomY);
        this.ctx.bezierCurveTo(centerX, y + (size + size * 0.3) / 1.5, rightX, y + (size + size * 0.3) / 2, rightX, topY);
        this.ctx.bezierCurveTo(rightX, y, centerX, y, centerX, topY);
        this.ctx.fill();
        this.ctx.restore();
    },

    animate: function() {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.hearts.forEach(h => h.update(this));
        
        // Sparkles
        if (Math.random() > 0.9) {
            this.sparkles.push({
                x: Math.random() * this.width, y: Math.random() * this.height, size: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.5, life: 1
            });
        }
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            let s = this.sparkles[i];
            s.life -= 0.03;
            if (s.life <= 0) { this.sparkles.splice(i, 1); continue; }
            this.ctx.strokeStyle = `rgba(255, 255, 224, ${s.life * s.opacity})`;
            this.ctx.lineWidth = s.size;
            this.ctx.beginPath();
            this.ctx.moveTo(s.x - s.size, s.y); this.ctx.lineTo(s.x + s.size, s.y);
            this.ctx.moveTo(s.x, s.y - s.size); this.ctx.lineTo(s.x, s.y + s.size);
            this.ctx.stroke();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PE_V3 !== 'undefined') {
        PE_V3.registerEffect('heartEffect', heartEffect);
        PE_V3.init(siteConfig);
    }
});