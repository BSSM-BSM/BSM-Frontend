function download_files(files) {
function download_next(i) {
    if (i >= files.length) {
      return;
    }
    var a = document.createElement('a');
    a.href = files[i].file;
    a.download = files[i].name;
    (document.body || document.documentElement).appendChild(a);
    if (a.click) {
      a.click();
    }
    else {
       window.open(files[i].file);
    }
    a.parentNode.removeChild(a);
    setTimeout(function() {
      download_next(i + 1);
    }, 2000);
}
download_next(0);
}
