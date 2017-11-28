import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';

class BreadcrumbCustom extends React.Component {
    render() {
        const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item style={{ color: '#f93030' }}>{this.props.second}</Breadcrumb.Item> || '';
        return (
            <span>
                <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item>{this.props.user ? '' : '移动支付管理平台'}</Breadcrumb.Item>
                    {first}
                    {second}
                </Breadcrumb>
            </span>
        )
    }
}

export default BreadcrumbCustom;
