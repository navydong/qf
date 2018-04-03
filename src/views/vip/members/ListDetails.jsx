import React from 'react'
import { Modal, Row, Col } from 'antd'

export default class ListDetails extends React.Component {
    state = {
        visible: false
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render() {
        // console.log(this.props.data)
        const { visible } = this.state
        const { nameInfo = {}, phone, code, bonus, level } = this.props.data
        const title = <div className="title" >
            <span>会员姓名: {nameInfo.name}</span>
            <span>会员手机: {phone}</span>
            <span>会员卡号: {code}</span>
        </div>
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
                wrapClassName="listdetails"
            >
                <Row gutter={14}>
                    <Col span={12}>
                       <span>积分: {bonus}</span>
                    </Col>
                    <Col span={12}>
                        <span>等级: {level}</span>
                    </Col>
                </Row>
            </Modal>
        )
    }
}