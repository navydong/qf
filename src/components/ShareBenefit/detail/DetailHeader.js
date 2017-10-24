import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class SloveHeader extends React.Component {
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
        const {passway} = this.props
        const {frscheme} = this.props
        const passwayOpts = passway.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        ))
        const frshemeOpts = frscheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        ))
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`分润方案`}>
                            {getFieldDecorator(`schemeId`)(
                                <Select>
                                    {frshemeOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`passway`)(
                                <Select>
                                    {passwayOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

SloveHeader = Form.create()(SloveHeader)
export default SloveHeader