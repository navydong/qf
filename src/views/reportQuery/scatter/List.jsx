import React from 'react'
import PropTypes from 'prop-types'
class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        const { title, merchantName, addressdetail, p0, p1 } = this.props
        return (
            <div>
                <h4>{title}</h4>
                <ul>
                    <li>
                        <span>商户名称：</span>
                        {merchantName}
                    </li>
                    <li>
                        <span>地址：</span>
                        {addressdetail}
                    </li>
                    <li>
                        <span>纬度、经度</span>
                        {p0}，{p1}
                    </li>
                </ul>
            </div>
        )
    }
}

List.propTypes = {
    merchantName: PropTypes.string,
    addressdetail: PropTypes.string,
    p0: PropTypes.number,
    p1: PropTypes.number
}
export default List