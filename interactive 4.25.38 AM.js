// interactive.js - for cursor and other animations

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;

        cursorOutline.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Cursor Interaction Logic ---
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .swiper-slide, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursorOutline.classList.add('hover-link');
        });
        el.addEventListener('mouseout', () => {
            cursorOutline.classList.remove('hover-link');
        });
    });
});