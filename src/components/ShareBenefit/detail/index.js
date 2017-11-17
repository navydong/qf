import React, { Component } from 'react'
import { Form,Input, Select,Col,Row } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class DetailModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    checkTradeSumHigh = (rule,value,callback) => {
        const form = this.props.form;
        let reg = /^[1-9]\d*$/;
        if(!reg.test(value)){
            callback('请输入大于0的数字')
        }else if( value < form.getFieldValue('tradesumLow')){
            callback('交易金额上限不能小于交易金额上限')
        }else{
            callback()
        }
    }

    checkTradeSumLow = (rule,value,callback) => {
        let reg = /^[1-9]\d*$/;
        if(!reg.test(value)){
            callback('请输入大于0的数字')
        }else{
            callback()
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        const {frscheme, update, industry} = this.props
        console.log(update)
        const frshemeOpts = frscheme&& frscheme.length > 0 ? frscheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        )): []

        const industryOpts = industry && industry.length > 0 ? industry.map((item,index) => (
            <Option key={index} value={item.id}>{item.industryName}</Option>
        )): []
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeId`,{
                                initialValue: update.schemeName
                            })(
                                <Select>
                                    {frshemeOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`行业类目`}>
                            {getFieldDecorator(`industryId`,{
                                initialValue: update.industryName
                            })(
                                <Select>
                                    {industryOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易金额下限`} hasFeedback>
                            {getFieldDecorator(`tradesumLow`,{
                                initialValue: update.tradesumLow,
                                rules: [
                                    { required: true, message: '交易金额下限不能为空' },
                                    { validator: this.checkTradeSumLow }
                                ]
                            })(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易金额上限`} hasFeedback>
                            {getFieldDecorator(`tradesumHigh`,{
                                initialValue: update.tradetimeHigh,
                                rules: [
                                    { required: true ,message: '交易金额上限不能为空'},
                                    { validator: this.checkTradeSumHigh }
                                ]
                            })(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易笔数下限`} hasFeedback>
                            {getFieldDecorator(`tradetimeLow`,{
                                initialValue: update.tradesumLow
                            })(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易笔数上限`}>
                            {getFieldDecorator(`tradetimeHigh`,{
                                initialValue: update.tradetimeHigh
                            })(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`费率`}>
                            {getFieldDecorator(`rate`,{
                                initialValue: update.rate
                            })(
                                <Input placeholder={`请输入费率`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <span style={{lineHeight: '33px',marginLeft: '8'}}>%</span>
                    </Col>
                </Row>
            </Form>
        )
    }
}

DetailModal = Form.create()(DetailModal);
export default DetailModal