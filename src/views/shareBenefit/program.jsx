import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import ProgramModal from "../../components/ShareBenefit/program/index";
import ProgramHeader from '../../components/ShareBenefit/program/ProgramHeader'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
const confirm = Modal.confirm

class ShareBenefitPage extends React.Component {
    state = {
        selectedRowKeys: [], 
        loading: false,
        dataSource: [],
        pagination: {},
        visible: false,
        passway: [],
        tabInfos: {},
        updateData: {},
        modalTitle: '新增-分润方案',
        isUpdate: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        }, {
            title: '分润方案名称',
            dataIndex: 'schemeName',
        }, {
            title: '创建人',
            dataIndex: 'creatorId',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'lastEditorid',
        },{
            title: '修改时间',
            dataIndex: 'lastEdittime'
        },{
            title: '审核状态',
            dataIndex: 'checked'
        },{
            title: '审核人',
            dataIndex: 'checkerId'
        },{
            title: '审核时间',
            dataIndex: 'checkTime',
        }, {
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
        this._getPassWay()
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
        console.log(dataSource)
        if(!dataSource) return
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
       return dataSource;
    }

    _getPassWay(){
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }

    handlerSelect(limit=10,offset=1,name='',passwayid=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource:  this._sloveRespData(dataSource),
                    loading: false,
                    pagination
                })
            })
    }

    handlerAdd(params){
        const options = Object.assign({},params);
        axios.post(`/back/frscheme/frscheme`,options).then((resp) => {
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

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},options,tabInfos)
        console.log(params)
        axios.put(`/back/frscheme/${params.id}/${params.schemeName}/${params.passwayId}`)
            .then(( resp ) => {
               const data = resp.data;
               if(data.rel){
                   window.location.reload()
               }
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
                axios.delete(`/back/frscheme/remove/${param}`).then((resp) => {
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
            axios.delete(`/back/frscheme/remove/${keys[0]}`).then((resp) => {
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

    showModal(status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-分润方案'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-分润方案'
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

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit=10,offset=1,name=values.name;
            this.handlerSelect(limit,offset,name)
        })
    }

    render(){
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润方案" />
                <Card className="terminal-top-form">
                    <div className="header-left">
                        <ProgramHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                    </div>
                    <div className="header-left">
                        <Button type="primary" onClick={this.handlerNormalForm} className="gap-left">查询</Button>
                        <Button type="primary">重置</Button>
                    </div>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={() => {this.showModal()}}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleDelete()}} disabled={selectedRowKeys.length > 0 ? false : true}>
                                    <Icon type="delete" />{this.state.selectedRowKeys.length >1 ? '批量删除':'删除'}
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible}>
                        <h3 className="title">基本信息</h3>
                        <ProgramModal ref="form" onSubmit={this.handlerModalOk} options={this.state.passway}/>
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

export default ShareBenefitPage