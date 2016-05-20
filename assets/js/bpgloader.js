window.onload = function() {
    var start = function(imgs) {
        console.log("BPG Start");
    };
    var oil = function(src, curr, total) {
        console.log(src + " " + curr + "/" + total);
    };
    var fin = function(imgs) {
        console.log("BPG End");
    };
    bpgDecode(start, oil, fin);
}
