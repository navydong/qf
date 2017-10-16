import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class Service extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="机构信息" second="服务商信息" />
                <p>服务商信息</p>
            </div>
        )
    }
}

export default Service