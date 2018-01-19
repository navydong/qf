import React from 'react'
import { Form, Row, Col, Input, Cascader, Select } from 'antd'
import { AreaData } from '../../AreaSelector/areaData'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const Option = Select.Option
class MerchantHeader extends React.Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }
    createOptions(){
        const children = [];
        const { passway } = this.props;
        if (!passway) return;
        for (let i = 0; i < passway.length; i++) {
            children.push(<Option key={i} value={passway[i].id}>{passway[i].passwayName}</Option>)
        }
        return children;
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={ this.handleSearch }>
                <Row gutter={16}>
                    <Col span={12} >
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`)(
                                <Input placeholder={`商户名称`} autoComplete="off" maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`linkman`,{
                                rules: [{pattern: /^([a-zA-Z0-9\u4e00-\u9fa5]{1,200})$/, message: '请输入正确姓名'}]
                            })(
                                <Input placeholder={`联系人姓名`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人手机`}>
                            {getFieldDecorator(`lkmphone`,{
                                rules: [{pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确手机号码'}]
                            })(
                                <Input placeholder={`联系人手机`} maxLength="11" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户地址`}>
                            {getFieldDecorator(`region`)(
                                <Cascader options={AreaData} placeholder={"==请选择=="} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`通道`}>
                            {getFieldDecorator(`passwayId`)(
                                <Select
                                    allowClear
                                    placeholder="==请选择=="
                                >
                                    {this.createOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`费率`}>
                            {getFieldDecorator(`rate`)(
                                <Input placeholder={`请输入费率`} addonAfter={<span>%</span>} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



MerchantHeader = Form.create()(MerchantHeader)
export default MerchantHeader
