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
    resetPwdButton = () => {
        const id = this.props.modalProps.item.id
        axios.post('/back/user/resetPassword', {
            userId: id
        }).then(res => {
            if (res.data.rel) {
                message.success(res.data.msg, 6)
            } else {
                message.error(res.data.msg)
            }
        })
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
                                <FormItem label="用户名" {...formItemLayout}>
                                    {getFieldDecorator('usernameadd', {
                                        initialValue: modalOpts.item.username,
                                        rules: [
                                            { required: true, message: '请输入用户名' },
                                            { pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '非法字符' }
                                        ],
                                        validateFirst: true,
                                    })(
                                        <Input placeholder="请输入用户名" maxLength="16" autoComplete="off" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="密码" {...formItemLayout}>
                                    {getFieldDecorator('passwordadd', {
                                        initialValue: modalOpts.item.password,
                                        rules: [{ required: true, whitespace: true, message: '请输入密码' }],
                                    })(
                                        modalOpts.item.password
                                            ? <Input
                                                type="password"
                                                disabled
                                                autoComplete="new-password"
                                                addonAfter={hasPermissions ? <a onClick={this.resetPwdButton}>重置密码</a> : null}
                                            />
                                            : <Input type="password" placeholder="请输入密码" maxLength="16" autoComplete="new-password" />
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
                                        <Input placeholder="例如：13812345678" maxLength="11" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="邮箱" {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('email', {
                                        initialValue: modalOpts.item.email,
                                        rules: [{ type: 'email', message: '请输入正确的邮箱' }]
                                    })(
                                        <Input type="email" placeholder="例如：zhangsan@gmail.com" maxLength="255" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col md={12}>
                                <FormItem label="生日" {...formItemLayout}>
                                    {getFieldDecorator('birthday', {
                                        initialValue: modalOpts.item.birthday ? moment(modalOpts.item.birthday) : undefined,
                                    })(
                                        <DatePicker
                                            disabledDate={currentDate => {
                                                if (!currentDate) {
                                                    return false;
                                                }
                                                return Date.now().valueOf() < currentDate.valueOf()
                                            }}
                                            showToday={false}
                                        />
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
                                        <Input type="textarea" placeholder="请输入描述，最大200个字符" rows={4} maxLength="200" />
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
