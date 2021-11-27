const boardView = new Vue({
    el:'.board_list',
    data:{
        posts:[]
    }
})
const boardRefresh = () => {
    $.ajax({
        type:'GET',
        url:apiUrl+'/board/'+boardType+'?page='+page,
        cache:false,
        success:(data)=>{
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
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
                for(let i=0;i<Object.keys(boardData).length;i++){
                    if(boardData[i].postDate.split(' ')[0].replaceAll("-","")==today)
                        boardData[i].postDate = boardData[i].postDate.split(' ')[1];
                    else
                        boardData[i].postDate = boardData[i].postDate.split(' ')[0];
                    boardView.posts.push({
                        memberNickname: memberLevel[boardData[i].memberLevel]+boardData[i].memberNickname,
                        memberProfileUrl:`/memberinfo/${boardData[i].memberCode}`,
                        memberProfile:`/resource/member/profile_images/profile_${boardData[i].memberCode}.png`,
                        postUrl: '/board/' +boardData[i].boardType+ '/' +boardData[i].postNo,
                        postTitle: boardData[i].postTitle,
                        postDate: boardData[i].postDate,
                        postHit: boardData[i].postHit,
                        postComments: boardData[i].postComments,
                        postLike: boardData[i].postLike,
                    })
                }
                //$('.page_num').html(data.pageNum);
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}
const boardMenu = new Vue({
    el:'.board_bottom_menu',
    data:{
        isLogin:false,
        writeUrl:'javascript:error_code(4, 1);'
    }
})
if(member.isLogin){
    boardMenu.isLogin=true
    boardMenu.writeUrl='/board/write/'+boardType
}