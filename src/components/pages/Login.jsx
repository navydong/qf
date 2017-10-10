/**
 * Created by zhanpgeng on 2017/10/09.
 */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'
import { login, loginSuccess } from '@/redux/actions/auth'

const FormItem = Form.Item;
const ERROR_OK = 0;
const propTypes = {
    user: PropTypes.object,
    loggingIn: PropTypes.bool,
    loginErrors: PropTypes.string
}

class Login extends React.Component {
    constructor( props ){
        super(props)
        this.state = {
            loading: false
        }
    }

    componentWillMount(){
        const { router } = this.props;
        const uid = localStorage.getItem('uid')
        console.log(uid)
        if( uid && uid !== 'undefined' && uid !== null ){
            router.push('/app/dashboard/index')
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })
        const data = this.props.form.getFieldsValue();
        console.log(data)
        this.props.login(data.user,data.password).payload.promise.then( res => {
            this.setState( {
                loading: false
            } )
            let data = res.data;
            if( data.result.code === ERROR_OK ){
                console.log('登录成功')
                const { loginSuccess } = this.props;
                const user_accounts = data.result.user_accounts 
                console.log(user_accounts)
                loginSuccess(user_accounts)
                localStorage.setItem('uid',data.result.user_accounts.uid)
                message.success("Welcome" + data.result.user_accounts.name)
                this.props.router.push('/app/dashboard/index')
            }
            if( data.result.code !== ERROR_OK ){
                //message.error(res.payload.response.data.message)
            }

        } )
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>欢迎登录清分系统</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('user', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            <a href="">现在就去注册!</a>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

Login.propTypes = propTypes;
Login = Form.create()(Login)

const mapStateToPorps = state => {
    console.log(state)
    const { auth } = state; 
    if( auth.user ){
        return { user: auth.user,loggingIn: auth.loggingIn,loginErrors: '' }
    }
    return { auth };
   
};
const mapDispatchToProps = dispatch => ({
    login: bindActionCreators( login,dispatch ),
    loginSuccess: bindActionCreators(loginSuccess,dispatch)
});

export default connect( mapStateToPorps,mapDispatchToProps )(Login)