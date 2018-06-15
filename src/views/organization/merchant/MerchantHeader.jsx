import React from 'react'
import { Form, Row, Col, Input, Cascader, Select } from 'antd'
import { AreaData } from '@/components/AreaSelector/areaData'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const Option = Select.Option
class MerchantHeader extends React.Component {
    createOptions() {
        const children = [];
        const { passway } = this.props;
        if (!passway) return;
        for (let i = 0; i < passway.length; i++) {
            children.push(<Option key={i} value={passway[i].id}>{passway[i].passwayName}</Option>)
        }
        return children;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItems = [
            {
                id: 'name',
                label: '商户名称',
                content: <Input placeholder={`商户名称`} autoComplete="off" maxLength="255" />
            }, {
                id: 'linkman',
                label: '联系人姓名',
                content: <Input placeholder={`联系人姓名`} maxLength="255" />
            }, {
                id: 'lkmphone',
                label: '联系人手机',
                content: <Input placeholder={`联系人手机`} maxLength="11" />
            }, {
                id: 'region',
                label: '商户地址',
                content: <Cascader options={AreaData} placeholder={"==请选择=="} />
            }, {
                id: 'passwayId',
                label: '通道',
                content: (
                    <Select allowClear placeholder="==请选择==">
                        {this.createOptions()}
                    </Select>
                )
            }, {
                id: 'rate',
                label: '费率',
                content: <Input placeholder={`请输入费率`} addonAfter={<span>%</span>} />
            },
            {
                id: 'porgName',
                label: '服务商',
                content: <Input placeholder="服务商" maxLength="100" />
            }
        ]
        return (
            <Form>
                <Row gutter={16}>
                    {formItems.map(item => {
                        return (
                            <Col span={12} key={item.id}>
                                <FormItem {...formItemLayout} label={item.label}>
                                    {getFieldDecorator(item.id)(
                                        item.content
                                    )}
                                </FormItem>
                            </Col>
                        )
                    })}
                </Row>
            </Form>
        )
    }
}

export default Form.create()(MerchantHeader)
