import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker


const type = [
    { key: "-1", option: '全部', },
    { key: "0", option: '支付既会员' }
]

const state = [
    { key: "-1", option: '全部' },
    { key: "0", option: '进行中' },
    { key: "1", option: '已终止' },
    { key: "2", option: '未开始' }
]
class SearchBox extends Component {
    reset = () => {
        this.props.form.resetFields()
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values.date) {
                    values.startDate = values.date[0].format('YYYY-MM-DD');
                    values.endDate = values.date[1].format('YYYY-MM-DD');
                    delete values.date
                }
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
                    {getFieldDecorator('type')(
                        <Select placeholder="活动状态" style={{ width: 100 }}>
                            {
                                type.map(item => (
                                    <Option key={item.key}>{item.option}</Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('date')(
                        <RangePicker />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('state')(
                        <Select placeholder="活动状态" style={{ width: 100 }}>
                            {
                                state.map(item => (
                                    <Option key={item.key}>{item.option}</Option>
                                ))
                            }
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