/**
 * 数字增加千分位分隔
 * 
 * @param {any} s 要格式化的数字
 * @param {any} n 保留几位小数
 * @returns 
 */
function fmoney(s, n = 2) {
    if (!s) return '0.00';
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
    var l = s.split('.')[0].split('').reverse(),
        r = s.split('.')[1];
    var t = '';
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
    }
    return t.split('').reverse().join('') + '.' + r;
}

export default fmoney