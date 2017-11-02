import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
};

class SloveModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            acctype: 'organization',
            passways: []
        }
    }
    componentWillMount(){
        this.initPassway()
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    handleTypeChange = (value) => {
        console.log(value)
        this.setState({ acctype: value })
    }

    handlePaySelectChange = (value) => {
        console.log(value)
        const passways = value;
        this.setState({ passways })
    }

    createOptions = () => {
        const children = [];
        const {passway} = this.props;
        if(!passway) return;
        for( let i = 0; i < passway.length; i++ ){
            children.push(<Option key={i} value={passway[i].passwayName}>{passway[i].passwayName}</Option>)
        }
        return children;
    }
    initPassway(){
        const {tabInfos} = this.props
        let passways = [];
        if( tabInfos.hasOwnProperty('appidzfb') ){
            passways.push('支付宝')
            this.setState({passways})
        }

        if(tabInfos.hasOwnProperty('appid')){
            passways.push('微信')
            this.setState({passways})
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {tabInfos} = this.props
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3>基本信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`受理机构名称`}>
                            {getFieldDecorator(`orgname`,{
                                initialValue: tabInfos.orgname,
                                rules: [{ required: true}]
                            })(
                                <Input placeholder={`机构名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`受理机构简称`}>
                            {getFieldDecorator(`orgstname`,{
                                initialValue: tabInfos.orgstname
                            })(
                                <Input placeholder={`受理机构简称`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={`支付通道`}>
                            {getFieldDecorator(`passwayIds`,{
                                initialValue: this.state.passways
                            })(
                                <Select
                                    tags
                                    tokenSeparators={[',']}
                                    style={{ width: '100%' }}
                                    onChange={this.handlePaySelectChange}
                                >
                                    {this.createOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    this.state.passways.map(function(item,index){
                        if( item === '微信' ){
                            return (
                                <div key={index}>
                                    <h3>微信支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`FAPP_SECRET`}>
                                                {getFieldDecorator(`appSecret`,{
                                                    initialValue: tabInfos.appSecret
                                                })(
                                                    <Input placeholder={`请输入FAPP_SECRET`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={` 微信证书 `}>
                                                {getFieldDecorator(`book`)(
                                                    <Upload name="back" action="" listType="picture">
                                                        <Button>
                                                            <Icon type="upload" /> 点击上传
                                                        </Button>
                                                    </Upload>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`APPID`}>
                                                {getFieldDecorator(`appid`,{
                                                    initialValue: tabInfos.appid
                                                })(
                                                    <Input placeholder={`请输入应用ID`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`服务商商户号`}>
                                                {getFieldDecorator(`facno`,{
                                                    initialValue: tabInfos.facno
                                                })(
                                                    <Input placeholder={`请输入服务商商户号`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`KEY`}>
                                                {getFieldDecorator(`key`,{
                                                    initialValue: tabInfos.key
                                                })(
                                                    <Input placeholder={`请输入key`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`微信是否启用`}>
                                                {getFieldDecorator(`effectivez`,{
                                                    initialValue: tabInfos.effectivez == 0 ? "是" : "否"
                                                })(
                                                    <Select>
                                                        <Option value={'0'}>否</Option>
                                                        <Option value={'1'}>是</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }

                        if( item === '支付宝'){
                            return (
                                <div key={index}>
                                    <h3>支付宝支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`应用ID`}>
                                                {getFieldDecorator(`appidzfb`,{
                                                    initialValue: tabInfos.appidzfb
                                                })(
                                                    <textarea/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`应用私钥`}>
                                                {getFieldDecorator(`privateKey`,{
                                                    initialValue: tabInfos.privateKey
                                                })(
                                                    <textarea/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`应用公钥`}>
                                                {getFieldDecorator(`publicKey`,{
                                                    initialValue: tabInfos.publicKey
                                                })(
                                                    <textarea/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`阿里公钥`}>
                                                {getFieldDecorator(`alipayPublickey`,{
                                                    initialValue: tabInfos.alipayPublickey
                                                })(
                                                    <textarea/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`支付宝是否启用`}>
                                                {getFieldDecorator(`effectivez`,{
                                                    initialValue: tabInfos.effectivez == 0 ? "是" : "否"
                                                })(
                                                    <Select>
                                                        <Option value={'0'}>否</Option>
                                                        <Option value={'1'}>是</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                    })
                }

                <h3>结算账户信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`账户类型`}>
                            {getFieldDecorator(`acctype`)(
                                <Select onChange={this.handleTypeChange}>
                                    <Option value="organization">机构</Option>
                                    <Option value="personal">个人</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户银行`}>
                            {getFieldDecorator(`deposite`)(
                                <Select>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`银行卡号`}>
                            {getFieldDecorator(`bankno`,{
                                initialValue: tabInfos.bankno
                            })(
                                <Input placeholder={`银行卡号`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行名称`}>
                            {getFieldDecorator(`branchNmae`,{
                                initialValue: tabInfos.branchNmae
                            })(
                                <Input placeholder={`开户支行名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行地区`}>
                            {getFieldDecorator(`branchRegion`,{
                                initialValue: tabInfos.branchRegion
                            })(
                                <Input placeholder={`开户支行地区`} />
                            )}
                        </FormItem>
                    </Col>
                    { this.state.acctype === 'organization' ? (
                        <Col span={12}>
                        <FormItem {...formItemLayout} label={`企业名称`}>
                            {getFieldDecorator(`company`,{
                                initialValue: tabInfos.company
                            })(
                                <Input placeholder={`企业名称`} />
                            )}
                        </FormItem>
                    </Col>)
                        : ''
                    }
                </Row>
                { this.state.acctype === 'personal' ? (
                        <div>
                            <h3>个人银行账户信息</h3>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`开户人`}>
                                        {getFieldDecorator(`acctholder`,{
                                            initialValue: tabInfos.acctholder
                                        })(
                                            <Input placeholder={`开户人`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件类型`}>
                                        {getFieldDecorator(`identitp`,{
                                            initialValue: tabInfos.identitp
                                        })(
                                            <Input placeholder={`持卡人证件类型`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件号码`}>
                                        {getFieldDecorator(`identino`,{
                                            initialValue: tabInfos.identino
                                        })(
                                            <Input placeholder={`持卡人证件号码`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人地址`}>
                                        {getFieldDecorator(`holderaddress`,{
                                            initialValue: tabInfos.holderaddress
                                        })(
                                            <Input placeholder={`持卡人地址`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人手机号`}>
                                        {getFieldDecorator(`holderphone`,{
                                            initialValue: tabInfos.holderphone
                                        })(
                                            <Input placeholder={`持卡人手机号`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`证件有效期起`}>
                                        {getFieldDecorator(`idendtstart`)(
                                            <DatePicker />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`证件有效期止`}>
                                        {getFieldDecorator(`idendtend`)(
                                            <DatePicker />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`身份证正面照片`}>
                                        {getFieldDecorator(`front`)(
                                            <Upload name="front" action="" listType="picture">
                                                <Button>
                                                    <Icon type="upload" /> 点击上传
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`身份证反面照片`}>
                                        {getFieldDecorator(`back`)(
                                            <Upload name="back" action="" listType="picture">
                                                <Button>
                                                    <Icon type="upload" /> 点击上传
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                )
                    :'' }
            </Form>
        )
    }
}

SloveModal = Form.create()(SloveModal);
export default SloveModal