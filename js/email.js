function sendMail() {
    var link = "mailto:irv.fen@gmail.com"
             + "&subject=" + encodeURIComponent("Subject")
             + "&body=" + encodeURIComponent(document.getElementById('myText').value)
    ;
    window.location.href = link;
}