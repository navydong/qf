import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import SharedForm from "../../components/ModalForm/index";
import NormalForm from '../../components/NormalForm'

class WxPay extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        columns: [{
            title: '序号',
            dataIndex: 'id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '日结日期',
            dataIndex: 'dayDate',
        },{
            title: '交易总金额',
            dataIndex: 'tradeToggleMoney',
        },{
            title: '通道类型',
            dataIndex: 'passagewayType'
        },{
            title: '受理机构',
            dataIndex: 'slove'
        },{
            title: '服务商',
            dataIndex: 'service'
        },{
            title: '分润金额',
            dataIndex: 'shareMoney',
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

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                //const dataSource = resp.data.result.list;
                this.setState({
                    dataSource: []
                })
            })
    }

    handlerDetail(){
        console.log('详情')
    }

    handlerNormalForm = (err,fieldsValue) => {
        this.refs.normalForm.validateFields((err,fieldsValue) => {
            if(err) return;
            const values = {
                ...fieldsValue,
                'startDate': fieldsValue['startDate'].format('YYYY-MM-DD'),
                'endDate': fieldsValue['endDate'].format('YYYY-MM-DD')
            }
            console.log(values)
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

    handlerModalOk = (err,value) => {
        this.refs.form.validateFields((err,values)=>{
            const limit = 10,offset=1,name=values.newShareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
            if(!err){
                this.handlerHideModal()
            }
        })
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
                label: "开始日期",
                placeholder: '开始日期',
                getFile: "startDate",
                isDate: true
            },
            {
                label: "结束日期",
                placeholder: '结束日期',
                getFile: "endDate",
                isDate: true
            }
        ]
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="对账管理" second="微信对账单导入" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <NormalForm ref="normalForm" onSubmit={this.handlerNormalForm} data={FormData}/>
                            <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}}>
                    <Modal title="新增-分润方案" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={400}>
                        <h3 className="title">基本信息</h3>
                        <SharedForm ref="form" onSubmit={this.handlerModalOk}/>
                    </Modal>
                    <Row style={{marginTop: 16}}>
                        <Col span={24}>
                            <Table bordered rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default WxPay