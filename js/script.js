document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for Counters
    let counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.impact-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // Global Lightbox
    const images = document.querySelectorAll('img:not(.navbar-logo)');
    const carouselSlides = document.querySelectorAll('.slide');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    const openLightbox = (src, isVideo = false) => {
        lightbox.classList.add('active');
        while (lightbox.firstChild) {
            lightbox.removeChild(lightbox.firstChild);
        }
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('lightbox-close');
        closeBtn.innerHTML = '&times;';
        lightbox.appendChild(closeBtn);

        if (isVideo) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.classList.add('lightbox-video');
            lightbox.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = src;
            lightbox.appendChild(img);
        }

        const closeHandler = () => {
            lightbox.classList.remove('active');
            // Clean up content to stop video playback if active
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
        };

        closeBtn.addEventListener('click', closeHandler);
        
        // Handle lightbox background clicks and Escape key within open state
        const handleBgClick = (e) => {
            if (e.target === lightbox) {
                closeHandler();
                lightbox.removeEventListener('click', handleBgClick);
            }
        };
        lightbox.addEventListener('click', handleBgClick);

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeHandler();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    };

    images.forEach(item => {
        item.addEventListener('click', (e) => {
            // Ignore click if it's inside a link or video-item
            if (item.closest('a') || item.closest('.video-item')) {
                return;
            }
            openLightbox(item.src);
        });
    });

    // Handle Custom Video Items Click
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoUrl = item.getAttribute('data-video-url');
            if (videoUrl) {
                openLightbox(videoUrl, true);
            }
        });
    });

    carouselSlides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            // Don't open lightbox if clicking buttons or links
            if (e.target.closest('.hero-buttons') || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const bgImage = window.getComputedStyle(slide).backgroundImage;
            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                openLightbox(urlMatch[1]);
            }
        });
    });

    // Form Submission Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your submission has been received.');
            form.reset();
        });
    });

    // Hero Slider (Horizontal Carousel)
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const updateSlider = () => {
        sliderContainer.style.transform = `translateX(-${currentSlide * (100 / slides.length)}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');

        // Reset animations
        const activeContent = slides[currentSlide].querySelector('.hero-content');
        const elements = activeContent.querySelectorAll('h1, p, .hero-buttons');
        elements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null;
        });
    };

    const nextSlide = () => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        updateSlider();
    };

    const prevSlide = () => {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        updateSlider();
    };

    if (slides.length > 0) {
        // Auto play
        slideInterval = setInterval(nextSlide, 5000);

        // Controls
        nextBtn.addEventListener('click', () => {
            nextSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
});
