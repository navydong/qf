import React from 'react'
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Cascader, Select } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 9 },
        lg: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 15 }
    },
}
class AddForm extends React.Component {
    state = {
        passway: [],
        pidDisable: true
    }
    componentDidMount() {
        axios.get('/back/passway/page')
            .then(res => res.data)
            .then(res => {
                this.setState(prevState => ({
                    passway: prevState.passway.concat(res.rows)
                }))
            })
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }
    /**
     * 通道改变回调
     */
    passwayChange = (value) => {
        this.props.selectDetail(undefined, value)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const modalOpts = {
            item: this.props.item || {},
            ...this.props.modalProps,
        }
        return (
            <Form>
                <Row>
                    <Col md={12}>
                        <FormItem label="行业名称" {...formItemLayout}>
                            {getFieldDecorator('industryName', {
                                initialValue: modalOpts.item.industryName,
                                rules: [{ required: true, whitespace: true, message: '请输入行业名称' }],
                            })(
                                <Input placeholder="请输入行业名称" maxLength="255" autoComplete="off" />
                                )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem label="通道" {...formItemLayout}>
                            {getFieldDecorator("passwayId", {
                                initialValue: modalOpts.item.passwayId,
                                rules: [{ required: true, whitespace: true, message: '请选择' }],
                            })(
                                <Select placeholder="请选择" allowClear onChange={this.passwayChange}>
                                    {this.state.passway.map(i => (
                                        <Option key={i.id}>{i.passwayName}</Option>
                                    ))}
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem label="结算周期T+" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('cycle', {
                                initialValue: modalOpts.item.cycle,
                                rules: [
                                    { required: true, message: '请输入结算周期' },
                                    { pattern: /^\d+$/, message: '请输入正确结算周期' }
                                ],
                                validateFirst: true,
                            })(
                                <Input maxLength="255" placeholder="请输入结算周期" />
                                )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem label="上级行业" {...formItemLayout}>
                            {getFieldDecorator('pid', {
                                // initialValue: modalOpts.item.pid,
                            })(
                                <Cascader
                                    placeholder={modalOpts.item.parentName || '无上级行业则不选择'}
                                    options={this.props.category}
                                    changeOnSelect
                                    displayRender={this.displayRender}
                                />
                                )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

AddForm.propTypes = {
    item: PropTypes.object
}

export default Form.create()(AddForm)