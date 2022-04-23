document.addEventListener('DOMContentLoaded', () => {
    $('#signup_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        signUp(
            data.id.value,
            data.pw.value,
            data.pw_check.value,
            data.nickname.value,
            data.authcode.value
        );
    }
    $('#pw_reset_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        pwEdit(
            data.pw.value,
            data.pw_check.value,
        )
    }
    $('#pw_reset_mail_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        pwResetMail(
            data.id.value
        )
    }
    $('#authcode_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        authcodeMail(
            data.enrolled.value,
            data.grade.value,
            data.class_no.value,
            data.student_no.value,
            data.name.value
        )
    }
    $('#find_id_box').onsubmit = (event) => {
        event.preventDefault();
        const data = event.target;
        findIdMail(
            data.enrolled.value,
            data.grade.value,
            data.class_no.value,
            data.student_no.value,
            data.name.value
        )
    }
});

const showLoginBox = () => {
    loginBoxView.init();
    popupOpen($('#login_box'));
}
const loginBoxView = new Vue({
    el:'#login_box',
    data:{
        msg:'로그인',
        step:0,
        id:'',
    },
    methods:{
        init:function () {
            this.step=0;
            this.msg='로그인';
            this.id='';
        },
        step1:function (event) {
            event.preventDefault();
            this.step=1;
            this.msg=`${this.id}(으)로 계속`;
        },
        step2:function (event) {
            event.preventDefault();
            console.log(event)
            if (event.target?.pw?.value === undefined) {
                showAlert("알 수 없는 에러가 발생하였습니다");
                return;
            }
            this.msg=`인증 중...`;
            account.login(this.id, event.target.pw.value);
        }
    },
})

const account = {
    callbacks: {
        login: function() {},
        pwEdit: function() {}
    },

    login(id, pw) {
        return login(id, pw, this.callbacks.login);
    },
    set loginCallback(callback) {
        this.callbacks.login = callback;
    },
    pwEdit(pw, pwCheck) {
        return pwEdit(pw, pwCheck, this.callbacks.pwEdit);
    },
    set pwEditCallback(callback) {
        this.callbacks.pwEdit = callback;
    }
}

const login = (id, pw, callback) => {
    ajax({
        method:'post',
        url:`/account/login`,
        payload:{
            id,
            pw
        },
        error:(data) => {
            if (data.statusCode == 400) {
                loginBoxView.init();
                showAlert('id 또는 password가 맞지 않습니다.');
                return true;
            }
            return false;
        },
        success:(data) => {
            // 액세스 토큰 갱신 후 로그인 상태를 갱신함
            const jsonData = JSON.parse(decodeBase64(data.token.split('.')[1]));
            saveUserInfo({
                isLogin: true,
                level: jsonData.level,
                code: jsonData.code,
                id: jsonData.id,
                nickname: jsonData.nickname,
                enrolled: jsonData.enrolled,
                grade: jsonData.grade,
                classNo: jsonData.classNo,
                studentNo: jsonData.studentNo,
                name: jsonData.name
            });
            showToast('로그인에 성공하였습니다.');
            popupClose($('#login_box'));
            loginBoxView.init();

            if (callback) {
                callback(data);
            }
        }
    })
}
const logout = () => {
    ajax({
        method:'delete',
        url:`/account/logout`,
        success:() => {
            saveUserInfo({
                isLogin: false,
                level: null,
                code: null,
                id: null,
                nickname: null,
                enrolled: null,
                grade: null,
                classNo: null,
                studentNo: null,
                name: null
            });
            showToast('로그아웃 되었습니다.');
        }
    })
}
const signUp = (
    id,
    pw,
    pw_check,
    nickname,
    authcode
) => {
    if (!confirm('회원 가입하시겠습니까?')) {
        return;
    }
    ajax({
        method:'post',
        url:`/account`,
        payload:{
            id,
            pw,
            pw_check,
            nickname,
            authcode,
        },
        success:() => {
            showToast('회원가입이 완료되었습니다.\n다시 로그인 해주세요.');
            popupClose($('#sign_up_box'));
        }
    })
}
const pwEdit = (pw, pw_check, callback) => {
    if (!confirm('비밀번호를 재설정하시겠습니까?')) {
        return;
    }
    ajax({
        method:'put',
        url:'/account/pw',
        payload:{
            pw,
            pw_check,
        },
        success:() => {
            showToast('비밀번호 재설정이 완료되었습니다.');
            popupClose($('.pw_reset_box'));
            popupOpen($('.login_box'));
            saveUserInfo({
                isLogin: false,
                level: null,
                code: null,
                id: null,
                nickname: null,
                enrolled: null,
                grade: null,
                classNo: null,
                studentNo: null,
                name: null
            });

            if (callback) {
                callback();
            }
        }
    })
}
const pwResetMail = (id) => {
    ajax({
        method:'post',
        url:'/account/mail/pw',
        payload:{
            id
        },
        success:() => {
            showToast('비밀번호 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.pw_reset_mail_box'));
            popupOpen($('.login_box'));
        }
    })
}
const authcodeMail = (
    student_enrolled,
    student_grade,
    student_class,
    student_no,
    student_name
) => {
    ajax({
        method:'post',
        url:`/account/mail/authcode`,
        payload:{
            student_enrolled,
            student_grade,
            student_class,
            student_no,
            student_name
        },
        success:() => {
            showToast('인증코드 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.valid_code_box'));
        }
    })
}

const findIdMail = (
    student_enrolled,
    student_grade,
    student_class,
    student_no,
    student_name
) => {
    ajax({
        method:'post',
        url:'/account/mail/id',
        payload:{
            student_enrolled,
            student_grade,
            student_class,
            student_no,
            student_name
        },
        success:() => {
            showToast('ID 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('#find_id_box'));
            popupOpen($('.login_box'));
        }
    })
}