import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Button, Card, Table, message } from 'antd'
import axios from 'axios'
import BenefitHeader from '../../components/benefit/BenefitHeader'
import { sloveRespData } from '../../utils/index'
import '../../style/sharebenefit/reset-antd.less'

const defaultPageSize = 10
class BenefitQuery extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        visible: false,
        startTime: '',
        endTime: '',
        total: '',
        current: 1,
        pageSize: 10,                   //分页大小
        columns: [
            {
                title: '日结时间',
                dataIndex: 'settledt',
            }, {
                title: '机构名称',
                dataIndex: 'orgId',
            }, {
                title: '机构编号 ',
                dataIndex: 'getaccout',
            }, {
                title: '上级机构',
                dataIndex: 'pId',
            }, {
                title: '交易总金额（元）',
                dataIndex: 'totalmoney',
            },{
                title: '交易总笔数',
                dataIndex: 'totaltimes'
            },{
                title: '退款总金额（元）',
                dataIndex: 'refundmoney'
            },{
                title: '退款总笔数',
                dataIndex: 'refundtimes'
            },{
                title: '分润金额（元）',
                dataIndex: 'settleamount'
            }
        ]
    };

    componentWillMount() {
        this.initSelect();
    }

    initSelect(limit = 10, offset = 1, params) {
        this.setState({ loading: true })
        axios.get('/back/querydata/page', {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            let dataSource = resp.data.rows;
            dataSource.forEach((item, index) => {
                item.key = index
            })
            const total = resp.data.total;
            this.setState({ loading: false })
            this.setState({
                dataSource,
                current: offset,
                total
            })
        })
    }

    handlerSelect(limit = 10, offset = 1) {
        let options = this.handlerNormalForm()
        console.log(options)
        let startTime = '', endTime = ''
        if (!options) {
            return;
        } else {
            startTime = options.startTime;
            endTime = options.endTime;
        };
        this.setState({
            loading: true,
            searchParams: {
                startTime,
                endTime,
            }
        })
        axios.get('/back/querydata/page', {
            params: {
                limit,
                offset,
                startTime,
                endTime,
            }
        }).then((resp) => {
            let dataSource = resp.data.rows;
            const total = resp.data.total;
            dataSource.forEach((item, index) => {
                item.key = index
            })
            this.setState({ loading: false })
            if (dataSource.length > 0) {
                this.setState({
                    dataSource,
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
        this.refs.normalForm.validateFields((err, fieldsValue) => {
            if (err) return;
            if (fieldsValue.startTime && fieldsValue.endTime) {
                values = {
                    ...fieldsValue,
                    'startTime': fieldsValue['startTime'].format('YYYY-MM-DD'),
                    'endTime': fieldsValue['endTime'].format('YYYY-MM-DD')
                }
            } else {
                values = {
                    ...fieldsValue
                }
            }
        })
        return values;
    }

    handlerCaculate = () => {
        let options = this.handlerNormalForm()
        if (!options) return;
        axios.post(`/back/querydata/calculate`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success('计算完成')
                this.handlerSelect()
            }
        })
    }

    handlerDownload = (e) => {
        e.preventDefault()
        let options = this.handlerNormalForm()
        if (!options) return;
        console.log(options)
        let startTime = '';
        let endTime = '';
        if (!options) {
            return;
        } else {
            startTime = options.startTime;
            endTime = options.endTime;
        };
        window.location.href = `/back/querydata/dowload?startTime=${startTime}&endTime=${endTime}`
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize
        })
        this.initSelect(pageSize, current, this.state.searchParams)
    }

    handlerTableChange = (current, pageSize) => {
        this.initSelect(pageSize, current, this.state.searchParams)
    }

    render() {
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
                <BreadcrumbCustom first="清分管理" second="清分数据查询" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={15}>
                            <BenefitHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                        </Col>
                        <Col span={24}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={() => { this.handlerSelect() }} className="btn-search">查询</Button>
                                <Button type="primary" onClick={this.handlerCaculate} className="btn-search">计算</Button>
                                <Button className="btn-reset" onClick={this.handleReset}>重置</Button>
                                <a onClick={this.handlerDownload} className={'download'}>下载清分文件</a>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                scroll={{x: '130%'}}
                                bordered={false}
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
export default BenefitQuery
