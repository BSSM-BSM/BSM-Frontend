const clientId = new URLSearchParams(location.search).get("clientId");
const redirectURI = new URLSearchParams(location.search).get("redirectURI");
document.addEventListener('DOMContentLoaded', () => {
    popup.noClose = true;
    if (user.isLogin) {
        authentication();
    } else {
        $('#login_box .popup_close_button')? $('#login_box .popup_close_button').style.display = 'none': undefined;
        showLoginBox();
        account.loginCallback = () => {
            authentication();
        }
    }
    $('#oauth_box .main_button').onclick = () => {
        authorization();
    }
    $$(':is(#oauth_authentication_failed_box, #oauth_authorization_failed_box) .main_button').forEach(e => e.onclick = () => {
        authentication();
    })
});

const oauthBoxView = Vue.createApp({
    data() {
        return {
            serviceDomain: '',
            serviceName: '',
            scope: [],
        }
    }
}).mount('#oauth_box');

const authentication = () => {
    ajax({
        method: 'get',
        url: `/oauth/authentication?clientId=${clientId}&redirectURI=${redirectURI}`,
        errorCallback:() => {
            popupOpen($('#oauth_authentication_failed_box'));
        },
        callback:(data) => {
            if (data.authorized) {
                return authorization();
            }
            oauthBoxView.serviceDomain = data.domain;
            oauthBoxView.serviceName = data.serviceName;
            oauthBoxView.scope = data.scope;
            popupOpen($('#oauth_box'));
            popupClose($('#oauth_authentication_failed_box'));
            popupClose($('#oauth_authorization_failed_box'));
        }
    })
}

const authorization = () => {
    ajax({
        method: 'post',
        url: '/oauth/authorization',
        payload: {
            clientId,
            redirectURI
        },
        errorCallback:() => {
            popupOpen($('#oauth_authorization_failed_box'));
            popupClose($('#oauth_box'));
        },
        callback:(data) => {
            window.location = data.redirect;
        }
    })
}