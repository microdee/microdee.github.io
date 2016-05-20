window.onload = function() {
    var ctr = 0;
    var oil = function() {
        document.getElementById("bpgstatus").innerHTML = "Loading BPG " + ctr;
        ctr++;
    };
    bpgDecode(oil);
}
