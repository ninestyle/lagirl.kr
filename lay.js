/*
    Version: 4.0.1
    Framework: Express Series V4
    Theme: LA GIRL - Modern Sage (Ref: CHUU Engine)
    Last Modified: 2025-12-11
    Author: Maxim
*/

const siteConfig = {
    language: 'ko',
    theme_color: '#E07A5F',
    demo_mode: true,

    canvas_target: '#home',
    canvas_effect: 'breathingGradientEffect', 
    canvas_overlay: 'dotted',
    
    canvas_image_type: 'cover',
    canvas_image_count: 4,
    canvas_image_slide: 5,
    canvas_image_path: './section/home/',
    canvas_image_format: 'webp',

    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#location' },
        { name: 'Profile', icon: 'mail', url: '#profile' }
    ],
    scroll_smooth: true
};

window.breathingGradientEffect = {
    canvas: null,
    ctx: null,
    animationFrameId: null,
    width: 0,
    height: 0,
    time: 0,
    colors: [
        { r: 166, g: 246, b: 233 }, 
        { r: 255, g: 107, b: 107 }, 
        { r: 255, g: 255, b: 255 }
    ],

    init: function(container) {
        this.container = container;
        this.canvas = this.container.querySelector('.ex-canvas__effect');
        
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'ex-canvas__effect';
            this.container.appendChild(this.canvas);
        }

        this.canvas.style.opacity = '0.4'; 
        this.canvas.style.pointerEvents = 'none';

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.onResize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        window.addEventListener('resize', this.onResize);
        this.animate();
    },

    resize: function() {
        if (!this.container) return;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    animate: function() {
        if (!this.ctx) return;
        this.animationFrameId = requestAnimationFrame(this.animate);
        this.time += 0.005;
        const breath = (Math.sin(this.time) + 1) / 2;

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
    if (typeof PE_V4 !== 'undefined') {
        PE_V4.init(siteConfig).then(api => {
            if (typeof Express !== 'undefined' && Express.Util) {
                const util = Express.Util;
                util.$$('[data-lang-href]').forEach(el => {
                    const key = el.getAttribute('data-lang-href');
                    if (key) el.setAttribute('href', util.getText(key));
                });
            }
        });
    }
});