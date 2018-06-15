import React from 'react'
import { Row, Col, Button, Card, Table, Modal } from 'antd'
import axios from 'axios'
//import MenuRight from './LimitRigth'


//给数据增加key值，key=id
// function setKey(data) {
//     for (var i = 0; i < data.length; i++) {
//         data[i].key = data[i].id
//         if (data[i].children.length > 0) {
//             setKey(data[i].children)
//         } else {
//             //删除最后一级的children属性
//             delete data[i].children
//         }
//     }
// }
//表格表头信息
const columns = [{
    title: "菜单",
    dataIndex: "title",
}]
class WxManager extends React.Component {
    state = {
        selectedRowKeys: [], //左侧表格选中项keys
        loading: true,
        data: [],  //表格数据源
    }

    componentDidMount() {
        this.getPageList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.authorityId !== this.props.authorityId) {
            // console.log(nextProps)
        }
    }
    /**
     * 请求菜单列表 menu/system
     */
    getPageList(authorityId) {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        axios.get('/back/smallprogrammenu/system').then(({ data }) => {
            this.setState({
                data: data,
                loading: false,
            })
        })
        axios.get('/back/group/smallprogrammenu/authority', {
            params: {
                authorityId
            }
        }).then(res => res.data).then(res => {
            this.setState({
                selectedRowKeys: res.authority
            })
        })
    }
    //模态框确认按钮
    onOk = () => {
        let leftSelectId = this.state.selectedRowKeys
        //console.log(leftSelectId)
        this.props.onOk(leftSelectId)
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
        //console.log(selectedRowKeys)
        //this.menuRight.getPageList(selectedRowKeys[0])
        this.setState({ selectedRowKeys, selectedRows });
    };
    render() {
        //选择功能的配置。
        const rowSelection = {
            type: "checkbox",
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        return (
            <div>
                <Modal
                    title="小程序权限管理"
                    okText="保存"
                    confirmLoading={this.props.confirmLoading}
                    wrapClassName="vertical-center-modal"
                    visible={this.props.visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                    <Row gutter={10}>
                        <Col span={24}>
                            <Row>
                                <Col>
                                    <Table
                                        bordered
                                        defaultExpandAllRows
                                        pagination={false}
                                        loading={this.state.loading}
                                        columns={columns}
                                        rowKey={record => record.id}
                                        dataSource={this.state.data}
                                        rowSelection={rowSelection}
                                        onRowClick={this.onRowClick}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}
export default WxManager