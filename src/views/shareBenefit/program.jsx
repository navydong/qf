import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col,  Button,  Card, Input,Table, Modal, Radio, Icon } from 'antd'
import axios from 'axios'
import ShareForm from '../../components/NormalForm'
import SharedForm from "../../components/NormalForm/index";
const FormItem = Form.Item;

class ShareBenefitPage extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        dataSource: [],
        visible: false,
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
        }, {
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

    componentWillMount(){
        this._getShareBenefitList();
    }

    _getShareBenefitList(limit=10,offset=1,name='',passwayid=''){
        axios.get(`/back/frscheme/schemes?limit=${limit}&offest=${offset}&name=${name}&passwayid=${passwayid}`)
            .then((resp)=>{
                const dataSource = resp.data.result.list;
                this.setState({
                    dataSource: dataSource
                })
            })
    }

    handlerDetail(){
        console.log()
    }
    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err,values) => {
            console.log(values.shareName)
            const limit = 10,offset=1,name=values.shareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
        })
    }

    handleUpdate(){
        console.log('bb')
    }
    handleDelete(){
        const keys = this.state.selectedRowKeys;
        const newDataSource = [];
        const keySet = new Set(keys);
        for( const record of this.state.dataSource ){
            if(!keySet.has(record.key)){
                newDataSource.push(record);
            }
        }
        this.setState({selectedRowKeys:[],dataSource:newDataSource})
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handlerHideModal = (e) => {
        console.log(e)
        this.setState({
            visible: false
        })
    }

    handlerModalOk = (err,values) => {
        this.refs.form.validateFields((err, values) => {
            console.log(values)
            const limit = 10,offset=1,name=values.newShareName,passwayid='';
            this._getShareBenefitList(limit,offset,name,passwayid)
            if(!err){
                this.handlerHideModal()
            }
        });
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
                <BreadcrumbCustom first="分润管理" second="分润方案" />
                <Card className="terminal-top-form">
                    <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                        <Row gutter={12}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`姓名`}>
                                    {getFieldDecorator(`shareName`)(
                                        <Input placeholder={``} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button type="primary" htmlType={"reset"}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card className="terminal-main-table">
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
                    <Modal title="新增-分润方案" onOk={this.handlerModalOk} onCancel={this.handlerHideModal} visible={this.state.visible} width={400}>
                        <h3 className="title">基本信息</h3>
                        <SharedForm ref="form" onSubmit={this.handlerModalOk}/>
                    </Modal>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Table bordered rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

ShareBenefitPage = Form.create()(ShareBenefitPage)
export default ShareBenefitPage