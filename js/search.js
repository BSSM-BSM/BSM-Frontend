function search(){
  resultCnt=0;
  $.ajax({
    type:'POST',
    data:{
      command_type:'search',
      searchType:'board',
      searchQuery:$('.searchQuery').val()
    },
    url:'database',
    cache:false,
    success:function(data){
      data=JSON.parse(data);
      searchResults = "";
      if(Object.keys(data).length==0){
        $('.searchResult .boardResult').html("<h2>커뮤니티</h2><br>"+"검색 결과가 없습니다.<br>단어사이에 띄어쓰기를 하거나 검색어를 조금더 길게 적어주세요");
      }else{
        for(var i=1;i<=Object.keys(data).length;i++){
          var searchResult = "";
          searchResult += "<li>"+data[i].postNo+"</li>";
          searchResult += '<li><a href="./board?boardType=board&post_no='+data[i].postNo+'"><p>'+data[i].postTitle+'</p></a></li>';
          searchResult += "<li>"+data[i].memberNickname+"</li>";
          searchResult += "<li>"+data[i].postDate+"</li>";
          searchResults += "<ul>"+searchResult+"</ul>";
          resultCnt++;
        }
        $('.searchResult .boardResult').html("<h2>커뮤니티</h2><br>"+searchResults);
      }
    }
  });
  $.ajax({
    type:'POST',
    data:{
      command_type:'search',
      searchType:'blog',
      searchQuery:$('.searchQuery').val()
    },
    url:'database',
    cache:false,
    success:function(data){
      data=JSON.parse(data);
      searchResults = "";
      if(Object.keys(data).length==0){
        $('.searchResult .blogResult').html("<h2>블로그</h2><br>"+"검색 결과가 없습니다.<br>단어사이에 띄어쓰기를 하거나 검색어를 조금더 길게 적어주세요");
      }else{
        for(var i=1;i<=Object.keys(data).length;i++){
          var searchResult = "";
          searchResult += "<li>"+data[i].postNo+"</li>";
          searchResult += '<li><a href="./board?boardType=board&post_no='+data[i].postNo+'"><p>'+data[i].postTitle+'</p></a></li>';
          searchResult += "<li>"+data[i].memberNickname+"</li>";
          searchResult += "<li>"+data[i].postDate+"</li>";
          searchResults += "<ul>"+searchResult+"</ul>";
          resultCnt++;
        }
        $('.searchResult .blogResult').html("<h2>블로그</h2><br>"+searchResults);
      }
    }
  });
}