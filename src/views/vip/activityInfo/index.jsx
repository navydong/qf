import React, { Component } from 'react'
import { Card, Table, Popconfirm, message } from 'antd'
import SearchBox from './SearchBox'
import axios from 'axios'
import moment from 'moment'

import { paginat } from '@/utils/pagination'

export default class ActivityInfo extends Component {
    _isMounted = false
    state = {
        loading: false,
        pageSize: 10,
        current: 1,
        dataSource: []
    }
    componentDidMount() {
        this._isMounted = true
        this.getPageList()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getPageList(limit = this.state.pageSize, offset = this.state.current, values) {
        this.setState({ loading: true })
        axios.post('/back/memberactivity/getwxmemberactivity', {
            limit,
            offset,
            ...values
        }).then(({ data }) => {
            this._isMounted && this.setState({
                loading: false,
                searchParams: values,
                dataSource: data.rows,
            })
        })
    }
    // 查询按钮   valuse 查询参数
    search = (values) => {
        this.getPageList(this.state.pageSize, 1, values)
    }
    // 编辑按钮
    update(record) {
        this.props.router.push(`/app/vip/mark/${record.id}`)
    }
    // 终止按钮
    stopActivity(record) {
        const data = {
            id: record.id,
            ruleId: record.ruleId
        }
        axios.post('/back/memberactivity/delactivity', data).then(({ data }) => {
            if (data.rel) {
                message.success(data.msg)
                this.getPageList()
            } else {
                message.error(data.msg)
            }
        })
    }
    render() {
        const { loading } = this.state
        const columns = [
            {
                title: '活动名称',
                dataIndex: 'activityName'
            }, {
                title: '活动有效期',
                render: (text, record) => {
                    return moment(record.startDate).format('YYYY-MM-DD') + '~' + moment(record.endDate).format('YYYY-MM-DD')
                }
            }, {
                title: '活动类型',
                dataIndex: 'typeName'
            }, {
                title: '活动状态',
                dataIndex: 'stateName'
            }, {
                title: '发布门店',
                dataIndex: 'merchantName'
            }, {
                title: '更新时间',
                dataIndex: 'updateTime'
            }, {
                title: '操作',
                render: (text, record) => {
                    if (record.stateName === '已终止') {
                        return '已终止'
                    } else {
                        return <span>
                            <a onClick={this.update.bind(this, record)}>编辑</a>
                            <span>{' | '}</span>
                            <Popconfirm title="确认终止活动?" onConfirm={this.stopActivity.bind(this, record)} onCancel={null} okText="Yes" cancelText="No">
                                <a>终止</a>
                            </Popconfirm>
                        </span>
                    }

                }
            }
        ]
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.search(searchParams, pageSize, current)
        })
        return (
            <div className="activity" >
                <SearchBox loading={loading} search={this.search} />
                <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }} >
                    <Table
                        bordered
                        columns={columns}
                        loading={loading}
                        rowKey="id"
                        pagination={pagination}
                        dataSource={this.state.dataSource}
                    />
                </Card>
            </div>
        )
    }
}