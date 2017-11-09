import React from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        lg: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
        lg: { span: 19}
    },
};

class SearchBox extends React.Component {
    componentDidMount() {
        window.addEventListener('keypress', this.search)
    }
    componentWillUnMount() {
        window.removeEventListener('keypress', this.search)
    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
    }
    search = (e) => {
        if (e.keyCode && e.keyCode !== 13) {
            return
        }
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
                <Row>
                    <Col span={12}>
                        <FormItem label="通道名称" {...formItemLayout}>
                            {getFieldDecorator("name", {
                                rules: [{ required: false, message: '请输入姓名' }],
                            })(
                                <Input placeholder="请输入通道名称" autoFocus />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <Button
                            className="btn-search"
                            type="primary"
                            loading={this.props.loading}
                            onClick={this.search}
                        >查询</Button>
                        <Button
                            className="btn-reset"
                            onClick={this.reset}
                        >重置</Button>
                    </Col>
                </Row>
            </Form>
            </div>
        )
    }
}
export default Form.create()(SearchBox)