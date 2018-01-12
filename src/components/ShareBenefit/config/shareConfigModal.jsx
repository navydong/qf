import React, { Component } from 'react'
import { Form, Row, Col, Select } from 'antd'
import axios from 'axios'
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

class ConfigModal extends Component {
    state = {
        scheme: [],
        slove: [],
        service: [],
        merchant: [],
        select: '0',
        organization: []
    }
    componentDidMount() {
        this.selectScheme()
        this.getOrganization()
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            this.props.onSubmit(err, values);
        });
    }
    // 分润方案
    selectScheme() {
        axios.get(`/back/frscheme/schemes`)
            .then((resp) => {
                const scheme = resp.data.rows;
                this.setState({
                    scheme
                })
            })
    }
    getOrganization = () => {
        //受理机构
        function selectService() {
            return axios.get('/back/facilitator/findFacilitators')
        }
        //服务商
        function selectSlove() {
            return axios.get('/back/accepagent/findAccepagents')
        }
        axios.all([selectService(), selectSlove()]).then(axios.spread((service, slove) => {
            const organization = [].concat(service.data.rows, slove.data.rows)
            this.setState({
                service: service.data.rows,
                slove: slove.data.rows,
                organization,
            })
        }))
    }

    handleOrganSelect = (value) => {
        console.log(value)
        let organization = ''
        switch (value) {
            case '0':
                organization = this.state.slove
                break;
            case '1':
                organization = this.state.service
                break;
            default:
                organization = []
        }
        this.props.form.setFieldsValue({ sorgId: '' })
        this.setState({
            select: value,
            organization,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { scheme, organization } = this.state;
        const { tabInfos } = this.props
        const schemeOpts = scheme.map((item, index) => (
            <Option key={item.id}>{item.schemeName}</Option>
        ))
        const organizationOpts = organization.map(organization => {
            let label = organization.orgname || organization.facname || organization.merchantName
            return <Option key={organization.id}>{label}</Option>
        })

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`机构类型`}>
                            {getFieldDecorator(`ptype`, {
                                initialValue: tabInfos.ptype,
                            })(
                                <Select onChange={this.handleOrganSelect}>
                                    <Option key="0">受理机构</Option>
                                    <Option key="1">服务商</Option>
                                    {/* <Option key="2">商户</Option> */}
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`机构名称`}>
                            {getFieldDecorator(`sorgId`, {
                                initialValue: tabInfos.sorgId,
                                rules: [{ required: true, message: '请选择' }]
                            })(
                                <Select>
                                    {organizationOpts}
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeId`, {
                                initialValue: tabInfos.schemeId,
                                rules: [{ required: true, message: '请选择' }]
                            })(
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
