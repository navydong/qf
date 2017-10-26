
import React, { Component } from 'react';
import Script from 'react-load-script'
window.initBaiduMap = function () {
    console.log('initBaiduMap')
    // 百度地图API功能
    var BMap = window.BMap
    var map = new BMap.Map('allmap');
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    var geoc = new BMap.Geocoder();

    map.addEventListener("click", function (e) {
        var pt = e.point;
        geoc.getLocation(pt, function (rs) {
            console.log(rs)
            var addComp = rs.addressComponents;
            alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        });
    });
}
class BaiduMap extends Component {
    componentDidMount() {
        console.log('componentDidMount')
    }
    handleScriptLoad() {
        console.log(this.refs.allmap, 'ref')
    }
    handleScriptError() {
        console.log('error')
    }
    render() {
        return (
            <div>
                <Script url="http://api.map.baidu.com/api?v=2.0&ak=zoTgOOSGGAhqQvb75qkyBKoFwpaV9NA4&callback=initBaiduMap" onLoad={this.handleScriptLoad.bind(this)} onError={this.handleScriptError.bind(this)} />
                <div id="allmap" style={{ width: '100%', height: '500px' }}></div>
            </div>
        )
    }
}
export default BaiduMap
