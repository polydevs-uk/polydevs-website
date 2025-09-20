class CSSLoader {
    constructor() {
        this.loadedCSS = new Set();
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    // Load CSS với cache busting
    loadCSS(href, id = null) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href + '?v=' + Date.now();
            if (id) link.id = id;

            link.onload = () => {
                this.loadedCSS.add(href);
                resolve(link);
            };

            link.onerror = () => reject(new Error(`Failed to load ${href}`));

            document.head.appendChild(link);
        });
    }

    // Kiểm tra CSS đã load chưa
    checkCSSApplied(selector, property, expectedValue) {
        const element = document.querySelector(selector);
        if (!element) return false;

        const computedStyle = window.getComputedStyle(element);
        const actualValue = computedStyle.getPropertyValue(property);

        return actualValue.includes(expectedValue);
    }

    // Force reload tất cả CSS
    async forceReloadAll() {
        const cssFiles = [
            { href: 'css/fontawesome.min.css', id: 'fontawesome-css' },
            { href: 'css/style.css', id: 'main-css' },
            { href: 'css/critical.css', id: 'critical-css' }
        ];

        const promises = cssFiles.map(css => this.loadCSS(css.href, css.id));

        try {
            await Promise.all(promises);
            console.log('✅ All CSS files force reloaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to reload CSS:', error);
            return false;
        }
    }

    // Kiểm tra và tự động fix CSS
    async autoFix() {
        let attempts = 0;

        while (attempts < this.maxRetries) {
            // Đợi DOM và CSS load
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));

            // Kiểm tra các elements quan trọng
            const checks = [
                { selector: '.project-card', property: 'background-color', expected: 'rgba' },
                { selector: '.project-card', property: 'border-radius', expected: '20px' },
                { selector: '.content-wrapper', property: 'backdrop-filter', expected: 'blur' }
            ];

            const allGood = checks.every(check =>
                this.checkCSSApplied(check.selector, check.property, check.expected)
            );

            if (allGood) {
                console.log('✅ CSS is working properly');
                return true;
            }

            console.warn(`⚠️ CSS check failed, attempt ${attempts + 1}/${this.maxRetries}`);
            await this.forceReloadAll();
            attempts++;
        }

        console.error('❌ CSS failed to load after all attempts, using critical CSS only');
        return false;
    }

    // Initialize
    async init() {
        // Load critical CSS first - với higher priority
        try {
            await this.loadCSS('css/critical.css', 'critical-css');
            console.log('✅ Critical CSS loaded');

            // Force apply critical styles immediately
            const criticalLink = document.getElementById('critical-css');
            if (criticalLink) {
                criticalLink.rel = 'stylesheet';
                criticalLink.media = 'all';
            }
        } catch (error) {
            console.warn('⚠️ Critical CSS failed to load:', error);
        }

        // Load main CSS sau
        setTimeout(async () => {
            try {
                await this.loadCSS('css/style.css', 'main-css-backup');
                await this.loadCSS('css/fontawesome.min.css', 'fa-css-backup');
            } catch (error) {
                console.warn('⚠️ Main CSS backup load failed:', error);
            }
        }, 100);

        // Check and auto-fix on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.autoFix());
        } else {
            this.autoFix();
        }

        // Backup check on window load
        window.addEventListener('load', () => {
            setTimeout(() => this.autoFix(), 500);
        });
    }
}

// Initialize CSS Loader
const cssLoader = new CSSLoader();
cssLoader.init();