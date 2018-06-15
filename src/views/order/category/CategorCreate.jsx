import React from 'react'
import { Form, Input, Button, Upload, Icon } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
class CategoryCreate extends React.Component {
    static defaultProps = {
        record: {}
    }
    state = {
        fileList: []
    }
    componentDidMount() {
        if (this.props.record.categoryIcon) {
            this.setState({
                fileList: [{
                    uid: -1,
                    name: this.props.record.categoryIcon.match(/[a-zA-Z0-9]*\.jpg$/)[0],  //正则截取图片名字
                    status: 'done',
                    url: this.props.record.categoryIcon
                }]
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { record, isUpdate } = this.props
        const book = getFieldDecorator('book')
        const uploadProps = {
            accept: "image/*",
            listType: "picture",
            onRemove: (file) => {
                this.props.form.resetFields(['book'])
                this.setState({
                    fileList: []
                });
            },
            beforeUpload: (file) => {
                this.props.form.setFieldsValue({ book: file })
                // 读取缩略图
                getBase64(file, imgUrl => {
                    file.thumbUrl = imgUrl
                    this.setState({
                        fileList: [file]
                    });
                })
                return false;
            },

            fileList: this.state.fileList,
        };
        return (
            <div>
                <Form>
                    <FormItem label="品类名称" {...formItemLayout} >
                        {getFieldDecorator('categoryName', {
                            initialValue: record.categoryName,
                            rules: [{
                                required: true, message: '请输入'
                            }]
                        })(
                            <Input placeholder="品类名称" />
                        )}
                    </FormItem>
                    <FormItem label="图片" {...formItemLayout} >
                        {/* categoryIcon */}
                        {getFieldDecorator('categoryIcon', {
                        })(
                            <Upload {...uploadProps}>
                                <Button>
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>

                        )}
                    </FormItem>
                    <FormItem label="品类说明" {...formItemLayout}>
                        {getFieldDecorator('categoryDesc', {
                            initialValue: record.description
                        })(
                            <TextArea rows={3} />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}


export default Form.create()(CategoryCreate);