import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import axios from 'axios'
import { Form, Row, Col,  Button,  Card, Input,Table, Modal, Icon, Cascader } from 'antd'
import { AreaData } from '../../components/AreaSelector/areaData'
import "./merchant.less"
const FormItem = Form.Item;

const columns = [
    {
        title: "序号",
        dataIndex: 'order_id'
    },
    {
        title: "商户名称",
        dataIndex: 'merchantName'
    },
    {
        title: "商户简称",
        dataIndex: 'merchantStname'
    },
    {
        title: '受理机构',
        dataIndex: 'solveOran'
    },
    {
        title: '可用通道',
        dataIndex: 'passway_ids'
    },
    {
        title: '用户所在地区',
        dataIndex: 'region'
    },
    {
        title: '联系人姓名',
        dataIndex: 'linkman'
    },
    {
        title: '联系人手机',
        dataIndex: 'lkmphone'
    },
    {
        title: '操作',
        dataIndex: 'action',
        render: text => (
            <div>
                <Button type="primary" htmlType="submit">详细</Button>
            </div>
        )
    }
]

class Merchant extends React.Component {
    state = {
        loading: false,
        visible: false,
        dataSource: [],
        selectedRowKeys: []
    }
    componentWillMount(){
        this._getMerchantList();
    }


    _sloveRespData(dataSource){
        dataSource.forEach((item,index) => {
            item['key'] = item.id;
            item['order_id'] = index + 1;

        })
        return dataSource;
    }

    _getMerchantList(){
        axios.get(`/back/merchantinfoController/page`).then((resp) => {
            const dataSource = resp.data.rows;
            this.setState({
                dataSource: this._sloveRespData(dataSource)
            })
        })
    }
    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log('Received values of form',values)
        })
    }
    _deleteAjax(orgIds,orgCodes,dataSource){
        axios.delete(`/back/merchantinfoController/deleteByIds/${orgIds}/${orgCodes}`).then((resp)=>{
            const respData = resp.data;
            console.log(respData)
        })
        this.setState({
            dataSource: dataSource
        })
    }
    handleDelete(){
        const keys = this.state.selectedRowKeys;
        const newDataSource = [];
        const keySet = new Set(keys);
        let orgIds = '',
            orgCodes = '';
        for( const record of this.state.dataSource ){
            if(!keySet.has(record.key)){
                newDataSource.push(record)
            }else{
                orgIds = record.id;
                orgCodes = record.merCode;
            }
        }
        newDataSource.forEach((item,index) => {
            item['order_id'] = index + 1;
        })

        this._deleteAjax(orgIds,orgCodes,newDataSource)
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    hanlderOk = (e) => {
        this.setState({
            visible: false
        })
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }
    handleCancel = ()=>{
        this.setState({
            visible: false
        })
    }

    handlerAreaSelectChange = (value) => {
        console.log(value)
    }
     render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {visible,loading} = this.state;
        return (
            <div className="merchant-wrapper">
                <BreadcrumbCustom first="机构信息" second="商户" />
                <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                    <Card>
                        <Row>
                            <Col span={8} >
                                <FormItem {...formItemLayout} label={`商户名称`}>
                                    {getFieldDecorator(`merchantName`)(
                                        <Input placeholder={`商户名称`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人姓名`}>
                                    {getFieldDecorator(`contactName`)(
                                        <Input placeholder={`联系人姓名`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人手机`}>
                                    {getFieldDecorator(`contactPhone`)(
                                        <Input placeholder={`联系人手机`} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Row>
                                    <Col span={8}>
                                        <span style={{paddingLeft: 66}}>地址:</span>
                                    </Col>
                                    <Col span={16}>
                                        <Cascader options={AreaData} onChange={ this.handlerAreaSelectChange } changeOnSelect placeholder="请选择" />
                                    </Col>
                                </Row>

                            </Col>
                            <Col offset={14}>
                                <Button type="primary" className="fr">批量导入</Button>
                                <Button type="primary"  className="fr gap-right" onClick={this.showModal}>新增</Button>
                                <Button type="primary" htmlType="submit" className="fr gap-right">查询</Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
                <Card style={{marginTop:12}}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={this.showModal}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleUpdate()}}>
                                    <Icon type="edit" /> 修改
                                </Button>
                                <Button type="primary" onClick={()=>{this.handleDelete()}}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Row className="gap-top">
                        <Col span={24}>
                            <Table bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} size={"middle"}></Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Modal
                                visible={visible}
                                title="新增-商户基本信息"
                                onOk={this.hanlderOk}
                                onCancel={this.handleCancel}
                                width={'800'}
                                footer={[
                                    <Button key="back" size="large" onClick={this.handleCancel}>保存</Button>,
                                    <Button key="submit" type="primary" size="large" loading={loading} onClick={this.hanlderOk}>重置</Button>,
                                ]}
                            >
                                <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                                    <Card>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`商户名称`}>
                                                    {getFieldDecorator(`merchantName`)(
                                                        <Input placeholder={`商户简称`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`可用通道`}>
                                                    {getFieldDecorator(`contactName`)(
                                                        <Input placeholder={`联系人姓名`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`商户详细地址`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`商户所在省`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`商户所在市`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`商户所在区`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`业务员`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`联系人姓名`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>

                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`联系人手机`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem {...formItemLayout} label={`联系人邮箱`}>
                                                    {getFieldDecorator(`contactPhone`)(
                                                        <Input placeholder={`联系人手机`} />
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Form>
                            </Modal>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
Merchant = Form.create()(Merchant)
export default Merchant