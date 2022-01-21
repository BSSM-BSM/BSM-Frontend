if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
let refresh = true;
const apiUrl = '/api';
const memberLevel=[
    '',
    '<span class="member_admin">[룸메]</span> ',
    '<span class="member_admin">[교사]</span> ',
    '<span class="member_admin">[관리자]</span> '
]
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const themeInit = () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = localStorage.getItem('theme');
    if(theme=='light' || theme=='dark'){
        if(theme=='dark'){
            $$(':root')[0].classList.add('dark');
        }else{
            $$(':root')[0].classList.remove('dark');
        }
    }else{
        if(prefersDarkScheme.matches){
            localStorage.setItem('theme', 'dark');
            $$(':root')[0].classList.add('dark');
        }else{
            localStorage.setItem('theme', 'light');
            $$(':root')[0].classList.remove('dark');
        }
    }
}
const toggleTheme = () => {
    const theme = localStorage.getItem('theme');
    if(!(theme=='light' || theme=='dark')){
        themeInit()
        return;
    }
    if(theme=='dark'){
        $$(':root')[0].classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }else{
        $$(':root')[0].classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}
themeInit()

const popupOpen = (element) => {
    if($('.dim.popup_close')){
        if($$('.popup.on').length<1){
            $('.dim.popup_close').classList.add('on')
        }
    }
    element.classList.add('on')
}
const popupClose = (element) => {
    element.classList.remove('on')
    if($('.dim.popup_close')){
        if($$('.popup.on').length<1){
            $('.dim.popup_close').classList.remove('on')
        }
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
})

const instance = axios.create({
    baseURL:'https://bssm.kro.kr/api/',
    headers:{'Pragma':'no-cache'},
    timeout:3000,
})
const ajax = async ({method, url, payload, callBack, errorCallBack}) => {
    $('.loading').classList.add("on");
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
            if(errorCallBack && errorCallBack(res.status, res.subStatus)){
                return;
            }
            $('.loading').classList.remove("on");
            progress(100)
            statusCode(res.status, res.subStatus);
            return;
        }
    }catch(err){
        console.log(err)
        $('.loading').classList.remove("on");
        progress(100)
        statusCode(0, 1)
        return;
    }
    try{
        callBack(res)
    }catch(err) {
        console.log(err)
        $('.loading').classList.remove("on");
        progress(100)
        statusCode(0, 0)
        return;
    }
    $('.loading').classList.remove("on");
    progress(100)
}