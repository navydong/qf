import React from 'react'
import { Row, Col, Card, Form, Input, Button, Spin, message } from 'antd'
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

let defaultFontSize = 50;

class QrCreat extends React.Component {
    state = {
        loading: true,
        text: '',
        font: 50,
        color: '#000',
        textY: 'lp',    //文字竖向位置
        template: [],
        id: '',
        canvasHeight: 1330,   //画布高
        canvasWidth: 720,     //画布宽
        textHeight: 110,      //文字区高度
    }
    componentDidMount() {
        const c = this.c;
        this.ctx = c.getContext("2d");
        // window.onmousewheel = document.onmousewheel = this.scrollFnc;

        const { id, codeType } = this.props.row
        this.createQrImage(id, codeType, () => {
            // this.addTemplate(this.state.template[0])
            this.imgCLick()
            this.setState({
                id: this.props.row.id
            })
        })
    }
    componentWillReceiveProps(nextProps) {
        const { id, codeType } = nextProps.row;
        if (nextProps.row.id === this.state.id) {
            return
        } else {
            this.setState({
                id: nextProps.id
            })
        }
        this.createQrImage(id, codeType, () => {
            console.log(nextProps.row)
            const ctx = this.ctx;
            ctx.clearRect(0, 0, 3000, 3000)
            // this.addTemplate(nextProps.row)

            this.imgCLick()
        })
    }
    /**
     * 获取图片模板及二维码
     */
    createQrImage = (id, codeType, cb) => {
        this.setState({
            loading: true,
        })
        axios.post('/back/qr/createQrImage', {
            id,
            codeType,
        }).then(res => res.data).then(res => {
            if (res.rel) {
                this.setState({
                    loading: false,
                    template: res.templatePath,
                    qr: res.qr,
                })
                cb && cb()
            } else {
                message.error(res.msg)
            }
        })
    }
    /**
     * 给图片添加点击事件
     */
    imgCLick = () => {
        var list = document.getElementById('list');
        var cards = list.querySelectorAll('.ant-card-grid')
        cards.forEach(item => {
            item.onclick = (e) => {
                let src = item.querySelector('img').src
                var img = new Image()
                img.src = src
                img.onload = () => {
                    let height = img.height
                    let width = img.width
                    this.setState({
                        canvasHeight: height,
                        canvasWidth: width,
                    }, () => {
                        // let src = e.target.src;
                        var alt = e.target.alt;
                        let textY = 0;         //文字中部距离图片顶部距离
                        let textHeight = 0;    //文字绘图区高度
                        let font = 50;         //字体大小
                        // 文字位置
                        switch (alt) {
                            case 'lp':   //立牌
                                textY = 763;
                                textHeight = 347;
                                font = 100;
                                break;
                            case 'gp':  //挂牌
                                textY = 456;
                                textHeight = 186;
                                font = 60;
                                break;
                            case 'zt':  //桌贴
                                textY = 24;
                                textHeight = 44;
                                font = 30;
                                break;
                            case 'zdj':  //账单夹
                                textY = 530;
                                textHeight = 230;
                                font = 80;
                                break;
                            case 'pgp':  //公共挂牌
                                textY = 405;
                                textHeight = 178;
                                break;
                            case 'pzt':  //公共桌贴
                                textY = 30;
                                textHeight = 60;
                                break;
                            default:
                        }
                        this.setState({
                            textY,
                            textHeight,
                            font,
                        })
                        this.addTemplate(src, alt)
                        this.input.refs.input.value = ''
                    })
                }
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
        this.fillText(text, this.state.font, '#000', this.state.textY)
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
        // console.log(src)
        const ctx = this.ctx;
        let img = new Image();
        img.src = src;
        img.onload = () => {
            ctx.clearRect(0, 0, 3000, 3000)
            const w = img.width;   //图片宽度
            const h = img.height;  //图片高度
            ctx.drawImage(img, 0, 0, w, h);
            let x, y, length;
            //二维码的位置
            switch (alt) {
                case 'lp':   //立牌
                    x = 656;
                    y = 1033;
                    length = 509;
                    break;
                case 'gp':  //挂牌
                    x = 186;
                    y = 607;
                    length = 340;
                    break;
                case 'zt':  //桌贴
                    x = 94;
                    y = 73;
                    length = 300;
                    break;
                case 'zdj':  //账单夹
                    x = 340;
                    y = 720;
                    length = 570;
                    break;
                case 'pgp':  //公共挂牌
                    x = 187;
                    y = 552;
                    length = 340;
                    break;
                case 'pzt':  //公共桌贴
                    x = 290;
                    y = 60;
                    length = 620;
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
        qcImag.src = this.state.qr;
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
    fillText = (text, fontSize = defaultFontSize, color = '#000', y) => {
        const ctx = this.ctx;
        ctx.font = `bold ${fontSize}px Microsoft YaHei`;
        ctx.textAlign = "center";
        const h = this.state.textHeight;     //内容高度 
        const { canvasWidth } = this.state;
        ctx.clearRect(0, y - h / 2, canvasWidth, h);
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, y - h / 2, canvasWidth, h);
        ctx.fillStyle = color;
        ctx.fillText(text, canvasWidth / 2, y + fontSize / 2);
    }
    render() {
        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        };
        return (
            <div className="qr-creat">
                <Row>
                    <Col span={16}>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="标题" {...formItemLayout}>
                                        <Input onChange={this.onChange} maxLength="255" ref={e => this.input = e} />
                                    </FormItem>
                                </Col>
                                {/* <Col span={12}>
                                    <FormItem label="副标题" {...formItemLayout}>
                                        <Input />
                                    </FormItem>
                                </Col> */}
                                <Col span={12}>
                                    <FormItem label="字体大小" {...formItemLayout}>
                                        <Input type="number" value={this.state.font} min="1" onChange={this.fontChange} />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="颜色" {...formItemLayout}>
                                        <Input type="color" onChange={this.colorChange} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        {/* 模板展示区 */}
                        <div style={{ margin: 30 }} id="list">
                            <Card noHovering loading={this.state.loading}>
                                {this.state.template.map((item, index) => (
                                    <Card.Grid
                                        style={gridStyle}
                                        key={index}
                                    >
                                        <img
                                            src={item}
                                            alt={item.substr(item.lastIndexOf('/') + 1).split('.')[0]}
                                            style={{ width: '100%' }}
                                        />
                                    </Card.Grid>
                                ))}
                            </Card>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Button type="primary" onClick={this.down}>下载</Button>
                        </div>
                    </Col>
                    <Col span={8}>
                        <Card
                            noHovering
                            bordered={false}
                        >
                            <canvas
                                width={this.state.canvasWidth}
                                height={this.state.canvasHeight}
                                ref={canvas => this.c = canvas}
                                style={{ width: 300 }}
                            // style={{ border: '1px solid #ccc' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default QrCreat