import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Button, message, Cascader } from 'antd'
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
        xs: { span: 22 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}
function setKey(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].id
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}
class TerminalModal extends Component {
    state = {
        merchant: [],          //上级商户
        equip: [],             //设备品类
        merchantName: '',      //上级商户名称
        idcode: ''             //识别码
    }
    componentWillMount() {
        this.selectMerchant()
        this.selectEquip()
    }
    // 获取识别码
    handleCreateCode = () => {
        axios.get('/back/terminal/activation').then(({ data }) => {
            if (data.rel) {
                this.props.form.setFieldsValue({ idcode: data.msg })
            } else {
                message.error(data.msg)
            }
        })
    }
    // 获取上级商户
    selectMerchant() {
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = this.formCascaderData(resp.data.rows, 'merchantName');
            this.setState({
                merchant
            })
        })
    }
    // 设备品类
    selectEquip() {
        axios.get('/back/device/page').then((resp) => {
            const equip = resp.data.rows;
            this.setState({
                equip
            })
        })
    }
    //上级商户onchange
    handleMerchantName = (value, selectedOptions) => {
        this.props.form.setFieldsValue({
            merchantName: selectedOptions.pop().merchantName
        })
    }
    //级联菜单显示
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }
    /**
* 格式成Cascader组件所需格式
* @param {*} res 
*/
    formCascaderData(res, label) {
        (function d(res) {
            res.forEach(item => {
                item.value = item.id
                item.label = item[label]
                if (item.children) {
                    d(item.children)
                }
            })
        })(res)
        return setKey(res)
    }

    generateFormItem = (formitem) => {
        const { getFieldDecorator } = this.props.form;
        return <Col span={12} key={formitem.key}>
            <FormItem {...formItemLayout} label={formitem.label}>
                {getFieldDecorator(formitem.key, {
                    initialValue: formitem.initialValue,
                    rules: formitem.rules
                })(formitem.element)}
            </FormItem>
        </Col>
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { merchant } = this.state;
        const { tabInfos, isUpdata } = this.props;
        const formdata = [
            {
                key: 'terminalName',
                label: '设备终端名称',
                initialValue: tabInfos.terminalName,
                rules: [{ required: true, whitespace: true, message: '请输入设备终端名称' }],
                element: <Input placeholder="设备终端名称" />
            }, {
                key: 'merchantId',
                label: '上级商户',
                initialValue: '',
                rules: [{ required: !isUpdata, message: '请选择上级商户' }],
                element: <Cascader allowClear showSearch changeOnSelect
                    options={merchant}
                    displayRender={this.displayRender}
                    onChange={this.handleMerchantName}
                    placeholder={tabInfos.merchantName || "请选择"}
                />
            }, {
                key: 'no',
                label: '设备条码',
                initialValue: tabInfos.no,
                rules: [{ pattern: /^[a-zA-Z0-9_-]{0,}$/, message: '请输入正确设备条码' }],
                element: <Input placeholder="设备条码" />
            }, {
                key: 'deviceId',
                label: '设备品类',
                initialValue: tabInfos.deviceId,
                rules: [{ required: true, whitespace: true, message: '请输入设备品类名称' }],
                element: <Select allowClear placeholder="请选择" >
                    {this.state.equip.map(item => (
                        <Option key={item.id}>{item.deviceName}</Option>
                    ))}
                </Select>
            }, {
                key: 'activecode',
                label: '激活码',
                initialValue: tabInfos.activecode,
                rules: [],
                element: <Input placeholder='激活码' disabled />
            }, {
                key: 'desc',
                label: '设备备注',
                initialValue: tabInfos.desc,
                rules: [],
                element: <Input placeholder="设备备注，最大200个字符" maxLength="200" />
            }, {
                key: 'idcode',
                label: '识别码',
                initialValue: tabInfos.idcode,
                rules: [],
                element: <Input readOnly placeholder="识别码" addonAfter={<Button size="small" onClick={this.handleCreateCode}>生成识别码</Button>} />
            }
        ]
        return (
            <Form>
                <Row gutter={12}>
                    {formdata.map(item => {
                        return this.generateFormItem(item)
                    })}
                </Row>
                {getFieldDecorator(`merchantName`)(<Input type="hidden" />)}
            </Form>
        )
    }
}

export default Form.create()(TerminalModal);
