import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class WxPay extends React.Component {
    render(){
        return (
            <div>
                <BreadcrumbCustom first="账单核对" second="微信对账单" />
                <p>微信对账单</p>
            </div>
        )
    }
}

export default WxPay