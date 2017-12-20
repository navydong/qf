import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd'
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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
        passway: []
    }
    componentDidMount() {
        axios.get('/back/tradeBlotter/getMerchantinfoList').then(res => res.data).then(res => {
            this.setState((prevState => (
                { merchantinfoList: prevState.merchantinfoList.concat(res) }
            )))
        })
        axios.get('/back/passway/page').then(res => res.data).then(res => {
            console.log(res)
            this.setState((prevState) => ({
                passway: prevState.passway.concat(res.rows)
            }
            ))
        })

    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
    }
    /**
     * 搜索按钮
     */
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const startDate = values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate.format('YYYY-MM-DD')
            this.props.search({ ...values, startDate, endDate })
        })
    }
    summary = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const startDate = values.startDate.format('YYYY-MM-DD HH:mm:ss')
            const endDate = values.endDate.format('YYYY-MM-DD HH:mm:ss')
            this.props.summary({ ...values, startDate, endDate })
        })
    }
    /**
     * 获取下拉列表项
     * @param {String} url 请求地址
     * @param {String} label 选项文字
     * @param {String} value 选项value属性
     * @param {Object} param 请求参数
     */
    getSelectOption(url, label, value, param) {
        axios.get(url, {
            params: param
        }).then((res) => {
            return res.data.map((option) => {
                return <Option value={option.value}>{option.label}</Option>
            }
            )
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
                <Row>
                    <Col span={12}>
                        <FormItem label="商户ID" {...formItemLayout}>
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
                        <FormItem label="支付方式" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==" allowClear>
                                    {this.state.passway.map(i => (
                                        <Option key={i.id}>{i.passwayName}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="开始时间" {...formItemLayout}>
                            {getFieldDecorator("startDate", {
                                rules: [
                                    { required: true, whitespace: true, message: '请选择开始时间' },
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
                                    { required: true, whitespace: true, message: '请选择结束时间' },
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
                <Row style={{ float: 'right', marginRight: 45 }}>
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
                        <Button
                            className="btn-reset"
                            onClick={this.summary}
                        >
                            订单汇总</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)
