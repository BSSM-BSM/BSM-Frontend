if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
let refresh = false;
const memberLevel=[
    '',
    '[사감]',
    '[교사]',
    '[관리자]'
]
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const themeInit = () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = localStorage.getItem('theme');
    if(theme=='light' || theme=='dark'){
        if(theme=='dark'){
            $(':root').classList.add('dark');
        }else{
            $(':root').classList.remove('dark');
        }
    }else{
        if(prefersDarkScheme.matches){
            localStorage.setItem('theme', 'dark');
            $(':root').classList.add('dark');
        }else{
            localStorage.setItem('theme', 'light');
            $(':root').classList.remove('dark');
        }
    }
}
const toggleTheme = () => {
    const theme = localStorage.getItem('theme');
    if(!(theme=='light' || theme=='dark')){
        themeInit();
        return;
    }
    if(theme=='dark'){
        $(':root').classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }else{
        $(':root').classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}
themeInit();

let popup = {
    noPopupClose: false,

    get noClose(){
        return this.noPopupClose;
    },
    set noClose(flag){
        this.noPopupClose = flag;
        if(flag){
            $('.dim.popup_close').classList.remove('on');
        }else{
            if($$('.popup.on').length<1){
                $('.dim.popup_close').classList.add('on');
            }
        }
    }
};
const popupOpen = (element) => {
    element.classList.add('on');
    if(!$('.dim.popup_close')){
        return;
    }
    if(popup.noClose){
        return;
    }
    if($$('.popup.on').length>=1){
        $('.dim.popup_close').classList.add('on');
    }
}
const popupClose = (element) => {
    element.classList.remove('on')
    if(!$('.dim.popup_close')){
        return;
    }
    if($$('.popup.on').length<1){
        $('.dim.popup_close').classList.remove('on');
    }
}

let progressBar, progressBarFlag=0;
const progress = per => {
    if(progressBar.style.left=="0%"){
        if(per<100){
            progressBarFlag+=1;
            progressBar.style.left='-100%';
            progressBar.classList.add('on');
            window.setTimeout(()=>{
                progressBar.style.left=`${per-100}%`;
            }, 1)
        }
    }else{
        if(per>=100){
            window.setTimeout(()=>{
                if(progressBarFlag-1==0){
                    progressBar.classList.add('remove');
                }
                window.setTimeout(()=>{
                    progressBarFlag-=1;
                    if(progressBarFlag<1){
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

window.addEventListener('DOMContentLoaded', () => {
    if($('.dim.popup_close')){
        $('.dim.popup_close').addEventListener('click', ()=>{
            $$('.popup').forEach(e => {
                popupClose(e);
            });
        })
    }
    progressBar = $('.progress');
})

const decodeBase64 = (str) => {
    // base64를 decoding하는 함수인 atob는 -나 _가 들어있으면 작동안하므로 각각 +, /로 변환해줌
    // atob로 디코드 해도 한글은 제대로 나오지 않으므로 escape로 유니코드로 변환후 decodeURI로 복호화함
    return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
}

const instance = axios.create({
    baseURL:'https://bssm.kro.kr/api/',
    headers:{'Pragma':'no-cache'},
    timeout:3000,
})
const ajax = async ({method, url, payload, success, error}) => {
    $('.loading').classList.add("on");
    let res
    try{
        const get = async () => {
            switch (method){
                case 'get':
                    return instance.get(url, payload);
                case 'post':
                    return instance.post(url, payload);
                case 'put':
                    return instance.put(url, payload);
                case 'delete':
                    return instance.delete(url, payload);
            }
        }
        res = await get(method)
        res = res.data
        if(res.status!=1){
            if(res.status==4&&res.subStatus==4){
                // 액세스 토큰 갱신 후 로그인 상태를 갱신함-
                const jsonData = JSON.parse(decodeBase64(res.token.split('.')[1]));
                member = {
                    isLogin:jsonData.isLogin,
                    code:jsonData.memberCode,
                    id:jsonData.memberId,
                    nickname:jsonData.memberNickname,
                    level:jsonData.memberLevel,
                    grade:jsonData.grade,
                    classNo:jsonData.classNo,
                    studentNo:jsonData.studentNo,
                }
                if(headerAccountView){
                    headerAccountView.member = member;
                }
                // 원래 하려던 요청을 다시 보냄
                return ajax ({method:method, url:url, payload:payload, success:success, error:error});
            }
            if(error && error(res.status, res.subStatus, res.msg)){
                loadingInit()
                return;
            }
            loadingInit()
            statusCode(res.status, res.subStatus, res.msg);
            return;
        }
    }catch(err){
        console.log(err);
        showAlert(err);
        loadingInit();
        return;
    }
    try{
        if(success){
            success(res);
        }
    }catch(err) {
        console.log(err);
        loadingInit();
        statusCode(0, 0);
        return;
    }
    loadingInit();
}
const loadingInit = () => {
    $('.loading').classList.remove("on");
    progress(100);
}