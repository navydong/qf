import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon, Popconfirm } from 'antd'
import axios from 'axios'
import ShareModal from "../../components/shareModal/index";
import DetailHeader from '../../components/ShareBenefit/detail/DetailHeader'
import '../../style/sharebenefit/reset-antd.less'

class ShareDetail extends React.Component {
    state = {
        selectedRowKeys: [],
        dataSource: [],
        passway: [],
        frscheme: [],
        loading: false,
        visible: false,
        pagination: {},
        loading: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '分润方案名称',
            dataIndex: 'schemeName',
        },{
            title: '可用通道',
            dataIndex: 'passageway',
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
        this._getFrscheme()
        this._getPassway()
    }

    _sloveRespData(dataSource){
        dataSource.forEach((item,index) => {
            console.log(item.id)
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/frschemeDetail/schemedetails?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: this._sloveRespData(dataSource),
                    pagination,
                    loading: false
                })
            })
    }

    _deleteShareBenefitList(scheme){
        if(scheme.length > 1){
            for(let param of scheme){
                console.log(param)
                axios.delete(`/back/frschemeDetail/remove/${param}`).then((resp) => {
                    console.log(resp.data)
                })
            }
        }else{
            axios.delete(`/back/frschemeDetail/remove/${scheme[0]}`).then((resp) => {
                console.log(resp.data)
            })
        }
    }

    _selectFrsheme(id){
        axios.get(`/back/frschemeDetail/seach/${id}`).then((resp) => {
            console.log(resp.data)
        })
    }

    _getPassway(){
        axios.get(`/back/passway/page`).then((resp)=>{
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
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
    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this._getShareBenefitList(limit,offset)
    }
    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const id = values.schemeId
            this._selectFrsheme(id)
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
        newDataSource.forEach((item,index) => {
            item.order_id = index + 1;
        })
        this._deleteShareBenefitList(keys)
        this.setState({selectedRowKeys:[],dataSource:newDataSource})

    }

    handlerAdd(params){
        const newDataSource = [];
        for(const record of this.state.dataSource){
            newDataSource.push(record)
        }
        const options = Object.assign({},params);
        newDataSource.push(options)
        newDataSource.forEach((item,index) => {
            item['order_id'] = index + 1;
        })

        axios.post(`/back/frschemeDetail/frschemeDetail`,params)
            .then((resp) => {
                console.log(resp.data)
            });
        this.setState({
            dataSource: newDataSource
        })
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerModalOk = (err,values) => {
        this.refs.form.validateFields((err, values) => {
            console.log(values)
            this.handlerAdd(values);
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
                            <DetailHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway} frscheme={this.state.frscheme}/>
                            <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={this.showModal}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleUpdate()}}>
                                    <Icon type="edit" /> 修改
                                </Button>
                                <Popconfirm title="确定要删除这条信息吗?" onConfirm={() =>{this.handleDelete()} }>
                                    <Button type="primary">
                                        <Icon type="delete" />{this.state.selectedRowKeys.length >1 ? '批量删除':'删除'}
                                    </Button>
                                </Popconfirm>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title="新增-新增分润明细" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={800}>
                        <h3 className="title">基本信息</h3>
                        <ShareModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway} frscheme={this.state.frscheme}/>
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