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
});
