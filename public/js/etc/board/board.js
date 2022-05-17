const boardTitle = Vue.createApp({
    data() {
        return {
            boardName: '',
            boardType: '',
            subBoardName: '',
            subBoardType: ''
        }
    }
}).mount('.board_title');
const boardTopMenuView = Vue.createApp({
    data() {
        return {
            categoryList: {},
            category
        }
    }
}).mount('.board_top_menu');
const boardBottomMenuView = Vue.createApp({
    data() {
        return {
            pages:0,
            activePage:0
        }
    }
}).mount('.board_bottom_menu');
const boardView = Vue.createApp({
    data() {
        return {
            posts: [],
            boardType,
            categoryList: {}
        }
    }
}).mount('.board_list');

const boardChange = (changeBoard) => {
    boardType = changeBoard;
    boardView.boardType = boardType;
    boardTopMenuView.category = 'all';
    postWindowClose(false);
    if (page>1) {
        boardPageChange(1);
    } else {
        const newUrl = `/board/${boardType}${window.location.search}`;
        newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
        boardRefresh();
    }
}

const boardPageChange = (changePage) => {
    page = changePage;
    boardBottomMenuView.activePage = page;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('page', String(changePage));
    const newUrl = `/board/${boardType}?`+urlSearch.toString();
    newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    boardRefresh();
}

const boardLimitChange = (changeLimit) => {
    limit = changeLimit;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('limit', String(changeLimit));
    const newUrl = `/board/${boardType}?`+urlSearch.toString();
    newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    boardRefresh();
}

const boardCategoryChange = (changeCategory) => {
    category = changeCategory;
    boardTopMenuView.category = changeCategory;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('category', String(changeCategory));
    const newUrl = `/board/${boardType}?`+urlSearch.toString();
    newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    boardRefresh();
}

const boardRefresh = () => {
    progress(20);
    ajax({
        method: 'get',
        url:`/board/${boardType}?page=${page}&limit=${limit}&category=${category}`,
        errorCallback:() => {
            boardView.posts.splice(0);
            boardBottomMenuView.pages = 0;
        },
        callback:(data) => {
            boardTitle.boardName = data.boardName;
            boardTitle.boardType = boardType;
            boardTitle.subBoardName = data.subBoard.boardName;
            boardTitle.subBoardType = data.subBoard.boardType;
            boardBottomMenuView.activePage = page;
            boardBottomMenuView.pages = data.pages;
            boardTopMenuView.categoryList = data.category;
            postView.categoryList = data.category;

            const date = new Date();
            let today = ""+date.getFullYear();
            // 날짜 2자리수로 맞추기
            if ((date.getMonth()+1)<10) {
                today += '0';
            }
            today+=date.getMonth()+1;
            if (date.getDate()<10) {
                today += '0';
            }
            today+=date.getDate();

            const boardData = data.board;
            boardView.posts.splice(0);
            if (boardData == null) {
                return;
            }
            boardView.boardType = boardType;
            boardView.categoryList = data.category;
            boardView.posts = boardData.map(e => {
                return {
                    ...e,
                    date: e.date.split(' ')[0].replaceAll("-","")==today? e.date.split(' ')[1]: e.date.split(' ')[0],
                }
            });
        }
    })
}