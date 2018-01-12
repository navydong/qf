import React, { Component } from 'react';
import axios from 'axios'
import '../node_modules/antd/dist/antd.less'
import { Layout } from 'antd';
import './style/index.less';
import HeaderBar from './components/HeaderBar'
import SiderCustom from './components/SiderCustom';
import { getMenu } from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content, Footer } = Layout;


class App extends Component {
    state = {
        collapsed: false,
        userName: '匿名用户'
    };
    componentWillMount() {
        const { getMenu } = this.props;
        getMenu()
        axios.get('/back/user').then(res=>res.data).then(res=>{
            this.setState({
                userName: res.name
            })
        })
        
    }
    render() {
        return (
            <div className="ant-layout-topaside">
                <HeaderBar user={{userName: this.state.userName}} />
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <SiderCustom path={this.props.location.pathname} />
                        {/* <div className="linebar"></div> */}
                        <div className="layout-content">
                            <Content>
                                {this.props.children}
                            </Content>
                        </div>
                    </div> 
                </div>
                <Footer style={{ textAlign: 'center', marginLeft: 220 }}>
                    ©2017 赢时胜科技股份有限公司
                </Footer>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}}, responsive = {data: {}} } = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    getMenu: bindActionCreators(getMenu, dispatch),
    // getMenu: ()=>{
    //     dispatch(getMenu())
    // }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
