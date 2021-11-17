function search(){
  resultCnt=0;
  $.ajax({
    type:'GET',
    url:apiUrl+'/search/board/'+$('.searchQuery').val(),
    cache:false,
    success:function(data){
      data=JSON.parse(data);
      if(data.status!=1){
          error_code(data.status, data.subStatus);
      }else{
        searchResults = "";
        arrSearchResult = data.arrSearchResult;
        if(Object.keys(arrSearchResult).length==0){
          $('.searchResult .boardResult').html("<h2>자유게시판</h2><br>"+"검색 결과가 없습니다.<br>단어사이에 띄어쓰기를 하거나 검색어를 조금더 길게 적어주세요");
        }else{
          for(var i=1;i<=Object.keys(data).length;i++){
            var searchResult = "";
            searchResult += "<li>"+arrSearchResult[i].postNo+"</li>";
            searchResult += '<li><a href="/board/board/'+arrSearchResult[i].postNo+'"><p>'+arrSearchResult[i].postTitle+'</p></a></li>';
            searchResult += "<li>"+arrSearchResult[i].memberNickname+"</li>";
            searchResult += "<li>"+arrSearchResult[i].postDate+"</li>";
            searchResults += "<ul>"+searchResult+"</ul>";
            resultCnt++;
          }
          $('.searchResult .boardResult').html("<h2>자유게시판</h2><br>"+searchResults);
        }
      }
    }
  });
  $.ajax({
    type:'GET',
    url:apiUrl+'/search/anonymous/'+$('.searchQuery').val(),
    cache:false,
    success:function(data){
      data=JSON.parse(data);
      if(data.status!=1){
          error_code(data.status, data.subStatus);
      }else{
        searchResults = "";
        arrSearchResult = data.arrSearchResult;
        if(Object.keys(arrSearchResult).length==0){
          $('.searchResult .anonymousResult').html("<h2>익명게시판</h2><br>"+"검색 결과가 없습니다.<br>단어사이에 띄어쓰기를 하거나 검색어를 조금더 길게 적어주세요");
        }else{
          for(var i=1;i<=Object.keys(data).length;i++){
            var searchResult = "";
            searchResult += "<li>"+arrSearchResult[i].postNo+"</li>";
            searchResult += '<li><a href="/board/board/'+arrSearchResult[i].postNo+'"><p>'+arrSearchResult[i].postTitle+'</p></a></li>';
            searchResult += "<li>"+arrSearchResult[i].memberNickname+"</li>";
            searchResult += "<li>"+arrSearchResult[i].postDate+"</li>";
            searchResults += "<ul>"+searchResult+"</ul>";
            resultCnt++;
          }
          $('.searchResult .anonymousResult').html("<h2>익명게시판</h2><br>"+searchResults);
        }
      }
    }
  });
}