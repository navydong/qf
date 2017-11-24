import React from 'react'
import { Row, Col, Form, Select, Input, Button } from 'antd'
const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
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
    search = (e) => {
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
            <div className="search-box">
                <Form>
                    <Row gutter={40}>
                        <Col span={12}>
                            <FormItem label="名称" {...formItemLayout}>
                                {getFieldDecorator("name", {
                                    rules: [{ required: false, message: '请输入名称' }],
                                })(
                                    <Input placeholder="请输入名称" autoFocus onPressEnter={this.search} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                className="btn-search"
                                loading={this.props.loading}
                                onClick={this.search}
                            >查询</Button>
                            <Button className="btn-reset" onClick={this.reset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(SearchBox)