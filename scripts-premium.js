document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.getElementById("heroVideo");

  if (!heroVideo) return;

  heroVideo.addEventListener("ended", () => {
    heroVideo.style.animation = "none";
    setTimeout(() => {
      heroVideo.style.animation = "videoFadeInOut 6s ease-in-out";
    }, 10);
  });

  heroVideo.play().catch(() => {
    console.log("Video autoplay prevention - user interaction may be needed");
  });
});

let isMobileNavOpen = false;

function toggleMobileNav(e) {
  if (e) {
    e.stopPropagation();
  }

  isMobileNavOpen = !isMobileNavOpen;
  console.log(
    `[toggleMobileNav] Menu is now: ${isMobileNavOpen ? "OPEN" : "CLOSED"}`,
    { isMobileNavOpen, eventType: e?.type },
  );

  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;

  if (!navLinks || !hamburger) {
    console.error("[toggleMobileNav] ERROR: Required elements not found!", {
      navLinks: !!navLinks,
      hamburger: !!hamburger,
    });
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
  console.log("[closeMobileNav] Closing menu. Previous state:", {
    isMobileNavOpen,
  });
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
    navbar: !!navbar,
  });

  if (hamburger) {
    console.log("[DOMContentLoaded] Attaching hamburger click listener...");
    hamburger.addEventListener("click", (e) => {
      console.log(
        "[Hamburger Click] Clicked! Stopping propagation and toggling menu...",
      );
      e.stopPropagation();
      e.preventDefault();
      toggleMobileNav(e);
    });
    console.log(
      "[DOMContentLoaded] Hamburger click listener successfully attached",
    );
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
      const dropdownMenu = parentDropdown
        ? parentDropdown.querySelector(".dropdown-menu")
        : null;

      if (
        !parentDropdown ||
        !dropdownMenu ||
        !dropdownMenu.contains(e.target)
      ) {
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
    if (
      isMobileNavOpen &&
      navbar &&
      !navbar.contains(e.target) &&
      !navLinksContainer.contains(e.target)
    ) {
      console.log("[Outside Click] Closing menu due to click outside", {
        target: e.target,
      });
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    console.log(
      "[Window Resize] Width:",
      window.innerWidth,
      "Nav open:",
      isMobileNavOpen,
    );
    if (window.innerWidth > 768 && isMobileNavOpen) {
      console.log("[Window Resize] Closing menu due to resize above 768px");
      closeMobileNav();
    }
  });
});

let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 100) {
    navbar.classList.add("scroll-active");
  } else {
    navbar.classList.remove("scroll-active");
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
      animationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(
    "h2, h3, h4, .service-card, .feature-box, .testimonial-card, .portfolio-item, p:not(.hero-tagline):not(.hero-description), .highlight",
  );

  elementsToAnimate.forEach((el, index) => {
    if (
      !el.classList.contains("fade-in-up") &&
      !el.classList.contains("fade-in-left") &&
      !el.classList.contains("fade-in-right")
    ) {
      const staggerClass = `stagger-${(index % 5) + 1}`;
      el.classList.add(staggerClass);
      animationObserver.observe(el);
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || href === "") return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", (e) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        navDropdown.classList.toggle("active");
        const dropdownMenu = document.querySelector(".dropdown-menu");
        dropdownMenu.style.opacity = navDropdown.classList.contains("active")
          ? "1"
          : "0";
        dropdownMenu.style.visibility = navDropdown.classList.contains("active")
          ? "visible"
          : "hidden";
        dropdownMenu.style.transform = navDropdown.classList.contains("active")
          ? "translateY(0) scale(1)"
          : "translateY(-10px) scale(0.95)";
      }
    });
  }

  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();

      this.classList.add("clicked");

      const link = this.getAttribute("data-link");

      if (link) {
        this.style.opacity = "0.8";
        this.style.transform = "scale(1.02)";

        setTimeout(() => {
          window.location.href = link;
        }, 300);
      }
    });

    card.addEventListener("mouseleave", function () {
      this.classList.remove("clicked");
    });
  });

  document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".nav-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

function setupPortfolioFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
          item.classList.add("fade-in-up");
        } else {
          item.classList.remove("fade-in-up");
        }
      });
    });
  });

  if (filterBtns.length > 0) {
    filterBtns[0].click();
  }
}

document.addEventListener("DOMContentLoaded", setupPortfolioFilters);

class TestimonialCarousel {
  constructor() {
    this.container = document.querySelector(".testimonials-grid");
    this.cards = document.querySelectorAll(".testimonial-card");
    this.currentIndex = 0;
    this.autoScrollInterval = null;

    if (this.cards.length > 3) {
      this.init();
    }
  }

  init() {
    this.setupCarousel();
    this.startAutoScroll();
    this.setupEventListeners();
  }

  setupCarousel() {
    if (!this.container) return;

    this.container.style.display = "flex";
    this.container.style.overflowX = "auto";
    this.container.style.scrollBehavior = "smooth";
    this.container.style.scrollSnapType = "x mandatory";

    this.cards.forEach((card) => {
      card.style.scrollSnapAlign = "start";
      card.style.flex = "0 0 calc(33.333% - 1.5rem)";
      card.style.animation = "fadeInUp 0.8s ease-out forwards";
    });
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      const scrollAmount = this.currentIndex * (this.container.offsetWidth / 3);

      this.container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 5000);
  }

  stopAutoScroll() {
    clearInterval(this.autoScrollInterval);
  }

  setupEventListeners() {
    this.container?.addEventListener("mouseenter", () => this.stopAutoScroll());
    this.container?.addEventListener("mouseleave", () =>
      this.startAutoScroll(),
    );
  }
}

function setupTestimonialCarousel() {
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  if (testimonialCards.length <= 3) return;

  new TestimonialCarousel();
}

class BookingForm {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      eventType: "",
      date: "",
      location: "",
      guestCount: "",
      budget: "",
      requirements: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.displayStep(1);
  }

  setupEventListeners() {
    const nextBtns = document.querySelectorAll(".next-step-btn");
    const prevBtns = document.querySelectorAll(".prev-step-btn");
    const submitBtn = document.querySelector(".submit-booking-btn");

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.nextStep());
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.prevStep());
    });

    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.submitForm());
    }

    document.querySelectorAll(".booking-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        this.formData[e.target.name] = e.target.value;
      });
    });
  }

  displayStep(step) {
    const steps = document.querySelectorAll(".booking-step");
    const progressBar = document.querySelector(".booking-progress");

    steps.forEach((s) => s.classList.remove("active"));

    const activeStep = document.querySelector(
      `.booking-step[data-step="${step}"]`,
    );
    if (activeStep) {
      activeStep.classList.add("active");
      activeStep.style.animation = "fadeInUp 0.5s ease-out";
    }

    if (progressBar) {
      const progress = (step / 4) * 100;
      progressBar.style.width = progress + "%";
    }

    const prevBtn = document.querySelector(".prev-step-btn");
    const nextBtn = document.querySelector(".next-step-btn");

    if (prevBtn) prevBtn.style.display = step === 1 ? "none" : "inline-block";
    if (nextBtn) nextBtn.style.display = step === 4 ? "none" : "inline-block";
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.displayStep(this.currentStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      this.showValidationError();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.displayStep(this.currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  validateStep(step) {
    const inputs = document.querySelectorAll(
      `.booking-step[data-step="${step}"] .booking-input`,
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value) {
        isValid = false;
        input.style.borderColor = "#D19C4A";
        input.style.boxShadow = "0 0 0 3px rgba(209, 156, 74, 0.2)";
      } else {
        input.style.borderColor = "";
        input.style.boxShadow = "";
      }
    });

    return isValid;
  }

  showValidationError() {
    const alert = document.createElement("div");
    alert.className = "validation-alert";
    alert.innerHTML =
      '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields';
    alert.style.cssText = `
      background: linear-gradient(135deg, #D19C4A 0%, #DBB172 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      animation: slideInDown 0.3s ease-out;
    `;

    const form = document.querySelector(".booking-form");
    if (form) {
      form.insertBefore(alert, form.firstChild);
      setTimeout(() => alert.remove(), 3000);
    }
  }

  submitForm() {
    if (this.validateStep(4)) {
      console.log("Booking Data:", this.formData);
      this.showSuccessMessage();

      this.sendToBackend();
    } else {
      this.showValidationError();
    }
  }

  showSuccessMessage() {
    const success = document.createElement("div");
    success.className = "success-message";
    success.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h3>Booking Request Submitted!</h3>
      <p>Thank you for choosing AR Events. We'll contact you shortly to confirm your event details.</p>
    `;
    success.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
      text-align: center;
      z-index: 2000;
      max-width: 400px;
      animation: scaleIn 0.5s ease-out;
    `;
    success.querySelector("h3").style.cssText =
      "color: #D19C4A; margin-top: 1rem;";
    success.querySelector("i").style.cssText =
      "font-size: 3rem; color: #D19C4A;";
    success.querySelector("p").style.cssText =
      "color: #747577; margin-top: 0.5rem;";

    document.body.appendChild(success);

    setTimeout(() => {
      success.remove();

      window.location.href = "index.html";
    }, 4000);
  }

  sendToBackend() {
    fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.formData),
    }).catch((err) => console.log("API call would be made here:", err));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".booking-form")) {
    new BookingForm();
  }
});

function setupLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.style.animation = "fadeIn 0.5s ease-out";
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

document.addEventListener("DOMContentLoaded", setupLazyLoading);

function animateCounters() {
  const counters = document.querySelectorAll("[data-target]");

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const current = +counter.innerText;
      const increment = target / 200;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCount, 10);
      } else {
        counter.innerText = target;
      }
    };

    const triggerCounter = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCount();
        triggerCounter.unobserve(counter);
      }
    });

    triggerCounter.observe(counter);
  });
}

document.addEventListener("DOMContentLoaded", animateCounters);

function setupLightbox() {
  const triggers = document.querySelectorAll(".lightbox-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const img = trigger.querySelector("img");
      if (img) {
        const lightbox = createLightbox(img.src, img.alt);
        document.body.appendChild(lightbox);
      }
    });

    trigger.style.cursor = "pointer";
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scroll-active');
    } else {
      navbar.classList.remove('scroll-active');
    }
  });
});
function createLightbox(src, alt) {
  const modal = document.createElement("div");
  modal.className = "lightbox-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 15, 15, 0.95);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 2rem;
    animation: fadeIn 0.4s ease-out;
  `;

  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 90vw;
    max-height: 90vh;
  `;

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.style.cssText = `
    max-width: 100%;
    max-height: 85vh;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(209, 156, 74, 0.5), 0 0 40px rgba(209, 156, 74, 0.3);
    animation: scaleIn 0.4s ease-out;
    object-fit: cover;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(209, 156, 74, 0.3);
    color: white;
    border: 2px solid rgba(209, 156, 74, 0.5);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  `;

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "rgba(209, 156, 74, 0.8)";
    closeBtn.style.transform = "scale(1.1)";
    closeBtn.style.boxShadow = "0 0 20px rgba(209, 156, 74, 0.6)";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "rgba(209, 156, 74, 0.3)";
    closeBtn.style.transform = "scale(1)";
    closeBtn.style.boxShadow = "none";
  });

  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  const keyHandler = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", keyHandler);
    }
  };

  document.addEventListener("keydown", keyHandler);

  container.appendChild(img);
  container.appendChild(closeBtn);
  modal.appendChild(container);

  return modal;
}

document.addEventListener("DOMContentLoaded", setupLightbox);

function setupFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (validateForm(form)) {
        submitForm(form);
      }
    });
  });
}

function validateForm(form) {
  const inputs = form.querySelectorAll(
    "input[required], textarea[required], select[required]",
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = "#D19C4A";
    } else {
      input.style.borderColor = "";
    }
  });

  return isValid;
}

function submitForm(form) {
  const formData = new FormData(form);

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerText;
  submitBtn.innerHTML = '<span class="loading"></span> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
    showNotification(
      "Message sent successfully! We'll get back to you soon.",
      "success",
    );
    form.reset();
  }, 2000);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#2196F3"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", setupFormValidation);

function setupParallax() {
  const elements = document.querySelectorAll("[data-parallax]");
  const hoverElements = document.querySelectorAll(
    ".service-card, .portfolio-item",
  );

  if (elements.length === 0) return;

  window.addEventListener("scroll", () => {
    elements.forEach((el) => {
      const scrollPosition = window.pageYOffset;
      const elementOffset = el.offsetTop;
      const distance = scrollPosition - elementOffset;
      const parallaxValue = distance * 0.5;

      el.style.transform = `translateY(${parallaxValue}px)`;
    });
  });

  hoverElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}

document.addEventListener("DOMContentLoaded", setupParallax);

function highlightActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
              link.style.color = "var(--primary-gold)";
            } else {
              link.style.color = "";
            }
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", highlightActiveNav);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMobileNavOpen) {
    document.getElementById("navLinks").classList.remove("active");
    document.getElementById("hamburger").classList.remove("active");
    isMobileNavOpen = false;
  }
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedScroll = debounce(() => {
  console.log("Scroll event fired");
}, 250);

window.addEventListener("scroll", debouncedScroll);

class ScrollAnimationManager {
  constructor() {
    this.elements = new Map();
    this.init();
  }

  init() {
    this.observeElements();
    this.setupScrollListener();
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });
  }

  animateElement(element) {
    const animationType = element.getAttribute("data-animate") || "fade-in-up";
    const delay = element.getAttribute("data-delay") || "0s";

    element.style.animation = `${animationType} 0.8s ease-out forwards`;
    element.style.animationDelay = delay;
  }

  setupScrollListener() {
    window.addEventListener(
      "scroll",
      debounce(() => {}, 250),
    );
  }
}

function addScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          entry.target.classList.add("animated");
          entry.target.classList.add("fade-in-up");
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(
      "p, h2, h3, .service-card, .feature-box, .testimonial-card",
    )
    .forEach((el) => {
      observer.observe(el);
    });
}

if (!window.scrollAnimationManager) {
  document.addEventListener("DOMContentLoaded", () => {
    window.scrollAnimationManager = new ScrollAnimationManager();
    addScrollAnimations();
  });
}

function trackEvent(eventName, eventData = {}) {
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, eventData);
  }
  console.log(`Event: ${eventName}`, eventData);
}

document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
  btn.addEventListener("click", () => {
    trackEvent("cta_click", {
      button_text: btn.innerText,
      button_url: btn.href,
    });
  });
});

if (typeof window.performance !== "undefined") {
  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log("Page Load Time: " + pageLoadTime + " ms");
  });
}

window.AREvents = {
  version: "1.0.0",
  trackEvent,
  showNotification,
  toggleMobileNav,
  BookingForm,
};

console.log("🎉 AR Events & Wedding Planner loaded successfully!");

document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const currentItem = question.closest(".faq-item");
      const allItems = document.querySelectorAll(".faq-item");

      allItems.forEach((item) => {
        if (item !== currentItem && item.classList.contains("active")) {
          item.classList.remove("active");
        }
      });

      currentItem.classList.toggle("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  const cards = document.querySelectorAll(".editorial-card");
  cards.forEach((card) => {
    revealObserver.observe(card);
  });
});

(function () {
  function setupClamps() {
    
    const selectors = [
      ".clamp-text", 
      ".zigzag-desc",
      ".testimonial-text",
      ".feature-card p",
      ".process-card p",
      ".process-description",
      ".cta-description",
      ".faq-answer p",
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        
        const next = el.nextElementSibling;
        if (next && next.classList && next.classList.contains("clamp-toggle")) {
          next.remove();
        }

        
        el.classList.add("universal-clamp");
        el.classList.remove("expanded");

        
        requestAnimationFrame(() => {
          const isTruncated = el.scrollHeight > el.clientHeight + 2; 
          if (isTruncated) {
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "clamp-toggle";
            toggle.innerText = "View more";
            
            toggle.addEventListener("click", () => {
              const expanded = el.classList.toggle("expanded");
              toggle.innerText = expanded ? "View less" : "View more";
            });
            
            el.insertAdjacentElement("afterend", toggle);
          }
        });
      });
    });
  }

  
  document.addEventListener("DOMContentLoaded", () => {
    setupClamps();
    window.addEventListener("orientationchange", setupClamps);
    
    window.addEventListener("resize", debounce(setupClamps, 150));
  });
})();
