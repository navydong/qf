import React, { Component } from 'react';
import { Layout,Menu } from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
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
        window.onresize = () => {
            console.log('屏幕变化了');
            this.getClientWidth();
        }
    }
    getClientWidth = () => {    // 获取当前浏览器宽度并设置responsive管理响应式
        const { receiveData } = this.props;
        const clientWidth = document.body.clientWidth;
        console.log(clientWidth);
        receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        console.log(this.props.auth);
        console.log(this.props.responsive);
        const { auth, router, responsive } = this.props;

        return (
            <div className="ant-layout-topaside">
            <div className="ant-layout-header">
              <div className="ant-layout-wrapper">
                <div className="ant-layout-logo"></div>
                <Menu theme="dark" mode="horizontal"
                  defaultSelectedKeys={['2']} style={{lineHeight: '64px'}}>
                  <Menu.Item key="1">导航一</Menu.Item>
                  <Menu.Item key="2">导航二</Menu.Item>
                  <Menu.Item key="3">导航三</Menu.Item>
                </Menu>
              </div>
            </div>
            <div className="ant-layout-wrapper">
              <div className="ant-layout-container">
              <SiderCustom path={this.props.location.pathname}/>
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
              <div className="ant-layout-footer">
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
