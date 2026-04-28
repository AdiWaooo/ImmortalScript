document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // NAV + VIEW SWITCHING
    // =============================================
    const navItems = document.querySelectorAll('.nav-item[href^="#view-"]');
    const views    = document.querySelectorAll('.view');
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel  = document.querySelector('.theme-toggle-btn');
    const dismissBtn  = document.querySelector('.announcement-link');
    const announcementBanner = document.querySelector('.announcement-banner');

    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) navMenu.setAttribute('role', 'tablist');

    function activateView(targetId) {
        navItems.forEach(nav => {
            nav.classList.remove('active');
            nav.setAttribute('aria-selected', 'false');
        });
        views.forEach(view => {
            view.id === targetId
                ? view.classList.add('active')
                : view.classList.remove('active');
        });
        const match = document.querySelector(`.nav-item[href="#${targetId}"]`);
        if (match) {
            match.classList.add('active');
            match.setAttribute('aria-selected', 'true');
        }
    }

    navItems.forEach(item => {
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-selected', item.classList.contains('active') ? 'true' : 'false');
        item.addEventListener('click', e => {
            e.preventDefault();
            activateView(item.getAttribute('href').substring(1));
        });
    });

    // Quick-access + similar book cards (internal nav)
    document.querySelectorAll('.nav-item-link').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const target = card.getAttribute('data-view');
            if (target) activateView(target);
        });
    });

    // Default view on load
    const hash = window.location.hash;
    activateView(hash.startsWith('#view-') ? hash.substring(1) : 'view-dashboard');

    // =============================================
    // THEME TOGGLE
    // =============================================
    const isLight = () => localStorage.getItem('theme') === 'light';

    if (isLight() && themeSwitch) themeSwitch.checked = true;

    if (themeSwitch) {
        themeSwitch.addEventListener('change', e => {
            const mode = e.target.checked ? 'light' : 'dark';
            localStorage.setItem('theme', mode);
            updateChartTheme();
        });
    }

    if (themeLabel) {
        themeLabel.setAttribute('tabindex', '0');
        themeLabel.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeSwitch.click(); }
        });
    }

    // =============================================
    // ANNOUNCEMENT DISMISS
    // =============================================
    if (dismissBtn && announcementBanner) {
        dismissBtn.addEventListener('click', e => {
            e.preventDefault();
            announcementBanner.classList.add('hidden');
        });
    }

    // =============================================
    // MODAL ACCESSIBILITY
    // =============================================
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.setAttribute('aria-label', 'Close Modal');
            closeBtn.addEventListener('click', e => { e.preventDefault(); window.location.hash = '#'; });
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && window.location.hash.includes('Modal')) window.location.hash = '#';
    });

    // =============================================
    // CHART.JS — INTERACTIVE CHARTS
    // =============================================
    if (typeof Chart === 'undefined') return;

    function themeColors() {
        const light = isLight();
        return {
            text:    light ? '#09090b' : '#ffffff',
            sub:     light ? '#52525b' : '#a1a1aa',
            grid:    light ? '#e4e4e7' : '#27272a',
            surface: light ? '#ffffff' : '#111111',
        };
    }

    // ---- Doughnut: Favorite Genres ----
    const genreCanvas = document.getElementById('genreChart');
    let genreChart = null;

    if (genreCanvas) {
        const tc = themeColors();
        genreChart = new Chart(genreCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Xianxia', 'Wuxia', 'Action', 'Dark Fantasy', 'Other'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: ['#818cf8', '#38bdf8', '#f472b6', '#fb923c', '#4ade80'],
                    borderColor: tc.surface,
                    borderWidth: 3,
                    hoverOffset: 12,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '65%',
                animation: { animateRotate: true, duration: 900, easing: 'easeInOutQuart' },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: tc.sub,
                            font: { family: 'Inter', size: 11 },
                            padding: 14,
                            boxWidth: 10,
                            boxHeight: 10,
                            usePointStyle: true,
                            pointStyle: 'circle',
                        }
                    },
                    tooltip: {
                        backgroundColor: tc.surface,
                        titleColor: tc.text,
                        bodyColor: tc.sub,
                        borderColor: tc.grid,
                        borderWidth: 1,
                        padding: 10,
                        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
                    }
                }
            }
        });
    }

    // ---- Bar: Book Reading Time ----
    const readingCanvas = document.getElementById('readingTimeChart');
    let readingChart = null;

    if (readingCanvas) {
        const tc = themeColors();
        readingChart = new Chart(readingCanvas, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours Read',
                    data: [1.5, 2.5, 1.0, 3.0, 2.0, 4.5, 3.5],
                    backgroundColor: 'rgba(129,140,248,0.65)',
                    borderColor: '#818cf8',
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                    hoverBackgroundColor: '#818cf8',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: { duration: 900, easing: 'easeInOutQuart' },
                scales: {
                    x: {
                        grid: { color: tc.grid },
                        ticks: { color: tc.sub, font: { family: 'Inter', size: 11 } },
                        border: { color: tc.grid },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: tc.grid },
                        ticks: {
                            color: tc.sub,
                            font: { family: 'Inter', size: 11 },
                            stepSize: 1,
                            callback: v => v + 'h'
                        },
                        border: { color: tc.grid },
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: tc.surface,
                        titleColor: tc.text,
                        bodyColor: tc.sub,
                        borderColor: tc.grid,
                        borderWidth: 1,
                        padding: 10,
                        callbacks: { label: ctx => ` ${ctx.parsed.y} hrs` }
                    }
                }
            }
        });
    }

    // ---- Re-apply theme colors when toggled ----
    function updateChartTheme() {
        const tc = themeColors();
        [genreChart, readingChart].forEach(chart => {
            if (!chart) return;

            // Tooltip & legend
            chart.options.plugins.tooltip.backgroundColor = tc.surface;
            chart.options.plugins.tooltip.titleColor      = tc.text;
            chart.options.plugins.tooltip.bodyColor       = tc.sub;
            chart.options.plugins.tooltip.borderColor     = tc.grid;
            if (chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = tc.sub;
            }

            // Scales
            if (chart.options.scales) {
                ['x', 'y'].forEach(axis => {
                    if (!chart.options.scales[axis]) return;
                    chart.options.scales[axis].grid.color  = tc.grid;
                    chart.options.scales[axis].ticks.color = tc.sub;
                    if (chart.options.scales[axis].border) {
                        chart.options.scales[axis].border.color = tc.grid;
                    }
                });
            }

            // Doughnut border
            if (chart.config.type === 'doughnut') {
                chart.data.datasets[0].borderColor = tc.surface;
            }

            chart.update('none');
        });
    }
});
