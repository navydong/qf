import React from 'react'
import { Modal, Icon, InputNumber, Form } from 'antd'
import '@/style/viewpage/refund.less'

const FormItem = Form.Item
const titleStyle = {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.65)',
    fontWeight: 'bold',
    marginBottom: 14
}
const bodyStyle = {
    padding: '30px 40px'
}
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

class RefundDetail extends React.Component {
    render() {
        const { merchantName, orders, tradedt, remainSum } = this.props.record || {}
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="refundDetail" >
                <Form>
                    <div style={titleStyle} >
                        <Icon type="question-circle" style={{ fontSize: 22, color: '#ffbf00', marginRight: 12 }} />
                        <span>确认要退款？</span>
                    </div>
                    <div className="form-item" >
                        <FormItem {...formItemLayout} label="商户名称">
                            {merchantName}
                        </FormItem>
                        <FormItem {...formItemLayout} label="订&nbsp; 单 &nbsp;号">
                            {orders}
                        </FormItem>
                        <FormItem {...formItemLayout} label="交易时间">
                            {tradedt}
                        </FormItem>
                        <FormItem {...formItemLayout} label="退款金额">
                            {getFieldDecorator(`sum`, {
                                rules: [{ required: true, message: '退款金额不能为空' }, {
                                    pattern: /^\d+(?:\.\d{1,2})?$/, message: '请输入正确退款金额'
                                }],
                                initialValue: remainSum
                            })(
                                <InputNumber
                                    min={0.01}
                                    max={remainSum}
                                    size="small"
                                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            )}
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(RefundDetail)