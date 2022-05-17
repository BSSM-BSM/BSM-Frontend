const oauthClientView = Vue.createApp({
    data() {
        return {
            clientList: []
        }
    }
}).mount('#oauth-client_list');

const loadClientList = () => {
    ajax({
        method: 'get',
        url: '/oauth/client',
        callback:(data) => {
            oauthClientView.clientList = data.clientList;
        }
    })
}

loadClientList();