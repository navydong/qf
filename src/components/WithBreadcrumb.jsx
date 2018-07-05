import React, { Component } from 'react'

import BreadcrumbCustom from './BreadcrumbCustom'

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

// 写入面包屑导航的高阶组
export default (isUser) => (WrappedComponent) => class HOC extends Component {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`
    render() {
        return (
            <div>
                <BreadcrumbCustom user={isUser} location={this.props.location} />
                <WrappedComponent {...this.props} />
            </div>
        )
    }
}


// 现在没用了



