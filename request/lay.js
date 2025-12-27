/*
    Form Express V4 User Config (Tier 3)
    Last Modified: 2025-12-08
*/

// 1. Site Configuration (Master)
const siteConfig = {
    // [Tier 1] Core Settings
    language: 'ko', // Default Language
    TURNSTILE_SITE_KEY: '0x4AAAAAACJQk9vzs7mUVZi7', 
    API_ENDPOINT: 'https://www.provider.co.kr/api.php',
    REDIRECT_URL: 'https://www.lagirl.kr',
    
    // [Dev Tools]
    demo_mode: false // Set to true for UI testing without backend
};

// 2. Initialize V4 Engine
document.addEventListener('DOMContentLoaded', () => {
    
    // Init Framework
    if (typeof FE_V4 !== 'undefined') {
        FE_V4.init(siteConfig);
    }

    // 3. Custom Business Logic (Date Constraints)
    // Run after init to ensure DOM is ready
    const dateInput = document.querySelector('input[name="reservation_date"]');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
});