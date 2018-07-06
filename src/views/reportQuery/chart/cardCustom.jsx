import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'

export default class CardCustom extends React.Component {
    render() {
        const { color, money, data, text, icon, count } = this.props
        const title = (data = []) => {
            return <ul>
                <li>交易总笔数: {data[0]}</li>
                <li>支付成功笔数: {data[1]}</li>
                <li>退款成功笔数: {data[2]}</li>
                <li>部分退款笔数: {data[3]}</li>
            </ul>
        }
        return (
            <div className={`content clear ${this.props.className}`} >
                <div className="left">
                    <i className={`iconfont ${icon}`} style={{ color }}></i>
                </div>
                <div className="right">
                    {
                        count ? <Tooltip placement="topLeft" title={title(data)}>
                            <div className="up" style={{cursor: 'pointer'}} >
                                {data ? data[0] : 0}
                            </div>
                        </Tooltip>
                            : <div className="up">
                                {money ? '' : null}
                                {
                                    count
                                        ? data ? data[0] : 0
                                        : data || 0
                                }
                            </div>
                    }

                    <div className="all">{text}</div>
                </div>
            </div>
        )
    }
}
CardCustom.propTypes = {
    color: PropTypes.string,
    money: PropTypes.bool,
    // data: PropTypes.array,
    text: PropTypes.string.isRequired
}