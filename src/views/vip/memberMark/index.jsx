import React, { Component } from 'react'
import { Form, Input, DatePicker, InputNumber, Button, message, notification } from 'antd'
import axios from 'axios'
import moment from 'moment'

import './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const TextArea = Input.TextArea
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
};
class MembreMark extends Component {
    _isMounted = false
    state = {
        created: false,
        loading: false,
        activityInfo: {}
    }
    componentDidMount() {
        this._isMounted = true
        const id = this.props.params.id
        if (id) {
            this.getActivityInfo(id)
        }
    }
    componentWillMount() {
        this._isMounted = false
    }
    // 获取活动信息
    getActivityInfo = (id) => {
        axios.post('/back/memberactivity/getwxmemberactivity', { id }).then(({ data }) => {
            this._isMounted && this.setState({ activityInfo: data.rows[0], created: true })
            this.props.form.resetFields()
        })
    }
    disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().startOf("day");
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { activityName, activityDate, leastMoney, wechatMchid } = values
                let url = '/back/memberactivity/createactivity'   //创建url
                const data = {
                    activityName,
                    leastMoney,
                    wechatMchid: wechatMchid.replace(/，/g, ','),
                    startDate: activityDate[0].format('YYYY-MM-DD'),
                    endDate: activityDate[1].format('YYYY-MM-DD')
                }
                if (this.state.created) {
                    url = '/back/memberactivity/updateactivity'   //修改url
                    data.id = this.state.activityInfo.id
                }
                this.setState({ loading: true })
                axios.post(url, data).then(({ data }) => {
                    if (data.rel) {
                        message.success(data.msg)
                        this.setState({
                            created: true
                        })
                    } else {
                        const key = 'error-notification'
                        notification.close(key)
                        notification.error({
                            key,
                            message: 'Error',
                            description: data.msg,
                            duration: 0
                        })
                    }
                    this.setState({ loading: false })
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { activityInfo } = this.state
        return (
            <div className="membermark">
                <div className="membermark-header" >
                    <span>
                        活动信息
                    </span>
                </div>
                <Form onSubmit={this.onSubmit}>
                    <div className="membermark-form" >
                        <FormItem label="活动名称" {...formItemLayout} >
                            {getFieldDecorator('activityName', {
                                initialValue: activityInfo.activityName,
                                rules: [{ required: true, message: '请输入活动名称' }],
                            })(
                                <Input placeholder="活动名称" />
                            )}
                        </FormItem>
                        <FormItem label="活动时间" {...formItemLayout} >
                            {getFieldDecorator('activityDate', {
                                initialValue: activityInfo.id && [moment(activityInfo.startDate), moment(activityInfo.endDate)],
                                rules: [{ required: true, message: '请选择活动时间' }],
                            })(
                                <RangePicker disabledDate={this.disabledDate} />
                            )}
                        </FormItem>
                        <FormItem label="活动条件" {...formItemLayout} >
                            消费满
                    {getFieldDecorator('leastMoney', {
                                initialValue: activityInfo.leastMoney || 0,
                                rules: [{ required: true, message: '请输入最低金额' }],
                            })(
                                <InputNumber style={{ width: 100, margin: '0 10px' }} />
                            )}
                            元，送会员卡
                    </FormItem>
                        <FormItem label="微信商户号" {...formItemLayout} help="支持赠券规则的微信商户号列表。注意：商户号用 , 分隔。" >
                            {getFieldDecorator('wechatMchid', {
                                initialValue: activityInfo.wechatMchid,
                                rules: [{ required: true, message: '请输入微信商户号' }],
                            })(
                                <TextArea disabled={this.state.created} rows={4} placeholder="微信商户号可以登录微信商户平台查看，或联系服务商咨询" />
                            )}
                        </FormItem>
                    </div>
                    <div className="membermark-button" >
                        <Button loading={this.state.loading} type="primary" htmlType="submit">{this.state.created ? '更新活动' : '创建活动'}</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(MembreMark);