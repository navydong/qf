import React from 'react';
import { axioscofig } from '../ajax/tools'
/**
 * 入口页面
 * @class Page
 * @extends {React.Component}
 */
class Page extends React.Component {
    componentWillMount(){

    }
    componentWillUnmount(){
        Storage.removeItem('openKey')
    }
    render() {
        return (
            <div style={{height: '100%'}}>
                {this.props.children}
            </div>
        )

    }
}

export default Page;