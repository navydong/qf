import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
class ConfigHeader extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            scheme: []
        }
    }

    componentWillMount(){
        this.selectScheme()
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    selectScheme(){
        axios.get(`/back/frscheme/schemes?offset=1&limit=100`)
            .then((resp)=>{
                const scheme = resp.data.rows;
                this.setState({
                    scheme
                })
            })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {scheme} = this.state
        const schemeOpts = scheme.map((item,index) => (
            <Option key={index} value={item.id}>{item.schemeName}</Option>
        ))
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    {/*<Col span={8}>*/}
                        {/*<FormItem {...formItemLayout} label={`机构`}>*/}
                            {/*{getFieldDecorator(`sorgId`)(*/}
                                {/*<Select>*/}
                                    {/*<Option vlaue="0" key={0}>受理机构</Option>*/}
                                    {/*<Option vlaue="1" key={1}>服务机构</Option>*/}
                                    {/*<Option vlaue="2" key={2}>商户</Option>*/}
                                {/*</Select>*/}
                            {/*)}*/}
                        {/*</FormItem>*/}
                    {/*</Col>*/}
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`方案`}>
                            {getFieldDecorator(`schemeId`)(
                                <Select>
                                    {schemeOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



ConfigHeader = Form.create()(ConfigHeader)
export default ConfigHeader