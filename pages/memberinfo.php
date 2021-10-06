<main>
  <div class="container">
    <div class="title">
      <h1>유저 정보</h1>
    </div>
    <div class="information blur">
      <div class="member_code"></div>
      <div class="member_id"></div>
      <div class="member_nickname"></div>
      <div class="member_level"></div>
      <div class="member_created"></div>
      <div class="member_enrolled"></div>
      <span class="member_grade"></span>
      <span class="member_class"></span>
      <span class="member_studentNo"></span>
      <span class="member_name"></span>
      <br>
      <script>
        function member_info(){
          $.ajax({
            type:'POST',
            data:{
              command_type:'member',
              member_code:'<?php echo $_GET['member_code'] ?>',
            },
            url:'database',
            cache:false,
            success:function(data){
              data=JSON.parse(data);
              if(data.status!=1){
                ajax_error(data.status);
              }else{
                $('.member_code').text("멤버 코드: "+data.member_code);
                $('.member_nickname').text("닉네임: "+data.member_nickname);
                $('.member_level').text("권한 수준: "+data.member_level);
                $('.member_created').text(data.member_created.split(' ')[0]+" 가입");
                $('.member_enrolled').text(data.member_enrolled+"년 입학");
                $('.member_grade').text(data.member_grade+"학년");
                $('.member_class').text(data.member_class+"반");
                $('.member_studentNo').text(data.member_studentNo+"번");
                $('.member_name').text(data.member_name);
              }
            }
          });
        }
        member_info();
      </script>
    <?php
      if(isset($_SESSION['member_code'])){
        if($_GET['member_code']==$_SESSION['member_code']){ ?>
          <div class="button" onClick="$('.pw_modify_box').addClass('on');">비밀번호 변경</div>
        <?php
        }
      }
    ?>
    </div>
    <script>
      function pw_modify(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'modify',
            modify_type:'pw',
            member_pw:$('.pw_modify .member_pw').val(),
            modifymember_pw:$('.pw_modify .modifymember_pw').val(),
            modifymember_pw_check:$('.pw_modify .modifymember_pw_check').val(),
          },
          url:'database',
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              ajax_error(data.status);
            }else{
              alert("비밀번호 수정이 완료되었습니다.\n다시 로그인 해주세요.");
              window.location.href=data.returnUrl;
            }
          }
        });
      }
    </script>
    <br>
  </div>
  <div class="pw_modify_box popup center">
    <h2>비밀번호 수정</h2>
    <br>
    <form class="pw_modify" method="post" autocomplete="off" onsubmit="return false;">
      <input type="password" class="member_pw" placeholder="현재 비밀번호" required autofocus>
      <br>
      <input type="password" class="modifymember_pw" placeholder="수정할 비밀번호" required>
      <br>
      <input type="password" class="modifymember_pw_check" placeholder="수정할 비밀번호 재입력" required>
      <br><br>
      <div class="button" onClick="$('.pw_modify_box').removeClass('on');">닫기</div>
      <button type="submit" onclick="pw_modify();" class="button">비밀번호 수정</button>
    </form>
  </div>
</main>
<div class="dim menu_close"></div>
<title>유저정보 - BSM</title>
<meta property="title" content="유저정보 - BSM | 부산소마고 지원 서비스">
<meta property="description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">
<meta property="og:title" content="유저정보 - BSM | 부산소마고 지원 서비스">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">