// Custom JavaScript for Jaffar Alromaih's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initResumeDownload();
    initActiveNavigation();
    initScrollToTop();
    initLoadingPlaceholders();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('mainNav') ? document.getElementById('mainNav').offsetHeight : 0;
                const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                
                // Use custom smooth scrolling for better compatibility
                smoothScrollTo(offsetTop, 800);
            }
        });
    });
}

// Custom smooth scroll function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Change navbar style on scroll
function initNavbarScroll() {
    const navbar = document.getElementById('mainNav');
    
    // Set initial state based on current scroll position
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.padding = '1rem 0';
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.padding = '1rem 0';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.section-title, .project-card, .work-experience-item, .education-item, .education-vertical, .certificate-card, .honor-card, .fieldz-card, .fieldz-feature-box, .fieldz-role-card, .fieldz-architecture-box');
    animateElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    function checkFadeElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check on scroll and on load
    window.addEventListener('scroll', checkFadeElements);
    
    // Initial check after a short delay to ensure DOM is ready
    setTimeout(checkFadeElements, 100);
    
    // Also check on resize
    window.addEventListener('resize', checkFadeElements);
}


// Resume download functionality
function initResumeDownload() {
    // Handle all resume download buttons
    const resumeDownloadBtns = document.querySelectorAll('a[href*="Jaffar_Alromaih_CV_Resume.pdf"][download]');
    
    resumeDownloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add loading state
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Downloading...';
            btn.disabled = true;
            
            // Simulate download completion
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                // Show success feedback
                showNotification('Resume downloaded successfully!', 'success');
            }, 1500);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Add active style to CSS if not already defined
    const style = document.createElement('style');
    style.textContent = `
        .navbar-nav .nav-link.active {
            color: #007bff !important;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Handle case when at top of page
        if (scrollPosition < 100) {
            current = 'home';
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Set home as active immediately on page load
    updateActiveNav();
}


// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            smoothScrollTo(0, 600);
        });
    }
}

// Loading placeholder functionality
function initLoadingPlaceholders() {
    // Add loading placeholders to images that might take time to load
    // EXCLUDE organization logos to preserve their hover effects
    const imageSelectors = [
        '.certificate-thumbnail',
        '.profile-img-enhanced',
        '.resume-preview-img',
        '.fieldz-image',
        '.certificate-img'
        // Removed '.certificate-org-logo' to preserve hover effects
    ];
    
    imageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            // Skip if already wrapped or if image is already loaded
            if (img.parentElement.classList.contains('loading-placeholder') ||
                (img.complete && img.naturalHeight !== 0)) {
                return;
            }
            
            // Create loading placeholder wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'loading-placeholder';
            
            // Create animated SVG logo as loading indicator
            const loadingSvg = document.createElement('img');
            loadingSvg.src = 'img/New Logo/Jaffar-Logo.svg';
            loadingSvg.className = 'loading-svg';
            loadingSvg.alt = 'Loading...';
            loadingSvg.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                z-index: 1;
                pointer-events: none;
                animation: pulse 1.5s ease-in-out infinite;
            `;
            
            // Insert wrapper before img
            img.parentNode.insertBefore(wrapper, img);
            
            // Add loading SVG to wrapper
            wrapper.appendChild(loadingSvg);
            
            // Move img into wrapper
            wrapper.appendChild(img);
            
            // Handle image load
            img.addEventListener('load', function() {
                wrapper.classList.add('loaded');
                // Remove the SVG after image loads
                setTimeout(() => {
                    if (loadingSvg.parentNode) {
                        loadingSvg.parentNode.removeChild(loadingSvg);
                    }
                }, 300);
            });
            
            img.addEventListener('error', function() {
                wrapper.classList.add('loaded');
                // Remove the SVG on error as well
                setTimeout(() => {
                    if (loadingSvg.parentNode) {
                        loadingSvg.parentNode.removeChild(loadingSvg);
                    }
                }, 300);
            });
            
            // Handle already loaded images
            if (img.complete && img.naturalHeight !== 0) {
                wrapper.classList.add('loaded');
                // Remove the SVG immediately if already loaded
                setTimeout(() => {
                    if (loadingSvg.parentNode) {
                        loadingSvg.parentNode.removeChild(loadingSvg);
                    }
                }, 100);
            }
        });
    });
}
