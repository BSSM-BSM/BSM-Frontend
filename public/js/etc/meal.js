let times, today, day, date, month, year, food_date;
let food_table=[];
const day_table=['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
times=new Date();
today=new Date(times);
const food_refresh = () => {
    $$('.loading')[0].classList.add("on");
    day=day_table[today.getDay()];
    date=today.getDate();
    month=today.getMonth()+1;
    year=today.getFullYear();
    $.ajax({
        type:'GET',
        url:apiUrl+'/meal/'+year+'-'+month+'-'+date,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                if(data.arrMeal!=null){
                    let arrMeal=data.arrMeal;
                    food_table[year+'-'+month+'-'+date]={'morning':arrMeal.morning, 'lunch':arrMeal.lunch, 'dinner':arrMeal.dinner};
                }
                food_render();
            }
        },
        error:data => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
const food_render = () => {
    $$('.food_date')[0].innerHTML=(today.getMonth()+1)+'월'+today.getDate()+'일 '+day;
    if(food_table.hasOwnProperty(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())){
        let morning = food_table[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['morning'];
        let lunch = food_table[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['lunch'];
        let dinner = food_table[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['dinner'];
        if(morning!=null)
            $$('.food-1 .food_menu')[0].innerHTML=morning;
        else
        $$('.food-1 .food_menu')[0].innerHTML='급식이 없습니다.';
        if(lunch!=null)
            $$('.food-2 .food_menu')[0].innerHTML=lunch;
        else
            $$('.food-2 .food_menu')[0].innerHTML='급식이 없습니다.';
            if(dinner!=null)
            $$('.food-3 .food_menu')[0].innerHTML=dinner;
        else
            $$('.food-3 .food_menu')[0].innerHTML='급식이 없습니다.';
        }else{
            $$('.food-1 .food_menu')[0].innerHTML='급식이 없습니다.';
        $$('.food-2 .food_menu')[0].innerHTML='급식이 없습니다.';
        $$('.food-3 .food_menu')[0].innerHTML='급식이 없습니다.';
    }
}
food_refresh();