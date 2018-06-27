import React from 'react'
import { Row, Col, Card, Input } from 'antd'
import SearchBox from './SearchBox'
import Map from './Map'
import Panel from '@/components/Panel'

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
                <Row gutter={10}>
                    <Col span={4}>
                        <SearchBox loading={this.state.loading} search={this.search} />
                        <TextArea id="textarea" rows={26} value={this.state.textValue} readOnly style={{ resize: 'none' }} />
                    </Col>
                    <Col span={20}>
                        {/* <Card noHovering >
                            <Map
                                address={this.state.address}
                                ref={(e) => { this.map = e }}
                                setTextValue={this.setTextValue}
                            />
                        </Card> */}

                        <Panel title="设备分布图" height={600} >
                            <Map
                                address={this.state.address}
                                ref={(e) => { this.map = e }}
                                setTextValue={this.setTextValue}
                            />
                        </Panel>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Scatter
