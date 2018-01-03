import React from 'react'
import axios from 'axios'
import { Form, Row, Col, Upload, Button, Icon, message } from 'antd'
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
    exportTemplate = ()=>{
        axios.get('/back/merchantinfoController/excelTemplateURL').then(({data})=>{
            if(data.rel){
                window.location.href = data.msg
            }else{
                message.error(data.msg)
            }
        })
    }
    render(){
        return (
            <Form>
                <Row>
                    <Col span={14}>
                        <FormItem {...formItemLayout} label={`上传文件`}>
                                <Upload name="book" action="/back/merchantinfoController/upload/ExcelTemplate">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        {/* <a href="filename" download="/back/merchantinfoController/excelTemplateURL">下载</a> */}
                       <Button type="primary" onClick={this.exportTemplate}>导出模板</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}


export default BulkImport