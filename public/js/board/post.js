const postView = new Vue({
    el:'.post',
    data:{
        memberProfile:'',
        postTitle:'',
        postDate:'',
        postHit:'',
        postComments:'',
        memberNickname:'',
        postContent:'',
        postLike:0,
        like:0,
    }
})
const postRefresh = () => {
    $.ajax({
        type:'GET',
        url:apiUrl+'/post/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                postView.memberCode=data.memberCode;
                postView.postTitle=data.postTitle;
                postView.postDate=data.postDate;
                postView.postHit=data.postHit;
                postView.postComments=data.postComments;
                postView.memberNickname=data.memberNickname;
                postView.postContent=data.postContent;
                postView.like=data.like;
                postView.postLike=data.postLike;
                $('.note-video-clip').each(function(){
                    let tmp = $(this).wrap('<p/>').parent().html();
                    $(this).parent().html('<div class="video-container">'+tmp+'</div>');
                });
                postMenu(data.permission);
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}
const postDelete = () => {
    $.ajax({
        type:'DELETE',
        url:apiUrl+'/post/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                window.location.href='/board/'+boardType;
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}

const postMenu = permission => {
    if(permission){
        $('.post_delete').html(`<div class="button red_button" onclick="postDelete();">글 삭제</div>`);
        $('.post_modify').html('<a class="button blue_button" href="/board/write/<%= boardType %>/<%= postNo %>">게시글 수정</a>');
    }
}
const likeSend = like => {
    $.ajax({
        type:'POST',
        data:{
            like:like,
        },
        url:apiUrl+'/like/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                postView.like=data.like;
                postView.postLike=data.postLike;
            }
        },
        error:() => {
            error_code(0, 0);
        } 
    });
}

const commentRefresh = () => {
    $.ajax({
        type:'GET',
        url:apiUrl+'/comment/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                data=data.arrComment;
                comments = "";
                for(let i=0;i<Object.keys(data).length;i++){
                    let comment = "";
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
                    if(data[i].permission){
                        comment += `<div class="comment_menu"><button class="button red_button" onclick="commentDelete(`+data[i].idx+`);">댓글 삭제</button></div>`;
                    }
                    comments += `<div class="comment_item" onclick="$('.comment_item:not(:nth-child(`+(i+1)+`)) .comment_menu').removeClass('on');$('.comment_item:nth-child(`+(i+1)+`) .comment_menu').toggleClass('on');">`+comment+`</div>`;
                }
                $('.comment_list .comment').html(comments);
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}

const commentDelete = commentIndex => {
    $.ajax({
        type:'DELETE',
        data:{
            commentIndex:commentIndex,
        },
        url:apiUrl+'/comment/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}

const comment_write = () => {
    $.ajax({
        type:'POST',
        data:{
            comment:$('.post_comment').val(),
        },
        url:apiUrl+'/comment/'+boardType+'/'+postNo,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                $('.post_comment').val("");
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}