import React from 'react'
import { Row, Col, Form, Cascader, Button } from 'antd'
import axios from 'axios'
import { AreaData } from '../../../components/AreaSelector/areaData'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

class SearchBox extends React.Component {
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.search(values)
        })
    }
    onChange = (value, selectedOptions) => {
        //console.log(value, selectedOptions)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row gutter={40}>
                    <Col span={24}>
                        <FormItem {...formItemLayout}>
                            {getFieldDecorator("area",{
                               rules: [{ required: true, message: '请输入' }],
                            })(
                                <Cascader options={AreaData} onChange={this.onChange} placeholder="请选择" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <Button type="primary" loading={this.props.loading} onClick={this.search}>查询</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)