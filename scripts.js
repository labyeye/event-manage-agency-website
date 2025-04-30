let isMobileNavOpen = false;

function toggleMobileNav() {
  isMobileNavOpen = !isMobileNavOpen;
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active', isMobileNavOpen);
}

// ✅ Close mobile nav when any link is clicked
document.addEventListener("DOMContentLoaded", () => {
  const navLinksContainer = document.querySelector('.nav-links');

  navLinksContainer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (isMobileNavOpen) {
        navLinksContainer.classList.remove("active");
        isMobileNavOpen = false;
      }
    });
  });
});
