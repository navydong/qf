import React from 'react'
import { Modal, Form, Input, Alert, Row, Col } from 'antd'
import {connect} from 'react-redux'
import { getCurrentUser } from '@/redux/actions'

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
        confirmLoading: false
    }
    handleOk = (e) => {
        e.preventDefault();
        // 如果是初始密码的话，提交表单时附上初始值 000000
        if (this.props.isInit) {
            this.props.form.setFieldsValue({password: '000000'})
        }
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (values.newPassword === values.newSurePassword) {
                this.setState({
                    confirmLoading: true
                })
                this.props.onOk(values, () => {
                    this.props.form.resetFields()
                    this.setState({
                        confirmLoading: false
                    })
                    this.props.changeInitState()
                    // window.location.reload()
                })
            } else {
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
        const isInit = this.props.isInit;
        console.log(this.props.form.getFieldsValue())
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="修改密码"
                maskClosable={false}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={this.state.confirmLoading}
            >
                <Form>
                    <Row>
                        {
                            isInit
                                ? <div style={{ margin: '10px 5px 20px 10px' }}>
                                    <Alert message="为了您的账户安全，请修改初始密码" type="warning" showIcon />
                                </div>
                                : <Col span={24}>
                                    <FormItem label="原密码" {...formItemLayout}>
                                        {getFieldDecorator('password', {
                                            rules: [{
                                                required: true, message: '请输入'
                                            }],
                                        })(
                                            <Input maxLength="255" />
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        <Col span={24}>
                            <FormItem label="新密码" {...formItemLayout}>
                                {getFieldDecorator('newPassword', {
                                    rules: [{
                                        required: true, whitespace: true,
                                        message: '请输入',
                                    }],
                                })(
                                    <Input type="password" maxLength="255" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="确认新密码" {...formItemLayout}>
                                {getFieldDecorator('newSurePassword', {
                                    rules: [{
                                        required: true, whitespace: true,
                                        message: '请输入',
                                    }],
                                })(
                                    <Input type="password" maxLength="255" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

const mapStatetoProps = (state)=>{
    const { userInfo = { data: {}, isFetching: true } } = state
    const isInit = userInfo.data.isInit || false;
    return { isInit }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        changeInitState: ()=>{
            dispatch(getCurrentUser())
        }
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(ChangePwdModal))