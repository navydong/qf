import React from 'react'
import { Form, Row, Col, DatePicker, Button } from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};
class ToggleHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            endOpen: false,
            startValue: null,
            endValue: null,
        }
    }
    getFormFields = (callback) => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            if (values.startTime) {
                values.startTime = values.startTime.format('YYYY-MM-DD')
            }
            if (values.endTime) {
                values.endTime = values.endTime.format('YYYY-MM-DD')
            }
            callback(values)
        });
    }

    handlerNormalForm = () => {
        this.getFormFields(this.props.handlerNormalForm)
    }
    // 计算
    handlerCaculate = () => {
        this.getFormFields(this.props.handlerCaculate)
    }

    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            startValue: null,
            endValue: null
        })
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { endOpen } = this.state
        return (
            <div className="search-box">
                <Form>
                    <Row gutter={10}>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label={`开始日期`}>
                                {getFieldDecorator(`startTime`, {
                                    initialValue: moment(),
                                    rules: [{ required: true, message: '请输入开始日期', }]
                                })(
                                    <DatePicker disabledDate={this.disabledStartDate}
                                        placeholder="开始时间"
                                        onChange={this.onStartChange}
                                        onOpenChange={this.handleStartOpenChange}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label={`结束日期`}>
                                {getFieldDecorator(`endTime`, {
                                    initialValue: moment(),
                                    rules: [{ required: true, message: '请输入结束日期' }]
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
                        <Col span={10} >
                            <div style={{ float: 'right' }}>
                                {/* <Button
                                    type="primary"
                                    className='btn-search'
                                    onClick={this.handlerNormalForm}
                                >查询</Button> */}
                                <Button
                                    type="primary"
                                    className='btn-search'
                                    onClick={this.handlerCaculate}
                                >查询</Button>
                                <Button
                                    className='btn-reset'
                                    onClick={this.handleReset}
                                >重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default Form.create()(ToggleHeader)
