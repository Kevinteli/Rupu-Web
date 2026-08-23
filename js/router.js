document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const views = document.querySelectorAll('.view-section');
    const links = document.querySelectorAll('.spa-link');
    const sidebar = document.getElementById('app-sidebar');
    const masterContainer = document.getElementById('master-container');
    
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
            // Global views: hide sidebar, full width container
            if (sidebar) sidebar.style.display = 'none';
            if (masterContainer) {
                masterContainer.classList.remove('max-w-7xl', 'mx-auto', 'px-6');
                masterContainer.classList.add('w-full');
            }
        } else {
            // Guide views: show sidebar, constrained container
            if (sidebar) sidebar.style.display = 'flex';
            if (masterContainer) {
                masterContainer.classList.add('max-w-7xl', 'mx-auto');
                masterContainer.classList.remove('w-full');
            }
        }

        // 4. Update Navigation Links States (Header and Sidebar)
        links.forEach(link => {
            if (link.id === 'nav-logo') return; // Do not touch the logo's classes
            
            const linkView = link.getAttribute('data-view');
            const isHeaderLink = link.id.startsWith('nav-');
            const isSidebarLink = link.closest('#app-sidebar') !== null;
            
            if (linkView === viewId || (viewId !== 'inicio' && viewId !== 'galeria' && link.id === 'nav-docs')) {
                // ACTIVE STATE
                if (isHeaderLink) {
                    link.className = "relative group spa-link font-body-md text-lg font-bold text-on-primary active:scale-95 py-1 active-header-nav";
                } else if (isSidebarLink) {
                    // Classic flat sidebar active state
                    link.className = "group spa-link flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold nav-link";
                }
            } else {
                // INACTIVE STATE
                if (isHeaderLink) {
                    link.className = "relative group spa-link font-body-md text-lg text-on-primary/80 transition-all duration-200 active:scale-95 py-1";
                } else if (isSidebarLink) {
                    link.className = "group spa-link flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-variant/50 hover:text-on-surface transition-colors nav-link";
                }
            }
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, `#${viewId}`);
        window.scrollTo(0,0);
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
