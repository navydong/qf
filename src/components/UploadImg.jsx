import React from 'react'
import PropTypes, { func } from 'prop-types'
import axios from 'axios'
import { Upload, Icon, message, Modal } from 'antd'

class UploadImg extends React.Component {
    state = {
        previewVisible: false,        //预览模态框的显示与否
        previewImage: '',             //预览的图片
        fileList: [],                 //上传的文件列表
    };


    componentDidMount() {
        if (this.props.url) {
            this.setState({
                fileList: [{
                    uid: -1,
                    status: 'done',
                    url: this.props.url,
                }]
            })
        }

    }
    componentWillReceiveProps(newxProps) {
        if (newxProps.keys !== this.props.keys) {
            if (newxProps.url) {
                this.setState({
                    fileList: [{
                        uid: -1,
                        status: 'done',
                        url: newxProps.url,
                    }]
                })
            } else {
                this.setState({
                    fileList: []
                })
            }
        }
    }
    handleCancel = () => this.setState({ previewVisible: false })
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
        } else if(file.status === 'error'){
            message.error(file.error.message)
        }
        // console.log('url', url)
        this.props.onChange(url)
        this.setState({ fileList })
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    /**
    * 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。
    * 控制文件的格式和大小
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
                break;
            default:
                isJPG = false;
        }
        if (!isJPG) {
            message.error('上传格式不支持，支持图片格式jpg、png、jpeg', 8);
        }
        //定义图片大小
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
            message.error('图片文件必须小于50M', 8);
        }
        return isJPG && isLt2M;
    }
    render() {
        const { previewVisible, previewImage } = this.state;
        const fileList = this.state.fileList
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        return (
            <div>
                <div className="clearfix">
                    <Upload
                        name='book'
                        action="/back/accepagent/fileUpload"
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={this.beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= this.props.max ? null : uploadButton}
                    </Upload>
                    {/* 图片预览模态框 */}
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="图片加载失败" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div>

                <style>
                    {
                        `
                        .ant-upload-select-picture-card i {
                            font-size: 28px;
                            color: #999;
                          }
                          
                        .ant-upload-select-picture-card .ant-upload-text {
                            margin-top: 8px;
                            font-size: 12px;
                            color: #666;
                        }
                          `
                    }
                </style>
            </div >
        )
    }
}
UploadImg.propTypes = {
    max: PropTypes.number.isRequired  //最大上传文件数
}
UploadImg.defaultProps = {
    max: 1                            //默认是1
}
export default UploadImg