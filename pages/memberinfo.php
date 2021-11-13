<?php
$member_code=getParam(2);
?>
<main>
  <div class="title">
    <h1>유저 정보</h1>
  </div>
  <div class="container">
    <div class="information">
      <div class="member_info_wrap">
        <div class="left_wrap"></div>
        <div class="right_wrap">
        <div class="top_wrap">
          <span class="member_nickname"></span>
          <span class="member_created"></span>
        </div>
        <div class="bottom_wrap">
          <span class="student_info"></span>
          <span class="member_level"></span>
          <span class="member_enrolled"></span>
          <span class="member_code"></div>
        </div>
      </div>
      <br>
      <script>
        function member_info(){
          $.ajax({
            type:'POST',
            data:{
              command_type:'member',
              member_code:'<?php echo $member_code ?>',
            },
            url:db_url,
            cache:false,
            success:function(data){
              data=JSON.parse(data);
              if(data.status!=1){
                error_code(data.status);
              }else{
                $('.member_info_wrap .left_wrap').html(`<img src="/resource/member/profile_images/profile_`+data.member_code+`.png" onerror="this.src='/resource/member/profile_images/profile_default.png'" alt="" class="user_profile">`);
                $('.member_nickname').text(data.member_nickname);
                $('.member_code').text("멤버 코드: "+data.member_code);
                $('.member_level').text("권한 수준: "+data.member_level);
                $('.member_created').text(data.member_created.split(' ')[0]+" 가입");
                $('.member_enrolled').text(data.member_enrolled+"년 입학");
                $('.student_info').text(data.member_grade+"학년 "+data.member_class+"반 "+data.member_studentNo+"번 "+data.member_name);
              }
            },
            error: function(data) {
              error_code(0);
            }
          });
        }
        member_info();
      </script>
    <?php
      if(isset($_SESSION['member_code'])){
        if($member_code==$_SESSION['member_code']){ ?>
          <form class="profile_upload" method="post" autocomplete="off" enctype="multipart/form-data" action="javascript://" onsubmit="profile_upload();return false;">
            <input type="file" name="file" required>
            <button type="submit" class="button">프로필 이미지 업로드</button>
          </form>
          <div class="button" onClick="$('.pw_modify_box').trigger('addClass');">비밀번호 변경</div>
        <?php
        }
      }
    ?>
    </div>
    <script>
      function profile_upload(){
        var form = $('.profile_upload')[0];
        var formData = new FormData(form);
        formData.append("file", $(".profile_upload input[name=file]")[0].files[0]);
        $.ajax({
          type:'POST',
          data:formData,
          url:'/profile_upload.php',
          cache:false,
          processData:false,
          contentType:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("업로드에 성공하였습니다.");
              window.location.reload();
            }
          },
          error: function(data) {
            error_code(0);
          }
        });
      }
      function pw_modify(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'modify',
            modify_type:'pw',
            member_pw:$('.pw_modify .member_pw').val(),
            modify_member_pw:$('.pw_modify .modify_member_pw').val(),
            modify_member_pw_check:$('.pw_modify .modify_member_pw_check').val(),
          },
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              alert("비밀번호 수정이 완료되었습니다.\n다시 로그인 해주세요.");
              window.location.href=data.returnUrl;
            }
          },
          error: function(data) {
            error_code(0);
          }
        });
      }
    </script>
    <br>
  </div>
  <div class="pw_modify_box popup center">
    <h2>비밀번호 수정</h2>
    <br>
    <form class="pw_modify" method="post" autocomplete="off" onsubmit="pw_modify();return false;">
      <input type="password" class="member_pw" placeholder="현재 비밀번호" required autofocus>
      <br>
      <input type="password" class="modify_member_pw" placeholder="수정할 비밀번호" required>
      <br>
      <input type="password" class="modify_member_pw_check" placeholder="수정할 비밀번호 재입력" required>
      <br><br>
      <div class="button" onClick="$('.pw_modify_box').trigger('removeClass');">닫기</div>
      <button type="submit" class="button">비밀번호 수정</button>
    </form>
  </div>
</main>
<title>유저정보 - BSM</title>
<meta property="title" content="유저정보 - BSM | 부산소마고 지원 서비스">
<meta property="description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">
<meta property="og:title" content="유저정보 - BSM | 부산소마고 지원 서비스">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">