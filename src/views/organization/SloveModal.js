import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class SharedForm extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3>基本信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`机构名称`}>
                            {getFieldDecorator(`orgname`)(
                                <Input placeholder={`机构名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`受理机构简称`}>
                            {getFieldDecorator(`orgstname`)(
                                <Input placeholder={`受理机构简称`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`支付通道`}>
                            {getFieldDecorator(`passwayIds`)(
                                <Select>
                                    <Option value="zhifubao" key={1}>支付宝</Option>
                                    <Option value="wx" key={2}>微信</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <h3>用户信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`登陆名`}>
                            {getFieldDecorator(`登陆名`)(
                                <Input placeholder={`机构名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`密码`}>
                            {getFieldDecorator(`password`)(
                                <Input placeholder={`密码`} type="password"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <h3>结算账户信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`账户类型`}>
                            {getFieldDecorator(`acctype`)(
                                <Select>
                                    <Option value="机构">机构</Option>
                                    <Option value="个人">个人</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户银行`}>
                            {getFieldDecorator(`deposite`)(
                                <Select>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`银行卡号`}>
                            {getFieldDecorator(`bankno`)(
                                <Input placeholder={`银行卡号`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行名称`}>
                            {getFieldDecorator(`branchNmae`)(
                                <Input placeholder={`开户支行名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行地区`}>
                            {getFieldDecorator(`branchRegion`)(
                                <Input placeholder={`开户支行地区`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`企业名称`}>
                            {getFieldDecorator(`company`)(
                                <Input placeholder={`企业名称`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

SharedForm = Form.create()(SharedForm);
export default SharedForm