let hak=member.grade, ban=member.classNo, bun=member.studentNo;
const meisterView = new Vue({
    el:'.meister',
    data:{
        viewCase:'score'
    }
});
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
    progress(20);
    ajax({
        method:'post',
        url:`/meister/point/${$('.meisterInfo .hak').value}/${$('.meisterInfo .ban').value}/${$('.meisterInfo .bun').value}`,
        payload:{
            pw:$('.meisterInfo .pw').value,
        },
        success:data=>{
            $('.meisterInfo .pw').value = '';
            $('.meister .result.point').innerHTML = data.result;
            $$('.fas.fa-sad-cry').forEach(item =>{
                item.parentElement.parentElement.parentElement.parentElement.classList.add('bad');
            })
        }
    })
}
const meisterScore = () => {
    progress(20);
    ajax({
        method:'get',
        url:`/meister/score/${$('.meisterInfo .hak').value}/${$('.meisterInfo .ban').value}/${$('.meisterInfo .bun').value}`,
        error:(status, subStatus)=>{
            if(status==3&&subStatus==8){
                showAlert('에러코드 3_8 학생정보가 맞지 않거나 불러올 수 없는 학생입니다.');
                return true;
            }
            return false;
        },
        success:data=>{
            $('.meister .result.score').innerHTML = data.result;
        }
    })
}
$('.meisterInfo .hak').value = hak;
$('.meisterInfo .ban').value = ban;
$('.meisterInfo .bun').value = bun;