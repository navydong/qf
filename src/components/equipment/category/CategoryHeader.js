import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
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
              <FormItem {...formItemLayout} label={`设备品类名称`}>
                  {getFieldDecorator(`deviceName`)(
                      <Input placeholder={`请输入设备品类名称`} />
                  )}
              </FormItem>
            </Form>
        )
    }
}



CategoryHeader = Form.create()(CategoryHeader)
export default CategoryHeader
