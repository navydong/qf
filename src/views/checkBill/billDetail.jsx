import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class BillDetail extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="账单核对" second="对账信息" />
                <p>对账信息</p>
            </div>
        )
    }
}

export default BillDetail