import React, { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';


function mapSetValue(menu, menuMap) {
    for (let i = 0; i < menu.length; i++) {
        menuMap.set(menu[i].code, menu[i].title);
        if (menu[i].children) {
            mapSetValue(menu[i].children, menuMap)
        }
    }
}

function mapStateToProps(state) {
    const { data: menu, isFetching } = state.menu
    const menuMap = new Map()
    !isFetching && mapSetValue(menu, menuMap)
    return {
        menuMap
    }
}
@connect(mapStateToProps)
export default class BreadcrumbCustom extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isUser: false,
            first: '',
            second: '',
        }
    }
    componentWillReceiveProps(nextPros) {
        let urlArr = nextPros.location.pathname.slice(1).split('/')
        let first = urlArr[1]
        let second = urlArr[2]
        this.setState({
            isUser: urlArr[1] === 'user',
            first,
            second,
        })
    }
    render() {
        const { menuMap } = this.props
        const first = menuMap.get(this.state.first);
        const second = menuMap.get(this.state.second);
        return (
            <span>
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>{this.state.isUser ? '' : '移动支付管理平台'}</Breadcrumb.Item>
                    <Breadcrumb.Item>{first}</Breadcrumb.Item>
                    <Breadcrumb.Item style={{ color: '#f93030' }}>{second}</Breadcrumb.Item>
                </Breadcrumb>
            </span>
        )
    }
}
