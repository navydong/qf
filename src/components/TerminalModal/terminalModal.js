import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class TerminalModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备终端名称`}>
                            {getFieldDecorator(`schemeName`)(
                                <Input placeholder='设备终端名称' />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`passwayId`)(
                                <Select defalultValue={`passwayId`}>
                                    <Option vlaue="上级机构名称" key={2}>上级机构名称</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备条码`}>
                            {getFieldDecorator(`tradesumLow`)(
                                <Input placeholder='设备条码' />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备品类`}>
                            {getFieldDecorator(`tradesumHigh`)(
                                <Select defalultValue={`passwayId`}>
                                    <Option vlaue="下级机构名称" key={4}>设备品类</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`识别码`}>
                            {getFieldDecorator(`rate`)(
                                <Input placeholder='识别码' />
                            )}
                        </FormItem>
                        <Button type="primary">生成识别码</Button>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`激活码`}>
                            {getFieldDecorator(`rate`)(
                                <Input placeholder='激活码' />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备备注`}>
                            {getFieldDecorator(`rate`)(
                                <Input placeholder='设备备注' />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

TerminalModal = Form.create()(TerminalModal);
export default TerminalModal