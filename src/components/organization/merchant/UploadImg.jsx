import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Upload, Button, Icon, message } from 'antd'
class UploadImg extends React.Component {
    state = {
        fileList: [],
        uploading: false,
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
        const { uploading } = this.props;
        const props = {
            action: '/back/accepagent/fileUpload',
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
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        }
        return (
            <div>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> Select File
                </Button>
                </Upload>
            </div>
        )
    }
}
UploadImg.propTypes = {

}
export default UploadImg