document.addEventListener('DOMContentLoaded', () => {
    // --- Library Tab Navigation ---
    const navItems = document.querySelectorAll('.nav-item[href^="#lib-"]');
    const libViews = document.querySelectorAll('.lib-view');
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel = document.querySelector('.theme-toggle-btn');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);

            // Update nav active state
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');

            // Update visible view
            libViews.forEach(view => {
                view.id === targetId
                    ? view.classList.add('active')
                    : view.classList.remove('active');
            });
        });
    });

    // --- Theme Toggle ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', (e) => {
        localStorage.setItem('theme', e.target.checked ? 'light' : 'dark');
    });

    if (themeLabel) {
        themeLabel.setAttribute('tabindex', '0');
        themeLabel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeSwitch.click();
            }
        });
    }

    // --- Remove Book Buttons (demo — just animates out) ---
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.book-card, .bookmark-item');
            if (card) {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.remove(), 350);
            }
        });
    });

    // --- Add to Library from Wishlist (demo) ---
    document.querySelectorAll('.add-lib-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.innerHTML = '<i class="ph ph-check-circle"></i> Added!';
            btn.style.color = '#22c55e';
            btn.disabled = true;
        });
    });

    // --- Escape key closes modal ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.location.hash.includes('Modal')) {
            window.location.hash = '#';
        }
    });
});
