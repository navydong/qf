/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-30 13:51:09 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-06-25 16:49:25
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Avatar, Icon, Breadcrumb } from 'antd';
import moment from 'moment';
import axios from 'axios'

import ListDetail from './ListDetails';
import Modify from './Modify'
import SearchBox from './SearchBox'
import { paginat } from '@/utils/pagination'

import './members.less'

class Members extends React.Component {
    _isMounted = false
    state = {
        pageSize: 10,
        current: 1,
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        data: [],
        showDetails: false,
        record: []            // 选择当前行的数据
    };

    componentDidMount() {
        this._isMounted = true
        this.getPageList();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getPageList = () => {
        this.setState({ loading: true });
        axios.get('/back/memberinfo/getmemberinfolist').then(({ data }) => {
            this._isMounted && this.setState({
                data: data.rows,
                total: data.total,
                loading: false
            })
        })
    };
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    search = (values) => {
        console.log(values)
    };
    render() {
        const { loading, selectedRowKeys, showDetails } = this.state;
        const onRowClick = (record, index, event) => {
            this.setState({
                record
            })
            this.listDetail.showModal()
        }
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const actionCell = (record, event) => {
            event.stopPropagation();
            this.setState({
                record
            })
            this.modify.showModal(record.bonus)
        }
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.getPageList(pageSize, current, searchParams)
        })
        const columns = [
            {
                title: '昵称',
                dataIndex: 'nickName',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render: (text)=>{
                    if(text === 'MALE'){
                        return '男'
                    }else{
                        return '女'
                    }
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                // render: (text, record, index) => {
                //     const { name, gender } = text
                //     return <div>
                //         <span>{name}</span><Icon type={gender ? 'man' : 'woman'} />
                //     </div>
                // }
            }, {
                title: '卡号',
                dataIndex: 'code',
            }, {
                title: '手机号码',
                dataIndex: 'phone',
            }, {
                title: '积分',
                dataIndex: 'bonus',
            },
            //  {
            //     title: '等级',
            //     dataIndex: 'level'
            // }, 
            {
                title: '注册时间',
                dataIndex: 'registerTime',
                width: 170,
                render: (text) => {
                    return moment(text).format('YYYY-MM-DD hh:ss:mm')
                }
            }, 
            // {
            //     title: '操作',
            //     width: 80,
            //     onCellClick: actionCell,
            //     render: (text, record, index) => {
            //         return (
            //             // <Button type="dashed" onClick={(e) => { e.stopPropagation(); this.modify.showModal() }} >修改</Button>
            //             <a href="javascript:;">修改</a>
            //         )
            //     }
            // }
        ];
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="members" >
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>会员</Breadcrumb.Item>
                    <Breadcrumb.Item><span style={{ color: '#f93030' }} >会员管理</span></Breadcrumb.Item>
                </Breadcrumb>
                <div>
                    <Row>
                        <Card
                            bordered={false}
                            bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }}
                            noHovering
                        >
                            {/* <SearchBox loading={this.state.loading} search={this.search} /> */}
                        </Card>
                        {/* <Col md={24} style={{ marginBottom: 16 }} >
                            <SeacrBox search={this.search} />
                        </Col> */}
                    </Row>
                    <Card bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                        <Row>
                            <Col style={{ marginBottom: 16 }} >
                                <div>
                                    <Button type="primary" onClick={this.getPageList}
                                        disabled={loading} loading={loading}
                                    >刷新</Button>
                                </div>
                            </Col>
                            <Col>
                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.state.data}
                                    onRowClick={onRowClick}
                                    loading={loading}
                                    pagination={pagination}
                                    rowKey="code"
                                    bordered
                                />
                            </Col>
                        </Row>
                    </Card>
                    {/* 详细信息 */}
                    <ListDetail data={this.state.record} ref={e => this.listDetail = e} />
                    {/* 修改 */}
                    <Modify data={this.state.record} ref={e => this.modify = e} />
                </div>
            </div>
        );
    }
}

export default Members;