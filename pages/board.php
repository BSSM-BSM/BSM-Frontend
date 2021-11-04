<?php
$boardType=getParam(2);
$post_no=getParam(3);
?>
<main>
  <div class="container">
    <div class="title">
        <?php
        switch ($boardType){
          case 'board':
            echo '<h1>자유게시판</h1>';
            break;
          case 'anonymous':
            echo '<h1>익명게시판</h1>';
        }
        ?>
      <br>
    </div>
    <div class="board blur">
    <?php
    if(isset($post_no)){ ?>
      <div class="post">
        <script>
          function post_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'post',
                post_no:'<?php echo $post_no ?>',
                boardType:'<?php echo $boardType ?>'
              },
              url:db_url,
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  error_code(data.status);
                }else{
                  $('.post .left_wrap').html(`<img src="/resource/member/profile_images/profile_`+data.member_code+`.png" onerror="this.src='/resource/member/profile_images/profile_default.png'" alt="" class="user_profile">`);
                  $('.post_title').text(data.post_title);
                  $('.post_date').text(data.post_date);
                  $('.post_hit').text(data.post_hit);
                  $('.post_comments').text(data.post_comments);
                  $('.member_nickname').html('<a href="/memberinfo/'+data.member_code+'">'+memberLevel[data.memberLevel]+data.member_nickname+'</a>');
                  $('.post_content div').html(data.post_content);
                  if(data.like>0){
                    $('.like_button').addClass('on');
                    $('.dislike_button').removeClass('on');
                  }else if(data.like<0){
                    $('.like_button').removeClass('on');
                    $('.dislike_button').addClass('on');
                  }else{
                    $('.like_button').removeClass('on');
                    $('.dislike_button').removeClass('on');
                  }
                  $('.post_like').text(data.post_like);
                  $('.note-video-clip').each(function(){
                    var tmp = $(this).wrap('<p/>').parent().html();
                    $(this).parent().html('<div class="video-container">'+tmp+'</div>');
                  });
                  post_menu(data.member_code);
                  comment_refresh();
                }
              },
              error: function(data) {
                error_code(0);
              }
            });
          }
          post_refresh();
        </script>
        <div class="post_info_wrap">
          <div class="left_wrap"></div>
          <div class="right_wrap">
            <div class="post_title"></div>
            <div class="post_date"><p></p></div>
            <div class="post_hit"><p></p></div>
            <div class="post_comments"><p></p></div>
            <div class="member_nickname"></div>
          </div>
        </div>
        <div class="post_content"><div></div></div>
      </div>
      <div class="post_like_wrap">
        <button class="button like_button" onclick="like_send(1);">좋아요</button>
        <span class="post_like"></span>
        <button class="button dislike_button" onclick="like_send(-1);">싫어요</button>
      </div>
      <script>
        let like;
        function like_send(like){
          $.ajax({
            type:'POST',
            data:{
              command_type:'like',
              boardType:'<?php echo $boardType ?>',
              post_no:'<?php echo $post_no ?>',
              like:like,
            },
            url:db_url,
            cache:false,
            success:function(data){
              data=JSON.parse(data);
              if(data.status!=1){
                error_code(data.status);
                refresh = false;
              }else{
                if(data.like>0){
                  $('.like_button').addClass('on');
                  $('.dislike_button').removeClass('on');
                }else if(data.like<0){
                  $('.like_button').removeClass('on');
                  $('.dislike_button').addClass('on');
                }else{
                  $('.like_button').removeClass('on');
                  $('.dislike_button').removeClass('on');
                }
                $('.post_like').text(data.post_like);
              }
            },
            error: function(data) {
              error_code(0);
            }
          });
        }
      </script>
      <div class="comment_list">
        <script>
          function comment_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment',
                post_no:'<?php echo $post_no ?>',
                boardType:'<?php echo $boardType ?>'
              },
              url:db_url,
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  error_code(data.status);
                }else{
                  data=data.arr_comment;
                  comments = "";
                  for(var i=0;i<Object.keys(data).length;i++){
                    var comment = "";
                    comment += '<div class="comment_item_wrap">';
                      comment += '<div class="comment_item_info_wrap">';
                        comment += '<div class="left_wrap">';
                          comment += `<img src="/resource/member/profile_images/profile_`+data[i].memberCode+`.png" onerror="this.src='/resource/member/profile_images/profile_default.png'" alt="" class="user_profile">`;
                        comment += '</div>';
                        comment += '<div class="right_wrap">';
                          comment += '<div class="comment_item_info"><a href="/memberinfo/' +data[i].memberCode+ '">'+memberLevel[data[i].memberLevel]+data[i].memberNickname+'</a></div>';
                          comment += '<div class="comment_item_info">'+data[i].commentDate+'</div>';
                        comment += '</div>';
                      comment += '</div>';
                      comment += '<div class="comment_item_content">'+data[i].comment+'</div>';
                    comment += '</div>';
                    if(data[i].memberCode==<?php if(isset($_SESSION['member_code'])) echo $_SESSION['member_code']; else echo 0 ?>||<?php if($_SESSION['member_code']==1) echo 1; else echo 0; ?>){
                      comment += `<div class="comment_menu"><button class="button red_button" onclick="comment_delete(`+data[i].comment_idx+`);">댓글 삭제</button></div>`;
                    }
                    if(i%2){
                      comments += `<div class="comment_item" onclick="$('.comment_item:not(:nth-child(`+(i+1)+`)) .comment_menu').removeClass('on');$('.comment_item:nth-child(`+(i+1)+`) .comment_menu').toggleClass('on');">`+comment+`</div>`;
                    }else{
                      comments += `<div class="comment_item odd" onclick="$('.comment_item:not(:nth-child(`+(i+1)+`)) .comment_menu').removeClass('on');$('.comment_item:nth-child(`+(i+1)+`) .comment_menu').toggleClass('on');">`+comment+`</div>`;
                    }
                  }
                  $('.comment_list .comment').html(comments);
                }
              },
              error: function(data) {
                error_code(0);
              }
            });
          }
          function comment_delete(comment_index){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment_delete',
                boardType:'<?php echo $boardType ?>',
                post_no:'<?php echo $post_no ?>',
                comment_index:comment_index,
              },
              url:db_url,
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  error_code(data.status);
                  refresh = false;
                }else{
                  comment_refresh();
                }
              },
              error: function(data) {
                error_code(0);
              }
            });
          }
          function comment_write(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment_write',
                boardType:'<?php echo $boardType ?>',
                post_no:'<?php echo $post_no ?>',
                post_comment:$('.post_comment').val(),
              },
              url:db_url,
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  error_code(data.status);
                  refresh = false;
                }else{
                  $('.post_comment').val("");
                  comment_refresh();
                }
              },
              error: function(data) {
                error_code(0);
              }
            });
          }
        </script>
        <div class="comment"></div>
      </div>
        <form class="comment_write" method="post" autocomplete="off" onsubmit="comment_write();return false;">
          <textarea placeholder="댓글" class="post_comment" style="width:100%;height:10rem;" required></textarea>
          <br><br>
          <div class="button" onclick="comment_refresh();">댓글 새로고침</div>
          <input type="submit" name="" value="댓글작성" class="button">
        </form>
        <span class="post_delete"></span>
        <span class="post_modify"></span>
        <script>
          function post_menu(member_code){
            if(member_code==<?php if(isset($_SESSION['member_code'])) echo $_SESSION['member_code']; else echo 0 ?>||<?php if($_SESSION['member_code']==1) echo 1; else echo 0; ?>){
              $('.post_delete').html(`<form action="/database" method="post" autocomplete="off">
                <input type="hidden" name="command_type" value="post_delete">
                <input type="hidden" name="boardType" value="<?php echo $boardType ?>">
                <input type="hidden" name="post_no" value=<?php echo $post_no ?>>
                <input type="submit" name="" value="글 삭제하기" class="button">
              </form>`);
              $('.post_modify').html('<a class="button" href="/post_write/<?php echo $boardType ?>/<?php echo $post_no ?>">게시글 수정</a>');
            }
          }
        </script>
    <?php } ?>
      <div class=board_list>
        <div class="table_header">
          <span class="board_item">
            <span class="board_item_info">번호</span>
            <span class="board_item_info">제목</span>
            <span class="board_item_info">작성자</span>
            <span class="board_item_info">작성 시간</span>
            <span class="board_item_info">조회수</span>
            <span class="board_item_info">좋아요</span>
          </span>
        </div>
        <div class="table_main"></div>
        <script>
          function board_refresh(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'board',
                boardType:'<?php echo $boardType ?>',
                <?php if(isset($_GET['page_no']))echo "page_no:".$_GET['page_no']."," ?>
              },
              url:db_url,
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  error_code(data.status);
                }else{
                  board_data=data.arr_board;
                  boards = "";
                  for(var i=0;i<Object.keys(board_data).length;i++){
                    var board = "";
                    board += '<span class="board_item_info">'+board_data[i].postNo+'</span>';
                    
                    board += '<a href="/board/' +board_data[i].boardType+ '/' +board_data[i].postNo+ '"class="board_item_info"><span><p>' +board_data[i].postTitle;
                    if(board_data[i].postComments>=1){
                      board += '</p><p class="post_comments">[' +board_data[i].postComments+ ']</p></span></a>';
                    }else{
                      board += '</p></span></a>';
                    }

                    board += `<span class="board_item_info"><img src="/resource/member/profile_images/profile_`+board_data[i].memberCode+`.png" onerror="this.src='/resource/member/profile_images/profile_default.png'" alt="" class="user_profile"><a href="/memberinfo/`+board_data[i].memberCode+`">`+memberLevel[board_data[i].memberLevel]+board_data[i].memberNickname+`</a></span>`;
                    board += '<span class="board_item_info">'+board_data[i].postDate+'</span>';
                    board += '<span class="board_item_info">'+board_data[i].postHit+'</span>';
                    board += '<span class="board_item_info">'+board_data[i].post_like+'</span>';
                    if(i%2){
                      boards += '<span class="board_item">'+board+'</span>';
                    }else{
                      boards += '<span class="board_item odd">'+board+'</span>';
                    }
                  }
                  $('.board_list .table_main').html(boards);
                  $('.page_num').html(data.page_num);
                }
              },
              error: function(data) {
                error_code(0);
              }
            });
          }
          board_refresh();
        </script>
      </div>
      <div class="page_num"></div>
      <button onClick="board_refresh();" class="button">글 새로고침</button>
      <?php
      if(isset($_SESSION['member_code'])){ ?>
        <a href="/post_write/<?php echo getParam(2); ?>" class="button">글쓰기</a>
      <?php
      }
      ?>
    </div>
  </div>
</main>
<div class="dim menu_close"></div>
<?php
switch (getParam(2)){
  case 'board':
    echo '<title>자유게시판 - BSM</title>
    <meta property="title" content="자유게시판 - BSM | 부산소마고 지원 서비스">
    <meta property="og:title" content="자유게시판 - BSM | 부산소마고 지원 서비스';
    break;
  case 'anonymous':
    echo '<title>익명게시판</title>
    <meta property="title" content="익명게시판 - BSM | 부산소마고 지원 서비스">
    <meta property="og:title" content="익명게시판 - BSM | 부산소마고 지원 서비스';
}
?>
<meta property="description" content="부산 소프트웨어 마이스터고 학교 지원 서비스">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 지원 서비스">