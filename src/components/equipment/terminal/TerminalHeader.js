import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
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
        axios.get(`/back/merchantinfoController/page?limit=1&offset=100`).then((resp) => {
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
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`设备终端名称`}>
                            {getFieldDecorator(`terminalName`)(
                                <Input placeholder={`请输设备终端名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantId`)(
                                <Select>
                                    {merchantOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



TerminalHeader = Form.create()(TerminalHeader)
export default TerminalHeader