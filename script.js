// script.js - Unified & Final

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Progress Bar Logic ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    // --- 1. Homepage Text Animation & Hover Effect ---
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const textSpans = heroTitle.querySelectorAll('span');
        
        textSpans.forEach((span, index) => {
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) skewY(0)';
            }, 150 * index);
        });

        setTimeout(() => {
            textSpans.forEach(span => {
                const originalTransform = span.style.transform;
                span.addEventListener('mouseover', () => {
                    const randomX = Math.random() * 400 - 200;
                    const randomY = Math.random() * 400 - 200;
                    const randomRotate = Math.random() * 40 - 20;
                    span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
                    span.classList.add('hover-effect');
                });
    
                span.addEventListener('mouseout', () => {
                    span.style.transform = originalTransform;
                    span.classList.remove('hover-effect');
                });
            });
        }, 150 * textSpans.length);
    }
    
    // --- 1.5. Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Check if lightbox is open before moving cursor
            if (!document.body.classList.contains('lightbox-is-open')) {
                 posX += (mouseX - posX) * 0.1;
                 posY += (mouseY - posY) * 0.1;
            
                cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
                follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
             } // Only animate if lightbox is NOT open
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .project-item, .swiper-slide, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                // Only add active class if lightbox is NOT open
                if (!document.body.classList.contains('lightbox-is-open')) {
                    follower.classList.add('active');
                 }
            });
            el.addEventListener('mouseout', () => {
                follower.classList.remove('active');
            });
        });
    }

    // --- 2. Work Page: Filter Button Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-grid .project-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

// --- 3. Work Page: Lightbox Modal Logic ---
    const workLightbox = document.getElementById('lightbox');
    if (workLightbox) {
        const singleMediaContainer = document.getElementById('lightbox-single-media');
        const galleryContainer = document.getElementById('lightbox-gallery-container');
        const mainGalleryImage = document.getElementById('lightbox-main-img');
        const thumbnailGrid = document.getElementById('lightbox-thumbnail-grid');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxVideoContainer = document.getElementById('lightbox-video-container');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');

        // ** Determine initial load based on screen width **
        const isMobile = window.innerWidth <= 768; 
        const INITIAL_THUMBNAILS_TO_LOAD = isMobile ? 5 : 15; 
        const THUMBNAILS_BATCH_SIZE = isMobile ? 5 : 15; // How many to load on scroll

        let currentlyDisplayedUrls = []; 
        let lastLoadedIndex = -1; 

        function createAndAppendThumbnail(url, index, title) {
            const thumb = document.createElement('img');
            thumb.src = url;
            thumb.alt = title + " thumbnail " + (index + 1);
            thumb.classList.add('thumbnail-item');
            thumb.loading = 'lazy'; 

            if (index === 0) thumb.classList.add('active');

            thumb.addEventListener('click', () => {
                mainGalleryImage.src = url;
                thumbnailGrid.querySelectorAll('.thumbnail-item').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            thumbnailGrid.appendChild(thumb);
        }

        function loadMoreThumbnails(title) {
            const nextIndexToLoad = lastLoadedIndex + 1;
             // Check if all images are already loaded
             if (nextIndexToLoad >= currentlyDisplayedUrls.length) {
                 return; 
             }
             
            const remainingImages = currentlyDisplayedUrls.length - nextIndexToLoad;
            // ** Use dynamic batch size **
            const numToLoad = Math.min(remainingImages, THUMBNAILS_BATCH_SIZE); 

            if (numToLoad > 0) {
                for (let i = 0; i < numToLoad; i++) {
                    const index = nextIndexToLoad + i;
                    // Ensure index is within bounds (safety check)
                    if (index < currentlyDisplayedUrls.length) { 
                        createAndAppendThumbnail(currentlyDisplayedUrls[index], index, title);
                    }
                }
                lastLoadedIndex += numToLoad;
            }
        }

        if (thumbnailGrid) {
            let isLoadingMore = false; // Add a flag to prevent multiple rapid loads
            thumbnailGrid.addEventListener('scroll', () => {
                // Check if scrolled near the bottom and not already loading
                if (!isLoadingMore && (thumbnailGrid.scrollHeight - thumbnailGrid.scrollTop <= thumbnailGrid.clientHeight + 100)) { // Increased threshold slightly
                    isLoadingMore = true; // Set flag
                    const title = lightboxTitle.textContent; 
                    loadMoreThumbnails(title);
                    // Reset flag after a short delay to allow rendering
                    setTimeout(() => { isLoadingMore = false; }, 200); 
                }
            });
        }


        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                const title = item.getAttribute('data-title');
                const description = item.getAttribute('data-description');
                const imagesAttr = item.getAttribute('data-images');
                const youtubeId = item.getAttribute('data-youtube-id');
                const videoSrc = item.getAttribute('data-video-src'); // *** NEW ***

                lightboxTitle.textContent = title;
                lightboxDesc.innerHTML = description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                singleMediaContainer.classList.remove('hidden');
                galleryContainer.classList.add('hidden');
                lightboxImg.classList.remove('hidden');
                lightboxVideoContainer.classList.add('hidden');

                currentlyDisplayedUrls = [];
                lastLoadedIndex = -1; // Reset index

                if (category === 'photography' || (imagesAttr && category === '3d')) {
                    singleMediaContainer.classList.add('hidden');
                    galleryContainer.classList.remove('hidden');
                    currentlyDisplayedUrls = imagesAttr.split(',').map(url => url.trim()).filter(url => url); 
                    thumbnailGrid.innerHTML = ''; 

                    if (currentlyDisplayedUrls.length > 0) {
                        mainGalleryImage.src = currentlyDisplayedUrls[0];
                        // ** Use dynamic initial load **
                        const numThumbsToCreate = Math.min(currentlyDisplayedUrls.length, INITIAL_THUMBNAILS_TO_LOAD);
                        for (let index = 0; index < numThumbsToCreate; index++) {
                             createAndAppendThumbnail(currentlyDisplayedUrls[index], index, title);
                        }
                        lastLoadedIndex = numThumbsToCreate - 1; // Update last loaded index
                    }

                // *** MODIFIED LOGIC ***
                } else if (youtubeId || videoSrc) {
                    lightboxImg.classList.add('hidden');
                    lightboxVideoContainer.classList.remove('hidden');

                    if (youtubeId) {
                        // It's a YouTube video
                        lightboxVideoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                    } else if (videoSrc) {
                        // It's a Cloudinary/Self-hosted video
                        lightboxVideoContainer.innerHTML = `
                            <video controls autoplay muted playsinline style="width: 100%; max-height: 70vh;">
                                <source src="${videoSrc}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>`;
                    }
                // *** END MODIFIED LOGIC ***

                } else {
                    const imgSrc = item.querySelector('img').src;
                    lightboxImg.src = imgSrc;
                }
                
                workLightbox.classList.add('show');
                document.body.classList.add('lightbox-is-open'); 
            });
        });

        function closeLightbox() {
            workLightbox.classList.remove('show');
            if (lightboxVideoContainer) lightboxVideoContainer.innerHTML = '';
            if (thumbnailGrid) thumbnailGrid.innerHTML = '';
            document.body.classList.remove('lightbox-is-open');
            currentlyDisplayedUrls = [];
            lastLoadedIndex = -1;
        }
        workLightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        workLightbox.addEventListener('click', e => {
            if (e.target === workLightbox) closeLightbox();
        });
    }

    // --- 4. Certificate Slider & Lightbox ---
    const certSlider = document.querySelector('.certificate-slider');
    if (certSlider) {
        new Swiper('.certificate-slider', {
            effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto',
            coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
            pagination: { el: '.swiper-pagination' }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
        
        const certLightbox = document.getElementById('certificate-lightbox');
        const certSlides = document.querySelectorAll('.certificate-slide');
        certSlides.forEach(slide => {
            slide.addEventListener('click', () => {
                // MODIFICATION START
                const description = slide.dataset.description || ''; // Get description or empty string
                // MODIFICATION END

                document.getElementById('lightbox-cert-img').src = slide.dataset.imgSrc;
                document.getElementById('lightbox-cert-title').textContent = slide.dataset.title;
                document.getElementById('lightbox-cert-issuer').textContent = slide.dataset.issuer;
                document.getElementById('lightbox-cert-date').textContent = slide.dataset.date;
                
                // MODIFICATION START
                document.getElementById('lightbox-cert-desc').textContent = description; // Set the description text
                // MODIFICATION END
                
                certLightbox.classList.add('show');
                document.body.classList.add('lightbox-is-open'); // ** Add class to body **
            });
        });

        function closeCertLightbox() {
            certLightbox.classList.remove('show');
            document.body.classList.remove('lightbox-is-open'); // ** Remove class from body **
        }

        certLightbox.querySelector('.close-btn').addEventListener('click', closeCertLightbox);
        certLightbox.addEventListener('click', e => { if (e.target === certLightbox) closeCertLightbox(); });
    }
    
    // --- 5. Recommendation Lightbox Logic ---
    const recommendationHeaders = document.querySelectorAll('.recommendation-list .accordion-header');
    const recLightbox = document.getElementById('recommendation-lightbox');
    if (recommendationHeaders.length > 0 && recLightbox) {
        const lightboxRecImg = document.getElementById('lightbox-rec-img');
        const lightboxRecTitle = document.getElementById('lightbox-rec-title');
        const closeRecBtn = recLightbox.querySelector('.close-btn');
        recommendationHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const imgSrc = header.getAttribute('data-img-src');
                const titleText = header.querySelector('.rec-title span').textContent; 
                if (imgSrc && titleText) {
                    lightboxRecImg.src = imgSrc;
                    lightboxRecTitle.textContent = titleText;
                    recLightbox.classList.add('show');
                    document.body.classList.add('lightbox-is-open'); // ** Add class to body **
                }
            });
        });

        function closeRecLightbox() { 
            recLightbox.classList.remove('show'); 
            lightboxRecImg.src = ''; 
            document.body.classList.remove('lightbox-is-open'); // ** Remove class from body **
        }
        closeRecBtn.addEventListener('click', closeRecLightbox);
        recLightbox.addEventListener('click', (e) => { if (e.target === recLightbox) closeRecLightbox(); });
    }

    // --- 6. Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // --- 7. Page Transition Logic ---
    const transitionOverlay = document.querySelector('.transition-overlay');
    const pageLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
    if (transitionOverlay) { transitionOverlay.style.opacity = '0'; }
    pageLinks.forEach(link => {
        if (!link.closest('.lightbox-content')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.href;
                // Don't trigger transition if opening a lightbox
                if (!e.target.closest('.project-item, .certificate-slide, .accordion-header')) {
                    if (transitionOverlay) { transitionOverlay.style.opacity = '1'; }
                    setTimeout(() => { window.location.href = targetUrl; }, 500);
                }
            });
        }
    });

    // --- 8. Scroll-Triggered Animations ---
    const sectionsToAnimate = document.querySelectorAll('h1, h2, h3, .project-item, .about-grid, .contact-container, .accordion-item, .skills-list li, .tagline, .cta-button, .filter-btn');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
    
    // --- 9. Interactive Particle Background (Homepage) ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initHomeParticles(); 
        }
        
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
                }
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        function initHomeParticles() { 
            particles = []; if (canvas.width === 0 || canvas.height === 0) return; 
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2; let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#333';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateHomeCanvas() { 
            requestAnimationFrame(animateHomeCanvas); ctx.clearRect(0, 0, canvas.width, canvas.height); 
            for (let i = 0; i < particles.length; i++) { particles[i].update(); }
            connectHomeParticles();
        }

        function connectHomeParticles() {
            let opacityValue = 1; if (canvas.width === 0 || canvas.height === 0) return;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000); ctx.strokeStyle = `rgba(100, 100, 100, ${opacityValue})`; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                    }
                }
            }
        }
        resizeCanvas(); 
        animateHomeCanvas();
    }
    
    // --- Stardust Background (Badges Section) ---
    const badgeCanvas = document.getElementById('badge-canvas-background');
    if (badgeCanvas) {
        const ctx = badgeCanvas.getContext('2d');
        let badgeParticles = []; 
        let badgeMouse = { x: undefined, y: undefined }; 
        const badgeParent = badgeCanvas.parentElement;
        const badgeColors = ['#FF6B6B', '#FFD93D', '#EAEAEA'];

        function resizeBadgeCanvas() {
             if(badgeParent.clientWidth > 0 && badgeParent.clientHeight > 0){
                badgeCanvas.width = badgeParent.clientWidth;
                badgeCanvas.height = badgeParent.clientHeight;
             }
        }
        setTimeout(resizeBadgeCanvas, 50); 
        window.addEventListener('resize', resizeBadgeCanvas);

        badgeParent.addEventListener('mousemove', (event) => {
            const rect = badgeParent.getBoundingClientRect();
            badgeMouse.x = event.clientX - rect.left;
            badgeMouse.y = event.clientY - rect.top;
            for (let i = 0; i < 5; i++) {
                badgeParticles.push(new BadgeParticle(badgeMouse.x, badgeMouse.y));
            }
        });
        badgeParent.addEventListener('mouseleave', () => {
            badgeMouse.x = undefined;
            badgeMouse.y = undefined;
        });

        class BadgeParticle {
            constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 4 + 1; this.speedX = Math.random() * 3 - 1.5; this.speedY = Math.random() * 3 - 1.5; this.color = badgeColors[Math.floor(Math.random() * badgeColors.length)]; this.life = 1; }
            update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.2) this.size -= 0.1; this.life -= 0.02; }
            draw() { ctx.fillStyle = this.color; ctx.globalAlpha = this.life; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }

        function handleBadgeParticles() {
            for (let i = 0; i < badgeParticles.length; i++) {
                badgeParticles[i].update();
                badgeParticles[i].draw();
                if (badgeParticles[i].life <= 0 || badgeParticles[i].size <= 0.2) {
                    badgeParticles.splice(i, 1);
                    i--;
                }
            }
        }

        function animateBadgeCanvas() {
            ctx.clearRect(0, 0, badgeCanvas.width, badgeCanvas.height);
            ctx.globalAlpha = 1;
            handleBadgeParticles();
            requestAnimationFrame(animateBadgeCanvas);
        }
        animateBadgeCanvas();
    }
// --- NEW: Randomize Badge Content ---
    const badgeContainer = document.querySelector('.badge-scatter-container');
    if (badgeContainer) {
        const badgeElements = badgeContainer.querySelectorAll('.flip-card');
        
        // Define your badge data here
        const badgeData = [
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005458/B1_n84d09.jpg", title: "Event 1", details: "Details for the first event." },
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005461/B2_u9tbiv.jpg", title: "Event 2", details: "Details for the second event." },
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005464/B3_rzbg06.jpg", title: "Event 3", details: "Details for the third event." },
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005467/B4_zwhf2e.jpg", title: "Event 4", details: "Details for the fourth event." },
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005473/B6_rm1xps.jpg", title: "Event 5", details: "Details for the fifth event." },
            { img: "https://res.cloudinary.com/dw6sm94ix/image/upload/v1761005470/B5_mbf2zy.jpg", title: "Event 6", details: "Details for the sixth event." },
            { img: "httpstrans://res.cloudinary.com/dw6sm94ix/image/upload/v1761005476/B7_zvazlo.jpg", title: "Event 7", details: "Details for the seventh event." }
        ];

        // Shuffle function (Fisher-Yates algorithm)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
        }

        shuffleArray(badgeData); // Shuffle the data

        // Populate the fixed badge elements with shuffled data
        badgeElements.forEach((badge, index) => {
            if (index < badgeData.length) { // Ensure we don'T go out of bounds
                const data = badgeData[index];
                const frontImg = badge.querySelector('.flip-card-front img');
                const backTitle = badge.querySelector('.flip-card-back h3');
                const backDetails = badge.querySelector('.flip-card-back p');

                if (frontImg) {
                    frontImg.src = data.img;
                    frontImg.alt = data.title + " Badge"; // Set alt text
                }
                if (backTitle) backTitle.textContent = data.title;
                if (backDetails) backDetails.textContent = data.details;
            }
        });
    }
    // --- 10. Logo Glitch Effect Setup ---
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.setAttribute('data-text', logoLink.textContent);
    }
});