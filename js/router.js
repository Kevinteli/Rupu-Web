document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const views = document.querySelectorAll('.view-section');
    const links = document.querySelectorAll('.spa-link');
    const sidebar = document.getElementById('app-sidebar');
    const mobileDocsNav = document.getElementById('mobile-docs-nav');
    const masterContainer = document.getElementById('master-container');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

    // Mobile Menu Toggle Logic
    function closeMobileMenu() {
        if (mobileMenu && mobileMenuBackdrop) {
            mobileMenu.classList.add('translate-x-full');
            mobileMenuBackdrop.classList.add('hidden', 'opacity-0');
            document.body.classList.remove('overflow-hidden');
        }
    }

    function openMobileMenu() {
        if (mobileMenu && mobileMenuBackdrop) {
            mobileMenuBackdrop.classList.remove('hidden');
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenuBackdrop.classList.remove('opacity-0');
            });
            document.body.classList.add('overflow-hidden');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Routing Logic
    function navigateTo(viewId) {
        // 1. Hide all views
        views.forEach(v => v.classList.add('hidden'));

        // 2. Show target view
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
        } else {
            document.getElementById('view-inicio').classList.remove('hidden');
            viewId = 'inicio';
        }

        // 3. Handle Layout and Sidebar visibility for global views vs guides
        if (viewId === 'inicio' || viewId === 'galeria') {
            // Global views: hide sidebar on all screens, full width container
            if (sidebar) {
                sidebar.classList.add('hidden');
                sidebar.classList.remove('md:flex');
            }
            if (mobileDocsNav) {
                mobileDocsNav.classList.add('hidden');
            }
            if (masterContainer) {
                masterContainer.classList.remove('max-w-7xl', 'mx-auto', 'px-6');
                masterContainer.classList.add('w-full');
            }
        } else {
            // Guide views: show sidebar on desktop (md:flex), show compact pill nav on mobile
            if (sidebar) {
                sidebar.classList.add('hidden', 'md:flex');
            }
            if (mobileDocsNav) {
                mobileDocsNav.classList.remove('hidden');
            }
            if (masterContainer) {
                masterContainer.classList.add('max-w-7xl', 'mx-auto');
                masterContainer.classList.remove('w-full');
            }
        }

        // 4. Update Navigation Links States (Header, Sidebar, Mobile Menu, Mobile Docs Nav)
        links.forEach(link => {
            if (link.id === 'nav-logo') return; // Do not touch the logo's classes

            const linkView = link.getAttribute('data-view');
            const isHeaderLink = link.id.startsWith('nav-');
            const isSidebarLink = link.closest('#app-sidebar') !== null;
            const isMobileDocsPill = link.closest('#mobile-docs-nav') !== null;
            const isMobileMenuLink = link.closest('#mobile-menu') !== null;

            const isActive = linkView === viewId || (viewId !== 'inicio' && viewId !== 'galeria' && link.id === 'nav-docs');

            if (isActive) {
                // ACTIVE STATE
                if (isHeaderLink) {
                    link.className = "relative group spa-link font-body-md text-lg font-bold text-on-primary active:scale-95 py-1 active-header-nav";
                } else if (isSidebarLink) {
                    link.className = "group spa-link flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold nav-link";
                } else if (isMobileDocsPill) {
                    link.className = "spa-link shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-rojito text-white shadow-sm transition-all";
                } else if (isMobileMenuLink) {
                    link.className = "spa-link flex items-center gap-3 px-4 py-3 rounded-lg bg-rojito/10 text-rojito font-bold transition-colors";
                }
            } else {
                // INACTIVE STATE
                if (isHeaderLink) {
                    link.className = "relative group spa-link font-body-md text-lg text-on-primary/80 transition-all duration-200 active:scale-95 py-1";
                } else if (isSidebarLink) {
                    link.className = "group spa-link flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-variant/50 hover:text-on-surface transition-colors nav-link";
                } else if (isMobileDocsPill) {
                    link.className = "spa-link shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-variant transition-all";
                } else if (isMobileMenuLink) {
                    link.className = "spa-link flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors";
                }
            }
        });

        // Close mobile drawer if open
        closeMobileMenu();

        // Update URL hash without jumping
        history.pushState(null, null, `#${viewId}`);
        window.scrollTo(0, 0);
    }

    // Intercept Clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            if (viewId) {
                navigateTo(viewId);
            }
        });
    });

    // Handle initial load based on URL hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        navigateTo(initialHash);
    } else {
        navigateTo('inicio');
    }
});
