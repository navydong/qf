import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import ConfigModal from "../../components/shareModal/shareConfigModal";
import NormalForm from '../../components/NormalForm'
import DropOption from '../../components/DropOption/DropOption'
import '../../style/sharebenefit/reset-antd.less'
const confirm = Modal.confirm

class ShareConfig extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        pagination: {},
        modalTitle: '新增-机构分润配置',
        isUpdate: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '机构类型',
            dataIndex: 'ptype',
        },{
            title: '机构名称',
            dataIndex: 'sName',
        },{
            title: '机构类型名称',
            dataIndex: 'typeName',
        },{
            title: '分润方案名称',
            dataIndex: 'schemeName',
        },{
            title: '创建人',
            dataIndex: 'createPerson',
        },{
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'changePerson',
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
            this.setState({
                updateData: record
            })
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

    _sloveRespData(dataSource){
        if(!dataSource) return;
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    handlerSelect(limit=10,offset=1,schemeId='',sorgId=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/splitScheme/splitchemes?limit=${limit}&offest=${offset}&schemeId=${schemeId}&sorgId=${sorgId}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: this._sloveRespData(dataSource),
                    loading: false,
                    pagination
                })
            })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        this.setState({
            loading: true
        })
        if(keys.length > 1){
            for(let param of keys){
                console.log(param)
                axios.delete(`/back/frschemeDetail/remove/${param}`).then((resp) => {
                    console.log(resp.data)
                    this.setState({
                        loading: false
                    })
                    const data = resp.data;
                    if( data.rel ){
                        this._delete(keys)
                    }
                })
            }
        }else{
            axios.delete(`/back/frschemeDetail/remove/${keys[0]}`).then((resp) => {
                console.log(resp.data)
                const data = resp.data;
                this.setState({
                    loading: false
                })
                if( data.rel ){
                    this._delete(keys)
                }
            })
        }
    }

    _delete(keys){
        const newDataSource = [];
        const keySet = new Set(keys);
        for( const record of this.state.dataSource ){
            if(!keySet.has(record.key)){
                newDataSource.push(record);
            }
        }
        newDataSource.forEach((item,index) => {
            item.order_id = index + 1;
        })
        this.setState({selectedRowKeys:[],dataSource:newDataSource})
    }

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},options,tabInfos)
        console.log(params)
        axios.put(`/back/splitScheme/splitScheme/
            ${params.id}/${params.schemeName}/${params.sorgId}/
            ${params.ptype}/${params.stype}/${params.schemeId}
        `).then(( resp ) => {
                const data = resp.data;
                if(data.rel){
                    window.location.reload()
                }
            })
    }

    handlerAdd(params){
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({},params,tabInfos)
        console.log(options)
        const newParams = {
            sorgId:options.sorgId,
            ptype:options.ptype,
            ptype:options.ptype,
            schemeId:options.schemeId
        }
        axios.post(`/back/splitScheme/splitScheme`,newParams).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if(data.rel){
                this._add(params);
            }
        })
    }
    _add(params){
        const newDataSource = [];
        for(const item of this.state.dataSource){
            newDataSource.push(item)
        }
        newDataSource.push(params)
        newDataSource.forEach((item,index) => {
            item.order_id = index + 1;
        })
        this.setState({
            dataSource: newDataSource
        })
        window.location.reload();
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
                modalTitle: '新增-机构分润配置'
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
        console.log(isUpdate)
        this.refs.form.validateFields((err, values) => {
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

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.shareName,sorgId=values.sorgId;
            this.handlerSelect(limit,offset,name,sorgId)
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

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
        const FormData = [
            {
                label: "编号",
                placeholder: '编号',
                getFile: "schemeId",
                isSelect: false
            },
            {
                label: "姓名",
                placeholder: '请选择',
                getFile: "sorgId",
                isSelect: false
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="机构分润配置" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <NormalForm ref="normalForm" onSubmit={this.handlerNormalForm} data={FormData}/>
                            <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={()=>{this.showModal()}}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleDelete()}}>
                                    <Icon type="delete" />{this.state.selectedRowKeys.length >1 ? '批量删除':'删除'}
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title="新增-机构分润配置" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                        <h3 className="title">基本信息</h3>
                        <ConfigModal ref="form" onSubmit={this.handlerModalOk}/>
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table
                                bordered
                                rowSelection={rowSelection}
                                columns={this.state.columns}
                                dataSource={this.state.dataSource}
                                pagination={this.state.pagination}
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