import React, { Component } from 'react'
import { Spin } from 'antd'
export default function (props) {
    return (
        <div className="component-loading" >
            <Spin tip="应用加载中" />
        </div>
    )
}