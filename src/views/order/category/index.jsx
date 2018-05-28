import React from 'react'
import { Card, Table, Breadcrumb, Modal, Button, message, notification } from 'antd'
import DropOption from '@/components/DropOption'
import CategorCreate from './CategorCreate'
import axios from 'axios'
import { paginat } from '@/utils/pagination'

const confirm = Modal.confirm;

class Category extends React.Component {
    _isMounted = false
    state = {
        data: [],
        visible: false,
        previewVisible: false,
        isUpdate: false,
        loading: true,
        confirmLoading: false,
        pageSize: 10,
        current: 1,
        modalKey: -1,
    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取品类
    getPageList = (limit = this.state.pageSize, offset = 1) => {
        axios.get('/dcback/categoryController/page', {
            params: {
                limit: 10,
                offset: 1
            }
        }).then(({ data }) => {
            this._isMounted && this.setState({
                data: data.rows,
                total: data.total,
                current: offset,
                loading: false,
            })
        }).catch(err => {
            console.dir(err)
            notification.error({
                message: err.error,
                description: err.message,
                duration: null
            })
        })
    }
    // 表格下拉选项按钮
    actionClick = (record, e) => {
        if (e.key === 'update') {
            this.setState({
                modalKey: Math.random(),
                visible: true,
                isUpdate: true,
                currentRecord: record
            })
        } else if (e.key === 'delete') {
            confirm({
                title: '是否确认删除此类目？',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    axios.delete(`/dcback/categoryController/delete/${record.id}`).then(({ data }) => {
                        if (data.rel) {
                            this.getPageList()
                            message.success(data.msg)
                        } else {
                            message.error(data.msg)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

        }
    }
    // 关闭模态框
    hiddenModal = () => {
        this.categoryForm.resetFields()
        this.setState({
            visible: false
        })
    }
    //  模态框确认按钮
    modalOk = () => {
        this.categoryForm.validateFields((err, value) => {
            if (err) return
            this.setState({
                confirmLoading: true
            })
            const formData = new FormData();
            for (let k in value) {
                value[k] && formData.append(k, value[k]);
            }
            const config = {
                baseURL: '/dcback/categoryController',
                url: '/add',
                method: 'post',
                data: formData
            }
            if (this.state.isUpdate) {
                config.url = '/update'
                if (this.state.currentRecord.categoryIcon) {
                    formData.append('oldCategoryIcon', this.state.currentRecord.categoryIcon)
                }
                if(!value.categoryIcon){
                    formData.append('categoryIcon', '')
                }
                // config.method = 'put'
                formData.append('id', this.state.currentRecord.id)
            }

            axios(config).then(({ data }) => {
                if (data.rel) {
                    this.setState({
                        confirmLoading: false,
                        visible: false
                    })
                    this.categoryForm.resetFields()
                    this.getPageList()
                } else {
                    message.error(data.msg)
                }
            })
        })
    }

    // 新增品类
    add = () => {
        this.setState({
            modalKey: Math.random(),
            isUpdate: false,
            visible: true,
            currentRecord: {}
        })
    }
    // 图片预览modal取消
    handleCancel = () => this.setState({ previewVisible: false })
    // 表格图片点击
    imgOnClick = (url) => {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }
    render() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'categoryName'
            }, {
                title: '图片',
                dataIndex: 'categoryIcon',
                render: (text) => {
                    return <img src={text} alt="" height="29" style={{ cursor: 'pointer' }} onClick={() => this.imgOnClick(text)} />
                }
            }, {
                title: '创建时间',
                dataIndex: 'createTime'
            }, {
                title: '修改时间',
                dataIndex: 'updateTime'
            }, {
                title: '说明',
                dataIndex: 'categoryDesc'
            }, {
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
        const modalPorps = {
            key: this.state.modalKey,
            title: this.state.isUpdate ? '修改-品类' : '新增-品类',
            visible: this.state.visible,
            onCancel: this.hiddenModal,
            onOk: this.modalOk,
            confirmLoading: this.state.confirmLoading
        }
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        return (
            <div>
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>点餐</Breadcrumb.Item>
                    <Breadcrumb.Item><span style={{ color: '#f93030' }} >品类</span></Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" onClick={this.add} >
                    增加
                </Button>
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Table
                        size="small"
                        loading={this.state.loading}
                        dataSource={this.state.data}
                        columns={columns}
                        pagination={pagination}
                        rowKey="id"
                    />
                </Card>
                <Modal {...modalPorps} >
                    <CategorCreate
                        ref={e => this.categoryForm = e}
                        isUpdate={this.state.isUpdate}
                        record={this.state.currentRecord}
                    />
                </Modal>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>

        )
    }
}


export default Category