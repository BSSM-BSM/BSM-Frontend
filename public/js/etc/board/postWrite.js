let boardType = window.location.pathname.split('/')[3];
let postNo = window.location.pathname.split('/')[4];

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
    skin: 'oxide-dark',
    content_css: 'dark',
    plugins: [
        'code','autolink','lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','media','table','wordcount'
    ],
    toolbar: 'undo redo | bold italic | alignleft alignright aligncenter alignjustify | image media | preview code',
    relative_urls: false,
    convert_urls: false,
    init_instance_callback: loadPost
});