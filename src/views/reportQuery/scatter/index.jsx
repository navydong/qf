import React from 'react'
import { Row, Col, Card } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import Map from './Map'
import './index.less'

/**
 * 报表查询      设备分布图
 * reportQuery   scatter
 * @class Scatter
 * @extends {React.Component}
 */
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
                <BreadcrumbCustom location={this.props.location} />
                <Row gutter={10}>
                    <Col span={4}>
                        <Card>
                            <SearchBox loading={this.state.loading} search={this.search} />
                            <textarea id="textarea" rows="20" ref={e=> this.textarea = e }  />
                        </Card>
                    </Col>
                    <Col span={20}>
                        <Card>
                            <Map address={this.state.address} ref={(e) => { this.map = e }} textarea={this.textarea} />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Scatter