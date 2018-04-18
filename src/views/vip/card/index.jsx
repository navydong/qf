/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-28 13:32:55 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-04-17 17:01:47
 */

import React from 'react'
import axios from 'axios'
import { Card, Col, Row, Upload, Icon, message, Breadcrumb, Badge, Button, Modal, Spin } from 'antd'

import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import CardInfo from './CardInfo'


/**
 * 根据图片生成画布
 */
function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}
/**
 * 下载图片
 */
function down() {
    var sampleImage = document.getElementById("ringoImage");
    var canvas = convertImageToCanvas(sampleImage);
    var url = canvas.toDataURL("image/png");//PNG格式
    //以下代码为下载此图片功能
    var triggerDownload = document.createElement('a')
    triggerDownload.setAttribute('href', url)
    triggerDownload.setAttribute('download', '二维码.png')
    triggerDownload[0].click();
    //    triggerDownload.remove();
}

class VipCard extends React.Component {
    _isMounted = false
    state = {
        visible: false,
        loading: true
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    createwxmembercardqr = () => {
        axios.post('/back/membercard/createwxmembercardqr').then(({ data }) => {
            if (data.rel) {
                this.setState({
                    cardqr: data.url,
                    loading: false
                })
            } else {
                message.error(data.msg)
            }
        })
    }
    getCard = (e) => {
        this.createwxmembercardqr()
        this.setState({
            visible: true
        })
    }

    render() {
        return (
            <div>
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>会员</Breadcrumb.Item>
                    <Breadcrumb.Item><span style={{ color: '#f93030' }} >会员卡</span></Breadcrumb.Item>
                </Breadcrumb>
                <div className="card-status" >
                    <Row>
                        <Col span={8} >
                            <div className="card-id" >
                                <i>会员卡ID：</i>
                                <span>id。。。。。。。。</span>
                            </div>
                        </Col>
                        <Col span={8} >
                            <div className="status" >
                                <i>会员卡状态：</i>
                                <Badge count="已激活" style={{ backgroundColor: '#66c1c1' }} />
                            </div>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }} >
                            <Button type="primary" onClick={this.getCard} >领取会员</Button>
                        </Col>
                    </Row>
                </div>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <div className="vip-card" >
                        <CardInfo />
                    </div>
                </Card>
                <Modal visible={this.state.visible}
                    footer={null}
                    onCancel={() => { this.setState({ visible: false }) }}>

                    <Spin
                        size="large"
                        tip="加载中。。。"
                        spinning={this.state.loading}>
                        <div style={{ textAlign: 'center', height: 300 }} >
                            <img src={this.state.cardqr} width="300" height="300" id="ringoImage" />
                            {/* <button onClick={down} >down</button> */}
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default VipCard