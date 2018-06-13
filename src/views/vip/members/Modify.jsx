import React from 'react'
import { Row, Col, Modal, Form, Input } from 'antd';

const FormItem = Form.Item

export default class Modify extends React.Component {
    state = {
        visible: false,
        confirmLoading: false
    }
    showModal = (bonus) => {
        this.setState({
            visible: true,
        })
    }
    onOk = () => {
        this.setState({ confirmLoading: true })
        alert()
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    onChange = (e)=>{
        const value = e.target.value
        this.setState({
            value
        })
    }
    render() {
        const { data } = this.props
        return (<div>
            <Modal
                title="修改"
                visible={this.state.visible}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.onCancel}
                onOk={this.onOk}
            >
                <Form className="ant-advanced-search-form" >
                    <Row>
                        <Col span={24} >
                            <FormItem label="积分" >
                                <Input
                                    value={this.state.bonus}
                                    onChange={this.onChange}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div >)
    }
}