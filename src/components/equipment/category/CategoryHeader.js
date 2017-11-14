import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
class CategoryHeader extends React.Component {
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
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`设备品类名称 `}>
                            {getFieldDecorator(`deviceName`)(
                                <Input placeholder={`请输入设备品类名称 `} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



CategoryHeader = Form.create()(CategoryHeader)
export default CategoryHeader