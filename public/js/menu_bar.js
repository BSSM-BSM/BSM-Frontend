$(document).ready(function(){
  var header = 0;
  if($(this).scrollTop()>header){
    $('header').addClass('on');
  }else{
    $('header').removeClass('on');
  }
  $('main').scroll(function() {
    if($(this).scrollTop()>header){
      $('header').addClass('on');
    }else{
      $('header').removeClass('on');
    }
  });
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
    $(".searchResult").removeClass("on");
    $(".dim").removeClass("on");
  });
  $(".searchBox").on("click",function(){
    if ($(".searchResult").attr("class").indexOf("on") > 1) {
      $(".searchResult").removeClass("on");
      $(".dim").removeClass("on");
    } else {
      $(".searchResult").addClass("on");
      $(".dim").addClass("on");
    }
  });
});
