<main>
  <div class="container vertical_center">
    <h1>Register</h1>
    <br><br>
    <form class="register" action="database" method="post" autocomplete="off">
      <input type="hidden" name="command_type" value="register">
      <input type="text" name="member_id" placeholder="아이디" class="input_text" required autofocus>
      <br>
      <input type="password" name="member_pw" placeholder="비밀번호" class="input_text" required>
      <br>
      <input type="password" name="member_pw_check" placeholder="비밀번호 재입력" class="input_text" required>
      <br>
      <input type="text" name="member_nickname" placeholder="닉네임" class="input_text" required>
      <br>
      <input type="text" name="code" placeholder="확인 코드" class="input_text" required>
      <br><br>
      <input type="hidden" name="returnUrl" value="<?php echo $returnUrl ?>">
      <a href="/login?returnUrl=<?php echo $returnUrl ?>" class="button">로그인 페이지</a>
      <input type="submit" name="" value="가입하기" class="button">
    </form>
    <br>
  </div>
</main>
<div class="dim menu_close"></div>
<title>회원가입</title>
<meta property="og:title" content="회원가입">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 관리 서비스">