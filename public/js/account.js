const showLoginBox = () => {
    loginBoxView.init()
    popupOpen($$('.login_box')[0])
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
            login(this.id, $$('.login_box .member_pw')[0].value);
        }
    },
})
const login = (id, pw) => {
    $.ajax({
        type:'POST',
        data:{
            member_id:id,
            member_pw:pw,
        },
        url:apiUrl+'/account/login',
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                if(data.status==5&&data.subStatus==0){
                    loginBoxView.init()
                }
            }else{
                if(refresh){
                    window.location.reload()
                }else{
                    alert("로그인에 성공하였습니다.");
                    popupClose($$('.login_box')[0]);
                    loginBoxView.init()
                }
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}
const signUp = () => {
    $.ajax({
        type:'POST',
        data:{
            member_id:$$('.sign_up .member_id').value,
            member_pw:$$('.sign_up .member_pw').value,
            member_pw_check:$$('.sign_up .member_pw_check').value,
            member_nickname:$$('.sign_up .member_nickname').value,
            code:$$('.sign_up .code').value,
        },
        url:apiUrl+'/account/signUp',
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                alert("회원가입이 완료되었습니다.\n다시 로그인 해주세요.");
                popupClose($$('.sign_up_box')[0]);
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}
const pwEdit = () => {
    $.ajax({
        type:'POST',
        data:{
            member_pw:$$('.pw_reset .member_pw').value,
            member_pw_check:$$('.pw_reset .member_pw_check').value,
        },
        url:apiUrl+'/account/pwEdit',
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                alert("비밀번호 재설정이 완료되었습니다.\n다시 로그인 해주세요.");
                popupClose($$('.pw_reset_box')[0])
                popupOpen($$('.login_box')[0])
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}
const validCode = () => {
    $.ajax({
        type:'POST',
        data:{
            student_enrolled:$$('.valid_code .studentEnrolled').value,
            student_grade:$$('.valid_code .studentGrade').value,
            student_class:$$('.valid_code .studentClass').value,
            student_no:$$('.valid_code .studentNo').value,
            student_name:$$('.valid_code .studentName').value,
        },
        url:apiUrl+'/account/validCode',
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                alert("인증코드 전송이 완료되었습니다.\n메일함을 확인해주세요.");
                popupClose($$('.valid_code_box')[0])
            }
        },
        error:() => {
            error_code(0, 0);
        }
    });
}