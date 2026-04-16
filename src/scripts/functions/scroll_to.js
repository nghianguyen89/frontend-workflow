function normalizePath(path) {
    if (!path) return '/';

    return path
        .replace(/\/+$/, '') // remove trailing slash
        .toLowerCase();
}

function scrollToAnchor(hash) {
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    const header = document.querySelector('#header');
    const headerHeight = header ? header.offsetHeight : 0;

    const offset = 20;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;

    window.scrollTo({
        top: top,
        behavior: 'smooth',
    });
}

function handleAnchorClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    if (!href || !href.includes('#')) return;

    const url = new URL(href, window.location.origin);
    const targetPath = normalizePath(url.pathname);
    const currentPath = normalizePath(window.location.pathname);
    const hash = url.hash;
    if (!hash) return;

    if (targetPath !== currentPath) {
        // khác page -> chuyển trang
        window.location.href = url.href;
        return;
    }
    // cùng page
    e.preventDefault();
    scrollToAnchor(hash);

    // remove hash khỏi URL
    history.replaceState(null, '', window.location.pathname);
}

function initAnchorScroll() {
    // click
    document.querySelectorAll('a.scrollTo').forEach(function (link) {
        link.addEventListener('click', handleAnchorClick);
    });
    // load page có hash
    if (window.location.hash) {
        setTimeout(function () {
            scrollToAnchor(window.location.hash);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', initAnchorScroll);
