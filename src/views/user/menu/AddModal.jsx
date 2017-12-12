import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

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
    /**
     * 模态框取消按钮
     */
    onCancel = (e) => {
        this.props.modalProps.onCancel();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
            onCancel: this.onCancel,
        }
        const parentId = this.props.parentId
        return (
            <Modal {...modalOpts}>
                <Form>
                    <Row gutter={20}>
                        <FormItem>
                            {getFieldDecorator('id', {
                                initialValue: modalOpts.item.id,
                            })(
                                <Input type="hidden" />
                                )}
                        </FormItem>
                        <Col md={12}>
                            <FormItem label="菜单" {...formItemLayout}>
                                {getFieldDecorator('title', {
                                    initialValue: modalOpts.item.title,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input placeholder="请输入菜单" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="编码" {...formItemLayout}>
                                {getFieldDecorator('code', {
                                    initialValue: modalOpts.item.code,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input placeholder="请输入编码" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="父级菜单" {...formItemLayout}>
                                {getFieldDecorator('parentId', {
                                    initialValue: modalOpts.item.parentId || parentId,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select>
                                        <Option key={parentId}>{parentId}</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="url" {...formItemLayout}>
                                {getFieldDecorator('href', {
                                    initialValue: modalOpts.item.href,
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="图标" {...formItemLayout}>
                                {getFieldDecorator('icon', {
                                    initialValue: modalOpts.item.icon,
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="排序" {...formItemLayout}>
                                {getFieldDecorator('orderNum', {
                                    initialValue: modalOpts.item.orderNum,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={24}>
                            <FormItem label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                                {getFieldDecorator('description', {
                                    initialValue: modalOpts.item.description,
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