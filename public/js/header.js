if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1)){
    document.getElementsByClassName('notice_bar').innerHTML+='<div class="notice red">현재 사용하시는 브라우저는 정상적으로 지원되지 않습니다</div>';
}
if(navigator.platform && /Mac|iPad|iPhone|iPod/.test(navigator.platform)){
    $('.notice_bar').innerHTML+='<div class="notice yellow">IOS환경에서는 제대로 동작하지 않을 수 있습니다.</div>';
}
window.addEventListener('online', ()=>{
    if($$('.notice_bar .offline').length){
        $('.notice_bar .offline').remove()
    }
})
window.addEventListener('offline', ()=>{
    $('.notice_bar').innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
})
if(!window.navigator.onLine){
    $('.notice_bar').innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
}
window.addEventListener('DOMContentLoaded', () => {
    const header = $('header')
    // 일정 이상 스크롤할 시 상단 메뉴바가 작아짐
    window.addEventListener('scroll', () => {
        if(window.scrollY >= 51){
            header.classList.add('on')
        }else{
            header.classList.remove('on')
        }
    })
})

$('.searchBox').addEventListener('click', () => {
    $('.searchResult').classList.add('on')
    $('.search_close').classList.add('on')
})
$('.search_close').addEventListener('click', () => {
    $('.searchResult').classList.remove('on')
    $('.search_close').classList.remove('on')
})
const searchView = new Vue({
    el:'.searchResult',
    data:{
        boardResult:[],
        anonymousResult:[]
    }
})
const search = ()=>{
    ajax({
        method:'get',
        url:`/search/board/${$('.searchQuery').value}`,
        callBack:data=>{
            searchView.boardResult = data.arrSearchResult;
        }
    })
    ajax({
        method:'get',
        url:`/search/anonymous/${$('.searchQuery').value}`,
        callBack:data=>{
            searchView.anonymousResult = data.arrSearchResult;
        }
    })
}