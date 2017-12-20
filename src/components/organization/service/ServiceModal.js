import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon } from 'antd'
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

class ServiceModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            acctype: '0',
            initPassway: props.initPassway,
            passways: [],
            endOpen: false
        }
    }

   handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        console.log(values);
        this.props.onSubmit(err, values);
      });
}

handleTypeChange = (value) => {
    this.setState({ acctype: value })
}

handlePaySelectChange (v) {
    console.log(v)
    this.setState({
      passways: v,
      v
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
         e.target.type = 'password'
       }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isUpdate,tabInfos } = this.props
        const { endOpen } = this.state
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3 className="modal-title">基本信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商名称`}>
                            {getFieldDecorator(`facname`,{
                                rules: [{ required: true, whitespace: true,message: '请输入服务商名称'}],
                                initialValue: tabInfos.facname
                            })(
                                <Input placeholder={`服务商名称`} maxLength="255"  />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商简称`}>
                            {getFieldDecorator(`facstname`,{
                              rules: [{ required: true, whitespace: true,message: '请输入服务商简称'}],
                              initialValue: tabInfos.facstname
                            })(
                                <Input placeholder={`服务商简称`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`支付通道`}>
                            {getFieldDecorator(`passwayIds`,{
                              initialValue: this.state.initPassway
                            })(
                            <Select
                                tags
                                tokenSeparators={[',']}
                                style={{ width: '100%' }}
                                onChange={ v => this.handlePaySelectChange(v) }
                            >
                                {this.createOptions()}
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {console.log(this.state.v)}
    {
        this.state.passways.length === 0 ?
        this.state.initPassway.map(function(item,index){
            if( item === '74e1479029544232a218a3e60cb791fc' ){
                return (
                  <div key={index}>
                    <h3 className="modal-title">微信支付</h3>
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
                                {getFieldDecorator(`cert`,{
                                    initialValue: tabInfos.cert
                                })(
                                    <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                        <Button>
                                                <Icon type="upload" /> 点击上传
                                        </Button>
                                    </Upload>)}
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
                                {getFieldDecorator(`effective`)(
                                  <Select>
                                      <Option value={'0'}>是</Option>
                                      <Option value={'1'}>否</Option>
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
                        <h3 className="modal-title">支付宝支付</h3>
                        <Row gutter={12}>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用ID`}>
                                    {getFieldDecorator(`appidzfb`,{
                                      initialValue: tabInfos.appidzfb
                                    })(
                                         <Input placeholder={`请输入应用ID`}/>
                                    )}
                               </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用私钥`}>
                                    {getFieldDecorator(`privateKey`,{
                                      initialValue: tabInfos.privateKey
                                    })(
                                        <Input placeholder={`请输入应用私钥`}/>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                  <FormItem {...formItemLayout} label={`应用公钥`}>
                                      {getFieldDecorator(`publicKey`,{
                                        initialValue: tabInfos.publicKey
                                      })(
                                          <Input placeholder={`请输入应用公钥`}/>
                                      )}
                                 </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`阿里公钥`}>
                                    {getFieldDecorator(`alipayPublickey`,{
                                      initialValue: tabInfos.alipayPublickey
                                    })(
                                         <Input placeholder={`请输入阿里公钥`}/>
                                    )}
                               </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`支付宝是否启用`}>
                                    {getFieldDecorator(`effectivez`)(
                                        <Select>
                                            <Option value={'0'}>是</Option>
                                            <Option value={'1'}>否</Option>
                                        </Select>
                                    )}
                                </FormItem>
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
                                {getFieldDecorator(`cert`,{
                                    initialValue: tabInfos.cert
                                })(
                                    <Upload name="book" action="/back/accepagent/fileUpload" listType="picture">
                                        <Button>
                                                <Icon type="upload" /> 点击上传
                                        </Button>
                                    </Upload>)}
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
                                {getFieldDecorator(`effective`)(
                                  <Select>
                                      <Option value={'0'}>是</Option>
                                      <Option value={'1'}>否</Option>
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
                        <h3 className="modal-title">支付宝支付</h3>
                        <Row gutter={12}>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用ID`}>
                                    {getFieldDecorator(`appidzfb`,{
                                      initialValue: tabInfos.appidzfb
                                    })(
                                         <Input placeholder={`请输入应用ID`}/>
                                    )}
                               </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用私钥`}>
                                    {getFieldDecorator(`privateKey`,{
                                      initialValue: tabInfos.privateKey
                                    })(
                                        <Input placeholder={`请输入应用私钥`}/>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                  <FormItem {...formItemLayout} label={`应用公钥`}>
                                      {getFieldDecorator(`publicKey`,{
                                        initialValue: tabInfos.publicKey
                                      })(
                                          <Input placeholder={`请输入应用公钥`}/>
                                      )}
                                 </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`阿里公钥`}>
                                    {getFieldDecorator(`alipayPublickey`,{
                                      initialValue: tabInfos.alipayPublickey
                                    })(
                                         <Input placeholder={`请输入阿里公钥`}/>
                                    )}
                               </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`支付宝是否启用`}>
                                    {getFieldDecorator(`effectivez`)(
                                        <Select>
                                            <Option value={'0'}>是</Option>
                                            <Option value={'1'}>否</Option>
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
{ isUpdate === true ? '' :(
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
                    <Input placeholder={`密码`} type="passWord" autoComplete="new-password" maxLength="255" />
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
            {getFieldDecorator(`acctype`)(
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
              <Select>
                  {this.getBank()}
              </Select>
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
            rules: [{pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确的开户支行名称'}]
          })(
              <Input placeholder={`开户支行名称`} maxLength="255" />
          )}
      </FormItem>
    </Col>
    <Col span={12}>
        <FormItem {...formItemLayout} label={`开户支行地区`}>
          {getFieldDecorator(`branchRegion`,{
            initialValue: tabInfos.branchRegion,
            rules: [{pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确的开户支行地区'}]
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
                     <Input placeholder={`持卡人证件类型`} maxLength="255" />
                )}
               </FormItem>
            </Col>
            <Col span={12}>
                <FormItem {...formItemLayout} label={`持卡人证件号码`}>
                    {getFieldDecorator(`identino`,{
                        initialValue: tabInfos.identino,
                        rules: [{pattern: /^[a-zA-Z0-9]{0,30}$/, message: '请输入正确证件号码'}]
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
                      rules: [{pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确手机号'}]
                    })(
                        <Input placeholder={`持卡人手机号`} maxLength="11" />
                    )}
               </FormItem>
            </Col>
            <Col span={12}>
                <FormItem {...formItemLayout} label={`证件有效期起`}>
                {getFieldDecorator(`idendtstart`,{
                  initialValue: tabInfos.idendtstart
                })(
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
                    {getFieldDecorator(`idendtend`,{
                      initialValue: tabInfos.idendtend
                    })(
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

ServiceModal = Form.create()(ServiceModal);
export default ServiceModal
