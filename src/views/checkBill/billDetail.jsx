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
        current: 1,
        total: '',
        passway: [],
        startTime: '',
        endTime: '',
        columns: [{
            title: '序号',
            dataIndex: 'order_id'
        },{
            title: '商户名称',
            dataIndex: 'merchantname'
        },{
            title: '商户号',
            dataIndex: 'mercode'
        },{
            title: '订单号',
            dataIndex: 'orders'
        },{
            title: '交易类型',
            dataIndex: 'type',
        },{
            title: ' 费率 ',
            dataIndex: 'fee',
        },{
            title: '支付方式',
            dataIndex: 'passwayname'
        },{
            title: '总金额',
            dataIndex: 'sum'
        },{
            title: '商品名称',
            dataIndex: 'goodsname'
        },{
            title: '账单商户号',
            dataIndex: 'billmchcode'
        },{
            title: '账单订单号',
            dataIndex: 'billorders'
        },{
            title: '账单支付方式',
            dataIndex: 'billpasswayname'
        },{
          title: '账单交易类型',
          dataIndex: 'billtype'
        },{
            title: '账单总金额',
            dataIndex: 'billsum'
        },{
            title: '账单费率',
            dataIndex: 'billfee',
        },{
            title: '账单交易开始时间',
            dataIndex: 'billtradecfdt'
        },{
            title: '账单交易结束时间',
            dataIndex: 'billtradedt'
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
    handlerSelect(limit = 10, offset = 1 ,startTime,endTime,tradetype=''){
        this.setState({
            loading: true
        })
        const start = startTime || this.state.startTime
        const end = endTime || this.state.endTime
        axios.get(`/back/tradeBlotter/getCompareBill?limit=${limit}&offset=${offset}&startTime=${start}&endTime=${end}&tradetype=${tradetype}`)
            .then((resp)=>{
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

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = (err,fieldsValue) => {
        this.refs.normalForm.validateFields((err,fieldsValue) => {
            if(err) return;
            let values = null;
            if( fieldsValue.endTime && fieldsValue.startTime){
                values = {
                    ...fieldsValue,
                    'startTime': fieldsValue['startTime'].format('YYYY-MM-DD'),
                    'endTime': fieldsValue['endTime'].format('YYYY-MM-DD')
                }
            }else{
                values = {
                    ...fieldsValue
                }
            }
            console.log(values)
            const startTime = values.startTime, endTime = values.endTime, tradetype = values.tradetype,limit = 10,offset = 1;
            this.setState({
                startTime,
                endTime
            })
            this.handlerSelect(limit,offset,startTime,endTime,tradetype)
        })
    }

    handlerTableChange = (current, pageSize) => {
        console.log(current, pageSize)
        this.handlerSelect(pageSize, current)
    }

    onShowSizeChange = (current, pageSize) => {
        console.log(current,pageSize)
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
                <BreadcrumbCustom first="对账管理" second="对账信息" location={this.props.location}/>
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row gutter={12}>
                        <Col>
                            <AllBillHeader ref="normalForm" onSubmit={this.handlerNormalForm} passway={this.state.passway}/>
                            <div className={'header-right'}>
                                <Button type="primary" onClick={this.handlerNormalForm} className={'btn-search'}>查询</Button>
                                <Button className={'btn-reset'} onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
                    <Row style={{marginTop: 16}}>
                        <Col span={24}>
                            <Table
                                scroll={{ x: '200%' }}
                                bordered={false}
                                columns={this.state.columns}
                                dataSource={this.state.dataSource}
                                pagination={pagination}
                                loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default BillDetail
