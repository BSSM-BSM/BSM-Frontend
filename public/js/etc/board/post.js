const post = Vue.reactive({
    mode: 'view',
    post: {
        permission: false,
        usercode: 0,
        title: '',
        date: '',
        hit: '',
        comments: '',
        nickname: '',
        content: '',
        totalLike: 0,
        like: 0,
    },
    categoryList: {},
    category: 'normal'
})
const comment = Vue.reactive({
    comments: [],
    focus: 0
})

const postView = Vue.createApp({
    components: {
        'comment-item': {
            name: 'comment-item',
            template:'#comment_item_template',
            props: {
                item: Object
            },
            data() {
                return {
                    comment
                }
            },
            methods: {
                focusComment: function(focus) {
                    comment.focus = focus;
                }
            },
            computed: {
                isParent: function() {
                    return this.item.child && this.item.child.length
                }
            }
        }
    },
    data() {
        return {
            ...post,
            comment
        }
    },
    methods: {
        focusComment: function(focus) {
            comment.focus = focus;
        },
        changeEditorCategory: function(category) {
            this.category = category;
        }
    },
    computed: {
        isParent: function() {
            return this.item.child && this.item.child.length;
        }
    },
    updated() {
        this.$nextTick(function() {
            [
                ...$$('.post_content img[e_id]:not(.emoticon)'),
                ...$$('.comment_item_content img[e_id]:not(.emoticon)')
            ].forEach(e => {
                e.src=`/resource/board/emoticon/${e.getAttribute('e_id')}/${e.getAttribute('e_idx')}.${e.getAttribute('e_type')}`;
                e.classList.add('emoticon');
                e.setAttribute('onClick', `loadEmoticonInfo(${e.getAttribute('e_id')})`);
            });
            editor = $(`.comment_write.write_${comment.focus} .write`);
        })
    }
}).mount('#post');

const boardPostChange = (changePostNo, changeUrlPath = true) => {
    if (postNo == changePostNo && lastBoardType == boardType) {
        postWindowOpen(changeUrlPath);
        return;
    }
    postNo = changePostNo;
    lastBoardType = boardType;
    postRefresh(changeUrlPath);
}

const postWindowOpen = (changeUrlPath = true) => {
    $('#post').classList.remove('hide');
    $('body').classList.add('no_scroll');
    if (changeUrlPath) {
        const newUrl = `/board/${boardType}/${postNo}${window.location.search}`;
        newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    }
    allMenuBtn.el.classList.add('go_back');
    allMenuBtn.setAction(() => {
        postWindowClose();
    });
}

const postWriteWindowOpen = () => {
    postView.mode = 'write';
    postNo = null;
    postWindowOpen(false);
}

const postWindowClose = (changeUrlPath = true) => {
    $('#post').classList.add('hide');
    $('body').classList.remove('no_scroll');
    if (changeUrlPath) {
        const newUrl = `/board/${boardType}${window.location.search}`;
        newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    }
    allMenuBtn.setDefault();
}

const postRefresh = (changeUrlPath = true) => {
    progress(20);
    ajax({
        method:'get',
        url:`/post/${boardType}/${postNo}`,
        callback:(data) => {
            postWindowOpen(changeUrlPath);
            $('#post').scrollTop = 0;
            postView.post = {...data.post};
            postView.mode = 'view';
            window.setTimeout(() => {
                // iframe영상을 화면에 꽉채우게 하기위해서 컨테이너로 감싸줌
                // 바로 실행하면 요소가 dom에 렌더링되기 전에 실행되므로 딜레이를 줘서 실행
                $$('.note-video-clip').forEach(e => {
                    e.outerHTML = `<div class="video-container">${e.outerHTML}</div>`;
                });
                Prism.highlightAll();
            },1);
            progress(50);
            commentRefresh();
        }
    })
}

const postDelete = () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) {
        return;
    }
    ajax({
        method:'delete',
        url:`/post/${boardType}/${postNo}`,
        callback:() => {
            window.location.href = `/board/${boardType}`;
        }
    })
}

const postEdit = () => {
    postView.mode = 'write';
    postEditorInit();
}

const likeSend = (like) => {
    ajax({
        method:'post',
        url:`/like/${boardType}/${postNo}`,
        payload:{
            like
        },
        callback:(data) => {
            postView.post.like = data.like;
            postView.post.totalLike = data.totalLike;
        }
    })
}

const commentRefresh = () => {
    progress(50);
    ajax({
        method:'get',
        url:`/comment/${boardType}/${postNo}`,
        callback:(data) => {
            comment.comments = data.comments;
            comment.focus = 0;
        }
    })
}

const commentDelete = commentIndex => {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
    }
    ajax({
        method:'delete',
        url:`/comment/${boardType}/${postNo}/${commentIndex}`,
        callback:() => {
            commentRefresh();
        }
    })
}

const commentWrite = (depth, parentIdx) => {
    depth = parseInt(depth)+1;
    let url;
    if (parentIdx<1) {
        url = `/comment/${boardType}/${postNo}`;
    } else {
        url = `/comment/${boardType}/${postNo}/${depth}/${parentIdx}`;
    }
    ajax({
        method:'post',
        url,
        payload:{
            comment:$(`.comment_write.write_${parentIdx} .write`).innerHTML,
        },
        callback:() => {
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
    if (event.keyCode==13) {
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

const copyPostEl = $('#copy_post');
copyPostEl.onclick = () => {
    navigator.clipboard.writeText($('.post_content > div').innerText.replaceAll(' ', ' '));
    showToast('복사되었습니다');
}