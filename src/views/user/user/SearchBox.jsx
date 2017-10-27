import React from 'react'
import { Row, Col, Form, Select, Input, Button } from 'antd'
const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class SearchBox extends React.Component {
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
    }
    search = ()=>{
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.search(values)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row gutter={40}>
                    <Col span={12}>
                        <FormItem label="姓名" {...formItemLayout}>
                            {getFieldDecorator("name", {
                                rules: [{ required: true, message: '请输入姓名' }],
                            })(
                                <Input placeholder="请输入姓名" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" icon="search" loading={this.props.loading} onClick={this.search}>查询</Button>
                        <Button type="primary" onClick={this.reset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)