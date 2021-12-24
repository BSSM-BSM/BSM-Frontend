let boardType = window.location.pathname.split('/')[2];
let page = new URLSearchParams(location.search).get("page");
let limit = new URLSearchParams(location.search).get("limit");
if(limit==null){
    limit=15;
}
$$('.board_limit .select')[0].innerText=limit+"개";
const boardPageChange = (changePage) => {
    page=changePage;
    boardMenu.activePage=page;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('page', String(changePage));
    history.pushState(null, null, window.location.pathname+"?"+urlSearch.toString());
    boardRefresh();
}
const boardLimitChange = (changeLimit) => {
    limit=changeLimit;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('limit', String(changeLimit));
    history.pushState(null, null, window.location.pathname+"?"+urlSearch.toString());
    boardRefresh();
}
const boardMenu = new Vue({
    el:'.board_bottom_menu',
    data:{
        isLogin:false,
        writeUrl:'javascript:error_code(4, 1);',
        pages:0,
        activePage:0
    }
})
const boardView = new Vue({
    el:'.board_list',
    data:{
        posts:[]
    }
})
const boardRefresh = () => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'GET',
        url:apiUrl+`/board/${boardType}?page=${page}&limit=${limit}`,
        cache:false,
        success:(data)=>{
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                if(member.isLogin){
                    boardMenu.isLogin=true
                    boardMenu.writeUrl='/board/write/'+boardType
                }
                boardMenu.activePage=page;
                boardMenu.pages=data.pages
                let date = new Date()
                let today = ""+date.getFullYear()
                if((date.getMonth()+1)<10){
                    today+='0'
                }
                today+=(date.getMonth()+1)
                if(date.getDate()<10){
                    today+='0'
                }
                today+=date.getDate()
                boardData=data.arrBoard;
                boardView.posts.splice(0)
                if(boardData!=null){
                    for(let i=0;i<boardData.length;i++){
                        if(boardData[i].postDate.split(' ')[0].replaceAll("-","")==today)
                            boardData[i].postDate = boardData[i].postDate.split(' ')[1];
                        else
                            boardData[i].postDate = boardData[i].postDate.split(' ')[0];
                        boardView.posts.push({
                            memberNickname:memberLevel[boardData[i].memberLevel]+boardData[i].memberNickname,
                            memberProfileUrl:`/memberinfo/${boardData[i].memberCode}`,
                            memberProfile:`/resource/member/profile_images/profile_${boardData[i].memberCode}.png`,
                            boardType:boardData[i].boardType,
                            postNo:boardData[i].postNo,
                            postTitle:boardData[i].postTitle,
                            postDate:boardData[i].postDate,
                            postHit:boardData[i].postHit,
                            postComments:boardData[i].postComments,
                            postLike:boardData[i].postLike,
                        })
                    }
                }
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}

boardRefresh();