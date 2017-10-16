import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class shareConfig extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="分润管理" second="分润统计" />
                <p>分润统计</p>
            </div>
        )
    }
}

export default shareConfig