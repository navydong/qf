import React from 'react'
import { Row, Col, Modal, Form, Input } from 'antd';

const FormItem = Form.Item

export default class Modify extends React.Component {
    state = {
        visible: false,
    }
    showModal = (bonus) => {
        this.setState({
            visible: true,
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const { data } = this.props
        return (<div>
            <Modal
                title="修改"
                visible={this.state.visible}
                onCancel={this.onCancel}
            >
                <Form className="ant-advanced-search-form" >
                    <Row>
                        <Col span={24} >
                            <FormItem label="积分" >
                                <Input defaultValue={data.bonus} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div >)
    }
}