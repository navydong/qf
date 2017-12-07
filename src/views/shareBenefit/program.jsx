import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, message } from 'antd'
import axios from 'axios'
import ProgramModal from "../../components/ShareBenefit/program/index";
import ProgramHeader from '../../components/ShareBenefit/program/ProgramHeader'
import RightTab from '../../components/ShareBenefit/program/RightTab'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
import Detail from './detail.jsx'
const confirm = Modal.confirm
const defaultPageSize = 10;
class ShareBenefitPage extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        pagination: {},
        current: 1,
        total: '',
        visible: false,
        isModal: true,
        passway: [],
        tabInfos: {},
        modalTitle: '新增-分润方案',
        isUpdate: false,
        columns: [{
            title: '分润方案名称',
            dataIndex: 'schemeName',
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
        this.handlerSelect();
        this._getPassWay()
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
        }
    }

    _getPassWay(){
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }

    handlerSelect(limit=10,offset=1,name='',passwayid=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                console.log(resp)
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

    handlerAdd(params){
        const options = Object.assign({},params);
        axios.post(`/back/frscheme/frscheme`,options).then((resp) => {
            console.log(resp.data)
            const data = resp.data;
            if(data.rel){
                message.success('添加成功')
                this.handlerSelect()
            }
        })
    }

    handleUpdate(options){
        const tabInfos = this.state.tabInfos;
        const params = Object.assign({},tabInfos,options)
        console.log(params)
        axios.put(`/back/frscheme/${params.id}`,{
            "schemeName": params.schemeName,
            "passwayId": params.passwayId
        })
            .then(( resp ) => {
               const data = resp.data;
               if(data.rel){
                   message.success('修改成功')
                   this.handlerSelect()
               }
            })
    }
    handleDelete(){
        const keys = this.state.selectedRowKeys;
        let url = []
        keys.forEach((item)=>{
            url.push(axios.delete(`/back/frscheme/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc,pers)=>{
            if(acc.data.rel){
                message.success('删除成功')
                this.handlerSelect()
            }else{
              message.error(acc.data.msg);
            }
        }))
    }

    showModal(status){
        if( status ){
            this.setState({
                visible: true,
                modalTitle: '修改-分润方案'
            });
        }else{
            this.setState({
                visible: true,
                modalTitle: '新增-分润方案',
                isUpdate: false,
                tabInfos: {}
            });
        }
    }

    handlerHideModal = (e) => {
        console.log(e)
        const isModal = this.state.isModal
        if(isModal){
          this.setState({
              visible: false
          })
        }
        this.refs.form.resetFields()
    }

    handlerModalOk = (err,values) => {
        const isUpdate  = this.state.isUpdate;
        console.log(isUpdate)
        this.refs.form.validateFields((err, values) => {
            if(err) {
              console.log(err)
              this.setState({isModal: false})
              return;
            };
            if( isUpdate ){
                this.handleUpdate(values)
            }else{
                this.handlerAdd(values)
            }
            if(!err){
              this.state.isModal = true;
              this.refs.form.resetFields()
              this.handlerHideModal()
            }
        });
    }

    handlerTableChange = (current, pageSize) => {
        console.log(current, pageSize)
        this.handlerSelect(pageSize, current)
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    onShowSizeChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current)
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err,values) => {
        this.refs.normalForm.validateFields((err,values) => {
            console.log(values)
            const limit=10,offset=1,name=values.name;
            this.handlerSelect(limit,offset,name)
        })
    }

    render(){
        const { selectedRowKeys } = this.state;
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
                <BreadcrumbCustom first="分润管理" second="分润方案" />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <div className="header-left">
                        <ProgramHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                    </div>
                    <div className="header-left">
                        <Button type="primary" onClick={this.handlerNormalForm} className='btn-search'>查询</Button>
                        <Button className='btn-reset' onClick={this.handleReset}>重置</Button>
                    </div>
                </Card>
                <Row gutter={12}>
                  <Col span={24}>
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
                                  <Modal title={this.state.modalTitle} onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={620}>
                                      <ProgramModal ref="form" onSubmit={this.handlerModalOk} options={this.state.passway} tabInfos={this.state.tabInfos}/>
                                  </Modal>
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
                                  />
                              </Col>
                          </Row>
                      </Card>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={24}>
                    <Detail/>
                  </Col>
                </Row>
            </div>
        )
    }
}

export default ShareBenefitPage
