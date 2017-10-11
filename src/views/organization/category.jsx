import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Input, Button, Icon, Select, Table } from 'antd'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'

const FormItem = Form.Item
const Option = Select.Option

class Category extends Component {
    state = {
        dataSource: [],
        columns: [],
        loading: true
    }
    componentDidMount(){
        axios.defaults.baseURL = 'https://easy-mock.com/mock/59dc63fd1de3d46fa94cf33f/api'
        axios.get('/getCategoryData').then( ({data})=>{
            console.log(data)
            this.setState({
                dataSource: data.dataSource,
                columns: data.columns,
                loading: !this.state.loading
            })
        } )
    }
    render() {
        const { dataSource, columns, loading } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };      
        return (
            <div className="category">
                <BreadcrumbCustom first="基础参数" second="行业类目" />
                <div>
                    <Card>
                        <Form>
                            <Row gutter={40}>
                                <Col span={10}>
                                    <FormItem label="方案名称" {...formItemLayout}>
                                        <Input placeholder="请输出方案名称" />
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem label="方案名称" {...formItemLayout}>
                                        <Select defaultValue="条目一">
                                            <Option value="条目一">条目一</Option>
                                            <Option value="条目二">条目二</Option>
                                            <Option value="条目三">条目一</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <Button type="primary">查询</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card style={{marginTop:20}}>
                        <Table 
                            columns={columns} 
                            dataSource={dataSource} 
                            loading={loading} 
                            bordered 
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

export default Category