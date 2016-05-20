
function bpgDecode(onImageLoad) {
    var a, d, c, e, f, i, g;
    e = document.images;
    d = e.length;
    f = [];
    for (a = 0; a < d; a++) c = e[a], i = c.src, ".bpg" == i.substr(-4, 4).toLowerCase() && (f[f.length] = c);
    d = f.length;
    for (a = 0; a < d; a++) {
        c = f[a];
        i = c.src;
        e = document.createElement("canvas");
        c.id && (e.id = c.id);
        c.className && (e.className = c.className);
        if (g = c.getAttribute("width") | 0) e.style.width = g + "px";
        if (g = c.getAttribute("height") | 0) e.style.height = g + "px";
        c.parentNode.replaceChild(e, c);
        g = e.getContext("2d");
        c = new BPGDecoder(g);
        c.onload = function(a, c) {
            onImageLoad();
            function d() {
                var a =
                    e.n;
                ++a >= f.length && (0 == e.loop_count || e.q < e.loop_count ? (a = 0, e.q++) : a = -1);
                0 <= a && (e.n = a, c.putImageData(f[a].img, 0, 0), setTimeout(d, f[a].duration))
            }
            var e = this,
                f = this.frames,
                g = f[0].img;
            a.width = g.width;
            a.height = g.height;
            c.putImageData(g, 0, 0);
            1 < f.length && (e.n = 0, e.q = 0, setTimeout(d, f[0].duration))
        }.bind(c, e, g);
        c.load(i);
    }
};
