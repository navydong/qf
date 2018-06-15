/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-13 11:36:20 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-29 09:52:04
 * 
 * 把对象转化为url参数
 */
export const urlEncode = function (param, key, encode) {  
    if(param==null) return '';  
    var paramStr = '';  
    var t = typeof (param);  
    if (t == 'string' || t == 'number' || t == 'boolean') {  
      paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);  
    } else {  
      for (var i in param) {  
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);  
        paramStr += urlEncode(param[i], k, encode);  
      }  
    }  
    return paramStr
  };