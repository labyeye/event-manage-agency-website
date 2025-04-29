let isMobileNavOpen = false;

function toggleMobileNav() {
    isMobileNavOpen = !isMobileNavOpen;
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active', isMobileNavOpen);
}
