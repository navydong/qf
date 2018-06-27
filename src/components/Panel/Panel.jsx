import React, { Component } from 'react'
import { Icon } from 'antd'
import './style/index.less'

export default class Panel extends Component {
    static defaultProps = {
        prefix: 'panel'
    }
    state = {
        expand: false
    }
    onExpand(expand) {
        this.setState({
            expand
        });
        const { onChange } = this.props
        if (onChange) {
            onChange({
                expand
            });
        }
    }
    render() {
        const { prefix, title, height } = this.props
        const { expand } = this.state
        const bodyStyles = {};
        if (!expand) {
            bodyStyles.height = height;
        }
        const header = <section className={`${prefix}-header`} >
            <span className={`${prefix}-header-title`} >{title}</span>
            <span className={`${prefix}-header-controls`}>
                <a onClick={this.onExpand.bind(this, expand ? false : true)} >
                    <Icon type={`${expand ? 'shrink' : 'arrows-alt'}`} />
                </a>
            </span>
        </section>
        return (
            <div className={`${prefix}${expand ? ' panel-fullscreen' : ''}`} style={this.props.style} >
                {header}
                <section className={`${prefix}-body`} style={bodyStyles} >
                    {this.props.children}
                </section>
            </div>
        )
    }
}  