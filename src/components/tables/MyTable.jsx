import React, { Component } from 'react'
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Table } from 'antd';
import axios from 'axios'

class MyTable extends Component {
    state = {
        dataSource: [],
        columns: [],
        loading: true
    }
    componentDidMount() {
        axios.defaults.baseURL = 'https://easy-mock.com/mock/59dc63fd1de3d46fa94cf33f/api';
        axios.get('/tableData').then(({ data }) => {
            console.log(data)
            data.columns = data.columns.map( (item)=>{
                if(item.dataIndex === "age"){
                    item.sorter = (a, b) => a.age - b.age
                }
                return item
            } )
            this.setState({
                dataSource: data.dataSource,
                columns: data.columns,
                loading: false
            })
        })
    }
    componentWillUnmount() {

    }
    render() {
        const { dataSource, columns,loading } = this.state;
        return (
            <div>
                <BreadcrumbCustom first="表格" second="我的表格" />
                <Row gutter={16}>
                    <Col md={24}>
                        <div>
                            <Card title="测试数据">
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    loading={loading}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default MyTable