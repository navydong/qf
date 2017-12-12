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
        total: '',
        current: '',
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
        }
        ]
    };

    componentWillMount(){
        this.initSelect();
    }

    initSelect(limit = 10,offset = 1){
      this.setState({loading:true})
      axios.get(`/back/querydata/page`)
          .then((resp)=>{
              const dataSource = resp.data.rows,
                  total = resp.data.total;
              if( dataSource.length > 0 ){
                this.setState({
                    dataSource: sloveRespData(sloveRespData),
                    loading: false,
                    current: offset,
                    total
                })
              }
          })
    }

    handlerSelect(limit=10,offset=1){
      let options = this.handlerNormalForm()
      console.log(options)
      let startTime= '',endTime = ''
      if(!options){
        return;
      }else{
        startTime = options.startTime,
        endTime = options.endTime;
      };
        this.setState({ loading: true })
        axios.get(`/back/querydata/page?limit=${limit}&offest=${offset}&startTime=${startTime}&endTime=${endTime}`)
            .then((resp)=>{
                const dataSource = resp.data.rows,
                  total = resp.data.total;
                if(dataSource.length > 0) {
                  this.setState({
                      dataSource: sloveRespData(dataSource),
                      loading: false,
                      current: offset,
                      total
                  })
                }
            })
    }

    handleReset = () => {
        this.refs.normalForm.resetFields();
    }

    handlerNormalForm = () => {
        let values = null
        this.refs.normalForm.validateFields((err,fieldsValue) => {
            if(err) return;
            if( fieldsValue.startTime && fieldsValue.endTime){
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
        })
        return values;
    }

    handlerCaculate = () => {
      let options = this.handlerNormalForm()
      if(!options) return;
        axios.post(`/back/querydata/calculate`,options).then((resp) => {
            const data = resp.data;
            if(data.rel){
                message.success('计算完成')
                this.handlerSelect()
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
                                <Button type="primary" onClick={() => {this.handlerSelect()}} className="btn-search">查询</Button>
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
