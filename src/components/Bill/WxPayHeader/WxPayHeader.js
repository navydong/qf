import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class WxPayHeader extends React.Component {
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
            <Form>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`开始日期`}>
                            {getFieldDecorator(`startTime`)(
                                <DatePicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`结束日期`}>
                            {getFieldDecorator(`endTime`)(
                                <DatePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

WxPayHeader = Form.create()(WxPayHeader)
export default WxPayHeader