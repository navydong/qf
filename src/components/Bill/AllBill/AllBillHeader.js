import React from 'react'
import { Form, Row, Col, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
class AllBillHeader extends React.Component {
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
        const options = passway && passway.length > 0 ? passway.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        )) : '';
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`支付通道`}>
                            {getFieldDecorator(`tradetype`,{
                                rules: [{ required: true, message: '请输入支付通道', }]
                            })(
                                <Select>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`开始日期`}>
                            {getFieldDecorator(`startTime`,{
                                rules: [{ required: true, message: '请输入开始日期', }]
                            })(
                               <DatePicker/>  
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`结束日期`}>
                            {getFieldDecorator(`endTime`,{
                                rules: [{ required: true, message: '请输入结束日期', }]
                            })(
                                   <DatePicker/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

AllBillHeader = Form.create()(AllBillHeader)
export default AllBillHeader