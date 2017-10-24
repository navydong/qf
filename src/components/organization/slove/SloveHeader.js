import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class SloveHeader extends React.Component {
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
                        <FormItem {...formItemLayout} label={`受理机构名称`}>
                            {getFieldDecorator(`orgname`)(
                                <Input placeholder={`请输入受理机构名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`受理机构简称`}>
                            {getFieldDecorator(`orgstname`)(
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



SloveHeader = Form.create()(SloveHeader)
export default SloveHeader