import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import axios from 'axios'


const bodyStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
}

export default class WxqrModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
        this.src = `/back/wxwallet/getminiorderqr?id=${this.props.record.id}`
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }

    componentWillReceiveProps(nextProps) {
        this.src = `/back/wxwallet/getminiorderqr?id=${nextProps.record.id}`
    }
    downLoad = async () => {
        const response = await axios.get(`/back/wxwallet/getminiorderqr?id=${this.props.record.id}`, {
            responseType: 'blob'
        })
        const blob = response.data
        const fileName = (this.props.record.qrName || 'qr') + '.png'


        if (window.navigator.msSaveOrOpenBlob) {  
            navigator.msSaveBlob(blob, fileName);  
        } else {  
            var link = document.createElement('a');
            var href =  window.URL.createObjectURL(blob);  
            link.href =href;
            link.download = fileName;  
            //此写法兼容可火狐浏览器  
            document.body.appendChild(link);  
            var evt = document.createEvent("MouseEvents");  
            evt.initEvent("click", false, false);  
            link.dispatchEvent(evt);  
            document.body.removeChild(link);  
            window.URL.revokeObjectURL(href);
        }  
    }
    render() {
        return (
            <div>
                <Modal
                    footer={null}
                    visible={this.state.visible}
                    wrapClassName="vertical-center-modal"
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                    bodyStyle={bodyStyle}
                >
                    <img src={this.src} alt="" height="300" width="300" />
                    <div style={{ height: 20 }} />
                    <Button type="primary" onClick={this.downLoad} >下载二维码</Button>
                </Modal>
            </div>
        )
    }
}