import { g as getAugmentedNamespace, r as reactExports, a as getDefaultExportFromCjs, j as jsxRuntimeExports } from "./index-OP675atP.js";
var lib = {};
var Utterances$1 = {};
function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
}
function createStyleElement(options) {
  var tag = document.createElement("style");
  tag.setAttribute("data-emotion", options.key);
  if (options.nonce !== void 0) {
    tag.setAttribute("nonce", options.nonce);
  }
  tag.appendChild(document.createTextNode(""));
  return tag;
}
var StyleSheet = /* @__PURE__ */ function() {
  function StyleSheet2(options) {
    this.isSpeedy = options.speedy === void 0 ? true : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce;
    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }
  var _proto = StyleSheet2.prototype;
  _proto.insert = function insert(rule) {
    if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
      var _tag = createStyleElement(this);
      var before;
      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }
      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }
    var tag = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var sheet2 = sheetForTag(tag);
      try {
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64;
        sheet2.insertRule(
          rule,
          // we need to insert @import rules before anything else
          // otherwise there will be an error
          // technically this means that the @import rules will
          // _usually_(not always since there could be multiple style tags)
          // be the first ones in prod and generally later in dev
          // this shouldn't really matter in the real world though
          // @import is generally only used for font faces from google fonts and etc.
          // so while this could be technically correct then it would be slower and larger
          // for a tiny bit of correctness that won't matter in the real world
          isImportRule ? 0 : sheet2.cssRules.length
        );
      } catch (e) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }
    this.ctr++;
  };
  _proto.flush = function flush2() {
    this.tags.forEach(function(tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };
  return StyleSheet2;
}();
function stylis_min(W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B2 = e.length, J = B2 - 1, y, f = "", p = "", F2 = "", G2 = "", C; l < B2; ) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B2++, J++);
      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, "")), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;
            default:
              f += e.charAt(l);
          }
          g = 59;
        }
        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;
            for (t = ++l; l < B2; ) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;
                case 125:
                  k--;
                  break;
                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }
                              break;
                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }
                          }
                        }
                        l = u;
                      }
                  }
                  break;
                case 91:
                  g++;
                case 40:
                  g++;
                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g; ) {
                  }
              }
              if (0 === k)
                break;
              l++;
            }
            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, "").trim()).charCodeAt(0));
            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ""));
                g = f.charCodeAt(1);
                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;
                  default:
                    r = O;
                }
                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(""), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ""));
                if (0 < t)
                  switch (g) {
                    case 115:
                      f = f.replace(da, ea);
                    case 100:
                    case 109:
                    case 45:
                      k = f + "{" + k + "}";
                      break;
                    case 107:
                      f = f.replace(fa, "$1 $2");
                      k = f + "{" + k + "}";
                      k = 1 === w || 2 === w && L("@" + k, 3) ? "@-webkit-" + k + "@" + k : "@" + k;
                      break;
                    default:
                      k = f + k, 112 === h && (k = (p += k, ""));
                  }
                else
                  k = "";
                break;
              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }
            F2 += k;
            k = I = r = u = q = 0;
            f = "";
            g = e.charCodeAt(++l);
            break;
          case 125:
          case 59:
            f = (0 < r ? f.replace(N, "") : f).trim();
            if (1 < (t = f.length))
              switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(" ", ":")).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = "\0\0"), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
                case 0:
                  break;
                case 64:
                  if (105 === g || 99 === g) {
                    G2 += f + e.charAt(l);
                    break;
                  }
                default:
                  58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
              }
            I = r = u = q = 0;
            f = "";
            g = e.charCodeAt(++l);
        }
      }
      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += "\0");
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;
        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }
        default:
          z++;
          y = e.charAt(l);
          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b)
                switch (x) {
                  case 44:
                  case 58:
                  case 9:
                  case 32:
                    y = "";
                    break;
                  default:
                    32 !== g && (y = " ");
                }
              break;
            case 0:
              y = "\\0";
              break;
            case 12:
              y = "\\f";
              break;
            case 11:
              y = "\\v";
              break;
            case 38:
              0 === n + b + m && (r = I = 1, y = "\f" + y);
              break;
            case 108:
              if (0 === n + b + m + E && 0 < u)
                switch (l - u) {
                  case 2:
                    112 === x && 58 === e.charCodeAt(l - 3) && (E = x);
                  case 8:
                    111 === K && (E = K);
                }
              break;
            case 58:
              0 === n + b + m && (u = l);
              break;
            case 44:
              0 === b + v + n + m && (r = 1, y += "\r");
              break;
            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;
            case 91:
              0 === n + b + v && m++;
              break;
            case 93:
              0 === n + b + v && m--;
              break;
            case 41:
              0 === n + b + m && v--;
              break;
            case 40:
              if (0 === n + b + m) {
                if (0 === q)
                  switch (2 * x + 3 * K) {
                    case 533:
                      break;
                    default:
                      q = 1;
                  }
                v++;
              }
              break;
            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;
            case 42:
            case 47:
              if (!(0 < n + m + v))
                switch (b) {
                  case 0:
                    switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                      case 235:
                        b = 47;
                        break;
                      case 220:
                        t = l, b = 42;
                    }
                    break;
                  case 42:
                    47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = "", b = 0);
                }
          }
          0 === b && (f += y);
      }
      K = x;
      x = g;
      l++;
    }
    t = p.length;
    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length))
        return G2 + p + F2;
      p = r.join(",") + "{" + p + "}";
      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);
        switch (E) {
          case 111:
            p = p.replace(ha, ":-moz-$1") + p;
            break;
          case 112:
            p = p.replace(Q, "::-webkit-input-$1") + p.replace(Q, "::-moz-$1") + p.replace(Q, ":-ms-input-$1") + p;
        }
        E = 0;
      }
    }
    return G2 + p + F2;
  }
  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length, m = d.length;
    switch (m) {
      case 0:
      case 1:
        var b = 0;
        for (d = 0 === m ? "" : d[0] + " "; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }
        break;
      default:
        var v = b = 0;
        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + " ", h[b], e).trim();
          }
        }
    }
    return c;
  }
  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));
    switch (h) {
      case 38:
        return c.replace(F, "$1" + d.trim());
      case 58:
        return d.trim() + c.replace(F, "$1" + d.trim());
      default:
        if (0 < 1 * e && 0 < c.indexOf("\f"))
          return c.replace(F, (58 === d.charCodeAt(0) ? "" : "$1") + d.trim());
    }
    return d + c;
  }
  function P(d, c, e, h) {
    var a = d + ";", m = 2 * c + 3 * e + 4 * h;
    if (944 === m) {
      d = a.indexOf(":", 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ";";
      return 1 === w || 2 === w && L(b, 1) ? "-webkit-" + b + b : b;
    }
    if (0 === w || 2 === w && !L(a, 1))
      return a;
    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? "-webkit-" + a + a : a;
      case 951:
        return 116 === a.charCodeAt(3) ? "-webkit-" + a + a : a;
      case 963:
        return 110 === a.charCodeAt(5) ? "-webkit-" + a + a : a;
      case 1009:
        if (100 !== a.charCodeAt(4))
          break;
      case 969:
      case 942:
        return "-webkit-" + a + a;
      case 978:
        return "-webkit-" + a + "-moz-" + a + a;
      case 1019:
      case 983:
        return "-webkit-" + a + "-moz-" + a + "-ms-" + a + a;
      case 883:
        if (45 === a.charCodeAt(8))
          return "-webkit-" + a + a;
        if (0 < a.indexOf("image-set(", 11))
          return a.replace(ja, "$1-webkit-$2") + a;
        break;
      case 932:
        if (45 === a.charCodeAt(4))
          switch (a.charCodeAt(5)) {
            case 103:
              return "-webkit-box-" + a.replace("-grow", "") + "-webkit-" + a + "-ms-" + a.replace("grow", "positive") + a;
            case 115:
              return "-webkit-" + a + "-ms-" + a.replace("shrink", "negative") + a;
            case 98:
              return "-webkit-" + a + "-ms-" + a.replace("basis", "preferred-size") + a;
          }
        return "-webkit-" + a + "-ms-" + a + a;
      case 964:
        return "-webkit-" + a + "-ms-flex-" + a + a;
      case 1023:
        if (99 !== a.charCodeAt(8))
          break;
        b = a.substring(a.indexOf(":", 15)).replace("flex-", "").replace("space-between", "justify");
        return "-webkit-box-pack" + b + "-webkit-" + a + "-ms-flex-pack" + b + a;
      case 1005:
        return ka.test(a) ? a.replace(aa, ":-webkit-") + a.replace(aa, ":-moz-") + a : a;
      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf("-") + 1;
        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, "tb");
            break;
          case 232:
            b = a.replace(G, "tb-rl");
            break;
          case 220:
            b = a.replace(G, "lr");
            break;
          default:
            return a;
        }
        return "-webkit-" + a + "-ms-" + b + a;
      case 1017:
        if (-1 === a.indexOf("sticky", 9))
          break;
      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(":", 7) + 1).trim();
        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8))
              break;
          case 115:
            a = a.replace(b, "-webkit-" + b) + ";" + a;
            break;
          case 207:
          case 102:
            a = a.replace(b, "-webkit-" + (102 < m ? "inline-" : "") + "box") + ";" + a.replace(b, "-webkit-" + b) + ";" + a.replace(b, "-ms-" + b + "box") + ";" + a;
        }
        return a + ";";
      case 938:
        if (45 === a.charCodeAt(5))
          switch (a.charCodeAt(6)) {
            case 105:
              return b = a.replace("-items", ""), "-webkit-" + a + "-webkit-box-" + b + "-ms-flex-" + b + a;
            case 115:
              return "-webkit-" + a + "-ms-flex-item-" + a.replace(ba, "") + a;
            default:
              return "-webkit-" + a + "-ms-flex-line-pack" + a.replace("align-content", "").replace(ba, "") + a;
          }
        break;
      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4))
          break;
      case 931:
      case 953:
        if (true === la.test(d))
          return 115 === (b = d.substring(d.indexOf(":") + 1)).charCodeAt(0) ? P(d.replace("stretch", "fill-available"), c, e, h).replace(":fill-available", ":stretch") : a.replace(b, "-webkit-" + b) + a.replace(b, "-moz-" + b.replace("fill-", "")) + a;
        break;
      case 962:
        if (a = "-webkit-" + a + (102 === a.charCodeAt(5) ? "-ms-" + a : "") + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf("transform", 10))
          return a.substring(0, a.indexOf(";", 27) + 1).replace(ma, "$1-webkit-$2") + a;
    }
    return a;
  }
  function L(d, c) {
    var e = d.indexOf(1 === c ? ":" : "{"), h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, "$1"), e, c);
  }
  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ";" ? e.replace(oa, " or ($1)").substring(4) : "(" + c + ")";
  }
  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w2; g < A; ++g) {
      switch (w2 = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case false:
        case true:
        case null:
          break;
        default:
          x = w2;
      }
    }
    if (x !== c)
      return x;
  }
  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;
      default:
        if ("function" === typeof d)
          S[A++] = d;
        else if ("object" === typeof d)
          for (var c = 0, e = d.length; c < e; ++c) {
            T(d[c]);
          }
        else
          Y = !!d | 0;
    }
    return T;
  }
  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? "function" !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }
  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];
    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && "string" === typeof h && (c = h);
    }
    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = "";
    E = 0;
    z = D = 1;
    return a;
  }
  var ca = /^\0+/g, N = /[\0\r\f]/g, aa = /: */g, ka = /zoo|gra/, ma = /([,: ])(transform)/g, ia = /,\r+?/g, F = /([\t\r\n ])*\f?&/g, fa = /@(k\w+)\s*(\S*)\s*/, Q = /::(place)/g, ha = /:(read-only)/g, G = /[svh]\w+-[tblr]{2}/, da = /\(\s*(.*)\s*\)/g, oa = /([\s\S]*?);/g, ba = /-self|flex-/g, na = /[^]*?(:[rp][el]a[\w-]+)[^]*/, la = /stretch|:\s*\w+\-(?:conte|avail)/, ja = /([^-])(image-set\()/, z = 1, D = 1, E = 0, w = 1, O = [], S = [], A = 0, R = null, Y = 0, V = "";
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}
var delimiter = "/*|*/";
var needle = delimiter + "}";
function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + "}");
  }
}
var Sheet = {
  current: null
};
var ruleSheet = function ruleSheet2(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    case 1: {
      switch (content.charCodeAt(0)) {
        case 64: {
          Sheet.current.insert(content + ";");
          return "";
        }
        case 108: {
          if (content.charCodeAt(2) === 98) {
            return "";
          }
        }
      }
      break;
    }
    case 2: {
      if (ns === 0)
        return content + delimiter;
      break;
    }
    case 3: {
      switch (ns) {
        case 102:
        case 112: {
          Sheet.current.insert(selectors[0] + content);
          return "";
        }
        default: {
          return content + (at === 0 ? delimiter : "");
        }
      }
    }
    case -2: {
      content.split(needle).forEach(toSheet);
    }
  }
};
var createCache = function createCache2(options) {
  if (options === void 0)
    options = {};
  var key = options.key || "css";
  var stylisOptions;
  if (options.prefix !== void 0) {
    stylisOptions = {
      prefix: options.prefix
    };
  }
  var stylis = new stylis_min(stylisOptions);
  var inserted = {};
  var container;
  {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function(node) {
      var attrib = node.getAttribute("data-emotion-" + key);
      attrib.split(" ").forEach(function(id) {
        inserted[id] = true;
      });
      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }
  var _insert;
  {
    stylis.use(options.stylisPlugins)(ruleSheet);
    _insert = function insert(selector, serialized, sheet2, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet2;
      stylis(selector, serialized.styles);
      if (shouldCache) {
        cache2.inserted[name] = true;
      }
    };
  }
  var cache2 = {
    key,
    sheet: new StyleSheet({
      key,
      container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted,
    registered: {},
    insert: _insert
  };
  return cache2;
};
function murmur2(str) {
  var h = 0;
  var k, i = 0, len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
    k = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
    k ^= /* k >>> r: */
    k >>> 24;
    h = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 255) << 16;
    case 2:
      h ^= (str.charCodeAt(i + 1) & 255) << 8;
    case 1:
      h ^= str.charCodeAt(i) & 255;
      h = /* Math.imul(h, m): */
      (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  h ^= h >>> 13;
  h = /* Math.imul(h, m): */
  (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
function memoize(fn) {
  var cache2 = {};
  return function(arg) {
    if (cache2[arg] === void 0)
      cache2[arg] = fn(arg);
    return cache2[arg];
  };
}
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var isCustomProperty = function isCustomProperty2(property) {
  return property.charCodeAt(1) === 45;
};
var isProcessableValue = function isProcessableValue2(value) {
  return value != null && typeof value !== "boolean";
};
var processStyleName = memoize(function(styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
});
var processStyleValue = function processStyleValue2(key, value) {
  switch (key) {
    case "animation":
    case "animationName": {
      if (typeof value === "string") {
        return value.replace(animationRegex, function(match, p1, p2) {
          cursor = {
            name: p1,
            styles: p2,
            next: cursor
          };
          return p1;
        });
      }
    }
  }
  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
    return value + "px";
  }
  return value;
};
function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return "";
  }
  if (interpolation.__emotion_styles !== void 0) {
    return interpolation;
  }
  switch (typeof interpolation) {
    case "boolean": {
      return "";
    }
    case "object": {
      if (interpolation.anim === 1) {
        cursor = {
          name: interpolation.name,
          styles: interpolation.styles,
          next: cursor
        };
        return interpolation.name;
      }
      if (interpolation.styles !== void 0) {
        var next = interpolation.next;
        if (next !== void 0) {
          while (next !== void 0) {
            cursor = {
              name: next.name,
              styles: next.styles,
              next: cursor
            };
            next = next.next;
          }
        }
        var styles = interpolation.styles + ";";
        return styles;
      }
      return createStringFromObject(mergedProps, registered, interpolation);
    }
    case "function": {
      if (mergedProps !== void 0) {
        var previousCursor = cursor;
        var result = interpolation(mergedProps);
        cursor = previousCursor;
        return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
      }
      break;
    }
  }
  if (registered == null) {
    return interpolation;
  }
  var cached = registered[interpolation];
  return cached !== void 0 && !couldBeSelectorInterpolation ? cached : interpolation;
}
function createStringFromObject(mergedProps, registered, obj) {
  var string = "";
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];
      if (typeof value !== "object") {
        if (registered != null && registered[value] !== void 0) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === "NO_COMPONENT_SELECTOR" && false) {
          throw new Error("Component selectors can only be used in conjunction with babel-plugin-emotion.");
        }
        if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);
          switch (_key) {
            case "animation":
            case "animationName": {
              string += processStyleName(_key) + ":" + interpolated + ";";
              break;
            }
            default: {
              string += _key + "{" + interpolated + "}";
            }
          }
        }
      }
    }
  }
  return string;
}
var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var cursor;
var serializeStyles = function serializeStyles2(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
    return args[0];
  }
  var stringMode = true;
  var styles = "";
  cursor = void 0;
  var strings = args[0];
  if (strings == null || strings.raw === void 0) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    styles += strings[0];
  }
  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);
    if (stringMode) {
      styles += strings[i];
    }
  }
  labelPattern.lastIndex = 0;
  var identifierName = "";
  var match;
  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += "-" + // $FlowFixMe we know it's not null
    match[1];
  }
  var name = murmur2(styles) + identifierName;
  return {
    name,
    styles,
    next: cursor
  };
};
var isBrowser = true;
function getRegisteredStyles$1(registered, registeredStyles, classNames) {
  var rawClassName = "";
  classNames.split(" ").forEach(function(className) {
    if (registered[className] !== void 0) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles2(cache2, serialized, isStringTag) {
  var className = cache2.key + "-" + serialized.name;
  if (
    // we only need to add the styles to the registered cache if the
    // class name could be used further down
    // the tree but if it's a string tag, we know it won't
    // so we don't have to add it to registered cache.
    // this improves memory usage since we can avoid storing the whole style string
    (isStringTag === false || // we need to always store it if we're in compat mode and
    // in node since emotion-server relies on whether a style is in
    // the registered cache to know whether a style is global or not
    // also, note that this check will be dead code eliminated in the browser
    isBrowser === false) && cache2.registered[className] === void 0
  ) {
    cache2.registered[className] = serialized.styles;
  }
  if (cache2.inserted[serialized.name] === void 0) {
    var current = serialized;
    do {
      cache2.insert("." + className, current, cache2.sheet, true);
      current = current.next;
    } while (current !== void 0);
  }
};
function insertWithoutScoping(cache2, serialized) {
  if (cache2.inserted[serialized.name] === void 0) {
    return cache2.insert("", serialized, cache2.sheet, true);
  }
}
function merge$1(registered, css2, className) {
  var registeredStyles = [];
  var rawClassName = getRegisteredStyles$1(registered, registeredStyles, className);
  if (registeredStyles.length < 2) {
    return className;
  }
  return rawClassName + css2(registeredStyles);
}
var createEmotion = function createEmotion2(options) {
  var cache2 = createCache(options);
  cache2.sheet.speedy = function(value) {
    this.isSpeedy = value;
  };
  cache2.compat = true;
  var css2 = function css22() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var serialized = serializeStyles(args, cache2.registered, void 0);
    insertStyles(cache2, serialized, false);
    return cache2.key + "-" + serialized.name;
  };
  var keyframes2 = function keyframes22() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var serialized = serializeStyles(args, cache2.registered);
    var animation = "animation-" + serialized.name;
    insertWithoutScoping(cache2, {
      name: serialized.name,
      styles: "@keyframes " + animation + "{" + serialized.styles + "}"
    });
    return animation;
  };
  var injectGlobal2 = function injectGlobal22() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    var serialized = serializeStyles(args, cache2.registered);
    insertWithoutScoping(cache2, serialized);
  };
  var cx2 = function cx22() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return merge$1(cache2.registered, css2, classnames(args));
  };
  return {
    css: css2,
    cx: cx2,
    injectGlobal: injectGlobal2,
    keyframes: keyframes2,
    hydrate: function hydrate2(ids) {
      ids.forEach(function(key) {
        cache2.inserted[key] = true;
      });
    },
    flush: function flush2() {
      cache2.registered = {};
      cache2.inserted = {};
      cache2.sheet.flush();
    },
    // $FlowFixMe
    sheet: cache2.sheet,
    cache: cache2,
    getRegisteredStyles: getRegisteredStyles$1.bind(null, cache2.registered),
    merge: merge$1.bind(null, cache2.registered, css2)
  };
};
var classnames = function classnames2(args) {
  var cls = "";
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg == null)
      continue;
    var toAdd = void 0;
    switch (typeof arg) {
      case "boolean":
        break;
      case "object": {
        if (Array.isArray(arg)) {
          toAdd = classnames2(arg);
        } else {
          toAdd = "";
          for (var k in arg) {
            if (arg[k] && k) {
              toAdd && (toAdd += " ");
              toAdd += k;
            }
          }
        }
        break;
      }
      default: {
        toAdd = arg;
      }
    }
    if (toAdd) {
      cls && (cls += " ");
      cls += toAdd;
    }
  }
  return cls;
};
var _createEmotion = createEmotion(), flush = _createEmotion.flush, hydrate = _createEmotion.hydrate, cx = _createEmotion.cx, merge = _createEmotion.merge, getRegisteredStyles = _createEmotion.getRegisteredStyles, injectGlobal = _createEmotion.injectGlobal, keyframes = _createEmotion.keyframes, css = _createEmotion.css, sheet = _createEmotion.sheet, cache = _createEmotion.cache;
const emotion_esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cache,
  css,
  cx,
  flush,
  getRegisteredStyles,
  hydrate,
  injectGlobal,
  keyframes,
  merge,
  sheet
}, Symbol.toStringTag, { value: "Module" }));
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(emotion_esm);
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  var _react = _interopRequireWildcard(reactExports);
  var _emotion = require$$1;
  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function")
      return null;
    var cache2 = /* @__PURE__ */ new WeakMap();
    _getRequireWildcardCache = function _getRequireWildcardCache2() {
      return cache2;
    };
    return cache2;
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    var cache2 = _getRequireWildcardCache();
    if (cache2 && cache2.has(obj)) {
      return cache2.get(obj);
    }
    var newObj = {};
    if (obj != null) {
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj["default"] = obj;
    if (cache2) {
      cache2.set(obj, newObj);
    }
    return newObj;
  }
  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n        ", "\n      "]);
    _templateObject = function _templateObject2() {
      return data;
    };
    return data;
  }
  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var _default = function _default2(_ref) {
    var repo = _ref.repo, _ref$issueTerm = _ref.issueTerm, issueTerm = _ref$issueTerm === void 0 ? "pathname" : _ref$issueTerm, _ref$label = _ref.label, label = _ref$label === void 0 ? "" : _ref$label, _ref$theme = _ref.theme, theme = _ref$theme === void 0 ? "github-light" : _ref$theme, _ref$crossorigin = _ref.crossorigin, crossorigin = _ref$crossorigin === void 0 ? "anonymous" : _ref$crossorigin, _ref$async = _ref.async, async = _ref$async === void 0 ? true : _ref$async, _ref$style = _ref.style, style = _ref$style === void 0 ? "" : _ref$style;
    var rootElm = _react["default"].createRef();
    (0, _react.useEffect)(function() {
      var utterances = document.createElement("script");
      Object.entries({
        src: "https://utteranc.es/client.js",
        repo,
        "issue-term": issueTerm,
        label,
        theme,
        crossorigin,
        async
      }).forEach(function(_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2), key = _ref3[0], value = _ref3[1];
        utterances.setAttribute(key, value);
      });
      rootElm.current.appendChild(utterances);
    }, []);
    return _react["default"].createElement("div", {
      id: "utterances_container",
      ref: rootElm,
      className: (0, _emotion.css)(_templateObject(), style)
    });
  };
  exports["default"] = _default;
})(Utterances$1);
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _Utterances["default"];
    }
  });
  var _Utterances = _interopRequireDefault(Utterances$1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { "default": obj };
  }
})(lib);
const Utterances = /* @__PURE__ */ getDefaultExportFromCjs(lib);
function MdComment({ term }) {
  console.log("Comment thread: " + term);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "md-comments", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Ackchyually..." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Utterances,
      {
        repo: "microdee/microdee.github.io",
        issueTerm: term,
        theme: "github-dark",
        crossorigin: "anonymous",
        async: false
      }
    )
  ] });
}
export {
  MdComment as default
};
//# sourceMappingURL=MdComment-Tgbxobqb.js.map
