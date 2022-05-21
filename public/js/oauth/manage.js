document.addEventListener('DOMContentLoaded', () => {
    $('#oauth-load_client').onclick = () => {
        loadClientList();
    }
    $('#oauth-create_client').onclick = () => {
        popupOpen($('#create_client_box'));
    }
    $('#create_client_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        const scopeList = [];
        const scopeListEl = $$('.oauth-create_client_scope:checked');
        if (!scopeListEl.length) {
            return showAlert('사용할 정보를 1개 이상 선택해주세요.');
        }
        scopeListEl.forEach(e => {
            scopeList.push(e.dataset.scope_info);
        });
        createClient(
            data.domain.value,
            data.redirect_uri.value,
            data.service_name.value,
            scopeList
        );
    }
})

const oauthClientView = Vue.createApp({
    data() {
        return {
            clientList: []
        }
    },
    methods: {
        deleteClient: function(clientId) {
            if (!confirm('해당 클라이언트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!')) {
                return;
            }
            ajax({
                method: 'delete',
                url: `/oauth/client/${clientId}`,
                callback:() => {
                    loadClientList();
                }
            })
        }
    }
}).mount('#oauth-client_list');

const oauthCreateClientBoxView = Vue.createApp({
    data() {
        return {
            scopeInfo: [],
            domain: ''
        }
    }
}).mount('#create_client_box');

const loadClientList = () => {
    ajax({
        method: 'get',
        url: '/oauth/client',
        callback:(data) => {
            oauthClientView.clientList = data.clientList;
        }
    })
}

const getScopeInfo = () => {
    ajax({
        method: 'get',
        url: '/oauth/scopeInfo',
        callback:(data) => {
            oauthCreateClientBoxView.scopeInfo = data.scopeInfoList;
        }
    })
}

const createClient = (
    domain,
    redirectURI,
    serviceName,
    scope
) => {
    ajax({
        method: 'post',
        url: '/oauth/client',
        payload: {
            domain,
            redirectURI,
            serviceName,
            scope
        },
        callback:() => {
            popupClose($('#create_client_box'));
            loadClientList();
        }
    })
}

loadClientList();
getScopeInfo();