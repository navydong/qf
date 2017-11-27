import React, { Component } from 'react';
import axios from 'axios'
import '../node_modules/antd/dist/antd.less'
import { Layout } from 'antd';
import './style/index.less';
import HeaderBar from './components/HeaderBar'
import SiderCustom from './components/SiderCustom';
import { receiveData } from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content, Footer } = Layout;


class App extends Component {
    state = {
        collapsed: false,
        userName: '匿名用户'
    };
    componentWillMount() {
        const { receiveData } = this.props;
        const user = JSON.parse(localStorage.getItem('user'));
        user && receiveData(user, 'auth');


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
                <div className="ant-layout-wrapper" style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="ant-layout-container" style={{flex: 'auto'}}>
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
                    <Footer style={{ textAlign: 'center', flex: "0 0 auto" }}>
                        ©2017 赢时胜科技股份有限公司
                    </Footer>
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
