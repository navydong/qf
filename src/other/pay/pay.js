/*
 * @Author: yss.donghaijun 
 * @Date: 2018-05-31 11:33:26 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-31 16:40:16
 */

;
(function (window) {
    $ = window.Zepto;
    var keyBoard = function (t) {
        t = t || {};
        var _this = this;
        _this.integer = t.integer || 5
        _this.decimal = t.decimal || 2
        _this.text = [];
        _this.integer_flag = !0;
        var key = $('.key')
        var inputText = $('#keyboard-text')
        var pay = $('.pay')
        var message = $('.message')
        var timer = null;

        key.on("touchstart", function (e) {
            e.preventDefault()
            $(this).addClass("hover")
        });
        key.on("touchend touchcancel touchmove", function (e) {
            e.preventDefault()
            $(this).removeClass("hover")
        });
        key.on("tap", function (e) {
            var n = $(this).data("str");
            var hasdot = _this.text.indexOf(".") > -1
            switch (n) {
                case "del":
                    _this.text.pop();
                    window.clearTimeout(timer)
                    message.hide()
                    break;
                case "hide":
                    $('#keyboard').hide()
                    break;
                case "submit":
                    break;
                case ".":
                    if (_this.text.length == 0) {
                        _this.text.push("0")
                    }
                    if (!hasdot) {
                        _this.text.push(n);
                    }
                    message.hide()
                    break;
                default:
                    if (_this.text.length == 1) {
                        if (_this.text[0] == '0') {
                            _this.text.pop()
                        }
                    }
                    if (hasdot) {
                        if (_this.text.length - _this.text.indexOf('.') < _this.decimal + 1) {
                            _this.text.push(n)
                        }
                    } else {
                        if (_this.text.length < _this.integer) {
                            _this.text.push(n)
                        } else {
                            message.show()
                            window.clearTimeout(timer)
                            timer = setTimeout(function () {
                                message.hide()
                            }, 5000)
                        }
                    }
            }
            if (
                _this.text.length == 0 ||
                _this.text.length == 1 &&
                _this.text[0] == '0' ||
                _this.text[_this.text.length - 1] == '.'||
                _this.text.join('') < 0.01
            ) {
                pay.removeClass("active")
            } else {
                pay.addClass("active");
            }
            inputText.html(_this.text.join(''))
        })
    };
    $("#pay").html("确认支付")
    $(".input-box").tap(function () {
        $('#keyboard').show()
    });
    window.keyBoard = keyBoard

})(window)
var config = {
    integer: 7, //最大整数位
    decimal: 2, //小数位数
}
window.keyBoard(config);

// 备注
var addremarks = '';;
(function (window) {
    var $ = window.Zepto;
    $('#remarkBtn').tap(function () {
        $('.remark').show()
        $('#remarkTxt').trigger('focus')
    })
    $('#remarkConfim').tap(function () {
        addremarks = $('#remarkTxt').val();
        if (!addremarks) {
            $('#remarkBtn').html('添加备注')
        } else {
            $('#remarkBtn').html(addremarks + ' <span>修改</span>')
        }
        $(".payinfo").hide();
        $('.remark').css({
            display: 'none'
        })
        $('#remarkTxt').trigger('blur')
    })
    $('#remarkCancel').tap(function () {
        $('#remarkTxt').val(addremarks)
        $(".payinfo").hide();
        $('.remark').css({
            display: 'none'
        })
        $('#remarkTxt').trigger('blur')
    })
})(window)