import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import '../node_modules/antd/dist/antd.less'
import './style/index.less';
import './App.css'
import HeaderBar from './components/HeaderBar'
import SiderCustom from './components/SiderCustom';
import { receiveData } from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content, Footer } = Layout;


class App extends Component {
    state = {
        collapsed: false,
    };
    componentWillMount() {
        const { receiveData } = this.props;
        const user = JSON.parse(localStorage.getItem('user'));
        user && receiveData(user, 'auth');
    }
    render() {
        return (
            <div className="ant-layout-topaside">
                <HeaderBar />
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <SiderCustom path={this.props.location.pathname} />
                        <div className="ant-layout-content">
                            <div>
                                <div style={{clear: 'both'}}>
                                    <Content>
                                        {this.props.children}
                                        </Content>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Footer style={{ textAlign: 'center' }}>
                            ©2017 赢时胜科技股份有限公司
                        </Footer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}}, responsive = {data: {}} } = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
