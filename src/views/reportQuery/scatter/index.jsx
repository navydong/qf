import React from 'react'
import { Row, Col, Card } from 'antd'
import axios from 'axios'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import SearchBox from './SearchBox'
class Scatter extends React.Component {
    state = {
        loading: true
    }

    search = (values)=>{
        console.log(values)
    }
    render(){
        return (
            <div>
                <BreadcrumbCustom first="报表查询" second="设备分散散点图" />
                <Row gutter={40}>
                    <Col>
                        <Card>
                            <SearchBox loading={this.state.loading} search={this.search} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={40}>
                    <Col>
                        <Card>
                            1
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Scatter