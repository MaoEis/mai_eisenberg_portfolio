document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".main-nav a");
  const sectionMap = [
    { linkClass: "Mai", section: document.querySelector(".sun") },
    {
      linkClass: "Portfolio",
      section: document.querySelector(".project-container"),
    },
    { linkClass: "Contact", section: document.querySelector(".contact") },
  ];

  function setActiveNav(className) {
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector("." + className);
    if (activeLink) activeLink.classList.add("active");
  }

  // Click logic
  const mai = document.querySelector(".Mai");
  if (mai) {
    mai.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveNav("Mai");
      if (window.sunPulseAnimation) window.sunPulseAnimation.restart();
    });
  }

  const portfolio = document.querySelector(".Portfolio");
  if (portfolio) {
    portfolio.addEventListener("click", function (e) {
      e.preventDefault();
      const section = document.querySelector(".project-container");
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setActiveNav("Portfolio");
    });
  }

  const contact = document.querySelectorAll(".Contact");
  contact.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Prefer #contact, fallback to #contactProjects
      let section = document.querySelector(".contact");
      if (!section) section = document.getElementById("contactProjects");
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setActiveNav("Contact");
    });
  });

  // Intersection Observer for scroll-based nav highlighting
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  };

  // Track which section is currently active
  let currentActive = null;

  sectionMap.forEach(({ linkClass, section }) => {
    if (!section) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(linkClass);
          currentActive = linkClass;
        } else {
          // If leaving this section and no other is active, remove all active
          // Wait for all observers to fire before clearing
          setTimeout(() => {
            const anyActive = sectionMap.some(({ section }) => {
              return (
                section &&
                section.getBoundingClientRect().top < window.innerHeight &&
                section.getBoundingClientRect().bottom > 0
              );
            });
            if (!anyActive) {
              navLinks.forEach((link) => link.classList.remove("active"));
              currentActive = null;
            }
          }, 10);
        }
      });
    }, observerOptions);
    observer.observe(section);
  });
});
