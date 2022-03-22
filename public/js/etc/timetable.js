const vacation = false;
let classTimeTable=[];
let grade, classNo, i, j, times, day, hour, min, sec, time, last_time=0, classTime;
const classTimes=[[8, 40, 9, 30], [9, 40, 10, 30], [10, 40, 11, 30], [11, 40, 12, 30], [12, 30, 13, 20], [13, 20, 14, 10], [14, 20, 15, 10], [15, 20, 16, 10], [16, 30, 18, 10], [18, 10, 18, 50], [19, 0, 20, 40]];

if (user.grade==null) {
    grade = 1;
} else {
    grade = user.grade;
}
if (user.classNo==null) {
    classNo = 1;
} else {
    classNo = user.classNo;
}
$('.select_grade .select').innerText = `${grade}학년`;
$('.select_class .select').innerText = `${classNo}반`;
times = new Date();
day = times.getDay();
hour = times.getHours();
min = times.getMinutes();
sec = times.getSeconds();
time = (hour*60)+min;
$('.clock').innerText = `${hour}:${min}:${sec}`;

const changeSelect = (paramGrade, paramClassNo) => {
    if (paramGrade)
        grade = paramGrade;
    if (paramClassNo)
        classNo = paramClassNo;
    timetableRefresh(grade, classNo);
}

const timetableRefresh = (grade, classNo) => {
    ajax({
        method:'get',
        url:`/timetable/${grade}/${classNo}`,
        error:(data) => {
            if (data.statusCode == 404) {
                showAlert("시간표 데이터가 없는 반 입니다.")
            }
            classTimeTable = [];
            timetableInit();
            updateTimeTable();
            return true;
        },
        success:data=>{
            classTimeTable = data.timetable;
            timetableInit();
            updateTimeTable();
        }
    })
}

const timetableInit = () => {
    $('tbody').innerHTML = '<tr><th></th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr>';
    for (i=0;i<classTimes.length;i++) {
        $('tbody').innerHTML += `<tr><td>${classTimes[i][0]}:${classTimes[i][1]<10 ? classTimes[i][1]+'0' : classTimes[i][1]}~${classTimes[i][2]}:${classTimes[i][3]<10 ? classTimes[i][3]+'0' : classTimes[i][3]}</td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }
}
const updateTimeTable = () => {
    classTime = null;
    $$('td').forEach(e => {
        e.classList.remove('active_day');
        e.classList.remove('active_time');
    });

    for (i=0; i<classTimeTable.length; i++) {
        for (j=0; j<classTimeTable[i].length; j++) {
            $(`tbody tr:nth-child(${j+2}) td:nth-child(${i+2})`).innerText = classTimeTable[i][j];

            if (day-1 == i) {
                if (((hour*60)+min>=(classTimes[j][0]*60)+classTimes[j][1]) && ((hour*60)+min<(classTimes[j][2]*60)+classTimes[j][3])) {
                    classTime=classTimeTable[i][j];
                    $(`tbody tr:nth-child(${j+2}) td:nth-child(${i+2})`).classList.add('active_time');
                }
                $(`tbody tr:nth-child(${j+2}) td:nth-child(${i+2})`).classList.add('active_day');
            }
        }
    }

    if (vacation) {
        $('.time').innerText = '방학인데 시간표 볼 필요가 있나?';
    } else {
        if (classTime == null) {
            if ((hour*60)+min>(20*60)+40 || (hour*60)+min<(6*60)+30) {
                $('.time').innerText = '하루 일과 끝';
            } else if ((hour*60)+min<(7*60)) {
                $('.time').innerText = '아침 운동중'
            } else if ((hour*60)+min<(7*60)+30) {
                $('.time').innerText = '등교 준비중'
            } else if ((hour*60)+min<(7*60)+50) {
                $('.time').innerText = '아침 식사중'
            } else if ((hour*60)+min<(8*60)+40) {
                $('.time').innerText = '아침 자습 시간중'
            } else {
                $('.time').innerText = '현재 쉬는 시간중';
            }
        } else {
            $('.time').innerText = `현재 ${classTime} 시간중`;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    timetableRefresh(grade, classNo);
    setInterval(() => {
        times = new Date();
        day = times.getDay();
        hour = times.getHours();
        min = times.getMinutes();
        sec = times.getSeconds();
        time = (hour*60)+min;
        $('.clock').innerText = `${hour}:${min}:${sec}`;
        if (time != last_time) {
            updateTimeTable();
        }
        last_time = time;
    }, 500);
})