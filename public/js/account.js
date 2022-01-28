const showLoginBox = () => {
    loginBoxView.init()
    popupOpen($('.login_box'))
}
const loginBoxView = new Vue({
    el:'.login_box',
    data:{
        msg:'로그인',
        step:0,
        id:'',
    },
    methods:{
        init:function(){
            this.step=0;
            this.msg='로그인'
            this.id=''
        },
        step1:function(){
            this.step=1;
            this.msg=`${this.id}(으)로 계속`
        },
        step2:function(){
            this.msg=`인증 중...`
            login(this.id, $('.login_box .member_pw').value);
        }
    },
})
const login = (id, pw) => {
    ajax({
        method:'post',
        url:`/account/login`,
        payload:{
            member_id:id,
            member_pw:pw
        },
        errorCallBack:(status, subStatus)=>{
            if(status==5&&subStatus==0){
                loginBoxView.init()
            }
            return false;
        },
        callBack:data=>{
            if(refresh){
                window.location.reload()
            }else{
                // 액세스 토큰 갱신 후 로그인 상태를 갱신함
                // base64를 decoding하는 함수인 atob는 한글을 지원안함
                // 그래서 escape로 유니코드로 변환후 decodeURI로 복호화함
                const jsonData = JSON.parse(decodeURIComponent(escape(atob(data.token.split('.')[1]))));
                member = {
                    isLogin:jsonData.isLogin,
                    code:jsonData.memberCode,
                    id:jsonData.memberId,
                    nickname:jsonData.memberNickname,
                    level:jsonData.memberLevel,
                    grade:jsonData.grade,
                    classNo:jsonData.classNo,
                    studentNo:jsonData.studentNo,
                }
                if(headerAccountView){
                    headerAccountView.member = member;
                }
                showToast('로그인에 성공하였습니다.');
                popupClose($('.login_box'));
                loginBoxView.init()
            }
        }
    })
}
const logout = () => {
    ajax({
        method:'delete',
        url:`/account/logout`,
        callBack:()=>{
            member={
                isLogin:false,
                code:null,
                id:null,
                nickname:null,
                level:null,
                grade:null,
                classNo:null,
                studentNo:null,
            }
            if(headerAccountView){
                headerAccountView.member = member;
            }
            showToast('로그아웃 되었습니다.');
        }
    })
}
const signUp = () => {
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
        callBack:()=>{
            showToast('회원가입이 완료되었습니다.\n다시 로그인 해주세요.');
            popupClose($('.sign_up_box'));
        }
    })
}
const pwEdit = () => {
    ajax({
        method:'post',
        url:'/account/pwEdit',
        payload:{
            member_pw:$('.pw_reset .member_pw').value,
            member_pw_check:$('.pw_reset .member_pw_check').value,
        },
        callBack:()=>{
            showToast('비밀번호 재설정이 완료되었습니다.\n다시 로그인 해주세요.');
            popupClose($('.pw_reset_box'))
            popupOpen($('.login_box'))
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
        callBack:()=>{
            showToast('비밀번호 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.pw_reset_mail_box'))
            popupOpen($('.login_box'))
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
        callBack:()=>{
            showToast('인증코드 전송이 완료되었습니다.\n메일함을 확인해주세요.');
            popupClose($('.valid_code_box'))
        }
    })
}