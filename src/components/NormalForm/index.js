import React, { Component, PropTypes } from 'react'
import { Form,Row,Col,Input } from 'antd'
const FormItem = Form.Item;

class SharedForm extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`newShareName`)(
                                <Input placeholder={``} />
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