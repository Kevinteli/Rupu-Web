document.addEventListener("DOMContentLoaded", () => {

    // 1. Smart Header Interaction
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let scrollThreshold = 10; // Pixels to scroll before hiding/showing

    // Elements that only exist on specific views
    const heroBg = document.getElementById('hero-bg-wrapper');
    const heroSection = document.getElementById('hero-section');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        // --- Header Scroll Logic ---
        if (header) {
            if (currentScrollY <= 0) {
                // Top of the page
                header.classList.remove('header-hidden');
                header.classList.remove('header-scrolled');
            } else {
                // Scrolling down
                if (scrollDelta > scrollThreshold) {
                    header.classList.add('header-hidden');
                } 
                // Scrolling up
                else if (scrollDelta < -scrollThreshold) {
                    header.classList.remove('header-hidden');
                    header.classList.add('header-scrolled');
                }
            }
        }

        lastScrollY = currentScrollY;

        // --- Hero Background Dynamic Scroll Effect (Only on Inicio) ---
        if (heroBg && heroSection && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            const heroHeight = heroSection.offsetHeight;
            if (currentScrollY <= heroHeight) {
                const scrollFraction = currentScrollY / heroHeight;
                // Scale up (zoom in) from 1 to 1.2
                const scale = 1 + (scrollFraction * 0.2);
                // Blur from 0px to 10px
                const blur = scrollFraction * 10;

                heroBg.style.transform = `scale(${scale})`;
                heroBg.style.filter = `blur(${blur}px)`;
            }
        }
    }, { passive: true });

    // 2. Micro-interactions (Galeria)
    document.querySelectorAll('.group').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Potential for adding haptic-like visual feedback or sound
        });
    });

    // 3. Search bar focus effect
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.classList.add('w-64');
        });
        searchInput.addEventListener('blur', () => {
            if (searchInput.value === '') {
                searchInput.classList.remove('w-64');
            }
        });
    }

});

// Modal Logic for Carousel Logos
function openLogoModal(element) {
    const modal = document.getElementById('logo-modal');
    const content = document.getElementById('logo-modal-content');
    
    // Copy the innerHTML of the clicked element
    const clone = element.cloneNode(true);
    
    // Adjust classes for the modal (make text and icons much bigger)
    const icon = clone.querySelector('.material-symbols-outlined');
    if (icon) {
        icon.className = 'material-symbols-outlined text-[120px] mb-6';
    }
    const text = clone.querySelector('span:not(.material-symbols-outlined)');
    if (text) {
        text.className = 'font-bold text-5xl leading-tight uppercase tracking-widest';
    }
    
    // Adjust future images
    const img = clone.querySelector('img');
    if (img) {
        img.className = 'max-w-full max-h-[60vh] object-contain';
    }
    
    // Remove the cursor-pointer from the clone so it doesn't look clickable
    clone.classList.remove('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
    // Ensure the flex layout of the clone is column for the modal
    clone.classList.remove('flex-row', 'gap-3');
    clone.classList.add('flex-col', 'gap-4');
    
    content.innerHTML = '';
    content.appendChild(clone);
    
    // Show modal with animation
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // Add flex to enable centering
    // Trigger animation frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.firstElementChild.classList.remove('scale-95');
        });
    });
}

function closeLogoModal() {
    const modal = document.getElementById('logo-modal');
    modal.classList.add('opacity-0');
    modal.firstElementChild.classList.add('scale-95');
    
    // Wait for transition to finish before hiding
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}
