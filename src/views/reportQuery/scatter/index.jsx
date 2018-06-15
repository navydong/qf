import React from 'react'
import { Row, Col, Card, Input } from 'antd'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import SearchBox from './SearchBox'
import Map from './Map'
import './index.less'

const TextArea = Input.TextArea

/**
 * 报表查询      设备分布图
 * reportQuery   scatter
 * @class Scatter
 * @extends {React.Component}
 */
class Scatter extends React.Component {
    state = {
        loading: false,
        address: '',
        MerchanList: []       //商户列表
    }
    componentDidMount() {

    }
    search = (values) => {
        if (!values.area) {
            this.map.search()
            return
        }
        this.setState({ MerchanList: values })
        this.map.search(values)

    }
    setTextValue = (value = []) => {
        this.setState({
            textValue: value
        })
    }
    render() {
        return (
            <div>
                <BreadcrumbCustom location={this.props.location} />
                <Row gutter={10}>
                    <Col span={4}>
                        <SearchBox loading={this.state.loading} search={this.search} />
                        <TextArea id="textarea" rows={26} value={this.state.textValue} readOnly style={{ resize: 'none' }} />
                    </Col>
                    <Col span={20}>
                        <Card noHovering >
                            <Map address={this.state.address} ref={(e) => { this.map = e }} setTextValue={this.setTextValue} />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Scatter
