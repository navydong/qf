import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Row, Col, Card, Table, Modal } from 'antd'
import axios from 'axios'
import UploadHeader from '../../components/upload/UploadHeader'
import '../../style/sharebenefit/reset-antd.less'
import DropOption from '../../components/DropOption/DropOption'
const confirm = Modal.confirm

class UpLoad extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        dataSource: [],
        pagination: {},
        visible: false,
        columns: [{
            title: '序号',
            dataIndex: 'order_id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        }, {
            title: '版本号',
            dataIndex: 'ipVersion',
        }, {
            title: '上传时间',
            dataIndex: 'mtCreate',
        }, {
            title: '上传人',
            dataIndex: 'creatorId'
        }, {
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => {
                return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '2', name: '删除' }]} />
            }
        }
        ]
    };

    componentWillMount() {
        this.handlerSelect();
    }

    handleMenuClick(record, e) {
        const self = this;
        if (e.key === '2') {
            const arr = [];
            const id = record.id;
            arr.push(id)
            this.setState({ selectedRowKeys: arr })
            confirm({
                title: '确定要删除吗?',
                onOk() {
                    self.handleDelete()
                },
            })
        }
    }

    _sloveRespData(dataSource) {
        console.log(dataSource)
        if (!dataSource) return
        dataSource.forEach((item, index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    handlerSelect(limit = 10, offset = 1) {
        this.setState({
            loading: true
        })
        axios.get(`/back/wcsver/page?limit=${limit}&offest=${offset}`)
            .then((resp) => {
                const dataSource = resp.data.rows;
                const pagination = this.state.pagination;
                pagination.total = resp.data.total;
                this.setState({
                    dataSource: this._sloveRespData(dataSource),
                    loading: false,
                    pagination
                })
            })
    }

    handleDelete() {
        const keys = this.state.selectedRowKeys;
        let url = []
        keys.forEach((item) => {
            url.push(axios.delete(`/back/wcsver/remove/${item}`))
        })
        axios.all(url).then(axios.spread((acc, pers) => {
            if (acc.data.rel) {
                window.location.reload()
            }
        }))
    }


    handlerTableChange = (pagination) => {
        console.log(pagination)
        const limit = pagination.pageSize,
            offset = pagination.current;
        this.handlerSelect(limit, offset)
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handlerNormalForm = (err, values) => {
        this.refs.normalForm.validateFields((err, values) => {
            console.log(values)
            const limit = 10, offset = 1, name = values.name;
            this.handlerSelect(limit, offset, name)
        })
    }
    uploadSuccess = () => {
        this.handlerSelect()
    }

    render() {
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="上传" second="上传文件" location={this.props.location} />
                <Card className="terminal-top-form">
                    <UploadHeader
                        ref="normalForm"
                        onSubmit={this.handlerNormalForm}
                        uploadSuccess={this.uploadSuccess}
                    />
                </Card>
                <Card className="terminal-main-table" style={{ marginTop: 12 }}>
                    <Row gutter={12}>
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

export default UpLoad
