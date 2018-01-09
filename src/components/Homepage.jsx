import React from 'react'
import Img from '../style/imgs/logo.png'

let time = new Date().toLocaleString()
let timer = null;
class Homepage extends React.Component {
    state = {
        time
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
    render() {
        return (
            <div className="homepage">
                <img src={Img} alt="" />
                <h2 style={{ marginTop: 20 }}>移动支付管理平台</h2>
                <div style={{ marginTop: 30 }}>
                    <span>{time}</span>
                </div>
            </div>
        )
    }
}
export default Homepage