/*
    Version: 3.2.0 (Standard)
    Framework: User Configuration (Tier 3)
    Last Modified: 2025-11-30
    Theme: LA GIRL - Modern Sage & Terracotta
*/

const siteConfig = {
    // [Core Options]
    language: 'ko',
    TURNSTILE_SITE_KEY: '', // 데모 모드

    // [Routing]
    API_HOST: 'https://www.lagirl.kr',

    // [Canvas Options]
    canvas_effect: 'breathingGradientEffect',
    canvas_image_type: 'cover',
    canvas_image_path: './section/home/',
    canvas_image_count: 4,
    canvas_image_format: 'webp',
    canvas_image_slide: 5,
    canvas_indicators: true,
    canvas_overlay: 'dotted',

    // [Action Buttons]
    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#location' },
        { name: 'Profile', icon: 'mail', url: '#profile' }
    ],
    
    // [Dev Options]
    demo_mode: true
};

/* [Custom Effect] Breathing Gradient (V3.2 Lightweight)
    - Core provides: ctx, width, height, canvas
    - User implements: init, resize, animate
*/
const breathingGradientEffect = {
    ctx: null,
    width: 0,
    height: 0,
    time: 0,
    animationFrameId: null,
    colors: [
        { r: 166, g: 246, b: 233 }, // Light Mint
        { r: 255, g: 107, b: 107 }, // Coral
        { r: 255, g: 255, b: 255 }  // White
    ],

    init: function({ ctx, width, height, canvas }) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        
        // Visibility adjustments for background image
        canvas.style.opacity = '0.4';
        canvas.style.pointerEvents = 'none';

        this.animate();
    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;
    },

    animate: function() {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.005;
        const breath = (Math.sin(this.time) + 1) / 2; // 0 to 1

        this.ctx.clearRect(0, 0, this.width, this.height);

        const grd = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0, 
            this.width / 2, this.height / 2, this.width * (0.6 + breath * 0.4)
        );

        const c1 = this.colors[0];
        const c2 = this.colors[1];
        
        grd.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.3)`);
        grd.addColorStop(0.5, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.2)`);
        grd.addColorStop(1, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0)`);

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PE_V3 !== 'undefined') {
        PE_V3.registerEffect('breathingGradientEffect', breathingGradientEffect);
        PE_V3.init(siteConfig);
    }
});