import React from 'react'
import { Form, Input } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};
class CategoryHeader extends React.Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label={`设备品类名称`}>
                        {getFieldDecorator(`deviceName`)(
                            <Input placeholder={`请输入设备品类名称`} maxLength="255" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}



CategoryHeader = Form.create()(CategoryHeader)
export default CategoryHeader
