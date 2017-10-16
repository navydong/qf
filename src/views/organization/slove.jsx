import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class Slove extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="机构信息" second="受理机构信息" />
                <p>受理机构信息</p>
            </div>
        )
    }
}

export default Slove