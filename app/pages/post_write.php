<?php
$boardType=getParam(3);
$post_no=getParam(4);
?>
<script>
  var refresh = false;
</script>
<main>
  <div class="title">
    <h1>글쓰기</h1>
    <h2><?php switch($boardType){case 'board': echo '자유게시판'; break; case 'anonymous': echo '익명게시판';break;} ?></h2>
  </div>
  <div class="container">
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
                error_code(data.status);
              }else{
                $(el).summernote('editor.insertImage', $.trim(data.file_path));
              }
            },
            error: function(data) {
              error_code(0);
            }
        });
      }
    </script>
    <form class="post_write" method="post" autocomplete="off" onsubmit="post_write();return false;">
      <?php
      if(isset($post_no)){ ?>
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
                  $('input[name=post_title]').val(data.post_title);
                  $('#summernote').summernote('code', data.post_content);
                }
              },
              error: function(data) {
                error_code(0);
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
      <input type="submit" value="글작성" class="button">
    </form>
    <script>
      function post_write(){
        $.ajax({
          type:'POST',
          data:{
            command_type:'post_write',
            boardType:'<?php echo $boardType ?>',
            <?php if(isset($post_no)){ echo "post_no:'".$post_no."',";} ?>
            post_title:$('input[name=post_title]').val(),
            post_content:$('textarea[name=post_content]').val(),
          },
          url:db_url,
          cache:false,
          success:function(data){
            data=JSON.parse(data);
            if(data.status!=1){
              error_code(data.status);
            }else{
              window.close();
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