import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio, Checkbox, Button, Cascader, Icon, message } from 'antd'
import axios from 'axios'
import moment from 'moment';
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
    state = {
        orgtype: [],
        organization: [],
        options: [],
    }
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
    onCancel = (e) => {
        this.props.modalProps.onCancel();
        this.props.form.resetFields();
    }
    // render函数
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
            onCancel: this.onCancel,
        }
        const hasPermissions = this.props.hasPermissions;
        return (
            <div className="user_addmodal">
                <Modal {...modalOpts} >
                    <Form>
                        <Row gutter={20}>
                            <Col md={12}>
                                <FormItem label="菜单" {...formItemLayout}>
                                    {getFieldDecorator('title', {
                                        initialValue: modalOpts.item.title,
                                        rules: [
                                            { required: true, message: '请输入菜单' },
                                        ],
                                    })(
                                        <Input placeholder="菜单" maxLength="16" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="编码" {...formItemLayout}>
                                    {getFieldDecorator('code', {
                                        initialValue: modalOpts.item.code,
                                        rules: [{ required: true, message: '请输入编码' }],
                                    })(
                                        <Input />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}
AddModal.propTypes = {
    onOk: PropTypes.func
}
export default Form.create()(AddModal)
