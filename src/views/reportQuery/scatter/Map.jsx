import React from 'react'
import axios from 'axios'

var qq = window.qq, map, geocoder;

function setmarker(markerA) {
    //获取地图以及地图中心位置，创建地图对象
    var center = new qq.maps.LatLng(39.916527, 116.397128);
    map = new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 13
    });
    //下方比例尺
    var scaleControl = new qq.maps.ScaleControl({
        align: qq.maps.ALIGN.BOTTOM_LEFT,
        margin: qq.maps.Size(85, 15),
        map: map
    });

    //增加缩放级别
    function CustomZoomControl(controlDiv, map) {
        controlDiv.style.padding = "5px";
        controlDiv.style.backgroundColor = "#FFFFFF";
        controlDiv.style.border = "2px solid #86ACF2";
        controlDiv.index = 1;//设置在当前布局中的位置

        function update() {
            var currentZoom = map.getZoom();
            controlDiv.innerHTML = "地图缩放级别：" + currentZoom;
            qq.maps.event.trigger(controlDiv, "resize");
        }

        update();
        //添加dom监听事件  一旦zoom的缩放级别放生变化则出发update函数
        qq.maps.event.addDomListener(map, "zoom_changed",
            update);
    }
    //创建div元素
    var customZoomDiv = document.createElement("div");
    //获取控件接口设置控件
    var customZoomControl = new CustomZoomControl(
        customZoomDiv, map);
    //将控件添加到controls栈变量并将其设置在顶部位置
    map.controls[qq.maps.ControlPosition.TOP_CENTER]
        .push(customZoomDiv);

    //在地图中创建地图提示框窗口
    var info = new qq.maps.InfoWindow({
        map: map
    });
    /******************************************/
    // var marker = new qq.maps.Marker({
    //     position: new qq.maps.LatLng(39.914850, 116.403765),
    //     map: map,
    //     title: '标注'
    // });
    // return
    /***********************************************/
    //声明数组获取精度数组
    var errors = [];
    var latlngs = [];
    var titles = [];
    var strinfo = "";

    for (var j = 0; j < markerA.length; j++) {
        var markerArr = markerA[j];
        var num = markerA[j].length;
        strinfo += "-------" + markerArr[0].prCiaRStr + "商户数量为" + num + "-------\r\n"
        for (var i = 0; i < markerArr.length; i++) {
            if (markerArr[i].status == '0') {
                var p0 = Number(markerArr[i].lng);
                var p1 = Number(markerArr[i].lat);
                //地图上显示标题
                var mtitle = "商户名称:" + markerArr[i].merchantName + "<br/>地址:" + markerArr[i].addressdetail;
                //文本框中显示的标题
                var mtitlestr = "*商户名称:" + markerArr[i].merchantName + "\r\n地址:" + markerArr[i].addressdetail
                    + "\r\n纬度、经度:" + "(" + p0 + "," + p1 + ")\n";
                strinfo += mtitlestr;
                latlngs.push(new qq.maps.LatLng(p0, p1));
                titles.push(mtitle);
            } else {
                //异常显示信息
                var mtitle = "**商户名称:" + markerArr[i].merchantName + "\r\n地址:" + markerArr[i].addressdetail + "\r\message:" +
                    markerArr[i].message + "(地图上并未显示坐标)\n"
                errors.push(mtitle);
            }
        }
    }
    //标注覆盖物
    for (var i = 0; i < latlngs.length; i++) {
        (function (n) {
            var marker = new qq.maps.Marker({
                position: latlngs[n],
                // position: qq.maps.LatLng(39.914850, 116.403765),
                map: map,
                title: titles[n]
            });
            qq.maps.event.addListener(marker, 'mouseover', function () {
                info.open();
                info.setContent('<div style="text-align:left;white-space:nowrap;' +
                    'margin:10px;">' + marker.title + '</div>');
                info.setPosition(latlngs[n]);
            });
            qq.maps.event.addListener(marker, 'mouseout', function () {
                info.close();
            });
        })(i);
    }
    for (var j = 0; j < errors.length; j++) {
        strinfo += errors[j];
    }
    document.getElementById("textarea").value = strinfo;



    geocoder = new qq.maps.Geocoder({
        complete: function (result) {
            map.setCenter(result.detail.location);
            // var marker = new qq.maps.Marker({
            //     map: map,
            //     position: result.detail.location
            // });
        }
    });
}
class Map extends React.Component {
    componentDidMount() {
        axios.get()
        const jsondata = {
            data: [{
                status: 0,
                prCiaRStr: "北京市北京海淀区",
                message: '成功',
                lng: '39.914850', //经度
                lat: '116.403765', //纬度
                merchantName: '',
                addressdetail: ''
            }]

        }
        var mark = [];
        for (var key in jsondata) {
            if (typeof (jsondata[key]) == "object") {
                mark.push(jsondata[key]);
            }
        }
        setmarker(mark)
    }
    search = (address) => {
        geocoder.getLocation(address);
    }
    render() {
        return (
            <div>
                <div id="container" style={{ height: '600px', width: '100%' }}></div>
            </div>
        )
    }
}

export default Map