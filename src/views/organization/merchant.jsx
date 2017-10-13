import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col,  Button,  Card, Input,Table } from 'antd'
import AreaSelector from '../../components/AreaSelector'
import { areaData } from '../../components/AreaSelector/areaData'
import "./merchant.less"
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
        title: '进件状态',
        dataIndex: 'inState',
        key: 6
    },
    {
        title: '联系人姓名',
        dataIndex: 'contactName',
        key: 7
    },
    {
        title: '联系人邮箱',
        dataIndex: 'contactEmail',
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



class Merchant extends React.Component {
    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log('Received values of form',values)
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
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
                                <Button type="primary" htmlType="submit" className="fr">查询</Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
                <Card style={{marginTop:12}}>
                   <Row gutter={16}>
                       <Col span={24}>
                           <Button type="primary" htmlType="submit" className="fr">批量导入</Button>
                           <Button type="primary" htmlType="submit" className="fr gap-right">新增</Button>
                       </Col>
                   </Row>
                    <Row gutter={16}>

                    </Row>
                </Card>
            </div>
        )
    }
}
Merchant = Form.create()(Merchant)
export default Merchant