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
let page1 = document.querySelector(".page1");

icon.addEventListener("click", () => {
  if (navb.style.display === "none" || navb.style.display === "") {
    navb.style.display = "flex";
    setTimeout(() => {
      navb.style.opacity = "1";
      navb.style.transform = "translateY(0)";
      page1.style.filter = "blur(8px)";
    }, 10); // Slight delay to allow display to take effect before animating
  } else {
    navb.style.opacity = "0";
    navb.style.transform = "translateY(-20px)";
    setTimeout(() => {
      navb.style.display = "none";
    }, 500);
    page1.style.filter = "none";
  }
});





