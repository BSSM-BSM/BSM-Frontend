if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1)){
    document.getElementsByClassName('notice_bar')[0].innerHTML+='<div class="notice red">현재 사용하시는 브라우저는 정상적으로 지원되지 않습니다</div>';
}
if(navigator.platform && /Mac|iPad|iPhone|iPod/.test(navigator.platform)){
    $$('.notice_bar')[0].innerHTML+='<div class="notice yellow">IOS환경에서는 제대로 동작하지 않을 수 있습니다.</div>';
}
window.addEventListener('online', ()=>{
    if($$('.notice_bar .offline').length){
        $$('.notice_bar .offline')[0].remove()
    }
})
window.addEventListener('offline', ()=>{
    $$('.notice_bar')[0].innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
})
if(!window.navigator.onLine){
    $$('.notice_bar')[0].innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
}
let progressBar, progressBarFlag=0;
window.addEventListener('DOMContentLoaded', () => {
    const header = $$('header')[0]
    // 일정 이상 스크롤할 시 상단 메뉴바가 작아짐
    window.addEventListener('scroll', () => {
        if(window.scrollY >= 51){
            header.classList.add('on')
        }else{
            header.classList.remove('on')
        }
    })
    progressBar = $$('.progress')[0];
})
const progress = per => {
    if(progressBar.style.left=="0%"){
        progressBarFlag+=1;
        progressBar.style.left='-100%';
        progressBar.classList.add('on');
        window.setTimeout(()=>{
            progressBar.style.left=`${per-100}%`;
        }, 1)
    }else{
        if(per>=100){
            window.setTimeout(()=>{
                if(progressBarFlag-1==0){
                    progressBar.classList.add('remove');
                }
                window.setTimeout(()=>{
                    progressBarFlag-=1;
                    if(progressBarFlag==0){
                        progressBar.classList.remove('on');
                        progressBar.classList.remove('remove');
                    }
                }, 450)
            }, 1000);
        }else{
            progressBar.classList.add('on');
        }
        progressBar.style.left=`${per-100}%`;
    }
}
const popupOpen = (element) => {
    if($$('.popup.on').length<1){
        $$('.dim.popup_close')[0].classList.add('on')
    }
    element.classList.add('on')
}
const popupClose = (element) => {
    element.classList.remove('on')
    if($$('.popup.on').length<1){
        $$('.dim.popup_close')[0].classList.remove('on')
    }
}
$$('.dim.popup_close')[0].addEventListener('click', ()=>{
    $$('.popup').forEach(e => {
        popupClose(e);
    });
})


$$('.searchBox')[0].addEventListener('click', () => {
    $$('.searchResult')[0].classList.add('on')
    $$('.search_close')[0].classList.add('on')
})
$$('.search_close')[0].addEventListener('click', () => {
    $$('.searchResult')[0].classList.remove('on')
    $$('.search_close')[0].classList.remove('on')
})
const searchView = new Vue({
    el:'.searchResult',
    data:{
        boardResult:[],
        anonymousResult:[]
    }
})
const search = ()=>{
    $.ajax({
        type:'GET',
        url:apiUrl+'/search/board/'+$('.searchQuery').val(),
        cache:false,
        success:data=>{
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                searchView.boardResult = data.arrSearchResult;
            }
        }
    });
    $.ajax({
        type:'GET',
        url:apiUrl+'/search/anonymous/'+$('.searchQuery').val(),
        cache:false,
        success:data=>{
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                searchView.anonymousResult = data.arrSearchResult;
            }
        }
    });
}

const instance = axios.create({
    baseURL:'https://bssm.kro.kr/api/',
    timeout:3000,
})
const ajax = async ({method, url, payload, callBack, statusCallBack}) => {
    $$('.loading')[0].classList.add("on");
    let res
    try{
        const get = async () => {
            switch (method){
                case 'get':
                    return await instance.get(url, payload)
                case 'post':
                    return await instance.post(url, payload)
                case 'put':
                    return await instance.put(url, payload)
                case 'delete':
                    return await instance.delete(url, payload)
            }
        }
        res = await get(method)
        res = res.data
        if(res.status!=1){
            if(statusCallBack && statusCallBack(res.status, res.subStatus)){
                return;
            }
            error_code(res.status, res.subStatus);
        }
    }catch(err){
        $$('.loading')[0].classList.remove("on");
        error_code(0, 0)
        return;
    }
    const data = res
    callBack(data)
    $$('.loading')[0].classList.remove("on");
}