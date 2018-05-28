! function (e, t) {
    function i() {
        var t = o.getBoundingClientRect().width;
        t / d > 540 && (t = 540 * d);
        var i = t / 18.75;
        o.style.fontSize = i + "px", s.rem = e.rem = i
    }
    var n, r = e.document,
        o = r.documentElement,
        a = r.querySelector('meta[name="viewport"]'),
        d = 1,
        l = 1,
        s = t.flexible || (t.flexible = {}),
        u = a.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
    l = parseFloat(u[1]), d = parseInt(1 / l), o.setAttribute("data-dpr", d), e.addEventListener("resize", function () {
        clearTimeout(n), n = setTimeout(i, 300)
    }, !1), e.addEventListener("pageshow", function (e) {
        e.persisted && (clearTimeout(n), n = setTimeout(i, 300))
    }, !1), i(), s.dpr = e.dpr = d, s.refreshRem = i
}(window, window.lib || (window.lib = {}));



! function () {
    var n = function () {
        if (window.performance) {
            var n = {};
            if (performance.timing.toJSON) n = performance.timing.toJSON();
            else
                for (i in performance.timing) n[i] = performance.timing[i];
            var e = {};
            if (e.page = n, e.res = [], window.performance.getEntriesByType) {
                var r = window.performance.getEntriesByType("resource");
                for (i = 0; i < r.length; i++) {
                    var o = r[i],
                        a = {};
                    a.dns = parseInt(o.domainLookupEnd - o.domainLookupStart), a.conn = parseInt(o.connectEnd - o.connectStart), a.name = o.name, a.req = parseInt(o.duration), e.res.push(a)
                }
            }(new Image).src = "https://analysis.qfpay.com/p/h5_pay?" + encodeURI(JSON.stringify(e))
        }
    };
    "complete" === document.readyState ? n() : window.addEventListener("load", function () {
        n()
    }), window.onerror = function (n, e, r, o, i) {
        var a = {};
        return a.msg = n, a.src = e, a.lineno = r, a.colno = o, i && (a.error = i.stack), (new Image).src = "https://analysis.qfpay.com/p/h5_pay_error?" + encodeURI(JSON.stringify(a)), !1
    }
}();





var Zepto = function () {
    function t(t) {
        return null == t ? String(t) : Y[J.call(t)] || "object"
    }

    function e(e) {
        return "function" == t(e)
    }

    function n(t) {
        return null != t && t == t.window
    }

    function r(t) {
        return null != t && t.nodeType == t.DOCUMENT_NODE
    }

    function i(e) {
        return "object" == t(e)
    }

    function o(t) {
        return i(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype
    }

    function a(t) {
        var e = !!t && "length" in t && t.length,
            r = j.type(t);
        return "function" != r && !n(t) && ("array" == r || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
    }

    function s(t) {
        return M.call(t, function (t) {
            return null != t
        })
    }

    function u(t) {
        return t.length > 0 ? j.fn.concat.apply([], t) : t
    }

    function c(t) {
        return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }

    function l(t) {
        return t in Z ? Z[t] : Z[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
    }

    function f(t, e) {
        return "number" != typeof e || $[c(t)] ? e : e + "px"
    }

    function h(t) {
        var e, n;
        return L[t] || (e = A.createElement(t), A.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), L[t] = n), L[t]
    }

    function p(t) {
        return "children" in t ? D.call(t.children) : j.map(t.childNodes, function (t) {
            return 1 == t.nodeType ? t : void 0
        })
    }

    function d(t, e) {
        var n, r = t ? t.length : 0;
        for (n = 0; r > n; n++) this[n] = t[n];
        this.length = r, this.selector = e || ""
    }

    function m(t, e, n) {
        for (T in e) n && (o(e[T]) || Q(e[T])) ? (o(e[T]) && !o(t[T]) && (t[T] = {}), Q(e[T]) && !Q(t[T]) && (t[T] = []), m(t[T], e[T], n)) : e[T] !== E && (t[T] = e[T])
    }

    function v(t, e) {
        return null == e ? j(t) : j(t).filter(e)
    }

    function g(t, n, r, i) {
        return e(n) ? n.call(t, r, i) : n
    }

    function y(t, e, n) {
        null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
    }

    function x(t, e) {
        var n = t.className || "",
            r = n && n.baseVal !== E;
        return e === E ? r ? n.baseVal : n : void(r ? n.baseVal = e : t.className = e)
    }

    function w(t) {
        try {
            return t ? "true" == t || "false" != t && ("null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? j.parseJSON(t) : t) : t
        } catch (e) {
            return t
        }
    }

    function b(t, e) {
        e(t);
        for (var n = 0, r = t.childNodes.length; r > n; n++) b(t.childNodes[n], e)
    }
    var E, T, j, S, N, C, P = [],
        O = P.concat,
        M = P.filter,
        D = P.slice,
        A = window.document,
        L = {},
        Z = {},
        $ = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        },
        F = /^\s*<(\w+|!)[^>]*>/,
        R = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        k = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        q = /^(?:body|html)$/i,
        z = /([A-Z])/g,
        H = ["val", "css", "html", "text", "data", "width", "height", "offset"],
        _ = ["after", "prepend", "before", "append"],
        X = A.createElement("table"),
        I = A.createElement("tr"),
        U = {
            tr: A.createElement("tbody"),
            tbody: X,
            thead: X,
            tfoot: X,
            td: I,
            th: I,
            "*": A.createElement("div")
        },
        V = /complete|loaded|interactive/,
        B = /^[\w-]*$/,
        Y = {},
        J = Y.toString,
        G = {},
        W = A.createElement("div"),
        K = {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        Q = Array.isArray || function (t) {
            return t instanceof Array
        };
    return G.matches = function (t, e) {
        if (!e || !t || 1 !== t.nodeType) return !1;
        var n = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
        if (n) return n.call(t, e);
        var r, i = t.parentNode,
            o = !i;
        return o && (i = W).appendChild(t), r = ~G.qsa(i, e).indexOf(t), o && W.removeChild(t), r
    }, N = function (t) {
        return t.replace(/-+(.)?/g, function (t, e) {
            return e ? e.toUpperCase() : ""
        })
    }, C = function (t) {
        return M.call(t, function (e, n) {
            return t.indexOf(e) == n
        })
    }, G.fragment = function (t, e, n) {
        var r, i, a;
        return R.test(t) && (r = j(A.createElement(RegExp.$1))), r || (t.replace && (t = t.replace(k, "<$1></$2>")), e === E && (e = F.test(t) && RegExp.$1), e in U || (e = "*"), a = U[e], a.innerHTML = "" + t, r = j.each(D.call(a.childNodes), function () {
            a.removeChild(this)
        })), o(n) && (i = j(r), j.each(n, function (t, e) {
            H.indexOf(t) > -1 ? i[t](e) : i.attr(t, e)
        })), r
    }, G.Z = function (t, e) {
        return new d(t, e)
    }, G.isZ = function (t) {
        return t instanceof G.Z
    }, G.init = function (t, n) {
        var r;
        if (!t) return G.Z();
        if ("string" == typeof t)
            if (t = t.trim(), "<" == t[0] && F.test(t)) r = G.fragment(t, RegExp.$1, n), t = null;
            else {
                if (n !== E) return j(n).find(t);
                r = G.qsa(A, t)
            }
        else {
            if (e(t)) return j(A).ready(t);
            if (G.isZ(t)) return t;
            if (Q(t)) r = s(t);
            else if (i(t)) r = [t], t = null;
            else if (F.test(t)) r = G.fragment(t.trim(), RegExp.$1, n), t = null;
            else {
                if (n !== E) return j(n).find(t);
                r = G.qsa(A, t)
            }
        }
        return G.Z(r, t)
    }, j = function (t, e) {
        return G.init(t, e)
    }, j.extend = function (t) {
        var e, n = D.call(arguments, 1);
        return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
            m(t, n, e)
        }), t
    }, G.qsa = function (t, e) {
        var n, r = "#" == e[0],
            i = !r && "." == e[0],
            o = r || i ? e.slice(1) : e,
            a = B.test(o);
        return t.getElementById && a && r ? (n = t.getElementById(o)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType ? [] : D.call(a && !r && t.getElementsByClassName ? i ? t.getElementsByClassName(o) : t.getElementsByTagName(e) : t.querySelectorAll(e))
    }, j.contains = A.documentElement.contains ? function (t, e) {
        return t !== e && t.contains(e)
    } : function (t, e) {
        for (; e && (e = e.parentNode);)
            if (e === t) return !0;
        return !1
    }, j.type = t, j.isFunction = e, j.isWindow = n, j.isArray = Q, j.isPlainObject = o, j.isEmptyObject = function (t) {
        var e;
        for (e in t) return !1;
        return !0
    }, j.isNumeric = function (t) {
        var e = Number(t),
            n = typeof t;
        return null != t && "boolean" != n && ("string" != n || t.length) && !isNaN(e) && isFinite(e) || !1
    }, j.inArray = function (t, e, n) {
        return P.indexOf.call(e, t, n)
    }, j.camelCase = N, j.trim = function (t) {
        return null == t ? "" : String.prototype.trim.call(t)
    }, j.uuid = 0, j.support = {}, j.expr = {}, j.noop = function () {}, j.map = function (t, e) {
        var n, r, i, o = [];
        if (a(t))
            for (r = 0; r < t.length; r++) n = e(t[r], r), null != n && o.push(n);
        else
            for (i in t) n = e(t[i], i), null != n && o.push(n);
        return u(o)
    }, j.each = function (t, e) {
        var n, r;
        if (a(t)) {
            for (n = 0; n < t.length; n++)
                if (e.call(t[n], n, t[n]) === !1) return t
        } else
            for (r in t)
                if (e.call(t[r], r, t[r]) === !1) return t;
        return t
    }, j.grep = function (t, e) {
        return M.call(t, e)
    }, window.JSON && (j.parseJSON = JSON.parse), j.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
        Y["[object " + e + "]"] = e.toLowerCase()
    }), j.fn = {
        constructor: G.Z,
        length: 0,
        forEach: P.forEach,
        reduce: P.reduce,
        push: P.push,
        sort: P.sort,
        splice: P.splice,
        indexOf: P.indexOf,
        concat: function () {
            var t, e, n = [];
            for (t = 0; t < arguments.length; t++) e = arguments[t], n[t] = G.isZ(e) ? e.toArray() : e;
            return O.apply(G.isZ(this) ? this.toArray() : this, n)
        },
        map: function (t) {
            return j(j.map(this, function (e, n) {
                return t.call(e, n, e)
            }))
        },
        slice: function () {
            return j(D.apply(this, arguments))
        },
        ready: function (t) {
            return V.test(A.readyState) && A.body ? t(j) : A.addEventListener("DOMContentLoaded", function () {
                t(j)
            }, !1), this
        },
        get: function (t) {
            return t === E ? D.call(this) : this[t >= 0 ? t : t + this.length]
        },
        toArray: function () {
            return this.get()
        },
        size: function () {
            return this.length
        },
        remove: function () {
            return this.each(function () {
                null != this.parentNode && this.parentNode.removeChild(this)
            })
        },
        each: function (t) {
            return P.every.call(this, function (e, n) {
                return t.call(e, n, e) !== !1
            }), this
        },
        filter: function (t) {
            return e(t) ? this.not(this.not(t)) : j(M.call(this, function (e) {
                return G.matches(e, t)
            }))
        },
        add: function (t, e) {
            return j(C(this.concat(j(t, e))))
        },
        is: function (t) {
            return this.length > 0 && G.matches(this[0], t)
        },
        not: function (t) {
            var n = [];
            if (e(t) && t.call !== E) this.each(function (e) {
                t.call(this, e) || n.push(this)
            });
            else {
                var r = "string" == typeof t ? this.filter(t) : a(t) && e(t.item) ? D.call(t) : j(t);
                this.forEach(function (t) {
                    r.indexOf(t) < 0 && n.push(t)
                })
            }
            return j(n)
        },
        has: function (t) {
            return this.filter(function () {
                return i(t) ? j.contains(this, t) : j(this).find(t).size()
            })
        },
        eq: function (t) {
            return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
        },
        first: function () {
            var t = this[0];
            return t && !i(t) ? t : j(t)
        },
        last: function () {
            var t = this[this.length - 1];
            return t && !i(t) ? t : j(t)
        },
        find: function (t) {
            var e, n = this;
            return e = t ? "object" == typeof t ? j(t).filter(function () {
                var t = this;
                return P.some.call(n, function (e) {
                    return j.contains(e, t)
                })
            }) : 1 == this.length ? j(G.qsa(this[0], t)) : this.map(function () {
                return G.qsa(this, t)
            }) : j()
        },
        closest: function (t, e) {
            var n = [],
                i = "object" == typeof t && j(t);
            return this.each(function (o, a) {
                for (; a && !(i ? i.indexOf(a) >= 0 : G.matches(a, t));) a = a !== e && !r(a) && a.parentNode;
                a && n.indexOf(a) < 0 && n.push(a)
            }), j(n)
        },
        parents: function (t) {
            for (var e = [], n = this; n.length > 0;) n = j.map(n, function (t) {
                return (t = t.parentNode) && !r(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
            });
            return v(e, t)
        },
        parent: function (t) {
            return v(C(this.pluck("parentNode")), t)
        },
        children: function (t) {
            return v(this.map(function () {
                return p(this)
            }), t)
        },
        contents: function () {
            return this.map(function () {
                return this.contentDocument || D.call(this.childNodes)
            })
        },
        siblings: function (t) {
            return v(this.map(function (t, e) {
                return M.call(p(e.parentNode), function (t) {
                    return t !== e
                })
            }), t)
        },
        empty: function () {
            return this.each(function () {
                this.innerHTML = ""
            })
        },
        pluck: function (t) {
            return j.map(this, function (e) {
                return e[t]
            })
        },
        show: function () {
            return this.each(function () {
                "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
            })
        },
        replaceWith: function (t) {
            return this.before(t).remove()
        },
        wrap: function (t) {
            var n = e(t);
            if (this[0] && !n) var r = j(t).get(0),
                i = r.parentNode || this.length > 1;
            return this.each(function (e) {
                j(this).wrapAll(n ? t.call(this, e) : i ? r.cloneNode(!0) : r)
            })
        },
        wrapAll: function (t) {
            if (this[0]) {
                j(this[0]).before(t = j(t));
                for (var e;
                    (e = t.children()).length;) t = e.first();
                j(t).append(this)
            }
            return this
        },
        wrapInner: function (t) {
            var n = e(t);
            return this.each(function (e) {
                var r = j(this),
                    i = r.contents(),
                    o = n ? t.call(this, e) : t;
                i.length ? i.wrapAll(o) : r.append(o)
            })
        },
        unwrap: function () {
            return this.parent().each(function () {
                j(this).replaceWith(j(this).children())
            }), this
        },
        clone: function () {
            return this.map(function () {
                return this.cloneNode(!0)
            })
        },
        hide: function () {
            return this.css("display", "none")
        },
        toggle: function (t) {
            return this.each(function () {
                var e = j(this);
                (t === E ? "none" == e.css("display") : t) ? e.show(): e.hide()
            })
        },
        prev: function (t) {
            return j(this.pluck("previousElementSibling")).filter(t || "*")
        },
        next: function (t) {
            return j(this.pluck("nextElementSibling")).filter(t || "*")
        },
        html: function (t) {
            return 0 in arguments ? this.each(function (e) {
                var n = this.innerHTML;
                j(this).empty().append(g(this, t, e, n))
            }) : 0 in this ? this[0].innerHTML : null
        },
        text: function (t) {
            return 0 in arguments ? this.each(function (e) {
                var n = g(this, t, e, this.textContent);
                this.textContent = null == n ? "" : "" + n
            }) : 0 in this ? this.pluck("textContent").join("") : null
        },
        attr: function (t, e) {
            var n;
            return "string" != typeof t || 1 in arguments ? this.each(function (n) {
                if (1 === this.nodeType)
                    if (i(t))
                        for (T in t) y(this, T, t[T]);
                    else y(this, t, g(this, e, n, this.getAttribute(t)))
            }) : 0 in this && 1 == this[0].nodeType && null != (n = this[0].getAttribute(t)) ? n : E
        },
        removeAttr: function (t) {
            return this.each(function () {
                1 === this.nodeType && t.split(" ").forEach(function (t) {
                    y(this, t)
                }, this)
            })
        },
        prop: function (t, e) {
            return t = K[t] || t, 1 in arguments ? this.each(function (n) {
                this[t] = g(this, e, n, this[t])
            }) : this[0] && this[0][t]
        },
        removeProp: function (t) {
            return t = K[t] || t, this.each(function () {
                delete this[t]
            })
        },
        data: function (t, e) {
            var n = "data-" + t.replace(z, "-$1").toLowerCase(),
                r = 1 in arguments ? this.attr(n, e) : this.attr(n);
            return null !== r ? w(r) : E
        },
        val: function (t) {
            return 0 in arguments ? (null == t && (t = ""), this.each(function (e) {
                this.value = g(this, t, e, this.value)
            })) : this[0] && (this[0].multiple ? j(this[0]).find("option").filter(function () {
                return this.selected
            }).pluck("value") : this[0].value)
        },
        offset: function (t) {
            if (t) return this.each(function (e) {
                var n = j(this),
                    r = g(this, t, e, n.offset()),
                    i = n.offsetParent().offset(),
                    o = {
                        top: r.top - i.top,
                        left: r.left - i.left
                    };
                "static" == n.css("position") && (o.position = "relative"), n.css(o)
            });
            if (!this.length) return null;
            if (A.documentElement !== this[0] && !j.contains(A.documentElement, this[0])) return {
                top: 0,
                left: 0
            };
            var e = this[0].getBoundingClientRect();
            return {
                left: e.left + window.pageXOffset,
                top: e.top + window.pageYOffset,
                width: Math.round(e.width),
                height: Math.round(e.height)
            }
        },
        css: function (e, n) {
            if (arguments.length < 2) {
                var r = this[0];
                if ("string" == typeof e) {
                    if (!r) return;
                    return r.style[N(e)] || getComputedStyle(r, "").getPropertyValue(e)
                }
                if (Q(e)) {
                    if (!r) return;
                    var i = {},
                        o = getComputedStyle(r, "");
                    return j.each(e, function (t, e) {
                        i[e] = r.style[N(e)] || o.getPropertyValue(e)
                    }), i
                }
            }
            var a = "";
            if ("string" == t(e)) n || 0 === n ? a = c(e) + ":" + f(e, n) : this.each(function () {
                this.style.removeProperty(c(e))
            });
            else
                for (T in e) e[T] || 0 === e[T] ? a += c(T) + ":" + f(T, e[T]) + ";" : this.each(function () {
                    this.style.removeProperty(c(T))
                });
            return this.each(function () {
                this.style.cssText += ";" + a
            })
        },
        index: function (t) {
            return t ? this.indexOf(j(t)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function (t) {
            return !!t && P.some.call(this, function (t) {
                return this.test(x(t))
            }, l(t))
        },
        addClass: function (t) {
            return t ? this.each(function (e) {
                if ("className" in this) {
                    S = [];
                    var n = x(this),
                        r = g(this, t, e, n);
                    r.split(/\s+/g).forEach(function (t) {
                        j(this).hasClass(t) || S.push(t)
                    }, this), S.length && x(this, n + (n ? " " : "") + S.join(" "))
                }
            }) : this
        },
        removeClass: function (t) {
            return this.each(function (e) {
                if ("className" in this) {
                    if (t === E) return x(this, "");
                    S = x(this), g(this, t, e, S).split(/\s+/g).forEach(function (t) {
                        S = S.replace(l(t), " ")
                    }), x(this, S.trim())
                }
            })
        },
        toggleClass: function (t, e) {
            return t ? this.each(function (n) {
                var r = j(this),
                    i = g(this, t, n, x(this));
                i.split(/\s+/g).forEach(function (t) {
                    (e === E ? !r.hasClass(t) : e) ? r.addClass(t): r.removeClass(t)
                })
            }) : this
        },
        scrollTop: function (t) {
            if (this.length) {
                var e = "scrollTop" in this[0];
                return t === E ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function () {
                    this.scrollTop = t
                } : function () {
                    this.scrollTo(this.scrollX, t)
                })
            }
        },
        scrollLeft: function (t) {
            if (this.length) {
                var e = "scrollLeft" in this[0];
                return t === E ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function () {
                    this.scrollLeft = t
                } : function () {
                    this.scrollTo(t, this.scrollY)
                })
            }
        },
        position: function () {
            if (this.length) {
                var t = this[0],
                    e = this.offsetParent(),
                    n = this.offset(),
                    r = q.test(e[0].nodeName) ? {
                        top: 0,
                        left: 0
                    } : e.offset();
                return n.top -= parseFloat(j(t).css("margin-top")) || 0, n.left -= parseFloat(j(t).css("margin-left")) || 0, r.top += parseFloat(j(e[0]).css("border-top-width")) || 0, r.left += parseFloat(j(e[0]).css("border-left-width")) || 0, {
                    top: n.top - r.top,
                    left: n.left - r.left
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var t = this.offsetParent || A.body; t && !q.test(t.nodeName) && "static" == j(t).css("position");) t = t.offsetParent;
                return t
            })
        }
    }, j.fn.detach = j.fn.remove, ["width", "height"].forEach(function (t) {
        var e = t.replace(/./, function (t) {
            return t[0].toUpperCase()
        });
        j.fn[t] = function (i) {
            var o, a = this[0];
            return i === E ? n(a) ? a["inner" + e] : r(a) ? a.documentElement["scroll" + e] : (o = this.offset()) && o[t] : this.each(function (e) {
                a = j(this), a.css(t, g(this, i, e, a[t]()))
            })
        }
    }), _.forEach(function (e, n) {
        var r = n % 2;
        j.fn[e] = function () {
            var e, i, o = j.map(arguments, function (n) {
                    var r = [];
                    return e = t(n), "array" == e ? (n.forEach(function (t) {
                        return t.nodeType !== E ? r.push(t) : j.zepto.isZ(t) ? r = r.concat(t.get()) : void(r = r.concat(G.fragment(t)))
                    }), r) : "object" == e || null == n ? n : G.fragment(n)
                }),
                a = this.length > 1;
            return o.length < 1 ? this : this.each(function (t, e) {
                i = r ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null;
                var s = j.contains(A.documentElement, i);
                o.forEach(function (t) {
                    if (a) t = t.cloneNode(!0);
                    else if (!i) return j(t).remove();
                    i.insertBefore(t, e), s && b(t, function (t) {
                        if (!(null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src)) {
                            var e = t.ownerDocument ? t.ownerDocument.defaultView : window;
                            e.eval.call(e, t.innerHTML)
                        }
                    })
                })
            })
        }, j.fn[r ? e + "To" : "insert" + (n ? "Before" : "After")] = function (t) {
            return j(t)[e](this), this
        }
    }), G.Z.prototype = d.prototype = j.fn, G.uniq = C, G.deserializeValue = w, j.zepto = G, j
}();
window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto),
    function (t) {
        function e(e, n, r) {
            var i = t.Event(n);
            return t(e).trigger(i, r), !i.isDefaultPrevented()
        }

        function n(t, n, r, i) {
            return t.global ? e(n || x, r, i) : void 0
        }

        function r(e) {
            e.global && 0 === t.active++ && n(e, null, "ajaxStart")
        }

        function i(e) {
            e.global && !--t.active && n(e, null, "ajaxStop")
        }

        function o(t, e) {
            var r = e.context;
            return e.beforeSend.call(r, t, e) !== !1 && n(e, r, "ajaxBeforeSend", [t, e]) !== !1 && void n(e, r, "ajaxSend", [t, e])
        }

        function a(t, e, r, i) {
            var o = r.context,
                a = "success";
            r.success.call(o, t, a, e), i && i.resolveWith(o, [t, a, e]), n(r, o, "ajaxSuccess", [e, r, t]), u(a, e, r)
        }

        function s(t, e, r, i, o) {
            var a = i.context;
            i.error.call(a, r, e, t), o && o.rejectWith(a, [r, e, t]), n(i, a, "ajaxError", [r, i, t || e]), u(e, r, i)
        }

        function u(t, e, r) {
            var o = r.context;
            r.complete.call(o, e, t), n(r, o, "ajaxComplete", [e, r]), i(r)
        }

        function c(t, e, n) {
            if (n.dataFilter == l) return t;
            var r = n.context;
            return n.dataFilter.call(r, t, e)
        }

        function l() {}

        function f(t) {
            return t && (t = t.split(";", 2)[0]), t && (t == j ? "html" : t == T ? "json" : b.test(t) ? "script" : E.test(t) && "xml") || "text"
        }

        function h(t, e) {
            return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
        }

        function p(e) {
            e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() && "jsonp" != e.dataType || (e.url = h(e.url, e.data), e.data = void 0)
        }

        function d(e, n, r, i) {
            return t.isFunction(n) && (i = r, r = n, n = void 0), t.isFunction(r) || (i = r, r = void 0), {
                url: e,
                data: n,
                success: r,
                dataType: i
            }
        }

        function m(e, n, r, i) {
            var o, a = t.isArray(n),
                s = t.isPlainObject(n);
            t.each(n, function (n, u) {
                o = t.type(u), i && (n = r ? i : i + "[" + (s || "object" == o || "array" == o ? n : "") + "]"), !i && a ? e.add(u.name, u.value) : "array" == o || !r && "object" == o ? m(e, u, r, n) : e.add(n, u)
            })
        }
        var v, g, y = +new Date,
            x = window.document,
            w = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            b = /^(?:text|application)\/javascript/i,
            E = /^(?:text|application)\/xml/i,
            T = "application/json",
            j = "text/html",
            S = /^\s*$/,
            N = x.createElement("a");
        N.href = window.location.href, t.active = 0, t.ajaxJSONP = function (e, n) {
            if (!("type" in e)) return t.ajax(e);
            var r, i, u = e.jsonpCallback,
                c = (t.isFunction(u) ? u() : u) || "Zepto" + y++,
                l = x.createElement("script"),
                f = window[c],
                h = function (e) {
                    t(l).triggerHandler("error", e || "abort")
                },
                p = {
                    abort: h
                };
            return n && n.promise(p), t(l).on("load error", function (o, u) {
                clearTimeout(i), t(l).off().remove(), "error" != o.type && r ? a(r[0], p, e, n) : s(null, u || "error", p, e, n), window[c] = f, r && t.isFunction(f) && f(r[0]), f = r = void 0
            }), o(p, e) === !1 ? (h("abort"), p) : (window[c] = function () {
                r = arguments
            }, l.src = e.url.replace(/\?(.+)=\?/, "?$1=" + c), x.head.appendChild(l), e.timeout > 0 && (i = setTimeout(function () {
                h("timeout")
            }, e.timeout)), p)
        }, t.ajaxSettings = {
            type: "GET",
            beforeSend: l,
            success: l,
            error: l,
            complete: l,
            context: null,
            global: !0,
            xhr: function () {
                return new window.XMLHttpRequest
            },
            accepts: {
                script: "text/javascript, application/javascript, application/x-javascript",
                json: T,
                xml: "application/xml, text/xml",
                html: j,
                text: "text/plain"
            },
            crossDomain: !1,
            timeout: 0,
            processData: !0,
            cache: !0,
            dataFilter: l
        }, t.ajax = function (e) {
            var n, i, u = t.extend({}, e || {}),
                d = t.Deferred && t.Deferred();
            for (v in t.ajaxSettings) void 0 === u[v] && (u[v] = t.ajaxSettings[v]);
            r(u), u.crossDomain || (n = x.createElement("a"), n.href = u.url, n.href = n.href, u.crossDomain = N.protocol + "//" + N.host != n.protocol + "//" + n.host), u.url || (u.url = window.location.toString()), (i = u.url.indexOf("#")) > -1 && (u.url = u.url.slice(0, i)), p(u);
            var m = u.dataType,
                y = /\?.+=\?/.test(u.url);
            if (y && (m = "jsonp"), u.cache !== !1 && (e && e.cache === !0 || "script" != m && "jsonp" != m) || (u.url = h(u.url, "_=" + Date.now())), "jsonp" == m) return y || (u.url = h(u.url, u.jsonp ? u.jsonp + "=?" : u.jsonp === !1 ? "" : "callback=?")), t.ajaxJSONP(u, d);
            var w, b = u.accepts[m],
                E = {},
                T = function (t, e) {
                    E[t.toLowerCase()] = [t, e]
                },
                j = /^([\w-]+:)\/\//.test(u.url) ? RegExp.$1 : window.location.protocol,
                C = u.xhr(),
                P = C.setRequestHeader;
            if (d && d.promise(C), u.crossDomain || T("X-Requested-With", "XMLHttpRequest"), T("Accept", b || "*/*"), (b = u.mimeType || b) && (b.indexOf(",") > -1 && (b = b.split(",", 2)[0]), C.overrideMimeType && C.overrideMimeType(b)), (u.contentType || u.contentType !== !1 && u.data && "GET" != u.type.toUpperCase()) && T("Content-Type", u.contentType || "application/x-www-form-urlencoded"), u.headers)
                for (g in u.headers) T(g, u.headers[g]);
            if (C.setRequestHeader = T, C.onreadystatechange = function () {
                    if (4 == C.readyState) {
                        C.onreadystatechange = l, clearTimeout(w);
                        var e, n = !1;
                        if (C.status >= 200 && C.status < 300 || 304 == C.status || 0 == C.status && "file:" == j) {
                            if (m = m || f(u.mimeType || C.getResponseHeader("content-type")), "arraybuffer" == C.responseType || "blob" == C.responseType) e = C.response;
                            else {
                                e = C.responseText;
                                try {
                                    e = c(e, m, u), "script" == m ? (0, eval)(e) : "xml" == m ? e = C.responseXML : "json" == m && (e = S.test(e) ? null : t.parseJSON(e))
                                } catch (r) {
                                    n = r
                                }
                                if (n) return s(n, "parsererror", C, u, d)
                            }
                            a(e, C, u, d)
                        } else s(C.statusText || null, C.status ? "error" : "abort", C, u, d)
                    }
                }, o(C, u) === !1) return C.abort(), s(null, "abort", C, u, d), C;
            var O = !("async" in u) || u.async;
            if (C.open(u.type, u.url, O, u.username, u.password), u.xhrFields)
                for (g in u.xhrFields) C[g] = u.xhrFields[g];
            for (g in E) P.apply(C, E[g]);
            return u.timeout > 0 && (w = setTimeout(function () {
                C.onreadystatechange = l, C.abort(), s(null, "timeout", C, u, d)
            }, u.timeout)), C.send(u.data ? u.data : null), C
        }, t.get = function () {
            return t.ajax(d.apply(null, arguments))
        }, t.post = function () {
            var e = d.apply(null, arguments);
            return e.type = "POST", t.ajax(e)
        }, t.getJSON = function () {
            var e = d.apply(null, arguments);
            return e.dataType = "json", t.ajax(e)
        }, t.fn.load = function (e, n, r) {
            if (!this.length) return this;
            var i, o = this,
                a = e.split(/\s/),
                s = d(e, n, r),
                u = s.success;
            return a.length > 1 && (s.url = a[0], i = a[1]), s.success = function (e) {
                o.html(i ? t("<div>").html(e.replace(w, "")).find(i) : e), u && u.apply(o, arguments)
            }, t.ajax(s), this
        };
        var C = encodeURIComponent;
        t.param = function (e, n) {
            var r = [];
            return r.add = function (e, n) {
                t.isFunction(n) && (n = n()), null == n && (n = ""), this.push(C(e) + "=" + C(n))
            }, m(r, e, n), r.join("&").replace(/%20/g, "+")
        }
    }(Zepto),
    function (t) {
        function e(t) {
            return t._zid || (t._zid = h++)
        }

        function n(t, n, o, a) {
            if (n = r(n), n.ns) var s = i(n.ns);
            return (v[e(t)] || []).filter(function (t) {
                return t && (!n.e || t.e == n.e) && (!n.ns || s.test(t.ns)) && (!o || e(t.fn) === e(o)) && (!a || t.sel == a)
            })
        }

        function r(t) {
            var e = ("" + t).split(".");
            return {
                e: e[0],
                ns: e.slice(1).sort().join(" ")
            }
        }

        function i(t) {
            return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
        }

        function o(t, e) {
            return t.del && !y && t.e in x || !!e
        }

        function a(t) {
            return w[t] || y && x[t] || t
        }

        function s(n, i, s, u, l, h, p) {
            var d = e(n),
                m = v[d] || (v[d] = []);
            i.split(/\s/).forEach(function (e) {
                if ("ready" == e) return t(document).ready(s);
                var i = r(e);
                i.fn = s, i.sel = l, i.e in w && (s = function (e) {
                    var n = e.relatedTarget;
                    return !n || n !== this && !t.contains(this, n) ? i.fn.apply(this, arguments) : void 0
                }), i.del = h;
                var d = h || s;
                i.proxy = function (t) {
                    if (t = c(t), !t.isImmediatePropagationStopped()) {
                        t.data = u;
                        var e = d.apply(n, t._args == f ? [t] : [t].concat(t._args));
                        return e === !1 && (t.preventDefault(), t.stopPropagation()), e
                    }
                }, i.i = m.length, m.push(i), "addEventListener" in n && n.addEventListener(a(i.e), i.proxy, o(i, p))
            })
        }

        function u(t, r, i, s, u) {
            var c = e(t);
            (r || "").split(/\s/).forEach(function (e) {
                n(t, e, i, s).forEach(function (e) {
                    delete v[c][e.i], "removeEventListener" in t && t.removeEventListener(a(e.e), e.proxy, o(e, u))
                })
            })
        }

        function c(e, n) {
            if (n || !e.isDefaultPrevented) {
                n || (n = e), t.each(j, function (t, r) {
                    var i = n[t];
                    e[t] = function () {
                        return this[r] = b, i && i.apply(n, arguments)
                    }, e[r] = E
                });
                try {
                    e.timeStamp || (e.timeStamp = Date.now())
                } catch (r) {}(n.defaultPrevented !== f ? n.defaultPrevented : "returnValue" in n ? n.returnValue === !1 : n.getPreventDefault && n.getPreventDefault()) && (e.isDefaultPrevented = b)
            }
            return e
        }

        function l(t) {
            var e, n = {
                originalEvent: t
            };
            for (e in t) T.test(e) || t[e] === f || (n[e] = t[e]);
            return c(n, t)
        }
        var f, h = 1,
            p = Array.prototype.slice,
            d = t.isFunction,
            m = function (t) {
                return "string" == typeof t
            },
            v = {},
            g = {},
            y = "onfocusin" in window,
            x = {
                focus: "focusin",
                blur: "focusout"
            },
            w = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
        g.click = g.mousedown = g.mouseup = g.mousemove = "MouseEvents", t.event = {
            add: s,
            remove: u
        }, t.proxy = function (n, r) {
            var i = 2 in arguments && p.call(arguments, 2);
            if (d(n)) {
                var o = function () {
                    return n.apply(r, i ? i.concat(p.call(arguments)) : arguments)
                };
                return o._zid = e(n), o
            }
            if (m(r)) return i ? (i.unshift(n[r], n), t.proxy.apply(null, i)) : t.proxy(n[r], n);
            throw new TypeError("expected function")
        }, t.fn.bind = function (t, e, n) {
            return this.on(t, e, n)
        }, t.fn.unbind = function (t, e) {
            return this.off(t, e)
        }, t.fn.one = function (t, e, n, r) {
            return this.on(t, e, n, r, 1)
        };
        var b = function () {
                return !0
            },
            E = function () {
                return !1
            },
            T = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
            j = {
                preventDefault: "isDefaultPrevented",
                stopImmediatePropagation: "isImmediatePropagationStopped",
                stopPropagation: "isPropagationStopped"
            };
        t.fn.delegate = function (t, e, n) {
            return this.on(e, t, n)
        }, t.fn.undelegate = function (t, e, n) {
            return this.off(e, t, n)
        }, t.fn.live = function (e, n) {
            return t(document.body).delegate(this.selector, e, n), this
        }, t.fn.die = function (e, n) {
            return t(document.body).undelegate(this.selector, e, n), this
        }, t.fn.on = function (e, n, r, i, o) {
            var a, c, h = this;
            return e && !m(e) ? (t.each(e, function (t, e) {
                h.on(t, n, r, e, o)
            }), h) : (m(n) || d(i) || i === !1 || (i = r, r = n, n = f), (i === f || r === !1) && (i = r, r = f), i === !1 && (i = E), h.each(function (f, h) {
                o && (a = function (t) {
                    return u(h, t.type, i), i.apply(this, arguments)
                }), n && (c = function (e) {
                    var r, o = t(e.target).closest(n, h).get(0);
                    return o && o !== h ? (r = t.extend(l(e), {
                        currentTarget: o,
                        liveFired: h
                    }), (a || i).apply(o, [r].concat(p.call(arguments, 1)))) : void 0
                }), s(h, e, i, r, n, c || a)
            }))
        }, t.fn.off = function (e, n, r) {
            var i = this;
            return e && !m(e) ? (t.each(e, function (t, e) {
                i.off(t, n, e)
            }), i) : (m(n) || d(r) || r === !1 || (r = n, n = f), r === !1 && (r = E), i.each(function () {
                u(this, e, r, n)
            }))
        }, t.fn.trigger = function (e, n) {
            return e = m(e) || t.isPlainObject(e) ? t.Event(e) : c(e), e._args = n, this.each(function () {
                e.type in x && "function" == typeof this[e.type] ? this[e.type]() : "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n)
            })
        }, t.fn.triggerHandler = function (e, r) {
            var i, o;
            return this.each(function (a, s) {
                i = l(m(e) ? t.Event(e) : e), i._args = r, i.target = s, t.each(n(s, e.type || e), function (t, e) {
                    return o = e.proxy(i), !i.isImmediatePropagationStopped() && void 0
                })
            }), o
        }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (e) {
            t.fn[e] = function (t) {
                return 0 in arguments ? this.bind(e, t) : this.trigger(e)
            }
        }), t.Event = function (t, e) {
            m(t) || (e = t, t = e.type);
            var n = document.createEvent(g[t] || "Events"),
                r = !0;
            if (e)
                for (var i in e) "bubbles" == i ? r = !!e[i] : n[i] = e[i];
            return n.initEvent(t, r, !0), c(n)
        }
    }(Zepto),
    function (t) {
        function e(t, e, n, r) {
            return Math.abs(t - e) >= Math.abs(n - r) ? t - e > 0 ? "Left" : "Right" : n - r > 0 ? "Up" : "Down"
        }

        function n() {
            l = null, h.last && (h.el.trigger("longTap"), h = {})
        }

        function r() {
            l && clearTimeout(l), l = null
        }

        function i() {
            s && clearTimeout(s), u && clearTimeout(u), c && clearTimeout(c), l && clearTimeout(l), s = u = c = l = null, h = {}
        }

        function o(t) {
            return ("touch" == t.pointerType || t.pointerType == t.MSPOINTER_TYPE_TOUCH) && t.isPrimary
        }

        function a(t, e) {
            return t.type == "pointer" + e || t.type.toLowerCase() == "mspointer" + e
        }
        var s, u, c, l, f, h = {},
            p = 750;
        t(document).ready(function () {
            var d, m, v, g, y = 0,
                x = 0;
            "MSGesture" in window && (f = new MSGesture, f.target = document.body), t(document).bind("MSGestureEnd", function (t) {
                var e = t.velocityX > 1 ? "Right" : t.velocityX < -1 ? "Left" : t.velocityY > 1 ? "Down" : t.velocityY < -1 ? "Up" : null;
                e && (h.el.trigger("swipe"), h.el.trigger("swipe" + e))
            }).on("touchstart MSPointerDown pointerdown", function (e) {
                (!(g = a(e, "down")) || o(e)) && (v = g ? e : e.touches[0], e.touches && 1 === e.touches.length && h.x2 && (h.x2 = void 0, h.y2 = void 0), d = Date.now(), m = d - (h.last || d), h.el = t("tagName" in v.target ? v.target : v.target.parentNode), s && clearTimeout(s), h.x1 = v.pageX, h.y1 = v.pageY, m > 0 && 250 >= m && (h.isDoubleTap = !0), h.last = d, l = setTimeout(n, p), f && g && f.addPointer(e.pointerId))
            }).on("touchmove MSPointerMove pointermove", function (t) {
                (!(g = a(t, "move")) || o(t)) && (v = g ? t : t.touches[0], r(), h.x2 = v.pageX, h.y2 = v.pageY, y += Math.abs(h.x1 - h.x2), x += Math.abs(h.y1 - h.y2))
            }).on("touchend MSPointerUp pointerup", function (n) {
                (!(g = a(n, "up")) || o(n)) && (r(), h.x2 && Math.abs(h.x1 - h.x2) > 30 || h.y2 && Math.abs(h.y1 - h.y2) > 30 ? c = setTimeout(function () {
                    h.el && (h.el.trigger("swipe"), h.el.trigger("swipe" + e(h.x1, h.x2, h.y1, h.y2))), h = {}
                }, 0) : "last" in h && (30 > y && 30 > x ? u = setTimeout(function () {
                    var e = t.Event("tap");
                    e.cancelTouch = i, h.el && h.el.trigger(e), h.isDoubleTap ? (h.el && h.el.trigger("doubleTap"), h = {}) : s = setTimeout(function () {
                        s = null, h.el && h.el.trigger("singleTap"), h = {}
                    }, 250)
                }, 0) : h = {}), y = x = 0)
            }).on("touchcancel MSPointerCancel pointercancel", i), t(window).on("scroll", i)
        }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (e) {
            t.fn[e] = function (t) {
                return this.on(e, t)
            }
        })
    }(Zepto);
! function (t) {
    var e = t.Zepto || t.jQuery,
        a = function (t) {
            t = t || {};
            var a = this;
            a.integer = t.integer || 5, a.decimal = t.decimal || 2, a.text = [], a.integer_flag = !0;
            var n = e(".key"),
                i = e("#keyboard-text"),
                x = e(".pay");
            n.on("touchstart", function (t) {
                t.preventDefault(), e(this).addClass("hover")
            }), n.on("touchend touchcancel touchmove", function (t) {
                t.preventDefault(), e(this).removeClass("hover")
            }), n.on("tap", function (t) {
                var n = e(this).data("str");
                switch (n) {
                    case "del":
                        a.text.pop();
                        break;
                    case "hide":
                        break;
                    case "submit":
                        break;
                    case ".":
                        0 == a.text.length && a.text.push("0"), a.text.indexOf(".") < 0 && a.text.push(n);
                        break;
                    default:
                        1 == a.text.length && "0" == a.text[0] && a.text.pop(),
                         a.text.indexOf(".") < 0 && a.text.length < a.integer 
                         ? a.text.push(n) 
                         : a.text.length - a.text.indexOf(".") < a.decimal + 1 && a.text.push(n)
                }
                0 == a.text.length || 1 == a.text.length && "0" == a.text[0] || "." == a.text[a.text.length - 1] ? x.removeClass("active") : x.addClass("active"), i.html(a.text.join(""))
            })
        };
    t.keyBoard = a
}(window);
! function (e) {
    function t(e) {
        q && ("undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", e), document.attachEvent("onWeixinJSBridgeReady", e)) : e())
    }

    function a(e) {
        B && ("undefined" == typeof WebViewJavascriptBridge ? document.addEventListener ? document.addEventListener("WebViewJavascriptBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("WebViewJavascriptBridgeReady", e), document.attachEvent("onWebViewJavascriptBridgeReady", e)) : e())
    }

    function n(e) {
        E && ("undefined" == typeof AlipayJSBridge ? document.addEventListener ? document.addEventListener("AlipayJSBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("AlipayJSBridgeReady", e), document.attachEvent("onAlipayJSBridgeReady", e)) : e())
    }

    function i() {
        h("#pay").addClass("active"), h("#pay").html("确认<br>支付"), h("#pay").on("tap", function () {
            l()
        })
    }

    function d() {
        h("#pay").removeClass("active"), h("#pay").html("正在<br>支付"), h("#pay").off("tap"), h("#pay-now").off("tap")
    }

    function o(e) {
        h(".alert-text").html(e), h(".alert").show(), h(".alert-button").click(function () {
            h(".alert").hide()
        })
    }

    function r(e, t) {
        e && h.ajax({
            url: e,
            data: {
                userid: w.h,
                customer_id: t,
                format: "cors"
            },
            dataType: "html",
            type: "get",
            timeout: 2e3,
            success: function (e) {
                h("#message").html(e)
            }
        })
    }

    function c(t) {
        h.ajax({
            url: "/trade/v1/set_result",
            data: {
                syssn: t.data.syssn,
                reqid: g
            },
            type: "get",
            timeout: 2e3,
            complete: function () {
                e.location.replace(t.data.redirect_uri)
            }
        })
    }

    function p(e) {
        t(function () {
            WeixinJSBridge.invoke("getBrandWCPayRequest", e.data.pay_params, function (t) {
                "get_brand_wcpay_request:ok" == t.err_msg ? c(e) : "get_brand_wcpay_request:cancel" == t.err_msg || o("唤起微信支付错误，请稍后再试"), i()
            })
        })
    }

    function u(e, t, a, n, i) {
        i > 0 && h("#balance-row").show(), a > 0 && (h("#coupon-row").show(), h("#order-coupon-amt").html((a / 100).toFixed(2)), h("#order-coupon-title").html(n)), h("#order-pay-amt").html((e / 100).toFixed(2)), t != e && h("#order-total-amt").html("¥ " + (t / 100).toFixed(2)), setTimeout(function () {
            h("#order").addClass("active")
        }, 0)
    }

    function l() {
        var t = h("#keyboard-text").html();
        return t = (100 * parseFloat(t)).toFixed(0), t > 0 && t <= b && 0 == _ && h("#id-balance-checkbox").is(":checked") ? (_ = t, u(t, t, 0, "", _), void h("#pay-now").on("tap", function () {
            l()
        })) : void(t > 0 && h.ajax({
            url: "/q/payment",
            type: "post",
            dataType: "json",
            timeout: 3e4,
            data: {
                txamt: t,
                openid: m,
                appid: s,
                huid: w.h,
                opuid: w.o,
                reqid: g,
                balance: _,
                currency: v
            },
            beforeSend: function () {
                h(".loading").show(), d()
            },
            success: function (t) {
                "0000" != t.respcd ? (o(t.resperr), i()) : "weixin" == t.data.type ? t.data.coupon_amt > 0 ? (u(t.data.pay_amt, t.data.total_amt, t.data.coupon_amt, t.data.coupon_title, 0), h("#pay-now").on("tap", function () {
                    p(t)
                })) : p(t) : "alipay" == t.data.type ? n(function () {
                    AlipayJSBridge.call("tradePay", t.data.pay_params, function (e) {
                        "9000" == e.resultCode ? c(t) : "6001" == e.resultCode || o("唤起支付宝失败，请稍后再试"), i()
                    })
                }) : "jdpay" == t.data.type ? f.pay({
                    params: t.data.pay_params,
                    callback: function (e) {
                        if (e) {
                            var a = JSON.parse(e);
                            "SUCCESS" == a.status && c(t)
                        }
                        i()
                    }
                }) : "qqpay" == t.data.type ? mqq.tenpay.pay(t.data.pay_params, function (e) {
                    0 == e.resultCode ? c(t) : e.resultCode == -11001 || e.resultCode == -1 || o("唤起QQ钱包失败，请稍后再试"), i()
                }) : "prepaid" == t.data.type ? c(t) : "url" == t.data.type && e.location.replace(t.data.pay_params.pay_url)
            },
            complete: function () {
                h(".loading").hide()
            },
            error: function (e) {
                o("网络不好， 请稍后重试!!!"), i()
            }
        }))
    }
    var s, m, y, f, h = (e.keyBoard(), e.Zepto || e.jQuery),
        g = "",
        v = "156",
        b = 0,
        _ = 0,
        x = navigator.userAgent,
        B = /WalletClient/.test(x),
        q = /MicroMessenger/.test(x),
        E = /Alipay/.test(x),
        J = /QQ/.test(x),
        w = function (e) {
            var t = e.location.search,
                a = {};
            if (t.indexOf("?") != -1)
                for (var n = t.substr(1), i = n.split("&"), d = 0; d < i.length; d++) {
                    var o = i[d].split("=")[0];
                    a[o] = i[d].split("=")[1]
                }
            return a
        }(e);
    if (B) {
        var S = document.createElement("script");
        S.src = "//s.qfpay.com.cn/js/jdsdk-mini.js", S.onload = function () {
            f = new JDP
        }, document.getElementsByTagName("head")[0].appendChild(S)
    }
    if (J && !q) {
        var S = document.createElement("script");
        S.src = "//pub.idqqimg.com/qqmobile/qqapi.js?_bid=152", document.getElementsByTagName("head")[0].appendChild(S)
    }
    e.onload = function () {
        t(function () {
            WeixinJSBridge.call("hideOptionMenu"), WeixinJSBridge.call("hideToolbar")
        }), a(function () {
            f.setTitle(h("title").html())
        }), n(function () {
            AlipayJSBridge.call("hideOptionMenu"), AlipayJSBridge.call("hideToolbar")
        }), h.ajax({
            url: "/q/info",
            type: "get",
            dataType: "json",
            data: {
                code: w.code || w.auth_code || "",
                huid: w.h || "",
                opuid: w.o || "",
                reqid: w.reqid || w.state || ""
            },
            success: function (t) {
                "0000" == t.respcd ? (s = t.data.profile.appid, m = t.data.customer.openid, v = t.data.profile.currency, y = t.data.profile.nickname, b = t.data.customer.balance, g = t.data.reqid, h("#currency_name").html(t.data.profile.currency_code), h("#nickname").html(y), h("#order-nickname").html(y), h("#order-balance-amt").html("￥" + (b / 100).toFixed(2)), h("#balance-amt").html("￥" + (b / 100).toFixed(2)), h("#order-nickname").html(y), h("#pay").html("确认<br>支付"), h("#pay").on("tap", function () {
                    l()
                }), r(t.data.url.activity_tip, t.data.customer.hcid), b > 0 && h(".balance-box").addClass("active")) : "2003" == t.respcd ? (t.data.redirect_uri = e.location.href, e.location.replace("/trade/v1/customer/bind?" + h.param(t.data))) : o(t.respmsg)
            },
            complete: function () {
                w.amt && (h(".keyboard").addClass("hide"), h("#keyboard-text").html(w.amt), l())
            },
            error: function () {}
        })
    }
}(window);
! function () {
    function e() {
        WeixinJSBridge.invoke("setFontSizeCallback", {
            fontSize: 0
        }), WeixinJSBridge.on("menu:setfont", function () {
            WeixinJSBridge.invoke("setFontSizeCallback", {
                fontSize: 0
            })
        })
    }
    var t = navigator.userAgent.indexOf("Android") > -1;
    if (t) "object" == typeof WeixinJSBridge && "function" == typeof WeixinJSBridge.invoke ? e() : document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", e), document.attachEvent("onWeixinJSBridgeReady", e));
    else {
        var n = document.createElement("style");
        n.type = "text/css", document.getElementsByTagName("head")[0].appendChild(n), n.appendChild(document.createTextNode("body {-webkit-text-size-adjust:100% !important}"))
    }
}();