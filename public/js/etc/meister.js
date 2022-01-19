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
    progress(20)
    ajax({
        method:'post',
        url:`/meister/point/${$$('.meisterInfo .hak')[0].value}/${$$('.meisterInfo .ban')[0].value}/${$$('.meisterInfo .bun')[0].value}`,
        payload:{
            pw:$$('.meisterInfo .pw')[0].value,
        },
        callBack:data=>{
            $$('.meisterInfo .pw')[0].value = ''
            $$('.meister .result.point')[0].innerHTML = data.result
            $$('.fas.fa-sad-cry').forEach(item =>{
                item.parentElement.parentElement.parentElement.parentElement.classList.add('bad')
            })
        }
    })
}
const meisterScore = () => {
    progress(20)
    ajax({
        method:'get',
        url:`/meister/score/${$$('.meisterInfo .hak')[0].value}/${$$('.meisterInfo .ban')[0].value}/${$$('.meisterInfo .bun')[0].value}`,
        errorCallBack:(status, subStatus)=>{
            if(status==3&&subStatus==8){
                showAlert('에러코드 3_8 학생정보가 맞지 않거나 불러올 수 없는 학생입니다.')
                return true;
            }
            return false;
        },
        callBack:data=>{
            $$('.meister .result.score')[0].innerHTML = data.result
        }
    })
}
$$('.meisterInfo .hak')[0].value= hak
$$('.meisterInfo .ban')[0].value= ban
$$('.meisterInfo .bun')[0].value= bun