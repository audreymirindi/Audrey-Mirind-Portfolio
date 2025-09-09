// Smooth scroll for navbar links
document.querySelectorAll(".navbar a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* **************************************************************************************** */

document.addEventListener("DOMContentLoaded", () => {
  // Observe both About + Audio sections
  const elements = document.querySelectorAll(
    ".about-image, .about-text, .audio-image, .audio-text"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          obs.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
});

// Elements
const audioBtn = document.getElementById("audioBtn");
const audio = document.getElementById("audrey-audio");
const audioIcon = document.getElementById("audioIcon");

// Texts
const initialText = "Listen Now";
const listeningText = "Listening...";

audioBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    audioIcon.className = "ri-pause-large-fill"; // change to pause icon
    audioBtn.innerHTML = `<i id="audioIcon" class="ri-pause-large-fill"></i> ${listeningText}`;
  } else {
    audio.pause();
    audioBtn.innerHTML = `<i id="audioIcon" class="ri-play-large-fill"></i> ${initialText}`;
  }
});

// Reset when audio ends
audio.addEventListener("ended", () => {
  audioBtn.innerHTML = `<i id="audioIcon" class="ri-play-large-fill"></i> ${initialText}`;
});

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((registration) => {
    console.log("Service Worker registered:", registration);

    // Detect updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          // A new update is ready
          showUpdateNotification();
        }
      });
    });
  });
}

// Function to show notification banner
function showUpdateNotification() {
  const banner = document.createElement("div");
  banner.innerHTML =
    "<i class='ri-loop-left-line'></i> New version available. Click to reload.";
  banner.style.position = "fixed";
  banner.style.bottom = "20px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.background = "#ffffffff";
  banner.style.color = "black";
  banner.style.padding = "20px 60px";
  banner.style.borderRadius = "8px";
  banner.style.cursor = "pointer";
  banner.style.zIndex = "9999";
  document.body.appendChild(banner);

  banner.addEventListener("click", () => {
    window.location.reload();
  });
}

/* =========================================================================== */

const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Get card width dynamically (first card including margin)
function getCardWidth() {
  const card = track.querySelector(".carousel-item");
  const style = window.getComputedStyle(card);
  const margin = parseInt(style.marginLeft) + parseInt(style.marginRight);
  return card.offsetWidth + margin;
}

// Update button visibility
function updateButtons() {
  prevBtn.style.display = track.scrollLeft > 0 ? "block" : "none";
  nextBtn.style.display =
    track.scrollLeft + track.clientWidth < track.scrollWidth ? "block" : "none";
}

// Scroll by one card
nextBtn.addEventListener("click", () => {
  track.scrollBy({ left: getCardWidth(), behavior: "smooth" });
});
prevBtn.addEventListener("click", () => {
  track.scrollBy({ left: -getCardWidth(), behavior: "smooth" });
});

// --- Touch Swipe Support with Snap ---
let startX;
let scrollLeft;
let isDragging = false;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].pageX;
  scrollLeft = track.scrollLeft;
  isDragging = true;
});

track.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const x = e.touches[0].pageX;
  const walk = startX - x;
  track.scrollLeft = scrollLeft + walk;
});

track.addEventListener("touchend", () => {
  isDragging = false;

  const cardWidth = getCardWidth();
  const index = Math.round(track.scrollLeft / cardWidth); // nearest card
  const snapPosition = index * cardWidth;

  track.scrollTo({ left: snapPosition, behavior: "smooth" });
  updateButtons();
});

// Track scroll + resize
track.addEventListener("scroll", updateButtons);
window.addEventListener("resize", updateButtons);

// Initialize on load
updateButtons();

/* ============================= LANGUAGES =============================== */
document.querySelectorAll(".language-card").forEach((card) => {
  const fill = card.querySelector(".progress-fill");
  const percent = card.getAttribute("data-percent");
  fill.style.width = percent + "%";
});

/* ================================= SKILLS ================================= */

// Animate skill bars
const progressBars = document.querySelectorAll(".skill-progress");
progressBars.forEach((bar) => {
  const progress = bar.getAttribute("data-progress");
  setTimeout(() => {
    bar.style.width = progress;
  }, 500);
});

/* language animation */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".language-card");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add("visible");

          // Animate progress bar
          const percent = card.getAttribute("data-percent");
          card.querySelector(".progress-fill").style.width = percent + "%";

          observer.unobserve(card); // animate only once
        }
      });
    },
    { threshold: 0.3 } // trigger when 30% visible
  );

  cards.forEach((card) => observer.observe(card));
});

/* ==================================== SKILLS ANIMATION ========================================== */
const sections = document.querySelectorAll(".skills-section");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const section = entry.target;

        // Animate the image
        const img = section.querySelector(".skills-image img");
        if (img) img.classList.add("visible");

        // Animate all text content (e.g., paragraphs, list items)
        const texts = section.querySelectorAll("p, li, h2");
        texts.forEach((el) => {
          el.classList.add("slide-up");
        });

        observer.unobserve(section);
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach((section) => observer.observe(section));

/* ==================================== MOBILE NAV ========================================== */
const mobilenavbutton = document.getElementById("mobile-nav-button");
const mobilenavcard = document.getElementById("mobile-nav-card");

// Open menu
mobilenavbutton.addEventListener("click", () => {
  mobilenavcard.classList.add("show"); // make overlay visible
  setTimeout(() => {
    mobilenavcard.classList.add("active"); // then slide in
  }, 10); // slight delay to trigger transition
});

// Close when clicking outside .card-nav
mobilenavcard.addEventListener("click", (e) => {
  if (!e.target.closest(".card-nav")) {
    closeMenu();
  }
});

// Close when clicking links inside .card-nav
const navLinks = mobilenavcard.querySelectorAll(".card-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Function to close menu properly
function closeMenu() {
  mobilenavcard.classList.remove("active"); // slide out first

  // Wait for slide transition to end, then fade out overlay
  mobilenavcard.addEventListener(
    "transitionend",
    () => {
      if (!mobilenavcard.classList.contains("active")) {
        mobilenavcard.classList.remove("show");
      }
    },
    { once: true }
  );
}
