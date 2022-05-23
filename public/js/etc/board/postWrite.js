const postEditorInit = () => {
    $('#post_write').title.value = '';
    tinymce.activeEditor.setContent('');
    postView.category = 'normal';
    loadPost();
}

const loadPost = () => {
    if (!postNo) {
        return;
    }
    ajax({
        method:'get',
        url: `/post/${boardType}/${postNo}`,
        callback:data => {
            $('#post_write').title.value = data.post.title;
            tinymce.activeEditor.setContent(data.post.content);
        }
    })
}

$('#post_write').addEventListener('submit', (event) => {
    event.preventDefault();
    writePost();
});

const writePost = () => {
    ajax({
        method: postNo? 'put': 'post',
        url: `/post/${boardType}/${postNo??''}`,
        payload: {
            title: $('#post_write').title.value,
            content: tinymce.activeEditor.getContent(),
            category: postView.category
        },
        callback:() => {
            postEditorInit();
            if (postNo) {
                postRefresh();
            } else {
                postWindowClose();
                boardRefresh();
            }
        }
    })
}

tinymce.init({
    selector: '#post_write [name=content]',
    language: 'ko_KR',
    height: 480,
    menubar: true,
    mobile: {
        menubar: true,
    },
    skin: localStorage.getItem('theme')=='dark'? 'oxide-dark': undefined,
    content_css: localStorage.getItem('theme')?? undefined,
    plugins: [
        'code','autolink','lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','media','table','wordcount','codesample'
    ],
    toolbar: 'undo redo codesample | bold italic | alignleft alignright aligncenter alignjustify | emoticon image media | preview code',
    codesample_global_prismjs: true,
    setup: (tinymceEditor) => {
        tinymceEditor.ui.registry.addButton('emoticon', {
            text: '이모티콘',
            onAction: () => {
                editor = tinymce.activeEditor.contentDocument.body;
                loadEmoticon();
            }
        });
    },
    relative_urls: false,
    convert_urls: false,
    extended_valid_elements: 'img[src|class|alt|e_id|e_idx|e_type]',
    images_upload_handler: (blobInfo) => {
        return new Promise((resolve, reject) => {
            let file = new FormData();
            file.append('file', blobInfo.blob());
            ajax({
                method: 'post',
                payload: file,
                url: '/post/image',
                config:{
                    timeout: 0,
                    onUploadProgress: event => {
                        progress((event.loaded*100)/event.total);
                    }
                },
                callback:(data) => resolve(data.filePath),
                errorCallback:(data) => reject({message:data.message,remove:true})
            });
        });
    },
    init_instance_callback: () => {
        const cssLink = document.createElement('link');
        cssLink.href = '/css/etc/board.css';
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        const css = document.createElement('style');
        css.innerHTML = `html{font-size:16px}ul,ol,li{list-style:none}a{text-decoration:none}`;
        tinymce.activeEditor.contentDocument.head.appendChild(cssLink);
        tinymce.activeEditor.contentDocument.head.appendChild(css);
    }
});