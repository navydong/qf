import React from 'react'
import { Upload, Button, Icon, message } from 'antd';

class UploadFile extends React.Component {
    state = {
        fileList: [],
    }
    componentDidMount() {
        if (this.props.value) {
            this.setState({
                fileList: [{
                    uid: -1,
                    name: '微信证书',
                    status: 'done',
                    url: this.props.value,
                }]
            })
        }
    }
    componentWillUnmount() {
        this.setState({
            fileList: []
        })
    }
    componentWillReceiveProps(newxProps) {
        // console.log(newxProps.keys)
        if (newxProps.keys !== this.props.keys) {
            if (newxProps.value) {
                this.setState({
                    fileList: [{
                        uid: -1,
                        name: '微信证书',
                        status: 'done',
                        url: newxProps.value,
                    }]
                })
            } else {
                this.setState({
                    fileList: []
                })
            }
        }
    }
    beforeUpload = (file) => {
        const isp12 = file.type === 'application/x-pkcs12'
        if (!isp12) {
            message.error('上传格式有误')
        }
        return isp12;
    }
    handleChange = ({ file, fileList }) => {
        console.log(file, fileList)
        let url;
        if (file.status === 'done') {
            if(file.response.rel){
                url = file.response.msg
            }else{
                message.error('上传失败')
            }
        }
        if(file.status === 'removed'){
            url = ''
        }
        this.props.onChange(url)
        fileList = fileList.slice(-1);
        this.setState({ fileList })

    }
    render() {
        const props = {
            accept: "application/x-pkcs12",
            action: '/back/accepagent/fileUpload',
            name:'book',
            fileList: this.state.fileList,
            // beforeUpload: this.beforeUpload,
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