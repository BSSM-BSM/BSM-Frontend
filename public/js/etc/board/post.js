let postNo = window.location.pathname.split('/')[3];
const boardPostChange = (changePostMo) => {
    postNo=changePostMo;
    history.pushState(null, null, `/board/${boardType}/${postNo}${window.location.search}`)
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
            return this.item.child && this.item.child.length
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
    progress(20)
    ajax({
        method:'get',
        url:`/post/${boardType}/${postNo}`,
        callBack:data=>{
            $('.post').classList.remove('hide')
            $('html').scrollTop=0;
            postView.permission=data.permission;
            postView.memberCode=data.memberCode;
            postView.memberProfile=`/resource/member/profile_images/profile_${data.memberCode}.png`;
            postView.memberInfoUrl=`/memberinfo/${data.memberCode}`
            postView.postTitle=data.postTitle;
            postView.postDate=data.postDate;
            postView.postHit=data.postHit;
            postView.postComments=data.postComments;
            postView.memberNickname=data.memberNickname;
            postView.postContent=data.postContent;
            postView.like=data.like;
            postView.postLike=data.postLike;
            // window.setTimeout(()=>{
            //     // iframe영상을 화면에 꽉채우게 하기위해서 컨테이너로 감싸줌
            //     // 바로 실행하면 요소가 dom에 렌더링되기 전에 실행되므로 딜레이를 줘서 실행
            //     $('.note-video-clip').each((i, e) => {
            //         $(e).wrap('<div class="video-container"></div>');
            //     });
            // },1);
            progress(50)
            commentRefresh();
        }
    })
}
const postDelete = () => {
    ajax({
        method:'delete',
        url:`/post/${boardType}/${postNo}`,
        errorCallBack:()=>{
            refresh = false;
            return false;
        },
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
        errorCallBack:()=>{
            refresh = false;
            return false;
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
    progress(50)
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
        errorCallBack:()=>{
            refresh = false;
            return false;
        },
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
        errorCallBack:()=>{
            refresh = false;
            return false;
        },
        callBack:()=>{
            $(`.comment_write.write_${parentIdx} .write`).innerHTML='';
            commentRefresh();
        }
    })
}
let editor = null;
const focusEditor = () => {
    if(editor){
        editor.focus({preventScroll: true});
    }
}
const emoticonView = new Vue({
    el:'.emoticon_popup',
    data:{
        emoticon:[],
        emoticonIdx:0,
        emoticonInfo:{}
    },
    methods:{
        selectEmoticon:function(select){
            this.emoticonIdx=select;
        }
    },
})
const insertEmoticon = (id, idx, type) => {
    focusEditor();
    document.execCommand("insertHTML", true, `<img src="/resource/board/emoticon/${id}/${idx}.${type}" e_id="${id}" e_idx="${idx}" e_type="${type}" class="emoticon">`)
}
const loadEmoticon = () => {
    ajax({
        method:'get',
        url:`/emoticon`,
        callBack:data=>{
            emoticonView.emoticon=data.emoticon;
        }
    })
    popupOpen($('.insert_emoticon_box'))
}
const loadEmoticonInfo = (id) => {
    ajax({
        method:'get',
        url:`/emoticon/${id}`,
        callBack:data=>{
            if(data.emoticon){
                data.emoticon.created=data.emoticon.created.split(' ')[0];
                emoticonView.emoticonInfo=data.emoticon;
            }else{
                showAlert('이모티콘 정보를 불러올 수 없습니다');
            }
        }
    })
    popupOpen($('.emoticon_info_box'))
}