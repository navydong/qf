import React from 'react'
import { Form, Input,Row,Col} from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
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
            <Row gutter={12}>
              <Col span={8}>
               <FormItem {...formItemLayout} label={`分润方案名称`}>
                    {getFieldDecorator(`name`)(
                        <Input placeholder="请输入分润方案名称" />
                    )}
                </FormItem>
              </Col>
            </Row>
            </Form>
        )
    }
}

ProgramHeader = Form.create()(ProgramHeader)
export default ProgramHeader
