import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd'
import axios from 'axios'
const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class SearchBox extends React.Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        merchantinfoList: [],
        dicList: []
    }
    componentDidMount() {
        axios.get('/back/tradeBlotter/getMerchantinfoList').then(res => res.data).then(res => {
            this.setState((prevState => (
                { merchantinfoList: prevState.merchantinfoList.concat(res) }
            )))
        })

    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
    }
    search = () => {

        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen } = this.state;
        return (
            <Form>
                <Row gutter={40}>
                    <Col span={12}>
                        <FormItem label="订单号" {...formItemLayout}>
                            {getFieldDecorator("orders")(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="通道名称" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==" allowClear>
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="商户名称" {...formItemLayout}>
                            {getFieldDecorator("merchantId")(
                                <Select placeholder="==请选择==" allowClear>
                                    {this.state.merchantinfoList.map(item => (
                                        <Option key={item.id}>{item.merchantName}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="交易类型" {...formItemLayout}>
                            {getFieldDecorator("type")(
                                <Select placeholder="==请选择==" allowClear>
                                    <Option key="0">支付失败</Option>
                                    <Option key="1">支付成功</Option>
                                    <Option key="2">待支付</Option>
                                    <Option key="3">退款成功</Option>
                                    <Option key="4">退款失败</Option>
                                    <Option key="5">退款中</Option>
                                    <Option key="6">部分退款</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="钱包方订单号" {...formItemLayout}>
                            {getFieldDecorator("refundorders")(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="退款订单号" {...formItemLayout}>
                            {getFieldDecorator("tradeNo")(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="开始时间" {...formItemLayout}>
                            {getFieldDecorator("startDate", {
                                rules: [
                                    { required: false, message: '请选择开始时间' },
                                ]
                            })(
                                <DatePicker disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD"
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="结束时间" {...formItemLayout}>
                            {getFieldDecorator("endDate", {
                                rules: [
                                    { required: false, message: '请选择结束时间' },
                                ]
                            })(
                                <DatePicker disabledDate={this.disabledEndDate}
                                    showTime
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
                <Row style={{float: 'right',marginRight: 23}}>
                    <Col span={24}>
                        <Button
                            className="btn-search"
                            type="primary"
                            loading={this.props.loading}
                            onClick={this.search}
                        >查询</Button>
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