import React from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class ChangePwdModal extends React.Component {
    state = {
        visible: true,
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            if(values.newPassword === values.newSurePassword){
                this.props.onOk(values, ()=>{
                    this.props.form.resetFields()
                })
            }else{
                this.props.form.setFields({
                    newSurePassword: {
                        value: values.newSurePassword,
                        errors: [new Error('两次密码不一致')],
                    }
                })
            }
        })
    }
    handleCancel = (e) => {
        this.props.form.resetFields();
        this.props.onCancel();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="修改密码"
                maskClosable={false}
                wrapClassName="vertical-center-modal"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <FormItem label="原密码" {...formItemLayout}>
                        {getFieldDecorator('password',{
                            rules: [{
                                required: true, whitespace: true,
                                message: '请输入',
                              }],
                        })(
                            <Input autoComplete="off" maxLength="255" />
                        )}
                    </FormItem>
                    <FormItem label="新密码" {...formItemLayout}>
                        {getFieldDecorator('newPassword',{
                            rules: [{
                                required: true, whitespace: true,
                                message: '请输入',
                              }],
                        })(
                            <Input type="password" maxLength="255"/>
                        )}
                    </FormItem>
                    <FormItem label="确认新密码" {...formItemLayout}>
                        {getFieldDecorator('newSurePassword',{
                            rules: [{
                                required: true, whitespace: true,
                                message: '请输入',
                              }],
                        })(
                            <Input type="password" maxLength="255" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}


export default Form.create()(ChangePwdModal)