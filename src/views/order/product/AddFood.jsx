import React from 'react'
import { Form, Select, Button, Card, Breadcrumb, Input, InputNumber, Icon, message, Upload } from 'antd'
import axios from 'axios'
import CategorCreate from '../category/CategorCreate'
import UploadImg from '@/components/UploadImg'

const Option = Select.Option
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

class AddFood extends React.Component {
    _isMounted = false;
    static defaultProps = {
        record: {},
        categoryOkLoading: false,
    }
    state = {
        categoryStatus: 'show',
        fileList: [],
        uploading: false,
        categoryOption: {},
        okLoading: false,
        previewVisible: false,
    }
    componentDidMount() {
        this._isMounted = true
        this.getCategory()
        if (this.props.record.productIcon) {
            this.setState({
                fileList: [{
                    uid: -1,
                    name: this.props.record.productIcon.match(/[a-zA-Z0-9]*\.jpg$/)[0],  //正则截取图片名字
                    status: 'done',
                    url: this.props.record.productIcon
                }]
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取品类下拉框
    getCategory() {
        axios.get('/dcback/categoryController/pullDownCatg').then(({ data }) => {
            this._isMounted && this.setState({
                categoryOption: data
            })
        })
    }


    backButton = () => {
        this.props.router.go(-1)
    }
    // 新增品类
    addCategory = (e) => {
        this.setState({
            categoryStatus: 'add'
        })
    }
    // 取消新增品类
    categoryBack = () => {
        this.setState({
            categoryStatus: 'show'
        })
    }
    // 新增品类确认
    categoryOk = () => {
        this.props.form.validateFieldsAndScroll(['categoryName'], (err, value) => {
            if (err) return
            this.setState({
                categoryOkLoading: true
            })
            axios.post('/dcback/categoryController/add', value).then(({ data }) => {
                if (data.rel) {
                    this._isMounted && this.setState({
                        categoryStatus: 'show',
                        categoryOkLoading: false
                    })
                    this.getCategory()
                } else {
                    message.warn(data.msg)
                    this._isMounted && this.setState({
                        categoryOkLoading: false
                    })
                }
            })
        })
    }
    // 新增、修改确认
    onOk = () => {
        this.props.form.validateFieldsAndScroll(['categoryId', 'productName', 'productPrice', 'productStock', 'productDes', 'productIcon', 'productSpec'], (err, value) => {
            if (err) return
            const { fileList } = this.state;
            const formData = new FormData();
            if (fileList.length > 0) {
                const file = fileList[0]
                const isFile = Object.prototype.toString.call(file) == '[object File]'
                isFile && formData.append('book', file);
            }
            for (let k in value) {
                value[k] && formData.append(k, value[k]);
            }
            const config = {
                baseURL: '/dcback/productController',
                url: '/add',
                method: 'post',
                data: formData
            }
            // 修改
            if (this.props.isUpdate) {
                config.url = '/update'
                if (this.props.record.productIcon) {
                    formData.append('oldProductIcon', this.props.record.productIcon)
                }
                formData.append('id', this.props.record.id)
            }
            this.setState({
                okLoading: true
            })
            axios(config).then(({ data }) => {
                if (data.rel) {
                    message.success(data.msg)
                    this.setState({
                        okLoading: false
                    })
                    this.props.backList()
                    this.props.form.resetFields()
                } else {
                    message.success(data.msg)
                    this.setState({
                        okLoading: false
                    })
                }
            }).catch(err => {
                alert(err.message)
                this.setState({
                    okLoading: false
                })
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const record = this.props.record
        const { imageUrl, categoryOption } = this.state;
        const categoryExtra = this.state.categoryStatus === 'show'
            ? <a href="javascript:;" onClick={this.addCategory} >新增</a>
            : <a href="javascript:;" onClick={this.categoryBack} >返回</a>
        // 品类选择
        const category = <FormItem label="品类" {...formItemLayout}>
            {getFieldDecorator('categoryId', {
                initialValue: record.categoryId,
                rules: [{
                    required: true, message: '请输入'
                }]
            })(<Select>
                {Object.keys(categoryOption).map(key => (
                    <Option key={key} >{categoryOption[key]}</Option>
                ))}
            </Select>)}
        </FormItem>
        // 品类创建
        const categorCreate = <div>
            <FormItem label="品类名称" {...formItemLayout} >
                {getFieldDecorator('categoryName', {
                    rules: [{
                        required: true, message: '请输入'
                    }]
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem label="品类说明" {...formItemLayout}>
                {getFieldDecorator('description', {
                    initialValue: record.description
                })(
                    <TextArea rows={3} />
                )}
            </FormItem>
            <div style={{ textAlign: 'center' }} >
                <Button type="primary" onClick={this.categoryOk} loading={this.state.categoryOkLoading} >新增品类</Button>
                <Button onClick={this.categoryBack} >取消</Button>
            </div>
        </div>
        const uploadProps = {
            accept: "image/*",
            listType: "picture",
            onRemove: () => {
                this.setState({
                    fileList: []
                });
            },
            beforeUpload: (file) => {
                console.log()
                // 增加 thumbUrl 属性可以增加图片预览
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
            <div style={{ width: 500, margin: '10px auto ' }} >
                <Form>
                    <Card title="选择品类" extra={categoryExtra} noHovering >
                        {this.state.categoryStatus === 'show'
                            ? category
                            : categorCreate}
                    </Card>
                    <div style={{ height: 10 }}></div>
                    <Card title="新增菜单" noHovering >
                        <FormItem label="名称" {...formItemLayout} >
                            {getFieldDecorator('productName', {
                                initialValue: record.productName,
                                rules: [{
                                    required: true, message: '请输入'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="价格" {...formItemLayout} >
                            {getFieldDecorator('productPrice', {
                                initialValue: record.productPrice,
                                rules: [{
                                    required: true, message: '请输入'
                                }]
                            })(
                                <InputNumber min={0.01} />
                            )}
                        </FormItem>
                        <FormItem label="库存" {...formItemLayout} >
                            {getFieldDecorator('productStock', {
                                initialValue: record.productStock,
                            })(
                                <InputNumber min={0} max={999} />
                            )}
                        </FormItem>
                        <FormItem label="图片" {...formItemLayout} >
                            <Upload {...uploadProps}>
                                <Button>
                                    <Icon type="upload" /> 点击上传
                                    </Button>
                            </Upload>
                        </FormItem>
                        <FormItem label="属性" {...formItemLayout} >
                            {getFieldDecorator('productSpec', {
                                initialValue: record.productStock,
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="描述" {...formItemLayout} >
                            {getFieldDecorator('productDes', {
                                initialValue: record.productDes
                            })(
                                <TextArea rows={4} style={{ resize: 'none' }} />
                            )}
                        </FormItem>
                    </Card>
                    <div style={{ textAlign: 'center', marginTop: 10 }} >
                        <Button
                            onClick={this.onOk}
                            type="primary"
                            loading={this.state.okLoading}
                            className="btn-search"
                        >
                            确认
                    </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(AddFood)