// =======================================================
// script.js — Muhammad Mubashir Portfolio
// Vanilla JavaScript — No React, No Tailwind
// =======================================================

// -------------------------------------------------------
// 0. PRELOADER: Profile Avatar + Professional Quote
// -------------------------------------------------------

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloaderProgressBar');

  if (!preloader) return;

  // Lock body scroll while preloader is visible
  document.body.classList.add('preloader-active');

  let isDismissed = false;

  function dismissPreloader() {
    if (isDismissed) return;
    isDismissed = true;

    if (progressBar) {
      progressBar.style.width = '100%';
    }

    // Brief smooth pause before exit transition
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      document.body.classList.remove('preloader-active');

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 550);
    }, 280);
  }

  // Smooth simulated progress bar
  if (progressBar) {
    progressBar.style.width = '25%';
    setTimeout(() => {
      if (!isDismissed) progressBar.style.width = '70%';
    }, 200);
  }

  // Dismiss as soon as page assets are loaded
  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, 350);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismissPreloader, 300);
    });
  }

  // Safety fallback: never trap the user, max 1.3s
  setTimeout(dismissPreloader, 1300);
}

// Start preloader as early as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreloader);
} else {
  initPreloader();
}

// -------------------------------------------------------
// 1. NAVBAR: Inward-Shrinking Floating Pill & Active Section
// -------------------------------------------------------

const navbar = document.getElementById('navbar');
const sections = ['home', 'about', 'skills', 'projects', 'experience', 'services', 'contact'];

/**
 * Updates active section in nav and floating back-to-top button
 */
function updateActiveNavAndFab() {
  const scrollPosition = window.scrollY + 120;

  let currentSection = 'home';
  for (let i = 0; i < sections.length; i++) {
    const el = document.getElementById(sections[i]);
    if (el && el.offsetTop <= scrollPosition) {
      currentSection = sections[i];
    }
  }

  // Update desktop nav links
  document.querySelectorAll('.nav-link-item').forEach(link => {
    link.classList.remove('active-nav');
    if (link.dataset.section === currentSection) {
      link.classList.add('active-nav');
    }
  });

  // Update mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.remove('active-mobile');
    const href = link.getAttribute('href');
    if (href === '#' + currentSection) {
      link.classList.add('active-mobile');
    }
  });

  // Show/hide floating back-to-top button
  const fab = document.getElementById('backToTopFab');
  if (fab) {
    fab.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }
}

/**
 * Initializes ultra-smooth, zero-jank navbar scroll transformation
 */
function initNavbarScroll() {
  const sentinel = document.getElementById('topSentinel');

  // Primary: Native IntersectionObserver for zero JS execution during scrolling
  if (sentinel && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navbar.classList.remove('scrolled');
          } else {
            navbar.classList.add('scrolled');
          }
        });
      },
      { root: null, threshold: 0 }
    );
    navObserver.observe(sentinel);
  }

  // RAF-throttled scroll handler for active links & fab
  let isTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!isTicking) {
        requestAnimationFrame(() => {
          // Fallback if IntersectionObserver is unavailable
          if (!sentinel || !('IntersectionObserver' in window)) {
            if (window.scrollY > 25) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
          }
          updateActiveNavAndFab();
          isTicking = false;
        });
        isTicking = true;
      }
    },
    { passive: true }
  );

  // Initial check
  updateActiveNavAndFab();
}

initNavbarScroll();

// -------------------------------------------------------
// 2. SMOOTH SCROLLING to sections
// -------------------------------------------------------

/**
 * Smoothly scrolls to a section by its ID.
 * Used by all navbar links, buttons, and footer links.
 * @param {Event} e - The click event
 * @param {string} sectionId - The ID of the target section
 */
function scrollToSection(e, sectionId) {
  if (e) e.preventDefault();

  // Close mobile menu if open
  closeMobileMenu();

  const target = document.getElementById(sectionId);
  if (target) {
    const offsetTop = 80; // navbar height offset
    const top = target.getBoundingClientRect().top + window.pageYOffset - offsetTop;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Smoothly scrolls back to the top of the page.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -------------------------------------------------------
// 3. MOBILE MENU: Open / Close
// -------------------------------------------------------

const mobileMenu = document.getElementById('mobileMenu');
const menuIcon   = document.getElementById('menuIcon');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

/**
 * Toggles the mobile navigation menu open/closed.
 */
function toggleMobileMenu() {
  if (!mobileMenu) return;
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    if (menuIcon) {
      menuIcon.classList.remove('bi-list');
      menuIcon.classList.add('bi-x-lg');
    }
  }
}

/**
 * Closes the mobile menu.
 */
function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (menuIcon) {
      menuIcon.classList.remove('bi-x-lg');
      menuIcon.classList.add('bi-list');
    }
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const btn = document.getElementById('mobileMenuBtn');
  if (mobileMenu && btn && !mobileMenu.contains(e.target) && !btn.contains(e.target)) {
    closeMobileMenu();
  }
});

// -------------------------------------------------------
// 4. THEME TOGGLE: Dark / Light
// -------------------------------------------------------

/**
 * Toggles between dark and light themes.
 * Saves the user's preference in localStorage.
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  if (isDark) {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('portfolio-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('portfolio-theme', 'dark');
  }

  // Update all theme toggle button icons
  updateThemeIcons();
}

/**
 * Switches the moon/sun icons on all theme toggle buttons.
 */
function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-icon-dark').forEach(icon => {
    icon.classList.toggle('d-none', !isDark);
  });
  document.querySelectorAll('.theme-icon-light').forEach(icon => {
    icon.classList.toggle('d-none', isDark);
  });
}

// Load saved theme on page load
(function loadSavedTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons();
  }
})();

// -------------------------------------------------------
// 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// -------------------------------------------------------

/**
 * Uses IntersectionObserver to add 'revealed' class to elements
 * with the 'reveal-fade-up' class when they enter the viewport.
 * This triggers the CSS fade-up animation.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a small delay based on the element's position
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, 50);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.1,     // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all elements with reveal animation class
  document.querySelectorAll('.reveal-fade-up').forEach(el => {
    observer.observe(el);
  });
}

// -------------------------------------------------------
// 5.5 PROJECTS CAROUSEL (Responsive, Touch-Enabled, Accessible)
// -------------------------------------------------------

let currentProjectIndex = 0;
let totalProjectSlides = 5;

/**
 * Returns number of visible project cards based on viewport width:
 * Desktop (>= 992px): 3
 * Tablet (640px - 991px): 2
 * Mobile (< 640px): 1
 */
function getProjectsPerView() {
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 992) return 2;
  return 3;
}

/**
 * Returns max starting slide index
 */
function getMaxSlideIndex() {
  const perView = getProjectsPerView();
  return Math.max(0, totalProjectSlides - perView);
}

/**
 * Updates carousel position, counter badge, arrow buttons, and pagination dots
 */
function updateCarouselUI() {
  const track = document.getElementById('projectsCarouselTrack');
  const viewport = document.getElementById('projectsCarouselViewport');
  const prevBtn = document.getElementById('projectPrevBtn');
  const nextBtn = document.getElementById('projectNextBtn');
  const counterCurrent = document.getElementById('currentSlideNum');
  const counterTotal = document.getElementById('totalSlideNum');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !viewport) return;

  const perView = getProjectsPerView();
  const maxIndex = getMaxSlideIndex();

  // Clamp index within valid range
  if (currentProjectIndex > maxIndex) {
    currentProjectIndex = maxIndex;
  }
  if (currentProjectIndex < 0) {
    currentProjectIndex = 0;
  }

  // Slide track by offset
  const slides = track.querySelectorAll('.project-slide');
  if (slides.length > 0) {
    const slideRect = slides[0].getBoundingClientRect();
    const gap = perView === 3 ? 24 : perView === 2 ? 20 : 16;
    const offset = currentProjectIndex * (slideRect.width + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  // Update button states
  if (prevBtn) {
    prevBtn.disabled = currentProjectIndex <= 0;
    prevBtn.setAttribute('aria-disabled', currentProjectIndex <= 0 ? 'true' : 'false');
  }
  if (nextBtn) {
    nextBtn.disabled = currentProjectIndex >= maxIndex;
    nextBtn.setAttribute('aria-disabled', currentProjectIndex >= maxIndex ? 'true' : 'false');
  }

  // Update counter
  if (counterCurrent && counterTotal) {
    counterCurrent.textContent = currentProjectIndex + 1;
    counterTotal.textContent = maxIndex + 1;
  }

  // Update pagination dots
  if (dotsContainer) {
    const totalDots = maxIndex + 1;
    if (dotsContainer.children.length !== totalDots) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === currentProjectIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to project slide ${i + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === currentProjectIndex ? 'true' : 'false');
        dot.addEventListener('click', () => {
          goToProjectSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    } else {
      Array.from(dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentProjectIndex);
        dot.setAttribute('aria-selected', idx === currentProjectIndex ? 'true' : 'false');
      });
    }
  }
}

/**
 * Slide navigation handler
 * @param {'next'|'prev'} direction
 */
function slideProjects(direction) {
  const maxIndex = getMaxSlideIndex();
  if (direction === 'next') {
    if (currentProjectIndex < maxIndex) {
      currentProjectIndex++;
    } else {
      currentProjectIndex = 0; // Seamless wrap to start
    }
  } else if (direction === 'prev') {
    if (currentProjectIndex > 0) {
      currentProjectIndex--;
    } else {
      currentProjectIndex = maxIndex; // Seamless wrap to end
    }
  }
  updateCarouselUI();
}

/**
 * Jump to specific slide index
 * @param {number} index
 */
function goToProjectSlide(index) {
  const maxIndex = getMaxSlideIndex();
  currentProjectIndex = Math.max(0, Math.min(index, maxIndex));
  updateCarouselUI();
}

/**
 * Initializes the projects carousel with touch gestures, resize listeners, and keyboard support
 */
function initProjectsCarousel() {
  const viewport = document.getElementById('projectsCarouselViewport');
  if (!viewport) return;

  const track = document.getElementById('projectsCarouselTrack');
  if (track) {
    totalProjectSlides = track.querySelectorAll('.project-slide').length;
  }

  // Initial layout calculation
  updateCarouselUI();

  // Responsive resize handler with debouncing
  window.addEventListener('resize', debounce(() => {
    updateCarouselUI();
  }, 100));

  // Touch Swipe Handling for Mobile & Tablet
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Trigger horizontal swipe if movement is greater than 40px and predominantly horizontal
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        slideProjects('next');
      } else {
        slideProjects('prev');
      }
    }
  }, { passive: true });

  // Accessible Keyboard Navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      slideProjects('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      slideProjects('prev');
    }
  });
}

// -------------------------------------------------------
// 6. PROJECT MODALS: Open / Close
// -------------------------------------------------------

/**
 * Opens a project modal by its ID.
 * @param {string} modalId - The ID of the modal element
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }
}

/**
 * Closes a project modal by its ID.
 * @param {string} modalId - The ID of the modal element
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.project-modal.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

// -------------------------------------------------------
// 7. CONTACT FORM: Validation + API submission
// -------------------------------------------------------

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Don't reload the page!

    // Get form field values
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Get UI elements
    const successAlert = document.getElementById('formSuccess');
    const errorAlert   = document.getElementById('formError');
    const errorMsg     = document.getElementById('formErrorMsg');
    const submitBtn    = document.getElementById('submitBtn');
    const btnText      = document.getElementById('submitBtnText');
    const btnIcon      = document.getElementById('submitBtnIcon');

    // Hide previous alerts
    hideElement(successAlert);
    hideElement(errorAlert);

    // --- FRONTEND VALIDATION ---
    if (!name) {
      showError(errorAlert, errorMsg, 'Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(errorAlert, errorMsg, 'Please provide a valid email address.');
      return;
    }

    if (!subject) {
      showError(errorAlert, errorMsg, 'Please enter a subject.');
      return;
    }

    if (!message || message.length < 10) {
      showError(errorAlert, errorMsg, 'Message must be at least 10 characters long.');
      return;
    }

    // --- SHOW LOADING STATE ---
    submitBtn.disabled = true;
    btnText.textContent = 'Sending Message...';
    btnIcon.className = 'bi bi-hourglass-split';

    try {
      // --- SEND TO BACKEND API ---
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // SUCCESS: Show success message and reset form
        showElement(successAlert);
        contactForm.reset();

        // Auto-hide success message after 6 seconds
        setTimeout(() => hideElement(successAlert), 6000);
      } else {
        // API returned error
        showError(errorAlert, errorMsg, data.message || 'Failed to send message. Please try again.');
      }

    } catch (err) {
      // Network error
      showError(errorAlert, errorMsg, 'Network error. Please check your connection and try again.');
    } finally {
      // --- RESTORE BUTTON STATE ---
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.className = 'bi bi-send';
    }
  });
}

/**
 * Shows an error alert with a message.
 */
function showError(alertEl, msgEl, message) {
  if (msgEl) msgEl.textContent = message;
  showElement(alertEl);
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Shows a hidden element */
function showElement(el) {
  if (el) el.classList.remove('d-none');
}

/** Hides an element */
function hideElement(el) {
  if (el) el.classList.add('d-none');
}

// -------------------------------------------------------
// 8. HERO PORTRAIT: Placeholder SVG fallback
// -------------------------------------------------------

/**
 * Creates a placeholder SVG image for the portrait
 * when portrait.jpg is not found.
 */
function createPortraitPlaceholder() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='340' height='340' viewBox='0 0 340 340'>
    <rect width='340' height='340' fill='%230D101C'/>
    <circle cx='170' cy='140' r='60' fill='%231e1b4b'/>
    <ellipse cx='170' cy='280' rx='90' ry='70' fill='%231e1b4b'/>
    <text x='170' y='155' text-anchor='middle' font-family='Inter,sans-serif' font-size='48' font-weight='800' fill='%238B5CF6'>MM</text>
  </svg>`;

  // Create placeholder file hint (for console)
  console.info('📷 Portrait image not found. Add your photo at: public/images/portrait.jpg');
}

// -------------------------------------------------------
// 9. INITIALIZE EVERYTHING ON PAGE LOAD
// -------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  // Start scroll reveal animations
  initScrollReveal();

  // Initialize Projects Carousel
  initProjectsCarousel();

  // Reveal hero content immediately (it's already visible)
  document.querySelectorAll('.hero-content, .hero-portrait-col').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), 100);
  });

  // Check portrait placeholder
  createPortraitPlaceholder();

  console.log('✅ Portfolio initialized successfully with responsive carousel and refined navbar!');
});

// -------------------------------------------------------
// 10. UTILITY: Debounce
// -------------------------------------------------------

/**
 * Debounce utility — limits how often an event callback fires.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

