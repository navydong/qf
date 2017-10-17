import React, { Component } from 'react'
import { Row, Col, Card, Form, Button, Icon, Table, Modal, Input } from 'antd'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
const FormItem = Form.Item

const columns = []
const columnsDada = ['序号', '操作', '通道名称', '备注', '创建人', '创建时间', '修改人', '修改时间']
columnsDada.forEach((item, index) => {
    columns.push({
        title: item,
        dataIndex: `s${index}`,
        key: index
    })
})



let data = [
    {
        key: '1',
        s0: '1',
        s1: '操作',
        s2: '支付宝',
        s3: '',
        s4: '平台管理员',
        s5: '2017-10-10 14:18:12',
        s6: '平台管理员',
        s7: '2017-10-10 14:18:12'
    },
    {
        key: '2',
        s0: '2',
        s1: '操作',
        s2: '支付宝',
        s3: '',
        s4: '平台管理员',
        s5: '2017-10-10 14:18:12',
        s6: '平台管理员',
        s7: '2017-10-10 14:18:12'
    },
];
/**
 * 获取当前格式化日期函数
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}
class Templates extends Component {
    state = {
        data,
        visible: false,
        selectedRowKeys: []  // 当前有哪些行被选中, 这里只保存key
    }
    addHandle = () => {
        this.setState({
            visible: true
        })
    }
    /**
     * 点击删除按钮, 弹出一个确认对话框
     * 注意区分单条删除和批量删除
     * 
     * @param e
     */
    onClickDelete = (e) => {
        // let data = this.state.data.slice()
        // this.state.selectedRows.forEach((item)=>{
        //     data.splice(item.key-1,1)
        // })
        // this.setState({
        //     data: data
        // })
        e.preventDefault();
        Modal.confirm({
            title: this.state.selectedRowKeys.length > 1 ? '确认批量删除' : '确认删除',
            content: `当前被选中的行: ${this.state.selectedRowKeys.join(', ')}`,
            // 这里注意要用箭头函数, 否则this不生效
            onOk: () => {
                this.handleDelete();
            },
        });
    }
    /**
     * 发送http请求，删除数据，更新表格
     */
    handleDelete(keys = this.state.selectedRowKeys) {
        let data = this.state.data.slice()
        for (let i = 0, len = data.length; i < len; i++) {
            for(let j=0;j<keys.length;j++){
                if (data[i] && data[i].key === keys[j]) {
                    data.splice(i, 1);
                    i--;
                }
            }
        }
        this.setState({
            data: data
        })
    }

    handleOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                data.push({
                    key: data.length + 1,
                    s0: '1',
                    s1: '操作',
                    s2: values.tongdaomingcheng,
                    s3: '',
                    s4: '平台管理员',
                    s5: getNowFormatDate(),
                    s6: '平台管理员',
                    s7: ''
                }, )
                this.setState({
                    visible: false,
                    data
                });
                this.props.form.resetFields();//清空表单
            }
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    /**
     * 处理表格的选择事件
     * 
     * @param selectedRowKeys
     */
    onTableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange,
        };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 16
            }
        }
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        return (
            <div className="templateClass">
                <BreadcrumbCustom first="基础设置" second="通道信息" />
                <Card>
                    <Row gutter={40} style={{marginBottom:20}}>
                        <Col span={6} push={18}>
                            <Button
                                type="primary"
                                icon="plus-circle-o"
                                onClick={this.addHandle}
                            >增加</Button>
                            <Button type="primary"
                                icon="close-circle-o"
                                disabled={!hasSelected}
                                onClick={this.onClickDelete}
                            >
                                {multiSelected ? '批量删除' : '删除'}
                            </Button>
                            <Button type="primary" icon="printer">打印</Button>
                            <Button type="primary" icon="file-excel">Excel</Button>
                            <Modal
                                title="新增-通道信息"
                                okText="提交"
                                width="50%"
                                wrapClassName="vertical-center-modal"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >                           
                                <Form onSubmit={this.handleOk}>
                                    <Row gutter={40}>
                                        <Col span={12}>
                                            <FormItem label="通道名称" {...formItemLayout}>
                                                {getFieldDecorator('tongdaomingcheng', {
                                                    rules: [{ required: true, message: 'Please input' }],
                                                })(
                                                    <Input />
                                                    )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="通道ID" {...formItemLayout}>
                                                <Input disabled />
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="备注" {...{
                                                labelCol: {
                                                    span: 2
                                                },
                                                wrapperCol: {
                                                    span: 20
                                                }
                                            }}>
                                                <Input type="textarea" rows={4} />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table
                                columns={columns}
                                dataSource={this.state.data}
                                rowSelection={rowSelection}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

const Template = Form.create()(Templates)
export default Template



{
    <style>
{`
    .vertical-center-modal {
                text - align: center;
        &::before {
                content: '';
            display: inline-block;
            height: 100%;
            vertical-align: middle;
            width: 0;
        }
        .detail {
                white - space: initial;
            text-indent: 2em;
        }
        .ant-modal {
                display: inline-block;
            vertical-align: middle;
            top: 0;
            text-align: left;
        }
    }
    `}
</style>
}