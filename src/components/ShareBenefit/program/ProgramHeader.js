import React from 'react'
import { Form, Input } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
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
            <div className="search-box">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="分润方案名称">
                        {getFieldDecorator('name')(
                            <Input placeholder="请输入分润方案名称" maxLength="255" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

ProgramHeader = Form.create()(ProgramHeader)
export default ProgramHeader
