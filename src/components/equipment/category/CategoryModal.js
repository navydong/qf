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
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`设备终端名称`}>
                            {getFieldDecorator(`deviceName`)(
                                <Input placeholder='设备终端名称'/>
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