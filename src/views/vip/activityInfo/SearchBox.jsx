import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class SearchBox extends Component {
    reset = () => {
        this.props.form.resetFields()
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.search(values)
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <Form layout="inline" onSubmit={this.onSubmit} >
                <FormItem>
                    {getFieldDecorator('activityName')(
                        <Input placeholder="请输入活动名称" />
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('a2')(
                        <RangePicker />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('a3')(
                        <Select placeholder="活动状态" style={{ width: 100 }}>
                            <Option key="1">进行中</Option>
                            <Option key="2">已终止</Option>
                            <Option key="3">未开始</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" loading={this.props.loading}>查询</Button>
                </FormItem>
                <FormItem>
                    <Button onClick={this.reset} >清空</Button>
                </FormItem>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)