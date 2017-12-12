import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select, Radio, Checkbox, Button, Cascader } from 'antd'
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
    componentDidMount() {
        axios.get('/back/select/orgtype').then(res => res.data).then(res => {
            let options = []
            Object.keys(res).forEach(item => {
                options.push({
                    value: item,
                    label: res[item],
                    isLeaf: false,
                })
            })
            this.setState((prevState) => ({
                options: prevState.options.concat(options)
            }))
        })
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
            if (values.birthday) {
                values.birthday = values.birthday.format('YYYY-MM-DD')
            }
            this.props.onOk({ ...values, organization: values.organization && values.organization[values.organization.length - 1] })
        })
    }
    /** 级联选择 */
    onChange = (value, selectedOptions) => {
        //console.log(value, selectedOptions);
    }
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        axios.get(`/back/select/organization?orgType=${targetOption.value}`).then(res => res.data).then(res => {
            targetOption.loading = false;
            targetOption.children = []
            res.forEach(item => {
                targetOption.children.push({
                    label: item.name,
                    value: item.id,
                })
            })
            this.setState((prevState => (
                {
                    options: prevState.options
                }
            )))
        })
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 1) {
            return
        }
        return label[label.length - 1]
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
        // const orgtype = Object.keys(this.state.orgtype).map(i => (
        //     <Option key={i}>{this.state.orgtype[i]}</Option>
        // ))
        // const organization = this.state.organization.map(i => (
        //     <Option key={i.id}>{i.name}</Option>
        // ))
        return (
            <div className="user_addmodal">
                <Modal {...modalOpts} >
                    <Form>
                        <Input type="text" name="usernameadd" style={{ display: 'none' }} />
                        <Input type="password" name="passwordadd" style={{ display: 'none' }} />
                        <Row gutter={20}>
                            <Col md={12}>
                                <FormItem label="用户名" {...formItemLayout}>
                                    {getFieldDecorator('usernameadd', {
                                        initialValue: modalOpts.item.username,
                                        rules: [{ required: true, message: '请输入用户名' }],
                                    })(
                                        <Input placeholder="请输入用户名" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="密码" {...formItemLayout}>
                                    {getFieldDecorator('passwordadd', {
                                        initialValue: modalOpts.item.password,
                                        rules: [{ required: true, message: '请输入密码' }],
                                    })(
                                        modalOpts.item.password
                                            ? <Input type="password" disabled />
                                            : <Input type="password" placeholder="请输入密码" maxLength="16" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="姓名" {...formItemLayout}>
                                    {getFieldDecorator('name', {
                                        initialValue: modalOpts.item.name,
                                        rules: [{ required: false, message: '请输入姓名' }],
                                    })(
                                        <Input placeholder="请输入姓名" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="性别" {...formItemLayout}>
                                    {getFieldDecorator('sex', {
                                        initialValue: modalOpts.item.sex,
                                    })(
                                        <RadioGroup>
                                            <Radio value="男">男</Radio>
                                            <Radio value="女">女</Radio>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="手机" {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('mobilePhone', {
                                        initialValue: modalOpts.item.mobilePhone,
                                        rules: [{ pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确手机号码' }]
                                    })(
                                        <Input maxLength="11" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="邮箱" {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('email', {
                                        initialValue: modalOpts.item.email,
                                        rules: [{ type: 'email', message: '请输入正确的邮箱' }]
                                    })(
                                        <Input type="email" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="生日" {...formItemLayout}>
                                    {getFieldDecorator('birthday', {
                                        initialValue: modalOpts.item.birthday ? moment(modalOpts.item.birthday) : null,
                                    })(
                                        <DatePicker />
                                        )}
                                </FormItem>
                            </Col>

                            <Col md={12}>
                                <FormItem label="所属机构" {...formItemLayout}>
                                    {getFieldDecorator('organization', {
                                        rules: [{ required: modalOpts.item.orgName ? false : true, message: '请选择' }, {
                                            validator: function (rule, value, callback) {
                                                if (value && value.length === 1) {
                                                    callback('请选择所属机构')
                                                }
                                                callback()
                                            }
                                        }],
                                    })(
                                        <Cascader
                                            placeholder={modalOpts.item.orgName ? modalOpts.item.orgName : "请选择"}
                                            displayRender={this.displayRender}
                                            options={this.state.options}
                                            loadData={this.loadData}
                                            onChange={this.onChange}
                                        />
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
            </div>
        )
    }
}
AddModal.propTypes = {
    onOk: PropTypes.func
}
export default Form.create()(AddModal)
