let slideIndex = 1;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

function showSlide(n) {
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  // Hide all slides
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));

  // Show current slide
  slides[slideIndex - 1].classList.add('active');
  indicators[slideIndex - 1].classList.add('active');
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
  resetInterval();
}

function previousSlide() {
  slideIndex--;
  showSlide(slideIndex);
  resetInterval();
}

function currentSlide(n) {
  slideIndex = n;
  showSlide(slideIndex);
  resetInterval();
}

function autoSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 2000);
}

// Initialize slider
showSlide(slideIndex);
slideInterval = setInterval(autoSlide, 2000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Add scroll effect to header
window.addEventListener('scroll', function () {
  const header = document.querySelector('.main-header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  }
});

// Back To Top button show when top-header tidak terlihat
const backBtn = document.getElementById('backToTop');
const topHeader = document.querySelector('.top-header');
function toggleBackBtn() {
  if (!backBtn || !topHeader) return;
  const rect = topHeader.getBoundingClientRect();
  // jika bawah top header sudah di atas viewport (rect.bottom < 0) maka tampilkan
  if (rect.bottom < 0) {
    backBtn.classList.add('show');
  } else {
    backBtn.classList.remove('show');
  }
}
window.addEventListener('scroll', toggleBackBtn, { passive: true });
window.addEventListener('load', toggleBackBtn);
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Animated counters
function animateCounter(el, duration = 1500) {
  const target = +el.dataset.target || 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = prefix + value.toLocaleString('id-ID') + suffix;
    // autosize when too many chars
    const len = el.textContent.length;
    if (len > 5) {
      el.style.fontSize = '36px';
    }
    if (len > 7) {
      el.style.fontSize = '30px';
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Trigger when in viewport once
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.dataset.played) {
          animateCounter(el);
          el.dataset.played = '1';
        }
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

// Program filter (Temukan Panggilanmu)
const filterButtons = document.querySelectorAll('.tp-filter');
const programCards = document.querySelectorAll('.tp-card');
// cards dalam grid sekunder otomatis termasuk di NodeList di atas.
const primaryGrid = document.getElementById('programGrid');
const secondaryGrid = document.getElementById('programGrid2');
// Simpan referensi asli urutan card sekunder untuk restore
const secondaryOriginal = secondaryGrid ? Array.from(secondaryGrid.children) : [];
let merged = false; // status apakah sudah digabung ke grid utama
const tpIntroEl = document.querySelector('.tp-intro');
const tpIntroDefault = tpIntroEl ? tpIntroEl.innerHTML : '';

if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // update intro text
      if (tpIntroEl) {
        const custom = btn.dataset.intro;
        if (filter === 'all' || !custom) {
          tpIntroEl.innerHTML = tpIntroDefault;
        } else {
          tpIntroEl.textContent = custom; // plain text for safety
        }
      }

      // Merge / restore secondary grid depending on filter
      if (filter !== 'all') {
        if (secondaryGrid && primaryGrid && !merged) {
          secondaryOriginal.forEach(card => primaryGrid.appendChild(card));
          secondaryGrid.style.display = 'none';
          merged = true;
        }
      } else {
        if (secondaryGrid && primaryGrid && merged) {
          // kembalikan card ke container sekunder (tetap urutan asli)
          secondaryOriginal.forEach(card => secondaryGrid.appendChild(card));
          secondaryGrid.style.display = '';
          merged = false;
        }
      }
      programCards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'tpFade .35s ease 0s both';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
      // optional: scroll into view if user jauh ke bawah
      const grid = document.getElementById('programGrid');
      if (grid) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.4) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// Simple keyframe injection for fade (only once)
if (!document.getElementById('tpKeyframes')) {
  const style = document.createElement('style');
  style.id = 'tpKeyframes';
  style.textContent = '@keyframes tpFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);
}

// Mitra Industri carousel ensure seamless loop by duplicating set if needed
(function initMitraCarousel() {
  const track = document.querySelector('.mi-track');
  if (!track) return;
  const items = Array.from(track.children);
  // If total width less than twice viewport, clone items until >= 2x for smooth scroll
  function ensureLength() {
    const vw = window.innerWidth;
    let total = track.scrollWidth;
    let safety = 0;
    while (total < vw * 2 && safety < 4) {
      items.forEach(it => {
        const clone = it.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      total = track.scrollWidth;
      safety++;
    }
  }
  ensureLength();
  window.addEventListener('resize', () => {
    ensureLength();
  });

  window.addEventListener('scroll', function () {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
})();


// ==================== Alumni Slider ====================
let alumniIndex = 1;
const alumniSlides = document.querySelectorAll('.alumni-slide');
const alumniPrev = document.querySelector('.alumni-section .prev');
const alumniNext = document.querySelector('.alumni-section .next');
let alumniInterval;

function showAlumniSlide(n) {
  if (alumniSlides.length === 0) return;

  if (n > alumniSlides.length) alumniIndex = 1;
  if (n < 1) alumniIndex = alumniSlides.length;

  alumniSlides.forEach(slide => slide.classList.remove('active'));
  alumniSlides[alumniIndex - 1].classList.add('active');
}

function nextAlumniSlide() {
  alumniIndex++;
  showAlumniSlide(alumniIndex);
  resetAlumniInterval();
}

function previousAlumniSlide() {
  alumniIndex--;
  showAlumniSlide(alumniIndex);
  resetAlumniInterval();
}

function autoAlumniSlide() {
  alumniIndex++;
  showAlumniSlide(alumniIndex);
}

function resetAlumniInterval() {
  clearInterval(alumniInterval);
  alumniInterval = setInterval(autoAlumniSlide, 4000); // auto 4s
}

// Init Alumni Slider
if (alumniSlides.length) {
  showAlumniSlide(alumniIndex);
  alumniInterval = setInterval(autoAlumniSlide, 4000);

  if (alumniPrev) alumniPrev.addEventListener('click', previousAlumniSlide);
  if (alumniNext) alumniNext.addEventListener('click', nextAlumniSlide);
}
