import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

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
                    <Row>
                        <Col>
                            <FormItem label="行业名称" {...formItemLayout}>
                                {getFieldDecorator('industryName')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="上级行业" {...formItemLayout}>
                                {getFieldDecorator('pid')(
                                    <Select>
                                        <Option value="线下零售">线下零售</Option>
                                        <Option value="金融">金融</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="结算周期T+" {...formItemLayout}>
                                {getFieldDecorator('cycle')(
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