window.addEventListener('online', () => {
    if ($$('.notice_bar .offline').length) {
        $('.notice_bar .offline').remove()
    }
})
window.addEventListener('offline', () => {
    $('.notice_bar').innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
})
if (!window.navigator.onLine) {
    $('.notice_bar').innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
}
window.addEventListener('DOMContentLoaded', () => {
    const header = $('header')
    // 일정 이상 스크롤할 시 상단 메뉴바가 작아짐
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('on');
        } else {
            header.classList.remove('on');
        }
    })
})

const headerAccountView = Vue.createApp({
    data() {
        return {
            user,
            userLevel,
        }
    }
}).mount('.user_menu');

const menuAccountView = $('#quick_menu_list .user')? Vue.createApp({
    data() {
        return {
            user
        }
    }
}).mount('#quick_menu_list .user'): undefined;

const allMenuBtn = {
    el: $('#all_menu'),
    setAction(callback) {
        this.el.onclick = (event) => {
            try {
                callback(event);
            } catch (err) {
                showAlert('알 수 없는 에러가 발생하였습니다');
            }
        }
    },
    setDefault() {
        this.el.onclick = () => {
            $('.side_menu').classList.add('on');
        }
        this.el.classList = 'top_menu_item';
    }
}
allMenuBtn.setDefault();