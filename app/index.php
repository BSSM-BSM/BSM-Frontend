<?php
  require_once "$root_dir/session.php";
  if(isset($_GET['returnUrl'])){
    $returnUrl = $_GET['returnUrl'];
  }else{
    $returnUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
  }
?>
<!DOCTYPE HTML>
<html lang="kr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/css/style.min.css">
    <?php
    switch ($page) {
      case 'timetable': ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/time.css">
        <?php break;
      case 'meal' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/food.css">
        <?php break;
      case 'meister' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/meister.css">
        <?php break;
      case 'post_write' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/board.css">
        <?php break;
      }
    ?>
    <!--모바일 css-->
    <link rel="stylesheet" media="screen and (min-width:0px) and (max-width:1319px)" href="/css/mobile.css">
    <style media="screen and (min-width:651px) and (max-width:1319px)">.video, .video div{width:540px;}</style>
    <style>
      .container{
        padding:0 0 5rem 0;
      }
    </style>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/error_code.js"></script>
    <script>
      var db_url = '/database';
    </script>
  </head>
  <body>
    <?php
    switch ($page) {
      case 'post_write':
        if(!isset($_SESSION['member_code'])){
          echo "<script>alert('로그인 해주세요.');window.close();</script>";
          exit();
        }else{
          require "$root_dir/app/pages/post_write.php";
        }
        break;
      case 'meal':
        require "$root_dir/app/pages/meal.html";
        break;
      case 'timetable':
        require "$root_dir/app/pages/timetable.html";
        break;
      case 'meister':
        require "$root_dir/app/pages/meister.html";
        break;
      case 'os-ppt':
        require "$root_dir/app/pages/os-ppt.html";
        break;
      }
    ?>
  </body>
</html>
