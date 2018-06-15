import React, { Component } from 'react'
import { Form, Row, Col, Select, Cascader } from 'antd'
import axios from 'axios'

import { setKey } from '@/utils/setkey'

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
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }

    //格式成Cascader组件所需格式
    formCascaderData(res, label) {
        if (res.length < 1) {
            return res
        }
        (function d(s) {
            s.forEach(item => {
                console.log(item)
                item.value = item.id
                item.label = item.orgname || item.facname || item.merchantName
                if (item.children&& item.children.length > 0) {
                    d(item.children)
                }else{
                    delete item.children
                }
            })
        })(res)
        return res
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
        //服务商
        function selectService() {
            return axios.get('/back/facilitator/getfac')
        }
        //受理机构
        function selectSlove() {
            return axios.get('/back/accepagent/getacc')
        }
        axios.all([selectService(), selectSlove()]).then(axios.spread((serviceData, sloveData) => {
            const service = serviceData.data.rows || [];
            const slove = sloveData.data.rows || [];
            const organization = [].concat(service, slove)
            this.setState({
                service: this.formCascaderData(service),
                slove: this.formCascaderData(slove),
                organization: this.formCascaderData(organization),
            })
        }))
    }

    handleOrganSelect = (value) => {
        // console.log(value)
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
        const { organization } = this.state;
        const { tabInfos, scheme } = this.props
        const schemeOpts = scheme.map((item, index) => (
            <Option key={item.id}>{item.schemeName}</Option>
        ))
        // const organizationOpts = organization.map(organization => {
        //     // 受理机构或服务商可能为空
        //     if (!organization) return null
        //     let label = organization.orgname || organization.facname || organization.merchantName
        //     return <Option key={organization.id}>{label}</Option>
        // })
        return (
            <Form>
                <Row>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`机构类型`}>
                            {getFieldDecorator(`ptype`, {
                                initialValue: tabInfos.ptype,
                            })(
                                <Select
                                    onChange={this.handleOrganSelect}
                                    placeholder="请选择"
                                    getPopupContainer={() => document.querySelector('.vertical-center-modal')}
                                >
                                    <Option key="0">受理机构</Option>
                                    <Option key="1">服务商</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`机构名称`}>
                            {getFieldDecorator(`sorgId`, {
                                // initialValue: tabInfos.sorgId,
                                rules: [{ required: true, message: '请选择' }]
                            })(
                                // <Select placeholder="请选择">
                                //     {organizationOpts}
                                // </Select>
                                <Cascader
                                    placeholder={tabInfos.sName || '请选择'}
                                    allowClear
                                    showSearch
                                    changeOnSelect
                                    displayRender={this.displayRender}
                                    options={organization}
                                    getPopupContainer={() => document.querySelector('.vertical-center-modal')}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeId`, {
                                initialValue: tabInfos.schemeId,
                                rules: [{ required: true, message: '请选择' }]
                            })(
                                <Select
                                    placeholder="请选择"
                                    getPopupContainer={() => document.querySelector('.vertical-center-modal')}
                                >
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
