document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".main-nav a");
  const sectionMap = [
    { linkClass: "Mai", section: document.querySelector(".sun") },
    {
      linkClass: "Portfolio",
      section: document.querySelector(".project-container"),
    },
    { linkClass: "Skills", section: document.querySelector(".allSkills") },
    { linkClass: "Contact", section: document.querySelector(".contact") },
  ];

  function setActiveNav(className) {
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector("." + className);
    if (activeLink) activeLink.classList.add("active");
  }

  // Check if we need to scroll to Skills with offset (from other pages)
  function checkSkillsNavigation() {
    const urlHash = window.location.hash;
    const skillsScrollFlag = window._skillsScrollOffset;

    if (
      (urlHash === "#allSkills" || skillsScrollFlag) &&
      document.querySelector(".allSkills")
    ) {
      // Clear the flag
      window._skillsScrollOffset = false;

      // Wait a moment for page to fully load, then scroll with offset
      setTimeout(() => {
        const section = document.querySelector(".allSkills");
        if (section) {
          const sectionTop =
            section.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: sectionTop + 1460, // Use full offset when coming from other pages
            behavior: "smooth",
          });
          setActiveNav("Skills");
        }
      }, 500); // Delay to ensure page is fully loaded
    }
  }

  // Check if we need to scroll to Contact (from other pages)
  function checkContactNavigation() {
    const urlHash = window.location.hash;
    const contactScrollFlag = window._contactScrollOffset;

    if (
      (urlHash === "#contact" || contactScrollFlag) &&
      document.querySelector(".contact")
    ) {
      // Clear the flag
      window._contactScrollOffset = false;

      // Wait a moment for page to fully load, then scroll to contact
      setTimeout(() => {
        const section = document.querySelector(".contact");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
          setActiveNav("Contact");
        }
      }, 500); // Delay to ensure page is fully loaded
    }
  }

  // Check for Skills navigation on page load
  checkSkillsNavigation();
  // Check for Contact navigation on page load
  checkContactNavigation();

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

  const skills = document.querySelector(".Skills");
  if (skills) {
    skills.addEventListener("click", function (e) {
      e.preventDefault();
      const section = document.querySelector(".allSkills");
      if (section) {
        const currentScrollY = window.pageYOffset;
        const sectionTop = section.getBoundingClientRect().top + currentScrollY;
        let offset;
        if (currentScrollY > sectionTop) {
          offset = -500;
        } else {
          offset = 1460;
        }

        window.scrollTo({
          top: sectionTop + offset,
          behavior: "smooth",
        });
      }
      setActiveNav("Skills");
    });
  }

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
