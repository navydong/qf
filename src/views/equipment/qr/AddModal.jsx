import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, InputNumber, Select } from 'antd'
import axios from 'axios'
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}
class AddModal extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }
    componentDidMount() {

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
            this.props.onOk(values, () => {
                console.log(111)
                this.selectDetail()
            })
        })
    }


    onCancel = (e) => {
        this.props.modalProps.onCancel()
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
                    <Row>
                        {JSON.stringify(modalOpts.item) === '{}'
                            ? <Col md={12}>
                                <FormItem label="创建数量" {...formItemLayout}>
                                    {getFieldDecorator('quantity', {
                                        initialValue: modalOpts.item.quantity || 1,
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <InputNumber min={1} max={100} style={{ width: '100%' }} />
                                        )}
                                </FormItem>
                            </Col>
                            : null}
                        <Col md={12}>
                            <FormItem label="二维码类型" {...formItemLayout}>
                                {getFieldDecorator('codeType', {
                                    // modalOpts.item.codeType
                                    initialValue: String(modalOpts.item.codeType),
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select>
                                        <Option key="0">微信收款二维码</Option>
                                        <Option key="1">支付宝收款二维码</Option>
                                        <Option key="2">公共二维码</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        {JSON.stringify(modalOpts.item) !== '{}'
                            ?
                            <Col md={12}>
                                <FormItem label="商户Id" {...formItemLayout}>
                                    {getFieldDecorator('merId', {
                                        // modalOpts.item.codeType
                                        initialValue: modalOpts.item.merId,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select>
                                            <Option key="0">微信收款二维码</Option>
                                            <Option key="1">支付宝收款二维码</Option>
                                            <Option key="2">公共二维码</Option>
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            : null}
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