/* ============================================================
   ADRIATIC MARINE CONSULTING — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: solid background on scroll ── */
  const nav = document.getElementById('nav');

  function handleScroll() {
    if (window.scrollY > 30) {
      nav.classList.add('solid');
    } else {
      nav.classList.remove('solid');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ── Mobile hamburger menu ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 62; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.style.color = '';
        });
        const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
        if (active) active.style.color = 'rgba(184, 149, 46, 0.9)';
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── Scroll-in animation ── */
  const animatedEls = document.querySelectorAll(
    '.service-card, .training-card, .case-card, .team-card, .onboard-point, .number-box'
  );

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  animatedEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(el);
  });

  /* ── Contact form — Netlify Forms AJAX submission ── */
  const form      = document.getElementById('contactForm');
  const feedback  = document.getElementById('formFeedback');
  const submitBtn = form ? form.querySelector('.form-submit') : null;

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + type;
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous feedback
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      // ── Client-side validation ──
      var name    = form.querySelector('#name').value.trim();
      var email   = form.querySelector('#email').value.trim();
      var message = form.querySelector('#message').value.trim();

      if (!name) {
        showFeedback('Please enter your name.', 'error');
        form.querySelector('#name').focus();
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        form.querySelector('#email').focus();
        return;
      }

      if (!message) {
        showFeedback('Please write a short message.', 'error');
        form.querySelector('#message').focus();
        return;
      }

      // ── Submit to Netlify Forms via fetch ──
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Encode form data in the format Netlify Forms expects
      var formData = new FormData(form);
      var encoded  = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded,
      })
      .then(function (res) {
        if (res.ok) {
          // Success — show confirmation inline, reset form
          submitBtn.textContent = 'Message sent';
          showFeedback('Thank you — we will be in touch shortly.', 'success');
          form.reset();

          // Re-enable button after 6 seconds
          setTimeout(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
            feedback.textContent = '';
            feedback.className = 'form-feedback';
          }, 6000);
        } else {
          // Netlify returned a non-OK status
          throw new Error('Server responded with status ' + res.status);
        }
      })
      .catch(function (err) {
        console.error('Form submission error:', err);
        showFeedback(
          'Something went wrong. Please email us directly at info@adriaticmarineconsulting.com',
          'error'
        );
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      });
    });
  }

  /* ── Strip hover: subtle parallax on mouse move ── */
  const stripItems = document.querySelectorAll('.strip-item');

  stripItems.forEach(function (item) {
    item.addEventListener('mousemove', function (e) {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 4;
      const svg = item.querySelector('svg');
      if (svg) svg.style.transform = 'scale(1.04) translate(' + x + 'px, ' + y + 'px)';
    });

    item.addEventListener('mouseleave', function () {
      const svg = item.querySelector('svg');
      if (svg) svg.style.transform = '';
    });
  });

})();
