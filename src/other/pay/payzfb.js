/*
 * @Author: yss.donghaijun 
 * @Date: 2018-05-31 11:46:05 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-31 16:45:08
 */
;
(function () {
    var title = $("#merchantNameIp").val();
    $('#title').html(title)
    var merchantId = $("#merchantIdIp").val();
    var userId = $("#userIdIp").val();
    var key = $("#keyIp").val();
    var payUrlIp = $("#payUrlIp").val();

    var payUrl = payUrlIp + '/back/aliWallet/smfTradeCreate';
    $("#pay").html("确认支付")
    $("#pay").on("tap", function () {
        var reg = /^([1-9]\d{0,9}|0)((\.\d{1,2})?)$/
        var txtValue = $('#keyboard-text').html()
        var result = reg.test(txtValue);
        if (result && txtValue > 0) {
            $('#mark').show();
            window.location.href = payUrl + "?" + 'codeKey=' + key + '&merchantId=' + merchantId + '&creTotalAmount=' + txtValue + '&userId=' + userId + '&addremarks=' + addremarks;
        }
    })
})()