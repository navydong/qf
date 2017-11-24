import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, DatePicker, Select } from 'antd'
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
            category: [],
        }
    }
    componentDidMount() {
        this.selectDetail()
    }


    componentDidUpdate() {
        console.log(this.props.item)
        if (JSON.stringify(this.props.modalProps.item) !== '{}') {
            this.props.form.resetFields();
        }
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
    selectDetail() {
        axios.get('/back/industry/industrys?limit=100&offset=1').then((resp) => {
            const category = resp.data.rows || [];
            this.setState({
                category
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { category } = this.state;
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
        }
        const categoryOpts = category.map((item, index) => (
            <Option key={item.id}>{item.industryName}</Option>
        ))
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
                                    initialValue: modalOpts.item.pid,
                                    // rules: [{ required: true, message: '请选择上级行业' }],
                                })(
                                    <Select>
                                        {categoryOpts}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem label="结算周期T+" {...formItemLayout}>
                                {getFieldDecorator('cycle', {
                                    initialValue: modalOpts.item.cycle,
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