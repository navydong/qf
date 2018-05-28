(function ($) {
    $.fn.slideDown = function (duration) {
        this.css({
            display: 'block'
        })
    }
    $.fn.slideUp = function () {
        this.css({
            display: 'none'
        })
    }
})(Zepto);
(function (window) {
    $ = window.Zepto;
    $.fn.slideDown = function (duration) {
        this.css({
            display: 'block'
        })
        $.fn.slideUp = function () {
            this.css({
                display: 'none'
            })
        }
    }
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
            if (_this.text.length == 0 || _this.text.length == 1 && _this.text[0] == '0' || _this.text[_this.text.length -
                    1] == '.') {
                pay.removeClass("active")
            } else {
                pay.addClass("active");
            }
            inputText.html(_this.text.join(''))
        })
    };
    window.keyBoard = keyBoard

})(window)
var config = {
    integer: 7, //最大整数位
    decimal: 2 //小数位数
}
window.keyBoard(config)


var addremarks = ''
$('#remarkBtn').tap(function () {
    $('.remark').show()
    $('#remarkTxt').trigger('focus')
})
$('#remarkConfim').tap(function () {
    var remarkTxt = $('#remarkTxt').val();
    addremarks = remarkTxt
    if (!remarkTxt) {
        $('#remarkBtn').html('添加备注')
    } else {
        $('#remarkBtn').html(remarkTxt + ' <span>修改</span>')
    }
    $(".payinfo").slideDown();
    $('.remark').css({
        display: 'none'
    })
})
$('#remarkCancel').tap(function () {
    $('#remarkTxt').val('')
    $(".payinfo").slideDown();
    $('.remark').css({
        display: 'none'
    })
})
$(".input-box").tap(function () {
    $('#keyboard').show()
});

function loaded() {
    var openid = $("#openid").val();
    var merid = $("#merid").val();
    var codekey = $("#codekey").val();
    var payUrlIp = $("#payUrlIp").val();
    var payUrl = payUrlIp + '/back/wxwallet/tradecreate?';
    $("#pay").html("确认支付")
    $("#pay").on("tap", function () {
        var reg = /^([1-9]\d{0,9}|0)((\.\d{1,2})?)$/
        var txtValue = parseFloat($('#keyboard-text').html())
        var result = reg.test(txtValue);
        if (result) {
            $('#mark').show()
            window.location.href = payUrl + 'amount=' + txtValue + '&merchantId=' + merid + '&openId=' + openid +
                '&codeKey=' + codekey + '&addremarks=' + addremarks;
        }
    })
}
loaded()