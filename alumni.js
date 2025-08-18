const slideAlumni = document.querySelectorAll(".alumni-slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 1;
let slideAlumniInterval;

// Show slide
function showSlide(index) {
  slideAlumni.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

// Next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % slideAlumni.length;
  showSlide(currentIndex);
}

// Prev slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + slideAlumni.length) % slideAlumni.length;
  showSlide(currentIndex);
}

// Event listeners
nextBtn.addEventListener("click", () => {
  nextSlide();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
});

// Init
showSlide(currentIndex);
