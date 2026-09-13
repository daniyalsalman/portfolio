// Dark mode toggle
const lightSwitch = document.getElementById('light-switch');
if (lightSwitch) {
  lightSwitch.checked = document.documentElement.classList.contains('dark');
  lightSwitch.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark', lightSwitch.checked);
    localStorage.setItem('dark-mode', lightSwitch.checked);
  });
}

// Scrollspy for the side nav
const navLinks = document.querySelectorAll('.side-nav a');
const sections = Array.from(navLinks)
  .map(link => document.getElementById(link.getAttribute('href').slice(1)))
  .filter(Boolean);

if (navLinks.length && sections.length) {
  const setActive = (id) => {
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if (visible.length) {
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      setActive(visible[0].target.id);
    }
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  sections.forEach(section => observer.observe(section));
}

// Autoplay scroll-triggered videos while in view, pause when scrolled away
const scrollVideos = document.querySelectorAll('.scroll-video');
if (scrollVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });

  scrollVideos.forEach(video => videoObserver.observe(video));
}
