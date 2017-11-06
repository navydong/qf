import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;

class ConfigModal extends Component {
    state = {
        scheme: [],
        slove: [],
        service: [],
        merchant: [],
        select: '0'
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            this.props.onSubmit(err, values);
        });
    }
    componentWillMount(){
        this.selectScheme()
        this.selectService()
        this.selectSlove()
        this.selectMerchant()
    }
    selectScheme(){
        axios.get(`/back/frscheme/schemes?offset=1&limit=100`)
            .then((resp)=>{
                const scheme = resp.data.rows;
                this.setState({
                    scheme
                })
            })
    }
    selectService(){
        axios.get(`/back/facilitator/findFacilitators?offset=1&limit=100`)
            .then((resp)=>{
                const service = resp.data.rows;
                this.setState({
                    service
                })
            })
    }

    selectSlove(){
        axios.get('/back/accepagent/findAccepagents?offset=1&limit=100')
            .then((resp) => {
                const slove = resp.data.rows;
                this.setState({
                    slove
                })
            })
    }

    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=1&offset=100`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    handleOrganSelect = (value) => {
        console.log(value)
        this.setState({
            select: value
        })

    }

    selectMenue = (value) => {
        const { slove,service,merchant, select } = this.state;
        console.log(value)
        const sloveOpts = slove.map((item,index) => (
            <Option key={index} value={item.id}>{item.orgname}</Option>
        ))

        const serviceOpts = service.map((item,index) => (
            <Option key={index} value={item.id}>{item.facname}</Option>
        ))

        const merchantOpts = merchant.map((item,index) => (
            <Option key={index} value={item.id}>{item.merchantName}</Option>
        ))

        if( select === '0' ){
            return sloveOpts
        }

        if( select === '1' ){
            return serviceOpts
        }

        if( select ==='2' ){
            return merchantOpts
        }

    }

    render() {
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const { getFieldDecorator } = this.props.form;
        const { scheme } = this.state;
        const schemeOpts = scheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        ))

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`机构类型`}>
                            {getFieldDecorator(`ptype`)(
                                <Select onChange={this.handleOrganSelect}>
                                    <Option vlaue="0" key={0}>受理机构</Option>
                                    <Option vlaue="1" key={1}>服务机构</Option>
                                    <Option vlaue="2" key={2}>商户</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`机构名称`}>
                            {getFieldDecorator(`sorgId`)(
                                <Select>
                                    {this.selectMenue()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeId`)(
                                <Select>
                                    {schemeOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

ConfigModal = Form.create()(ConfigModal);
export default ConfigModal