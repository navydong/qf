import React from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class BreadcrumbCustom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            first: '',
            second: '',
        }
    }
    componentWillReceiveProps() {
        let urlArr = this.props.location.pathname.split('/')
        let first = urlArr[2]
        let second = urlArr[3]
        this.setState({
            first,
            second,
        })
    }

    

    render() {
        const { menu } = this.props
        const menuMap = new Map();
        const browseMenu = (item) => {
            menuMap.set(item.code, item.title);
            if (item.children) {
                item.children.forEach(browseMenu);
            }
        };
        let sidebarMenu = []
        if(!menu.isFetching){
            sidebarMenu = this.props.menu.data
        }
        sidebarMenu && sidebarMenu.forEach(browseMenu);
        this.menuMap = menuMap;
        const first = <Breadcrumb.Item>{this.menuMap.get(this.state.first)}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item style={{ color: '#f93030' }}>{this.menuMap.get(this.state.second)}</Breadcrumb.Item> || '';
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


// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapStateToProps(state) {
    return {
        menu: state.menu,
    };
}


// export default BreadcrumbCustom;
export default connect(
    mapStateToProps
)(BreadcrumbCustom)
