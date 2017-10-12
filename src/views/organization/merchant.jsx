import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col, Input, Button,  Card } from 'antd'
import AreaSelector from '../../components/AreaSelector'
import { areaData } from '../../components/AreaSelector/areaData'
import InputForm from '../../components/InputForm'
const FormItem = Form.Item;

const InputFormMerchantProps = [
    {
        label: "商户名称",
        placeholder: '商户名称',
        getFile: "merchantName",
        isSelect: false
    },
    {
        label: "联系人姓名",
        placeholder: '商户名称',
        getFile: "contactName",
        isSelect: false
    },
    {
        label: "联系人手机",
        placeholder: '联系人手机',
        getFile: "contactPhone",
        isSelect: false
    }
]
class Merchant extends React.Component {
    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log('Received values of form',values)
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        return (
            <div className="merchant-wrapper">
                <BreadcrumbCustom first="机构信息" second="商户" />
                <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                    <Card>
                        <InputForm data={InputFormMerchantProps}/>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`地址`}>
                                    {getFieldDecorator('dataOrigin')(
                                        <AreaSelector data={areaData}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col offset={16}>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        )
    }
}
Merchant = Form.create()(Merchant)
export default Merchant