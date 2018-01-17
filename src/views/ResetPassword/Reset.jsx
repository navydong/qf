import React from 'react'
import { Layout, Steps, Alert, Form, Input, Icon, Button } from 'antd'
import './reset.less'
const { Header, Content, Footer } = Layout;
const Step = Steps.Step;
const FormItem = Form.Item;
export default class Reset extends React.Component {
    render() {
        return (
            <div className="reset">
                <Header className="header">
                    <div className="header_content">
                        重置密码
                    </div>
                </Header>
                <Content className="content">
                    <div className="step">
                        <Steps current={1}>
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
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                            // validateStatus={userNameError ? 'error' : ''}
                            // help={userNameError || ''}
                            >
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                            </FormItem>
                            <FormItem>
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="Password" />
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                // disabled={hasErrors(getFieldsError())}
                                >
                                    修改
                            </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Content>
                <Footer>footer</Footer>
            </div >
        )
    }
}