const clientId = new URLSearchParams(location.search).get("clientId");
const redirectUri = new URLSearchParams(location.search).get("redirectUri");
document.addEventListener('DOMContentLoaded', () => {
    $('#oauth_box .main_button').onclick = () => {
        authorization();
    }
    $('#oauth_authentication_failed_box .main_button').onclick = () => {
        authentication();
    }
    $('#oauth_authorization_failed_box .main_button').onclick = () => {
        authorization();
    }
});

const oauthBoxView = new Vue({
    el: '#oauth_box',
    data: {
        serviceDomain: '',
        serviceName: '',
        scope: [],
    }
})

const authentication = () => {
    ajax({
        method: 'get',
        url: `/oauth/authentication?clientId=${clientId}&redirectUri=${redirectUri}`,
        errorCallback:() => {
            popupOpen($('#oauth_authentication_failed_box'));
        },
        callback:(data) => {
            oauthBoxView.serviceDomain = data.domain;
            oauthBoxView.serviceName = data.serviceName;
            oauthBoxView.scope = data.scope;
            popupOpen($('#oauth_box'));
        }
    })
}

const authorization = () => {
    ajax({
        method: 'post',
        url: '/oauth/authorization',
        payload: {
            clientId: new URLSearchParams(location.search).get("clientId"),
            redirectUri: new URLSearchParams(location.search).get("redirectUri")
        },
        errorCallback:() => {
            popupOpen($('#oauth_authorization_failed_box'));
        },
        callback:(data) => {
            window.location = data.redirect;
        }
    })
}