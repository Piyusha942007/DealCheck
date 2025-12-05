// --- Hamburger & Mobile Menu Logic ---
function toggleMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuPopover = document.getElementById('mobileMenuPopover');
    
    if (!mobileMenuButton || !mobileMenuPopover) return;
    
    const isOpen = mobileMenuButton.classList.toggle('is-open');
    mobileMenuPopover.classList.toggle('is-open');
    mobileMenuButton.setAttribute('aria-expanded', isOpen);
    mobileMenuPopover.setAttribute('aria-hidden', !isOpen);

    // Simple CSS animation fallback for mobile menu visibility
    mobileMenuPopover.style.opacity = isOpen ? 1 : 0;
    mobileMenuPopover.style.visibility = isOpen ? 'visible' : 'hidden';
    mobileMenuPopover.style.transform = isOpen ? 'scale(1)' : 'scale(0.9)';
    
    // Hamburger animation
    const lines = mobileMenuButton.querySelectorAll('.hamburger-line');
    if (isOpen) {
        lines[0].style.transform = 'translateY(4px) rotate(45deg)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'translateY(-4px) rotate(-45deg)';
    } else {
        lines[0].style.transform = 'translateY(0) rotate(0deg)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'translateY(0) rotate(0deg)';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Re-select elements inside DOMContentLoaded to ensure they exist
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuPopover = document.getElementById('mobileMenuPopover');
    const mobileLinks = document.querySelectorAll('#mobileMenuPopover .mobile-menu-link');
    const desktopPills = document.querySelectorAll('#desktop-nav-items .pill');
    const pillNavContainer = document.getElementById('pill-nav-container');
    const siteName = document.querySelector('.site-name');
    const cards = document.querySelectorAll('.why-card');
    const WHY_US_SECTION = document.getElementById('whyus-cards-container');

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuPopover && mobileMenuPopover.classList.contains('is-open')) {
                toggleMobileMenu(); // Close menu on link click
            }
        });
    });

    // --- 2. Smooth Scrolling & Desktop Pill Hover Logic ---
    function handleLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    }

    desktopPills.forEach(link => link.addEventListener('click', handleLinkClick));
    mobileLinks.forEach(link => link.addEventListener('click', handleLinkClick));
    if (siteName) siteName.addEventListener('click', handleLinkClick);


    document.querySelectorAll('.pill').forEach(pill => {
        const hoverCircle = pill.querySelector('.hover-circle');
        const label = pill.querySelector('.pill-label');
        const labelHover = pill.querySelector('.pill-label-hover');
        
        // Ensure initial hidden state is set for animation
        if (labelHover) {
            labelHover.style.transform = 'translateY(100%)'; 
            labelHover.style.opacity = 0;
        }
        if (hoverCircle) hoverCircle.style.transform = 'translate(-50%, 0) scale(0)';

        pill.addEventListener('mouseenter', () => {
            const size = Math.max(pill.clientWidth, pill.clientHeight) * 2;
            if (hoverCircle) {
                hoverCircle.style.width = `${size}px`;
                hoverCircle.style.height = `${size}px`;
                hoverCircle.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                hoverCircle.style.transform = 'translate(-50%, 0) scale(1.2)';
            }

            if (label) label.style.transform = 'translateY(-100%)';
            if (labelHover) {
                labelHover.style.transform = 'translateY(0)';
                labelHover.style.opacity = 1;
            }
        });

        pill.addEventListener('mouseleave', () => {
            if (hoverCircle) {
                hoverCircle.style.transition = 'all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                hoverCircle.style.transform = 'translate(-50%, 0) scale(0)';
            }

            if (label) label.style.transform = 'translateY(0)';
            if (labelHover) {
                labelHover.style.transform = 'translateY(100%)';
                labelHover.style.opacity = 0;
            }
        });
    });

    // --- 3. STICKY NAV LOGIC ---
    if (pillNavContainer) {
        window.requestAnimationFrame(() => {
            const navStartOffset = pillNavContainer.offsetTop; 
            
            const handleScroll = () => {
                if (window.scrollY > navStartOffset) {
                    pillNavContainer.classList.add('is-sticky');
                } else {
                    pillNavContainer.classList.remove('is-sticky');
                }
            };

            window.addEventListener('scroll', handleScroll);
            handleScroll();
        });
    }


    // --- 4. VANILLA JAVASCRIPT TILTED CARD EFFECT & SCROLL DROP ---
    const ROTATE_AMPLITUDE = 12;
    const SCALE_ON_HOVER = 1.05;
    
    // Scroll Drop Logic for Why Us Cards (Feature Cards)
    if (WHY_US_SECTION) {
        const observerOptions = {
            root: null, threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach(card => { card.classList.add('drop-in'); });
                    observer.unobserve(entry.target); 
                }
            });
        };
        
        const dropObserver = new IntersectionObserver(observerCallback, observerOptions);
        dropObserver.observe(WHY_US_SECTION);
    }

    // Tilted Card Mouse Move Logic
    cards.forEach(card => {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;
            const normX = offsetX / (rect.width / 2);
            const normY = offsetY / (rect.height / 2);
            const rotationX = normY * -ROTATE_AMPLITUDE;
            const rotationY = normX * ROTATE_AMPLITUDE;

            card.style.transform = `scale(${SCALE_ON_HOVER}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            
            card.style.boxShadow = `
                ${-normX * 10}px ${-normY * 10}px 30px rgba(0, 0, 0, 0.5), 
                0 0 15px var(--neon-magenta), 0 0 15px var(--neon-blue)
            `;
            card.style.transition = 'transform 0.05s linear';
        };

        const handleMouseLeave = () => {
            card.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
            card.style.boxShadow = `0 5px 15px rgba(0,0,0,0.5)`;
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        };
        
        if (window.innerWidth > 992) {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
            card.style.boxShadow = `0 5px 15px rgba(0,0,0,0.5)`;
        } else {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            card.style.boxShadow = `0 5px 15px rgba(0,0,0,0.5)`;
        }
    });

    // --- 5. FALLING PRICE TAG ANIMATION (Continuous Spawn on Scroll) ---
const boxContainer = document.getElementById("falling-boxes-container");
if (!boxContainer) return; 

// --- Constants for Spawn Logic and Visuals ---
const BASE_TAG_WIDTH = 50; 
const BASE_TAG_HEIGHT = 25; 
// FIX: INCREASED Z-DEPTH FOR MORE VISIBLE 3D EFFECT
const MAX_Z_DEPTH = 1200; 
// FIX: Slightly smaller interval to ensure more elements are seen at once
const SPAWN_INTERVAL = 80; 
// --- End Constants ---

let lastScrollY = window.scrollY;
let nextSpawnPosition = lastScrollY;
let isSpawning = false;
let spawnTimer = null;

// Array of mock price tags
const priceTags = [
    "$19.99", "$45.00", "$9.50", "$75.25", "20% OFF", "$10.00", "$32.99", "$99.99",
    "SALE!", "$5.00", "$15.00", "$49.99", "$12.00", "FREE!"
];

// ... (rest of spawnFallingBox function remains the same, but it will use the new MAX_Z_DEPTH)
function spawnFallingBox() {
    const price = priceTags[Math.floor(Math.random() * priceTags.length)];
    const box = document.createElement("div");
    
    const colorClass = Math.random() < 0.5 ? 'color-blue' : 'color-magenta';
    box.classList.add("falling-box", colorClass);

    box.innerHTML = `<span>${price}</span>`;
    
    // Random size and duration
    const duration = (2 + Math.random() * 3);
    const size = 1.0 + Math.random() * 1.0; 
    
    // Set dimensions based on BASE_SIZE
    box.style.width = `${BASE_TAG_WIDTH * size}px`; 
    box.style.height = `${BASE_TAG_HEIGHT * size}px`; 
    box.style.lineHeight = `${BASE_TAG_HEIGHT * size}px`; 
    box.style.left = Math.random() * 95 + "vw"; 
    
    // Animation variables using new MAX_Z_DEPTH
    box.style.animationDuration = duration + "s";
    box.style.setProperty('--initial-z', `${Math.random() * -MAX_Z_DEPTH - 200}px`); 
    box.style.setProperty('--end-z', `${Math.random() * MAX_Z_DEPTH + 100}px`);
    box.style.setProperty('--end-rot', `${Math.random() * 720}deg`);

    boxContainer.appendChild(box);

    setTimeout(() => box.remove(), duration * 1000 + 100);
}

// Global scroll event listener
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    // --- Start Spawning Logic: If moving, start the rain ---
    if (Math.abs(currentScroll - lastScrollY) > 0) {
        if (!isSpawning) {
             isSpawning = true;
             // Start timer which spawns boxes repeatedly
             spawnTimer = setInterval(spawnFallingBox, 100); 
        }
    } 

    // --- Stop Spawning Logic (Using Debounce) ---
    clearTimeout(window.scrollEndTimer);
    
    window.scrollEndTimer = setTimeout(() => {
        isSpawning = false;
        clearInterval(spawnTimer);
    }, 200);

    lastScrollY = currentScroll;
    });
});