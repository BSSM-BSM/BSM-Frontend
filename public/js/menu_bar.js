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
  $(".search_close").on("click",function(){
    $(".searchResult").removeClass("on");
    $(".dim.search_close").removeClass("on");
  });
  $(".searchBox").on("click",function(){
    $(".searchResult").toggleClass("on");
    $(".dim.search_close").toggleClass("on");
  });
  $(".popup_close").on("click",function(){
    $(".popup").trigger('removeClass');
    $(".dim.popup_close").removeClass("on");
  });
  $(".popup").on('addClass', function() {
    $(this).addClass("on").trigger('classChange');
  });
  $(".popup").on('removeClass', function() {
    $(this).removeClass("on").trigger('classChange');
  });
  $(".popup").on('classChange', function() {
    if($(".popup").hasClass("on")===true){
      $(".dim.popup_close").addClass("on")
    }else{
      $(".dim.popup_close").removeClass("on")
    } 
  });
});
