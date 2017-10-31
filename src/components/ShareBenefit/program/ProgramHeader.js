import React from 'react'
import { Form, Input} from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
class ProgramHeader extends React.Component {
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
                <FormItem {...formItemLayout} label={`姓名`}>
                    {getFieldDecorator(`name`)(
                        <Input placeholder="请输入姓名" />
                    )}
                </FormItem>
            </Form>
        )
    }
}

ProgramHeader = Form.create()(ProgramHeader)
export default ProgramHeader