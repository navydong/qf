import React from 'react'
import { Row, Col, Form, Input, Button, Select } from 'antd'

import './searchbox.less'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 22 },
        sm: { span: 6 },
    },
};

class SearchBox extends React.Component {
    formSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err) return
            this.props.search(values)
            // console.log('Received values of form: ', values);
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box" >
                <Form className="ant-advanced-search-form" onSubmit={this.formSubmit} >
                    <Row gutter={40} >
                        <Col span={7} >
                            <FormItem label="手机号码" >
                                {getFieldDecorator('mobile')(
                                    <Input placeholder="手机号码" />
                                )}
                            </FormItem>

                        </Col>
                        <Col span={7} >
                            <FormItem label="卡号" >
                                {getFieldDecorator('code')(
                                    <Input placeholder="卡号" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7} >
                            <FormItem label="状态" >
                                {getFieldDecorator('status')(
                                    <Select>
                                        <Option value={'1'} >1</Option>
                                        <Option value={'2'} >2</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={3} style={{ textAlign: 'right' }} style={{lineHeight: '40px'}} >
                            <Button type="primary" htmlType="submit" className="btn-search"  >搜索</Button>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col md={24} style={{ textAlign: 'right' }} >
                            <Button type="primary" htmlType="submit" >搜索</Button>
                        </Col>
                    </Row> */}
                </Form>
            </div>)
    }
}

export default Form.create()(SearchBox)    