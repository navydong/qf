import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, Modal, Icon } from 'antd'
import axios from 'axios'
import BenefitHeader from '../../components/benefit/BenefitHeader'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'

class BenefitQuery extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        startTime: '',
        endTime: '',
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        },{
            title: '结算日期',
            dataIndex: 'settledt',
        },{
            title: '清分状态 ',
            dataIndex: 'state',
        },{
            title: ' 收款账户 ',
            dataIndex: 'getaccout',
        },{
            title: '审核人',
            dataIndex: 'checkerId',
        },{
            title: '审核状态',
            dataIndex: 'checked',
        },{
            title: '审核时间',
            dataIndex: 'checkTime',
        }
        ]
    };

    componentWillMount(){
        this.handlerSelect();
    }

    handlerSelect(limit=10,offset=1){
        const {startTime,endTime} = this.state;
        this.setState({ loading: true })
        axios.get(`/back/querydata/page?limit=${limit}&offest=${offset}&startTime=${startTime}&endTime=${endTime}`)
            .then((resp)=>{
                const dataSource = resp.data.rows;
                this.setState({ loading: false })
                this.setState({
                    dataSource: sloveRespData(dataSource)
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
            if( !values.startTime || !values.endTime ) return;
            const startTime = values.startTime,
                endTime = values.endTime;
            this.setState({
                startTime,
                endTime
            })
            this.handlerCaculate(startTime,endTime)
        })
    }

    handlerCaculate = (startTime,endTime) => {
        axios.post(`/back/querydata/calculate`,{
            startTime: startTime,
            endTime: endTime
        }).then((resp) => {
            const data = resp.data;
            if(data.rel){
                // window.location.reload()
            }
        })
    }

    render(){
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润统计" />
                <Card className="terminal-top-form">
                    <Row gutter={12}>
                        <Col>
                            <BenefitHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                            <Button type="primary" onClick={() => {this.handlerSelect()}}>查询</Button>
                            <Button type="primary" onClick={this.handlerNormalForm}>计算</Button>
                            <Button type="primary">重置</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" style={{marginTop: 12}}>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table bordered  columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default BenefitQuery