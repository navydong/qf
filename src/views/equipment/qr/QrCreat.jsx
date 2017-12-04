import React from 'react'
import erweima from '../../../style/imgs/qr.png'
import moban from '../../../style/imgs/wx.jpg'
import zhifubao from './zhifubao.png'
import './qr.less'

class QrCreat extends React.Component {
    state = {
        text: '',
        font: 30,
    }
    componentDidMount() {
        const c = this.c;
        this.ctx = c.getContext("2d");
        // window.onmousewheel = document.onmousewheel = this.scrollFnc;

        const self = this;
        this.weixin.onclick = function (e) {
            var src = e.target.src
            self.load(src)
        }
        this.zhifubao.onclick = function (e) {
            var src = e.target.src
            self.load(src)
        }
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
        this.ctx.drawImage(this.er, 138, 223, 124, 124)
    }
    
    onload = (e) => {
        this.ctx.clearRect(0, 0, 2000, 3000)
        this.ctx.drawImage(e.target, 0, 0, 400, 553);
        this.ctx.drawImage(this.er, 138, 223, 124, 124)
    }

    onChange = (e) => {
        let text = e.target.value;
        this.setState({
            text: text
        })
        this.fillText(text)
    }
    fontChange = (e) => {
        let font = e.target.value;
        this.setState({
            font: font
        })
        let text = this.state.text
        this.fillText(text, font)
    }
    colorChange = (e) => {
        let color = e.target.value;
        const { text, font } = this.state
        this.fillText(text, font, color)
    }


    onClick = (e) => {
        var img = this.c.toDataURL("image/png");
        console.log(img)
        document.write('<img src="' + img + '"/>');
    }

    load = (src) => {
        let img = new Image();
        img.src = src;
        const ctx = this.ctx;
        const self = this;
        img.onload = function () {
            ctx.clearRect(0, 0, 2000, 3000)
            ctx.drawImage(img, 0, 0, 400, 553);
            ctx.drawImage(self.er, 138, 223, 124, 124)
        }
    }


    /**
     * 写文字
     * @param {String} text         文字内容
     * @param {Number} fontSize     文字大小
     * @param {String} color        文字颜色
     */
    fillText = (text, fontSize = 30, color = '#000') => {
        const ctx = this.ctx;
        ctx.font = `bold ${fontSize}px Microsoft YaHei`;
        ctx.textAlign = "center";
        ctx.clearRect(0, 140, 400, 70);
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 140, 400, 70);
        ctx.fillStyle = color;
        ctx.fillText(text, 200, 180);
    }
    render() {
        return (
            <div className="qr-creat">
                <canvas
                    width="400"
                    height="600"
                    style={{ border: '1px solid #000', backgroundColor: '#fff' }}
                    ref={canvas => this.c = canvas}
                />
                <div style={{ float: 'left' }}>
                    标题: <input type="text" onChange={this.onChange} /><br />
                    字体大小: <input type="number" onChange={this.fontChange} defaultValue="30" max="40" min="1" /><br />
                    颜色: <input type="color" onChange={this.colorChange} />
                    <div style={{ margin: 30 }}>
                        <img
                            src={moban}
                            alt="微信"
                            width="200"
                            ref={e => { this.weixin = e }}
                            onLoad={this.onload}
                        />
                        <img src={zhifubao}
                            alt="支付宝"
                            width="200"
                            ref={e => { this.zhifubao = e }}
                            onLoad={this.onload}
                        />
                        <img src={erweima} alt="" width="100" ref={e => { this.er = e }} />
                    </div>
                    <a className="download" onClick={this.onClick}>下载</a>
                </div>


            </div>
        )
    }
}

export default QrCreat


