import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio } from 'antd'
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
            console.log(values)
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
                        <FormItem>
                            {getFieldDecorator('menuId', {
                                initialValue: modalOpts.item.id,
                            })(
                                <Input type="hidden" />
                                )}
                        </FormItem>
                        <Col md={12}>
                            <FormItem label="按钮" {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    initialValue: modalOpts.item.title,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input placeholder="请输入按钮" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="权限编码" {...formItemLayout}>
                                {getFieldDecorator('code', {
                                    initialValue: modalOpts.item.code,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input placeholder="请输入编码" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="资源路径" {...formItemLayout}>
                                {getFieldDecorator('uri', {
                                    initialValue: modalOpts.item.parentId,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="method" {...formItemLayout}>
                                {getFieldDecorator('method', {
                                    initialValue: modalOpts.item.href,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select>
                                        <Option value="GET">GET</Option>
                                        <Option value="POST">POST</Option>
                                        <Option value="DELETE">DELETE</Option>
                                        <Option value="PUT">PUT</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="button" {...formItemLayout}>
                                {getFieldDecorator('type', {
                                    initialValue: modalOpts.item.icon,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select>
                                        <Option value="button">button</Option>
                                        <Option value="uri">uri</Option>
                                    </Select>
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