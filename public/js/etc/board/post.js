let postNo = window.location.pathname.split('/')[3];
const boardPostChange = (changePostMo) => {
    postNo=changePostMo;
    history.pushState(null, null, `/board/${boardType}/${postNo}${window.location.search}`);
    postRefresh();
}
const postView = new Vue({
    el:'.post',
    data:{
        permission:false,
        memberProfile:'',
        memberInfoUrl:'',
        postTitle:'',
        postDate:'',
        postHit:'',
        postComments:'',
        memberNickname:'',
        postContent:'',
        postLike:0,
        like:0,
        commentTree:[],
        commentFocus:0,
    },
    methods:{
        isParent:function(){
            return this.item.child && this.item.child.length;
        },
        focusComment:function(focus){
            this.commentFocus=focus;
        },
    },
    updated(){
        this.$nextTick(function () {
            [
                ...$$('.post_content img[e_id]:not(.emoticon)'),
                ...$$('.comment_item_content img[e_id]:not(.emoticon)')
            ].forEach(e => {
                e.src=`/resource/board/emoticon/${e.getAttribute('e_id')}/${e.getAttribute('e_idx')}.${e.getAttribute('e_type')}`;
                e.classList.add('emoticon');
                e.setAttribute('onClick', `loadEmoticonInfo(${e.getAttribute('e_id')})`);
            });
            editor = $(`.comment_write.write_${this.commentFocus} .write`);
        })
    }
})
const postRefresh = () => {
    progress(20);
    ajax({
        method:'get',
        url:`/post/${boardType}/${postNo}`,
        callBack:data=>{
            $('.post').classList.remove('hide');
            $('html').scrollTop=0;
            postView.permission=data.permission;
            postView.memberCode=data.memberCode;
            postView.memberProfile=`/resource/member/profile_images/profile_${data.memberCode}.png`;
            postView.memberInfoUrl=`/memberinfo/${data.memberCode}`;
            postView.postTitle=data.postTitle;
            postView.postDate=data.postDate;
            postView.postHit=data.postHit;
            postView.postComments=data.postComments;
            postView.memberNickname=data.memberNickname;
            postView.postContent=data.postContent;
            postView.like=data.like;
            postView.postLike=data.postLike;
            window.setTimeout(()=>{
                // iframe영상을 화면에 꽉채우게 하기위해서 컨테이너로 감싸줌
                // 바로 실행하면 요소가 dom에 렌더링되기 전에 실행되므로 딜레이를 줘서 실행
                $$('.note-video-clip').forEach(e => {
                    e.outerHTML=`<div class="video-container">${e.outerHTML}</div>`;
                });
            },1);
            progress(50);
            commentRefresh();
        }
    })
}
const postDelete = () => {
    ajax({
        method:'delete',
        url:`/post/${boardType}/${postNo}`,
        callBack:()=>{
            window.location.href=`/board/${boardType}`;
        }
    })
}
const likeSend = like => {
    ajax({
        method:'post',
        url:`/like/${boardType}/${postNo}`,
        payload:{
            like:like
        },
        callBack:data=>{
            postView.like=data.like;
            postView.postLike=data.postLike;
        }
    })
}

Vue.component('tree-item', {
    template:'#comment_item_template',
    props:{
        item:Object
    },
    methods:{
        focusComment:function(focus){
            postView.commentFocus=focus;
        }
    },
    computed:{
        isParent:function(){
            return this.item.child && this.item.child.length
        }
    }
})

const commentRefresh = () => {
    progress(50);
    ajax({
        method:'get',
        url:`/comment/${boardType}/${postNo}`,
        callBack:data=>{
            postView.commentTree = data.arrComment;
            postView.commentFocus = 0;
        }
    })
}

const commentDelete = commentIndex => {
    ajax({
        method:'delete',
        url:`/comment/${boardType}/${postNo}/${commentIndex}`,
        callBack:()=>{
            commentRefresh();
        }
    })
}

const commentWrite = (depth, parentIdx) => {
    depth = parseInt(depth)+1;
    let url;
    if(parentIdx<1){
        url = `/comment/${boardType}/${postNo}`;
    }else{
        url = `/comment/${boardType}/${postNo}/${depth}/${parentIdx}`;
    }
    ajax({
        method:'post',
        url:url,
        payload:{
            comment:$(`.comment_write.write_${parentIdx} .write`).innerHTML,
        },
        callBack:()=>{
            $(`.comment_write.write_${parentIdx} .write`).innerHTML='';
            commentRefresh();
        }
    })
}
const editorNewline = () => {
    /*
    브라우저에서 contenteditable 속성이 다음줄을 만들면 \n문자를 집어넣어서 개행처리를 하지않고
    <div><br></div>로 개행처리를 해서 댓글에 저 태그가 그대로 남는 버그 발생
    그렇다고 contenteditable을 plaintext-only로 하면 이모티콘이 안되므로 이벤트를 가로채서 대신 \n을 집어넣게 만들기로함
    document.execCommand는 더 이상 표준이 아니라고 왠만하면 쓰지말라고해서 입력 커서를 조작하는 식으로 해결
    */
    // 키 입력이 엔터라면
    if(event.keyCode==13) {
        // 이벤트 가로챔
        event.preventDefault();
        // 입력커서 가져옴
        const selection = window.getSelection(),
        // 커서 범위 가져옴
        range = selection.getRangeAt(0),
        // 집어넣을 개행문자 노드 생성
        newline = document.createTextNode('\n');
        // 현재 커서 범위에 만든 개행문자 집어넣음
        range.insertNode(newline);
        // 그냥 집어넣기만 하면 커서가 자동으로 이동하지 않기 때문에
        // 커서의 위치를 집어넣은 노드의 다음으로 이동함
        range.setStartAfter(newline);
        range.setEndAfter(newline);
        // 커서 선택범위를 전부 해제하고
        selection.removeAllRanges();
        // 선택범위를 현재위치로
        selection.addRange(range);
    }
}