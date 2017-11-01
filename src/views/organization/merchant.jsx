import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Row, Col,  Button,  Card, Table, Modal, Icon } from 'antd'
import MerchantModal from '../../components/organization/merchant/MerchantModal'
import MerchantHeader from '../../components/organization/merchant/MerchantHeader'
import BulkImport from '../../components/organization/merchant/BulkImport'
import "./merchant.less"
import DropOption from '../../components/DropOption/DropOption'
import { sloveRespData } from '../../utils/index'

const confirm = Modal.confirm
const defaultPageSize = 10;

class Merchant extends React.Component {
    state = {
        loading: false,
        visible: false,
        importVisible: false,
        passway: [],
        dataSource: [],
        selectedRowKeys: [],
        current: 1,
        total: '',
        modalTitle: '新增-商户基本信息',
        isUpdate: false,
        columns: [
            {
                title: "序号",
                dataIndex: 'order_id',
                render: (text, record) => <a href={record.url} target="_blank">{text}</a>
            },
            {
                title: "商户名称",
                dataIndex: 'merchantName'
            },
            {
                title: "商户简称",
                dataIndex: 'merchantStname'
            },
            {
                title: '受理机构',
                dataIndex: 'solveOran'
            },
            {
                title: '可用通道',
                dataIndex: 'passway_ids'
            },
            {
                title: '用户所在地区',
                dataIndex: 'region'
            },
            {
                title: '联系人姓名',
                dataIndex: 'linkman'
            },
            {
                title: '联系人手机',
                dataIndex: 'lkmphone'
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => {
                    return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
                }
            }
        ]
    }
    componentWillMount(){
        this.handlerSelect();
        this._getPassWay()
    }

    _sloveRespData(dataSource){
        if(!dataSource) return
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
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
            this.setState({ isUpdate: true,tabInfos: record })
            this.showModal(updateStatus)
            this.setState({
                updateData: record
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
        });
        axios.get(`/back/merchantinfoController/page?limit=${limit}&offset=${offset}&name=${name}`).then((resp) => {
            const dataSource = resp.data.rows;
            const total = resp.data.total;
            this.setState({
                dataSource: sloveRespData(dataSource),
                loading: false,
                current: offset,
                total
            })
        })
    }

    handlerAdd(params){
        const tabInfos = this.state.tabInfos;
        const options = Object.assign({},params,tabInfos)
        console.log(options)
        const newParams = {
            sorgId:options.sorgId,
            ptype:options.ptype,
            ptype:options.ptype,
            schemeId:options.schemeId
        }
        axios.post(`/back/splitScheme/splitScheme`,newParams).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if(data.rel){
                this._add(params);
            }
        })
    }
    _add(params){
        const newDataSource = [];
        for(const item of this.state.dataSource){
            newDataSource.push(item)
        }
        newDataSource.push(params)
        newDataSource.forEach((item,index) => {
            item.order_id = index + 1;
        })
        this.setState({
            dataSource: newDataSource
        })
       // window.location.reload();
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        const keySet = new Set(keys);
        let orgIds = '', orgCodes = '';
        for( const record of this.state.dataSource ){
            if(keySet.has(record.key)){
                orgIds = record.id;
                orgCodes = record.merCode;
            }
        }
        console.log(orgCodes)
        console.log(orgIds)
        this.setState({
            loading: true
        })
        if(keys.length > 1){
            var url = [];
            for(let param of keys){
                console.log(param)
                url.append(param)
            }
            console.log(url)
            axios.delete(`back/merchantinfoController/deleteByIds/${orgIds}/${orgCodes}`).then((resp) => {
                console.log(resp.data)
                this.setState({
                    loading: false
                })
                const data = resp.data;
                if( data.rel ){
                    this._delete(keys)
                }
            })
        }else{
            axios.delete(`back/merchantinfoController/deleteByIds/${orgIds}/${orgCodes}`).then((resp) => {
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
                newDataSource.push(record)
            }
        }
        newDataSource.forEach((item,index) => {
            item['order_id'] = index + 1;
        })
    }

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},options,tabInfos)
        console.log(params)
        axios.put(`/back/splitScheme/splitScheme/
            ${params.id}/${params.schemeName}/${params.sorgId}/
            ${params.ptype}/${params.stype}/${params.schemeId}
        `).then(( resp ) => {
            const data = resp.data;
            if(data.rel){
                window.location.reload()
            }
        })
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    showModal (status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-商户基本信息'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-商户基本信息'
            });
        }
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerImportHider = (e) => {
        console.log(e)
        this.setState({
            importVisible: false
        })
    }

    handlerModalOk = (err,values) => {
        const isUpdate  = this.state.isUpdate;
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

    handlerClickImport = () => {
        this.setState({
            importVisible: true
        })
    }



    handlerImportOk = (err,values) => {
        this.refs.form.validateFields((err,values) => {
            console.log(values)
            if(!err){
                this.handlerImportHider()
            }
        })
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.merchantName;
            this.handlerSelect(limit,offset,name)
        })
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

     render(){
        const {selectedRowKeys} = this.state;
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
            <div className="merchant-wrapper">
                <BreadcrumbCustom first="机构信息" second="商户" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <MerchantHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                            <div className="fr gap-top-down">
                                <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                                {/*<Button type="primary" onClick={this.handlerClickImport}>批量导入</Button>*/}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Modal title={'批量导入商户基本信息'} onOk={this.handlerImportOk} onCancel={this.handlerImportHider} visible={this.state.importVisible} >
                                <BulkImport ref="form" onSubmit={this.handlerImportOk}/>
                            </Modal>
                        </Col>
                    </Row>
                </Card>
                <Card style={{marginTop:12}}>
                    <Row gutter={12}>
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
                    <Row className="gap-top">
                        <Col span={24}>
                            <Table
                                bordered
                                rowSelection={rowSelection}
                                columns={this.state.columns}
                                dataSource={this.state.dataSource}
                                pagination= {pagination}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={750}>
                                <MerchantModal ref="form" onSubmit={this.handlerModalOk} passway={this.state.passway}/>
                            </Modal>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Merchant