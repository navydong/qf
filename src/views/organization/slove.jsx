import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import SloveHeader from '../../components/organization/slove/SloveHeader'
import SloveModal from "../../components/organization/slove/SloveModal";
import Request from '../../utils/Request'
import { sloveRespData } from '../../utils/index'
import "./merchant.less"
import DropOption from '../../components/DropOption/DropOption'
import Qs from 'qs'
const confirm = Modal.confirm
const token = localStorage.getItem('token')
const defaultPageSize = 10;
class Slove extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        current: 1,
        total: '',
        modalTitle: '新增-受理机构信息',
        isUpdate: false,
        tabInfos: {},
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        }, {
            title: '受理机构名称',
            dataIndex: 'orgname',
        }, {
            title: '受理机构简称',
            dataIndex: 'orgstname',
        },{
            title: '可用通道',
            dataIndex: 'passwayIds',
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
        this._getPassWay();
    }

    _getPassWay(){
        axios.get(`/back/passway/page`,{
            headers: {
                'access-token': token
             }
            }).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
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

    handlerSelect(limit=10,offset=1,orgName=''){
        this.setState({
            loading: true
        })
        const params = {
            url: '/back/accepagent/findAccepagents',
            params: {
                limit: limit,
                offset: offset,
                orgName: orgName
            }
        }
        new Request(params).select()
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
        axios.post(`/back/accepagent/saveAndUpload`,options).then((resp) => {
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

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        this.setState({
            loading: true
        })
        if(keys.length > 1){
            for(let param of keys){
                console.log(param)
                axios.delete(`/back/accepagent/remove/${param}`).then((resp) => {
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
            axios.delete(`/back/accepagent/remove/${keys[0]}`).then((resp) => {
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
        axios.put(`/back/accepagent/updateInfo`,params).then(( resp ) => {
            const data = resp.data;
            if(data.rel){
                window.location.reload()
            }
        })
    }

    showModal (status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-受理机构信息'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-受理机构信息'
            });
        }
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerModalOk = (err,fieldsValue) => {
        const isUpdate  = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.form.validateFields((err, fieldsValue) => {
            if(err) return;
            console.log(fieldsValue.idendtstart)
            let values = null;
            if(fieldsValue.idendtstart){
                values = {
                    ...fieldsValue,
                    'idendtstart': fieldsValue['idendtstart'].format('YYYY-MM-DD'),
                    'idendtend': fieldsValue['idendtend'].format('YYYY-MM-DD')
                }
            }else{
                values = fieldsValue
            }
            console.log(values)
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

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handlerHeaderForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,orgName=values.orgname;
            this.handlerSelect(limit,offset,orgName)
        })
    }

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }

    onShowSizeChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current)
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
                <BreadcrumbCustom first="机构管理" second="受理机构信息" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <SloveHeader ref="normalForm" onSubmit={this.handlerHeaderForm} passway={this.state.passway}/>
                            <div className='fr'>
                                <Button type="primary" onClick={this.handlerHeaderForm}>查询</Button>
                                <Button type="primary">重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={()=>{ this.showModal() }}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleDelete()}} disabled={selectedRowKeys.length > 0 ? false : true}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible}>
                        <SloveModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway} tabInfos={this.state.tabInfos}/>
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table
                                bordered
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

export default Slove