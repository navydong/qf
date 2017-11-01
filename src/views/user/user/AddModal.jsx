import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}
class AddModal extends React.Component {
    /**
     * 模态框确定按钮
     */
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.onOk(values)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
        }
        return (
            <Modal {...modalOpts}>
                <Form>
                    <Row gutter={20}>
                        <Col md={12}>
                            <FormItem label="姓名" {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    initialValue: modalOpts.item.name,
                                    rules: [{ required: true, message: '请输入姓名' }],
                                })(
                                    <Input placeholder="请输入姓名" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="账户" {...formItemLayout}>
                                {getFieldDecorator('username', {
                                    initialValue: modalOpts.item.username,
                                    rules: [{ required: true, message: '请输入账户' }],
                                })(
                                    <Input placeholder="请输入账户" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="密码" {...formItemLayout}>
                                {getFieldDecorator('password', {
                                    initialValue: modalOpts.item.password,
                                    rules: [{ required: true, message: '请输入密码' }],
                                })(
                                    <Input type="password" placeholder="请输入密码" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="手机" {...formItemLayout}>
                                {getFieldDecorator('mobilePhone',{
                                    initialValue: modalOpts.item.mobilePhone,
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="邮件" {...formItemLayout}>
                                {getFieldDecorator('email',{
                                    initialValue: modalOpts.item.email,
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="生日" {...formItemLayout}>
                                {getFieldDecorator('birthday',{
                                    initialValue: modalOpts.item.birthday,
                                })(
                                    <DatePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="性别" {...formItemLayout}>
                                {getFieldDecorator('sex',{
                                     initialValue: modalOpts.item.sex,
                                })(
                                    <RadioGroup>
                                        <Radio value="男">男</Radio>
                                        <Radio value="女">女</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={24}>
                            <FormItem label="描述" labelCol={{span:3}} wrapperCol={{span:20}}>
                                {getFieldDecorator('description',{
                                    initialValue: modalOpts.item.sex,
                                })(
                                    <Input type="textarea" rows={4} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
AddModal.propTypes = {
    onOk: PropTypes.func
}
export default Form.create()(AddModal)