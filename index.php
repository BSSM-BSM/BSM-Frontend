<?php
  require_once "session.php";
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
    <meta name="theme-color" content="#333"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- PWA 설정 시작 -->
    <!-- 주소창 등의 웹 브라우저 UI를 표시하지 않기 -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <!-- 상태 바의 스타일을 지정 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <!-- 홈 화면에서 표시되는 앱 이름을 지정 -->
    <meta name="apple-mobile-web-app-title" content="Timer">
    <!-- 홈 화면에서 표시되는 앱 아이콘을 지정 -->
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
    <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">
    <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png">
    <!-- 웹 앱 매니페스트를 읽어 들이기 -->
    <link rel="manifest" href="manifest.json">
    <script src="/sw.js"></script>
    <!-- 서비스 워커를 등록 -->
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('서비스 워커가 등록됨.', reg);
        });
      }
    </script>
    <!-- PWA 설정 끝 -->
    <link rel="stylesheet" type="text/css" href="/css/style.min.css">
    <!--모바일 css-->
    <link rel="stylesheet" media="screen and (min-width:0px) and (max-width:1319px)" href="/css/mobile.css">
    <style media="screen and (min-width:651px) and (max-width:1319px)">.video, .video div{width:540px;}</style>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/menu_bar.js"></script>
    <script src="/js/search.js"></script>
    <script src="/js/ajax_error.js"></script>
    <script>
      window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    </script>
  </head>
  <body>
    <div class="overlay-fadein"></div>
    <header>
      <nav>
        <div class="top_menu">
          <span class="home"><a href="/"><img src="/icons/logo.png" alt="로고"></a></span>
          <span class="all_menu">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </span>
          <span class="dropdown_menu">
            <span class="page">학교</span>
            <ul class="dropdown_content">
              <li><a href="/time">시간표</a></li>
              <li><a href="/calendar">학사일정</a></li>
              <li><a href="/best_teacher">인기 교직원</a></li>
            </ul>
          </span>
          <span class="dropdown_menu">
            <span class="page">생활</span>
            <ul class="dropdown_content">
              <li><a href="/food">급식</a></li>
              <li><a href="/song">신청곡</a></li>
              <li><a href="/goodbed">상벌점</a></li>
              <li><a href="/dorm_rule">기숙사 규정</a></li>
            </ul>
          </span>
          <span class="dropdown_menu">
            <span class="page">커뮤니티</span>
            <ul class="dropdown_content">
              <li><a href="/board?boardType=board">자유게시판</a></li>
              <li><a href="/board?boardType=blog">블로그</a></li>
            </ul>
          </span>
          <span class="page"><a href="/minecraft">마크 서버</a></span>
          <?php
            if (isset($_SESSION['member_id'])){ ?>
              <span class="dropdown_menu user_menu">
                <span class="page"><?php if($_SESSION['member_level']==2)echo '관리자 '; echo $_SESSION['member_id']?></span>
                <ul class="dropdown_content">
                  <li><a href="/memberinfo?member_code=<?php echo $_SESSION['member_code']?>">유저 정보</a></li>
                  <li><a href="/logout?returnUrl=<?php echo $returnUrl ?>">로그아웃</a></li>
                </ul>
              </span>
            <?php }else{ ?>
              <span class="page user_menu"><a onclick="$('.login_box').addClass('on');">로그인</a></span>
            <?php }
          ?>
          <span class="searchBar">
            <input type="text" class="searchQuery input_text searchBox" onchange='search();$(".searchResult").addClass("on");$(".dim").addClass("on");' placeholder="검색할 내용 입력" required>
            <div class="searchResult">
              <div class="boardResult"></div>
              <br>
              <div class="blogResult"></div>
            </div>
          </span>
        </div>
      </nav>
      <div class="side_menu">
        <ul>
          <li class="home"><a href="/"><img src="/icons/logo.png" alt="로고"></a></li>
          <?php
          if (isset($_SESSION['member_id'])){ ?>
          <li class="user_menu"><a href="/memberinfo?member_code=<?php echo $_SESSION['member_code']?>"><?php if($_SESSION['member_level']==2)echo '관리자 '; echo $_SESSION['member_id']?></a></li>
          <li class="logout"><a href="/logout?returnUrl=<?php echo $returnUrl ?>">로그아웃</a></li>
          <?php }else{ ?>
          <li class="user_menu"><a onclick="$('.login_box').addClass('on');">로그인해 주세요</a></li>
          <?php }
          ?>
          <li class="page"><a href="/time">시간표</a></li>
          <li class="page"><a href="/food">급식</a></li>
          <li class="page"><a href="/board?boardType=board">커뮤니티</a></li>
          <li class="page"><a href="/board?boardType=blog">블로그</a></li>
          <li class="page"><a href="/minecraft">마크 서버</a></li>
          <li class="page"><a href="/song">신청곡</a></li>
          <li class="page"><a href="/calendar">학사일정</a></li>
          <li class="page"><a href="/best_teacher">인기 교직원</a></li>
          <li class="page"><a href="/goodbed">상벌점</a></li>
        </ul>
      </div>
      <div class="alert">
        <div>
          <script>
            var agent = navigator.userAgent.toLowerCase();
            if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
              document.write("<li>현재 사용하시는 브라우저는 정상적으로 지원되지 않습니다</li>");
            }
          </script>
        </div>
        <div></div>
      </div>
    </header>
    <?php
    switch ($page) {
      case '403':
        require "./pages/403.html";
        break;
      case '404':
        require "./pages/404.html";
        break;
      default:
        require "./pages/404.html";
        break;
      case 'index':
        require "./pages/index.html";
        break;
      case 'memberinfo':
        require "./pages/memberinfo.php";
        break;
      case 'search':
        require "./pages/search.html";
        break;
      case 'blog':
        require "./pages/blog.php";
        break;
      case 'time':
        require "./pages/time.html";
        break;
      case 'food':
        require "./pages/food.html";
        break;
      case 'bssm':
        require "./pages/bssm.html";
        break;
      case 'remote':
        require "./pages/remote.html";
        break;
      case 'patch':
        require "./pages/patch.html";
        break;
      case 'game':
        require "./pages/game.html";
        break;
      case 'minecraft':
        require "./pages/minecraft.html";
        break;
      case 'board':
        require "./pages/board.php";
        break;
      case 'post_write':
        if(!isset($_SESSION['member_code'])){
          echo "<script>alert('로그인 해주세요.');</script>";
          echo "<meta http-equiv='refresh' content='0; url=/login?returnUrl=$returnUrl'></meta>";
          exit();
        }else{
          if($_GET['boardType']=='blog'&&$_SESSION['member_code']!=1){
            echo "<script>alert('정상적인 접근이 아닙니다.');history.go(-1);</script>";
            exit();
          }else{
            require "./pages/post_write.php";
          }
        }
        break;
      }
    ?>
    <script>
      function login(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'login',
            returnUrl:'<?php echo $returnUrl ?>',
            member_id:$('.login .member_id').val(),
            member_pw:$('.login .member_pw').val(),
          },
          url:'database',
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              ajax_error(data.status);
            }else{
              window.location.href=data.returnUrl;
            }
          }
        });
      }
      function register(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'register',
            member_id:$('.register .member_id').val(),
            member_pw:$('.register .member_pw').val(),
            member_pw_check:$('.register .member_pw_check').val(),
            member_nickname:$('.register .member_nickname').val(),
            code:$('.register .code').val(),
          },
          url:'database',
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              ajax_error(data.status);
            }else{
              alert("회원가입이 완료되었습니다.\n다시 로그인 해주세요.");
              $('.register_box').removeClass('on');
            }
          }
        });
      }
      function authentication(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'authentication',
            code:$('.authentication .code').val(),
          },
          url:'database',
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              ajax_error(data.status);
            }else{
              alert("인증이 완료되었습니다.\n다시 로그인 해주세요.");
              $('.authentication_box').removeClass('on');
            }
          }
        });
      }
    </script>
    <div class="login_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>로그인</h2>
      <br>
      <form class="login" method="post" autocomplete="off" onsubmit="login();return false;">
        <input type="text" class="member_id" placeholder="아이디" class="input_text" required autofocus>
        <br>
        <input type="password" class="member_pw" placeholder="비밀번호" class="input_text" required>
        <br><br>
        <div class="button" onClick="$('.login_box').removeClass('on');">닫기</div>
        <div class="button" onClick="$('.register_box').addClass('on');">회원가입</div>
        <button type="submit" onclick="" class="button">로그인</button>
      </form>
    </div>
    <div class="register_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>회원가입</h2>
      <p>인증코드는 관리자에게 문의하시면 발급해 드립니다.</p>
      <form class="register" method="post" autocomplete="off" onsubmit="register();return false;">
        <input type="text" class="member_id" placeholder="아이디" class="input_text" required autofocus>
        <br>
        <input type="password" class="member_pw" placeholder="비밀번호" class="input_text" required>
        <br>
        <input type="password" class="member_pw_check" placeholder="비밀번호 재입력" class="input_text" required>
        <br>
        <input type="text" class="member_nickname" placeholder="닉네임" class="input_text" required>
        <br>
        <input type="text" class="code" placeholder="인증코드" class="input_text" required autofocus>
        <br><br>
        <div class="button" onClick="$('.register_box').removeClass('on');">닫기</div>
        <button type="submit" class="button">가입하기</button>
      </form>
    </div>
    <div class="authentication_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>인증코드 활성화가 필요합니다</h2>
      <p>인증코드는 관리자에게 문의하시면 발급해 드립니다.</p>
      <form class="authentication" method="post" autocomplete="off" onsubmit="authentication();return false;">
        <input type="text" class="code" placeholder="인증코드" class="input_text" required autofocus>
        <br><br>
        <button type="submit" class="button">계정 인증</button>
      </form>
    </div>
  </body>
</html>
