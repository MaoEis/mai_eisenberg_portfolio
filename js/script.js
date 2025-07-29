// Array of your image paths (update with your actual image filenames)
const selfieImages = [
  "./asset/Mai1.jpeg",
  "./asset/Mai2.jpeg",
  "./asset/Mai3.jpeg",
  "./asset/Mai4.jpeg",
  "./asset/Mai5.jpeg",
  "./asset/Mai6.jpeg",
  "./asset/Mai7.jpeg",
  "./asset/Mai8.jpeg",
  "./asset/Mai9.jpeg",
  // Add more if you have more selfies
];

let sunSlideshowInterval = null;
let lastIndex = -1;

function getRandomIndex() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * selfieImages.length);
  } while (newIndex === lastIndex);
  lastIndex = newIndex;
  return newIndex;
}

function startSunSlideshow() {
  const sun = document.querySelector(".sun");
  if (!sun) return;

  // Clear existing children
  sun.innerHTML = "";

  // Create two layers
  const base = document.createElement("div");
  const overlay = document.createElement("div");

  [base, overlay].forEach((el) => {
    el.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      transition: opacity 1s ease-in-out;
    `;
    sun.appendChild(el);
  });

  base.style.zIndex = 1;
  overlay.style.zIndex = 2;
  overlay.style.opacity = 0;

  // Set initial image
  let currentIndex = getRandomIndex();
  base.style.backgroundImage = `url('${selfieImages[currentIndex]}')`;

  sunSlideshowInterval = setInterval(() => {
    const nextIndex = getRandomIndex();
    overlay.style.backgroundImage = `url('${selfieImages[nextIndex]}')`;
    overlay.style.opacity = 1;

    // After fade-in, swap images
    setTimeout(() => {
      base.style.backgroundImage = `url('${selfieImages[nextIndex]}')`;
      overlay.style.opacity = 0;
    }, 1000); // Match transition duration
  }, 3000);
}

function stopSunSlideshow() {
  const sun = document.querySelector(".sun");
  clearInterval(sunSlideshowInterval);
  sunSlideshowInterval = null;
  if (sun) {
    sun.innerHTML = "";
  }
}

const smileDiv = document.querySelector(".smile");
if (smileDiv) {
  smileDiv.addEventListener("mouseenter", () => {
    startSunSlideshow();
  });
  smileDiv.addEventListener("mouseleave", () => {
    stopSunSlideshow();
  });
}

// ----- gsap animation setup -----

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Smooth scroll with Lenis
const lenis = new Lenis();

lenis.on("scroll", (e) => {
  // console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 1. Initial Sun Pulse Animation
const sunPulseAnimation = gsap.to(".sun", {
  scale: 1.1, // Scales up slightly
  yoyo: true, // Plays forward then reverses
  repeat: -1, // Loops indefinitely
  duration: 2, // Duration of one full cycle (scale up and down)
  ease: "power1.inOut",
});

// 2. Main Scroll-Triggered Timeline

const mainScrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top", // Main animation sequence starts when container hits top
    // *** MODIFIED END VALUE ***
    end: "+=2000", // Reduced scroll distance. Adjust this value to control the blank space.
    scrub: 1, // Smoothly links timeline progress to scroll
    pin: true, // Pins the container while the animations run for better control
    // markers: true, // Uncomment for debugging to see the trigger points
  },
});

// Add the Text Animation to the main timeline
mainScrollTimeline.fromTo(
  ".text-animation",
  { x: "100vw" }, // Start off-screen right
  {
    x: () =>
      `-${
        window.innerWidth +
        document.querySelector(".text-animation").offsetWidth
      }px`, // End far off-screen left (adjust as needed)
    ease: "none",
    duration: 10, // Relative duration within the timeline
  }
);

// Add the Sun Expansion Animation to the main timeline
mainScrollTimeline.to(
  ".sun",
  {
    scale: 6, // Adjust this value to make it truly full screen.
    ease: "power2.inOut",
    duration: 10, // Relative duration within the timeline
    onStart: () => sunPulseAnimation.pause(), // Pause pulse when animation starts
  },
  ">-0.2" // Starts this tween 0.2 units BEFORE the previous one ends (slight overlap)
);

const fullText = `My approach is driven by curiosity for people, creativity, and end-to-end systems. I start by listening and uncovering the deeper needs behind a challenge. Then I combine research, storytelling, and iteration to create intuitive, emotionally resonant solutions.`;

// Add the text typing animation to the main timeline (starts right after sun expansion)
mainScrollTimeline.to(
  ".text-approach-animation",
  {
    text: {
      value: fullText,
      delimiter: "", // character-by-character typing
    },
    duration: 15, // Time for text to fully appear
    ease: "none",
  },
  ">"
); // Start exactly when sun expansion completes

// *** MODIFIED: Instead of moving it far up, we can fade it out or reduce its movement ***
// Option 1: Move less and fade out
mainScrollTimeline.to(
  ".text-approach-animation",
  {
    y: "-30vh", // Move slightly up
    opacity: 0, // Fade out the text
    duration: 5, // Time for the movement and fade
    ease: "power2.out",
  },
  ">+3" // Starts 1 second after the text typing completes
);

// ----- Project Parallax Animation -----
document.querySelectorAll(".project-container").forEach((container) => {
  container.querySelectorAll(".project").forEach((project) => {
    const image = project.querySelector(".project-image");
    const text = project.querySelector(".project-text");
    if (image && text) {
      // Move the text a slower distance (e.g., 40% of the image height)
      const moveY = (image.offsetHeight - text.offsetHeight) * 4.2;
      gsap.fromTo(
        text,
        { y: 0 },
        {
          y: moveY,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top center",
            end: "bottom center",
            scrub: true,
            // markers: true,
            invalidateOnRefresh: true,
            onLeaveBack: () => gsap.set(text, { y: 0 }),
          },
        }
      );
    }
  });
});

// ----- Skills Section Animation -----
const skillsTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".allSkills",
    start: "top top",
    end: "+=4500",
    scrub: 1,
    invalidateOnRefresh: true,
    pin: true,
  },
});

function vw(v) {
  return window.innerWidth * (v / 100);
}

function getSlideTween(selector, startVW) {
  const startX = vw(startVW);
  const el = document.querySelector(selector);
  const endX = startX - el.offsetWidth;

  return {
    from: { x: startX },
    to: {
      x: endX,
      ease: "none",
      duration: 3,
    },
  };
}

// DESIGN SKILLS (50vw to 50vw - width)
const design = getSlideTween(".designSkills", 50);
skillsTimeline.fromTo(".designSkills", design.from, design.to);

// DEV SKILLS (60vw to 60vw - width)
const dev = getSlideTween(".devSkills", 60);
skillsTimeline.fromTo(".devSkills", dev.from, dev.to, "<0.5");

// SOFT SKILLS (70vw to 70vw - width)
const soft = getSlideTween(".softSkills", 70);
skillsTimeline.fromTo(".softSkills", soft.from, soft.to, "<0.5");



// Loader page logic with ball grow and percentage
function animateLoaderBall() {
  const loader = document.getElementById("loader-page");
  const ball = loader ? loader.querySelector(".loader-ball") : null;
  const percent = loader ? loader.querySelector(".loader-percent") : null;
  const nav = document.querySelector(".index-nav");
  const smile = document.querySelector(".smile");
  if (!loader || !ball || !percent || !nav || !smile) return;

  // Ensure nav and smile are hidden at the start
  nav.style.opacity = 0;
  nav.style.transform = "translateY(-40px)";
  smile.style.opacity = 0;
  smile.style.transform = "translateY(40px)";

  let current = 0;
  percent.textContent = "0%";

  // Animate percentage and ball size together
  const minSize = 24;
  const maxSize = 500;
  function updateBall() {
    percent.textContent = current + "%";
    const size = minSize + (maxSize - minSize) * (current / 100);
    ball.style.width = size + "px";
    ball.style.height = size + "px";
    ball.style.transition =
      "width 0.2s linear, height 0.2s linear, font-size 0.2s linear";
    ball.style.fontSize = 0.7 + 1.3 * (current / 100) + "em";
  }

  // Animate percentage over exactly 2 seconds
  const totalDuration = 2000; // ms
  const steps = 100;
  const intervalTime = totalDuration / steps; // 20ms per step

  const interval = setInterval(() => {
    if (current < 100) {
      current += 1;
      updateBall();
    }
    if (current >= 100) {
      clearInterval(interval);
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        // Animate nav and smile in after loader is finished, with 1s delay
        setTimeout(() => {
          gsap.to([nav, smile], {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          });
        }, 500);
      }, 500);
    }
  }, intervalTime);
}
window.addEventListener("DOMContentLoaded", animateLoaderBall);

document.addEventListener("DOMContentLoaded", function () {
  selfieImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
});
