import React from 'react'
import { Upload, Button, Icon, message } from 'antd';

class UploadFile extends React.Component {
    state = {
        fileList: [],
    }
    componentDidMount() {
        console.log(this.props)
        if (this.props.fileList.length > 0) {
            this.setState({
                fileList: this.props.fileList
            })
        }
    }
    componentWillReceiveProps(newxProps) {
        if (newxProps.keys !== this.props.keys) {
            this.setState({
                fileList: newxProps.fileList
            })
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
        // limit the type of uploaded files 
        const isp12 = file.type === 'application/x-pkcs12'
        if (!isp12) return
        // limit the number of uploaded files
        fileList = fileList.slice(-1);
        this.setState({ fileList })

    }
    render() {
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                <Button>
                    <Icon type="upload" /> upload
                </Button>
            </Upload>
        );
    }
}

export default UploadFile