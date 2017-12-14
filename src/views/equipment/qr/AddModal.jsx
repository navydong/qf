import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, InputNumber, Select, Table, message } from 'antd'
import axios from 'axios'
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}
const columns = [{
    title: '商户名称',
    dataIndex: 'merchantName'
}, {
    title: '商户编码',
    dataIndex: 'merCode'
}]

class AddModal extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            data: [],
            selectedRows: [],
        }
    }
    componentDidMount() {

    }
    /**
     * 模态框确定按钮
     */
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            let merId;
            if (JSON.stringify(this.props.modalProps.item) !== '{}' && this.state.selectedRows.length === 0) {
                // message.info('请选择商户')
                // return
            } else if (JSON.stringify(this.props.modalProps.item) !== '{}') {
                merId = this.state.selectedRows[0].id
            }
            console.log({ codeType: values.codeType, merId })
            this.props.onOk({ codeType: values.codeType, merId, quantity: values.quantity })
        })
    }
    onCancel = (e) => {
        this.props.modalProps.onCancel()
        this.props.form.resetFields();
    }
    onSearch = (value) => {
        this.setState({
            loading: true,
        })
        axios.get('/back/merchantinfoController/page', {
            params: {
                name: value
            }
        }).then(res => res.data).then(res => {
            this.setState({
                loading: false,
                data: res.rows,
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
            onCancel: this.onCancel,
        }
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
            },
        };
        return (
            <Modal {...modalOpts}>
                <Form>
                    <Row>
                        {JSON.stringify(modalOpts.item) === '{}'
                            ? <Col md={12}>
                                <FormItem label="创建数量" {...formItemLayout}>
                                    {getFieldDecorator('quantity', {
                                        initialValue: modalOpts.item.quantity || 1,
                                        rules: [{ required: true, message: '请输入' }],
                                    })(
                                        <InputNumber min={1} max={100} style={{ width: '100%' }} />
                                        )}
                                </FormItem>
                            </Col>
                            : null}
                        <Col md={12}>
                            <FormItem label="二维码类型" {...formItemLayout}>
                                {getFieldDecorator('codeType', {
                                    initialValue: JSON.stringify(modalOpts.item) === '{}'
                                        ? undefined  //默认选项
                                        : String(modalOpts.item.codeType),
                                    rules: [{ required: true, whitespace: true, message: '请选择' }],
                                })(
                                    <Select allowClear placeholder="请选择二维码类型">
                                        <Option key="0">微信收款二维码</Option>
                                        <Option key="1">支付宝收款二维码</Option>
                                        <Option key="2">公共二维码</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        {JSON.stringify(modalOpts.item) !== '{}'
                            ? <Col md={12}>
                                <FormItem label="商户Id" {...formItemLayout}>
                                    <Search
                                        placeholder="请输入搜索内容"
                                        onSearch={this.onSearch}
                                    />
                                </FormItem>
                            </Col>
                            : null}
                    </Row>
                </Form>

                {JSON.stringify(modalOpts.item) !== '{}'
                    ? <div style={{ width: '96%', margin: '0 auto' }}>
                        <Table
                            pagination={false}
                            bordered
                            loading={this.state.loading}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={this.state.data}
                            rowKey={record => (
                                record.id
                            )}
                        />
                    </div>
                    : null}
            </Modal>
        )
    }
}
AddModal.propTypes = {
    onOk: PropTypes.func
}
export default Form.create()(AddModal)