document.addEventListener("DOMContentLoaded",  () => {
    const ease = "power4.inOut";


    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");

            if (href && !href.startsWith("#") && href !== window.location.pathname) {
                animationTransition().then(() => {
                    window.location.href = href;

                });
            }
        });
    });

    revealTransition().then(() => {
        gsap.set(".block", {visibility : "hidden"});
    });

    function revealTransition() {
        return new Promise((resolve) => {
            gsap.set(".block", {
                scale: 1
            });
            gsap.to(".block", {
                duration: 1,
                scale: 0,
                stagger: {
                    each: 0.1,
                    from: "start",
                    grid: "auto",
                    axis: "x"
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    function animationTransition() {
        return new Promise((resolve) => {
            gsap.set(".block", {
                visibility: "visible",
                scaleY: 0,
            });
            gsap.to(".block", {
                duration: 1,
                scaleY: 1,
                stagger: {
                    each: 0.1,
                    from: "start",
                    grid: [2,5],
                    axis: "x"
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

});