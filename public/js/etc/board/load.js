let boardType = '';
let lastBoardType = '';
let postNo = '';
let page = '';
let limit = '';

const boardInit = () => {
    boardType = window.location.pathname.split('/')[2];
    lastBoardType = '';
    postNo = window.location.pathname.split('/')[3];
    page = new URLSearchParams(location.search).get("page");
    limit = new URLSearchParams(location.search).get("limit");
    if (limit == null) {
        limit = 15;
    }
    $('.board_limit .select').innerText = limit+"개";
    if (postNo != null) {
        postWindowOpen(false);
    } else {
        postWindowClose(false);
    }
    boardRefresh();
}

window.addEventListener('DOMContentLoaded', () => {
    boardInit();
    $$('.menu_community_link').forEach(e => {
        e.onclick = (event) => {
            event.preventDefault();
            $('.side_menu').classList.remove('on');
            boardChange(e.dataset.boardtype);
        }
    })
})

window.addEventListener('popstate',() => {
    boardInit();
});