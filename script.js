/**
 * ============================================================
 * PORTFOLIO — script.js
 * Industrial-Modern Portfolio — Interaction Layer
 * Author: R. A. Praveen Malika Wijerathna
 * ============================================================
 *
 * Sections:
 *  1.  Theme Toggle (dark/light, localStorage)
 *  2.  Loading Screen
 *  3.  Navbar — scroll solidify + active section highlight
 *  4.  Mobile Drawer
 *  5.  Scroll Progress Bar
 *  6.  Back-to-Top Button
 *  7.  Scroll-Reveal (IntersectionObserver)
 *  8.  Animated Counters
 *  9.  Skill Bar Animations
 * 10.  Project Filtering
 * 11.  Contact Form Validation
 * 12.  Footer Copyright Year
 * 13.  Init
 */

/* ──────────────────────────────────────────────
   1. THEME TOGGLE
   ────────────────────────────────────────────── */
const ThemeManager = (() => {
  const STORAGE_KEY = 'portfolio-theme';
  const html         = document.documentElement;
  const toggleBtn    = document.getElementById('theme-toggle');
  const moonIcon     = document.getElementById('icon-moon');
  const sunIcon      = document.getElementById('icon-sun');

  /** Apply a theme ('dark' | 'light') to the document */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    if (theme === 'light') {
      moonIcon.style.display = 'none';
      sunIcon.style.display  = 'block';
      toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display  = 'none';
      toggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }

    // Persist across page refreshes (graceful fallback if storage unavailable)
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  /** Read saved preference; default to 'dark' */
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    // Respect OS preference if no saved value
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function init() {
    applyTheme(getInitialTheme());

    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   2. LOADING SCREEN
   ────────────────────────────────────────────── */
const LoadingScreen = (() => {
  const screen = document.getElementById('loading-screen');

  function init() {
    // Wait for CSS loader-fill animation (1.8s) + small buffer, then hide
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 2000;

    window.addEventListener('load', () => {
      setTimeout(() => {
        screen.classList.add('hidden');
        // Re-enable body scrolling once hidden
        document.body.style.overflow = '';
      }, delay);
    });

    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   3. NAVBAR — SCROLL SOLIDIFY & ACTIVE LINKS
   ────────────────────────────────────────────── */
const Navbar = (() => {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  // All sections that appear in the nav
  const sections  = document.querySelectorAll('main section[id]');
  let   ticking   = false;

  /** Toggle "scrolled" class to solidify the nav background */
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        highlightActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }

  /** Highlight the nav link whose section is currently in view */
  function highlightActiveSection() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id            = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   4. MOBILE DRAWER
   ────────────────────────────────────────────── */
const MobileDrawer = (() => {
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('nav-drawer');
  const drawerLinks = drawer.querySelectorAll('.drawer-link');

  function openDrawer() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function init() {
    hamburger.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close drawer when any drawer link is clicked
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   5. SCROLL PROGRESS BAR
   ────────────────────────────────────────────── */
const ScrollProgress = (() => {
  const bar    = document.getElementById('scroll-progress');
  let   ticking = false;

  function update() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled     = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        const pct          = Math.min(100, Math.max(0, scrolled));
        bar.style.width    = `${pct}%`;
        bar.setAttribute('aria-valuenow', Math.round(pct));
        ticking = false;
      });
      ticking = true;
    }
  }

  function init() {
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   6. BACK-TO-TOP BUTTON
   ────────────────────────────────────────────── */
const BackToTop = (() => {
  const btn     = document.getElementById('back-to-top');
  const THRESHOLD = 400; // px from top before button appears

  function handleScroll() {
    btn.classList.toggle('visible', window.scrollY > THRESHOLD);
  }

  function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard support
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   7. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
   ────────────────────────────────────────────── */
const ScrollReveal = (() => {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Observe elements with class .reveal */
  function observeRevealElements() {
    if (REDUCED_MOTION) {
      // Skip animation; immediately show everything
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once only
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /** Observe stagger containers */
  function observeStaggerContainers() {
    if (REDUCED_MOTION) {
      document.querySelectorAll('.stagger').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.stagger').forEach(el => observer.observe(el));
  }

  function init() {
    observeRevealElements();
    observeStaggerContainers();
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   8. ANIMATED COUNTERS
   ────────────────────────────────────────────── */
const AnimatedCounters = (() => {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Animate a number counter from 0 → target.
   * @param {HTMLElement} el      - Container element with data-counter attribute
   * @param {number}       target - Final count value
   * @param {string}       suffix - Suffix appended after the number (e.g. "+", "×")
   */
  function animateCounter(el, target, suffix) {
    if (REDUCED_MOTION) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1800;   // ms
    const startTime = performance.now();

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      const eased    = 1 - Math.pow(1 - progress, 4);
      const current  = Math.round(eased * target);

      el.innerHTML = `<span class="accent">${current}</span>${suffix}`;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function init() {
    const counterEls = document.querySelectorAll('[data-counter]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   9. SKILL BAR ANIMATIONS
   ────────────────────────────────────────────── */
const SkillBars = (() => {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateBars(container) {
    const fills = container.querySelectorAll('.skill-bar-fill[data-width]');
    fills.forEach((fill, index) => {
      const targetWidth = fill.getAttribute('data-width') + '%';
      if (REDUCED_MOTION) {
        fill.style.width = targetWidth;
        return;
      }
      // Stagger each bar slightly
      setTimeout(() => {
        fill.style.width = targetWidth;
        fill.classList.add('animated');
      }, index * 120);
    });
  }

  function init() {
    const skillCategories = document.querySelectorAll('.skill-category');
    if (!skillCategories.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBars(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    skillCategories.forEach(cat => observer.observe(cat));
  }

  return { init };
})();




/* ──────────────────────────────────────────────
   11. CONTACT FORM VALIDATION
   ────────────────────────────────────────────── */
const ContactForm = (() => {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  /** Validate a single field; returns true if valid */
  function validateField(input, errorId, validatorFn) {
    const errorEl = document.getElementById(errorId);
    const valid   = validatorFn(input.value.trim());

    input.classList.toggle('invalid', !valid);
    errorEl.classList.toggle('visible', !valid);

    return valid;
  }

  /** Email format check */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function init() {
    if (!form) return;

    // Real-time validation on blur
    const nameInput    = document.getElementById('form-name');
    const emailInput   = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    nameInput.addEventListener('blur', () =>
      validateField(nameInput, 'name-error', v => v.length >= 2)
    );
    emailInput.addEventListener('blur', () =>
      validateField(emailInput, 'email-error', isValidEmail)
    );
    messageInput.addEventListener('blur', () =>
      validateField(messageInput, 'message-error', v => v.length >= 10)
    );

    // Clear invalid state on input
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          input.classList.remove('invalid');
          const errorId = input.id.replace('form-', '') + '-error';
          const errorEl = document.getElementById(errorId);
          if (errorEl) errorEl.classList.remove('visible');
        }
      });
    });

    // Submit handler
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameValid    = validateField(nameInput,    'name-error',    v => v.length >= 2);
      const emailValid   = validateField(emailInput,   'email-error',   isValidEmail);
      const messageValid = validateField(messageInput, 'message-error', v => v.length >= 10);

      if (!nameValid || !emailValid || !messageValid) return;

      // Log to console (no backend required per spec)
      console.log('📧 Contact form submission:', {
        name:    nameInput.value.trim(),
        email:   emailInput.value.trim(),
        message: messageInput.value.trim(),
        time:    new Date().toISOString()
      });

      // Show success state
      form.style.display        = 'none';
      successMsg.classList.add('visible');
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   12. FOOTER COPYRIGHT YEAR
   ────────────────────────────────────────────── */
function updateCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ──────────────────────────────────────────────
   13. SMOOTH SCROLL — nav & footer links
   ────────────────────────────────────────────── */
function initSmoothScroll() {
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return; // skip bare hash links

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}


/* ──────────────────────────────────────────────
   14. INIT — Bootstrap everything on DOMContentLoaded
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  LoadingScreen.init();
  Navbar.init();
  MobileDrawer.init();
  ScrollProgress.init();
  BackToTop.init();
  ScrollReveal.init();
  AnimatedCounters.init();
  SkillBars.init();

  ContactForm.init();
  updateCopyrightYear();
  initSmoothScroll();
  FeaturedProject.init();
  Lightbox.init();
  VideoPlayer.init();

  console.log(
    '%c R. A. Praveen Malika Wijerathna %c Portfolio v2.0 ',
    'background:#0D2137;color:#42B2D5;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#42B2D5;color:#fff;font-weight:600;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
  ProjectCards.init();
  HeroStatCounters.init();
  HeroParallax.init();
  EngCarousel.initAll();
});


/* ──────────────────────────────────────────────
   15. FEATURED PROJECT — Expand / Collapse & Tabs
   ────────────────────────────────────────────── */
const FeaturedProject = (() => {
  function initExpandToggle() {
    const btn    = document.getElementById('fp-expand-btn');
    const detail = document.getElementById('fp-detail');
    if (!btn || !detail) return;

    btn.addEventListener('click', () => {
      const isOpen = detail.classList.contains('open');

      if (isOpen) {
        detail.classList.remove('open');
        detail.setAttribute('aria-hidden', 'true');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = btn.innerHTML.replace('Collapse', 'Explore Project');
      } else {
        detail.classList.add('open');
        detail.setAttribute('aria-hidden', 'false');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = btn.innerHTML.replace('Explore Project', 'Collapse');

        // Smooth scroll to just below the button
        setTimeout(() => {
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Animate contribution cards on first open
        animateContribCards();

        // Animate fp stat counters
        animateFpCounters();
      }
    });
  }

  function animateContribCards() {
    const grid = document.getElementById('fp-contrib-grid');
    if (!grid || grid.dataset.animated) return;
    grid.dataset.animated = 'true';

    const cards = grid.querySelectorAll('.fp-contrib-card');
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (REDUCED) { cards.forEach(c => c.classList.add('animate-in')); return; }

    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('animate-in');
        card.style.animationDelay = `${i * 0.045}s`;
      }, i * 45);
    });
  }

  function animateFpCounters() {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-fp-counter]').forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      const target = parseInt(el.getAttribute('data-fp-counter'), 10);
      if (REDUCED) { el.textContent = target; return; }

      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function initTabs() {
    const tabBtns   = document.querySelectorAll('.fp-tab-btn');
    const tabPanels = document.querySelectorAll('.fp-tab-panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        // Update buttons
        tabBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        // Update panels
        tabPanels.forEach(panel => {
          const isActive = panel.getAttribute('data-panel') === target;
          panel.classList.toggle('active', isActive);
        });
      });
    });
  }

  function init() {
    initExpandToggle();
    initTabs();
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   16. LIGHTBOX — Image gallery popup with nav
   ────────────────────────────────────────────── */
const Lightbox = (() => {
  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');

  if (!lb) return { init: () => {} };

  let currentImages = [];   // [{src, caption}]
  let currentIndex  = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex  = index;
    show();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function show() {
    const item = currentImages[currentIndex];
    lbImg.src       = item.src;
    lbImg.alt       = item.caption;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    lbPrev.style.display = currentImages.length > 1 ? '' : 'none';
    lbNext.style.display = currentImages.length > 1 ? '' : 'none';
  }

  function prev() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    show();
  }

  function next() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    show();
  }

  function collectGalleryImages(galleryEl) {
    return Array.from(galleryEl.querySelectorAll('.fp-gallery-item')).map(item => ({
      src:     item.getAttribute('data-src') || item.querySelector('img').src,
      caption: item.getAttribute('data-caption') || item.querySelector('.fp-gallery-caption')?.textContent || ''
    }));
  }

  function init() {
    // Attach click handlers to all gallery items
    document.querySelectorAll('.fp-gallery').forEach(gallery => {
      const items = gallery.querySelectorAll('.fp-gallery-item');
      const images = collectGalleryImages(gallery);

      items.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(images, idx));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(images, idx); }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', images[idx].caption || 'View image');
      });
    });

    // Also bind .gallery-grid visual showcase items
    document.querySelectorAll('.gallery-grid').forEach(grid => {
      const items = grid.querySelectorAll('.gallery-item');
      const images = Array.from(items).map(item => ({
        src:     item.getAttribute('data-src') || item.querySelector('img')?.src,
        caption: item.getAttribute('data-caption') || item.querySelector('.gallery-overlay-title')?.textContent || ''
      }));

      items.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(images, idx));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(images, idx); }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', images[idx].caption || 'View image');
      });
    });

    // Bind leadership gallery items
    const leadGallery = document.querySelector('.lead-gallery');
    if (leadGallery) {
      const leadItems = leadGallery.querySelectorAll('.lead-gallery-item');
      const leadImages = Array.from(leadItems).map(item => ({
        src:     item.getAttribute('data-src') || item.querySelector('img')?.src,
        caption: item.getAttribute('data-caption') || item.querySelector('.lead-gallery-title')?.textContent || ''
      }));
      leadItems.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(leadImages, idx));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(leadImages, idx); }
        });
      });
    }

    // Also bind .eng-carousel slides
    document.querySelectorAll('.eng-carousel').forEach(carousel => {
      const items = carousel.querySelectorAll('.eng-carousel-slide');
      const images = Array.from(items).map(item => ({
        src:     item.getAttribute('data-src') || item.querySelector('img')?.src,
        caption: item.getAttribute('data-caption') || ''
      }));

      items.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(images, idx));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(images, idx); }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', images[idx].caption || 'View image');
      });
    });

    // Controls
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click',  prev);
    lbNext.addEventListener('click',  next);

    // Click outside image closes lightbox
    lb.addEventListener('click', e => {
      if (e.target === lb) closeLightbox();
    });

    // Keyboard nav
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   17. VIDEO PLAYER — Custom controls for Video1.mp4
   ────────────────────────────────────────────── */
const VideoPlayer = (() => {
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function setupPlayer(wrap) {
    const video       = wrap.querySelector('video');
    const playBtn     = wrap.querySelector('.vp-play-btn') || wrap.querySelector('#fp-play-btn');
    const playOverlay = wrap.querySelector('.fp-video-play-overlay');
    const progressEl  = wrap.querySelector('.fp-video-progress');
    const progressFill= wrap.querySelector('.fp-video-progress-fill');
    const timeEl      = wrap.querySelector('.fp-time-display') || wrap.querySelector('#fp-time') || wrap.querySelector('.fp-video-time');
    const fsBtn       = wrap.querySelector('.vp-fullscreen-btn') || wrap.querySelector('#fp-fullscreen-btn');
    const playIcon    = wrap.querySelector('.vp-play-icon-svg') || wrap.querySelector('#vp-play-icon');
    const pauseIcon   = wrap.querySelector('.vp-pause-icon-svg') || wrap.querySelector('#vp-pause-icon');

    if (!video) return;

    function updatePlayIcon(playing) {
      if (playIcon)  playIcon.style.display  = playing ? 'none' : '';
      if (pauseIcon) pauseIcon.style.display = playing ? ''     : 'none';
    }

    function togglePlay() {
      if (video.paused) {
        video.play();
        if (playOverlay) playOverlay.classList.add('hidden');
      } else {
        video.pause();
        if (playOverlay) playOverlay.classList.remove('hidden');
      }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);

    if (playOverlay) {
      playOverlay.addEventListener('click', togglePlay);
      playOverlay.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); }
      });
    }

    video.addEventListener('play',  () => updatePlayIcon(true));
    video.addEventListener('pause', () => updatePlayIcon(false));
    video.addEventListener('ended', () => {
      updatePlayIcon(false);
      if (playOverlay) playOverlay.classList.remove('hidden');
    });

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressEl) progressEl.setAttribute('aria-valuenow', Math.round(pct));
      if (timeEl) timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener('loadedmetadata', () => {
      if (timeEl) timeEl.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    if (progressEl) {
      progressEl.addEventListener('click', e => {
        const rect = progressEl.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        video.currentTime = ratio * video.duration;
      });

      progressEl.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
        if (e.key === 'ArrowLeft')  video.currentTime = Math.max(0, video.currentTime - 5);
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          wrap.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  function init() {
    document.querySelectorAll('.fp-video-wrap').forEach(wrap => {
      setupPlayer(wrap);
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   18. PROJECT CARDS — Expandable accordion (Projects 2–5)
   ────────────────────────────────────────────── */
const ProjectCards = (() => {

  function init() {
    const expandBtns = document.querySelectorAll('.proj-expand-btn[data-proj]');
    if (!expandBtns.length) return;

    expandBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-proj');
        const detail   = document.getElementById(targetId);
        if (!detail) return;

        const isOpen = detail.classList.contains('open');

        // Collapse all others (accordion behaviour)
        document.querySelectorAll('.proj-detail.open').forEach(openDetail => {
          if (openDetail !== detail) {
            openDetail.classList.remove('open');
            openDetail.setAttribute('aria-hidden', 'true');
            const sibBtn = document.querySelector(`.proj-expand-btn[data-proj="${openDetail.id}"]`);
            if (sibBtn) {
              sibBtn.classList.remove('open');
              sibBtn.setAttribute('aria-expanded', 'false');
              const t = sibBtn.querySelector('.btn-text');
              if (t) t.textContent = 'View Details';
            }
          }
        });

        // Toggle current
        if (isOpen) {
          detail.classList.remove('open');
          detail.setAttribute('aria-hidden', 'true');
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          const t = btn.querySelector('.btn-text');
          if (t) t.textContent = 'View Details';
        } else {
          detail.classList.add('open');
          detail.setAttribute('aria-hidden', 'false');
          btn.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          const t = btn.querySelector('.btn-text');
          if (t) t.textContent = 'Collapse';

          setTimeout(() => {
            detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 120);
        }
      });

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });
  }

  return { init };
})();

/* ──────────────────────────────────────────────
   19. HERO PARALLAX EFFECT
   ────────────────────────────────────────────── */
const HeroParallax = (() => {
  function init() {
    const heroSection = document.getElementById('hero');
    const bgImage     = document.querySelector('.hero-bg-img');
    const techVectors = document.querySelectorAll('.hero-tech-elements .tech-vector');
    const glassCard   = null; // no glass card in new layout

    if (!heroSection) return;

    heroSection.addEventListener('mousemove', e => {
      const { width, height } = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - (heroSection.offsetLeft + width / 2);
      const mouseY = e.clientY - (heroSection.offsetTop + height / 2);

      // Parallax values
      const xPct = mouseX / (width / 2); // range -1 to 1
      const yPct = mouseY / (height / 2); // range -1 to 1

      // 1. Move background image slightly in opposite direction
      if (bgImage) {
        bgImage.style.transform = `scale(1.06) translate(${xPct * -12}px, ${yPct * -12}px)`;
      }

      // 2. Tilt glass card slightly (subtle Apple parallax effect)
      if (glassCard) {
        const tiltX = yPct * 4; // tilt up/down based on vertical position
        const tiltY = xPct * -4; // tilt left/right based on horizontal position
        glassCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${yPct * 4}px) translateX(${xPct * 4}px)`;
      }

      // 3. Move tech vectors slightly based on their individual layout speeds
      techVectors.forEach((vector, index) => {
        const speed = (index + 1) * 8;
        const moveX = xPct * speed;
        const moveY = yPct * speed;
        vector.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    // Reset styles on mouse leave
    heroSection.addEventListener('mouseleave', () => {
      if (bgImage) {
        bgImage.style.transform = 'scale(1.06) translate(0px, 0px)';
      }
      if (glassCard) {
        glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateX(0px)';
        glassCard.style.transition = 'transform 0.5s ease-out';
      }
      techVectors.forEach(vector => {
        vector.style.transform = 'translate(0px, 0px)';
        vector.style.transition = 'transform 0.5s ease-out';
      });
    });

    // Clear transitions on mouse enter so motion is responsive
    heroSection.addEventListener('mouseenter', () => {
      if (glassCard) glassCard.style.transition = 'none';
      techVectors.forEach(vector => {
        vector.style.transition = 'none';
      });
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   20. HERO STAT COUNTERS
   ────────────────────────────────────────────── */
const HeroStatCounters = (() => {
  function animateNum(el, target, duration = 1600) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    const nums = document.querySelectorAll('.hero-stat-num[data-target]');
    if (!nums.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateNum(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    nums.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ──────────────────────────────────────────────
   21. ENGINEERING IMAGE CAROUSELS
   ────────────────────────────────────────────── */
const EngCarousel = (() => {

  function initCarousel(carouselEl) {
    const track   = carouselEl.querySelector('.eng-carousel-track');
    const slides  = Array.from(carouselEl.querySelectorAll('.eng-carousel-slide'));
    const dotsEl  = carouselEl.querySelector('.eng-carousel-dots');
    const prevBtn = carouselEl.querySelector('.eng-carousel-btn.prev');
    const nextBtn = carouselEl.querySelector('.eng-carousel-btn.next');

    if (!track || !slides.length) return;

    let current   = 0;
    let autoTimer = null;

    // Create indicator dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'eng-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      dotsEl.appendChild(dot);
    });

    function goTo(idx) {
      if (idx < 0)             idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      current = idx;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsEl.querySelectorAll('.eng-carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 3500); }
    function stopAuto()  { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    carouselEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    carouselEl.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { stopAuto(); goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
    });

    carouselEl.addEventListener('mouseenter', stopAuto);
    carouselEl.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  function initAll() {
    document.querySelectorAll('.eng-carousel').forEach(initCarousel);
  }

  return { initAll };
})();
