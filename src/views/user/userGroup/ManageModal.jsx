import React from 'react'
import { Row, Col, Input, Table } from 'antd'

class ManageModal extends React.Component {
    render() {
        const columns = [{
            title: "按钮",
            dataIndex: "name",
        }, {
            title: "权限编码",
            dataIndex: "code",
        }, {
            title: "资源路径",
            dataIndex: "type",
        }, {
            title: "方式",
            dataIndex: "description"
        }]
        return (
            <div className="manage-modal">
                <Row>
                    <Col span={12}>

                    </Col>
                    <Col span={12}>
                        <Table columns={columns} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ManageModal