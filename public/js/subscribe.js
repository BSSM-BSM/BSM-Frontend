const mealSubscribe = () => {
    navigator.serviceWorker.ready.then(
        serviceWorkerRegistration => {
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly:true,
                applicationServerKey:'BCeveCXwornm1DNHuNAYDpy8MadIa2-i9ykSG2AORLNbGDPo5QALgEiln_pDX71Pnq4O7UM0EJq_8KeMv_rolAU'
            }).then(sub => {
                sub = JSON.parse(JSON.stringify(sub));
                $.ajax({
                    type:'post',
                    url:apiUrl+'/meal/register',
                    data:{
                        endpoint:sub.endpoint,
                        auth:sub.keys.auth,
                        p256dh:sub.keys.p256dh,
                    },
                    cache:false,
                    success:data => {
                        data=JSON.parse(data);
                        if(data.status!=1){
                            error_code(data.status, data.subStatus);
                        }else{
                            showAlert("급식 알림등록이 완료되었습니다.");
                        }
                    },
                    error:() => {
                        error_code(0, 0);
                    }
                });
            });
        }
    );
}