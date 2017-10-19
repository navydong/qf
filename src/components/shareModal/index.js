import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
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
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const { getFieldDecorator } = this.props.form;
        const options = (this.props.passway).map((item,index)=>(
            <Option value={item.id} key={index}>{item.passwayName}</Option>
        ))
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeName`)(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`通道信息`}>
                            {getFieldDecorator(`passwayId`)(
                                <Select defalultValue={`passwayId`}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`交易金额下限`}>
                            {getFieldDecorator(`tradesumLow`)(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`交易金额上限`}>
                            {getFieldDecorator(`tradesumHigh`)(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`费率`}>
                            {getFieldDecorator(`rate`)(
                                <Input placeholder={``} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

ShareModal = Form.create()(ShareModal);
export default ShareModal