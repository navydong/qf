import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col, Input, Button,  Card } from 'antd'
import AreaSelector from '../../components/AreaSelector'
import { areaData } from '../../components/AreaSelector/areaData'
const FormItem = Form.Item;

class Merchant extends React.Component {
    state = {
        expand: false,
    };
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
                        <Row gutter={16}>
                            <Col span={8}>
                                <FormItem { ...formItemLayout } label={`商户名称`}>
                                    {getFieldDecorator('merchantName')(
                                        <Input  placeholder="商户名称" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人姓名`}>
                                    {getFieldDecorator('contactName')(
                                        <Input placeholder="联系人姓名" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人手机`}>
                                    {getFieldDecorator('contactPhone')(
                                        <Input placeholder="联系人手机" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <AreaSelector data={areaData}/>
                        <Row gutter={16}>
                            <Col offset={22}>
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