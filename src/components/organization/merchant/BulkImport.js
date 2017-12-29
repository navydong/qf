import React from 'react'
import { Form, Row, Col, Upload, Button, Icon } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};
class BulkImport extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`上传文件`}>
                            {getFieldDecorator(`buslicence`)(
                                <Upload name="buslicence" action="" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                       <Button type="primary">导出模板</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}



BulkImport = Form.create()(BulkImport)
export default BulkImport