import React from 'react'
import { Form, Row, Col, DatePicker } from 'antd'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
class BenefitHeader extends React.Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }
        /********开始、结束日期关联***********/
        disabledStartDate = (startValue) => {
            const endValue = this.state.endValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        }
    
        disabledEndDate = (endValue) => {
            const startValue = this.state.startValue;
            if (!endValue || !startValue) {
                return false;
            }
            return endValue.valueOf() <= startValue.valueOf();
        }
    
        onChange = (field, value) => {
            this.setState({
                [field]: value,
            });
        }
    
        onStartChange = (value) => {
            this.onChange('startValue', value);
        }
    
        onEndChange = (value) => {
            this.onChange('endValue', value);
        }
    
        handleStartOpenChange = (open) => {
            if (!open) {
                this.setState({ endOpen: true });
            }
        }
    
        handleEndOpenChange = (open) => {
            this.setState({ endOpen: open });
        }
        /********开始、结束日期关联*********/
    render(){
        const { endOpen } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开始日期`}>
                            {getFieldDecorator(`startTime`,{
                                rules: [{ required: true, message: '请输入开始日期', }]
                            })(
                                <DatePicker disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    placeholder="开始日期"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`结束日期`}>
                            {getFieldDecorator(`endTime`,{ rules: [{ required: true, message: '请输入开始日期', }] })(
                                <DatePicker disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                            />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

BenefitHeader = Form.create()(BenefitHeader)
export default BenefitHeader
