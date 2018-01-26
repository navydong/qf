import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button, message } from 'antd'
import axios from 'axios'
import '../../../style/base.less'
const FormItem = Form.Item;
const Option = Select.Option;
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
class TerminalModal extends Component {
    state = {
        merchant: [],
        equip: [],
        terminalName: '',
        merchantId: '',
        deviceId: '',
        No: '',
        idcode: ''
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    componentWillMount() {
        this.selectMerchant()
        this.selectEquip()

    }
    handleCreateCode = () => {
        axios.get('/back/terminal/activation').then(({ data }) => {
            if (data.rel) {
                this.props.form.setFieldsValue({ idcode: data.msg })
            } else {
                message.error(data.msg)
            }
        })
    }

    selectMerchant() {
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    selectEquip() {
        axios.get('/back/device/page').then((resp) => {
            const equip = resp.data.rows;
            this.setState({
                equip
            })
        })
    }

    handleTerminalName = (e) => {
        console.log(e.target.value)
        const terminalName = e.target.value;
        this.setState({
            terminalName
        })
    }

    handleMerchantName = (value) => {
        const merchantId = value;
        this.setState({
            merchantId
        })
    }

    handledeviceId = (value) => {
        const deviceId = value;
        this.setState({
            deviceId
        })
    }

    handleNo = (e) => {
        const No = e.target.value;
        this.setState({
            No
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { merchant } = this.state;
        const { tabInfos } = this.props;
        const merchantOpts = merchant.map((item, index) => (
            <Option key={index} value={item.id}>{item.merchantName}</Option>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备终端名称`}>
                            {getFieldDecorator(`terminalName`, {
                                initialValue: tabInfos.terminalName,
                                rules: [{ required: true, whitespace: true, message: '请输入设备终端名称' }]
                            })(
                                <Input placeholder="设备终端名称" onBlur={this.handleTerminalName} maxLength="255" />
                                )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantId`, {
                                initialValue: tabInfos.merchantId,
                                rules: [{ required: true, whitespace: true, message: '请输入商户名称' }]
                            })(
                                <Select
                                    allowClear
                                    placeholder="请选择"
                                    onChange={this.handleMerchantName}
                                >
                                    {merchantOpts}
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备条码`}>
                            {getFieldDecorator(`no`, {
                                initialValue: tabInfos.no,
                                rules: [{ pattern: /^[a-zA-Z0-9_-]{0,}$/, message: '请输入正确设备条码' }]
                            })(
                                <Input placeholder="设备条码" onBlur={this.handleNo} maxLength="255" />
                                )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备品类`}>
                            {getFieldDecorator(`deviceId`, {
                                initialValue: tabInfos.deviceId,
                                rules: [{ required: true, whitespace: true, message: '请输入设备品类名称' }]
                            })(
                                <Select
                                    allowClear
                                    placeholder="请选择"
                                    onChange={this.handledeviceId}
                                >
                                    {this.state.equip.map(item => (
                                        <Option key={item.id}>{item.deviceName}</Option>
                                    ))}
                                </Select>
                                )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`激活码`}>
                            {getFieldDecorator(`activecode`, {
                                initialValue: tabInfos.activecode,
                            })(
                                <Input placeholder='激活码' disabled={true} maxLength="255" />
                                )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备备注`}>
                            {getFieldDecorator(`desc`, {
                                initialValue: tabInfos.desc,
                            })(
                                <Input placeholder="设备备注，最大200个字符" maxLength="200" />
                                )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`识别码`}>
                            {getFieldDecorator(`idcode`, {
                                initialValue: tabInfos.idcode
                            })(
                                <Input
                                    readOnly
                                    placeholder="识别码"
                                    addonAfter={<Button size="small" onClick={this.handleCreateCode}>生成识别码</Button>}
                                />
                                )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

TerminalModal = Form.create()(TerminalModal);
export default TerminalModal
