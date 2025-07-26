// cursor animation setup
// cursor code from: https://codepen.io/zainzafar/pen/oNypoEr
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = ["#ffb56b"];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;

  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";

    circle.style.scale = (circles.length - index) / circles.length;

    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();

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

// --- GSAP Animations ---

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
    end: "+=4000", // Extended to accommodate text animation
    scrub: 1, // Smoothly links timeline progress to scroll
    pin: true, // Pins the container while the animations run for better control
    // markers: true, // Uncomment for debugging
  },
});

// Add the Text Animation to the main timeline
// This uses 'fromTo' for robust positioning
mainScrollTimeline.fromTo(
  ".text-animation",
  { x: "120vw" }, // Start off-screen right
  {
    x: "-120vw", // End far off-screen left (adjust as needed)
    ease: "none",
    duration: 5, // Relative duration within the timeline
  }
);

// Add the Sun Expansion Animation to the main timeline
// It starts immediately after the text animation is defined in the timeline
mainScrollTimeline.to(
  ".sun",
  {
    scale: 6, // Adjust this value to make it truly full screen.
    ease: "power2.inOut",
    duration: 4, // Relative duration within the timeline
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
    duration: 3, // Time for text to fully appear
    ease: "none",
  },
  ">"
); // Start exactly when sun expansion completes

// Then move the text to the top
mainScrollTimeline.to(
  ".text-approach-animation",
  {
    y: "-30vh", // Move text up to top area
    duration: 1, // Time for the upward movement
    ease: "power2.out",
  },
  ">"
); // Start 0.5 seconds after text completes

const skillslTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".allSkills",
    start: "top top", // Start when allSkills section hits top
    end: "+=4500", // Extended scroll distance to accommodate all animations
    scrub: 1, // Smoothly links timeline progress to scroll
    pin: true, // Pins the container while the animations run for better control
    markers: true, // Uncomment for debugging
  },
});

// Design skills animation - moves from right to left
skillslTimeline.fromTo(
  ".designSkills",
  { x: "50vw" }, // Start off-screen right
  {
    x: "-150vw", // End far off-screen left
    ease: "none",
    duration: 3, // Relative duration within the timeline
  }
);

// Dev skills animation - starts after design skills begins
skillslTimeline.fromTo(
  ".devSkills",
  { x: "60vw" }, // Start off-screen right
  {
    x: "-130vw", // End far off-screen left
    ease: "none",
    duration: 3, // Relative duration within the timeline
  },
  "<0.5" // Starts this tween 0.5 seconds after the previous one starts
);

// Soft skills animation - starts after dev skills begins
skillslTimeline.fromTo(
  ".softSkills",
  { x: "70vw" }, // Start off-screen right
  {
    x: "-250vw", // End far off-screen left
    ease: "none",
    duration: 4, // Relative duration within the timeline
  },
  "<0.5" // Starts this tween 0.5 seconds after the previous one starts
);

// Refresh ScrollTrigger to ensure all animations work properly
// ScrollTrigger.refresh();
// Make sure your body has enough height to scroll
// If your content is only 100vh tall, there's no scroll space.
// The .spacer divs add scroll space.
