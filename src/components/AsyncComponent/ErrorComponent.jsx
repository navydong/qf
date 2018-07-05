import React, { Component } from 'react'
import { Alert } from 'antd'
export default class ErrorComponents extends Component {
    refresh = ()=>{
        window.location.reload()
    }
    render(){
        return (
            <div className="component-error component-loading">
                <Alert message={<span>应用加载错误，请<b className="component-error-refresh" onClick={this.refresh}>刷新</b>浏览器</span>} type="error" showIcon />
            </div>
        )
    }
}