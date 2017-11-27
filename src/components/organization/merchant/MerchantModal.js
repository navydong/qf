import React from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon,Cascader } from 'antd'
import { AreaData } from '../../AreaSelector/areaData'
import axios from 'axios'
const FormItem = Form.Item;

const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
};
class MerchantModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            acctype: '0',
            passways: [],
            industrys: [],
            merchant: [],
            endOpen: false
        }
    }

    componentWillMount(){
        this.selectCatory()
        this.selectMerchant()
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

    getBank = () => {
        const bankList = [
            "中国工商银行","中国农业银行","中国银行","中国建设银行","中国光大银行",
            "中国民生银行","华夏银行","中信银行","恒丰银行","上海浦东发展银行","交通银行",
            "浙商银行","兴业银行","深圳发展银行","招商银行","广东发展银行"
        ]

        return bankList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
            }
        )
    }

    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=1&offset=100`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }

    createOptions = () => {
        const children = [];
        const {passway} = this.props;
        if(!passway) return;
        for( let i = 0; i < passway.length; i++ ){
            children.push(<Option key={i} value={passway[i].id}>{passway[i].passwayName}</Option>)
        }
        return children;
    }

    selectCatory(){
        axios.get(`/back/industry/industrys?limit=100&offset=1`).then((resp) => {
            const industrys = resp.data.rows;
            console.log(industrys)
            this.setState({
                industrys
            })
        })
    }

    /********开始、结束日期关联***********/
       disabledStartDate = (startValue) => {
           const endValue = this.state.endValue;
           if (!startValue || !endValue) {
               return false;
           }
           return startValue.valueOf() > endValue.valueOf();
       }

       disabledEndDate = (endValue) => {
           const startValue = this.state.startValue;
           if (!endValue || !startValue) {
               return false;
           }
           return endValue.valueOf() <= startValue.valueOf();
       }

       onChange = (field, value) => {
           this.setState({
               [field]: value,
           });
       }

       onStartChange = (value) => {
           this.onChange('startValue', value);
       }

       onEndChange = (value) => {
           this.onChange('endValue', value);
       }

       handleStartOpenChange = (open) => {
           if (!open) {
               this.setState({ endOpen: true });
           }
       }

       handleEndOpenChange = (open) => {
           this.setState({ endOpen: open });
       }
       /********开始、结束日期关联*********/

    render(){
        const { getFieldDecorator } = this.props.form;
        const { industrys,merchant,endOpen } = this.state;
        const industrysOpts = industrys.map((item,index) => (
            <Option key={index} value={item.id}>{item.industryName}</Option>
        ))
        const merchantOpts = merchant.map((item,index) => (
            <Option key={index} value={item.id}>{item.merchantName}</Option>
        ))
        const { isUpdate,tabInfos } = this.props
        return (
            <Form className="ant-advanced-search-form" onSubmit={ this.handleSubmit }>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`,{
                                rules: [{ required: true,message: '请输入商户名称'}],
                                initialValue: tabInfos.merchantName
                            })(
                                <Input placeholder={`商户名称`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`上级商户`}>
                            {getFieldDecorator(`merchantId`,{
                              initialValue: tabInfos.merchantId
                            })(
                                <Select>
                                    {merchantOpts}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户简称`}>
                            {getFieldDecorator(`merCode`,{
                                rules: [{ required: true,message: '请输入商户简称'}],
                                initialValue: tabInfos.merCode
                            })(
                                <Input placeholder={`商户简称`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`passwayIds`,{
                              initialValue: tabInfos.passwayIds
                            })(
                                <Select
                                    multiple
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
                  <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户详细地址`}>
                            {getFieldDecorator(`address`,{
                              initialValue: tabInfos.address
                            })(
                                <Input placeholder={`商户详细地址`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户所在地区`}>
                            {getFieldDecorator(`region`,{
                                initialValue: ["北京市","北京市","东城区"]
                            })(
                                <Cascader options={AreaData} />
                            )}
                        </FormItem>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`业务员`}>
                            {getFieldDecorator(`salesman`,{
                              initialValue: tabInfos.salesman
                            })(
                                <Input placeholder={`业务员`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`linkman`,{
                                rules: [{ required: true,message: '请输入联系人姓名'}],
                                initialValue: tabInfos.linkman
                            })(
                                <Input placeholder={`联系人姓名`} />
                            )}
                        </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人手机`}>
                            {getFieldDecorator(`lkmphone`,{
                                rules: [{ required: true,message: '请输入联系人手机'}],
                                initialValue: tabInfos.lkmphone
                            })(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人邮箱`}>
                            {getFieldDecorator(`lkmemail`,{
                              initialValue: tabInfos.lkmemail
                            })(
                                <Input placeholder={`联系人邮箱`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    this.state.passways.map(function(item,index){
                        if( item === '74e1479029544232a218a3e60cb791fc' ){
                            return (
                                <div key={index}>
                                    <h3>微信支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`)(
                                                    <Input placeholder={`请输入商户外部ID`}/>
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户号`}>
                                                {getFieldDecorator(`appid`)(
                                                    <Input placeholder={`请输入商户号`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`微信所属行业`}>
                                                {getFieldDecorator(`wxindustryId`)(
                                                    <Select>
                                                        {industrysOpts}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                        if( item === '0c811cd8f6a3453da7eca6e446a54528'){
                            return (
                                <div key={index}>
                                    <h3>支付宝支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`)(
                                                    <Input placeholder={`请输入商户外部ID`}/>
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`第三方授权令牌`}>
                                                {getFieldDecorator(`token`)(
                                                    <textarea/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`行业类目明细`}>
                                                {getFieldDecorator(`zfbindustryId`)(
                                                    <Select>
                                                        {industrysOpts}
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

                <Row>
                    <h3>进件基本信息</h3>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`营业执照图片`}>
                            {getFieldDecorator(`buslicence`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`组织代码图片`}>
                            {getFieldDecorator(`orgcode`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`法人持证件照`}>
                            {getFieldDecorator(`lawholder`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`身份证正面照片`}>
                            {getFieldDecorator(`frontid`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`身份证反面照片`}>
                            {getFieldDecorator(`backid`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质一图片`}>
                            {getFieldDecorator(`spequalifione`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质二图片`}>
                            {getFieldDecorator(`spequalifitwo`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质三图片`}>
                            {getFieldDecorator(`spequalifithree`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质四图片`}>
                            {getFieldDecorator(`spequalififour`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质五图片`}>
                            {getFieldDecorator(`spequalififive`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                { isUpdate === true ? "" : (
                  <div>
                    <h3>用户信息</h3>
                    <Row gutter={12}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`用户名`}>
                                {getFieldDecorator(`userName`,{
                                    rules: [{ required: true,message: '请输入用户名'}]
                                })(
                                    <Input placeholder={`用户名`} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`密码`}>
                                {getFieldDecorator(`passWord`,{
                                      rules: [{ required: true,message: '请输入密码'}]
                                })(
                                    <Input placeholder={`密码`} type="passWord" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                  </div>
                )}
                <Row gutter={12}>
                    <h3>结算账户信息</h3>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`账户类型`}>
                            {getFieldDecorator(`acctype`,{
                              initialValue: tabInfos.acctype
                            })(
                                <Select onChange={this.handleTypeChange}>
                                    <Option value="0">机构</Option>
                                    <Option value="1">个人</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户银行`}>
                            {getFieldDecorator(`deposite`,{
                              initialValue: tabInfos.deposite
                            })(
                                <Select>{this.getBank()}</Select>
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
                    { this.state.acctype === '0' ? (
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
                { this.state.acctype === '1' ? (
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
                                          <DatePicker disabledDate={this.disabledStartDate}
                                              placeholder="开始时间"
                                              onChange={this.onStartChange}
                                              onOpenChange={this.handleStartOpenChange}
                                          />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`证件有效期止`}>
                                        {getFieldDecorator(`idendtend`)(
                                          <DatePicker disabledDate={this.disabledEndDate}
                                              placeholder="结束时间"
                                              onChange={this.onEndChange}
                                              open={endOpen}
                                              onOpenChange={this.handleEndOpenChange}
                                          />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`身份证正面照片`}>
                                        {getFieldDecorator(`front`)(
                                            <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
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
                                            <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
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



MerchantModal = Form.create()(MerchantModal)
export default MerchantModal
