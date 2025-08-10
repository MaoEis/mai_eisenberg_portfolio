// ----- Custom Cursor Setup -----
(function () {
  // Wait for DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector("#custom-cursor");
    let cursorMode = "circle"; // Track cursor mode

    // Set cursor color and box-shadow based on page
    let pageColor = "#feba17"; // default
    let pageShadow = "0 0 15px 1px rgba(255, 190, 0, 0.8)"; // default
    const body = document.body;
    if (body.classList.contains("toda-page")) {
      pageColor = "#ebbb2a";
      pageShadow = "0 0 24px 4px rgba(235, 187, 42, 0.5)";
    } else if (body.classList.contains("bodySwear")) {
      pageColor = "#68ff47";
      pageShadow = "0 0 24px 4px rgba(104, 255, 71, 0.5)";
    } else if (body.classList.contains("bodyIndex")) {
      pageColor = "#feba17";
      pageShadow = "0 0 15px 1px rgba(255, 190, 0, 0.8)";
    }
    // Set initial cursor color and box-shadow
    cursor.style.backgroundColor = pageColor;
    cursor.style.boxShadow = pageShadow;

    window.addEventListener("mousemove", (e) => {
      if (cursorMode === "circle") {
        cursor.style.left = e.clientX + -12 + "px";
        cursor.style.top = e.clientY + -12 + "px";
        cursor.style.backgroundColor = pageColor;
        cursor.style.boxShadow = pageShadow;
      } else {
        cursor.style.left = e.clientX + -50 + "px";
        cursor.style.top = e.clientY + -25 + "px";
      }
    });

    // Add event listeners to all project images and project card links (including children)
    document
      .querySelectorAll(".project-image, .projectImg, .projectImg *")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorMode = "text";
          gsap.to(cursor, {
            width: 100,
            height: 30,
            borderRadius: "1px",
            backgroundColor: pageColor,
            color: "#321400",
            fontSize: "14px",
            fontWeight: 300,
            duration: 0.3,
            ease: "power2.out",
            opacity: 0.9,
            boxShadow: pageShadow,
          });
          cursor.textContent = "view casefile";
        });
        el.addEventListener("mouseleave", () => {
          cursorMode = "circle";
          gsap.to(cursor, {
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: pageColor,
            fontSize: "0px",
            duration: 0.3,
            opacity: 0.9,
            ease: "power2.out",
            boxShadow: pageShadow,
          });
          cursor.textContent = "";
        });
      });

    // Add event listeners to contact icons
    function attachContactCursorListeners() {
      const contactIcons = document.querySelectorAll(
        ".contact-icons a, .contact-icons-projects a"
      );
      contactIcons.forEach((icon) => {
        icon.addEventListener("mouseenter", () => {
          cursorMode = "text";
          let text = "";
          if (icon.querySelector(".ph-linkedin-logo")) {
            text = "/in/maieisenberg/";
          } else if (icon.querySelector(".ph-envelope")) {
            text = "mai.eisenberg@gmail.com";
          } else if (icon.querySelector(".ph-messenger-logo")) {
            text = "+972 55 939 4037";
          } else if (icon.querySelector(".ph-whatsapp-logo")) {
            text = "+324 777 18814";
          }
          // Create a hidden span to measure text width
          let measureSpan = document.createElement("span");
          measureSpan.style.visibility = "hidden";
          measureSpan.style.position = "absolute";
          measureSpan.style.fontSize = "16px";
          measureSpan.style.fontWeight = "300";
          measureSpan.style.fontFamily = "inherit";
          measureSpan.textContent = text;
          document.body.appendChild(measureSpan);
          let textWidth = measureSpan.offsetWidth + 32; // Add padding
          document.body.removeChild(measureSpan);

          // Animate cursor to text mode
          gsap.to(cursor, {
            width: textWidth,
            height: 30,
            borderRadius: "1px",
            backgroundColor: pageColor,
            color: "#321400",
            fontSize: "16px",
            fontWeight: 300,
            duration: 0.3,
            ease: "power2.out",
            opacity: 0.9,
            boxShadow: pageShadow,
          });
          cursor.textContent = text;
        });
        icon.addEventListener("mouseleave", () => {
          cursorMode = "circle";
          gsap.to(cursor, {
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: pageColor,
            fontSize: "0px",
            duration: 0.3,
            opacity: 0.9,
            ease: "power2.out",
            boxShadow: pageShadow,
          });
          cursor.textContent = "";
        });
      });
    }
    // Expose to global scope for dynamic contact section
    window.attachContactCursorListeners = attachContactCursorListeners;
    // Initial attach (for pages where contact icons are present at load)
    attachContactCursorListeners();

    // MutationObserver to auto-attach listeners when contact icons are added
    const contactObserver = new MutationObserver((mutationsList) => {
      let shouldAttach = false;
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 && // Element node
            (node.matches?.('.contact-icons a, .contact-icons-projects a') ||
              node.querySelector?.('.contact-icons a, .contact-icons-projects a'))
          ) {
            shouldAttach = true;
          }
        });
      });
      if (shouldAttach) {
        attachContactCursorListeners();
      }
    });
    contactObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();
