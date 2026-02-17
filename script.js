document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const form = document.querySelector('.contact');

  const setActiveLink = () => {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const scrollPosition = window.scrollY + 120;

    let currentId = sections[0]?.id;
    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    setActiveLink();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const existingNote = form.querySelector('.form-note');
      if (existingNote) {
        existingNote.remove();
      }

      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = 'Thanks! Your message has been received.';
      form.appendChild(note);
      form.reset();
    });
  }

  setActiveLink();
});
