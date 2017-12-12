import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, Select, Table, message } from 'antd'
import axios from 'axios'
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 4 },
        lg: { span: 5 }
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
        if (this.state.selectedRows.length < 1) {
            message.info('请选择商户')
            return
        }
        this.props.onOk(this.state.selectedRows[0].id)
    }
    onCancel = (e) => {
        this.props.modalProps.onCancel()
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
                        <Col md={24}>
                            <FormItem label="商户Id" {...formItemLayout}>
                                <Search
                                    placeholder="请输入搜索内容"
                                    onSearch={this.onSearch}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div style={{ width: '96%', margin: '0 auto' }}>
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
            </Modal>
        )
    }
}
AddModal.propTypes = {
    onOk: PropTypes.func
}
export default AddModal