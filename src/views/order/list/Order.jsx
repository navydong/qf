import React, { PureComponent } from 'react'
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
    state = {
        expanded: true
    }
    componentDidMount(){
        this.productContent.style.height = this.productContent.scrollHeight+ 'px'
    }
    expand = () => {
        const productContentHeight = this.productContent.scrollHeight
        if (!this.state.expanded) {
            this.productContent.style.height = productContentHeight + 'px'
            this.productContent.style.opacity = 1
        } else {
            this.productContent.style.height = '0px'
            this.productContent.style.opacity = 0
        }
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    }
    render() {
        const { tableNum, odertime, status, products, commnent, nvoice } = this.props.record
        const title = (<section>
            <span className="table-number">
                桌号：<i>{tableNum}</i>
            </span>
            <span className="order-time" >下单时间: {odertime}</span>
        </section>)
        const statusNode = <span className="order-stataus">{status}</span>
        return (<div className="order-list">
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
                <div className="order-product" >
                    <section className="product-header">
                        <span>商品</span>
                        <span className="expand">
                            <a href="javascript:;" onClick={this.expand}>{this.state.expanded?'收起':'展开'}</a>
                            <Icon type={this.state.expanded?'up':'down'} style={{ fontSize: 12, color: '#f93030' }} />
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
        </div>)
    }
}