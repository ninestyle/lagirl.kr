/*
    Version: 2.2.1
    Last Modified: 2025-11-18
    Author: Maxim
    License: © 2025 Maxim. All Rights Reserved.
*/

const breathingGradientEffect = {
    canvas: null,
    ctx: null,
    animationFrameId: null,
    width: 0,
    height: 0,
    time: 0,
    mouse: { x: null, y: null },
    colors: [
        { r: 166, g: 246, b: 233 }, // Light Mint
        { r: 255, g: 107, b: 107 }, // Coral
        { r: 255, g: 255, b: 255 }  // White
    ],
    boundAnimate: null,
    boundOnResize: null,

    init: function(headerEl) {
        this.headerElement = headerEl;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ce-bg-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.headerElement.prepend(this.canvas);
        
        this.canvas.style.mixBlendMode = 'multiply';
        this.canvas.style.opacity = '0.7';

        this.boundAnimate = this.animate.bind(this);
        this.boundOnResize = this.onResize.bind(this);
        
        this.onResize();
        
        window.addEventListener('resize', this.boundOnResize);
        this.animate();
    },

    animate: function() {
        if (!this.ctx) return;
        this.animationFrameId = requestAnimationFrame(this.boundAnimate);
        
        this.time += 0.005;
        const breath = (Math.sin(this.time) + 1) / 2; // 0 to 1
        
        this.ctx.clearRect(0, 0, this.width, this.height);

        const grd = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0, 
            this.width / 2, this.height / 2, this.width * (0.6 + breath * 0.4)
        );

        const c1 = this.colors[0];
        const c2 = this.colors[1];
        
        grd.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.5)`);
        grd.addColorStop(0.5, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.5)`);
        grd.addColorStop(1, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0)`);

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },
    
    onResize: function() {
        if (!this.headerElement || !this.canvas) return;
        this.width = this.headerElement.clientWidth;
        this.height = this.headerElement.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    destroy: function() {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.boundOnResize);
        if (this.canvas) this.canvas.remove();
    }
};

const siteConfig = {
    canvas_effect: 'breathingGradientEffect',
    canvas_image_type: 'cover',
    canvas_image_slide: 5,
    canvas_image_count: 4,
    canvas_image_path: './section/home/',
    canvas_image_format: 'webp',
    canvas_indicators: true,
    canvas_overlay: 'dotted',

    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#location' },
        { name: 'Profile', icon: 'mail', url: '#profile' }
    ],

    TURNSTILE_SITE_KEY: null
};

document.addEventListener('DOMContentLoaded', () => {
    PE_V2.registerEffect('breathingGradientEffect', breathingGradientEffect);
    PE_V2.init(siteConfig);
});