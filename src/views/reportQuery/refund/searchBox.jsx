import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker, Cascader } from 'antd'
import axios from 'axios'
import { urlEncode } from '@/utils/urlEncode'
import formCascaderData from '@/utils/cascaderdata'

const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
class SearchBox extends React.Component {
    _isMounted = false;
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        merchant: [],
        dicList: []
    }
    componentDidMount() {
        this._isMounted = true
        this.selectMerchant()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取商户列表
    selectMerchant() {
        axios.get(`/back/merchantinfoController/page`, {
            params: {
                limit: 10000,
                offset: 1
            }
        }).then((resp) => {
            const merchant = formCascaderData(resp.data.rows, 'merchantName');
            this._isMounted && this.setState({
                merchant
            })
        })
    }
    // 重置表单
    reset = () => {
        this.props.form.resetFields()
        this.setState({
            startValue: null,
            endValue: null
        })

    }
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
            if (values.merchantId) {
                values.merchantId = values.merchantId[values.merchantId.length - 1]
            }
            this.props.search({ ...values, startDate, endDate })
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
    // 下载excel文件
    exportExcel = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) return
            const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
            const params = urlEncode({ ...values, startDate, endDate })
            window.location.href = `/back/tradeBlotter/export?${params}`;
            // axios.get('/back/tradeBlotter/export', {
            //     responseType: 'blob',
            //     params: { ...values, startDate, endDate }
            // }).then(res => {
            //     this.funDownload(res.data, '订单明细.xlsx')
            // })
        })
    }
    funDownload(content, filename) {
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.href = URL.createObjectURL(content);
        eleLink.click();
    };
    selectFilter = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen, merchant } = this.state;
        return (
            <Form>
                <Row gutter={8}>
                    <Col span={8}>
                        <FormItem label="订单号" {...formItemLayout}>
                            {getFieldDecorator("orders")(
                                <Input placeholder="请输入订单号" maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="商户名称" {...formItemLayout}>
                            {getFieldDecorator("merchantId")(
                                <Cascader
                                    allowClear
                                    placeholder={"==请选择=="}
                                    showSearch
                                    changeOnSelect
                                    displayRender={this.displayRender}
                                    options={merchant}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="钱包方订单号" {...formItemLayout}>
                            {getFieldDecorator("tradeNo")(
                                <Input placeholder="请输入钱包方订单号" maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="通道名称" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==" allowClear>
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="开始时间" {...formItemLayout}>
                            {getFieldDecorator("startDate", {
                                rules: [
                                    { required: false, message: '请选择开始时间' },
                                ]
                            })(
                                <DatePicker disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="结束时间" {...formItemLayout}>
                            {getFieldDecorator("endDate", {
                                rules: [
                                    { required: false, message: '请选择结束时间' },
                                ]
                            })(
                                <DatePicker disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD"
                                    placeholder="结束时间"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{ float: 'right' }}>
                    <Col span={24}>
                        <Button
                            className="btn-search"
                            type="primary"
                            loading={this.props.loading}
                            onClick={this.search}
                        >查询</Button>
                        {/* <Button
                            className="btn-search"
                            type="primary"
                            onClick={this.exportExcel}
                        >导出</Button> */}
                        <Button
                            className="btn-reset"
                            onClick={this.reset}
                        >重置</Button>
                    </Col>
                </Row>
            </Form >
        )
    }
}
export default Form.create()(SearchBox)