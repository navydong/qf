import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import ShareModal from "../../components/shareModal/index";
import NormalForm from '../../components/NormalForm'
import '../../style/sharebenefit/reset-antd.less'

class ShareDetail extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        passway: [],
        formData: [
            {
                label: "分润方案名称",
                placeholder: '请选择',
                getFile: "schemeName",
                isSelect: true,
                options: []
            },
            {
                label: "可用通道",
                placeholder: '请选择',
                getFile: "passwayId",
                isSelect: true,
                options: []
            }
        ],
        visible: false,
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
        this._getPasswayList()
    }

    _sloveRespData(dataSource){
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frschemeDetail/schemedetails?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                console.log(resp.data)
                this.setState({
                    dataSource: this._sloveRespData(dataSource)
                })
            })
    }

    _deleteShareBenefitList(scheme){
        axios.delete(`/back/frschemeDetail/remove/${scheme}`).then((resp) => {
            console.log(resp.data)
        })
    }

    _getPasswayList(){
        axios.get(`/back/passway/page`).then((resp)=>{
            const list = resp.data.rows;
            const { formData } = this.state;
            const newFormData = [];
            for( const record of formData ){
                list.forEach((item) => {
                    record.options.push(item)
                })
                newFormData.push(record)
            }
            console.log(newFormData)
            this.setState({
                formData: newFormData,
                passway: list
            })
        })
    }

    handlerDetail(){
        console.log('详情')
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.shareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
        })
    }

    handleUpdate(){
        console.log('bb')
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
        console.log(keys[0])
        this._deleteShareBenefitList(keys[0])
        this.setState({selectedRowKeys:[],dataSource:newDataSource})
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
            const limit = 10,offset=1,name=values.newShareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
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
                            <NormalForm ref="normalForm" onSubmit={this.handlerNormalForm} data={this.state.formData}/>
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
                                <Button type="primary" onClick={()=>{this.handleDelete()}}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Modal title="新增-分润方案" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={800}>
                        <h3 className="title">基本信息</h3>
                        <ShareModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway}/>
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table bordered rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default ShareDetail