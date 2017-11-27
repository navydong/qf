import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        md: { span: 4 },
    },
    wrapperCol: {
        md: { span: 18 },
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
        return (
            <Modal {...modalOpts}>
                <Form>
                    <Row gutter={20}>
                        <Col md={24}>
                            <FormItem label="名称" {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    initialValue: modalOpts.item.name,
                                    rules: [{ required: true, message: '请输入名称' }],
                                })(
                                    <Input placeholder="请输入名称" />
                                    )}
                            </FormItem>
                        </Col>
                        {/* <Col md={12}>
                            <FormItem label="编码" {...formItemLayout}>
                                {getFieldDecorator('code', {
                                    initialValue: modalOpts.item.code,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input placeholder="请输入编码" />
                                    )}
                            </FormItem>
                        </Col> */}
                        <Col md={12}>
                            {/* 组类型 */}
                            {getFieldDecorator('groupType', {
                                initialValue: 1,
                                rules: [{ required: false, message: '请输入' }],
                            })(
                                <Input type="hidden" />
                                )}

                        </Col>
                        <Col md={12}>
                            {/* 父级id */}
                            {getFieldDecorator('parentId', {
                                initialValue: modalOpts.item.parentId,
                                rules: [{ required: false, message: '请输入' }],
                            })(
                                <Input type="hidden" />
                                )}

                        </Col>
                        <Col md={24}>
                            <FormItem label="描述" {...formItemLayout}>
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