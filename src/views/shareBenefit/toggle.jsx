import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card,Table, message } from 'antd'
import axios from 'axios'
import ToggleHeader from '../../components/ShareBenefit/toggle/ToggleHeader'
import '../../style/sharebenefit/reset-antd.less'
const defaultPageSize = 10

function sloveRespData(dataSource){
  if(Array.isArray(dataSource)){
    dataSource.forEach((item,index) => {
      item['key'] = Math.random() + index
      if(item.children && item.children.length > 0){
        sloveRespData(item.children)
      }else{
        delete item.children
      }
    })
  }
}

class ShareToggle extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        startTime: '',
        endTime: '',
        current: 1,
        total: '',
        columns: [
          {title: '日结日期',dataIndex: 'settlementTime'},
          {title: '交易总金额',dataIndex: 'totalmoney'},
          {title: '通道类型',dataIndex: 'passwayId'},
          {title: '交易总笔数',dataIndex: 'totaltimes'},
          {title: '机构',dataIndex: 'orgrelationId'},
          {title: '分润金额',dataIndex: 'profitmoney'}
        ]
    };

    componentDidMount(){
      this.initSelect()
    }

    initSelect(limit = 10,offset = 1){
      this.setState({loading:true})
      axios.get(`/back/profit/page`)
          .then((resp)=>{
              const dataSource = resp.data.rows,
                  total = resp.data.total;
              sloveRespData(dataSource)
              this.setState({
                  dataSource: dataSource,
                  loading: false,
                  current: offset,
                  total
              })
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
       this.setState({loading:true})
        axios.get(`/back/profit/page?limit=${limit}&offest=${offset}&startTime=${startTime}&endTime=${endTime}`)
            .then((resp)=>{
                const dataSource = resp.data.rows,
                    total = resp.data.total;
                sloveRespData(dataSource)
                this.setState({
                    dataSource: dataSource,
                    loading: false,
                    current: offset,
                    total
                })
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
      console.log(options)
      if(!options) return;
      axios.post(`/back/profit/calculate`,options).then((resp) => {
                const data = resp.data;
                if(data.rel){
                   message.success(data.msg)
                   this.handlerSelect()
                }
            })
    }

    onShowSizeChange = (current, pageSize) => {
        this.initSelect(pageSize, current)
    }

    handlerTableChange = (current, pageSize) => {
        console.log(current, pageSize)
        this.initSelect(pageSize, current)
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
                <BreadcrumbCustom first="分润管理" second="分润统计" location={this.props.location}/>
                <Card className="terminal-top-form" bordered={false} bodyStyle={{backgroundColor: "#f8f8f8", marginRight: 32}}  noHovering>
                    <Row gutter={12}>
                        <Col>
                           <div className="header-left">
                               <ToggleHeader ref="normalForm" onSubmit={this.handlerNormalForm}/>
                           </div>
                            <div className='header-right'>
                                <Button type="primary" onClick={() => {this.handlerSelect()}} className='btn-search'>查询</Button>
                                <Button type="primary" onClick={this.handlerCaculate} className='btn-search'>计算</Button>
                                <Button className='btn-reset' onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{paddingLeft: 0}}>
                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col span={24}>
                            <Table
                                   className="components-table-demo-nested"
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
export default ShareToggle
