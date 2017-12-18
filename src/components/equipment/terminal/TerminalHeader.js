import React from 'react'
import { Form, Input, Select, DatePicker } from 'antd'
import axios from 'axios'
import '../../ShareBenefit/scheme_header.less'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 9},
    wrapperCol: { span: 15 },
};
class TerminalHeader extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            merchant: []
        }
    }

    componentWillMount(){
        this.selectMerchant()
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { merchant } = this.state;
        const merchantOpts = merchant.map((item,index) => (
            <Option key={index} value={item.id}>{item.merchantName}</Option>
        ))
        return (
            <Form className="header-form" onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label={`设备终端名称`} className="header-label-left">
                  {getFieldDecorator(`terminalName`)(
                      <Input placeholder={`请输设备终端名称`} maxLength="255" />
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label={`商户名称`} className="header-label-left">
                  {getFieldDecorator(`merchantId`)(
                      <Select>
                          {merchantOpts}
                      </Select>
                  )}
              </FormItem>
            </Form>
        )
    }
}



TerminalHeader = Form.create()(TerminalHeader)
export default TerminalHeader
