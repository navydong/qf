import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd'
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class SearchBox extends React.Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
    }
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.search(values)
        })
    }
    summary = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const endDate = values.endDate.format('YYYY-MM-DD HH:mm:ss')
            this.props.summary(endDate)
        })
    }
    /**
     * 获取下拉列表项
     * @param {String} url 请求地址
     * @param {String} label 选项文字
     * @param {String} value 选项value属性
     * @param {Object} param 请求参数
     */
    getSelectOption(url, label, value, param) {
        axios.get(url, {
            params: param
        }).then((res) => {
            return res.data.map((option) => {
                return <Option value={option.value}>{option.label}</Option>
            }
            )
        })
    }

    /*******************/
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
      /*****************/
    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen } = this.state;
        return (
            <Form>
                <Row gutter={40}>
                    <Col span={12}>
                        <FormItem label="商户" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select>

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="支付方式" {...formItemLayout}>
                            {getFieldDecorator("merchantId")(
                                <Select>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="开始时间" {...formItemLayout}>
                            {getFieldDecorator("startTime")(
                                <DatePicker disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange} />
                            )}.
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="结束时间" {...formItemLayout}>
                            {getFieldDecorator("endDate", {
                                rules: [
                                    { required: true, message: '请选择结束日期' },
                                ]
                            })(
                                <DatePicker disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="结束时间"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange} />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <Button
                        className="btn-search"
                        type="primary" 
                        loading={this.props.loading} 
                        onClick={this.search}
                        >查询</Button>
                        <Button 
                        className="btn-reset"
                        onClick={this.reset}
                        >重置</Button>
                        <Button type="primary" icon="solution" onClick={this.summary} loading={this.props.loading}>订单汇总</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)