import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class ConfigModal extends Component {
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
        // const options = (this.props.passway).map((item,index)=>(
        //     <Option value={item.id} key={index}>{item.passwayName}</Option>
        // ))
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`上级机构类型`}>
                            {getFieldDecorator(`schemeName`)(
                                <Select>
                                    <Option vlaue="请选择" key={1}>请选择</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`上级机构名称`}>
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
                        <FormItem {...formItemLayout} label={`下级机构类型`}>
                            {getFieldDecorator(`tradesumLow`)(
                                <Select defalultValue={`passwayId`}>
                                    <Option vlaue="下级机构类型" key={3}>下级机构类型</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`下级机构名称`}>
                            {getFieldDecorator(`tradesumHigh`)(
                                <Select defalultValue={`passwayId`}>
                                    <Option vlaue="下级机构名称" key={4}>下级机构名称</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案`}>
                            {getFieldDecorator(`rate`)(
                                <Select defalultValue={`分润方案`}>
                                    <Option vlaue="分润方案" key={5}>分润方案</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

ConfigModal = Form.create()(ConfigModal);
export default ConfigModal