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
              url:'/database',
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
      <div class="post_like_wrap">
        <button class="button like_button" onclick="like_send(1);">좋아요</button>
        <span class="post_like"></span>
        <button class="button dislike_button" onclick="like_send(-1);">싫어요</button>
      </div>
      <script>
        var like;
        function like_send(like){
          $.ajax({
            type:'POST',
            data:{
              command_type:'like',
              boardType:'<?php echo $_GET['boardType'] ?>',
              post_no:'<?php echo $_GET['post_no'] ?>',
              like:like,
            },
            url:'/database',
            cache:false,
            success:function(data){
              data=JSON.parse(data);
              if(data.status!=1){
                ajax_error(data.status);
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
                post_no:'<?php echo $_GET['post_no'] ?>',
                boardType:'<?php echo $_GET['boardType'] ?>'
              },
              url:'/database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  data=data.arr_comment;
                  comments = "";
                  for(var i=0;i<Object.keys(data).length;i++){
                    var comment = "";
                    comment += '<div class="comment_item_info_wrap">';
                    comment += '<div class="comment_item_info"><a href="/memberinfo?member_code=' +data[i].memberCode+ '">'+data[i].memberNickname+'</a></div>';
                    comment += '<div class="comment_item_info">'+data[i].commentDate+'</div>';
                    comment += '<div class="comment_item_info">'+data[i].comment+'</div>';
                    comment += '</div>';
                    if(data[i].memberCode==<?php echo $_SESSION['member_code'] ?>||<?php if($_SESSION['member_code']==1) echo 1 ?>){
                      comment += `<div class="comment_menu"><button class="button red_button" onclick="comment_delete(`+data[i].comment_idx+`);">댓글 삭제</button></div>`;
                    }
                    if(i%2){
                      comments += `<div class="comment_item" onclick="$('.comment_item .comment_menu').removeClass('on');$('.comment_item:nth-child(`+(i+1)+`) .comment_menu').addClass('on');">`+comment+`</div>`;
                    }else{
                      comments += `<div class="comment_item odd" onclick="$('.comment_item .comment_menu').removeClass('on');$('.comment_item:nth-child(`+(i+1)+`) .comment_menu').addClass('on');">`+comment+`</div>`;
                    }
                  }
                  $('.comment_list .comment').html(comments);
                }
              }
            });
          }
          function comment_delete(comment_index){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment_delete',
                boardType:'<?php echo $_GET['boardType'] ?>',
                post_no:'<?php echo $_GET['post_no'] ?>',
                comment_index:comment_index,
              },
              url:'/database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  comment_refresh();
                }
              }
            });
          }
          function comment_write(){
            $.ajax({
              type:'POST',
              data:{
                command_type:'comment_write',
                boardType:'<?php echo $_GET['boardType'] ?>',
                post_no:'<?php echo $_GET['post_no'] ?>',
                post_comment:$('.post_comment').val(),
              },
              url:'/database',
              cache:false,
              success:function(data){
                data=JSON.parse(data);
                if(data.status!=1){
                  ajax_error(data.status);
                }else{
                  $('.post_comment').val("");
                  comment_refresh();
                }
              }
            });
          }
        </script>
        <div class="comment"></div>
      </div>
        <form class="comment_write" action="database" method="post" autocomplete="off" onsubmit="comment_write();return false;">
          <textarea placeholder="댓글" class="post_comment" style="width:100%;height:10rem;" required></textarea>
          <br><br>
          <div class="button" onclick="comment_refresh();">댓글 새로고침</div>
          <input type="submit" name="" value="댓글작성" class="button">
        </form>
        <span class="post_delete"></span>
        <span class="post_modify"></span>
        <script>
          function post_menu(member_code){
            if(member_code==<?php echo $_SESSION['member_code'] ?>||<?php if($_SESSION['member_code']==1) echo 1 ?>){
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
                <?php if(isset($_GET['page_no']))echo "page_no:".$_GET['page_no']."," ?>
                boardType:'<?php echo $_GET['boardType'] ?>'
              },
              url:'/database',
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

                    board += '<span class="board_item_info"><a href="/memberinfo?member_code=' +board_data[i].memberCode+ '">' +board_data[i].memberNickname+ '</a></span>';
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
          if(isset($_SESSION['member_code'])){
            if($_GET['boardType']=='blog'&&$_SESSION['member_code']==1){ ?>
              <a href="/post_write?boardType=<?php echo $_GET['boardType'] ?>" class="button">글쓰기</a>
            <?php
            }
          }
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