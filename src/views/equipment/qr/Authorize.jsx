import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, Select, Table, message } from 'antd'
import axios from 'axios'
import { setKey } from '@/utils/setkey'

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
            total: 0,
            searchParams: '',          //查询参数
        }
    }
    componentDidMount() {
        this.getTableList()
    }
    /**
     * 获取商户信息
     * 
     * @param {any} [limit=10]
     * @param {any} [offset=1] 
     * @param {any} name - 商户ID 
     */
    getTableList = (limit = 10, offset = 1, name) => {
        axios.get('/back/merchantinfoController/page', {
            params: {
                limit,
                offset,
                name
            }
        }).then(res => res.data).then(res => {
            const dataSource = setKey(res.rows);
            this.setState({
                total: res.total,
                loading: false,
                data: dataSource,
            })
        })
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
    /**
     * 搜索
     * 
     * @param {any} value 
     */
    onSearch = (value) => {
        this.setState({
            loading: true,
            searchParams: value
        })
        this.getTableList(10, 1, value)
    }
    /**
     * 分页
     * 
     * @param {any} page 
     * @param {any} pageSize 
     */
    pageChange = (page, pageSize) => {
        this.setState({
            loading: true
        })
        this.getTableList(pageSize, page, this.state.searchParams)
    }
    render() {
        const modalOpts = {
            item: this.props.item || {},
            onOk: this.handleOk,
            ...this.props.modalProps,
            onCancel: this.onCancel,
            width: 800
        }
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
            },
        };
        const pagination = {
            total: this.state.total,
            onChange: this.pageChange,
            showTotal: (total, range) => `共${total}条数据`,
        }
        return (
            <Modal {...modalOpts}>
                <Form>
                    <Row>
                        <Col md={24}>
                            <FormItem label="商户ID" {...formItemLayout}>
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
                        pagination={pagination}
                        bordered
                        loading={this.state.loading}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.data}
                        scroll={{ y: 400 }}
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