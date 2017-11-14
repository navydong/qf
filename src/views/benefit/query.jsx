import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, message } from 'antd'
import axios from 'axios'
import BenefitHeader from '../../components/benefit/BenefitHeader'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'

class BenefitQuery extends React.Component {
    state = {
        selectedRowKeys: [],
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

    handlerSelect(status,limit=10,offset=1){
        if(status){
            this.handlerNormalForm()
        }
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

    handleReset = () => {
        this.refs.normalForm.resetFields();
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
            this.state.startTime = startTime
            this.state.endTime = endTime
        })
    }

    handlerCaculate = () => {
        this.handlerNormalForm()
        const { startTime,endTime } = this.state;
        axios.post(`/back/querydata/calculate`,{
            startTime: startTime,
            endTime: endTime
        }).then((resp) => {
            const data = resp.data;
            if(data.rel){
                message.success('计算完成')
                window.location.reload()
            }
        })
    }
    handlerDownload = (e) => {
        e.preventDefault()
        this.handlerNormalForm()
        const { startTime,endTime } = this.state;
        if(startTime && endTime){
            window.location.href = `/back/querydata/dowload?startTime=${startTime}&endTime=${endTime}`
        }
    }

    render(){
        const selectStatus = true
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="清分管理" second="清分数据查询" />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row gutter={12}>
                        <Col>
                            <div className="header-left">
                                <BenefitHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                            </div>
                            <div className="header-right">
                                <Button type="primary" onClick={() => {this.handlerSelect(selectStatus)}} className="btn-search">查询</Button>
                                <Button type="primary" onClick={this.handlerCaculate} className="btn-search">计算</Button>
                                <Button className="btn-reset" onClick={this.handleReset}>重置</Button>
                                <a onClick={this.handlerDownload} className={'download'}>下载清分文件</a>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table bordered={false}  columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default BenefitQuery