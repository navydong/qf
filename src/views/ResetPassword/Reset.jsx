import React from 'react'
import { Layout, Steps, Alert, Form, Input, Icon, Button } from 'antd'
import { Link, browserHistory } from 'react-router'
import './reset.less'
const { Header, Content, Footer } = Layout;
const Step = Steps.Step;
const FormItem = Form.Item;

class FormContent extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (values.newPassword === values.newSurePassword) {
                this.props.next()
            } else {
                this.props.form.setFields({
                    newSurePassword: {
                        value: values.newSurePassword,
                        errors: [new Error('两次密码不一致')],
                    }
                })
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="新密码">
                    {getFieldDecorator('newPassword', {
                        rules: [{
                            required: true, whitespace: true,
                            message: '请输入',
                        }],
                    })(
                        <Input type="password" maxLength="255" />
                        )}
                </FormItem>
                <FormItem label="确认新密码">
                    {getFieldDecorator('newSurePassword', {
                        rules: [{
                            required: true, whitespace: true,
                            message: '请输入',
                        }],
                    })(
                        <Input type="password" maxLength="255" />
                        )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

const steps = [{
    title: 'First',
    content: 'First-Content',
}, {
    title: 'Second',
    content: Form.create()(FormContent),
}, {
    title: 'Last',
    content: (props) => {
        const style = {
            fontSize: 20,
            fontWeight: 700,
            textAlign: 'center',
        }
        setTimeout(function () {
            window.location.hash = '#/app/home'
        }, 5000)
        return (
            <div style={style}>
                <div style={{ marginBottom: 20 }}>修改成功</div>
                {/* <Button type="primary" onClick={() => { window.location.hash = '#/app/home' }}>返回主页</Button> */}
                <Link to="/">返回主页</Link>
            </div>
        )
    },
}];


class Reset extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 2
        }
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    render() {
        const { current } = this.state;
        const FormContent = steps[this.state.current].content
        return (
            <div className="reset">
                <Header className="header">
                    <div className="header_content">
                        重置密码
                    </div>
                </Header>
                <Content className="content">
                    <div className="step">
                        <Steps current={current}>
                            <Step title="账户创建" description="已完成" />
                            <Step title="修改密码" description="正在进行" />
                            <Step title="修改完成" description="等待" />
                        </Steps>
                    </div>
                    <div className="content_warm">
                        <Alert
                            message="修改账户初始密码"
                            description="为了您的账户安全，请修改初始密码（000000）后进行登录"
                            type="warning"
                            showIcon
                        />
                    </div>
                    <div className="content_form">
                        <FormContent next={() => this.next()} />
                    </div>
                </Content>
                <Footer className="foot">
                    Copyright©2017-2018 赢时胜科技股份有限公司
                </Footer>
            </div>
        )
    }
}
export default Reset