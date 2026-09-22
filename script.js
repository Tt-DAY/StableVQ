const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const chapterLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const chapters = chapterLinks.map(link => document.querySelector(link.getAttribute('href')));
let chapterUpdatePending = false;
const updateChapter = () => {
  let current = -1;
  chapters.forEach((chapter, index) => {
    if (chapter && chapter.getBoundingClientRect().top <= 150) current = index;
  });
  chapterLinks.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  chapterUpdatePending = false;
};
window.addEventListener('scroll', () => {
  if (!chapterUpdatePending) {
    chapterUpdatePending = true;
    requestAnimationFrame(updateChapter);
  }
}, { passive: true });
updateChapter();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const galleryImage = document.querySelector('#gallery-image');
const galleryCaption = document.querySelector('#gallery-caption');
document.querySelectorAll('.gallery-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;
    document.querySelectorAll('.gallery-tab').forEach((item) => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    });
    galleryImage.classList.add('switching');
    const preload = new Image();
    preload.src = tab.dataset.image;
    preload.onload = () => {
      galleryImage.src = tab.dataset.image;
      galleryImage.alt = tab.dataset.alt;
      galleryCaption.textContent = tab.dataset.caption;
      requestAnimationFrame(() => galleryImage.classList.remove('switching'));
    };
  });
});

const copyButton = document.querySelector('#copy-bibtex');
copyButton.addEventListener('click', async () => {
  const citation = document.querySelector('#bibtex').textContent;
  try {
    await navigator.clipboard.writeText(citation);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1600);
  } catch {
    copyButton.textContent = 'Select text';
  }
});
