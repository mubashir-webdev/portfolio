// =======================================================
// script.js — Muhammad Mubashir Portfolio
// Vanilla JavaScript — No React, No Tailwind
// =======================================================

// -------------------------------------------------------
// 1. NAVBAR: Scroll-based background + active section
// -------------------------------------------------------

const navbar  = document.getElementById('navbar');
const sections = ['home', 'about', 'skills', 'projects', 'experience', 'services', 'contact'];

/**
 * Updates the navbar background when user scrolls down,
 * and tracks which section is currently in view.
 */
function handleScroll() {
  // Add/remove "scrolled" class for navbar glass effect
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link tracking
  const scrollPosition = window.scrollY + 120;

  let currentSection = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPosition) {
      currentSection = id;
    }
  });

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

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // Run on page load

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

/**
 * Toggles the mobile navigation menu open/closed.
 */
function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.add('open');
    menuIcon.classList.remove('bi-list');
    menuIcon.classList.add('bi-x-lg');
  }
}

/**
 * Closes the mobile menu.
 */
function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
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

  // Reveal hero content immediately (it's already visible)
  document.querySelectorAll('.hero-content, .hero-portrait-col').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), 100);
  });

  // Check portrait placeholder
  createPortraitPlaceholder();

  console.log('✅ Portfolio initialized successfully!');
  console.log('📁 Project structure: server.js → public/index.html, css/style.css, js/script.js');
  console.log('🎨 Theme: dark (toggle with the moon button in navbar)');
  console.log('📬 Contact form: POST /api/contact');
});

// -------------------------------------------------------
// 10. UTILITY: Debounce (for performance)
// -------------------------------------------------------

/**
 * Debounce function — limits how often a function fires.
 * Useful for scroll/resize events.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Apply debounce to scroll handler for better performance
window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
