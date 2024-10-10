function loadingAnimation2() {
    gsap.from(".head2", {
        y: 100,
        delay: 0.35,
        duration: 0.7,
    });
}
loadingAnimation2();

function loadingAnimation1() {
    gsap.from(".head1", {
        y: 100,
        delay: 0.4,
        duration: 0.7,
    });
}
loadingAnimation1();

function loadingAnimation12() {
    gsap.from(".head12", {
        y: -100,
      delay: 0.4,
      opacity: 0,
      duration: 0.7,
        stagger: 0.2,
    });
  
  gsap.from(".btn12", {
        y: 100,
      delay: 0.3,
      opacity: 0,
      duration: 0.9,
        stagger: 0.2,
    });
}

loadingAnimation12();

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

icon.addEventListener("click", () => {
  event.preventDefault();
  if (navb.style.display === "none" || navb.style.display === "") {
    navb.style.display = "flex";
    setTimeout(() => {
      navb.style.opacity = "1";
      navb.style.transform = "translateY(0)";
      page.style.filter = "blur(8px)";
    }, 10); // Slight delay to allow display to take effect before animating
  } else {
    navb.style.opacity = "0";
    navb.style.transform = "translateY(-20px)";
    setTimeout(() => {
      navb.style.display = "none";
    }, 500);
    page.style.filter = "none";
  }
});

let logo = document.querySelector("#ic img"); // Select the logo image
let page2 = document.querySelector(".page2"); // Select the second page element

// Function to adjust logo size based on which page is visible
function adjustLogoSize() {
    // If page2 is visible, make the logo smaller
    if (page2.offsetTop < window.scrollY + window.innerHeight) {
        logo.classList.remove("logo-large");
        logo.classList.add("logo-small");
    } else {
        // If not on the second page, keep the logo large
        logo.classList.remove("logo-small");
        logo.classList.add("logo-large");
    }
}

// Listen for scroll events to trigger logo resizing
window.addEventListener("scroll", adjustLogoSize);

// Call the function on page load to set the correct logo size
adjustLogoSize();

gsap.registerPlugin(ScrollTrigger);

function zigAnimation() {
  gsap.from("#what", {
    y: -100,
    opacity: 0,
    duration: 1,
    stagger: 0.5,
    scrollTrigger: {
      trigger: "#what",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  gsap.from("#is", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.5,
    scrollTrigger: {
      trigger: "#is",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}

function initPageAnimations() {
  zigAnimation();
  ScrollTrigger.refresh();
}

window.addEventListener('load', () => {
  initPageAnimations();
});

window.addEventListener('popstate', () => {
  initPageAnimations();
});

document.querySelector('#transition-link').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent immediate navigation
        document.body.classList.add('fade-out');  // Add fade-out class
        setTimeout(() => {
            window.location.href = event.target.href;  // Navigate to new page after fade-out
        }, 300);  // Delay navigation by 500ms (same as the transition duration)
    });

