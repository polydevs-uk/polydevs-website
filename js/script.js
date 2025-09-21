// Smooth scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';

            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll('.team-card, .stat-item, .project-card, .service-item');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
});

// Add loading state management
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');

    // Check if all images are loaded
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    console.log('All images loaded');
                }
            });
        }
    });

    // Add click handlers for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Project card clicked:', this.querySelector('h3').textContent);
            // Add future functionality here
        });
    });
});

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'css/fontawesome.min.css',
        'css/style.css',
        'css/critical.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Call preload on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadResources);
} else {
    preloadResources();
}

// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for nav links (giữ nguyên)
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = targetId === '#hero' ? document.querySelector('.hero') : document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active state on scroll (giữ nguyên)
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id') || 'hero';

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');

                    const href = link.getAttribute('href');
                    if ((href === '#hero' && section.classList.contains('hero')) ||
                        href === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth Hide/Show navbar on scroll - PHIÊN BẢN MỚI
    let lastScrollTop = 0;
    let scrollTimeout;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Clear timeout cũ
        clearTimeout(scrollTimeout);

        // Thêm delay nhỏ để tránh quá nhiều trigger
        scrollTimeout = setTimeout(() => {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - ẩn navbar
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            } else if (scrollTop < lastScrollTop) {
                // Scrolling up - hiện navbar
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }

            // Luôn hiện navbar khi ở top
            if (scrollTop <= 50) {
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }

            lastScrollTop = scrollTop;
        }, 10); // Delay 10ms để smooth hơn

    }, false);

    // Đảm bảo navbar hiện ngay từ đầu
    navbar.classList.add('visible');
});