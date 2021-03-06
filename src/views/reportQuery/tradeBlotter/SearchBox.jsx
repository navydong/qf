import React from 'react'
import { Row, Col, Form, Select, Input, Button, DatePicker, Cascader } from 'antd'
import axios from 'axios'
import { urlEncode } from '@/utils/urlEncode'
import { connect } from 'react-redux'

const FormItem = Form.Item,
    Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
@connect(state => ({ groupId: state.userInfo.data.groupId }))
class SearchBox extends React.Component {
    _isMounted = false
    state = {
        endOpen: false,
        merchant: [],
        merchant2: [],
        dicList: [],
        searchLoading: false,          //搜索按钮loading
    }
    componentDidMount() {
        this._isMounted = true
        this.selectMerchant()
        this.selectMerchant2()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取商户列表 - 层级
    selectMerchant() {
        axios.get(`/back/merchantinfoController/page`, {
            params: {
                limit: 10000,
                offset: 1
            }
        }).then((resp) => {
            const merchant = formCascaderData(resp.data.rows, 'merchantName');
            this._isMounted && this.setState({
                merchant
            })
        })
    }
    // 获取商户列表 - 平级
    selectMerchant2() {
        axios.get('/back/merchantinfoController/findmerbybdanduserid').then(({ data }) => {
            this._isMounted && this.setState({
                merchant2: data.rows
            })
        })
    }
    /**
     * 重置表单
     */
    reset = () => {
        this.props.form.resetFields()
        this.setState({
            startValue: null,
            endValue: null
        })
    }
    search = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return
            if (values.type) {
                values.type = values.type.join(',')
            }
            if (values.merchantId && typeof values.merchantId == 'object' ) {
                values.merchantId = values.merchantId[values.merchantId.length - 1]
            }
            const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
            this.props.search({ ...values, startDate, endDate })
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
    /**
         * 下载excel文件
         */
    exportExcel = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) return
            const startDate = values.startDate && values.startDate.format('YYYY-MM-DD')
            const endDate = values.endDate && values.endDate.format('YYYY-MM-DD')
            if (values.merchantId) {
                values.merchantId = values.merchantId[values.merchantId.length - 1]
            }
            const params = urlEncode({ ...values, startDate, endDate })
            window.location.href = `/back/tradeBlotter/export?${params}`;
            // axios.get('/back/tradeBlotter/export', {
            //     responseType: 'blob',
            //     params: { ...values, startDate, endDate }
            // }).then(res => {
            //     this.funDownload(res.data, '订单明细.xlsx')
            // })
        })
    }
    funDownload(content, filename) {
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.href = URL.createObjectURL(content);
        eleLink.click();
    };
    selectFilter = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    displayRender = (label, selectedOptions) => {
        if (label.length === 0) {
            return
        }
        return label[label.length - 1]
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen, merchant, merchant2 } = this.state;
        const merchantOptions = merchant2.map(item => (
            <Option key={item.id}>{item.merchantName}</Option>
        ))
        return (
            <Form>
                <Row gutter={40}>
                    <Col span={12}>
                        <FormItem label="订单号" {...formItemLayout}>
                            {getFieldDecorator("orders")(
                                <Input placeholder="请输入订单号" maxLength="100" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="通道名称" {...formItemLayout}>
                            {getFieldDecorator("passwayId")(
                                <Select placeholder="==请选择==" allowClear>
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {
                        this.props.groupId !== '54ac58951527429eb5a5df378eb74b62'
                            ? <Col span={12}>
                                <FormItem label="商户名称" {...formItemLayout}>
                                    {getFieldDecorator("merchantId")(
                                        <Cascader
                                            allowClear
                                            placeholder={"==请选择=="}
                                            showSearch
                                            changeOnSelect
                                            displayRender={this.displayRender}
                                            options={merchant}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            : <Col span={12}>
                                <FormItem label="商户名称" {...formItemLayout}>
                                    {getFieldDecorator("merchantId")(
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder={"==请选择=="}
                                            optionFilterProp="children"
                                        >
                                            {merchantOptions}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                    }


                    <Col span={12}>
                        <FormItem label="交易状态" {...formItemLayout}>
                            {getFieldDecorator("type")(
                                <Select
                                    allowClear
                                    showSearch
                                    mode="multiple"
                                    placeholder="==请选择=="
                                    optionFilterProp="children"
                                >
                                    <Option key="0">支付失败</Option>
                                    <Option key="1">支付成功</Option>
                                    {/* <Option key="2">代支付</Option> */}
                                    <Option key="3">退款成功</Option>
                                    <Option key="4">退款失败</Option>
                                    {/* <Option key="5">退款中</Option> */}
                                    <Option key="6">部分退款</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="钱包方订单号" {...formItemLayout}>
                            {getFieldDecorator("tradeNo")(
                                <Input placeholder="请输入钱包方订单号" maxLength="100" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="退款订单号" {...formItemLayout}>
                            {getFieldDecorator("refundorders")(
                                <Input placeholder="请输入退款订单号" maxLength="100" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="码名" {...formItemLayout}>
                            {getFieldDecorator("qrName")(
                                <Input placeholder="请输入码名" maxLength="100" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="码值" {...formItemLayout}>
                            {getFieldDecorator("qrno")(
                                <Input placeholder="请输入码值" maxLength="100" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="开始时间" {...formItemLayout}>
                            {getFieldDecorator("startDate", {
                                rules: [
                                    { required: false, message: '请选择开始时间' },
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
                    <Col span={12}>
                        <FormItem label="结束时间" {...formItemLayout}>
                            {getFieldDecorator("endDate", {
                                rules: [
                                    { required: false, message: '请选择结束时间' },
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
                </Row>
                <Row style={{ float: 'right' }}>
                    <Col span={24}>
                        <Button
                            className="btn-search"
                            type="primary"
                            loading={this.props.loading}
                            onClick={this.search}
                        >查询</Button>
                        <Button
                            className="btn-search"
                            type="primary"
                            onClick={this.exportExcel}
                        >导出</Button>
                        <Button
                            className="btn-reset"
                            onClick={this.reset}
                        >重置</Button>
                    </Col>
                </Row>
            </Form >
        )
    }
}
export default Form.create()(SearchBox)



/**
* 格式成Cascader组件所需格式
* @param {*} res 
*/
function formCascaderData(res, label, disableId) {
    (function d(s) {
        s.forEach(item => {
            item.value = item.id
            item.label = item[label]
            if (item.id === disableId) {
                debugger
                // item.disabled = true
            }
            if (item.children) {
                d(item.children)
            }
        })
    })(res)
    return setKey(res)
}

const setKey = function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
    return data
}