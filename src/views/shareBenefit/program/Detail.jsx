import { Button, Col, Form, Icon, Input, Modal, Popconfirm, Row, Table, message } from 'antd';
import axios from 'axios';
import React from 'react';
const FormItem = Form.Item
class Detail extends React.Component {
    state = {
        visible: false,
        loading: true,
        confirmLoading: false,
        dataSource: [],
        count: 0
    }
    getDetailData = (schemeId, industryId, limit = 100, offset = 1) => {
        this.setState({ loading: true })
        axios.get('/back/frschemeDetail/schemedetails', {
            params: {
                schemeId,
                industryId,
                limit,
                offset,
            }
        }).then(({ data }) => {
            this.setState({
                dataSource: data.rows,
                count: data.total,
                loading: false,
            })
        })
    }
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            id: count,
            tradesumLow: 0,
            tradesumHigh: 0,
            rate: 0,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    // 删除分润明细
    delete = (record) => {
        const { count, dataSource } = this.state;
        const newData = dataSource.filter(item => {
            return record.id != item.id
        })
        this.setState({
            dataSource: newData,
            count: count - 1,
        });
    }
    onCellChange = (id, dataIndex) => {
        return (value) => {
            let dataSource = [...this.state.dataSource];
            const target = dataSource.find(item => item.id === id);
            if (target) {
                const { tradesumLow, tradesumHigh, rate } = target
                target[dataIndex] = value;
                this.setState({ dataSource })
            }
        };
    }
    handlerOk = () => {
        const tableRow = this.state.dataSource
        const { id, parentId } = this.props.record
        const schemeId = this.props.schemeId
        tableRow.forEach(item => {
            item.schemeId = schemeId;    //方案
            item.industryPid = parentId;  //行业父级
            item.industryId = id;   //行业
        })
        const data = {
            schemeId,
            industryPid: parentId,
            industryId: id,
            detailList: tableRow
        }
        if (!validit(tableRow)) return
        this.setState({
            confirmLoading: true
        })
        axios.post('/back/frschemeDetail/frschemeDetail', data, {
            headers: { "Content-Type": "application/json" },
            transformRequest: [function (data) {
                return JSON.stringify(data)
            }]
        }).then(({ data }) => {
            if (data.rel) {
                message.success(data.msg)
                this.setState({
                    visible: false,
                    confirmLoading: false
                })
            } else {
                this.setState({
                    confirmLoading: false
                })
                message.error(data.msg)
            }
        })
    }
    handleCancel = () => {
        this.setState({
            dataSource: [],
            visible: false
        })
    }
    show = () => {
        this.setState({
            visible: true
        })
    }

    deleteCancel = () => {
        //cancel
    }
    render() {
        const record = this.props.record
        const columns = [
            {
                dataIndex: 'tradesumLow',
                title: '交易金额下限',
                width: '30%',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.id, 'tradesumLow')}
                    />
                ),
            }, {
                dataIndex: 'tradesumHigh',
                title: '交易金额上限',
                width: '30%',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.id, 'tradesumHigh')}
                    />
                ),
            }, {
                dataIndex: 'rate',
                title: '奖励比例%',
                width: '30%',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.id, 'rate')}
                    />
                ),
            }, {
                title: '操作',
                render: (text, record) => {
                    return <Popconfirm title="确定要删除此明细?" onConfirm={() => this.delete(record)} onCancel={this.deleteCancel} okText="Yes" cancelText="No">
                        <Button icon="delete"></Button>
                    </Popconfirm>
                }
            }
        ]
        return (
            <Modal
                width={768}
                wrapClassName="vertical-center-modal"
                title="分润明细"
                okText="保存"
                confirmLoading={this.state.confirmLoading}
                onOk={this.handlerOk}
                onCancel={this.handleCancel}
                visible={this.state.visible}
            >
                <Row gutter={20} style={{ fontSize: 14, fontWeight: 600 }}>
                    <Col span={8} >
                        <span>
                            方案名称：{record.schemeName}
                        </span>
                    </Col>
                    <Col span={8} >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                            行业名称：{record.industryName}
                        </span>
                    </Col>
                    <Col span={8} >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                            通道：{record.passwayName}
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }} >
                        <Button type="primary" onClick={this.handleAdd} >新增分润明细</Button>
                    </Col>
                </Row>
                <div style={{ marginTop: 10 }} ></div>
                <Form>
                    <Table
                        rowKey="id"
                        bordered
                        scroll={{ y: 500 }}
                        pagination={false}
                        loading={this.state.loading}
                        columns={columns}
                        dataSource={this.state.dataSource}
                    />
                </Form>

            </Modal>
        )
    }
}

function validit(dataList) {
    const newList = [...dataList]
    let notcross = true, //不存在交叉
        isTrue = true,   //不存在上限下限错误
        notnull = true   //不存在存在空字段
    newList.sort(function (a, b) {
        return parseFloat(a.tradesumLow) - parseFloat(b.tradesumLow)
    })
    newList.forEach(item => {
        const { tradesumLow, tradesumHigh, rate } = item
        if (tradesumLow === '' || tradesumHigh === '' || rate === '') {
            notnull = false
        }
        if (tradesumLow >= tradesumHigh) {
            isTrue = false
        }
    })
    if (isTrue && notnull && newList.length > 1) {
        for (let i = 1, len = newList.length; i < len; i++) {
            if (parseFloat(newList[i].tradesumLow) <= parseFloat(newList[i - 1].tradesumHigh)) {
                notcross = false
            }
        }
    }
    if (notcross && isTrue && notnull) {
        return true
    } else if (!notcross) {
        message.error('区间存在交叉')
        return false
    } else if (!notnull) {
        message.error('输入不完整')
        return false
    } else if (!isTrue) {
        message.error('上限下限输入错误')
        return false
    }
}



export default Detail


class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
        // validateStatus: 'success'
    }
    handleChange = (e) => {
        const value = e.target.value;
        const reg = /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            this.setState({ value });
        }
    }
    check = (e) => {
        e && e.stopPropagation()
        let value = this.state.value
        // 最后未是小数点，自动补0
        if (value[value.length - 1] == '.') {
            value += 0
            this.setState({ value })
        }
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell" >
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                autoFocus
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                                onBlur={this.check}
                                maxLength="25"
                            />
                            {/* <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            /> */}
                        </div>
                        :
                        <div className="editable-cell-text-wrapper" onClick={this.edit}>
                            {value}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                            // onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}