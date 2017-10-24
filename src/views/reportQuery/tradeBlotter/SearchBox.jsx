import React from 'react'
import { Row, Col, Form, Select, Input, Button } from 'antd'
import axios from 'axios'
const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class SearchBox extends React.Component {
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
            this.props.search(values)
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
    render() {
        const { getFieldDecorator } = this.props.form;
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
                        <FormItem label="支付方式" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==">
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="商户ID" {...formItemLayout}>
                            {getFieldDecorator("merchantId")(
                                <Select placeholder="==请选择==">
                                    {this.getSelectOption('back/tradeBlotter/getMerchantinfoList', 'merchant_name', 'id')}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="交易类型" {...formItemLayout}>
                            {getFieldDecorator("type")(
                                <Select placeholder="==请选择==">
                                    {this.getSelectOption('back/tradeBlotter/getDicList', 'dv_name', 'dv_name', {
                                        type: 'QF_TRADETYPE'
                                    })}
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
                        <Button type="primary" loading={this.props.loading} onClick={this.search}>查询</Button>
                        <Button type="primary" onClick={this.reset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)