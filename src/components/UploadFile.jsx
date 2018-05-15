import React from 'react'
import { Upload, Button, Icon, message } from 'antd';

class UploadFile extends React.Component {
    state = {
        fileList: [],
    }
    componentDidMount() {
        if (this.props.url) {
            this.setState({
                fileList: [{
                    uid: -1,
                    name: '微信证书',
                    status: 'done',
                    url: this.props.url,
                }]
            })
        }
    }
    componentWillUnmount() {
        this.setState({
            fileList: []
        })
    }
    beforeUpload = (file) => {
        const isp12 = file.type === 'application/x-pkcs12'
        if (!isp12) {
            message.error('上传格式有误')
        }
        return isp12;
    }
    handleChange = ({ file, fileList }) => {
        let url;
        if (file.status === 'done') {
            if (file.response.rel) {
                url = file.response.msg
            } else {
                message.error('上传失败')
            }
        } else if (file.status === 'removed') {
            url = ''
        } else if (file.status === 'error') {
            message.error(file.error.message)
        }
        this.props.onChange(url)
        fileList = fileList.slice(-1);
        this.setState({ fileList })

    }
    render() {
        const props = {
            accept: "application/x-pkcs12",
            action: '/back/accepagent/fileUpload',
            name: 'book',
            fileList: this.state.fileList,
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
        };
        return (
            <Upload {...props} >
                <Button>
                    <Icon type="upload" /> upload
                </Button>
            </Upload>
        );
    }
}

export default UploadFile