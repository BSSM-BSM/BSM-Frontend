$(document).ready(function(){
  var header = 75;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
    if(scroll>=header){
      $('.top_menu').addClass('on');
    }else{
      $('.top_menu').removeClass('on');
    }
  });
  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
  $(".all_menu").on("click",function(){
    if ($(".side_menu").attr("class").indexOf("on") > 1) {
      $(".all_menu").removeClass("on");
      $(".side_menu").removeClass("on");
      $(".dim").removeClass("on");
    } else {
      $(".all_menu").addClass("on");
      $(".side_menu").addClass("on");
      $(".dim").addClass("on");
    }
  });
  $(".menu_close").on("click",function(){
    $(".all_menu").removeClass("on");
    $(".side_menu").removeClass("on");
    $(".dim").removeClass("on");
  });
});
