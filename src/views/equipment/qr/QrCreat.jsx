import React from 'react'
import { Row, Col, Card, Form, Input, Button, message } from 'antd'
import axios from 'axios'

import './qr.less'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
}

class QrCreat extends React.Component {
    state = {
        text: '',
        font: 30,
        color: '#000',
        textY: 'lp',    //文字竖向位置
        template: []
    }
    componentDidMount() {
        const c = this.c;
        this.ctx = c.getContext("2d");
        // window.onmousewheel = document.onmousewheel = this.scrollFnc;
        this.createQrImage(() => {
            this.addTemplate(this.state.template[0])
            this.imgCLick()
        })
    }
    componentDidUpdate() {
        // this.createQrImage(() => {
        //     this.addTemplate(this.state.template[0])
        // })
    }

    imgCLick = () => {
        var list = document.getElementById('list');
        var cards = list.querySelectorAll('.ant-card-grid')
        cards.forEach(item => {
            item.onclick = (e) => {
                let src = e.target.src;
                var alt = e.target.alt;
                let textY = 0;
                switch (alt) {
                    case 'lp':   //立牌
                        textY = 140;
                        break;
                    case 'gp':  //挂牌
                        textY = 230;
                        break;
                    case 'zt':  //桌贴
                        textY = 140;
                        break;
                    case 'zdj':  //账单夹
                        textY = 148;
                        break;
                    default:
                }
                this.setState({
                    textY
                })
                this.addTemplate(src, alt)
            }
        })
    }
    /**
     * 获取图片模板及二维码
     */
    createQrImage = (cb) => {
        const { id, codeType } = this.props.row
        axios.post('/back/qr/createQrImage', {
            id,
            codeType,
        }).then(res => res.data).then(res => {
            if (res.rel) {
                this.setState({
                    template: res.templatePath,
                    qr: res.qr,
                })
                cb && cb()
            } else {
                message.error(res.msg)
            }
        })
    }


    scrollFnc = (e) => {
        var scale = 1;
        var delta = e.wheelDelta;
        if (delta > 0 && scale <= 5) { //滚轮向上
            scale = 1.1;
        } else if (delta < 0 && scale >= 1) {
            scale = 0.9;
        }
        this.ctx.scale(scale, scale)

        var qcImg = new Image()
        qcImg.src = this.state.qr;
        const ctx = this.ctx;
        qcImg.onload = function () {
            ctx.drawImage(qcImg, 138, 223, 124, 124)
        }
    }

    onChange = (e) => {
        let text = e.target.value;
        this.setState({
            text
        })
        this.fillText(text, 30, '#000', this.state.textY)
    }
    fontChange = (e) => {
        let font = e.target.value;
        this.setState({
            font
        })
        let { text, color } = this.state
        this.fillText(text, font, color, this.state.textY)
    }
    colorChange = (e) => {
        let color = e.target.value;
        this.setState({
            color
        })
        const { text, font } = this.state
        this.fillText(text, font, color, this.state.textY)
    }


    down = (e) => {
        function base64Img2Blob(code) {
            var parts = code.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }
        function downloadFile(fileName, content) {

            var aLink = document.createElement('a');
            var blob = base64Img2Blob(content); //new Blob([content]);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
        }

        var canvas = this.c.toDataURL("image/png")
        downloadFile(this.state.textY, canvas);
    }
    /**
     * 模板绘制
     */
    addTemplate = (src, alt) => {
        const ctx = this.ctx;
        let img = new Image();
        img.src = src;
        img.onload = () => {
            ctx.clearRect(0, 0, 2000, 3000)
            const w = img.width;   //图片宽度
            const h = img.height;  //图片高度
            const cW = this.c.width; //canvas宽度
            ctx.drawImage(img, 0, 0, cW, cW * h / w);
            let x, y, length;
            switch (alt) {
                case 'lp':   //立牌
                    x = 138;
                    y = 223;
                    length = 124;
                    break;
                case 'gp':  //挂牌
                    x = 100;
                    y = 330;
                    length = 200;
                    break;
                case 'zt':  //桌贴
                    x = 70;
                    y = 20;
                    length = 255;
                    break;
                case 'zdj':  //账单夹
                    x = 108;
                    y = 230;
                    length = 185;
                    break;
                default:
            }
            this.addQc(x, y, length)
        }
    }
    /**
     * 画二维码
     *  位置( x, y )
     *  二维码大小( dw, length )正方形
     */
    addQc = (x, y, length = 124) => {
        let qcImag = new Image();
        qcImag.src = 'data:image/png;base64,' + this.state.qr;
        qcImag.onload = () => {
            this.ctx.drawImage(qcImag, x, y, length, length)
        }
    }
    /**
     * 写文字
     * @param {String} text         文字内容
     * @param {Number} fontSize     文字大小
     * @param {String} color        文字颜色
     */
    fillText = (text, fontSize = 30, color = '#000', y) => {
        const ctx = this.ctx;
        ctx.font = `bold ${fontSize}px Microsoft YaHei`;
        ctx.textAlign = "center";
        const h = 70     //内容高度 
        ctx.clearRect(0, y, 400, h);
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, y, 400, h);
        ctx.fillStyle = color;
        ctx.fillText(text, 200, y + h / 2);
    }
    render() {
        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        };
        return (
            <div className="qr-creat">
                <Row>
                    <Col span={14}>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="标题" {...formItemLayout}>
                                        <Input onChange={this.onChange} />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="副标题" {...formItemLayout}>
                                        <Input />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="字体大小" {...formItemLayout}>
                                        <Input type="number" defaultValue="30" max="40" min="1" onChange={this.fontChange} />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="颜色" {...formItemLayout}>
                                        <Input type="color" onChange={this.colorChange} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div style={{ margin: 30 }} id="list">
                            <Card noHovering>
                                {
                                    this.state.template.map((item, index) => {
                                        return <Card.Grid
                                            style={gridStyle}
                                            key={index}
                                        >
                                            <img
                                                src={item}
                                                alt={item.substr(item.lastIndexOf('/') + 1).split('.')[0]}
                                                style={{ width: '100%' }}
                                            />
                                        </Card.Grid>
                                    })
                                }
                                {/* <Card.Grid style={gridStyle}>
                                    <img
                                        src={require('./images/wx/lp.jpg')}
                                        alt="lp"
                                        style={{ width: '100%' }}
                                    />
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <img src={require('./images/wx/gp.jpg')}
                                        alt="gp"
                                        style={{ width: '100%' }}
                                    />
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <img src={require('./images/wx/zt.jpg')}
                                        alt="zt"
                                        style={{ width: '100%' }}
                                    />
                                </Card.Grid>
                                <Card.Grid style={gridStyle}>
                                    <img src={require('./images/wx/zdj.jpg')}
                                        alt="zdj"
                                        style={{ width: '100%' }}
                                    />
                                </Card.Grid> */}
                            </Card>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Button type="primary" onClick={this.down}>下载</Button>
                        </div>
                    </Col>
                    <Col span={10}>
                        <Card noHovering bordered={false}>
                            <canvas
                                width="720"
                                height="1134"
                                ref={canvas => this.c = canvas}
                                style={{ border: '1px solid #ccc', width: 400 }}
                            />
                        </Card>
                    </Col>
                </Row>


            </div>
        )
    }
}

export default QrCreat


