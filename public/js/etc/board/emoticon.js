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