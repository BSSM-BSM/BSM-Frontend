let hak=member.grade, ban=member.classNo, bun=member.studentNo
const meisterView = new Vue({
    el:'.meister',
    data:{
        viewCase:'score'
    }
})
const meister = () => {
    switch(meisterView.viewCase){
        case 'score':
            meisterScore();
            break;
        case 'point':
            meisterPoint();
            break;
    }
}
const meisterPoint = () => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'POST',
        data:{
            pw: $('.meisterInfo .pw').val(),
        },
        url:apiUrl+'/meister/point/'+
        $('.meisterInfo .hak').val()+'/'+
        $('.meisterInfo .ban').val()+'/'+
        $('.meisterInfo .bun').val(),
        cache:false,
        success:data => {
            $('.meisterInfo .pw').val("")
            $('.meister .result').html(data)
            $$('.fas.fa-sad-cry').forEach(item =>{
                item.parentElement.parentElement.parentElement.parentElement.classList.add('bad')
            })
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
const meisterScore = () => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'GET',
        url:apiUrl+'/meister/score/'+
        $('.meisterInfo .hak').val()+'/'+
        $('.meisterInfo .ban').val()+'/'+
        $('.meisterInfo .bun').val(),
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                if(data.status==3&&data.subStatus==8){
                    showAlert('에러코드 3_8 학생정보가 맞지 않거나 불러올 수 없는 학생입니다.')
                }else{
                    error_code(data.status, data.subStatus);
                }
            }else{
                $('.meister .result').html(data.result)
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
$('.meisterInfo .hak').val(hak)
$('.meisterInfo .ban').val(ban)
$('.meisterInfo .bun').val(bun)