// 获取url的参数
import axios from 'axios'
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

//处理数据
export const sloveRespData = (dataSource, key) => {
    console.log(key)
    if( !dataSource ) return;
    dataSource.forEach((item, index) => {
        item['key'] = item[key];
        item['order_id'] = index + 1;
    } )

    return dataSource;
}
