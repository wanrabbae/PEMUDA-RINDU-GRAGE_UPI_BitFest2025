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
