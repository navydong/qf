/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-28 13:32:55 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-06-07 15:57:47
 */

import React from 'react'
import axios from 'axios'
import { Card, Col, Row, Upload, Icon, message, Breadcrumb, Badge, Button, Modal, Spin } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import CardInfo from './CardInfo'
import CardForm from './cardForm'

class VipCard extends React.Component {
    _isMounted = false
    state = {
        visible: false,
        loading: true,
        hasCreated: false              //会员卡创建与否
    }
    componentDidMount() {
        this._isMounted = true
        // this.getwxmembercard()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取已创建会员卡信息
    getwxmembercard = () => {
        axios.get('/back/membercard/getwxmembercard').then(({ data }) => {
            // rel为true, 会员卡已创建。 rel为false，会员卡未创建
            if (data.rel) {
                this._isMounted && this.setState({
                    cardInfo: data.result,
                    hasCreated: true
                })
            }
        })
    }
    // 创建会员卡领取二维码
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
    // 领取会员卡
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
                        {/* <Col span={8} >
                            <div className="card-id" >
                                <i>会员卡ID：</i>
                                <span>{cardInfo && cardInfo.cardId}</span>
                            </div>
                        </Col>
                        <Col span={8} >
                            <div className="status" >
                                <i>会员卡状态：</i>
                                <Badge count="已激活" />
                            </div>
                        </Col> */}
                        <Col span={24} style={{ textAlign: 'right' }} >
                            <Button type="primary" onClick={this.getCard} >领取会员</Button>
                        </Col>
                    </Row>
                </div>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <div className="vip-card" >
                        {/* 左侧卡面 */}
                        <CardInfo cardInfo={this.state.cardInfo} />
                        <div className="card-right">
                            {/* 右侧表单 */}
                            <CardForm cardInfo={this.state.cardInfo || {}} />
                        </div>
                    </div>
                </Card>

                {/* 二维码领取modal */}
                <Modal
                    visible={this.state.visible}
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


//根据url下载图片 

// 根据图片生成画布
function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}
// 下载图片
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