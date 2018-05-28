/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-28 13:32:19 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-22 17:29:29
 */

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Icon, Button, Card, Divider, Affix } from 'antd'

import CardForm from './cardForm'
import CardDetails from './cardDetails'

import './cardInfo.less'
import img from '@/style/imgs/321.jpg'
import code from '@/style/imgs/qr.png'

const cardColor = [
    { name: 'Color010', color: '#63b359' },
    { name: 'Color020', color: '#2c9f67' },
    { name: 'Color030', color: '#509fc9' },
    { name: 'Color040', color: '#5885cf' },
    { name: 'Color050', color: '#9062c0' },
    { name: 'Color060', color: '#d09a45' },
    { name: 'Color070', color: '#e4b138' },
    { name: 'Color080', color: '#ee903c' },
    { name: 'Color081', color: '#f08500' },
    { name: 'Color082', color: '#a9d92d' },
    { name: 'Color090', color: '#dd6549' },
    { name: 'Color100', color: '#cc463d' },
    { name: 'Color101', color: '#cf3e36' },
    { name: 'Color102', color: '#5E6671' }
]

const colorFilter = (name) => {
    let targetColor = cardColor.find(item => item.name === name)
    return targetColor.color
}



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


class CardInfo extends React.Component {
    _isMounted = false
    state = {
        loading: false,
    }
    componentDidMount() {
        this._isMounted = true
        // 解决切换页面后不执行 componentWillReceiveProps
        this.setImgToState(this.props)
    }
    componentWillReceiveProps(nextProps) {
        this.setImgToState(nextProps)
    }
    componentWillUnmount() {
        this._isMounted = false
    }

    setImgToState = (props) => {
        const { backgroundPic, logoUrl } = props
        const isFile_bg = backgroundPic instanceof File
        const isFile_logo = logoUrl instanceof File
        if (!isFile_bg) {
            this.setState({
                backgroundPic: backgroundPic
            })
        } else {
            if (backgroundPic) {
                getBase64(backgroundPic, result => {
                    this.setState({
                        backgroundPic: result
                    })
                })
            } else {
                this.setState({
                    backgroundPic
                })
            }
        }
        if (!isFile_logo) {
            this.setState({
                logoUrl: logoUrl
            })
        } else {
            if (logoUrl) {
                getBase64(logoUrl, result => {
                    this.setState({
                        logoUrl: result
                    })
                })
            } else {
                this.setState({
                    logoUrl
                })
            }
        }
    }

    render() {
        const { brandName, title, color, codeType, memberSupply } = this.props
        const { backgroundPic, logoUrl } = this.state
        let cardStyle = {
            background: backgroundPic ? `url(${backgroundPic}) 0 0/cover no-repeat` : colorFilter(color)
        }
        return (
            <div className="cardInfo" >
                <div className="card-left">
                    {/* <Affix offsetTop={20} > */}
                    <div className="card_1" >
                        <div className="phonehead"></div>
                        <div className="card" style={cardStyle}>
                            <div className="card_header clearfix">
                                <div className="card_logo">
                                    <img src={logoUrl || img} alt="" width="42" height="42" />
                                </div>
                                <div className="card_Info">
                                    {/* 输入为空时，显示'或'判断后面文字 */}
                                    <div className="card_brand">{brandName || '品牌名称'}</div>
                                    <span className="card_title">{title || '卡卷名'}</span>
                                </div>
                                <div className="card_code">
                                    <img src={code} />
                                </div>
                            </div>
                            <div className="card_bottom clearfix">
                                <div className="card_number">
                                    4403&nbsp;
                                    2846&nbsp;
                                    2423
                                </div>
                                <div className="card_icon">
                                    <Icon type="info" style={{ fontSize: 16, fontWeight: 400 }} />
                                </div>
                            </div>
                        </div>
                        <div className="extend clearfix">
                            {
                                memberSupply.map(item => {
                                    return <li className="demo" key={item}>
                                        <a href="javascript:;">
                                            <span>{item == '1' ? '积分' : item == '2' ? '等级' : '优惠券'}</span>
                                            <p className="extend_title">{item == '1' ? '100' : item == '2' ? '查看' : '查看'}</p>
                                        </a>
                                    </li>
                                })
                            }
                        </div>
                        <div className="pay_button">
                            <Button style={{ borderRadius: 35 }}>付款</Button>
                            {/* <div className="pay_title">买单立享9.00折，更有积分相送</div> */}
                        </div>
                        <div className="custom_detail">
                            <ul className="list">
                                <li>
                                    <div className="li_panel">
                                        <div className="li_content">
                                            <span className="supply_area"> > </span>
                                            <span>门店信息</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="li_panel">
                                        <div className="li_content">
                                            <span className="supply_area"> > </span>
                                            <span>公众号</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="li_panel">
                                        <div className="li_content">
                                            <span className="supply_area">
                                                <span>提示信息tips</span>
                                                >
                                            </span>
                                            <span>自定义会员信息类目</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="li_panel">
                                        <div className="li_content">
                                            <span className="supply_area">
                                                <span>提示信息tips</span>
                                                >
                                            </span>
                                            <span>自定义会员信息类目</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* </Affix> */}
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const {
        logoPicUrl = [],
        backgroundPic = [],
        brandName,
        title,
        color,
        codeType,
        memberSupply = [1, 2, 3],
    } = state.cardInfo
    return {
        //当移除图片上时，logo_pic_url 给出 [], 所以从length属性判断移除
        logoUrl: logoPicUrl.length ? logoPicUrl[0].originFileObj || logoPicUrl[0].url : null,
        backgroundPic: backgroundPic.length ? backgroundPic[0].originFileObj || backgroundPic[0].url : null,
        brandName,
        title,
        color,
        codeType,
        memberSupply,
    }
}
export default connect(mapStateToProps)(CardInfo)