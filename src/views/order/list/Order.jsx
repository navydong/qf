import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'antd'
import fmoney from '@/utils/fmoney'

import './list.less'


function ProductList(props) {
    const { name, number, price } = props.product
    return (<li className="product-list">
        <span className="product-name">{name}</span>
        <span className="product-num" >x{number}</span>
        <span className="product-price">{fmoney(price)}</span>
    </li>)
}

export default class Order extends PureComponent {
    static propTypes = {
        record: PropTypes.object.isRequired
    }
    state = {
        expanded: true
    }
    componentDidMount(){
        this.productContent.style.height = this.productContent.scrollHeight + 'px'
    }
    expand = () => {
        if(this.state.expanded){
            this.productContent.style = null
        }else{
            this.productContent.style.height = this.productContent.scrollHeight + 'px'
        }
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    }
    close(id, e) {
        this.setState({
            animate: true
        })
        // 延迟时间要也 list.less 中 animation-duration: 0.5s; 设定的时间相同
        setTimeout(this.props.close, 500, id)
    }
    render() {
        const { tableNum, odertime, status, products, commnent, nvoice, id } = this.props.record
        const title = (<section className="order-list-title" >
            <span className="table-number">
                桌号：<i>{tableNum}</i>
            </span>
            <span className="order-time" >
                下单时间: {odertime}
            </span>
            {/* <span className="order-stataus">{status}</span> */}
        </section>)
        const statusNode = <a onClick={this.close.bind(this, id)} ><Icon type="close" /></a>
        return (
            <div className={`order-list animated ${this.state.animate ? ' fadeOutLeft' : ''}`}>
                <Card title={title} extra={statusNode} noHovering >
                    <div className="order-body">
                        <section>
                            <span className="comment" >备注： </span>
                            <span className="comment-content">{commnent}</span>
                        </section>
                        <section>
                            <span className="comment" >发票： </span>
                            <span className="comment-content">{nvoice}</span>
                        </section>
                    </div>
                    <div className="dashline" ></div>
                    <div className="dashline"></div>
                    <div className={`order-product${this.state.expanded?'':' collapse'}`}>
                        <section className="product-header">
                            <span>商品</span>
                            <span className="expand">
                                <a href="javascript:;" onClick={this.expand}>{this.state.expanded ? '收起' : '展开'}</a>
                                <Icon type={this.state.expanded ? 'up' : 'down'} style={{ fontSize: 12, color: '#f93030' }} />
                            </span>
                        </section>
                        <ul className="product-content" ref={e => this.productContent = e}>
                            {
                                products.map((product, index) => {
                                    return <ProductList product={product} key={index} />
                                })
                            }
                        </ul>
                    </div>
                </Card>
            </div>
        )
    }
}