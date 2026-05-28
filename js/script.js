/**
 * GRUPO ZL - JAVASCRIPT VANILLA
 * Otimizado para performance sem frameworks
 */

// ============================================
// CONTADORES DE ESTATÍSTICAS
// ============================================

const counters = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function formatValue(value, format) {
    if (format === 'k') {
        return Math.floor(value / 1000) + 'k+';
    }
    if (format === '%') {
        return value + '%';
    }
    return value + '+';
}

function animateCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const format = counter.dataset.format || '';
        let current = 0;
        const increment = target / 60;

        function animate() {
            current += increment;

            if (current < target) {
                counter.textContent = formatValue(Math.ceil(current), format);
                requestAnimationFrame(animate);
            } else {
                counter.textContent = formatValue(target, format);
            }
        }

        requestAnimationFrame(animate);
    });
}

function initCounterObserver() {
    const statsSection = document.querySelector('.bg-light');
    
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
}

// ============================================
// FORMULÁRIO DE CONTACTO
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value;

        const mailtoLink = `mailto:zlbusinessventures@hotmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(
            `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`
        )}`;

        window.location.href = mailtoLink;
    });
}

// ============================================
// NAVBAR COLLAPSE
// ============================================

function initNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// FALLBACK PARA VÍDEO
// ============================================

function initVideoFallback() {
    const heroVideo = document.querySelector('.hero-video');
    const heroFallback = document.querySelector('.hero-fallback');

    if (heroVideo && heroFallback) {
        heroVideo.addEventListener('error', () => {
            heroVideo.style.display = 'none';
            heroFallback.style.display = 'block';
        });

        heroVideo.addEventListener('loadeddata', () => {
            heroFallback.style.display = 'none';
        });
    }
}

// ============================================
// ANIMAÇÕES AO SCROLL
// ============================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('.card, .gallery-img, .stat-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Grupo ZL - Inicializando...');
    
    initCounterObserver();
    initContactForm();
    initNavbar();
    initSmoothScroll();
    initLazyLoading();
    initVideoFallback();
    initScrollAnimations();
    
    console.log('Grupo ZL - Pronto!');
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Tempo de carregamento: ' + pageLoadTime + 'ms');
    });
}
