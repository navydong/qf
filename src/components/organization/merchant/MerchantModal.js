import React from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon,Cascader } from 'antd'
import { AreaData } from '../../AreaSelector/areaData'
import axios from 'axios'
const FormItem = Form.Item;

const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}

class MerchantModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            acctype: '0',
            initPassway: props.initPassway,
            passways: [],
            industrys: [],
            merchant: [],
            endOpen: false
        }
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        initPassway: nextProps.initPassway
      })
    }

    componentWillMount(){
        this.selectCatory()
        this.selectMerchant()
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            this.props.onSubmit(err, values);
        });
    }

    handleTypeChange = (value) => {
        console.log(value)
        this.setState({ acctype: value })
    }

    handlePaySelectChange = (value) => {
        console.log(value)
        this.setState({ passways: value })
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

    getLicence = () => {
        const licenceList = [
          { type: '身份证', number: '0' },
          { type: '护照', number: '1' },
          { type: '军官证', number: '2' },
          { type: '士兵证', number: '3' },
          { type: '港澳台居民来往通行证', number: '4' },
          { type: '警官证', number: '5' },
          { type: '其它', number: '6' }
        ]

        return licenceList.map((item,index) => {
                return <Option key={index} value={item.number}>{item.type}</Option>
            }
        )
    }



    selectMerchant(){
        axios.get(`/back/merchantinfoController/page?limit=100&offset=1`).then((resp) => {
            const merchant = resp.data.rows;
            this.setState({
                merchant
            })
        })
    }
    checkRate = (rule,value,callback) => {
        let reg = /^[0-9]|([0-9]{1,}[.][0-9]*)$/;
        if(!reg.test(value)){
            callback('请输入数字')
        }else{
            callback()
        }
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
            const industrys = resp.data;
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
       onFocus(e){
         console.log(e.target)
         e.target.type = 'password'
       }

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
        const passwayIds = tabInfos.passwayIds && typeof(tabInfos.passwayIds) === 'string' ? tabInfos.passwayIds.split(','): []
        console.log(this.state.passways)
        return (
            <Form  onSubmit={ this.handleSubmit }>
                <h3 className="modal-title">商户基本信息</h3>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`,{
                                rules: [{ required: true, whitespace: true,message: '请输入商户名称'}],
                                initialValue: tabInfos.merchantName
                            })(
                                <Input placeholder={`商户名称`} maxLength="255" />
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
                            {getFieldDecorator(`merchantStname`,{
                                rules: [{ required: true, whitespace: true,message: '请输入商户简称'}],
                                initialValue: tabInfos.merchantStname
                            })(
                                <Input placeholder={`商户简称`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`passwayIds`,{
                              initialValue: passwayIds
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
                                <Input placeholder={`商户详细地址`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户所在地区`}>
                            {getFieldDecorator(`region`,{
                              rules: [{ required: false, message: '请输入' }]
                            })(
                                <Cascader placeholder={"==请选择=="} options={AreaData} />
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
                                <Input placeholder={`业务员`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`linkman`,{
                                rules: [{ required: true, whitespace: true,message: '请输入联系人姓名'}],
                                initialValue: tabInfos.linkman
                            })(
                                <Input placeholder={`联系人姓名`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人手机`} hasFeedback>
                            {getFieldDecorator(`lkmphone`,{
                                rules: [
                                    { required: true, whitespace: true,message: '请输入联系人手机'},
                                    { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message:'请输入正确手机号码'}
                                ],
                                validateFirst: true,
                                initialValue: tabInfos.lkmphone
                            })(
                                <Input placeholder={`联系人手机`} maxLength="11" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人邮箱`}>
                            {getFieldDecorator(`lkmemail`,{
                              initialValue: tabInfos.lkmemail,
                              rules: [{type: 'email', message: ' 请输入正确邮箱'}]
                            })(
                                <Input placeholder={`联系人邮箱`} maxLength="50" type="email" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    this.state.passways.length === 0 ?
                    this.state.initPassway.map(function(item,index){
                        if( item === '74e1479029544232a218a3e60cb791fc' ){
                            return (
                                <div key={index}>
                                    <h3 className="modal-title">微信支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`,{
                                                  initialValue: tabInfos.fkid
                                                })(
                                                    <Input placeholder={`请输入商户外部ID`}/>
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户号`}>
                                                {getFieldDecorator(`appid`,{
                                                  initialValue: tabInfos.appid
                                                })(
                                                    <Input placeholder={`请输入商户号`}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`微信所属行业`}>
                                                {getFieldDecorator(`wxindustryId`,{
                                                  initialValue: tabInfos.wxindustryId
                                                })(
                                                    <Select>
                                                        {industrysOpts}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ position: "relative" }}>
                                            <FormItem {...formItemLayout} label={`微信结算费率`} hasFeedback>
                                                {getFieldDecorator(`wxsettlerate`,{
                                                    initialValue: tabInfos.wxsettlerate,
                                                    rules: [
                                                        { required: true ,message: '费率不能为空'}
                                                    ]
                                                })(
                                                    <Input placeholder={`请输入费率`} />
                                                )}
                                            </FormItem>
                                            <span style={{position: "absolute",top: "6px",right: '28px'}}>%</span>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                        if( item === '0c811cd8f6a3453da7eca6e446a54528'){
                            return (
                                <div key={index}>
                                    <h3 className="modal-title">支付宝支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`,{
                                                  initialValue: tabInfos.fkid
                                                })(
                                                    <Input placeholder={`请输入商户外部ID`}/>
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`第三方授权令牌`}>
                                                {getFieldDecorator(`token`,{
                                                  initialValue: tabInfos.token
                                                })(
                                                    <Input type="textarea"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`行业类目明细`}>
                                                {getFieldDecorator(`zfbindustryId`,{
                                                  initialValue: tabInfos.zfbindustryId
                                                })(
                                                    <Select>
                                                        {industrysOpts}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ position: "relative" }}>
                                            <FormItem {...formItemLayout} label={`支付宝结算费率`} hasFeedback>
                                                {getFieldDecorator(`zfbsettlerate`,{
                                                    initialValue: tabInfos.zfbsettlerate,
                                                    rules: [
                                                        { required: true ,message: '费率不能为空'}
                                                    ]
                                                })(
                                                    <Input placeholder={`请输入支付宝结算费率`} />
                                                )}
                                            </FormItem>
                                            <span style={{position: "absolute",top: "6px",right: '28px'}}>%</span>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                    })
                    :
                    this.state.passways.map(function(item,index){
                        if( item === '74e1479029544232a218a3e60cb791fc' ){
                            return (
                                <div key={index}>
                                    <h3 className="modal-title">微信支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`,{
                                                  initialValue: tabInfos.fkid
                                                })(
                                                    <Input placeholder={`请输入商户外部ID`} maxLength="255" />
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户号`}>
                                                {getFieldDecorator(`appid`,{
                                                  initialValue: tabInfos.appid
                                                })(
                                                    <Input placeholder={`请输入商户号`} maxLength="255" />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`微信所属行业`}>
                                                {getFieldDecorator(`wxindustryId`,{
                                                  initialValue: tabInfos.wxindustryId
                                                })(
                                                    <Select>
                                                        {industrysOpts}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ position: "relative" }}>
                                            <FormItem {...formItemLayout} label={`微信结算费率`} hasFeedback>
                                                {getFieldDecorator(`wxsettlerate`,{
                                                    initialValue: tabInfos.wxsettlerate,
                                                    rules: [
                                                        { required: true, whitespace: true ,message: '费率不能为空'}
                                                    ]
                                                })(
                                                    <Input placeholder={`请输入费率`} maxLength="255" />
                                                )}
                                            </FormItem>
                                            <span style={{position: "absolute",top: "6px",right: '28px'}}>%</span>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                        if( item === '0c811cd8f6a3453da7eca6e446a54528'){
                            return (
                                <div key={index}>
                                    <h3 className="modal-title">支付宝支付</h3>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`商户外部ID`}>
                                                {getFieldDecorator(`fkid`,{
                                                  initialValue: tabInfos.fkid
                                                })(
                                                    <Input placeholder={`请输入商户外部ID`} maxLength="255" />
                                                )}
                                            </FormItem>
                                        </Col>

                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`第三方授权令牌`}>
                                                {getFieldDecorator(`token`,{
                                                  initialValue: tabInfos.token
                                                })(
                                                    <Input type="textarea" />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} label={`行业类目明细`}>
                                                {getFieldDecorator(`zfbindustryId`,{
                                                  initialValue: tabInfos.zfbindustryId
                                                })(
                                                    <Select>
                                                        {industrysOpts}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ position: "relative" }}>
                                            <FormItem {...formItemLayout} label={`支付宝结算费率`} hasFeedback>
                                                {getFieldDecorator(`zfbsettlerate`,{
                                                    initialValue: tabInfos.zfbsettlerate,
                                                    rules: [
                                                        { required: true, whitespace: true ,message: '费率不能为空'}
                                                    ]
                                                })(
                                                    <Input placeholder={`请输入支付宝结算费率`} maxLength="255" />
                                                )}
                                            </FormItem>
                                            <span style={{position: "absolute",top: "6px",right: '28px'}}>%</span>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                    })
                }

                <h3 className="modal-title">进件基本信息</h3>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`营业执照`}>
                            {getFieldDecorator(`buslicence`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`组织代码`}>
                            {getFieldDecorator(`orgcode`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`法人持证件照`}>
                            {getFieldDecorator(`lawholder`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`身份证正面`}>
                            {getFieldDecorator(`frontid`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`身份证反面`}>
                            {getFieldDecorator(`backid`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质一`}>
                            {getFieldDecorator(`spequalifione`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质二`}>
                            {getFieldDecorator(`spequalifitwo`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质三`}>
                            {getFieldDecorator(`spequalifithree`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质四`}>
                            {getFieldDecorator(`spequalififour`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`特殊资质五`}>
                            {getFieldDecorator(`spequalififive`)(
                                <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                    <Button style={{marginLeft: 35,width: 200}}>
                                        <Icon type="upload" /> 上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                { isUpdate === true ? "" : (
                  <div>
                    <h3 className="modal-title">用户信息</h3>
                    <Row gutter={12}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`用户名`}>
                                {getFieldDecorator(`userName`,{
                                    rules: [
                                        { required: true, message: '请输入用户名'},
                                        {pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '非法字符'},
                                    ],
                                    validateFirst: true,
                                })(
                                    <Input placeholder={`用户名`} autoComplete="off" maxLength="16" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`密码`}>
                                {getFieldDecorator(`passWord`,{
                                      rules: [{ required: true, whitespace: true,message: '请输入密码'}]
                                })(
                                    <Input placeholder={`密码`} type="text" autoComplete="off" onFocus={ e => this.onFocus(e) } maxLength="255" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                  </div>
                )}

                <h3 className="modal-title">结算账户信息</h3>
                <Row gutter={12}>
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
                        <FormItem {...formItemLayout} label={`银行卡号`} hasFeedback>
                            {getFieldDecorator(`bankno`,{
                              initialValue: tabInfos.bankno,
                              rules: [{pattern: /^([1-9]{1})(\d{14}|\d{18})$/, message: '请输入正确的银行卡号'}]
                            })(
                                <Input placeholder={`银行卡号`} maxLength="19" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行名称`}>
                            {getFieldDecorator(`branchNmae`,{
                              initialValue: tabInfos.branchNmae,
                              rules: [{pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确名称'}]
                            })(
                                <Input placeholder={`开户支行名称`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行地区`}>
                            {getFieldDecorator(`branchRegion`,{
                              initialValue: tabInfos.branchRegion,
                              rules: [{pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确名称'}]
                            })(
                                <Input placeholder={`开户支行地区`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    { this.state.acctype === '0' ? (
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`企业名称`}>
                                    {getFieldDecorator(`company`,{
                                      initialValue: tabInfos.company
                                    })(
                                        <Input placeholder={`企业名称`} maxLength="255" />
                                    )}
                                </FormItem>
                            </Col>)
                        : ''
                    }
                </Row>
                { this.state.acctype === '1' ? (
                        <div>
                            <h3 className="modal-title">个人银行账户信息</h3>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`开户人`}>
                                        {getFieldDecorator(`acctholder`,{
                                          initialValue: tabInfos.acctholder,
                                          rules: [{
                                            pattern: /[\u4e00-\u9fa5]/gm, message: '非法字符'
                                          }]
                                        })(
                                            <Input placeholder={`开户人`} maxLength="10" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件类型`}>
                                        {getFieldDecorator(`identitp`,{
                                          initialValue: tabInfos.identitp
                                        })(
                                          <Select placeholder={'===========请选择============'}>
                                              { this.getLicence() }
                                          </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件号码`}>
                                        {getFieldDecorator(`identino`,{
                                          initialValue: tabInfos.identino,
                                          rules: [{pattern: /^[0-9a-zA-Z]{0,30}$/, message: '请输入正确证件号码'}]
                                        })(
                                            <Input placeholder={`持卡人证件号码`} maxLength="30" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人地址`}>
                                        {getFieldDecorator(`holderaddress`,{
                                          initialValue: tabInfos.holderaddress
                                        })(
                                            <Input placeholder={`持卡人地址`} maxLength="255" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人手机号`}>
                                        {getFieldDecorator(`holderphone`,{
                                          initialValue: tabInfos.holderphone,
                                          rules: [{pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/}]
                                        })(
                                            <Input placeholder={`持卡人手机号`} maxLength="11" />
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
