import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
class ConfigHeader extends React.Component {
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
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`编号`}>
                            {getFieldDecorator(`schemeId`)(
                                <Input placeholder={`请输入编号`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`姓名`}>
                            {getFieldDecorator(`sorgId`)(
                                <Input placeholder={`姓名`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



ConfigHeader = Form.create()(ConfigHeader)
export default ConfigHeader