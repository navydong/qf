import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

class ServiceModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            acctype: '0',
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isUpdate,tabInfos } = this.props
        const { endOpen } = this.state
        const payWay = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3>基本信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商名称`}>
                            {getFieldDecorator(`facname`,{
                                rules: [{ required: true,message: '请输入服务商名称'}],
                                initialValue: tabInfos.facname
                            })(
                                <Input placeholder={`服务商名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商简称`}>
                            {getFieldDecorator(`facstname`,{
                              rules: [{ required: true,message: '请输入服务商简称'}],
                              initialValue: tabInfos.facstname
                            })(
                                <Input placeholder={`服务商简称`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={24}>
                        <FormItem {...payWay} label={`支付通道`}>
                            {getFieldDecorator(`passwayIds`,{
                              initialValue: tabInfos.passwayIds
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
            if( item === '74e1479029544232a218a3e60cb791fc' ){
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
                {getFieldDecorator(`appid`)(
                <Input placeholder={`请输入应用ID`}/>
                )}
            </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={`服务商商户号`}>
                {getFieldDecorator(`facno`)(
                <Input placeholder={`请输入服务商商户号`}/>
                )}
            </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={`KEY`}>
                        {getFieldDecorator(`key`)(
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
                    <h3>支付宝支付</h3>
                    <Row gutter={12}>
                    <Col span={12}>
                    <FormItem {...formItemLayout} label={`应用ID`}>
                {getFieldDecorator(`appidzfb`)(
                <Input placeholder={`请输入应用ID`}/>
                )}
            </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={`应用私钥`}>
                {getFieldDecorator(`privateKey`)(
                <Input placeholder={`请输入应用私钥`}/>
                )}
            </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={`应用公钥`}>
                {getFieldDecorator(`publicKey`)(
                <Input placeholder={`请输入应用公钥`}/>
                )}
            </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={`阿里公钥`}>
                {getFieldDecorator(`alipayPublickey`)(
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
<h3>结算账户信息</h3>
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
