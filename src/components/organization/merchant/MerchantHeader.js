import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker,Cascader } from 'antd'
import { AreaData } from '../../AreaSelector/areaData'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
class MerchantHeader extends React.Component {
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
            <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                <Row>
                    <Col span={8} >
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`)(
                                <Input placeholder={`商户名称`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`contactName`)(
                                <Input placeholder={`联系人姓名`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`联系人手机`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`商户地址`}>
                            {getFieldDecorator(`region`,{
                                initialValue: ["北京市","北京市","东城区"]
                            })(
                                <Cascader options={AreaData} />
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