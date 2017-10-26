import React, {Component} from 'react'
import { Row, Col, Form, Input, Button} from 'antd'

const FormItem = Form.Item
class BaseForms extends Component {
    state = {
        initialValue: {name: '', rate: '', period: ''}
    }
    // componentDidMount(){
    //     this.setState({
    //         initialValue: this.props.initialValue
    //     })
    // }
    componentWillReceiveProps(nextProps){
        console.log(nextProps.initialValue)
        this.setState({
            initialValue: nextProps.initialValue
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol : {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol : {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        }
        return (
            <Form>
                <FormItem label="行业名称" {...formItemLayout}>
                    {getFieldDecorator('name',{initialValue: this.state.initialValue.name})(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="费率" {...formItemLayout}>
                    {getFieldDecorator('rate',{initialValue: this.state.initialValue.rate})(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="结算周期T+" {...formItemLayout}>
                    {getFieldDecorator('period',{initialValue: this.state.initialValue.period})(
                        <Input />
                    )}
                </FormItem>
                <Row>
                    <Col span={19} push={5}>
                        <Button type="primary">保存</Button>
                        <Button type="primary">取消编辑</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const BaseForm = Form.create()(BaseForms)
export default BaseForm