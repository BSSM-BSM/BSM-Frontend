const showLoginBox = () => {
    loginBoxView.init();
    popupOpen($('.login_box'));
}
const loginBoxView = new Vue({
    el:'.login_box',
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
        step1:function () {
            this.step=1;
            this.msg=`${this.id}(으)로 계속`;
        },
        step2:function () {
            this.msg=`인증 중...`;
            account.login(this.id, $('.login_box .member_pw').value);
        }
    },
})

const account = {
    callbacks: {
        login: function () {},
        pwEdit: function () {}
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
            member_id:id,
            member_pw:pw
        },
        error:(data) => {
            if (data.statusCode == 400) {
                loginBoxView.init();
            }
            return false;
        },
        success:(data) => {
            // 액세스 토큰 갱신 후 로그인 상태를 갱신함
            const jsonData = JSON.parse(decodeBase64(data.token.split('.')[1]));
            saveUserInfo({
                isLogin:jsonData.isLogin,
                code:jsonData.memberCode,
                id:jsonData.memberId,
                nickname:jsonData.memberNickname,
                level:jsonData.memberLevel,
                grade:jsonData.grade,
                classNo:jsonData.classNo,
                studentNo:jsonData.studentNo
            });
            showToast('로그인에 성공하였습니다.');
            popupClose($('.login_box'));
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
                isLogin:false,
                code:null,
                id:null,
                nickname:null,
                level:null,
                grade:null,
                classNo:null,
                studentNo:null,
            });
            showToast('로그아웃 되었습니다.');
        }
    })
}
const signUp = () => {
    if (!confirm('회원 가입하시겠습니까?')) {
        return;
    }
    ajax({
        method:'post',
        url:`/account/signUp`,
        payload:{
            member_id:$('.sign_up .member_id').value,
            member_pw:$('.sign_up .member_pw').value,
            member_pw_check:$('.sign_up .member_pw_check').value,
            member_nickname:$('.sign_up .member_nickname').value,
            code:$('.sign_up .code').value,
        },
        success:() => {
            showToast('회원가입이 완료되었습니다.\n다시 로그인 해주세요.');
            popupClose($('.sign_up_box'));
        }
    })
}
const pwEdit = (pw, pwCheck, callback) => {
    if (!confirm('비밀번호를 재설정하시겠습니까?')) {
        return;
    }
    ajax({
        method:'post',
        url:'/account/pwEdit',
        payload:{
            member_pw:pw,
            member_pw_check:pwCheck,
        },
        success:() => {
            showToast('비밀번호 재설정이 완료되었습니다.');
            popupClose($('.pw_reset_box'));
            popupOpen($('.login_box'));
            saveUserInfo({
                isLogin:false,
                code:null,
                id:null,
                nickname:null,
                level:null,
                grade:null,
                classNo:null,
                studentNo:null,
            });

            if (callback) {
                callback();
            }
        }
    })
}
const pwResetMail = () => {
    ajax({
        method:'post',
        url:'/account/pwResetMail',
        payload:{
            member_id:$('.pw_reset_mail .member_id').value,
        },
        success:() => {
            showToast('비밀번호 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.pw_reset_mail_box'));
            popupOpen($('.login_box'));
        }
    })
}
const validCode = () => {
    ajax({
        method:'post',
        url:`/account/validCode`,
        payload:{
            student_enrolled:$('.valid_code .studentEnrolled').value,
            student_grade:$('.valid_code .studentGrade').value,
            student_class:$('.valid_code .studentClass').value,
            student_no:$('.valid_code .studentNo').value,
            student_name:$('.valid_code .studentName').value,
        },
        success:() => {
            showToast('인증코드 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.valid_code_box'));
        }
    })
}

const findIdMail = () => {
    ajax({
        method:'post',
        url:'/account/findIdMail',
        payload:{
            student_enrolled:$('#find_id_box .studentEnrolled').value,
            student_grade:$('#find_id_box .studentGrade').value,
            student_class:$('#find_id_box .studentClass').value,
            student_no:$('#find_id_box .studentNo').value,
            student_name:$('#find_id_box .studentName').value,
        },
        success:() => {
            showToast('ID 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('#find_id_box'));
            popupOpen($('.login_box'));
        }
    })
}