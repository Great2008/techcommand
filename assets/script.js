/* ==================================
   GraphiTech Command – Script.js
   ================================== */
(function () {
  'use strict';

  /* --- 1. Mobile Navigation Toggle --- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
  }
  
  /* --- 2. Theme Toggle (persists to localStorage) --- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');

  // Apply the saved theme on page load
  if (savedTheme === 'light') {
    root.classList.add('light');
  }

  // Toggle theme on button click and save to localStorage
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      root.classList.toggle('light');
      const isLight = root.classList.contains('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    });
  }

  /* --- 3. Update Footer Year --- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --- 4. Newsletter Form Handling --- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isValid = newsletterEmail && /.+@.+\..+/.test(newsletterEmail.value);
      
      if (isValid) {
        newsletterMsg.textContent = 'Thanks! You are subscribed.';
        newsletterForm.reset();
      } else {
        newsletterMsg.textContent = 'Please enter a valid email.';
      }
    });
  }

  /* --- 5. Contact Form Handling (Formspree) --- */
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      contactMsg.textContent = '';
      
      const formData = new FormData(contactForm);
      const email = formData.get('email') || '';

      // Basic client-side validation
      const allFilled = [...formData.values()].every(v => v && v.toString().trim().length > 0);
      if (!allFilled || !/.+@.+\..+/.test(email)) {
        contactMsg.textContent = 'Please complete all fields with a valid email.';
        return;
      }
      
      contactMsg.textContent = 'Sending...';

      try {
        const resp = await fetch(contactForm.action, {
          method: contactForm.method || 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (resp.ok) {
          contactMsg.textContent = 'Message sent! Thank you.';
          contactForm.reset();
        } else {
          // Attempt to get a specific error message from Formspree
          const data = await resp.json().catch(() => null);
          const errorText = (data && data.error) 
            ? `Error: ${data.error}` 
            : 'Oops — there was a problem sending your message.';
          
          contactMsg.textContent = errorText;
        }
      } catch (err) {
        // Handle network errors
        contactMsg.textContent = 'Network error. Please try again later.';
      }
    });
  }
})();
