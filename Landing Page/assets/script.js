function loadingAnimation2() {
    gsap.from(".head2", {
        y: 100,
        opacity: 0,
        delay: 0.35,
        duration: 0.7,
        stagger: 0.2,
    });
}
loadingAnimation2();

function loadingAnimation1() {
    gsap.from(".head1", {
        y: -100,
        opacity: 0,
        delay: 0.4,
        duration: 0.7,
        stagger: 0.2,
    });
}
loadingAnimation1();

let icon = document.querySelector("#ic");
let navb = document.querySelector(".main-nav");
let page = document.querySelector(".main");

function adjustNavbSize() {
    if (document.querySelector('.page1').offsetParent !== null) {
        navb.style.padding = "20px"; // Full size when on page 1
    } else {
        navb.style.padding = "5px"; // Smaller size when on page 2
    }
}

// Call this function on page load to set the correct size
adjustNavbSize();

icon.addEventListener("click", (event) => {
    event.preventDefault();
    if (navb.style.display === "none" || navb.style.display === "") {
        navb.style.display = "flex";
        setTimeout(() => {
            navb.style.opacity = "1";
            navb.style.transform = "translateY(0)";
            page.style.filter = "blur(8px)";
            adjustNavbSize();
        }, 10);
    } else {
        navb.style.opacity = "0";
        navb.style.transform = "translateY(-20px)";
        setTimeout(() => {
            navb.style.display = "none";
        }, 500);
        page.style.filter = "none";
    }
});
