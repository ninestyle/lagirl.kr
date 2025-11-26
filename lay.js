/*
    Version: 3.2.2 (Refactored for Express V3.2.2)
    Last Modified: 2025-11-26
    Author: Maxim
    License: © 2025 Maxim. All Rights Reserved.
*/

// [V3.2.2] Effect logic must be exposed to window and accept a canvas element
window.breathingGradientEffect = function(canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let time = 0;
    let animationFrameId = null;

    const colors = [
        { r: 166, g: 246, b: 233 }, // Light Mint
        { r: 255, g: 107, b: 107 }, // Coral
        { r: 255, g: 255, b: 255 }  // White
    ];

    // Style adjustment for the effect layer
    canvas.style.mixBlendMode = 'multiply';
    canvas.style.opacity = '0.7';

    const onResize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }
    };

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        time += 0.005;
        const breath = (Math.sin(time) + 1) / 2; // 0 to 1

        ctx.clearRect(0, 0, width, height);

        // Dynamic Radial Gradient
        const grd = ctx.createRadialGradient(
            width / 2, height / 2, 0, 
            width / 2, height / 2, width * (0.6 + breath * 0.4)
        );

        const c1 = colors[0];
        const c2 = colors[1];
        
        grd.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.5)`);
        grd.addColorStop(0.5, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.5)`);
        grd.addColorStop(1, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0)`);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
    };

    // Init
    window.addEventListener('resize', onResize);
    onResize();
    animate();

    // Cleanup hook (optional, if you need to stop animation externally)
    canvas.destroy = () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
    };
};

const siteConfig = {
    language: 'ko',
    // TURNSTILE_SITE_KEY: 'YOUR_TURNSTILE_KEY', // Enable for strict security
    
    // [V3.2.2] API Routing (Centralized)
    API_HOST: 'https://www.lagirl.kr', 

    // Wizard Settings
    canvas_effect: 'breathingGradientEffect', // Matches window function name
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
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PE_V3 !== 'undefined') {
        PE_V3.init(siteConfig);

        // [Polyfill] Ensure data-lang-href works if Tier 2 missed it
        if (typeof Express !== 'undefined' && Express.Util) {
            const util = Express.Util;
            util.$$('[data-lang-href]').forEach(el => {
                const key = el.getAttribute('data-lang-href');
                if (key) el.setAttribute('href', util.getText(key));
            });
        }
    }
});