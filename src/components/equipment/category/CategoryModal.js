import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}
class TerminalModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { tabInfos } = this.props
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`设备品类名称`}>
                            {getFieldDecorator(`deviceName`,{
                              initialValue: tabInfos.deviceName
                            })(
                                <Input placeholder='设备品类名称'/>
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
