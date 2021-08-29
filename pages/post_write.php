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
            success:function(url){
                $(el).summernote('editor.insertImage', $.trim(url));
            },
            error: function(data) {
                console.log(data);
            }
        });
      }
    </script>
    <form class="post_write" action="database" method="post" autocomplete="off">
      <input type="hidden" name="command_type" value="post_write">
      <input type="hidden" name="boardType" value="<?php echo $_GET['boardType'] ?>">
      <input type="text" name="post_title" placeholder="제목" class="input_text" style="width:100%;" required autofocus>
      <textarea name="post_content" placeholder="내용" id="summernote" class="input_text" style="width:100%;" required></textarea>
      <br><br>
      <input type="hidden" name="returnUrl" value="<?php echo $returnUrl ?>">
      <a href="/board?boardType=<?php echo $_GET['boardType'] ?>" class="button">커뮤니티</a>
      <input type="submit" name="" value="글작성" class="button">
    </form>
    <br>
  </div>
</div>
<div class="dim menu_close"></div>
<title>글쓰기</title>
<meta property="og:title" content="글쓰기">
<meta property="og:description" content="bssm project">
<link rel="stylesheet" href="/css/summernote-lite.min.css">
<script src="/js/summernote-lite.min.js"></script>
<script src="/js/lang/summernote-ko-KR.js"></script>