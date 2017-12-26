import React from 'react'
import { Row, Col, Card } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import Map from './Map'
import './index.less'


class Scatter extends React.Component {
    state = {
        loading: false,
        address: ''
    }
    componentDidMount() {

    }
    search = (values) => {
        console.log(values)
        if (!values.area) {
            this.map.search()
            return
        }
        this.setState({
            values
        })
        this.map.search(values)
    }
    render() {
        return (
            <div>
                <BreadcrumbCustom first="报表查询" second="设备分散散点图" location={this.props.location} />
                <Row gutter={10}>
                    <Col span={4}>
                        <Card>
                            <SearchBox loading={this.state.loading} search={this.search} />
                            <textarea id="textarea" rows="20"></textarea>
                        </Card>
                    </Col>
                    <Col span={20}>
                        <Card>
                            <Map address={this.state.address} ref={(e) => { this.map = e }} />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Scatter