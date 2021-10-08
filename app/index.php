<?php
  require_once "$_SERVER[DOCUMENT_ROOT]/session.php";
  if (isset($_GET['page']))
    $page = $_GET['page'];
  else 
    $page = 'index';
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
      case 'post_write' ?>
      <link rel="stylesheet" type="text/css" href="/css/etc/board.css">
      <?php break;
      }
    ?>
    <!--모바일 css-->
    <link rel="stylesheet" media="screen and (min-width:0px) and (max-width:1319px)" href="/css/mobile.css">
    <style media="screen and (min-width:651px) and (max-width:1319px)">.video, .video div{width:540px;}</style>
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
          if($_GET['boardType']=='blog'&&$_SESSION['member_code']!=1){
            echo "<script>alert('정상적인 접근이 아닙니다.');window.close();</script>";
            exit();
          }else{
            require "./pages/post_write.php";
          }
        }
        break;
      }
    ?>
  </body>
</html>
