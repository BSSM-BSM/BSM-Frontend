const statusCode = (status, subStatus) => {
    errorMsg={
        0:{msg:'오류',
            0:{type:1, msg:'알 수 없는 에러가 발생하였습니다'},
            1:{type:1, msg:'서버와의 연결에 실패하였습니다.'}
        },
        1:{msg:'정상',
            0:{type:1, msg:'정상 처리되었습니다.'}
        },
        2:{msg:'서버 문제',
            0:{type:1, msg:'서버에 문제가 발생하였습니다.'},
            1:{type:1, msg:'로그인 세션 저장에 실패하였습니다.'},
            2:{type:1, msg:'회원가입중 알 수 없는 문제가 발생하였습니다.'},
            3:{type:1, msg:'비밀번호 수정에 실패하였습니다.'},
            4:{type:1, msg:'파일 업로드에 실패하였습니다.'},
            5:{type:1, msg:'게시글 작성에 실패하였습니다.'},
        },
        3:{msg:'비정상 접근',
            0:{type:1, msg:'정상적인 접근이 아닙니다.'},
            1:{type:1, msg:'권한이 없습니다.'},
            2:{type:1, msg:'유효한 코드가 아닙니다.'},
            3:{type:1, msg:'멤버코드가 없습니다.'},
            4:{type:1, msg:'검색어가 없습니다.'},
            5:{type:1, msg:'잘못된 검색 대상입니다.'},
            6:{type:1, msg:'삭제된 게시글이거나 게시글이 없습니다.'},
            7:{type:1, msg:'작성자가 아닙니다.'},
            8:{type:1, msg:'학생정보가 맞지 않습니다.'},
            9:{type:1, msg:'인증코드 전송에 실패하였습니다.'},
            10:{type:1, msg:'토큰 유효기간이 만료되었습니다'},
        },
        4:{msg:'알림',
            0:{type:1, msg:'계정이 정지되었습니다.'},
            1:{type:2, msg:'로그인후 이용 가능 합니다.'},
            2:{type:2, msg:'비밀번호 재설정이 필요합니다.'},
            3:{type:1, msg:'만료된 코드입니다, 회원가입된 계정으로 로그인해주세요.'},
        },
        5:{msg:'경고',
            0:{type:1, msg:'id 또는 password가 맞지 않습니다.'},
            1:{type:1, msg:'비밀번호 재입력이 맞지 않습니다.'},
            2:{type:1, msg:'이미 사용중인 id입니다.'},
            3:{type:1, msg:'이미 사용중인 닉네임입니다.'},
            4:{type:1, msg:'수정할 비밀번호 재입력이 맞지 않습니다.'},
        },
    };
    if(errorMsg[status][subStatus].type!=1){
        switch(status){
            case 4:
                switch(subStatus){
                    case 1:
                        showAlert('에러코드 '+status+"_"+subStatus+"\n"+errorMsg[status][subStatus].msg)
                        showLoginBox()
                        break;
                    case 2:
                        popupOpen($('.pw_reset_box'))
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }else{
        showAlert('에러코드 '+status+"_"+subStatus+"\n"+errorMsg[status][subStatus].msg)
    }
}