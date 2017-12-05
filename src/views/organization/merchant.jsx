import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Row, Col,  Button,  Card, Table, Modal, Icon, message } from 'antd'
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
        tabInfos: {},
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
                dataIndex: 'merCode'
            },
            {
                title: '可用通道',
                dataIndex: 'passwayNames'
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
                    return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' },{key: '3',name: '交易明细'}]} />
                }
            }
        ]
    }
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
            let updateStatus = true;
            this.setState({ isUpdate: true,tabInfos: record })
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
        } else if(e.key === '3'){
            const id = record.id;
            this.props.router.push(`/app/reportQuert/tradeBlotter/${id}`)
        }
    }

    handlerSelect(limit=10,offset=1,name='',linkman='',lkmphone=""){
        this.setState({
            loading: true
        });
        axios.get(`/back/merchantinfoController/page?limit=${limit}&offset=${offset}&name=${name}&linkman=${linkman}&lkmphone=${lkmphone}`).then((resp) => {
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
        if(options.hasOwnProperty('region')){
            let params = options.region.join(',')
            options['region'] = params
        }

        if(options.hasOwnProperty('passwayIds') && options.passwayIds !== undefined ){
            let params = options.passwayIds.join(',')
            options['passwayIds'] = params
        }

        if( options.buslicence){
            options['buslicence'] = options.buslicence.file.response.msg
        }

        if( options.orgcode ){
            console.log('front')
            options['orgcode'] = options.orgcode.file.response.msg
        }

        if( options.lawholder){
            options['lawholder'] = options.lawholder.file.response.msg
        }

        if( options.front ){
            options['front'] = options.front.file.response.msg
        }

        if( options.back){
            options['back'] = options.back.file.response.msg
        }

        if( options.frontid ){
            options['frontid'] = options.frontid.file.response.msg
        }

        if( options.backid){
            options['backid'] = options.backid.file.response.msg
        }

        if( options.spequalifione){
            options['spequalifione'] = options.spequalifione.file.response.msg
        }

        if( options.spequalifitwo ){
            console.log('spequalifitwo')
            options['spequalifitwo'] = options.spequalifitwo.file.response.msg
        }

        if( options.spequalifithree){
            options['spequalifithree'] = options.spequalifithree.file.response.msg
        }

        if( options.spequalififour){
            options['spequalififour'] = options.spequalififour.file.response.msg
        }

        if( options.spequalififive){
            options['spequalififive'] = options.spequalififive.file.response.msg
        }

        axios.post(`/back/merchantinfoController/save `,options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if(data.rel){
                this.handlerSelect()
            }
        })
    }

    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = []
        keys.forEach((item)=>{
            url.push(axios.delete(`back/merchantinfoController/deleteByIds/${item}`))
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
        const options = Object.assign({},tabInfos,params)
        delete options.passwayNames
        delete options.lastEditorid
        delete options.lastEdittime
        delete options.createTime
        delete options.deleted
        delete options.status
        console.log(options)
        if(Array.isArray(options.passwayIds)){
          options['passwayIds'] = options.passwayIds.join(',');
        }

        if(options.hasOwnProperty('region')){
            let params = options.region.join(',')
            options['region'] = params
        }

        if( options.front && options.front.file !== undefined){
            options['front'] = options.front.file.response.msg
        }

        if( options.back && options.back.file !== undefined){
            options['back'] = options.back.file.response.msg
        }

        if( options.frontid && options.frontid.file !== undefined){
            options['frontid'] = options.frontid.file.response.msg
        }

        if( options.backid && options.backid.file !== undefined){
            options['backid'] = options.backid.file.response.msg
        }

        if( options.orgcode && options.orgcode.file !== undefined){
            options['orgcode'] = options.orgcode.file.response.msg
        }

        if( options.buslicence && options.buslicence.file !== undefined){
            options['buslicence'] = options.buslicence.file.response.msg
        }

        if( options.lawholder && options.lawholder.file !== undefined){
            options['lawholder'] = options.lawholder.file.response.msg
        }

        if( options.spequalifione && options.spequalifione.file !== undefined){
            options['spequalifione'] = options.spequalifione.file.response.msg
        }

        if( options.spequalifitwo && options.spequalifitwo.file !== undefined){
            options['spequalifitwo'] = options.spequalifitwo.file.response.msg
        }

        if( options.spequalifithree && options.spequalifithree.file !== undefined){
            options['spequalifithree'] = options.spequalifithree.file.response.msg
        }

        if( options.spequalififour && options.spequalififour.file !== undefined){
            options['spequalififour'] = options.spequalififour.file.response.msg
        }

        if( options.spequalififive && options.spequalififive.file !== undefined){
            options['spequalififive'] = options.spequalififive.file.response.msg
        }

        axios.put(`/back/merchantinfoController/update/${options.id}`,options).then(( resp ) => {
            const data = resp.data;
            if(data.rel){
                this.handlerSelect()
                message.success('修改成功')
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
                modalTitle: '修改-商户基本信息',
                isUpdate: true
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-商户基本信息',
                tabInfos: {},
                isUpdate: false
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
            console.log(values)
            if( isUpdate ){
                this.handleUpdate(values)
            }else{
                this.handlerAdd(values)
            }
            if(!err){
                this.handlerHideModal()
                this.refs.form.resetFields()
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

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
          console.log(values)
            const limit = 10,
                  offset=1,
                  name=values.merchantName,
                  linkman = values.linkman,
                  lkmphone = values.lkmphone
            this.handlerSelect(limit,offset,name,linkman,lkmphone)
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
                <Card className="terminal-main-table"  bordered={false} noHovering  bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}>
                    <Row gutter={12}>
                        <Col>
                            <MerchantHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                            <div className="fr gap-top-down">
                                <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Modal title={'批量导入商户基本信息'} onOk={this.handlerImportOk} onCancel={this.handlerImportHider} visible={this.state.importVisible}>
                                <BulkImport ref="form" onSubmit={this.handlerImportOk}/>
                            </Modal>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
                    <Row>
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
                    <Row>
                        <Col span={24}>
                            <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={855}>
                                <MerchantModal
                                ref="form"
                                onSubmit={this.handlerModalOk}
                                passway={this.state.passway}
                                tabInfos={this.state.tabInfos}
                                isUpdate={this.state.isUpdate}
                                initPassway = { this.state.tabInfos.passwayIds && typeof(this.state.tabInfos.passwayIds) === 'string' ? this.state.tabInfos.passwayIds.split(','): [] }
                                />
                            </Modal>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Merchant
