import React, { Component } from 'react'
import { Form,Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class ShareModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        const {frscheme, update, industry} = this.props
        console.log(update)
        const frshemeOpts = frscheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        ))

        const industryOpts = industry.map((item,index) => (
            <Option key={index} value={item.id}>{item.industryName}</Option>
        ))
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label={`分润方案名称`}>
                    {getFieldDecorator(`schemeId`,{
                        initialValue: update.schemeName
                    })(
                        <Select>
                            {frshemeOpts}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`行业类目`}>
                    {getFieldDecorator(`industryId`,{
                        initialValue: update.industryName
                    })(
                        <Select>
                            {industryOpts}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`交易金额下限`}>
                    {getFieldDecorator(`tradesumLow`,{
                        initialValue: update.tradesumLow
                    })(
                        <Input placeholder={``} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`交易金额上限`}>
                    {getFieldDecorator(`tradesumHigh`,{
                        initialValue: update.tradetimeHigh
                    })(
                        <Input placeholder={``} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`交易笔数下限`}>
                    {getFieldDecorator(`tradetimeLow`,{
                        initialValue: update.tradesumLow
                    })(
                        <Input placeholder={``} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`交易笔数上限`}>
                    {getFieldDecorator(`tradetimeHigh`,{
                        initialValue: update.tradetimeHigh
                    })(
                        <Input placeholder={``} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={`费率`}>
                    {getFieldDecorator(`rate`,{
                        initialValue: update.rate
                    })(
                        <Input placeholder={`请输入费率`} />
                    )}
                </FormItem>
            </Form>
        )
    }
}

ShareModal = Form.create()(ShareModal);
export default ShareModal