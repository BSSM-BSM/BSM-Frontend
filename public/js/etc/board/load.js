let boardType = null;
let lastBoardType = null;
let postNo = null;
let page = null;
let limit = null;

const boardInit = () => {
    boardType = window.location.pathname.split('/')[2];
    postNo = window.location.pathname.split('/')[3];
    page = new URLSearchParams(location.search).get("page");
    limit = new URLSearchParams(location.search).get("limit");
    if (limit == null) {
        limit = 15;
    } else {
        limit = parseInt(limit);
    }
    if (page == null) {
        page = 1;
    } else {
        page = parseInt(page);
    }
    $('.board_limit .select').innerText = limit+"개";
    if (postNo != null) {
        boardPostChange(postNo, false);
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