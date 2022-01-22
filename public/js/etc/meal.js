const mealView = new Vue({
    el:'.meals',
    data:{
        morning:'',
        lunch:'',
        dinner:'',
        hover:2
    },
    methods:{
        setHover:function(hover){
            this.hover=hover;
        }
    }
})
let times, today, day, date, month, year, mealDate;
let mealTable=[];
const dayTable=['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
times=new Date();
today=new Date(times);
const mealRefresh = () => {
    $('.loading').classList.add("on");
    day=dayTable[today.getDay()];
    date=today.getDate();
    month=today.getMonth()+1;
    year=today.getFullYear();
    ajax({
        method:'get',
        url:`/meal/${year}-${month}-${date}`,
        callBack:data=>{
            if(data.arrMeal!=null){
                let arrMeal=data.arrMeal;
                mealTable[year+'-'+month+'-'+date]={'morning':arrMeal.morning, 'lunch':arrMeal.lunch, 'dinner':arrMeal.dinner};
            }
            mealRender();
        }
    })
}
const mealRender = () => {
    $('.meal_date').innerHTML=(today.getMonth()+1)+'월'+today.getDate()+'일 '+day;
    if(mealTable.hasOwnProperty(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())){
        mealView.morning = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['morning'];
        mealView.lunch = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['lunch'];
        mealView.dinner = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['dinner'];
    }
}
window.addEventListener('DOMContentLoaded', () => {
    mealRefresh();
})