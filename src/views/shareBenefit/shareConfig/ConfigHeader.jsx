import React from 'react'
import { Form, Select, Row, Col } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
class ConfigHeader extends React.Component {

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            this.props.onSubmit(err, values);
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { scheme } = this.props
        const schemeOpts = scheme.map((item, index) => (
            <Option key={item.id} value={item.id}>{item.schemeName}</Option>
        ))
        return (
            <div className="search-box">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label={`方案`}>
                                {getFieldDecorator(`schemeId`)(
                                    <Select
                                        placeholder="==请选择=="
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                    >
                                        {schemeOpts}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}



ConfigHeader = Form.create()(ConfigHeader)
export default ConfigHeader
