import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Upload, Button, Icon, message } from 'antd'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class UploadImg extends React.Component {
    state = {
        fileList: [],
        loading: false,
        imageUrl: ''
    }
    /**
    * 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。
    * 
    * @param {any} file 
    * @param {any} fileList 
    */
    beforeUpload = (file, fileList) => {
        console.log(file)
        //定义图片格式
        // const isJPG = file.type === 'image/jpeg';
        let isJPG;
        switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
                isJPG = true;
                return
            default:
                isJPG = false;
        }
        if (!isJPG) {
            message.error('仅支持图片格式jpg、jpeg、png');
        }
        //定义图片大小
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }
    render() {
        console.log(this.props)
        const imageUrl = this.state.imageUrl;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        const props = {
            name: 'book',
            action: '/back/accepagent/fileUpload',
            listType: "picture-card",
            className: "avatar-uploader",
            showUploadList: false,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            // beforeUpload: (file) => {
            //     this.setState(({ fileList }) => ({
            //         fileList: [...fileList, file],
            //     }));
            //     return false;
            // },
            beforeUpload: this.beforeUpload,
            onChange: (info) => {
                console.log(info)
                if (info.file.status === 'uploading') {
                    this.setState({ loading: true });
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    let res = info.file.response
                    if (res.rel) {
                        console.log(res.msg)
                        getBase64(info.file.originFileObj, imageUrl => this.setState({
                            imageUrl,
                            loading: false,
                        }));
                    } else {
                        message.error(res.msg)
                    }
                }
            },
            // fileList: this.state.fileList,
        }
        return (
            <div>
                <style>
                    {
                        `
                        .avatar-uploader > .ant-upload {
                            width: 88px;
                            height: 88px;
                        }
                        .ant-upload-select-picture-card i {
                            font-size: 28px;
                            color: #999;
                        }
                          `
                    }
                </style>
                <Upload {...props}>
                    {imageUrl ? <img src={imageUrl} alt="" width="80" style={{ height: '100%' }} /> : uploadButton}
                </Upload>
            </div>
        )
    }
}
UploadImg.propTypes = {

}
export default UploadImg