import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class MerchantModal extends React.Component {
    constructor(props){
        super(props)
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="ant-advanced-search-form" onSubmit={ this.handleSubmit }>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`)(
                                <Input placeholder={`商户简称`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`contactName`)(
                                <Input placeholder={`联系人姓名`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户详细地址`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户所在省`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户所在市`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户所在区`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`业务员`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人手机`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人邮箱`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



MerchantModal = Form.create()(MerchantModal)
export default MerchantModal