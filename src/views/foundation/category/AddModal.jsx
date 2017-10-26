import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 5 }
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
                    <Row>
                        <Col md={12}>
                            <FormItem label="行业名称" {...formItemLayout}>
                                {getFieldDecorator('industryName', {
                                    rules: [{ required: true, message: '请输入行业名称' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="上级行业" {...formItemLayout}>
                                {getFieldDecorator('pid', {
                                    rules: [{ required: true, message: '请选择上级行业' }],
                                })(
                                    <Select>
                                        <Option value="线下零售">线下零售</Option>
                                        <Option value="金融">金融</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="结算周期T+" {...formItemLayout}>
                                {getFieldDecorator('cycle', {
                                    rules: [{ required: true, message: '请输入结算周期T+' }],
                                })(
                                    <Input />
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