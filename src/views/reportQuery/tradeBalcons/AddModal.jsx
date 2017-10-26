import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
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
                    <Row gutter={40}>
                        <Col span={12}>
                            <FormItem label="通道名称" {...formItemLayout}>
                                {getFieldDecorator('passwayName', {
                                    initialValue: modalOpts.item.passwayName,
                                    rules: [{ required: true, message: '请输入通道名称' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="通道ID" {...formItemLayout}>
                                {getFieldDecorator('portId', {
                                    initialValue: modalOpts.item.portId,
                                    rules: [{ required: true, message: '请输入通道ID' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="备注" {...{
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 20
                                }
                            }}>
                                {getFieldDecorator('desc',{
                                    initialValue: modalOpts.item.desc
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