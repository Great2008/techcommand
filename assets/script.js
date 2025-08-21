// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Theme toggle (persists to localStorage)
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Newsletter mini-validation
const newsForm = document.getElementById('newsletterForm');
const newsEmail = document.getElementById('newsletterEmail');
const newsMsg = document.getElementById('newsletterMsg');
if (newsForm) {
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = newsEmail && /.+@.+\..+/.test(newsEmail.value);
    newsMsg.textContent = valid ? 'Thanks! You are subscribed.' : 'Please enter a valid email.';
    if (valid) newsForm.reset();
  });
}

// Contact form handling (integrated with Formspree)
const contactForm = document.getElementById('contactForm');
const contactMsg = document.getElementById('contactMsg');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactMsg.textContent = '';

    // Basic client-side validation
    const formData = new FormData(contactForm);
    const email = formData.get('email') || '';
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
        const data = await resp.json().catch(() => null);
        contactMsg.textContent = (data && data.error) ? `Error: ${data.error}` : 'Oops — there was a problem sending your message.';
      }
    } catch (err) {
      contactMsg.textContent = 'Network error. Please try again later.';
    }
  });
}