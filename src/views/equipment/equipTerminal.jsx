import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Row, Col,  Button,  Card, Table, Modal, Icon, message } from 'antd'
import TerminalModal from "../../components/equipment/terminal/terminalModal";
import TerminalHeader from '../../components/equipment/terminal/TerminalHeader'
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
const confirm = Modal.confirm
class equipTerminal extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        modalTitle: '新增-设备终端信息',
        isUpdate: false,
        pagination: {},
        updateData: {},
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '设备终端名称',
            dataIndex: 'terminalName',
        },{
            title: '商户名称',
            dataIndex: 'merchantName',
        },{
            title: '设备条码',
            dataIndex: 'idcode',
        },{
            title: '设备品类',
            dataIndex: 'deviceName',
        },{
            title: '设备备注',
            dataIndex: 'desc',
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

    handlerSelect(limit=10,offset=1,terminalName='',merchantId=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/terminal/terminals?limit=${limit}&offest=${offset}&terminalName=${terminalName}&merchantId=${merchantId}`)
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
        const tabInfos = this.state.updateData;
        const params = Object.assign({},tabInfos,options)
        const newParams = {
            desc: params.desc,
            terminalName: params.terminalName,
            merchantId: params.merchantId,
            no: params.no,
            deviceId: params.deviceId,
            idcode: params.idcode
        }
        console.log(newParams)
        axios.post(`/back/terminal/terminal`,newParams)
            .then((resp) => {
                console.log(resp.data)
                const data = resp.data;
                if( data.rel ){
                    message.success('添加成功')
                    this.handlerSelect()
                }
            });
    }

    handleUpdate(options){
        const tabInfos = this.state.updateData;
        const params = Object.assign({},tabInfos,options)
        axios.put(`/back/terminal/${params.id}`,{
            desc: params.desc,
            terminalName: params.terminalName,
            merchantId: params.merchantId,
            no: params.no,
            deviceId: params.deviceId,
            idcode: params.idcode,
        })
            .then((resp) => {
                const data = resp.data;
                if( data.rel ){
                    message.success('修改成功')
                    this.handlerSelect()
                }
            })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = []
        keys.forEach((item) => {
            url.push(axios.delete(`/back/terminal/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc,pers)=>{
            if(acc.data.rel){
                message.success('删除成功')
                this.handlerSelect()
            }
        }))
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,terminalName=values.terminalName,merchantId=values.merchantId;
            this.handlerSelect(limit,offset,terminalName,merchantId)
        })
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerModalOk = (err,values) => {
        const isUpdate = this.state.isUpdate;
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
    showModal(status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-设备终端信息'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-设备终端信息'
            });
        }
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
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备终端" />
                <Card className="terminal-top-form">
                    <TerminalHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway}/>
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
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                        <h3 className="title">基本信息</h3>
                        <TerminalModal ref="form" onSubmit={this.handlerModalOk}/>
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

export default equipTerminal