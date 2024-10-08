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