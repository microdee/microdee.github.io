window.onload = function() {
    var ctr = 0;
    var oil = function() {
        console.log("Loading BPG" + ctr);
        ctr++;
    };
    bpgDecode(oil);
}
