import React from 'react'
import { Form, Row, Col, DatePicker } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
class BenefitHeader extends React.Component {
    constructor(props){
        super(props)
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开始日期`}>
                            {getFieldDecorator(`startTime`,{
                                rules: [{ required: true, whitespace: true, message: '请输入开始日期', }]
                            })(
                                <DatePicker/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`结束日期`}>
                            {getFieldDecorator(`endTime`,{ rules: [{ required: true, whitespace: true, message: '请输入开始日期', }] })(
                                <DatePicker/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

BenefitHeader = Form.create()(BenefitHeader)
export default BenefitHeader
