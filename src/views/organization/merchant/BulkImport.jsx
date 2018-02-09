import React from 'react'
import axios from 'axios'
import { Form, Row, Col, Upload, Button, Icon, message } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};
const btnStyle = {
                    color: '#fff',
                    backgroundColor: '#f93030',
                    border: '1px solid #f93030',
                    padding: '8px 10px',
                    marginLeft: 20,
                }
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
    /**
     * 上传
     */
    uploadOnChange=(res)=>{
        if(res.file.status === 'done'){
            if(res.file.response.rel){
                message.success(res.file.response.msg)
            }else{
                message.error(res.file.response.msg)
            }
        }
    }
    /**
     * 导出模板
     */
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
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`上传文件`}>
                                <Upload 
                                    name="book" 
                                    action="/back/merchantinfoController/upload/ExcelTemplate"
                                    onChange={this.uploadOnChange}
                                >
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                       <Button type="primary" onClick={this.exportTemplate}>导出模板</Button>
                       <a href="/back/merchantinfoController/exportmerchantinfo" 
                            className="ant-btn"
                            style={btnStyle}
                       ><span>导出商户</span></a>
                    </Col>
                </Row>
            </Form>
        )
    }
}


export default BulkImport