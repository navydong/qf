import React, { Component } from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
       span: 16
    },
}
class ProgramModal extends Component {
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const options = this.props.options.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        ));

        const {tabInfos} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`分润方案名称`}>
                            {getFieldDecorator(`schemeName`,{
                                initialValue: tabInfos.schemeName || '',
                                rules: [{ required: true, whitespace: true, message: '请输入分润方案名称' }]
                            })(
                                <Input placeholder="请输入" maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`通道信息`}>
                            {getFieldDecorator(`passwayId`,{
                                initialValue: tabInfos.passwayId,
                                rules: [{ required: true, whitespace: true, message: '请选择通道信息' }]
                            })(
                                <Select placeholder="请选择" allowClear>
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

ProgramModal = Form.create()(ProgramModal);
export default ProgramModal
