import React, { Component } from 'react'
import axios from 'axios'
import { Row, Col, Card, Form, Input, Button, Select, Table, Modal, DatePicker } from 'antd'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import './category.less'

const FormItem = Form.Item
const Option = Select.Option
const { Column } = Table

class Categorys extends Component {
    state = {
        dataSource: [],
        loading: true,
        detailVisible: false,
        addVisible: false,
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
    modalHandleOk = (text) => {
        this.setState({
            [text]: false
        })
    }
    //模态框取消按钮
    modalHandleCancel = (text) => {
        this.setState({
            [text]: false
        })
    }
    //表格增加按钮
    addHandle = () => {
        this.setState({
            addVisible: true
        })
    }
    //查询按钮
    searchHandle = ()=>{
        this.setState({
            loading: true
        })
        setTimeout( ()=>{
            this.setState({
                loading: false
            })
        }, 3000 )
    }
    //增加表格提交
    handleSubmit = (e)=>{
        e.preventDefault()
 
        let newData = this.props.form.getFieldsValue()
        console.log(this.props.form.getFieldsValue())
        if(newData.cTime){
            newData.cTime = newData.cTime.toString()
        }
        console.log(newData)
        let dataSource = this.state.dataSource.slice()
        dataSource.push(newData)
        this.setState({
            dataSource,
            addVisible: false
        })
    }
    render() {
        const { dataSource, loading } = this.state;
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <div className="foundation-category">
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
                                            <Option value="条目三">条目三</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" loading={loading} onClick={this.searchHandle}>查询</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card style={{ marginTop: 8 }}>
                        <Row gutter={40} type="flex" justify="end">
                            <Col span={4}>
                                <Button type="primary" onClick={this.addHandle}>新增</Button>
                                <Modal title="增加条目"
                                    visible={this.state.addVisible}
                                    onOk={() => { this.modalHandleOk("addVisible") }}
                                    onCancel={() => { this.modalHandleCancel("addVisible") }}
                                    footer={[
                                            <Button key="back" size="large" onClick={() => { this.modalHandleCancel("addVisible") }}>取消</Button>,
                                            <Button key="submit" type="primary" onClick={this.handleSubmit}>提交</Button>
                                        ]}
                                >
                                    <Form 
                                        onSubmit={this.handleSubmit}>
                                        <FormItem label="方案名称" {...formItemLayout}>
                                            { getFieldDecorator('name')(
                                                <Input />
                                            ) }
                                        </FormItem>
                                        <FormItem label="备注" {...formItemLayout}>
                                            { getFieldDecorator('message')(
                                                <Input />
                                            ) }
                                        </FormItem>
                                        <FormItem label="创建人" {...formItemLayout}>
                                            { getFieldDecorator('creater')(
                                                <Input />
                                            ) }
                                        </FormItem>
                                        <FormItem label="创建时间" {...formItemLayout}>
                                            { getFieldDecorator('cTime')(
                                                <DatePicker onChange={(date, dateString)=>{console.log(date)}} />
                                            ) }
                                        </FormItem>
                                        <FormItem>
                                            <Button type="submit" htmlType="submit">提交</Button>
                                        </FormItem>
                                    </Form>
                                </Modal>
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
                                            onOk={() => { this.modalHandleOk("detailVisible") }}
                                            onCancel={() => { this.modalHandleCancel("detailVisible") }}
                                            wrapClassName="vertical-center-modal"
                                        >
                                            {Object.keys(this.state.detailData).map((item) => {
                                                return <div key={item} className="detail">{this.state.detailData[item]}</div>
                                            })}
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
 
const Category = Form.create()(Categorys)

export default Category