<main>
  <div class="container vertical_center">
    <h1>Login</h1>
    <br><br>
    <form class="login" action="database" method="post" autocomplete="off">
      <input type="hidden" name="command_type" value="login">
      <input type="text" name="member_id" placeholder="아이디" class="input_text" required autofocus>
      <br>
      <input type="password" name="member_pw" placeholder="비밀번호" class="input_text" required>
      <br><br>
      <input type="hidden" name="returnUrl" value="<?php echo $returnUrl ?>">
      <a href="/register?returnUrl=<?php echo $returnUrl ?>" class="button">회원가입</a>
      <input type="submit" name="" value="로그인" class="button">
    </form>
    <br>
  </div>
</main>
<div class="dim menu_close"></div>
<title>로그인</title>
<meta property="og:title" content="Login">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 관리 서비스">