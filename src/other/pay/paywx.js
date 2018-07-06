/*
 * @Author: yss.donghaijun 
 * @Date: 2018-05-31 11:33:47 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-31 16:42:06
 */

;
(function (window) {
    var $ = window.Zepto;
    var openid = $("#openid").val();
    var merid = $("#merid").val();
    var codekey = $("#codekey").val();
    var payUrlIp = $("#payUrlIp").val();
    var payUrl = payUrlIp + '/back/wxwallet/tradecreate?';
    $("#pay").on("tap", function () {
        var reg = /^([1-9]\d{0,9}|0)((\.\d{1,2})?)$/;
        var txtValue = $('#keyboard-text').html()
        var result = reg.test(txtValue);
        if (result && txtValue > 0 ) {
            $('#mark').show();
            window.location.href = payUrl + 'amount=' + txtValue + '&merchantId=' + merid + '&openId=' + openid +
                '&codeKey=' + codekey + '&addremarks=' + addremarks;
        }
    })
})(window)