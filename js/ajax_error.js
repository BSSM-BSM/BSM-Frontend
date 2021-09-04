function ajax_error(status){
    error_msg={
        2:{msg:'정상적인 접근이 아닙니다.', type:1},
        3:{msg:'로그인 세션 저장에 실패하였습니다.', type:1},
        4:{msg:'id 또는 password가 맞지 않습니다.', type:1},
        5:{msg:'비밀번호 재입력이 맞지 않습니다.', type:1},
        6:{msg:'이미 사용중인 id입니다.', type:1},
        7:{msg:'이미 사용중인 닉네임입니다.', type:1},
        8:{msg:'계정 인증이 필요합니다.', type:2},
        9:{msg:'유효한 코드가 아닙니다.', type:1},
        10:{msg:'만료된 코드입니다, 새로운 코드를 발급받아 주세요.', type:1},
        11:{msg:'이미 사용중인 id입니다.', type:1},
    };
    if(error_msg[status].type!=1){
        switch(status){
            case 8:
                $('.authentication_box').addClass('on');
                break;
            default:
                break;
        }
    }else{
        alert("에러코드 "+status+"\n"+error_msg[status].msg);
    }
}