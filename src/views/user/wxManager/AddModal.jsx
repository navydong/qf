import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio, Checkbox, Button, Cascader, Icon, message } from 'antd'
import axios from 'axios'
import moment from 'moment';
import { getFormSelect, getFormInput } from '@/utils/formItem'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;

console.log(getFormInput)

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
        const { isUpdate } = this.props
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
            onCancel: this.onCancel,
        }
        const hasPermissions = this.props.hasPermissions;
        const fromData = [
            {
                type: 'input',
                id: 'title',
                label: '受理机构简称',
                defaultValue: modalOpts.item.title,
                validator: [{ required: true, message: '请输入菜单' }],
                $$updateValidator: [{ required: true, message: '请输入菜单' }]
            }, {
                type: 'input',
                id: 'code',
                label: '编码',
                defaultValue: modalOpts.item.code,
                validator: [{ required: true, message: '请输入编码' }],
                $$updateValidator: [{ required: true, message: '请输入编码' }]
            }
        ]

        return (
            <div className="user_addmodal">
                <Modal {...modalOpts} >
                    <Form>
                        <Row>
                            {
                                fromData.map(formItem => {
                                    if (formItem.type === 'input') {
                                        return getFormInput(formItem)(getFieldDecorator, isUpdate)
                                    } else if (formItem.type === 'select') {
                                        return getFormSelect(formItem)(getFieldDecorator)
                                    }
                                })
                            }
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
