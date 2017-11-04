import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button } from 'antd'
import axios from 'axios'
import '../../../style/base.less'
const FormItem = Form.Item;
const Option = Select.Option;

class TerminalModal extends Component {
    state = {
        merchant: [],
        equip: []
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    componentWillMount(){
        this.selectMerchant()
        this.selectEquip()
    }

    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=1&offset=100`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    selectEquip(){
        axios.get(`/back/device/page?limit=1&offest=100`)
            .then((resp)=>{
                const equip = resp.data.rows;
                this.setState({
                    equip
                })
            })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const { merchant,equip } = this.state
        const merchantOpts = merchant.map((item,index) => (
            <Option key={index} value={item.id}>{item.merchantName}</Option>
        ))
        const equipOpts = equip.map((item,index) => (
            <Option key={index} value={item.id}>{item.deviceName}</Option>
        ))
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备终端名称`}>
                            {getFieldDecorator(`schemeName`,{
                                rules: [{required: true}]
                            })(
                                <Input placeholder='设备终端名称' />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`,{
                                rules:[{required: true}]
                            })(
                                <Select>
                                    {merchantOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备条码`}>
                            {getFieldDecorator(`设备条码`)(
                                <Input placeholder='设备条码' />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备品类`}>
                            {getFieldDecorator(`deviceId`,{
                                rules:[{required: true}]
                            })(
                                <Select>
                                    {equipOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem className='fl' {...formItemLayout} label={`识别码`}>
                            {getFieldDecorator(`idcode`)(
                                <Input placeholder='识别码' />
                            )}
                        </FormItem>
                        <Button className='fl' type="primary" style={{marginLeft: 12}}>生成识别码</Button>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`激活码`}>
                            {getFieldDecorator(`activecode`)(
                                <Input placeholder='激活码' disabled={true} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备备注`}>
                            {getFieldDecorator(`desc`)(
                                <Input placeholder='设备备注' />
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