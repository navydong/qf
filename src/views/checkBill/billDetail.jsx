import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table} from 'antd'
import axios from 'axios'
import AllBillHeader from '../../components/Bill/AllBill/AllBillHeader'
import { sloveRespData } from '../../utils/index'
const defaultPageSize = 10
class BillDetail extends React.Component {
    state = {
        loading: false,
        dataSource: [],
        visible: false,
        pagination: {},
        current: 1,
        total: '',
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
    handlerSelect(startTime,endTime,limit = 10, offset = 1,passwayid=''){
        this.setState({
            loading: true
        })
        axios.get(`/back/tradeBlotter/getCompareBill?startTime=${startTime}&endTime=${endTime}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.rows,
                      total = resp.data.total;
                this.setState({
                    dataSource: sloveRespData(dataSource),
                    loading: false,
                    current: offset,
                    total
                })
            })
    }

    handlerNormalForm = (err,fieldsValue) => {
        this.refs.normalForm.validateFields((err,fieldsValue) => {
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

    onShowSizeChange = (current, pageSize) => {
        this.handlerSelect(pageSize, current)
    }

    render(){
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
export default BillDetail