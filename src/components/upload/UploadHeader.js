import React from 'react'
import { Form, Row, Col,Upload,Button,Icon,message } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
class UploadHeader extends React.Component {
    constructor(props){
        super(props)
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }



    render(){
        const { getFieldDecorator } = this.props.form;
        const upload = {
            action: '/back/wcsver/upload',
            beforeUpload(file){
                let re = /\.(jar|war|zip)$/
                console.log(file.name)
                if(!re.test(file.name)){
                    message.error('对不起，您上传的格式有误!')
                }else {
                    return true
                }
            },
            showUploadList: false,
            name:"file",
            onChange(info){
                const status = info.file.status;
                if(status === 'done'){
                    message.success('文件上传成功')
                    window.location.reload()
                }
            }
        }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`上传文件`}>
                            {getFieldDecorator(`file`)(
                                <Upload {...upload}>
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}



UploadHeader = Form.create()(UploadHeader)
export default UploadHeader