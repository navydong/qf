import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Input, Button, Icon, Select, Table, Modal } from 'antd'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import './category.less'

const FormItem = Form.Item
const Option = Select.Option
const { Column } = Table

class Category extends Component {
    state = {
        dataSource: [],
        loading: true,
        detailVisible: false,
        detailData: ''
    }
    componentDidMount() {
        axios.get('/getCategoryData').then(({ data }) => {
            console.log(data)
            this.setState({
                dataSource: data.dataSource,
                columns: data.columns,
                loading: !this.state.loading
            })
        })
    }
    //表格详细按钮 
    detailHandle = (text, record) => {
        console.log(text)
        this.setState({
            detailVisible: true,
            detailData: text
        })

    }
    //模态框确认按钮
    modalHandleOk = ()=>{
        this.setState({
            detailVisible: false
        })
    }
    //模态框取消按钮
    modalHandleCancel = ()=>{
        this.setState({
            detailVisible: false
        })
    }
    //表格增加按钮
    addHandle = ()=>{
        
    }
    render() {
        const { dataSource, loading } = this.state;
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
                    <Card style={{ marginTop: 20 }}>
                        <Row gutter={40} type="flex" justify="end">
                            <Col span={4}>
                                <Button type="primary" onClick={this.addHandle}>新增</Button>
                            </Col>
                        </Row>
                        <Table
                            dataSource={dataSource}
                            loading={loading}
                            bordered
                            style={{ marginTop: 30 }}
                        >
                            <Column title="方案名称" dataIndex="name" key="1" />
                            <Column title="备注" dataIndex="message" key="2" width={300} />
                            <Column title="创建人" dataIndex="creater" key="3" />
                            <Column title="创建时间" dataIndex="cTime" key="4" />
                            <Column
                                title="操作"
                                key="5"
                                render={(text, record) => {
                                    return <div>
                                        <Button
                                            type="primary"
                                            onClick={() => { this.detailHandle(text, record) }}
                                        >详细</Button>
                                        <Modal 
                                            title="详细信息" 
                                            visible={this.state.detailVisible} 
                                            onOk={this.modalHandleOk} 
                                            onCancel={this.modalHandleCancel}
                                            wrapClassName="vertical-center-modal"
                                        >
                                            {Object.keys(this.state.detailData).map( (item)=>{
                                                return <div key={item} >{this.state.detailData[item]}</div>
                                            } )}
                                        </Modal>   
                                    </div>
                                }}
                            />
                        </Table>

                    </Card>
                </div>
            </div>
        )
    }
}

export default Category