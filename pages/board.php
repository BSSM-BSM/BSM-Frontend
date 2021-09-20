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
    <div class="board blur">
    <?php
    if(isset($_GET['post_no'])){ ?>
      <div class="post">
        <script>
          function post_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'post',
                post_no:'<?php echo $_GET['post_no'] ?>',
                boardType:'<?php echo $_GET['boardType'] ?>'
              },
              url:'database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  $('.post_title').text(data.post_title);
                  $('.post_date').text(data.post_date);
                  $('.post_hit').text(data.post_hit);
                  $('.post_comments').text(data.post_comments);
                  $('.member_nickname').html('<a href="./memberinfo.php?member_code='+data.member_code+'">'+data.member_nickname+'</a>');
                  $('.post_content div').html(data.post_content);
                  $('.note-video-clip').each(function(){
                    var tmp = $(this).wrap('<p/>').parent().html();
                    $(this).parent().html('<div class="video-container">'+tmp+'</div>');
                  });
                  post_menu(data.member_code);
                  comment_refresh();
                }
              }
            });
          }
          post_refresh();
        </script>
        <div class="post_title"></div>
        <div class="post_date"><p></p></div>
        <div class="post_hit"><p></p></div>
        <div class="post_comments"><p></p></div>
        <div class="member_nickname"></div>
        <div class="post_content"><div></div></div>
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
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  data=data.arr_comment;
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
              }
            });
          }
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
        <span class="post_delete"></span>
        <span class="post_modify"></span>
        <script>
          function post_menu(member_code){
            if(member_code==<?php echo $_SESSION['member_code'] ?>){
              $('.post_delete').html(`<form action="database" method="post" autocomplete="off">
                <input type="hidden" name="command_type" value="post_delete">
                <input type="hidden" name="boardType" value="<?php echo $_GET['boardType'] ?>">
                <input type="hidden" name="post_no" value=<?php echo $_GET['post_no'] ?>>
                <input type="submit" name="" value="글 삭제하기" class="button">
              </form>`);
              $('.post_modify').html('<a class="button" href="./post_write?boardType=<?php echo $_GET['boardType'] ?>&post_no=<?php echo $_GET['post_no'] ?>">게시글 수정</a>');
            }
          }
        </script>
    <?php } ?>
      <div class=board_list>
        <div class="table_header">
          <span class="board_item_info">번호</span>
          <span class="board_item_info">제목</span>
          <span class="board_item_info">작성자</span>
          <span class="board_item_info">작성 시간</span>
          <span class="board_item_info">조회수</span>
        </div>
        <div class="table_main"></div>
        <script>
          function board_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'board',
                <?php if(isset($_GET['page_no']))echo "page_no:".$_GET['page_no']."," ?>
                boardType:'<?php echo $_GET['boardType'] ?>'
              },
              url:'database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  board_data=data.arr_board;
                  boards = "";
                  for(var i=0;i<Object.keys(board_data).length;i++){
                    var board = "";
                    board += '<span class="board_item_info">'+board_data[i].postNo+'</span>';
                    
                    board += '<a href="./board?boardType=' +board_data[i].boardType+ '&post_no=' +board_data[i].postNo+ '"class="board_item_info"><span><p>' +board_data[i].postTitle;
                    if(board_data[i].postComments>=1){
                      board += '</p><p class="post_comments">[' +board_data[i].postComments+ ']</p></span></a>';
                    }else{
                      board += '</p></span></a>';
                    }

                    board += '<span class="board_item_info"><a href="./memberinfo.php?member_code=' +board_data[i].memberCode+ '">' +board_data[i].memberNickname+ '</a></span>';
                    board += '<span class="board_item_info">'+board_data[i].postDate+'</span>';
                    board += '<span class="board_item_info">'+board_data[i].postHit+'</span>';
                    if(i%2){
                      boards += '<span class="board_item">'+board+'</span>';
                    }else{
                      boards += '<span class="board_item odd">'+board+'</span>';
                    }
                  }
                  $('.board_list .table_main').html(boards);
                  $('.page_num').html(data.page_num);
                }
              }
            });
          }
          board_refresh();
        </script>
      </div>
      <div class="page_num"></div>
      <button onClick="board_refresh();" class="button">글 새로고침</button>
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
    echo '<title>커뮤니티 - BSM</title>
    <meta property="title" content="커뮤니티 - BSM | 부산소마고 지원 서비스">
    <meta property="og:title" content="커뮤니티 - BSM | 부산소마고 지원 서비스';
    break;
  case 'blog':
    echo '<title>블로그</title>
    <meta property="title" content="부산소마고 이현준의 개발 블로그">
    <meta property="og:title" content="부산소마고 이현준의 개발 블로그">';
}
?>
<meta property="description" content="부산 소프트웨어 마이스터고 학교 지원 서비스">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 지원 서비스">