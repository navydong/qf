import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import ConfigModal from "../../components/shareModal/shareConfigModal";
import NormalForm from '../../components/NormalForm'
import '../../style/sharebenefit/reset-antd.less'
class ShareConfig extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '上级机构类型',
            dataIndex: 'typeName',
        },{
            title: '上级机构名称',
            dataIndex: 'sName',
        },{
            title: '下级机构类型',
            dataIndex: 'downMerchantTypes',
        },{
            title: '下级机构名称',
            dataIndex: 'downMerchantName',
        },{
            title: '分润方案名称',
            dataIndex: 'schemeName',
        },{
            title: '创建人',
            dataIndex: 'createPerson',
        },{
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'changePerson',
        },{
            title: '修改时间',
            dataIndex: 'lastEdittime'
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
    }

    _sloveRespData(dataSource){
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }
    _getShareBenefitList(limit=10,offset=1,schemeId='',sorgId=''){
        axios.get(`/back/splitScheme/splitchemes?limit=${limit}&offest=${offset}&schemeId=${schemeId}&sorgId=${sorgId}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                this.setState({
                    dataSource: this._sloveRespData(dataSource)
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
        this.setState({selectedRowKeys:[],dataSource:newDataSource})
    }

    showModal = () => {
        console.log('新增')
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
        const FormData = [
            {
                label: "编号",
                placeholder: '编号',
                getFile: "numbering",
                isSelect: false
            },
            {
                label: "姓名",
                placeholder: '请选择',
                getFile: "username",
                isSelect: false
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="机构分润配置" />
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
                    <Modal title="新增-机构分润配置" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                        <h3 className="title">基本信息</h3>
                        <ConfigModal ref="form" onSubmit={this.handlerModalOk}/>
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
export default ShareConfig