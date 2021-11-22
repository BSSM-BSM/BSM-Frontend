const toast = msg => {
    $$('.toast_wrap')[0].append(document.createElement('div'))
    $$('.toast_wrap div')[$$('.toast_wrap div').length-1].innerHTML='<div class="toast">'+msg+'</div>'
    window.setTimeout(()=>{
        $$('.toast_wrap div div')[0].classList.add("remove")
        window.setTimeout(()=>{
            $$('.toast_wrap div')[0].remove()
        }, 200)
    }, 3000)
}