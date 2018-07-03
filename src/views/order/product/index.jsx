import React from 'react'
import { Card, Breadcrumb, Table, Form, Row, Col, Modal, Button, message } from 'antd'
import axios from 'axios'
import DropOption from '@/components/DropOption'
import Addfood from './AddFood'
import { paginat } from '@/utils/pagination'
import './order.less'

const confirm = Modal.confirm;
const FormItem = Form.Item

class Order extends React.Component {
    _isMounted = false
    state = {
        visible: false,
        isUpdate: false,
        loading: true,
        pageSize: 10,
        categoryStatus: 'show',
        view: 'show',
        data: []
    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取商品信息
    getPageList(limit = this.state.pageSize, offset = 1) {
        axios.get('/dcback/productController/page', {
            params: {
                limit,
                offset
            }
        }).then(({ data }) => {
            this._isMounted && this.setState({
                loading: false,
                data: data.rows,
                total: data.total
            })
        })
    }
    // 展开行
    expandedRowRender = (record) => {
        return (<div className="flexItem" >
            <Row gutter={24} >
                <Col span={8}>
                    <FormItem label="菜名">
                        {record.productName}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="价格" >
                        {record.productPrice}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="品类" >
                        {record.categoryName}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="库存" >
                        {record.productStock}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="描述" >
                        {record.productDes}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="创建时间" >
                        {record.createTime}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="修改时间" >
                        {record.updateTime}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="图片" >
                        {record.productIcon ? <img src={record.productIcon} alt="img" width="100" height="100" style={{ border: '1px solid #ccc', padding: 4, borderRadius: 4 }} /> : ''}
                    </FormItem>
                </Col>
            </Row>
        </div>)
    }
    // 表格操作按钮功能
    actionClick = (record, e) => {
        if (e.key === 'update') {
            this.setState({
                view: 'add',
                currentRecord: record,
                isUpdate: true
            })
        } else if (e.key === 'delete') {
            confirm({
                title: '是否确认删除此类目？',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.deleteFood(record.id)
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }
    // 删除
    deleteFood(id) {
        axios.delete(`/dcback/productController/delete/${id}`).then(({ data }) => {
            if (data.rel) {
                message.success(data.msg)
                this.getPageList()
            } else {
                message.error(data.msg)
            }
        })
    }

    addButton = () => {
        this.setState(prevState => ({
            currentRecord: {},
            view: prevState.view === 'show' ? 'add' : 'show',
        }))
    }
    // 从增加页返回表格页
    backList = () => {
        this.getPageList(this.state.pageSize, this.state.current)
        this.setState({
            view: 'show'
        })
    }
    // 表格图片点击
    imgOnClick = (url) => {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }
    // 图片预览modal取消
    handleCancel = () => this.setState({ previewVisible: false })
    render() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'productName',
            }, {
                title: '图片',
                dataIndex: 'productIcon',
                render: (text) => {
                    return <img src={text} alt="" height="29" style={{ cursor: 'pointer' }} onClick={this.imgOnClick.bind(this, text)} />
                }
            }, {
                title: '价格',
                dataIndex: 'productPrice'
            },
            {
                title: '品类',
                dataIndex: 'categoryName'
            },
            {
                title: '库存',
                dataIndex: 'productStock'
            },
            {
                title: '操作',
                width: 80,
                render: (text, record, index) => (
                    <DropOption
                        onMenuClick={e => this.actionClick(record, e)}
                        menuOptions={[
                            { key: 'update', name: '修改' },
                            { key: 'delete', name: '删除' }
                        ]}
                    />
                )
            }
        ]
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        return (<div>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>点餐</Breadcrumb.Item>
                <Breadcrumb.Item><span style={{ color: '#f93030' }} >菜单管理</span></Breadcrumb.Item>
            </Breadcrumb>
            <Button onClick={this.addButton} type="primary" >
                {this.state.view === 'show' ? '新增' : '返回'}
            </Button>
            {
                this.state.view === 'show'
                    ? <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                        <Table
                            size="small"
                            rowKey="id"
                            loading={this.state.loading}
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={pagination}
                            expandedRowRender={this.expandedRowRender}
                        />
                    </Card>
                    : <Addfood
                        record={this.state.currentRecord}
                        isUpdate={this.state.isUpdate}
                        backList={this.backList}
                    />
            }
            {/* 图片预览modal */}
            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>)
    }
}

export default Order