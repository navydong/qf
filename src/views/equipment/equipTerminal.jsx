import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Row, Col,  Button,  Card, Table, Modal, Icon } from 'antd'
import TerminalModal from "../../components/TerminalModal/terminalModal";
import NormalForm from '../../components/NormalForm'

class equipTerminal extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        columns: [{
            title: '序号',
            dataIndex: 'id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '设备终端名称',
            dataIndex: 'terminalName',
        },{
            title: '商户名称',
            dataIndex: 'merchantName',
        },{
            title: '设备条码',
            dataIndex: 'barcode',
        },{
            title: '设备品类',
            dataIndex: 'termimalTypes',
        },{
            title: '设备备注',
            dataIndex: 'terminalRemark',
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
                render: text => (
                    <div>
                        <Button type="primary" htmlType="submit" onClick={() => this.handlerDetail()}>详细</Button>
                    </div>
                )
            }
        ]
    };
    componentWillMount(){
        this._getShareBenefitList();
    }

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                //const dataSource = resp.data.result.list;
                this.setState({
                    dataSource: []
                })
            })
    }

    handlerDetail(){
        console.log()
    }
    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.shareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
        })
    }
    handleInsert(){
        console.log('aa')
    }

    handleUpdate(){
        console.log('bb')
    }
    handleDelete(){
        console.log('cc')
    }
    handlerModalOk = (err,values) => {
        this.refs.form.validateFields((err, values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.newShareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
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

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        const newDataSource = [];
        const keySet = new Set(keys);
        for( const record of this.state.dataSource ){
            if(!keySet.has(record.key)){
                newDataSource.push(record);
            }
        }
        this.setState({selectedRowKeys:[],dataSource:newDataSource})
    }
    showModal = () => {
        this.setState({
            visible: true
        });
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
        const FormData = [
            {
                label: "设备终端名称",
                placeholder: '设备终端名称',
                getFile: "terminalName",
                isSelect: false
            },
            {
                label: "商户名称",
                placeholder: '商户名称',
                getFile: "merchantName",
                isSelect: true,
                options: ["商户A","商户B","商户C","商户H","商户E","商户I"]
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备终端" />
                <Card className="terminal-top-form">
                    <NormalForm ref="normalForm" onSubmit={this.handlerNormalForm} data={FormData}/>
                    <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                    <Button type="primary">重置</Button>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}}>
                    <Row>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                    <Button type="primary" onClick={this.showModal}>
                                        <Icon type="plus-circle-o" />新增
                                    </Button>
                                    <Button type="primary" onClick={()=>{this.handleUpdate()}}>
                                        <Icon type="edit" /> 修改
                                    </Button>
                                    <Button type="primary" onClick={()=>{this.handleDelete()}}>
                                        <Icon type="delete" />删除
                                    </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title="新增-设备终端信息" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                        <h3 className="title">基本信息</h3>
                        <TerminalModal ref="form" onSubmit={this.handlerModalOk}/>
                    </Modal>
                   <Row style={{marginTop: 16}}>
                       <Col span={24}>
                           <Table bordered rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} />
                       </Col>
                   </Row>
                </Card>
            </div>
        )
    }
}

export default equipTerminal