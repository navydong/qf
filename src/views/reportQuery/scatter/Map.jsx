import React from 'react'
import axios from 'axios'
import List from './List'

var qq = window.qq,
    map,
    geocoder;
/**
 * qq地图
 * http://lbs.qq.com/javascript_v2/doc/index.html#g0
 * @class Map
 * @extends {React.Component}
 */
class Map extends React.Component {
    _isMounted = false
    state = {
        list: []
    }
    componentDidMount() {
        this._isMounted = true
        const container = document.getElementById("container");       //地图容器，实例化一个地图对象需要在网页中创建一个空div元素                                        
        this.init(container)
        this.getMerchanList()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 初始化地图
     * http://lbs.qq.com/javascript_v2/doc/map.html
     * @param {DOM} container 
     * @memberof Map
     */
    init = (container) => {
        this.map = map = new qq.maps.Map(container, {
            //地图的中心地理坐标 
            center: new qq.maps.LatLng(39.916527, 116.397128),
            //初始化地图缩放级别。     
            zoom: 11,
            //比例尺控件的初始启用/停用状态。             
            scaleControl: false,
            //设置控件位置
            scaleControlOptions: {
                //http://lbs.qq.com/javascript_v2/doc/controlposition.html
                position: qq.maps.ControlPosition.BOTTOM_RIGHT
            },
            //缩放控件的初始启用/停用状态。
            zoomControl: true
        });
        //在地图中创建地图提示框窗口
        this.info = new qq.maps.InfoWindow({
            map: map
        });
        // //增加缩放级别
        /*  function CustomZoomControl(controlDiv, map) {
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
         new CustomZoomControl(customZoomDiv, map);
 
         //将控件添加到controls栈变量并将其设置在顶部位置
         map.controls[qq.maps.ControlPosition.TOP_CENTER]
             .push(customZoomDiv); */
    }
    /**
     * 设置信息并标注
     * 
     * @memberof Map
     */
    setInformation = (markerArr) => {
        const map = this.map
        if (!markerArr.length) {
            this.props.setTextValue();
            return
        }
        //声明数组获取精度数组
        var errors = [];      //报错信息
        var latlngs = [];     //坐标信息
        var titles = [];      //地图上显示标题
        var strinfo = "";     //文本框信息

        var num = markerArr.length;
        strinfo += "^" + markerArr[0].prCiaRStr + "商户数量为" + num + "\r\n"

        markerArr.forEach((item, index) => {
            if (item.status === 0) {
                var p0 = Number(item.lat);
                var p1 = Number(item.lng);
                //地图上显示标题
                let mtitle = `商户名称：${item.merchantName || ''} <br />
                                  地址：${item.addressdetail || item.prCiaRStr || ''}`;
                //文本框中显示的标题
                var mtitlestr = `\n*商户名称: ${item.merchantName || ''}
地址: ${ item.addressdetail || item.prCiaRStr || ''}
纬度、经度:( ${p0} ,${p1} )\r------------------------ \n`;
                strinfo += mtitlestr;
                latlngs.push(new qq.maps.LatLng(p0, p1));
                titles.push(mtitle);
            } else {
                //异常显示信息
                let mtitle = `**商户名称：${item.merchantName} \r
地址：${item.addressdetail || item.prCiaRStr || ''} \r
message：${item.message}(地图上并未显示坐标)\n`
                errors.push(mtitle);
            }
        })

        //标注覆盖物
        for (var i = 0; i < latlngs.length; i++) {
            this.marker(latlngs[i], titles[i])
        }
        errors.forEach(item => {
            strinfo += item
        })
        this.props.setTextValue(strinfo);

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
    /**
     * 标注覆盖物
     * @memberof Map
     * @param latlng  坐标
     * @param titles  标题
     */
    marker = (latlngs, titles) => {
        const info = this.info;
        //创建一个Marker
        var marker = new qq.maps.Marker({
            //设置Marker的位置坐标
            position: latlngs,
            //设置显示Marker的地图
            map: map,
        });
        qq.maps.event.addListener(marker, 'mouseover', function () {
            info.open();
            info.setContent(
                `<div style="text-align:left;white-space:nowrap;margin:5px;">${titles}</div>`
            );
            info.setPosition(latlngs);
        });
        qq.maps.event.addListener(marker, 'mouseout', function () {
            info.close();
        });
    }
    /**
     * 获取商户信息
     * 
     * @memberof Map
     */
    getMerchanList = () => {
        axios.get('/back/tradeBalcons/findMerchanList')
            .then(res => res.data)
            .then(res => {
                this._isMounted && this.setInformation(res)
                //切换地图中心点位置，取数据的第一条为中心店
                // const {lat,lng} = res[res.length-1];
                // this.map.panTo( new qq.maps.LatLng(lat, lng) )
                // geocoder.getLocation(location)

                this._isMounted && this.setState(prevState => ({
                    list: prevState.list.concat(res)
                }))
            })
    }
    /**
     * 搜索按钮
     * 
     * @memberof Map
     */
    search = (address) => {
        axios.get('/back/tradeBalcons/findMerchanList', {
            params: {
                cmbProvince: address.area[0],
                cmbCity: address.area[1],
                cmbArea: address.area[2],
            },
        }).then(res => {
            this.setInformation(res.data)
        })
        let location = address.area.join(',')
        geocoder.getLocation(location);
    }
    render() {
        return (
            <div>
                <div id="container" style={{ height: '600px', width: '100%' }}></div>
                {/*  <h4>{this.state.list.length&& `${this.state.list[0].prCiaRStr}的商户数量为${this.state.list.length}`}</h4>
                {this.state.list.map((item, index) => (
                    <List
                        key={index}
                        merchantName={item.merchantName}
                        addressdetail={item.addressdetail}
                        p0={item.lat}
                        p1={item.lng}
                    />
                ))} */}
            </div>
        )
    }
}

export default Map
