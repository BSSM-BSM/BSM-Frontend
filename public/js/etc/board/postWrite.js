let boardType = window.location.pathname.split('/')[3];
let postNo = window.location.pathname.split('/')[4];

const postEditorInit = () => {
    const cssLink = document.createElement("link");
    cssLink.href = '/css/style.css';
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    tinymce.activeEditor.contentDocument.head.appendChild(cssLink);
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
        },
        callback:() => {
            window.location.href = `/board/${boardType}`;
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
    plugins: [
        'code','autolink','lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','media','table','wordcount'
    ],
    toolbar: 'undo redo | bold italic | alignleft alignright aligncenter alignjustify | emoticon image media | preview code',
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
    images_upload_handler: (blobInfo) => {
        return new Promise((resolve, reject) => {
            let file = new FormData();
            file.append('file', blobInfo.blob());
            ajax({
                method: 'post',
                payload: file,
                url: '/imageUpload',
                config:{
                    timeout: 0,
                    onUploadProgress: event => {
                        progress((event.loaded*100)/event.total);
                    }
                },
                callback:(data) => resolve(data.filePath),
                errorCallback:(data) => reject(data.message)
            });
        });
    },
    init_instance_callback: postEditorInit
});