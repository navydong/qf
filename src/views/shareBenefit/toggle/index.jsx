import React from 'react'
import axios from 'axios'
import { Row, Col, Button, Card, Table, message } from 'antd'
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import ToggleHeader from './ToggleHeader'
import '@/style/sharebenefit/reset-antd.less'
import { paginat } from '@/utils/pagination'


function sloveRespData(dataSource) {
    if (Array.isArray(dataSource)) {
        dataSource.forEach((item, index) => {
            item['key'] = Math.random() + index
            if (item.children && item.children.length > 0) {
                sloveRespData(item.children)
            } else {
                delete item.children
            }
        })
    }
}
const columns = [
    { title: '日结日期', dataIndex: 'settlementTime', width: 200 },
    { title: '交易总金额', dataIndex: 'totalmoney' },
    { title: '通道类型', dataIndex: 'passwayId' },
    { title: '交易总笔数', dataIndex: 'totaltimes' },
    { title: '机构', dataIndex: 'orgrelationId' },
    { title: '分润金额', dataIndex: 'profitmoney' }
]

class ShareToggle extends React.Component {
    state = {
        total: 0,             //数据总数
        current: 1,
        pageSize: 10,         //分页大小
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
        searchParams: {}      //搜索参数
    };

    componentDidMount() {
        this.initSelect()
    }

    initSelect(limit = 10, offset = 1, params) {
        this.setState({ loading: true })
        axios.get(`/back/profit/page`, {
            params: {
                limit,
                offset,
                ...params
            }
        }).then((resp) => {
            const { rows: dataSource,  total} = resp.data
            sloveRespData(dataSource)
            console.log(dataSource)
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
    /**
     * 获取表单值
     */
    handlerNormalForm = () => {
        this.refs.normalForm.validateFields((err, fieldsValue) => {
            if (err) return;
            if (fieldsValue.startTime) {
                fieldsValue.startTime = fieldsValue.startTime.format('YYYY-MM-DD')
            }
            if (fieldsValue.endTime) {
                fieldsValue.endTime = fieldsValue.endTime.format('YYYY-MM-DD')
            }
            this.setState({
                searchParams: fieldsValue
            })
            this.initSelect(this.state.limit, 1, fieldsValue)
        })
    }

    handlerCaculate = () => {
        let options = this.handlerNormalForm()
        console.log(options)
        if (!options) return;
        axios.post(`/back/profit/calculate`, options).then((resp) => {
            const data = resp.data;
            if (data.rel) {
                message.success(data.msg)
                this.handlerSelect()
            }
        })
    }


    render() {
        const pagination = paginat(this, (pageSize, current, searchParams) => {
            this.initSelect(pageSize, current, searchParams)
        })
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="分润管理" second="分润统计" location={this.props.location} />
                <Card className="terminal-top-form" bordered={false} bodyStyle={{ backgroundColor: "#f8f8f8", marginRight: 32 }} noHovering>
                    <Row>
                        <Col span={14}>
                            <ToggleHeader ref="normalForm" onSubmit={this.handlerNormalForm} />
                        </Col>
                        <Col span={10}>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.handlerNormalForm} className='btn-search'>查询</Button>
                                <Button type="primary" onClick={this.handlerCaculate} className='btn-search'>计算</Button>
                                <Button className='btn-reset' onClick={this.handleReset}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="terminal-main-table" bordered={false} noHovering bodyStyle={{ paddingLeft: 0 }}>
                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={24}>
                            <Table
                                className="components-table-demo-nested"
                                columns={columns}
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
