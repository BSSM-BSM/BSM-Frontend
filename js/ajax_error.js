function ajax_error(status){
    error_msg={
        0:{type:1, msg:'서버와의 연결에 실패하였습니다.'},
        1:{type:0, msg:'정상 처리되었습니다.'},
        2:{type:1, msg:'정상적인 접근이 아닙니다.'},
        3:{type:1, msg:'로그인 세션 저장에 실패하였습니다.'},
        4:{type:1, msg:'id 또는 password가 맞지 않습니다.'},
        5:{type:1, msg:'비밀번호 재입력이 맞지 않습니다.'},
        6:{type:1, msg:'이미 사용중인 id입니다.'},
        7:{type:1, msg:'이미 사용중인 닉네임입니다.'},
        8:{type:2, msg:'계정 인증이 필요합니다.'},
        9:{type:1, msg:'유효한 코드가 아닙니다.'},
        10:{type:1, msg:'만료된 코드입니다, 새로운 코드를 발급받아 주세요.'},
        11:{type:1, msg:'회원가입중 알 수 없는 문제가 발생하였습니다.'},
        12:{type:1, msg:'수정할 비밀번호 재입력이 맞지 않습니다.'},
        13:{type:1, msg:'비밀번호 수정에 실패하였습니다.'},
        14:{type:1, msg:'멤버코드가 없습니다.'},
        15:{type:1, msg:'검색어가 없습니다.'},
        16:{type:1, msg:'잘못된 검색 대상입니다.'},
        17:{type:1, msg:'게시글 번호가 없습니다.'},
        18:{type:1, msg:'삭제된 게시글 입니다.'},
        19:{type:2, msg:'정상적인 접근이 아닙니다 로그인 해주세요.'},
        20:{type:1, msg:'게시글 작성자가 아닙니다.'},
        21:{type:2, msg:'로그인후 이용 가능 합니다.'},
        22:{type:1, msg:'파일 업로드에 실패하였습니다.'},
        23:{type:1, msg:'게시글 작성에 실패하였습니다.'},
        24:{type:1, msg:'이미 누르셨습니다.'},
    };
    if(error_msg[status].type!=1){
        switch(status){
            case 8:
                $('.authentication_box').addClass('on');
                break;
            case 19:
            case 21:
                alert("에러코드 "+status+"\n"+error_msg[status].msg);
                $('.login_box').addClass('on');
                break;
            default:
                break;
        }
    }else{
        alert("에러코드 "+status+"\n"+error_msg[status].msg);
    }
}