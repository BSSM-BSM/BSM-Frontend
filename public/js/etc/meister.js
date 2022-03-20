let hak = member.grade;
let ban = member.classNo;
let bun = member.studentNo;
const meisterView = new Vue({
    el:'.meister',
    data:{
        viewCase:'score',
        defaultPW:false
    }
});
const meister = () => {
    switch (meisterView.viewCase) {
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
            defaultPW:meisterView.defaultPW
        },
        error:(data) => {
            if (data.statusCode == 400) {
                showAlert('비밀번호가 맞지 않습니다. 다른 비밀번호로 시도해 보세요.');
                return true;
            }
            return false;
        },
        success:(data) => {
            $('.meisterInfo .pw').value = '';
            $('.meister .result.point').innerHTML = data;
            $$('.fas.fa-sad-cry').forEach((item) => {
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
        error:(data) => {
            if (data.statusCode == 404) {
                showAlert('학생정보가 맞지 않거나 불러올 수 없는 학생입니다.');
                return true;
            }
            return false;
        },
        success:(data) => {
            $('.meister .result.score').innerHTML = data;
        }
    })
}
$('.meisterInfo .hak').value = hak;
$('.meisterInfo .ban').value = ban;
$('.meisterInfo .bun').value = bun;