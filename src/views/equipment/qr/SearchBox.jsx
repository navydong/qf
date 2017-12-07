import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Select } from 'antd'
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
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
            <div>
                <Form>
                    <Row>
                        <Col md={12}>
                            <FormItem label="码值" {...formItemLayout}>
                                <Col span={11}>
                                    <FormItem>
                                        {getFieldDecorator('minCodeValue')(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                                    </span>
                                </Col>
                                <Col span={11}>
                                    <FormItem>
                                        {getFieldDecorator('maxCodeValue')(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>  
                        <Col md={12}>
                            <FormItem label="状态" {...formItemLayout}>
                                {getFieldDecorator("authStatus", {
                                    rules: [{ required: false, message: '请输入行业名称' }, {
                                    }],
                                })(
                                    <Select allowClear>
                                        <Option key="0">未授权</Option>
                                        <Option key="1">已授权</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        {/* <Col md={12}>
                            <FormItem label="创建时间" {...formItemLayout}>
                                {getFieldDecorator("industryName", {
                                    rules: [{ required: false, message: '请输入行业名称' }, {
                                    }],
                                })(
                                    <RangePicker />
                                    )}
                            </FormItem>
                        </Col> */}
                        <Col span={24}>
                            <div style={{ float: 'right', marginRight: 55 }}>
                                <Button
                                    className="btn-search"
                                    type="primary"
                                    loading={this.props.loading}
                                    onClick={this.search}
                                >查询</Button>
                                <Button
                                    className="btn-reset"
                                    onClick={this.reset}
                                >
                                    重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(SearchBox)