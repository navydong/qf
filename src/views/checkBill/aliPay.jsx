import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class AliPay extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="账单核对" second="支付宝对账单" />
                <p>支付宝对账单</p>
            </div>
        )
    }
}

export default AliPay