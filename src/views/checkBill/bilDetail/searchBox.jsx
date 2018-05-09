import React from 'react'
import { Form, Row, Col, Select, DatePicker, Switch, Button, message, Upload } from 'antd'
import axios from 'axios'

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


class AllBillHeader extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)
        this.state = {
            endOpen: false,
            facno: [],
            uploadDisable: false
        }
    }
    componentDidMount() {
        this._isMounted = true
        this.getFacno()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 搜索
    search = (e) => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            if (values.date) {
                values.date = values.date.format('YYYY-MM')
            }
            this.props.search(values)
        });
    }
    // 计算
    caculate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            if (values.date) {
                values.date = values.date.format('YYYY-MM')
            }
            axios.get('/detailController/calReconciliatio', {
                params: values
            }).then(data => {
                if (data.rel) {
                    message.success('计算完成')
                    this.props.search(values)
                } else {
                    message.error('计算错误')
                }

            })
        });
    }
    // 重置
    reset = (e) => {
        this.props.form.resetFields()
    }
    // 下载
    download = (e) => {

    }
    // 获取二级服务商
    getFacno = () => {
        axios.get('/detailController/pullDownOrg').then(data => {
            if (Object.prototype.toString.call(data) !== '[object Object]') {
                return
            }
            this._isMounted && this.setState({
                facno: data
            })
        })
    }

    /********开始、结束日期关联***********/
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    /********开始、结束日期关联*********/

    render() {
        const { getFieldDecorator } = this.props.form;
        const { endOpen, uploadDisable, facno } = this.state
        const options = Object.keys(facno).map(item => {
            return <Option key={item} >{facno[item]}</Option>
        })
        const uploadProps = {
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
            name: 'book',
            action: '/back/detailController/upload/ExcelTemplate',
            showUploadList: false,
            onChange: (info) => {
                if (info.file.status === 'uploading') {
                    message.info('文件上传中。。。');
                    this.setState({
                        uploadDisable: true
                    })
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploadDisable: false
                    })
                    message.destroy()
                    message.success(info.file.response.msg);
                } else if (info.file.status === 'error') {
                    message.error(info.file.response.msg);
                }
            },
        };
        return (
            <Form>
                <Row>
                    <Col span={8} >
                        <FormItem {...formItemLayout} label="差额">
                            {getFieldDecorator(`isBalance`)(
                                <Select placeholder="==请选择==" allowClear>
                                    <Option key="Y">无差额</Option>
                                    <Option key="N">有差额</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} >
                        <FormItem {...formItemLayout} label="月份">
                            {getFieldDecorator('date', {
                                rules: [
                                    { required: true, message: '请选择月份' },
                                ]
                            })(
                                <MonthPicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} >
                        <FormItem {...formItemLayout} label="二级服务商">
                            {getFieldDecorator(`facno`)(
                                <Select placeholder="==请选择==" allowClear>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24} >
                        <div style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                onClick={this.search}
                                className="btn-search"
                            >查询</Button>
                            <Button
                                type="primary"
                                onClick={this.caculate}
                                className="btn-search"
                            >计算</Button>
                            {/* <Button
                                type="primary"
                                onClick={this.download}
                                className="btn-search"
                            >下载文件</Button> */}

                            <Upload {...uploadProps}>
                                <Button
                                    type="primary"
                                    onClick={this.upload}
                                    className="btn-search"
                                    style={{ margin: '0 14px' }}
                                    disabled={uploadDisable}
                                >上传文件</Button>
                            </Upload>
                            <Button
                                className="btn-reset"
                                onClick={this.reset}
                                htmlType="reset"
                            >重置</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(AllBillHeader)
