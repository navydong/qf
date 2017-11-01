import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class ProgramModal extends Component {
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
        const options = this.props.options.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeName`)(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`通道信息`}>
                            {getFieldDecorator(`passwayId`)(
                                <Select defalultValue={`passwayId`}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

ProgramModal = Form.create()(ProgramModal);
export default ProgramModal