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
//给数据增加key值，key=id
function setKey(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].id
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
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
            values.industryId = values.industryId && values.industryId[values.industryId.length - 1]
            console.log(values.industryId)
            this.props.onSubmit(err, values);
        });
    }

    getIndustry(){
        const { passwayId } = this.props.update;
        axios.get(`/back/industry/industrys?passwayId=${passwayId}`).then((resp) => {
            function d(s) {
                s.forEach(item => {
                item.value = item.id
                item.label = item.industryName
                  if (item.children) {
                           d(item.children)
                        }
                  })
            }
            d(resp.data)
            setKey(resp.data)
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
        }else if( parseInt(value, 10) < parseInt(form.getFieldValue('tradesumLow'), 10)){
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
        }else if( parseInt(value, 10) > parseInt(form.getFieldValue('tradesumHigh'), 10)){
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
      if( parseInt(value, 10) > parseInt(form.getFieldValue('tradetimeHigh'), 10)){
          callback('交易笔数下限不能大于交易笔数上限')
      }else{
          callback()
      }
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { update} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeName`,{
                                initialValue: update.schemeName
                            })(
                                <Input placeholder="分润方案名称" disabled />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`行业类目`}>
                            {getFieldDecorator(`industryId`,{
                                initialValue: update.industryName,
                                rules: [
                                    { required: true, message: '行业类目不能为空' }
                                ]
                            })(
                                <Cascader 
                                    changeOnSelect
                                    options={ this.state.industry } 
                                    placeholder="请输入行业类目"
                                    displayRender={this.displayRender}
                                />
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
                                <Input placeholder="请输如入交易金额下限" maxLength="255" />
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
                                <Input placeholder={`请输入交易笔数下限`} maxLength="23" />
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
                                <Input placeholder={`请输入交易笔数上限`} maxLength="23" />
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
                                <Input placeholder={`请输入费率`} maxLength="22" />
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
