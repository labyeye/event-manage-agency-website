let isMobileNavOpen = false;

function toggleMobileNav(e) {
  
  if (e) {
    e.stopPropagation();
  }
  
  isMobileNavOpen = !isMobileNavOpen;
  console.log(`[toggleMobileNav] Menu is now: ${isMobileNavOpen ? 'OPEN' : 'CLOSED'}`, { isMobileNavOpen, eventType: e?.type });
  
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;
  
  
  if (!navLinks || !hamburger) {
    console.error("[toggleMobileNav] ERROR: Required elements not found!", { navLinks: !!navLinks, hamburger: !!hamburger });
    return;
  }
  
  navLinks.classList.toggle("active", isMobileNavOpen);
  hamburger.classList.toggle("active", isMobileNavOpen);
  
  
  if (overlay) {
    overlay.classList.toggle("active", isMobileNavOpen);
  }
  
  
  if (isMobileNavOpen) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "";
  }
}

function closeMobileNav() {
  console.log("[closeMobileNav] Closing menu. Previous state:", { isMobileNavOpen });
  isMobileNavOpen = false;
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;
  
  navLinks.classList.remove("active");
  hamburger.classList.remove("active");
  
  if (overlay) {
    overlay.classList.remove("active");
  }
  
  body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DOMContentLoaded] Page loaded, initializing mobile nav...");
  const navLinksContainer = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const navbar = document.querySelector(".navbar");

  console.log("[DOMContentLoaded] Elements found:", { 
    hamburger: !!hamburger, 
    navLinksContainer: !!navLinksContainer,
    overlay: !!overlay,
    navbar: !!navbar 
  });

  
  if (hamburger) {
    console.log("[DOMContentLoaded] Attaching hamburger click listener...");
    hamburger.addEventListener("click", (e) => {
      console.log("[Hamburger Click] Clicked! Stopping propagation and toggling menu...");
      e.stopPropagation();
      e.preventDefault();
      toggleMobileNav(e);
    });
    console.log("[DOMContentLoaded] Hamburger click listener successfully attached");
  } else {
    console.error("[DOMContentLoaded] ERROR: Hamburger element not found!");
  }

  if (!navLinksContainer) {
    console.error("[DOMContentLoaded] ERROR: Nav links container not found!");
    return;
  }

  
  const dropdowns = document.querySelectorAll(".dropdown");
  
  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");
    if (link) {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && isMobileNavOpen) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle("active");
        }
      });
    }
  });

  
  navLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const parentDropdown = link.closest(".dropdown");
      const dropdownMenu = parentDropdown ? parentDropdown.querySelector(".dropdown-menu") : null;
      
      
      if (!parentDropdown || !dropdownMenu || !dropdownMenu.contains(e.target)) {
        if (isMobileNavOpen && !parentDropdown) {
          closeMobileNav();
        }
      }
    });
  });
  
  
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileNav();
    });
  }
  
  
  document.addEventListener("click", (e) => {
    
    if (isMobileNavOpen && navbar && !navbar.contains(e.target) && !navLinksContainer.contains(e.target)) {
      console.log("[Outside Click] Closing menu due to click outside", { target: e.target });
      closeMobileNav();
    }
  });

  
  window.addEventListener("resize", () => {
    console.log("[Window Resize] Width:", window.innerWidth, "Nav open:", isMobileNavOpen);
    if (window.innerWidth > 768 && isMobileNavOpen) {
      console.log("[Window Resize] Closing menu due to resize above 768px");
      closeMobileNav();
    }
  });
});


