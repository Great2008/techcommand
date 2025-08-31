/* ==================================
   GraphiTech Command – Script.js
   ================================== */
(function () {
  'use strict';

  // Helpers
  const getEl = (id) => document.getElementById(id);
  const getEls = (selector) => document.querySelectorAll(selector);

  /**
   * --- 1. Mobile Navigation Toggle ---
   * Toggles the mobile navigation menu and updates accessibility attributes.
   */
  const setupMobileNav = () => {
    const menuToggle = getEl('menuToggle');
    const mainNav = getEl('main-nav'); // Updated ID

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when a nav link is clicked (improved UX)
      mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (mainNav.classList.contains("is-open")) {
            mainNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
          }
        });
      });
    }
  };

  /**
   * --- 2. Theme Toggle (persists to localStorage) ---
   * Toggles between light and dark themes and saves the preference.
   */
  const setupThemeToggle = () => {
    const themeToggle = getEl('themeToggle');
    const root = document.documentElement;

    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);
      if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  };

  /**
   * --- 3. Update Footer Year ---
   * Sets the current year in the footer.
   */
  const setupFooterYear = () => {
    const yearSpan = getEl('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  };

  /**
   * --- 4. Contact & Newsletter Form Handling ---
   * Manages form submissions for both newsletter and main contact forms.
   */
  const setupForms = () => {
    // Newsletter Form
    const newsletterForm = getEl('newsletterForm');
    const newsletterMsg = getEl('newsletterMsg');

    if (newsletterForm && newsletterMsg) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.checkValidity()) {
          newsletterMsg.textContent = 'Thanks! You are subscribed.';
          newsletterMsg.style.color = 'var(--accent)'; // Use CSS variable
          newsletterForm.reset();
        } else {
          newsletterMsg.textContent = 'Please enter a valid email address.';
          newsletterMsg.style.color = 'red';
        }
      });
    }

    // Contact Form
    const contactForm = getEl('contactForm');
    const contactMsg = getEl('contactMsg');

    if (contactForm && contactMsg) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        contactMsg.textContent = 'Sending...';
        contactMsg.style.color = 'var(--muted)';

        const formData = new FormData(contactForm);

        try {
          const resp = await fetch(contactForm.action, {
            method: contactForm.method || 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (resp.ok) {
            contactMsg.textContent = 'Message sent! Thank you.';
            contactMsg.style.color = 'var(--accent)';
            contactForm.reset();
          } else {
            const data = await resp.json().catch(() => null);
            contactMsg.textContent = (data && data.error) 
              ? `Error: ${data.error}` 
              : 'Oops — there was a problem sending your message.';
            contactMsg.style.color = 'red';
          }
        } catch {
          contactMsg.textContent = 'Network error. Please try again later.';
          contactMsg.style.color = 'red';
        }
      });
    }
  };

  /**
   * --- 5. Portfolio Filter Functionality ---
   * Filters portfolio items based on category.
   */
  const setupPortfolioFilter = () => {
    const filterButtons = getEls('.filter-btn');
    const portfolioItems = getEls('.portfolio-item');

    if (filterButtons.length && portfolioItems.length) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove 'active' class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          // Add 'active' class to the clicked button
          button.classList.add('active');

          const filter = button.dataset.filter;
          portfolioItems.forEach(item => {
            const category = item.dataset.category;
            item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
          });
        });
      });
    }
  };

  // Run all setup functions
  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupThemeToggle();
    setupFooterYear();
    setupForms();
    setupPortfolioFilter();
  });
})();
