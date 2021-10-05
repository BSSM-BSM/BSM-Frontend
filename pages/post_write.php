<link rel="stylesheet" type="text/css" href="/css/etc/board.css">
<script>
  var refresh = false;
</script>
<main>
  <div class="container">
    <div class="title">
      <h1>글쓰기</h1>
      <br>
    </div>
    <script>
      $(document).ready(function() {
        $('#summernote').summernote({
          height : 480,
          maxHeight : null,
          minHeight : 480,
          lang : 'ko-KR',
          callbacks: {
            onImageUpload:function(files, editor, welEditable){
              for(var i = files.length - 1;i>=0;i--){
                sendFile(files[i], this);
              }
            }
          },
          disableResizeEditor: true,
          toolbar: [
              ['fontname', ['fontname']],
              ['fontsize', ['fontsize']],
              ['style', ['bold', 'italic', 'underline','strikethrough', 'clear']],
              ['color', ['forecolor','color']],
              ['table', ['table']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']],
              ['insert',['picture','link','video']],
              ['view', ['fullscreen', 'codeview', 'help']]
            ],
          fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋움체','바탕체'],
          fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72']
        });
      });
      function sendFile(file, el, welEditable){
        var form_data = new FormData();
        form_data.append('file', file);
        $.ajax({
            data:form_data,
            type:"POST",
            url:'/image_upload',
            cache:false,
            contentType:false,
            processData:false,
            success:function(data){
              data=JSON.parse(data);
              if(data.status!=1){
                ajax_error(data.status);
              }else{
                $(el).summernote('editor.insertImage', $.trim(data.file_path));
              }
            },
            error: function(data) {
              ajax_error(0);
            }
        });
      }
    </script>
    <form class="post_write" method="post" autocomplete="off" onsubmit="post_write();return false;">
      <?php
      if(isset($_GET['post_no'])){ ?>
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
                  $('input[name=post_title]').val(data.post_title);
                  $('#summernote').summernote('code', data.post_content);
                }
              }
            });
          }
          post_refresh();
        </script>
      <?php }
      ?>
      <input type="text" name="post_title" placeholder="제목" class="input_text" style="width:100%;" required autofocus>
      <textarea name="post_content" placeholder="내용" id="summernote" class="input_text" style="width:100%;" required></textarea>
      <br><br>
      <a href="/board?boardType=<?php echo $_GET['boardType'] ?>" class="button">커뮤니티</a>
      <input type="submit" value="글작성" class="button">
    </form>
    <script>
      function post_write(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'post_write',
            boardType:'<?php echo $_GET['boardType'] ?>',
            <?php if(isset($_GET['post_no'])){ echo "post_no:'".$_GET['post_no']."',";} ?>
            post_title:$('input[name=post_title]').val(),
            post_content:$('textarea[name=post_content]').val(),
          },
          url:'database',
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              ajax_error(data.status);
            }else{
              window.location.href="board?boardType=<?php echo $_GET['boardType'] ?>";
            }
          }
        });
      }
    </script>
    <br>
  </div>
</div>
<div class="dim menu_close"></div>
<title>글쓰기 - BSM</title>
<meta property="title" content="글쓰기 - BSM | 부산소마고 지원 서비스">
<meta property="description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">
<meta property="og:title" content="글쓰기 - BSM | 부산소마고 지원 서비스">
<meta property="og:description" content="부산 소프트웨어 마이스터고 학교 기숙사 지원 서비스">
<link rel="stylesheet" href="/css/summernote-lite.min.css">
<script src="/js/summernote-lite.min.js"></script>
<script src="/js/lang/summernote-ko-KR.js"></script>