let hak = user.grade;
let ban = user.classNo;
let bun = user.studentNo;
const meisterView = new Vue({
    el:'.meister',
    data:{
        viewCase: 'point',
        defaultPW: true
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
        url:`/meister/point/${$('#meister_info .hak').value}/${$('#meister_info .ban').value}/${$('#meister_info .bun').value}`,
        payload:{
            pw:$('#meister_info .pw').value,
            defaultPW:meisterView.defaultPW
        },
        errorCallback:(data) => {
            if (data.statusCode == 400) {
                showAlert('비밀번호가 맞지 않습니다. 다른 비밀번호로 시도해 보세요.');
                return true;
            }
            return false;
        },
        callback:(data) => {
            $('#meister_info .pw').value = '';
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
        url:`/meister/score/${$('#meister_info .hak').value}/${$('#meister_info .ban').value}/${$('#meister_info .bun').value}`,
        errorCallback:(data) => {
            if (data.statusCode == 404) {
                showAlert('학생정보가 맞지 않거나 불러올 수 없는 학생입니다.');
                return true;
            }
            return false;
        },
        callback:(data) => {
            $('.meister .result.score').innerHTML = data;
        }
    })
}
$('#meister_info .hak').value = hak;
$('#meister_info .ban').value = ban;
$('#meister_info .bun').value = bun;
$('#meister_info').addEventListener('submit', (event) => {
    event.preventDefault();
    meister();
});