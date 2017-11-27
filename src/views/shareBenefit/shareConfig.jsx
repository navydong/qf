import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, message } from 'antd'
import axios from 'axios'
import ConfigModal from "../../components/ShareBenefit/config/shareConfigModal";
import ConfigHeader from '../../components/ShareBenefit/config/ConfigHeader'
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'
const confirm = Modal.confirm
const defaultPageSize = 10;
class ShareConfig extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        current: 1,
        total: '',
        modalTitle: '新增-机构分润配置',
        isUpdate: false,
        tabInfos: {},
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '机构类型',
            dataIndex: 'typeName',
        },{
            title: '机构名称',
            dataIndex: 'sName',
        },{
            title: '分润方案名称',
            dataIndex: 'schemeName',
        },{
            title: '创建人',
            dataIndex: 'creatorId',
        },{
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'lastEditorid',
        },{
            title: '修改时间',
            dataIndex: 'lastEdittime'
        },{
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => {
                return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
            }
        }
        ]
    };

    componentWillMount(){
        this.handlerSelect();
    }

    handleMenuClick (record, e) {
        const self = this;
        if (e.key === '1') {
            console.log(record)
            let updateStatus = true;
            this.setState({ isUpdate: true,tabInfos: record })
            this.showModal(updateStatus)
        } else if (e.key === '2') {
            const arr = [];
            const id = record.id;
            arr.push(id)
            this.setState({ selectedRowKeys: arr})
            confirm({
                title: '确定要删除吗?',
                onOk () {
                    self.handleDelete()
                },
            })
        }
    }

    handlerSelect(limit=10,offset=1,schemeId='',sorgId=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/splitScheme/splitchemes?limit=${limit}&offest=${offset}&schemeId=${schemeId}&sorgId=${sorgId}`)
            .then((resp)=>{
                const dataSource = resp.data.rows,
                    total = resp.data.total;
                this.setState({
                    dataSource: sloveRespData(dataSource,'id'),
                    loading: false,
                    current: offset,
                    total
                })
            })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = []
        keys.forEach((item)=>{
            url.push(axios.delete(`/back/splitScheme/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc,pers)=>{
            if(acc.data.rel){
                message.success('删除成功')
                this.handlerSelect()
            }
        }))
    }

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},tabInfos,options)
        console.log(params)
        axios.put(`/back/splitScheme/${params.id}`,{
            'sorgId': params.sorgId,
            'ptype': params.ptype,
            'stype': params.stype,
            'schemeId': params.schemeId
        }).then(( resp ) => {
                const data = resp.data;
                if(data.rel){
                    window.location.reload()
                }
            })
    }

    handlerAdd(params){
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({},tabInfos,params)
        console.log(options)
        const newParams = {
            sorgId:options.sorgId,
            ptype:options.ptype,
            stype:options.ptype,
            schemeId:options.schemeId
        }
        axios.post(`/back/splitScheme/splitScheme`,newParams).then((resp) => {
            const data = resp.data;
            if(data.rel){
               window.location.reload();
            }
        })
    }


    showModal (status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-机构分润配置'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-机构分润配置',
                tabInfos: {}
            });
        }
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerModalOk = (err,values) => {
        const isUpdate  = this.state.isUpdate;
        this.refs.form.validateFields((err, values) => {
            if(err) return;
            if( isUpdate ){
                this.handleUpdate(values)
            }else{
                this.handlerAdd(values)
            }
            if(!err){
                this.handlerHideModal()
            }
        });
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            const limit = 10,offset=1,name=values.schemeId,sorgId=values.sorgId;
            this.handlerSelect(limit,offset,name,sorgId)
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    onShowSizeChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current)
    }

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }
    render(){
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = {
            defaultPageSize,
            current: this.state.current,
            total: this.state.total,
            onChange: this.handlerTableChange,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: (total, range) => `共${total}条数据`,
            showQuickJumper: true
        }
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="机构分润配置" />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row>
                        <Col span={8}>
                            <ConfigHeader ref="normalForm" onSubmit={this.handlerNormalForm} style={{float:'left'}}/>
                        </Col>
                        <div className={'header-left'}>
                            <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                            <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                        </div>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}} bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button
                                type="primary"
                                onClick={()=>{this.showModal()}}
                                className="btn-add"
                                size="large"
                                shape="circle"
                                icon="plus">
                            </Button>
                            <Button
                                onClick={()=>{this.handleDelete()}}
                                disabled={selectedRowKeys.length > 0 ? false : true}
                                className="btn-delete"
                                type="primary"
                                size="large"
                                shape="circle"
                                icon="delete" >
                            </Button>
                        </Col>
                    </Row>
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                        <h3 className="title">基本信息</h3>
                        <ConfigModal ref="form" onSubmit={this.handlerModalOk} tabInfos={this.state.tabInfos}/>
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table
                                rowSelection={rowSelection}
                                columns={this.state.columns}
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                                onChange={this.handlerTableChange}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default ShareConfig
