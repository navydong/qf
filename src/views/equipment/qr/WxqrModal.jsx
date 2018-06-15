import React, { Component } from 'react'
import { Modal } from 'antd'
import axios from 'axios'

export default class WxqrModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    showModal = ()=>{
        this.setState({
            visible: true
        })
    }
    // 获取小程序二维码
     getWxqr = async ()=>{
        const data = await axios.get('/')
        this.setState({
            data
        })
    }
    render() {
        return (
            <div>
                <Modal
                    footer={null}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                >
                    
                </Modal>
            </div>
        )
    }
}