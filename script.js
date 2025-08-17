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
