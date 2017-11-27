import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon, message } from 'antd'
import axios from 'axios'
import ServiceModal from "../../components/organization/service/ServiceModal";
import ServiceHeader from '../../components/organization/service/ServiceHeader'
import "./merchant.less"
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'
const defaultPageSize = 10;
const confirm = Modal.confirm

class Service extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        passway: [],
        current: 1,
        total: '',
        modalTitle: '新增-服务机构信息',
        isUpdate: false,
        tabInfos: {},
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        }, {
            title: '服务商名称',
            dataIndex: 'facname',
        }, {
            title: '服务商简称',
            dataIndex: 'facstname',
        },{
            title: '可用通道',
            dataIndex: 'passwayNames',
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
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => {
                return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
            }
        }
        ]
    };

    componentWillMount(){
        this._getPassWay()
        this.handlerSelect();
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
            let updateStatus = true;
            this.setState({ tabInfos: record })
            this.showModal(updateStatus)
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
        axios.get(`/back/facilitator/findFacilitators?limit=${limit}&offest=${offset}&orgName=${orgName}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                const total = resp.data.total;
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
        const options = Object.assign({},tabInfos,params)
        if(options.hasOwnProperty('passwayIds') && options.passwayIds !== undefined){
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }

        if( options.cert){
            options['cert'] = options.cert.file.response.msg
        }

        if( options.front ){
            console.log('front')
            options['front'] = options.front.file.response.msg
        }

        if( options.back){
            options['back'] = options.back.file.response.msg
        }

        console.log(options)
        axios.post(`/back/facilitator/saveAndUpload`,options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if(data.rel){
                window.location.reload()
            }
        })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = [],self = this;
        keys.forEach((item) => {
            url.push(axios.delete(`/back/facilitator/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc,pers)=>{
            if(acc.data.rel){
                message.success('删除成功')
                this.handlerSelect()
            }
        }))
    }

    handleUpdate(params){
        const tabInfos = this.state.tabInfos;
        const  options = Object.assign({},tabInfos,params)
        delete options.passwayNames
        if(options.hasOwnProperty('passwayIds') && options.passwayIds !== undefined){
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }

        if( options.cert && options.cert.file !== undefined){
            console.log(options.cert)
            options['cert'] = options.cert.file.response.msg
        }

        if( options.front && options.front.file !== undefined){
            console.log('front')
            options['front'] = options.front.file.response.msg
        }

        if( options.back && options.back.file !== undefined){
            options['back'] = options.back.file.response.msg
        }
        console.log(options)
        axios.put(`/back/facilitator/updateInfo`,options).then(( resp ) => {
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
                modalTitle: '修改-服务机构信息',
                isUpdate: true
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-服务机构信息',
                isUpdate: false,
                tabInfos: {}
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
        this.refs.form.validateFields((err, fieldsValue) => {
            if(err) return;
            let values = null;
            if( fieldsValue.idendtstart && fieldsValue.idendtend){
                values = {
                    ...fieldsValue,
                    'idendtstart': fieldsValue['idendtstart'].format('YYYY-MM-DD'),
                    'idendtend': fieldsValue['idendtend'].format('YYYY-MM-DD')
                }
            }else{
                values = {
                    ...fieldsValue
                }
            }
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

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }
    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit=10,offset=1,orgName=values.facname;
            this.handlerSelect(limit,offset,orgName)
        })
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
                <BreadcrumbCustom first="机构管理" second="服务商信息" />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row gutter={12}>
                        <Col>
                            <ServiceHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway}/>
                            <div className="fr">
                                <Button type="primary" onClick={this.handlerNormalForm}  className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
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
                    <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible}>
                        <ServiceModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway} isUpdate={this.state.isUpdate} tabInfos={this.state.tabInfos}/>
                    </Modal>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table
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

export default Service
