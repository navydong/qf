import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker, Switch, } from 'antd'
import axios from 'axios'
import moment from 'moment';
import { urlEncode } from '@/utils/urlEncode'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
class SearchBox extends React.Component {
    _isMounted = false
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        merchantinfoList: [],
        passway: [],
        dateMode: 'day',                           //汇总方式
        isStore: false,                            //是否门店汇总   
    }
    componentDidMount() {
        this._isMounted = true
        this.getMerchantList()
        this.getPassway()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取商户名称
    getMerchantList() {
        axios.get('/back/tradeBlotter/getMerchantinfoList').then(res => res.data).then(res => {
            this._isMounted && this.setState((prevState => (
                { merchantinfoList: prevState.merchantinfoList.concat(res) }
            )))
        })
    }
    // 获取通道信息
    getPassway() {
        axios.get('/back/passway/page').then(res => res.data).then(res => {
            this._isMounted && this.setState((prevState) => ({
                passway: prevState.passway.concat(res.rows)
            }
            ))
        })
    }
    // 查询参数日期逻辑处理
    formSearchValue(values, config) {
        // 开始日期
        let startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
        // 结束日期
        let endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
        // 开始月份
        let startMonth = values.startMonth && values.startMonth.format('YYYY-MM')
        // 结束月份
        let endMonth = values.endMonth && values.endMonth.format('YYYY-MM')
        // 当前日期
        // let nowDate = moment(new Date()).format('YYYY-MM-DD')
        // // 当前月份
        // let nowMonth = moment(new Date()).format('YYYY-MM')
        // // 日期的默认逻辑
        // if (startDate || endDate) {   //开始和结束有一个存在
        //     if (!startDate) {
        //         startDate = endDate
        //     } else if (!endDate) {
        //         endDate = startDate
        //     }
        // } else { //开始和结束都没有
        //     if (config.defaultNow) {
        //         startDate = endDate = nowDate
        //     }
        // }

        // 月份的默认逻辑
        // if (startMonth || endMonth) {   //开始和结束有一个存在
        //     if (!startMonth) {
        //         startMonth = endMonth
        //     } else if (!endMonth) {
        //         endMonth = startMonth
        //     }
        // } else { //开始和结束都没有
        //     if (config.defaultNow) {
        //         startMonth = endMonth = nowMonth
        //     }
        // }

        if (values.mode === 'day') {
            return {
                ...values,
                startDate,
                endDate,
            }
        } else {
            return {
                ...values,
                startMonth,
                endMonth,
            }
        }

    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
        this.switchChange(false)
    }
    /**
     * 搜索按钮
     */
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            let searchParams = this.formSearchValue(values, { defaultNow: false })
            this.props.search(searchParams)
        })
    }
    // 订单汇总
    summary = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            let searchParams = this.formSearchValue(values, { defaultNow: true })
            this.props.summary(searchParams)
        })
    }
    /**
     * 下载excel文件
     */
    exportExcel = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) return
            let startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            let endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
            const nowDate = moment(new Date()).format('YYYY-MM-DD')
            if (!startDate && !endDate) {
                startDate = endDate = nowDate
            } else {
                if (!startDate) {
                    startDate = endDate
                } else if (!endDate) {
                    endDate = startDate
                }
            }
            const params = urlEncode({ ...values, startDate, endDate })
            window.location.href = `/back/tradeBalcons/export?${params}`;
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
    /****** 开始、结束月份关联 *********/
    disabledStartMonth = (startMonth) => {
        const endMonth = this.state.endMonth
        if (!startMonth || !endMonth) {
            return false
        }
        return startMonth.valueOf() > endMonth.valueOf();
    }
    disabledEndMonth = (endMonth) => {
        const startMonth = this.state.startMonth
        if (!startMonth || !endMonth) {
            return false
        }
        return endMonth.valueOf() <= startMonth.valueOf();
    }
    onMonthStartChange = (value) => {
        this.onChange('startMonth', value)
    }
    onMonthEndChange = (value) => {
        this.onChange('endMonth', value)
    }
    /****** 开始、结束月份关联 *********/


    selectFilter = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    // 汇总方式onChange
    dateModeChange = (value) => {
        this.setState({
            dateMode: value
        })
    }
    // 是否门店开关onChange
    switchChange = (checked) => {
        this.setState({
            isStore: checked
        }, () => {
            this.props.form.validateFields(['merchantId'], { force: true });
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen, dateMode, isStore } = this.state;
        return (
            <Form>
                <Row>
                    <Col span={8}>
                        <FormItem label="商户名称" {...formItemLayout}>
                            {getFieldDecorator("merchantId", {
                                rules: [{
                                    required: isStore, message: '请选择商户'
                                }]
                            })(
                                <Select
                                    showSearch
                                    placeholder="==请选择=="
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={this.selectFilter}
                                >
                                    {this.state.merchantinfoList.map(item => (
                                        <Option key={item.id}>{item.merchantName}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="支付方式" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==" allowClear>
                                    {this.state.passway.map(i => (
                                        <Option key={i.id}>{i.passwayName}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="是否门店汇总" {...formItemLayout} >
                            {getFieldDecorator("isStore", {
                                initialValue: false,
                                valuePropName: 'checked'
                            })(
                                <Switch onChange={this.switchChange} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="汇总方式" {...formItemLayout}>
                            {getFieldDecorator("mode", {
                                initialValue: 'day'
                            })(
                                <Select placeholder="==请选择=="
                                    onChange={this.dateModeChange} >
                                    <Option value="day" >按天汇总</Option>
                                    <Option value="month" >按月汇总</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {
                        dateMode === 'day'
                            ? <div>
                                <Col span={8}>
                                    <FormItem label="开始时间" {...formItemLayout}>
                                        {getFieldDecorator("startDate", {
                                            rules: [
                                                // { required: true, message: '请选择开始时间' },
                                            ]
                                        })(
                                            <DatePicker disabledDate={this.disabledStartDate}
                                                format="YYYY-MM-DD"
                                                placeholder="开始时间"
                                                onChange={this.onStartChange}
                                                onOpenChange={this.handleStartOpenChange}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="结束时间" {...formItemLayout}>
                                        {getFieldDecorator("endDate", {
                                            rules: [
                                                // { required: true, message: '请选择结束时间' },
                                            ]
                                        })(
                                            <DatePicker disabledDate={this.disabledEndDate}
                                                format="YYYY-MM-DD"
                                                placeholder="结束时间"
                                                onChange={this.onEndChange}
                                                open={endOpen}
                                                onOpenChange={this.handleEndOpenChange}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </div>
                            : <div>
                                <Col span={8}>
                                    <FormItem label="开始月份" {...formItemLayout}>
                                        {getFieldDecorator("startMonth")(
                                            <MonthPicker disabledDate={this.disabledStartMonth}
                                                format="YYYY-MM"
                                                placeholder="选择月份"
                                                onChange={this.onMonthStartChange}
                                                onOpenChange={this.handleStartOpenChange}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="结束月份" {...formItemLayout}>
                                        {getFieldDecorator("endMonth")(
                                            <MonthPicker disabledDate={this.disabledEndMonth}
                                                format="YYYY-MM"
                                                placeholder="选择月份"
                                                onChange={this.onMonthEndChange}
                                                open={endOpen}
                                                onOpenChange={this.handleEndOpenChange}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </div>
                    }

                </Row>
                <Row style={{ float: 'right' }}>
                    <Col span={24}>
                        {/* <Button
                            className="btn-search"
                            type="primary"
                            // loading={this.props.loading}
                            onClick={this.search}
                        >查询</Button> */}
                        <Button
                            className="btn-search"
                            type="primary"
                            onClick={this.summary}
                        >查询</Button>
                        <Button
                            className="btn-search"
                            type="primary"
                            onClick={this.exportExcel}
                        // icon="file-excel"
                        >导出</Button>
                        <Button
                            className="btn-reset"
                            onClick={this.reset}
                        >重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(SearchBox)
