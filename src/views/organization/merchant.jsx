import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col,  Button,  Card, Input,Table, Modal } from 'antd'
import AreaSelector from '../../components/AreaSelector'
import { areaData } from '../../components/AreaSelector/areaData'
import "./merchant.less"
import axios from 'axios'
const FormItem = Form.Item;

const columns = [
    {
        title: "商户名称",
        dataIndex: 'merchantName',
        key: 1
    },
    {
        title: "商户简称",
        dataIndex: 'merchantAbbr',
        key: 2
    },
    {
        title: '受理机构',
        dataIndex: 'solveOran',
        key: 3
    },
    {
        title: '服务商',
        dataIndex: 'serviceOran',
        key: 4
    },
    {
        title: '可用通道',
        dataIndex: 'ableSource',
        key: 5
    },
    {
        title: '用户所在地区',
        dataIndex: 'userLocal',
        key: 6
    },
    {
        title: '联系人姓名',
        dataIndex: 'contactName',
        key: 7
    },
    {
        title: '联系人手机',
        dataIndex: 'contactPhone',
        key: 8
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

const data = [
    {
        key:1,
        merchantName: '1',
        merchantAbbr: '1',
        solveOran: '1',
        serviceOran: '1',
        ableSource: '1',
        inState: '1',
        contactName: '1',
        contactEmail: '1'
    }
]


class Merchant extends React.Component {
    state = {
        loading: false,
        visible: false
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log('Received values of form',values)
        })
    }

    handlerAdd(){
        axios.get('/qfback/element/page?limit=10&offset=0&_=1506338067853').then((resp)=>{
            console.log(resp)
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
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
                                <FormItem {...formItemLayout} label={`地址`}>
                                    {getFieldDecorator('address',{
                                        initialValue: {
                                            province: '110000',
                                            city:'110100',
                                            county: '110101'
                                        }
                                    })(
                                        <AreaSelector data={areaData}/>
                                    )}
                                </FormItem>
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
                    <Row className="gap-top">
                        <Col span={24}>
                            <Table bordered  columns={columns} dataSource={data} size={"middle"}></Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Modal
                                visible={visible}
                                title="新增-商户基本信息"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                width={'800'}
                                footer={[
                                    <Button key="back" size="large" onClick={this.handleCancel}>保存</Button>,
                                    <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>重置</Button>,
                                ]}
                            >
                                <h3></h3>
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