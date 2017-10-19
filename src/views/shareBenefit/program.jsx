import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import SharedForm from "../../components/ModalForm/index";
import NormalForm from '../../components/NormalForm'
import '../../style/sharebenefit/reset-antd.less'

class ShareBenefitPage extends React.Component {
    state = {
        selectedRowKeys: [], 
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        columns: [{
            title: '序号',
            dataIndex: 'ordinal_id',
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

    _sloveRespData(dataSource){
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['ordinal_id'] = index + 1;

        })
       return dataSource;
    }

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                this.setState({
                    dataSource:  this._sloveRespData(dataSource)
                })
            })
    }

    _selectShareBenefitList(shareName){
        axios.get(`/back/frscheme/seach/${shareName}`).then((resp) => {
            console.log(resp)
            if( resp.data.rel ){
                const dataSource = resp.data.result;
                this.setState({
                    dataSource:  this._sloveRespData(dataSource)
                })
            }
        })
    }
    _deleteShareBenefitList(scheme){
        axios.delete(`/back/frscheme/remove/${scheme}`).then((resp) => {
            console.log(resp.data)
        })
    }

    _getPassWay(){
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }

    _addNewScheme(params){
        axios.post(`/back/frscheme/frscheme`,params).then((resp) => {
            console.log(resp.data)
        })
    }

    handlerDetail(){
        console.log('详情')
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            this._selectShareBenefitList(values.shareName)
        })
    }

    handleUpdate(){
        const keys = this.state.selectedRowKeys;
        const newData = {};
        const selectedKey = this.state.selectedRowKeys[0];
        console.log(selectedKey)
        for( const record in this.state.dataSource ){
            if( record.key === selectedKey ){
                console.log(record)
            }
        }
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
            item.ordinal_id = index + 1;
        })
        console.log(keys[0])
        this._deleteShareBenefitList(keys[0])
        this.setState({selectedRowKeys:[],dataSource:newDataSource})

    }

    showModal = () => {
        this.setState({
            visible: true
        });
        this._getPassWay()
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
            this._addNewScheme(values)
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
        const FormData = [
            {
                label: "姓名",
                placeholder: '姓名',
                getFile: "shareName",
                isSelect: false,
                options: ["目录一","目录二"]
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润方案" />
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
                    <Modal title="新增-分润方案" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible}>
                        <h3 className="title">基本信息</h3>
                        <SharedForm ref="form" onSubmit={this.handlerModalOk} options={this.state.passway}/>
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

export default ShareBenefitPage