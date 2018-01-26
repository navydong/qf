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
    // codeNormalize = (value, prevValue, allValues) => {
    //     const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    //     if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
    //         return value
    //     } else {
    //         return prevValue
    //     }
    // }
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
                                        {getFieldDecorator('minCodeValue', {
                                            rules: [{pattern: /^\d+$/, message: '请输入正确码值'}]
                                        })(
                                            <Input maxLength="255" placeholder="最小码值" />
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
                                        {getFieldDecorator('maxCodeValue', {
                                            rules: [{pattern: /^\d+$/, message: '请输入正确码值'}]
                                        })(
                                            <Input maxLength="255" placeholder="最大码值" />
                                            )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="状态" {...formItemLayout}>
                                {getFieldDecorator("authStatus", {
                                    rules: [],
                                })(
                                    <Select allowClear placeholder="==请选择==">
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