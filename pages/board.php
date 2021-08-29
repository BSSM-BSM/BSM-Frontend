<main>
  <div class="container">
    <div class="title">
        <?php
        switch ($_GET['boardType']){
          case 'board':
            echo '<h1>커뮤니티</h1>';
            break;
          case 'blog':
            echo '<h1>블로그</h1>';
        }
        ?>
      <br>
    </div>
    <div class="board">
    <?php
    if(isset($_GET['post_no'])){
      echo '<div class="post">';
      $_POST['command_type'] = 'post';
      require "database.php"; ?>
      </div>
      <div class="comment_list">
        <script>
          function comment_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment',
                post_no:'<?php echo $_GET['post_no'] ?>',
                boardType:'<?php echo $_GET['boardType'] ?>'
              },
              url:'database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                comments = "";
                for(var i=1;i<=Object.keys(data).length;i++){
                  var comment = "";
                  comment += "<li>"+data[i].memberNickname+"</li>";
                  comment += "<li>"+data[i].comment+"</li>";
                  comment += "<li>"+data[i].commentDate+"</li>";
                  comments += "<ul>"+comment+"</ul>";
                }
                $('.comment_list .comment').html(comments);
              }
            });
          }
          comment_refresh();
        </script>
        <div class="comment"></div>
      </div>
        <form class="comment_write" action="database" method="post" autocomplete="off">
          <input type="hidden" name="command_type" value="comment_write">
          <input type="hidden" name="boardType" value="<?php echo $_GET['boardType'] ?>">
          <input type="hidden" name="post_no" value=<?php echo $_GET['post_no'] ?>>
          <textarea name="post_comment" placeholder="댓글" class="input_text" style="width:100%;height:10rem;" required></textarea>
          <input type="hidden" name="comment_depth" value=0>
          <input type="hidden" name="comment_parent" value=NULL>
          <br><br>
          <input type="hidden" name="returnUrl" value="<?php echo $returnUrl ?>">
          <div class="button" onclick="comment_refresh();">댓글 새로고침</div>
          <input type="submit" name="" value="댓글작성" class="button">
        </form>
        <?php if($_POST['member_code']==$_SESSION['member_code']){ ?>
        <form action="database" method="post" autocomplete="off">
          <input type="hidden" name="command_type" value="post_delete">
          <input type="hidden" name="boardType" value="<?php echo $_GET['boardType'] ?>">
          <input type="hidden" name="post_no" value=<?php echo $_GET['post_no'] ?>>
          <input type="submit" name="" value="글 삭제하기" class="button">
        </form>
    <?php } ?>
    <?php } ?>
      <div class=board_list>
        <ul class="table_header">
          <li>번호</li>
          <li>제목</li>
          <li>작성자</li>
          <li>작성 시간</li>
          <li>조회수</li>
        </ul>
          <?php
          $_POST['command_type'] = 'board';
          require "database.php";?>
      </div>
      <?php
      switch ($_GET['boardType']){
        case 'board': ?>
          <a href="/post_write?boardType=<?php echo $_GET['boardType'] ?>" class="button">글쓰기</a>
          <?php break;
        case 'blog':
          if($_GET['boardType']=='blog'&&$_SESSION['member_code']==1){ ?>
            <a href="/post_write?boardType=<?php echo $_GET['boardType'] ?>" class="button">글쓰기</a>
          <?php }
          break;
      }
      ?>
    </div>
  </div>
</main>
<div class="dim menu_close"></div>
<?php
switch ($_GET['boardType']){
  case 'board':
    echo '<title>커뮤니티</title>
    <meta property="og:title" content="board">';
    break;
  case 'blog':
    echo '<title>블로그</title>
    <meta property="og:title" content="blog">';
}
?>
<meta property="og:description" content="bssm project">