import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon, Popconfirm } from 'antd'
import axios from 'axios'
import DetailModal from "../../components/ShareBenefit/detail/index";
import DetailHeader from '../../components/ShareBenefit/detail/DetailHeader'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
const defaultPageSize = 10
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
        current: 1,
        total: '',
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

    onShowSizeChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current)
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit=10,offset=1,schemeId = values.schemeId,industryId = values.industryId;
            this.handlerSelect(limit,offset,schemeId,industryId)
        })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = [];
        keys.forEach((item)=>{
            url.push(axios.delete(`/back/frschemeDetail/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc,pers)=>{
            if(acc.data.rel){
                window.location.reload()
            }
        }))

    }
    handlerAdd(params){
        axios.post(`/back/frschemeDetail/frschemeDetail`,{
            "schemeId": params.schemeId,
            "tradesumLow": params.tradesumLow,
            "industryId": params.industryId,
            "tradesumHigh": params.tradesumHigh,
            "tradetimeLow": params.tradetimeLow,
            "tradetimeHigh": params.tradetimeHigh,
            "rate": params.rate
        })
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

    handlerSelect(limit=10,offset=1,schemeId='',industryId=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/frschemeDetail/schemedetails?limit=${limit}&offest=${offset}&schemeId=${schemeId}&industryId=${industryId}`)
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

    handleUpdate(options){
        const updateData = this.state.updateData;
        const params = Object.assign({},updateData,options)
        axios.put(`/back/frschemeDetail/${params.id}`,{
            "schemeId": params.schemeId,
            "tradesumLow": params.tradesumLow,
            "industryId": params.industryId,
            "tradesumHigh": params.tradesumHigh,
            "tradetimeLow": params.tradetimeLow,
            "tradetimeHigh": params.tradetimeHigh,
            "rate": params.rate
        })
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

    handleReset = () => {
        this.refs.normalForm.resetFields();
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
                <BreadcrumbCustom first="分润管理" second="分润方案明细" />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row gutter={12}>
                        <Col>
                            <div className={'header-right'}>
                                <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                            <DetailHeader ref="normalForm" onSubmit={this.handlerNormalForm}  frscheme={this.state.frscheme} industry={this.state.industry}/>
                        </Col>
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
                    <Modal title={ this.state.modalTitle } onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={800}>
                        <h3 className="title">基本信息</h3>
                        <DetailModal ref="form" onSubmit={this.handlerModalOk}  frscheme={this.state.frscheme} update={this.state.updateData} industry={this.state.industry} />
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table bordered
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

export default ShareDetail