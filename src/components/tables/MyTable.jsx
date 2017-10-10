import React, { Component } from 'react'
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card } from 'antd';

class MyTable extends Component {
    componentDidMount(){
        
    }
    componentWillUnmount(){

    }
    render(){
        return (
            <div>
                <BreadcrumbCustom first="表格" second="我的表格" />
                <Row gutter={16}>
                    <Col md={24}>
                        <div>
                            <Card title="测试数据">
                                1
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default MyTable