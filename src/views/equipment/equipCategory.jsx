import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col,  Button,  Card, Input,Table, Modal, Radio, Icon } from 'antd'
const FormItem = Form.Item;
const dataSource = [];
for(let i = 0;i < 100;i++){
    dataSource.push({
        id: i,
        types: `${i}扫码枪`,
        createPerson: `${i}平台管理员`,
        createTime: new Date().getDate(),
        changePerson: '',
        changeTime: '',
        checkStatus: '已审核',
        checkPerson: '平台管理员',
        checkTime: new Date().getDate()
    })
}


class equipCategory extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        data: dataSource,
        columns: [{
            title: '序号',
            dataIndex: 'id',
            render: (text, record) => <a href={record.url} target="_blank">{text}</a>
        }, {
            title: '设备类名称',
            dataIndex: 'types',
        }, {
            title: '创建人',
            dataIndex: 'createPerson',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
        },{
            title: '修改人',
            dataIndex: 'changePerson',
        },{
            title: '修改时间',
            dataIndex: 'changeTime'
        },{
            title: '审核状态',
            dataIndex: 'checkStatus'
        },{
            title: '审核人',
            dataIndex: 'checkPerson'
        },{
            title: '审核时间',
            dataIndex: 'checkTime',
        },
            {
                title: '操作',
                dataIndex: 'action',
                render: text => (
                    <div>
                        <Button type="primary" htmlType="submit" onClick={() => this.handlerDetail()}>详细</Button>
                    </div>
                )
            }
        ]
    };
    handlerDetail(){
        console.log()
    }
    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log('Received values of form',values)
        })
    }
    handleInsert(){
        console.log('aa')
    }

    handleUpdate(){
        console.log('bb')
    }
    handleDelete(){
        console.log('cc')
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="terminal-wrapper">
                <BreadcrumbCustom first="设备管理" second="设备终端" />
                <Card className="terminal-top-form">
                    <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                        <Row gutter={12}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`设备终端名称`}>
                                    {getFieldDecorator(`terminalName`)(
                                        <Input placeholder={`设备终端名称`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`商户名称`}>
                                    {getFieldDecorator(`contactName`)(
                                        <Input placeholder={`商户名称`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" htmlType="submit" className="fr gap-right">查询</Button>
                                <Button type="primary"  className="fr gap-right">重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className="terminal-main-table">
                    <Row gutter={12}>
                        <Col span={24}>
                            <Button.Group size={"default"}>
                                <Button type="primary" onClick={this.handleInsert}>
                                    <Icon type="plus-circle-o" />新增
                                </Button>
                                <Button type="primary" onClick={this.handleUpdate}>
                                    <Icon type="edit" /> 修改
                                </Button>
                                <Button type="primary" onClick={this.handleDelete}>
                                    <Icon type="delete" />删除
                                </Button>
                            </Button.Group>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Table bordered rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.data} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

equipCategory = Form.create()(equipCategory)
export default equipCategory