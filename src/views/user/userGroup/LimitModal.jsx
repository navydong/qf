import React from 'react'
import { Row, Col, Button, Card, Table, Modal } from 'antd'
import axios from 'axios'
import MenuRight from './MenuRigth'
import './LimitModal.less'

//给数据增加key值，key=id
function setKey(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].key = data[i].id
        if (data[i].children.length > 0) {
            setKey(data[i].children)
        } else {
            //删除最后一级的children属性
            delete data[i].children
        }
    }
}

class LimitModal extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: true,
        data: [],
        rightSelectIds: []
    }

    componentDidMount() {
        this.getPageList()
    }
    /**
     * 
     * @param {Number} limit 每页条数默认10条
     * @param {Number} offset 第几页，如果当前页数超过可分页的最后一页按最后一页算默认第1页
     * @param {String} name 通道名称
     */
    getPageList() {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/menu/system').then(({ data }) => {
            setKey(data)
            this.setState({
                data: data,
                loading: false,
            })
        }).catch(err => {
            console.log(err)
        })
        axios.get('/back/group/menu/authority').then(res => res.data).then(res => {
            this.setState({
                selectedRowKeys: res.authority
            })
        })
    }
    rigthSelect = (ids) => {
        this.setState({
            rightSelectIds: ids
        })
    }
    onOk = () => {
        let leftSelectId = this.state.selectedRowKeys
        let rigthSelectId = this.state.rightSelectIds
        this.props.onOk(leftSelectId, rigthSelectId)
    }
    onCancel = () => {
        this.props.onCancel()
    }
    /**
     * 处理表格的选择事件
     * 
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.menuRight.getPageList(10, 1, selectedRowKeys[0])
        this.setState({ selectedRowKeys, selectedRows });
    };

    onRowClick = ((record, index, event) => {
        console.log(record.id)
    })
    render() {
        //选择功能的配置。
        const rowSelection = {
            type: "checkbox",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        //表格表头信息
        const columns = [{
            title: "菜单",
            dataIndex: "title",
        }]
        return (
            <div>
                <Modal
                    width={'60%'}
                    okText="保存"
                    wrapClassName="vertical-center-modal"
                    visible={this.props.visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Card style={{ marginTop: 8 }}>
                                <Row>
                                    <Col>
                                        <Table
                                            bordered
                                            defaultExpandAllRows
                                            loading={this.state.loading}
                                            columns={columns}
                                            dataSource={this.state.data}
                                            rowSelection={rowSelection}
                                            onRowClick={this.onRowClick}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <MenuRight
                                ref={(e) => { this.menuRight = e }}
                                selected={this.state.selectedRowKeys.length > 0}
                                onTableSelectChange={this.rigthSelect}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}
export default LimitModal