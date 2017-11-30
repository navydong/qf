import React from 'react'
import { Form, Select } from 'antd'
import '../scheme_header.less'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
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
        const {frscheme,industry} = this.props
        const frshemeOpts = frscheme && frscheme.length > 0 ? frscheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        )): [];
        const industryOpts = industry && industry.length > 0 ? industry.map((item,index) => (
            <Option key={index} value={item.id}>{item.industryName}</Option>
        )): [];
        return (
            <Form className="header-form" onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label={`分润方案`} className="header-label-left">
                    {getFieldDecorator(`schemeId`)(
                        <Select>
                            {frshemeOpts}
                        </Select>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label={`行业类目`} className="header-label-right">
                    {getFieldDecorator(`industryId`)(
                        <Select>
                            {industryOpts}
                        </Select>
                    )}
                </FormItem>
            </Form>
        )
    }
}

SloveHeader = Form.create()(SloveHeader)
export default SloveHeader
