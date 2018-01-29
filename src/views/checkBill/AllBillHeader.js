import React from 'react'
import { Form, Row, Col, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
class AllBillHeader extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          endOpen: false
        }
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
        const { getFieldDecorator } = this.props.form;
        const { endOpen } = this.state
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`支付通道`}>
                            {getFieldDecorator(`tradetype`)(
                                <Select placeholder="==请选择==" allowClear>
                                    <option key={'0'} value={'0'}>支付宝</option>
                                    <option key={'1'} value={'1'}>微信</option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`开始日期`}>
                            {getFieldDecorator(`startTime`,{
                                rules: [{ required: true,  message: '请输入开始日期', }]
                            })(
                              <DatePicker disabledDate={this.disabledStartDate}
                                  placeholder="开始时间"
                                  onChange={this.onStartChange}
                                  onOpenChange={this.handleStartOpenChange}
                              />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`结束日期`}>
                            {getFieldDecorator(`endTime`,{
                                rules: [{ required: true,  message: '请输入结束日期', }]
                            })(
                              <DatePicker disabledDate={this.disabledEndDate}
                                  placeholder="结束时间"
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

AllBillHeader = Form.create()(AllBillHeader)
export default AllBillHeader
