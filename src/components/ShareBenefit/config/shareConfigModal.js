import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class ConfigModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
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
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`机构类型`}>
                            {getFieldDecorator(`ptype`)(
                                <Select>
                                    <Option vlaue="ptype" key={3}>机构类型</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`下级机构类型`}>
                            {getFieldDecorator(`stype`)(
                                <Select>
                                    <Option vlaue="stype" key={4}>下级机构名称</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案`}>
                            {getFieldDecorator(`schemeId`)(
                                <Select>
                                    <Option vlaue="schemeId" key={5}>分润方案</Option>
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