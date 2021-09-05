<main>
  <div class="container vertical_center">
    <h1>Login</h1>
    <br><br>
    <form class="login" method="post" autocomplete="off" onsubmit="return false;">
      <input type="text" class="member_id" placeholder="아이디" class="input_text" required autofocus>
      <br>
      <input type="password" class="member_pw" placeholder="비밀번호" class="input_text" required>
      <br><br>
      <div class="button" onClick="$('.register_box').addClass('on');">회원가입</div>
      <button type="submit" onclick="login();" class="button">로그인</button>
    </form>
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
    <br>
  </div>
  <div class="register_box popup center">
    <h2>회원가입</h2>
    <p>인증코드는 관리자에게 문의하시면 발급해 드립니다.</p>
    <form class="register" method="post" autocomplete="off" onsubmit="return false;">
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
      <button type="submit" onclick="register();" class="button">가입하기</button>
    </form>
  </div>
  <div class="authentication_box popup center">
    <h2>인증코드 활성화가 필요합니다</h2>
    <p>인증코드는 관리자에게 문의하시면 발급해 드립니다.</p>
    <form class="authentication" method="post" autocomplete="off" onsubmit="return false;">
      <input type="text" class="code" placeholder="인증코드" class="input_text" required autofocus>
      <br><br>
      <button type="submit" onclick="authentication();" class="button">계정 인증</button>
    </form>
  </div>
</main>
<div class="dim menu_close"></div>
<title>로그인</title>
<meta property="og:title" content="Login">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 관리 서비스">