import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import WxPayHeader from '../../components/Bill/WxPayHeader/WxPayHeader'

class WxPay extends React.Component {
    state = {
        loading: false,
        dataSource: [],
        current: 1,
        total: '',
        visible: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
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
        }
        ]
    };

    componentWillMount(){
        this.handlerSelect();
    }

    _sloveRespData(dataSource){
        if(!dataSource) return;
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    handlerSelect(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                //const dataSource = resp.data.rows;
                //const pagination = this.state.pagination;
                //pagination.total = resp.data.total;
                this.setState({
                    //dataSource: this._sloveRespData(dataSource),
                    loading: false
                   // pagination
                })
            })
    }

    handlerDownBill(billDate){
        this.setState({
            loading: true
        })
        axios.post(`/back/wxBill/downloadBill`,{billDate: billDate}).then((resp) => {
            const data = resp.data;
            if(data.rel){
                console.log('对账单下载成功')
            }
        })
    }

    handlerNormalForm = (err,fieldsValue) => {
        this.refs.normalForm.validateFields((err,fieldsValue) => {
            if(err) return;
            const values = {
                ...fieldsValue,
                'startTime': fieldsValue['startTime'].format('YYYY-MM-DD'),
                'endTime': fieldsValue['endTime'].format('YYYY-MM-DD')
            }
            console.log(values)
            const startTime = values.startTime, endTime = values.endTime;
            this.handlerDownBill(startTime)
        })
    }

    render(){
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="对账管理" second="微信对账单导入" location={this.props.location}/>
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <WxPayHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                            <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}}>
                    <Row style={{marginTop: 16}}>
                        <Col span={24}>
                            <Table bordered  columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default WxPay