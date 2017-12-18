import React, { Component } from 'react'
import axios from 'axios'
import { Form,Input, Select,Col,Row,Cascader } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}

function d(s) {
        s.forEach(item => {
        item.value = item.id
        item.label = item.industryName
          if (item.children) {
                   d(item.children)
                }
          })
      }

class DetailModal extends Component {
    state = {
      industry: []
    }
    componentWillMount(){
      this.getIndustry()
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    getIndustry(){
      console.log('aaa')
        axios.get(`/back/industry/industrys`).then((resp) => {
            d(resp.data)
            const industry = resp.data || [];
            this.setState({
                industry
            })
        })
    }

    checkTradeSumHigh = (rule,value,callback) => {
        const form = this.props.form;
        let reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if(!reg.test(value)){
            callback('请输入正确数值')
        }else if( parseInt(value) < parseInt(form.getFieldValue('tradesumLow'))){
            callback('交易金额上限不能小于交易金额下限')
        }else{
            if(!/^-?(0|[1-9][0-9]*)(\.[0-9]{0,6})?$/.test(value)){
                callback('小数点不能大于六位')
            }
            callback()
        }
    }

    checkTradeSumLow = (rule,value,callback) => {
        const form = this.props.form;
        let reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if(!reg.test(value)){
            callback('请输入正确数值')
        }else if( parseInt(value) > parseInt(form.getFieldValue('tradesumHigh'))){
            callback('交易金额下限不能大于交易金额上限')
        }else{
            if(!/^-?(0|[1-9][0-9]*)(\.[0-9]{0,6})?$/.test(value)){
                callback('小数点不能大于六位')
            }
            callback()
        }
    }

    checkRate = (rule,value,callback) => {
        let reg = isNaN(value)
        if(reg){
            callback('请输入正确费率')
        }else{
            callback()
        }
    }

    checkTradeTimeHigh = (rule,value,callback) => {
      const form = this.props.form
      if( parseInt(value) < parseInt(form.getFieldValue('tradetimeLow'))){
          callback('交易笔数上限不能小于交易笔数下限')
      }else{
          callback()
      }
    }

    checkTradeTimeSlow = (rule,value,callback) => {
      const form = this.props.form
      if( parseInt(value) > parseInt(form.getFieldValue('tradetimeHigh'))){
          callback('交易笔数下限不能大于交易笔数上限')
      }else{
          callback()
      }
    }

    render() {
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
                                initialValue: update.schemeId
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
                                <Cascader options={ this.state.industry } />
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
                                    { required: true, whitespace: true, message: '交易金额下限不能为空' },
                                    { validator: this.checkTradeSumLow }
                                ],
                                validateFirst: true,
                            })(
                                <Input placeholder={``} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易金额上限`} hasFeedback>
                            {getFieldDecorator(`tradesumHigh`,{
                                initialValue: update.tradesumHigh,
                                rules: [
                                    { required: true, whitespace: true ,message: '交易金额上限不能为空'},
                                    { validator: this.checkTradeSumHigh }
                                ],
                                validateFirst: true,
                            })(
                                <Input placeholder={`请输入交易金额上限`} maxLength="255"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易笔数下限`} hasFeedback>
                            {getFieldDecorator(`tradetimeLow`,{
                                initialValue: update.tradetimeLow,
                                rules: [
                                  { validator: this.checkTradeTimeSlow },
                                  { pattern: /^\d+$/, message: '请输入正确字符' },
                                ],
                                validateFirst: true,
                            })(
                                <Input placeholder={`请输入交易笔数下限`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`交易笔数上限`} hasFeedback>
                            {getFieldDecorator(`tradetimeHigh`,{
                                initialValue: update.tradetimeHigh,
                                rules: [
                                  { validator: this.checkTradeTimeHigh },
                                  { pattern: /^\d+$/, message: '请输入正确字符' },
                                ],
                                validateFirst: true,
                            })(
                                <Input placeholder={`请输入交易笔数上限`} maxLength="255"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`费率`} hasFeedback>
                            {getFieldDecorator(`rate`,{
                                initialValue: update.rate,
                                rules: [
                                    { required: true, whitespace: true ,message: '费率不能为空'},
                                    { validator: this.checkRate }
                                ],
                                validateFirst: true,
                            })(
                                <Input placeholder={`请输入费率`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <span style={{lineHeight: '33px',marginLeft: -28}}>%</span>
                    </Col>
                </Row>
            </Form>
        )
    }
}

DetailModal = Form.create()(DetailModal);
export default DetailModal
