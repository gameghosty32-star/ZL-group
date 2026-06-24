/* ====================================
   CANVAS ANIMATIONS & INTERACTIVE EFFECTS
   ==================================== */

// Initialize Canvas Background
function initCanvasBackground() {
    const canvas = document.createElement('canvas');
    const container = document.querySelector('.hero-section');
    
    if (!container) return;
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.1';
    
    container.style.position = 'relative';
    container.insertBefore(canvas, container.firstChild);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 198, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw lines between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 198, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Page Transition with Logo Animation
function initPageTransitions() {
    const loader = createPageLoader();
    
    // Add click listeners to all internal links
    document.querySelectorAll('a[href^="./"], a[href^="/"], a:not([target="_blank"])').forEach(link => {
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').includes('#')) return;
                
                e.preventDefault();
                const href = link.getAttribute('href');
                
                if (href && !href.includes('whatsapp') && !href.includes('mailto')) {
                    showPageLoader();
                    setTimeout(() => {
                        window.location.href = href;
                    }, 800);
                }
            });
        }
    });
}

function createPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="loader-content">
            <canvas id="loaderCanvas" width="120" height="120"></canvas>
            <p class="loader-text">CARREGANDO...</p>
        </div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
    
    // Draw animated logo on canvas
    const canvas = document.getElementById('loaderCanvas');
    const ctx = canvas.getContext('2d');
    let angle = 0;
    
    function drawLogo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(60, 60);
        ctx.rotate(angle);
        
        // Draw ZL logo
        ctx.fillStyle = '#00c6ff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ZL', 0, 0);
        
        ctx.restore();
        angle += 0.1;
        requestAnimationFrame(drawLogo);
    }
    
    drawLogo();
    return loader;
}

function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('active');
    }
}

// ====================================
// SCROLL ANIMATIONS
// ====================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section, .card, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// ====================================
// STAT COUNTER ANIMATION
// ====================================

function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const format = counter.getAttribute('data-format') || '';
                const duration = 2000;
                const increment = target / (duration / 50);
                
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < target) {
                        if (format === 'k') {
                            counter.textContent = Math.floor(current / 1000) + 'k+';
                        } else if (format === '%') {
                            counter.textContent = Math.floor(current) + '%';
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (format === 'k') {
                            counter.textContent = (target / 1000).toFixed(0) + 'k+';
                        } else if (format === '%') {
                            counter.textContent = target + '%';
                        } else {
                            counter.textContent = target;
                        }
                    }
                };
                
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ====================================
// SMOOTH SCROLL
// ====================================

function initSmoothScroll() {
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
}

// ====================================
// NAVBAR SCROLL EFFECT
// ====================================

function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'white';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// ====================================
// MOUSE FOLLOW EFFECT
// ====================================

function initMouseFollowEffect() {
    const cards = document.querySelectorAll('.card, .service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ====================================
// PARALLAX EFFECT
// ====================================

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.scrollY;
            const elementOffset = el.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            if (distance > -window.innerHeight && distance < window.innerHeight) {
                const speed = el.getAttribute('data-parallax') || 0.5;
                el.style.transform = `translateY(${distance * speed}px)`;
            }
        });
    });
}

// ====================================
// FORM ANIMATIONS
// ====================================

function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#00c6ff';
            input.style.boxShadow = '0 0 0 3px rgba(0, 198, 255, 0.1)';
            input.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#dee2e6';
            input.style.boxShadow = 'none';
            input.style.transform = 'scale(1)';
        });
    });
}

// ====================================
// TEXT REVEAL ANIMATION
// ====================================

function initTextReveal() {
    const textElements = document.querySelectorAll('.display-5, .lead, .card-title');
    
    textElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;
            el.appendChild(span);
        });
    });
}

// ====================================
// LIGHT/DARK MODE TOGGLE
// ====================================

function initThemeToggle() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #00c6ff;
        background: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        z-index: 1000;
        font-size: 24px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 198, 255, 0.3);
    `;
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggleBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        toggleBtn.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            toggleBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.transform = 'scale(1.1)';
    });
    
    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(toggleBtn);
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations
    initCanvasBackground();
    initPageTransitions();
    initScrollAnimations();
    animateCounters();
    initSmoothScroll();
    initNavbarScrollEffect();
    initMouseFollowEffect();
    initParallaxEffect();
    initFormAnimations();
    initThemeToggle();
    
    // Add fade-in animation to page on load
    document.body.style.animation = 'fadeInUp 0.8s ease-out';
    
    // Optimize performance
    if ('IntersectionObserver' in window) {
        // Lazy load images
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.src = img.dataset.src || img.src;
                        observer.unobserve(img);
                    }
                });
            });
            observer.observe(img);
        });
    }
});

// Performance optimization
window.addEventListener('load', () => {
    // Remove loading animations after page loads
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('active');
    }
});

// Handle visibility change for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});
