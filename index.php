<?php
  require_once "session.php";
  if (!isset($page)) 
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
    <link rel="manifest" href="/manifest.json">
    <script src="/sw.js"></script>
    <!-- 서비스 워커를 등록 -->
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('서비스 워커가 등록됨.', reg);
        });
      }
    </script>
    <!-- PWA 설정 끝 -->
    <link rel="stylesheet" type="text/css" href="/css/style.min.css">
    <!--모바일 css-->
    <?php
    switch ($page) {
      case 'timetable': ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/time.css">
        <?php break;
      case 'meal' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/food.css">
        <?php break;
      case 'minecraft' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/minecraft.css">
        <?php break;
      case 'board' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/board.css">
        <?php break;
      case 'post_write' ?>
        <link rel="stylesheet" type="text/css" href="/css/etc/board.css">
        <?php break;
      }
    ?>
    <link rel="stylesheet" media="screen and (min-width:0px) and (max-width:1319px)" href="/css/mobile.css">
    <style media="screen and (min-width:651px) and (max-width:1319px)">.video, .video div{width:540px;}</style>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/menu_bar.js"></script>
    <script src="/js/search.js"></script>
    <script src="/js/error_code.js"></script>
    <script>
      window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
      var refresh = true;
      var db_url = '/database';
      const memberLevel=[
        '',
        '<span class="member_admin">[룸메]</span> ',
        '<span class="member_admin">[교사]</span> ',
        '<span class="member_admin">[관리자]</span> '
      ]
      <?php
      $memberLevel=[
        '',
        '<span class="member_admin">[룸메]</span> ',
        '<span class="member_admin">[교사]</span> ',
        '<span class="member_admin">[관리자]</span> '
      ];
      ?>
    </script>
  </head>
  <body>
    <div class="overlay-fadein"></div>
    <header>
      <nav>
        <div class="top_menu">
          <div class="left_wrap">
            <span class="top_menu_item home"><a href="/"><img src="/icons/logo.png" alt="로고"></a></span>
            <span class="top_menu_item all_menu">
              <span class="line_wrap">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
              </span>
            </span>
            <span class="top_menu_item dropdown_menu">
              <span class="page">학교</span>
              <ul class="dropdown_content">
                <li><a href="/timetable">시간표</a></li>
                <li><a href="/meister">마이스터 상벌점</a></li>
                <li><a href="https://school.busanedu.net/bssm-h/main.do">학교 홈페이지</a></li>
              </ul>
            </span>
            <span class="top_menu_item dropdown_menu">
              <span class="page">생활</span>
              <ul class="dropdown_content">
                <li><a href="/meal">급식</a></li>
                <li><a href="/songs">기상송 모음</a></li>
                <li><a href="/dorm_rule">기숙사 규정</a></li>
              </ul>
            </span>
            <span class="top_menu_item dropdown_menu">
              <span class="page">커뮤니티</span>
              <ul class="dropdown_content">
                <li><a href="/board/board">자유게시판</a></li>
                <li><a href="/board/anonymous">익명게시판</a></li>
              </ul>
            </span>
            <span class="top_menu_item"><a href="https://github.com/leehj050211/BSM-Frontend" class="page">깃허브</a></span>
            <span class="top_menu_item"><a href="/minecraft" class="page">마크 서버</a></span>
          </div>
          <div class="right_wrap">
            <span class="searchBar top_menu_item">
              <input type="text" class="searchQuery input_text searchBox" oninput="search()" onchange='$(".searchResult").addClass("on");$(".dim").addClass("on");' placeholder="여기에 검색" required>
              <div class="searchResult">
                <div class="boardResult"></div>
                <br>
                <div class="blogResult"></div>
              </div>
            </span>
            <?php
              if (isset($_SESSION['member_id'])){ ?>
                <span class="top_menu_item dropdown_menu user_menu">
                  <span class="page user_profile_name">
                    <?php echo $memberLevel[$_SESSION['member_level']].$_SESSION['member_id']?>
                  </span>
                  <img src="/resource/member/profile_images/profile_<?php echo $_SESSION['member_code']?>.png" onerror="this.src='/resource/member/profile_images/profile_default.png'" alt="" class="user_profile">
                  <ul class="dropdown_content">
                    <li><a href="/memberinfo/<?php echo $_SESSION['member_code']?>">유저 정보</a></li>
                    <li><a href="/logout?returnUrl=<?php echo $returnUrl ?>">로그아웃</a></li>
                  </ul>
                </span>
              <?php }else{ ?>
                <span class="top_menu_item user_menu"><a onclick="$('.login_box').addClass('on');" class="page">로그인</a></span>
              <?php }
            ?>
          </div>
        </div>
        <div class="notice_bar">
          <script>
            var agent = navigator.userAgent.toLowerCase();
            if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
              document.write('<div class="notice warning">현재 사용하시는 브라우저는 정상적으로 지원되지 않습니다</div>');
            }
          </script>
          <div class="notice warning">사이트 디자인 개편 중이므로 서비스 이용이 불안정 할 수 있습니다.</div>
        </div>
      </nav>
      <div class="side_menu">
        <ul>
          <li class="home"><a href="/"><img src="/icons/logo.png" alt="로고"></a></li>
          <?php
          if (isset($_SESSION['member_id'])){ ?>
          <li class="user_menu"><a href="/memberinfo/<?php echo $_SESSION['member_code']?>"><?php echo $memberLevel[$_SESSION['member_level']].$_SESSION['member_id']?></a></li>
          <li class="logout"><a href="/logout?returnUrl=<?php echo $returnUrl ?>">로그아웃</a></li>
          <?php }else{ ?>
          <li class="user_menu"><a onclick="$('.login_box').addClass('on');">로그인해 주세요</a></li>
          <?php }
          ?>
          <li class="page"><a href="/timetable">시간표</a></li>
          <li class="page"><a href="/meal">급식</a></li>
          <li class="page"><a href="/meister">마이스터 상벌점</a></li>
          <li class="page"><a href="/board/board">자유게시판</a></li>
          <li class="page"><a href="/board/anonymous">익명게시판</a></li>
          <li class="page"><a href="/songs">기상송 모음</a></li>
          <li class="page"><a href="/dorm_rule">기숙사 규정</a></li>
          <li class="page"><a href="https://school.busanedu.net/bssm-h/main.do">학교 홈페이지</a></li>
          <li class="page"><a href="https://github.com/leehj050211/BSM-Frontend">깃허브</a></li>
          <li class="page"><a href="/minecraft">마크 서버</a></li>
        </ul>
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
      case 'timetable':
        require "./pages/timetable.html";
        break;
      case 'meal':
        require "./pages/meal.html";
        break;
      case 'meister':
        require "./pages/meister.html";
        break;
      case 'dorm_rule':
        require "./pages/dorm_rule.html";
        break;
      case 'remote':
        require "./pages/remote.html";
        break;
      case 'minecraft':
        require "./pages/minecraft.html";
        break;
      case 'board':
        require "./pages/board.php";
        break;
      case 'post_write':
        if(!isset($_SESSION['member_code'])){
          echo "<script>alert('로그인 해주세요.');history.go(-1);</script>";
          exit();
        }else{
          require "./pages/post_write.php";
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
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              if(refresh){
                window.location.href=data.returnUrl;
              }else{
                alert("로그인에 성공하였습니다.");
                $('.login_box').removeClass('on');
              }
            }
          },
          error: function(data) {
            error_code(0);
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
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("회원가입이 완료되었습니다.\n다시 로그인 해주세요.");
              $('.register_box').removeClass('on');
            }
          },
          error: function(data) {
            error_code(0);
          }
        });
      }
      function pw_reset(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'reset_pw',
            reset_member_pw:$('.pw_reset .reset_member_pw').val(),
            reset_member_pw_check:$('.pw_reset .reset_member_pw_check').val(),
          },
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("비밀번호 재설정이 완료되었습니다.\n다시 로그인 해주세요.");
              $('.pw_reset_box').removeClass('on');
            }
          },
          error: function(data) {
            error_code(0);
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
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("인증이 완료되었습니다.\n다시 로그인 해주세요.");
              $('.authentication_box').removeClass('on');
            }
          },
          error: function(data) {
            error_code(0);
          }
        });
      }
      function valid_code(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'valid_code',
            student_enrolled:$('.valid_code .studentEnrolled').val(),
            student_grade:$('.valid_code .studentGrade').val(),
            student_class:$('.valid_code .studentClass').val(),
            student_no:$('.valid_code .studentNo').val(),
            student_name:$('.valid_code .studentName').val(),
          },
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("인증코드 전송이 완료되었습니다.\n메일함을 확인해주세요.");
              $('.valid_code_box').removeClass('on');
            }
          },
          error: function(data) {
            error_code(0);
          }
        });
      }
    </script>
    <div class="login_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>로그인</h2>
      <br><br>
      <form class="login" method="post" autocomplete="off" onsubmit="login();return false;">
        <input type="text" class="member_id" placeholder="아이디" class="input_text" required autofocus>
        <br>
        <input type="password" class="member_pw" placeholder="비밀번호" class="input_text" required>
        <br><br>
        <div class="button" onClick="$('.login_box').removeClass('on');">닫기</div>
        <div class="button" onClick="$('.register_box').addClass('on');">회원가입</div>
        <button type="submit" class="button">로그인</button>
      </form>
    </div>
    <div class="register_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>회원가입</h2>
      <br>
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
        <div class="button" onClick="$('.valid_code_box').addClass('on');">인증코드 발급</div>
        <button type="submit" class="button">가입하기</button>
      </form>
    </div>
    <div class="pw_reset_box popup center">
      <h2>비밀번호 재설정이 필요합니다</h2>
      <br>
      <form class="pw_reset" method="post" autocomplete="off" onsubmit="pw_reset();return false;">
        <input type="password" class="reset_member_pw" placeholder="재설정할 비밀번호" required>
        <br>
        <input type="password" class="reset_member_pw_check" placeholder="재설정할 비밀번호 재입력" required>
        <br><br>
        <button type="submit" class="button">비밀번호 재설정</button>
      </form>
    </div>
    <div class="authentication_box popup center">
      <div class="logo"><img src="/icons/logo.png" alt="로고"></div>
      <h2>인증코드 활성화가 필요합니다</h2>
      <p>인증코드는 관리자에게 문의하시면 발급해 드립니다.</p>
      <form class="authentication" method="post" autocomplete="off" onsubmit="authentication();return false;">
        <input type="text" class="code" placeholder="인증코드" class="input_text" required autofocus>
        <br><br>
        <div class="button" onClick="$('.valid_code_box').addClass('on');$('.login_box').removeClass('on');">인증코드 발급</div>
        <button type="submit" class="button">계정 인증</button>
      </form>
    </div>
    <div class="valid_code_box popup center">
      <h2>인증코드 발급</h2>
      <p>인증코드는 학교 이메일계정으로 보내드립니다.</p>
      <br>
      <form class="valid_code" method="post" autocomplete="off" onsubmit="valid_code();return false;">
        <input type="number" class="studentEnrolled" placeholder="입학년도" min="2021" max="2099" required>  
        <input type="number" class="studentGrade" placeholder="학년" min="1" max="3" required>
        <input type="number" class="studentClass" placeholder="반" min="1" max="4" required>
        <input type="number" class="studentNo" placeholder="번호" min="1" max="16" required>
        <br>
        <input type="text" class="studentName" placeholder="이름" required>
        <br><br>
        <div class="button" onClick="$('.valid_code_box').removeClass('on');">닫기</div>
        <button type="submit" class="button">인증코드 발급</button>
      </form>
    </div>
  </body>
</html>
