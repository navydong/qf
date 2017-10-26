import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon, Popconfirm } from 'antd'
import axios from 'axios'
import ShareModal from "../../components/shareModal/index";
import DetailHeader from '../../components/ShareBenefit/detail/DetailHeader'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
const confirm = Modal.confirm
class ShareDetail extends React.Component {
    state = {
        selectedRowKeys: [],
        dataSource: [],
        frscheme: [],
        industry: [],
        visible: false,
        modalTitle: '新增-分润明细',
        isUpdate: false,
        pagination: {},
        loading: false,
        updateData: {},
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '分润方案名称',
            dataIndex: 'schemeName',
        },{
            title: '交易金额下限',
            dataIndex: 'tradesumLow',
        },{
            title: '交易金额上限',
            dataIndex: 'tradesumHigh',
        },{
            title: '交易笔数下限',
            dataIndex: 'tradetimeLow',
        },{
            title: '交易笔数上限',
            dataIndex: 'tradetimeHigh',
        },{
            title: '费率',
            dataIndex: 'rate',
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
        this._getFrscheme();
        this._getIndustry();
    }

    _getFrscheme(){
        axios.get(`/back/frscheme/schemes`).then((resp) => {
            const frscheme = resp.data.rows;
            console.log(frscheme)
            this.setState({
                frscheme
            })
        })
    }

    _getIndustry(){
        axios.get(`/back/industry/industrys`).then((resp) => {
            const industry = resp.data.rows;
            console.log(industry)
            this.setState({
                industry
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

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit=10,offset=1,schemeId = values.schemeId;
            this.handlerSelect(limit,offset,schemeId)
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

    handlerAdd(params){
        axios.post(`/back/frschemeDetail/frschemeDetail`,params)
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

    handlerSelect(limit=10,offset=1,schemeId='',sorgId=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/frschemeDetail/schemedetails?limit=${limit}&offest=${offset}&schemeId=${schemeId}&sorgId=${sorgId}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: sloveRespData(dataSource),
                    pagination,
                    loading: false
                })
            })
    }

    handleUpdate(params){
        axios.put(`/back/frschemeDetail/${params.id}/${params.schemeId}/${params.tradesumLow}/${params.industryId}
                   /${params.tradesumHigh}/${params.tradetimeLow}/${params.tradetimeHigh}/${params.rate}`)
            .then((resp) => {
                const data = resp.data;
                if( data.rel ){
                    window.location.reload()
                }
            })
    }

    showModal ( status ) {
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-分润方案明细'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-分润方案明细'
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
                <BreadcrumbCustom first="分润管理" second="分润方案明细" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <DetailHeader ref="normalForm" onSubmit={this.handlerNormalForm}  frscheme={this.state.frscheme}/>
                            <Button type="primary" onClick={this.handlerNormalForm} className="gap-left">查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={() => {this.showModal()}}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Popconfirm title="确定要删除这条信息吗?" onConfirm={() =>{this.handleDelete()} }>
                                    <Button type="primary">
                                        <Icon type="delete" />{this.state.selectedRowKeys.length >1 ? '批量删除':'删除'}
                                    </Button>
                                </Popconfirm>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title={ this.state.modalTitle } onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={800}>
                        <h3 className="title">基本信息</h3>
                        <ShareModal ref="form" onSubmit={this.handlerModalOk}  frscheme={this.state.frscheme} update={this.state.updateData} industry={this.state.industry} />
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table bordered
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

export default ShareDetail