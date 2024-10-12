const races = document.querySelector(".races");
console.log(races.offsetWidth)

function getScrollAmount() {
  let racesWidth = races.scrollWidth;
  return -(racesWidth + racesWidth*.25 - window.innerWidth);
}

const tween = gsap.to(races, {
  x: getScrollAmount,
  duration: 1,
  ease: "none",
});


ScrollTrigger.create({
  trigger:".racesWrapper",
  start:"top 35%",
  end: () => `+=${getScrollAmount()} * -2`,
  pin:true,
  animation:tween,
  scrub:5,
  invalidateOnRefresh:true,
  markers:false
})
// function locomotiveAnimation() {
//   gsap.registerPlugin(ScrollTrigger);

//   // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

//   const locoScroll = new LocomotiveScroll({
//     el: document.querySelector("#main"),
//     smooth: true,
//   });
//   // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
//   locoScroll.on("scroll", ScrollTrigger.update);

//   // tell ScrollTrigger to use these proxy methods for the "" element since Locomotive Scroll is hijacking things
//   ScrollTrigger.scrollerProxy("#main", {
//     scrollTop(value) {
//       return arguments.length
//         ? locoScroll.scrollTo(value, 0, 0)
//         : locoScroll.scroll.instance.scroll.y;
//     }, // we don't have to define a scrollLeft because we're only scrolling vertically.
//     getBoundingClientRect() {
//       return {
//         top: 0,
//         left: 0,
//         width: window.innerWidth,
//         height: window.innerHeight,
//       };
//     },
//     // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
//     pinType: document.querySelector("#main").style.transform
//       ? "transform"
//       : "fixed",
//   });

 

  
//   // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
//   ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

//   // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
//   ScrollTrigger.refresh();

// }

// locomotiveAnimation();

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

icon.addEventListener("click", (event) => {
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

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector("#ic img");
  const homeSection = document.querySelector(".pg"); // Observing Page 1 (Home)

  // Ensure the logo and home section elements exist
  if (!logo) {
      console.error("Logo element not found!");
      return;
  }

  if (!homeSection) {
      console.error("Home section (.page1) element not found!");
      return;
  }

  // Define observer options
  const observerOptions = {
      root: null, // Observes relative to the viewport
      threshold: .1 // 10% of the home section is visible
  };

  // Callback function to execute when intersection changes
  const observerCallback = (entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              console.log("Home section is in view. Switching to logo-large.");
              logo.classList.remove("logo-large");
              logo.classList.add("logo-small");
          } else {
              console.log("Home section is out of view. Switching to logo-small.");
              logo.classList.remove("logo-small");
              logo.classList.add("logo-large");
          }
      });
  };

  // Create the IntersectionObserver instance
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Start observing the home section
  observer.observe(homeSection);
});

  // Attach the scroll event listener
  // window.addEventListener("scroll", handleLogoResize);

  // // Call the function on page load to set the correct logo size
  // handleLogoResize();






  gsap.registerPlugin(ScrollTrigger);

  function zigZagAnimation() {
    gsap.from("#zig-element", {
      y: (i) => (i % 2 === 0 ? -100 : 100), // Zigzag based on index
      opacity: 0,
      duration: 1,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#zig-element",
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  
  function initPageAnimations() {
    zigZagAnimation();
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
    





