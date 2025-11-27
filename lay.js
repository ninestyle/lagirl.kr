/*
    Version: 3.2.3 (Fixes for Effect & Structure)
    Last Modified: 2025-11-27
    Author: Maxim
    License: © 2025 Maxim. All Rights Reserved.
*/

// [V3.2.2] Custom Effect Logic
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

    // [FIX] Adjusted blend mode to avoid obscuring the background image
    // 'multiply' darkens significantly. 'overlay' or 'screen' is better for visibility.
    // Or remove mixBlendMode and use low opacity.
    canvas.style.opacity = '0.4'; 
    canvas.style.pointerEvents = 'none'; // Ensure clicks pass through

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

        const grd = ctx.createRadialGradient(
            width / 2, height / 2, 0, 
            width / 2, height / 2, width * (0.6 + breath * 0.4)
        );

        const c1 = colors[0];
        const c2 = colors[1];
        
        // Slightly adjusted alpha for subtlety
        grd.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.3)`);
        grd.addColorStop(0.5, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.2)`);
        grd.addColorStop(1, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0)`);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', onResize);
    onResize();
    animate();

    canvas.destroy = () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
    };
};

const siteConfig = {
    language: 'ko',
    
    // [Routing]
    API_HOST: 'https://www.lagirl.kr', 

    // Wizard Settings
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
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PE_V3 !== 'undefined') {
        PE_V3.init(siteConfig);

        // [Polyfill]
        if (typeof Express !== 'undefined' && Express.Util) {
            const util = Express.Util;
            util.$$('[data-lang-href]').forEach(el => {
                const key = el.getAttribute('data-lang-href');
                if (key) el.setAttribute('href', util.getText(key));
            });
        }
    }
});