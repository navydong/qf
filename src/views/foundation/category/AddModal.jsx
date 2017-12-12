import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, Cascader, Select } from 'antd'
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
let flag = 0;
class AddModal extends React.Component {
    constructor() {
        super()
        this.state = {
            category: [],
            passway: []
        }
    }
    componentDidMount() {
        this.selectDetail()
        axios.get('/back/passway/page').then(res => res.data).then(res => {
            this.setState((prevState) => ({
                passway: prevState.passway.concat(res.rows)
            }
            ))
        })
    }
    componentWillReceiveProps(nextProp) {
        const id = nextProp.modalProps.item.id
        if (id && id !== flag) {
            flag = id
            this.selectDetail(id)
        }
        console.log(this.props.modalProps.isAddModal)
        if (id === undefined) {
            this.selectDetail()
        }

        
        // console.log(nextProp.modalProps.item.industryName)
        // function d(s) {
        //     s.forEach(item => {
        //         item.value = item.id
        //         item.label = item.industryName
        //         item.disable = item.industryName === nextProp.modalProps.item.industryName
        //         if (item.children) {
        //             d(item.children)
        //         }
        //     })
        // }
        // this.setState((prevState)=>{
        //     d(prevState.category)
        //     // console.log(prevState.category)
        //     return {
        //         category: prevState.category
        //     }
        // })
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
            values.pid = values.pid && values.pid[values.pid.length - 1]
            this.props.onOk(values, () => {
                this.selectDetail()
            })
        })
    }
    selectDetail(id) {
        axios.get('/back/industry/industrys', {
            params: {
                id
            }
        }).then(res => res.data).then((res) => {
            function d(s) {
                s.forEach(item => {
                    item.value = item.id
                    item.label = item.industryName
                    // item.disable = true
                    if (item.children) {
                        d(item.children)
                    }
                })
            }
            d(res)
            this.setState({
                category: res
            })
        })
    }

    onCancel = (e) => {
        this.props.modalProps.onCancel()
        this.props.form.resetFields();
    }
    onChange = (value, selectedOptions) => {
        // console.log(value, selectedOptions)
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
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
                        <Col md={12}>
                            <FormItem label="行业名称" {...formItemLayout}>
                                {getFieldDecorator('industryName', {
                                    initialValue: modalOpts.item.industryName,
                                    rules: [{ required: true, message: '请输入行业名称' }],
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="上级行业" {...formItemLayout}>
                                {getFieldDecorator('pid', {
                                    // initialValue: modalOpts.item.pid,
                                })(
                                    <Cascader
                                        placeholder={modalOpts.item.parentName || ''}
                                        options={this.state.category}
                                        onChange={this.onChange}
                                        changeOnSelect
                                        displayRender={this.displayRender}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="结算周期T+" {...formItemLayout}>
                                {getFieldDecorator('cycle', {
                                    initialValue: modalOpts.item.cycle,
                                    rules: [
                                        { required: true, message: '请输入结算周期' },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (isNaN(value)) {
                                                    callback('请输入正确结算周期')
                                                }
                                                callback()
                                            }
                                        }
                                    ],
                                    validateFirst: true,
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="通道" {...formItemLayout}>
                                {getFieldDecorator("passwayId", {
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {this.state.passway.map(i => (
                                            <Option key={i.id}>{i.passwayName}</Option>
                                        ))}
                                    </Select>
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