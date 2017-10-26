import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table} from 'antd'
import axios from 'axios'
import AllBillHeader from '../../components/Bill/AllBill/AllBillHeader'

class BillDetail extends React.Component {
    state = {
        loading: false,
        dataSource: [],
        visible: false,
        pagination: {},
        passway: [],
        columns: [{
            title: '序号',
            dataIndex: 'order_id'
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
        this._getPassWay();
    }

    _getPassWay(){
        axios.get(`/back/passway/page`).then((resp) => {
            const passway = resp.data.rows;
            this.setState({
                passway
            })
        })
    }
    handlerSelect(startTime,endTime,passwayid=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/tradeBlotter/getCompareBill?startTime=${startTime}&endTime=${endTime}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: [],
                    loading: false,
                    pagination
                })
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
            const startTime = values.startTime, endTime = values.endTime, passway = values.passway;
            this.handlerSelect(startTime,endTime,passway)
        })
    }

    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit,offset)
    }

    render(){
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="对账管理" second="对账信息" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <AllBillHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway}/>
                            <Button type="primary" onClick={this.handlerNormalForm}>查询</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 16}}>
                    <Row style={{marginTop: 16}}>
                        <Col span={24}>
                            <Table
                                bordered
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
export default BillDetail