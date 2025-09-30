// --- Utility Functions ---
function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return document.querySelectorAll(selector);
}

// --- Sun Pulse Animation ---
let sunPulseAnimation;
function setupSunPulse() {
  const sun = document.querySelector(".sun");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      sun.style.animationPlayState = "paused";
    } else {
      sun.style.animationPlayState = "running";
    }
  });
}

// --- Sun Slideshow ---
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
];
let sunSlideshowInterval = null;
let lastIndex = -1;
function getRandomIndex() {
  let idx;
  do {
    idx = Math.floor(Math.random() * selfieImages.length);
  } while (idx === lastIndex);
  lastIndex = idx;
  return idx;
}
function preloadSelfies() {
  return Promise.all(
    selfieImages.map(
      (src) =>
        new Promise((res) => {
          const img = new Image();
          img.onload = res;
          img.src = src;
        })
    )
  );
}
function startSunSlideshow() {
  const sun = $(".sun");
  if (!sun) return;
  sun.innerHTML = "";
  const base = document.createElement("div");
  const overlay = document.createElement("div");
  [base, overlay].forEach((el) => {
    el.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;border-radius:50%;will-change:opacity,background-image,transform;transform:translateZ(0);transition:opacity 1.2s cubic-bezier(0.4,0,0.2,1);pointer-events:none;`;
    sun.appendChild(el);
  });
  base.style.zIndex = 1;
  overlay.style.zIndex = 2;
  overlay.style.opacity = 0;
  let currentIndex = getRandomIndex();
  base.style.backgroundImage = `url('${selfieImages[currentIndex]}')`;
  if (sunPulseAnimation) sunPulseAnimation.pause();
  sunSlideshowInterval = setInterval(() => {
    const nextIndex = getRandomIndex();
    overlay.style.backgroundImage = `url('${selfieImages[nextIndex]}')`;
    overlay.style.opacity = 1;
    setTimeout(() => {
      base.style.backgroundImage = overlay.style.backgroundImage;
      overlay.style.opacity = 0;
    }, 1200);
  }, 4000);
}
function stopSunSlideshow() {
  clearInterval(sunSlideshowInterval);
  sunSlideshowInterval = null;
  const sun = $(".sun");
  if (sun) sun.innerHTML = "";
  if (sunPulseAnimation) sunPulseAnimation.play();
}

// --- Loader Animation ---
function animateLoaderBall() {
  const loader = $("#loader-page");
  const ball = loader ? loader.querySelector(".loader-ball") : null;
  const percent = loader ? loader.querySelector(".loader-percent") : null;
  const nav = $(".main-nav");
  const smile = $(".smile");
  if (!loader || !ball || !percent || !nav || !smile) return;
  nav.style.opacity = 0;
  nav.style.transform = "translateY(-40px)";
  smile.style.opacity = 0;
  smile.style.transform = "translateY(40px)";
  let current = 0;
  percent.textContent = "0%";
  const minSize = 24,
    maxSize = 500;
  function updateBall() {
    percent.textContent = current + "%";
    const size = minSize + (maxSize - minSize) * (current / 100);
    ball.style.width = size + "px";
    ball.style.height = size + "px";
    ball.style.transition =
      "width 0.2s linear, height 0.2s linear, font-size 0.2s linear";
    ball.style.fontSize = 0.7 + 1.3 * (current / 100) + "em";
  }
  const totalDuration = 2000,
    steps = 100,
    intervalTime = totalDuration / steps;
  const interval = setInterval(() => {
    if (current < 100) {
      current++;
      updateBall();
    }
    if (current >= 100) {
      clearInterval(interval);
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        setTimeout(() => {
          gsap.to([nav, smile], {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          });
          setupScrollArrowLogic();
        }, 500);
      }, 500);
    }
  }, intervalTime);
}

// --- GSAP & Scroll Animations ---
function setupGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  // Smooth scroll with Lenis
  const lenis = new Lenis();
  lenis.on("scroll", () => {});
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Main sun expansion and text animation
  const mainScrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".container",
      start: "top top",
      end: "+=9000vh",
      scrub: 1,
      pin: true,
    },
  });

  mainScrollTimeline.to(
    ".sun-wrapper",
    {
      scale: 6,
      ease: "power2.inOut",
      duration: 10,
    },
    ">-2"
  );

  const fullText = `I’m Mai, a passionate UX/UI designer with strong background in web development and a keen interest in digital experiences. </br></br> My approach is driven by curiosity for people, creativity, and end-to-end systems. I start by listening and uncovering the deeper needs behind a challenge. Then I combine research, storytelling, and iteration to create intuitive, emotionally resonant solutions.`;

  mainScrollTimeline.to(
    ".text-approach-animation",
    {
      text: { value: fullText, delimiter: "" },
      duration: 15,
      ease: "none",
    },
    ">-5"
  );

  mainScrollTimeline.to(
    ".text-approach-animation",
    {
      y: "-30vh",
      opacity: 0,
      duration: 5,
      ease: "power2.out",
    },
    ">+3"
  );

  // Project parallax
  $all(".project-container").forEach((container) => {
    container.querySelectorAll(".project").forEach((project) => {
      const image = project.querySelector(".project-image");
      const text = project.querySelector(".project-text");
      if (image && text) {
        const moveY = (image.offsetHeight - text.offsetHeight) * 3.9;
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
              invalidateOnRefresh: true,
              onLeaveBack: () => gsap.set(text, { y: 0 }),
            },
          }
        );
      }
    });
  });

  // Skills section - animate from bottom to center sequentially, hold, then scroll up
  const skillsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".allSkills",
      start: "top top",
      end: "+=2500",
      scrub: 1,
      invalidateOnRefresh: true,
      pin: true, // Pin the section during animation
    },
  });

  // Phase 1: Animate first skill block from bottom to center height
  skillsTimeline.fromTo(
    ".designSkills",
    { y: "100vh", opacity: 0 },
    { y: "0vh", opacity: 1, duration: 1.5, ease: "power2.out" }
  );

  // Phase 2: Animate second skill block from bottom to center height
  skillsTimeline.fromTo(
    ".devSkills",
    { y: "100vh", opacity: 0 },
    { y: "0vh", opacity: 1, duration: 1.5, ease: "power2.out" },
    "-=0.2" // Slight overlap with previous animation
  );

  // Phase 3: Animate third skill block from bottom to center height
  skillsTimeline.fromTo(
    ".softSkills",
    { y: "100vh", opacity: 0 },
    { y: "0vh", opacity: 1, duration: 1.5, ease: "power2.out" },
    "-=0.2" // Slight overlap with previous animation
  );

  // Phase 4: Hold all blocks in center position (3 seconds of scroll time)
  skillsTimeline.to([".designSkills", ".devSkills", ".softSkills"], {
    y: "0vh",
    duration: 1,
    ease: "none",
  });

  // Phase 5: All blocks scroll up and out of view together
  skillsTimeline.to([".designSkills", ".devSkills", ".softSkills"], {
    y: "-100vh",
    opacity: 0.5,
    duration: 1.5,
    ease: "power2.in",
  });
}
// --- Main Init ---
document.addEventListener("DOMContentLoaded", () => {
  // setupSunText(); // Removed sun text animation
  setupSunPulse();
  animateLoaderBall();
  setupGSAPAnimations();
  preloadSelfies().then(() => {
    const smileDiv = $(".smile");
    if (smileDiv) {
      smileDiv.addEventListener("mouseenter", startSunSlideshow);
      smileDiv.addEventListener("mouseleave", stopSunSlideshow);
    }
  });
});
