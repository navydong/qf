import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button } from 'antd'
import axios from 'axios'
import Hex_md5 from '../../../utils/md5'
import '../../../style/base.less'
const FormItem = Form.Item;
const Option = Select.Option;

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

    componentWillMount(){
        this.selectMerchant()
        this.selectEquip()

    }
    handleCreateCode = () => {
      const { terminalName,merchantId,deviceId,No } = this.state;
       const idcode = Hex_md5(terminalName + merchantId + deviceId + No)
        console.log(idcode)
        this.setState({
            idcode
        })
    }

    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    selectEquip(){
        axios.get(`/back/device/page?limit=100&offset=1`)
            .then((resp)=>{
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
        console.log(value)
        const merchantId = value;
        this.setState({
            merchantId
        })
    }

    handledeviceId = (value) => {
        console.log(value)
        const deviceId = value;
        this.setState({
            deviceId
        })
    }

    handleNo = (e) =>{
        console.log(e.target.value)
        const No = e.target.value;
        this.setState({
            No
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
                            {getFieldDecorator(`terminalName`,{
                                rules: [{required: true}]
                            })(
                                <Input placeholder='设备终端名称' onBlur={this.handleTerminalName}/>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantId`,{
                                rules:[{required: true}]
                            })(
                                <Select onChange={this.handleMerchantName}>
                                    {merchantOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备条码`}>
                            {getFieldDecorator(`no`)(
                                <Input placeholder='' onBlur={this.handleNo}/>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`设备品类`}>
                            {getFieldDecorator(`deviceId`,{
                                rules:[{required: true}]
                            })(
                                <Select onChange={this.handledeviceId}>
                                    {equipOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem className='fl' {...formItemLayout} label={`识别码`}>
                            {getFieldDecorator(`idcode`,{
                                initialValue: this.state.idcode
                            })(
                                <Input placeholder='识别码' disabled={true}/>
                            )}
                        </FormItem>
                        <Button className='fl' type="primary" style={{marginLeft: 12}} onClick={this.handleCreateCode}>生成识别码</Button>
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