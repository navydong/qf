import React from 'react'
import PropTypes from 'prop-types'

export default class CardCustom extends React.Component {
    render() {
        const { color, money, data, text } = this.props
        return (
            <div className="content clear">
                <div className="left">
                    <i className="iconfont icon-jine" style={{ color }}></i>
                </div>
                <div className="right">
                    <div className="up">{money ? '￥' : null}{data || 0}</div>
                    <div className="all">{text}</div>
                </div>
            </div>
        )
    }
}
CardCustom.propTypes = {
    color: PropTypes.string,
    money: PropTypes.bool,
    data: PropTypes.number,
    text: PropTypes.string.isRequired
}