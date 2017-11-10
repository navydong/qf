import React from 'react'
import { Row, Col, Form, Select, Input, Button } from 'antd'
import axios from 'axios'
import { Route } from 'react-router/lib';
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
    state = {
        merchantinfoList: [],
        dicList: []
    }
    componentDidMount() {
        function getMerchantinfoList() {
            return axios.get('/back/tradeBlotter/getMerchantinfoList')
        }
        function getDicList() {
            return axios.get(`/back/tradeBlotter/getDicList?type=QF_TRADETYPE`)
        }
        axios.all([getMerchantinfoList(), getDicList()]).then(axios.spread((merchantinfoList, dicList) => {
            if (typeof merchantinfoList.data === 'string') {
                return
            }
            this.setState({
                merchantinfoList: merchantinfoList.data,
                dicList: dicList.data
            })
        }))
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
            this.props.search(values)
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
                                    {this.state.merchantinfoList.map(item => (
                                        <Option key={item.order}>{item.dvName}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="交易类型" {...formItemLayout}>
                            {getFieldDecorator("type")(
                                <Select placeholder="==请选择==">
                                    {this.state.dicList.map(item => (
                                        <Option key={item.order}>{item.dvName}</Option>
                                    ))}
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
                </Row>
                <Row>
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
            </Form>
        )
    }
}
export default Form.create()(SearchBox)