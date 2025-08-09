document.addEventListener("DOMContentLoaded", () => {
  const ease = "power4.inOut";

  // Create the yellow transition block
  let transitionBlock = document.createElement("div");
  transitionBlock.className = "transition-block";
  document.body.appendChild(transitionBlock);

  // Always ensure nav is visible and fully opaque on page load
  const nav = document.querySelector(".main-nav");
  if (nav) {
    nav.style.opacity = 0;
    nav.style.transform = "translateY(-40px)";
  }

  // On page load, start with the yellow block covering the page
  gsap.set(".transition-block", { x: "0vw", display: "block" });

  function showTransitionBlock() {
    if (nav) nav.style.visibility = "hidden";
    return new Promise((resolve) => {
      gsap.set(".transition-block", { x: "100vw", display: "block" });
      gsap.to(".transition-block", {
        duration: 0.6,
        x: "0vw",
        ease: ease,
        onComplete: resolve,
      });
    });
  }

  function hideTransitionBlock() {
    gsap.set(".transition-block", { x: "0vw", display: "block" });
    gsap.to(".transition-block", {
      duration: 0.6,
      x: "-100vw",
      ease: ease,
      onComplete: () => {
        gsap.set(".transition-block", { display: "none" });
        if (nav) {
          nav.style.visibility = "visible";
          // Only animate nav in if NOT on the index page
          const isIndex =
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html");
          if (!isIndex) {
            gsap.to(nav, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: ease,
            });
          }
        }
      },
    });
  }

  // Helper to attach transition listeners to all links
  window.attachPageTransitionListeners = function () {
    document.querySelectorAll("a.page-transition-link").forEach((link) => {
      // Remove any previous listener to avoid duplicates
      link.removeEventListener("click", window._pageTransitionHandler);
      // Define the handler if not already
      if (!window._pageTransitionHandler) {
        window._pageTransitionHandler = function (e) {
          const href = this.getAttribute("href");
          if (
            href &&
            !href.startsWith("#") &&
            href !== window.location.pathname
          ) {
            e.preventDefault();
            if (typeof showTransitionBlock === "function") {
              showTransitionBlock().then(() => {
                window.location.href = href;
              });
            } else {
              window.location.href = href;
            }
          }
        };
      }
      link.addEventListener("click", window._pageTransitionHandler);
    });
  };

  // Attach listeners on initial load
  window.attachPageTransitionListeners();

  // On page load, animate the block out and nav in
  hideTransitionBlock();

  // Hide transition block on browser back/forward navigation
  window.addEventListener("pageshow", function (event) {
    // Only hide if the transition block is visible
    const block = document.querySelector(".transition-block");
    if (block && block.style.display !== "none") {
      hideTransitionBlock();
    }
  });
});
