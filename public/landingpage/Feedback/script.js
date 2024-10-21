$(".form").on("click", function () {
    $(this).addClass("active");
  });
  
  $(".submit").on("click", function () {
    $(this).parent().parent().hide(300);
    $(".ok_message").addClass("active");
  });
  
  $(".ok_message").on("click", function () {
    $(this).removeClass("active");
    $(".form").removeClass("active").show();
  });

  function loadingAnimation2() {
    gsap.from(".headi", {
        x: -400,
        delay: 0.5,
        duration: 0.7,
    });
    gsap.from("#anu", {
        y: -100,
        delay: 0.5,
        duration: 0.7,
    });
}
loadingAnimation2();
  