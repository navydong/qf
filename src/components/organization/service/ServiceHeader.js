import React from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class ServiceHeader extends React.Component {
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
        const {passway} = this.props
        const options = passway.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        ))
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`服务商名称`}>
                            {getFieldDecorator(`facname`)(
                                <Input placeholder={`请输入服务商名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`服务商简称`}>
                            {getFieldDecorator(`facstname`)(
                                <Input placeholder={`请输入受理机构简称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`passwayIds`)(
                                <Select>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



ServiceHeader = Form.create()(ServiceHeader)
export default ServiceHeader