import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Row, Col,  Button,  Card, Table, Modal, Icon } from 'antd'
import CategoryModal from "../../components/equipment/category/CategoryModal";
import CategoryHeader from '../../components/equipment/category/CategoryHeader'
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
const confirm = Modal.confirm

class equipCategory extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        modalTitle: '新增-设备品类信息',
        isUpdate: false,
        pagination: {},
        current: 1,
        total: '',
        tabInfos: {},
        columns: [{
            title: '序号',
            dataIndex: 'id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '设备终端名称',
            dataIndex: 'terminalName',
        },{
            title: '创建人',
            dataIndex: 'createPerson',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'changePerson',
        },{
            title: '修改时间',
            dataIndex: 'changeTime'
        },{
            title: '审核状态',
            dataIndex: 'checkStatus'
        },{
            title: '审核人',
            dataIndex: 'checkPerson'
        },{
            title: '审核时间',
            dataIndex: 'checkTime',
        },
            {
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
    _getPassWay(){
        axios.get(`/back/passway/page`).then((resp) => {
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
            let updateState = true;
            this.showModal(updateState)
            this.setState({
                updateData: record,
                isUpdate: true
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


    handlerSelect(limit=10,offset=1,name=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/device/page?limit=${limit}&offest=${offset}&name=${name}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: sloveRespData(dataSource,'id'),
                    pagination,
                    loading: false
                })
            })
    }
    handlerAdd(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},options,tabInfos)
        const newParams = {
            deviceName: params.deviceName,
        }
        axios.post(`/back/device/device`,newParams)
            .then((resp) => {
                console.log(resp.data)
                const data = resp.data;
                if( data.rel ){
                    this._add(params);
                }
            });
    }

    _add(params){
        const newDataSource = [];
        for(const record of this.state.dataSource){
            newDataSource.push(record)
        }
        const options = Object.assign({},params);
        newDataSource.push(options)
        newDataSource.forEach((item,index) => {
            item['order_id'] = index + 1;
        })
        this.setState({
            dataSource: newDataSource
        })
        window.location.reload();
    }

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},options,tabInfos)
        axios.put(`/back/device/${params.id}/${params.deviceName}`)
            .then((resp) => {
                const data = resp.data;
                if( data.rel ){
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
                axios.delete(`/back/device/remove/${param}`).then((resp) => {
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
            axios.delete(`/back/device/remove/${keys[0]}`).then((resp) => {
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

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.deviceName;
            this.handlerSelect(limit,offset,name)
        })
    }


    handlerModalOk = (err,values) => {
        const isUpdate = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.form.validateFields((err, values) => {
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
    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    showModal(status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-设备品类信息'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-设备品类信息'
            });
        }
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    render(){
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备品类信息" />
                <Card className="terminal-top-form">
                    <CategoryHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                    <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                    <Button type="primary">重置</Button>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}}>
                    <Row>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={()=>{this.showModal()}}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleDelete()}} disabled={selectedRowKeys.length > 0 ? false : true}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={400}>
                        <h3 className="title">基本信息</h3>
                        <CategoryModal ref="form" onSubmit={this.handlerModalOk}  passway={this.state.passway}/>
                    </Modal>
                    <Row style={{marginTop: 16}}>
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

export default equipCategory