import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col, Input, Button, Icon } from 'antd'
const FormItem = Form.Item;

class Merchant extends React.Component {
    state = {
        expand: false,
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(( err,values ) => {
            console.log('Received values of form', values)
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
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem { ...formItemLayout } label={`商户名称`}>
                                {getFieldDecorator('merchantName')(
                                    <Input  placeholder="商户名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={`联系人姓名`}>
                                {getFieldDecorator('userName')(
                                    <Input placeholder="联系人姓名" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={`联系人手机`}>
                                {getFieldDecorator('')(
                                    <Input placeholder="联系人姓名" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
Merchant = Form.create()(Merchant)
export default Merchant