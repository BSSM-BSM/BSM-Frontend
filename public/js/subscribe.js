const mealSubscribe = () => {
    navigator.serviceWorker.ready.then(
        serviceWorkerRegistration => {
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly:true,
                applicationServerKey:'BCeveCXwornm1DNHuNAYDpy8MadIa2-i9ykSG2AORLNbGDPo5QALgEiln_pDX71Pnq4O7UM0EJq_8KeMv_rolAU'
            }).then(data => {
                const sub = data.toJSON();
                ajax({
                    method: 'post',
                    url: '/push/meal',
                    payload: {
                        endpoint: sub.endpoint,
                        auth: sub.keys.auth,
                        p256dh: sub.keys.p256dh
                    },
                    callback: () => {
                        showToast('급식 알림등록이 완료되었습니다.<br>알림은 급식 1시간 전에 도착합니다.');
                    }
                })
            });
        }
    );
}