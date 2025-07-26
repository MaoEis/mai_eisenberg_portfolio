// ----- Custom Cursor Setup -----
(function () {
  // Wait for DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector("#custom-cursor");
    let cursorMode = "circle"; // Track cursor mode

    // Set cursor color based on page
    let pageColor = "#feba17"; // default
    const body = document.body;
    if (body.classList.contains("toda-page")) {
      pageColor = "#002f2f"; // example: Toda page color
    } else if (body.classList.contains("bodySwear")) {
      pageColor = "#68ff47"; // example: Swear page color
    } else if (body.classList.contains("bodyIndex")) {
      pageColor = "#feba17"; // example: Home page color
    }
    // Set initial cursor color
    cursor.style.backgroundColor = pageColor;

    window.addEventListener("mousemove", (e) => {
      if (cursorMode === "circle") {
        cursor.style.left = e.clientX + -12 + "px";
        cursor.style.top = e.clientY + -12 + "px";
        cursor.style.backgroundColor = pageColor;
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
            backgroundColor: "#feba17",
            color: "#321400",
            fontSize: "14px",
            fontWeight: 300,
            duration: 0.3,
            ease: "power2.out",
            opacity: 0.7,
          });
          cursor.textContent = "view casefile";
        });
        el.addEventListener("mouseleave", () => {
          cursorMode = "circle";
          gsap.to(cursor, {
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "#feba17",
            fontSize: "0px",
            duration: 0.3,
            opacity: 0.9,
            ease: "power2.out",
          });
          cursor.textContent = "";
        });
      });

    // Add event listeners to contact icons
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
          backgroundColor: "#feba17",
          color: "#321400",
          fontSize: "16px",
          fontWeight: 300,
          duration: 0.3,
          ease: "power2.out",
          opacity: 0.9,
        });
        cursor.textContent = text;
      });
      icon.addEventListener("mouseleave", () => {
        cursorMode = "circle";
        gsap.to(cursor, {
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#feba17",
          fontSize: "0px",
          duration: 0.3,
          opacity: 0.9,
          ease: "power2.out",
        });
        cursor.textContent = "";
      });
    });
  });
})();
