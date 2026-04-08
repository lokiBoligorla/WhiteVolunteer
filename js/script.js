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

    const openLightbox = (src) => {
        lightbox.classList.add('active');
        const img = document.createElement('img');
        img.src = src;
        while (lightbox.firstChild) {
            lightbox.removeChild(lightbox.firstChild);
        }
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('lightbox-close');
        closeBtn.innerHTML = '&times;';
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(img);

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    };

    images.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item.src);
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

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
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
