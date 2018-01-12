import React from 'react'
import { Calendar } from 'antd'
import Img from '../style/imgs/logo.png'

let time = new Date().toLocaleString()
let timer = null;
class Homepage extends React.Component {
    state = {
        time,
        visible: true,
    }
    componentDidMount() {
        const self = this
        timer = setInterval(function () {
            time = new Date().toLocaleString()
            self.setState({
                time
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearTimeout(timer)
    }
    onClick = (e) => {
        this.setState((prevState) => {
            return {
                visible: !prevState.visible
            }
        })
    }
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    }
    render() {
        return (
            <div className="homepage">
                <img src={Img} alt="" />
                <h2 style={{ marginTop: 20 }}>移动支付管理平台</h2>
                <div style={{ marginTop: 30 }}>
                    <span 
                    onClick={this.onClick}
                    style={{
                        cursor: 'pointer'
                    }}
                    >{time}</span>
                </div>
                {
                    this.state.visible ? <Calendar fullscreen={false} onPanelChange={this.onPanelChange} /> : null
                }
            </div>
        )
    }
}
export default Homepage