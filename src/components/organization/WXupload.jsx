import React, { Component } from 'react'
import { Upload, Button, Icon, message } from 'antd'
export default class WxUpload extends Component {
    state = {
        fileList: [],
    }
    beforeUpload = (file) => {
        const isp12 = file.type === 'application/x-pkcs12'
        if (!isp12) {
            message.error('上传格式有误')
        }
        return isp12;
    }
    // onChange = (info) => {
    //     let fileList = info.fileList;
    //     fileList = fileList.filter((file) => {
    //         if (file.response) {
    //             return file.response.rel;
    //         }
    //         return true;
    //     });
    //     this.setState({ fileList });
    // }
    render() {
        const { name, action } = this.props
        console.log(this.props.fileList)
        return (
            <Upload
                action={action}
                name={name}
                fileList={this.props.fileList}
                beforeUpload={this.beforeUpload}
                onChange={this.onChange}
            >
                <Button>
                    <Icon type="upload" /> 上传
                </Button>
            </Upload>
        )
    }
}
