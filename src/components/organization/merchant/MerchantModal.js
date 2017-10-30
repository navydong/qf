import React from 'react'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon,Cascader } from 'antd'
import { AreaData } from '../../AreaSelector/areaData'
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
            acctype: 'organization',
            passway: []
        }
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
        const passway = value;
        this.setState({ passway })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {passway} = this.props
        const pasOptions = passway.map((item,index) => (
            <Option key={index} value={item.id}>{item.passwayName}</Option>
        ))
        return (
            <Form className="ant-advanced-search-form" onSubmit={ this.handleSubmit }>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户名称`}>
                            {getFieldDecorator(`merchantName`)(
                                <Input placeholder={`商户简称`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`可用通道`}>
                            {getFieldDecorator(`passway_ids`)(
                                <Select>
                                    {pasOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`商户详细地址`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`联系人手机`} />
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

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`业务员`}>
                            {getFieldDecorator(`contactPhone`)(
                                <Input placeholder={`业务员`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人姓名`}>
                            {getFieldDecorator(`linkman`)(
                                <Input placeholder={`联系人姓名`} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人手机`}>
                            {getFieldDecorator(`lkmphone`)(
                                <Input placeholder={`联系人手机`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`联系人邮箱`}>
                            {getFieldDecorator(`lkmemail`)(
                                <Input placeholder={`联系人邮箱`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <h3>进件基本信息</h3>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`营业执照图片`}>
                            {getFieldDecorator(`buslicence`)(
                                <Upload name="buslicence" action="" listType="picture">
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
                                <Upload name="orgcode" action="" listType="picture">
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
                                <Upload name="lawholder" action="" listType="picture">
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
                                <Upload name="frontid" action="" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`身份证正面照片`}>
                            {getFieldDecorator(`backid`)(
                                <Upload name="backid" action="" listType="picture">
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
                                <Upload name="backid" action="" listType="picture">
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
                                <Upload name="spequalifitwo" action="" listType="picture">
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
                                <Upload name="spequalifithree" action="" listType="picture">
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
                                <Upload name="spequalififour" action="" listType="picture">
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
                                <Upload name="spequalififive" action="" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <h3>结算账户信息</h3>
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
                            {getFieldDecorator(`bankno`)(
                                <Input placeholder={`银行卡号`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行名称`}>
                            {getFieldDecorator(`branchNmae`)(
                                <Input placeholder={`开户支行名称`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行地区`}>
                            {getFieldDecorator(`branchRegion`)(
                                <Input placeholder={`开户支行地区`} />
                            )}
                        </FormItem>
                    </Col>
                    { this.state.acctype === 'organization' ? (
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`企业名称`}>
                                    {getFieldDecorator(`company`)(
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
                                        {getFieldDecorator(`acctholder`)(
                                            <Input placeholder={`开户人`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件类型`}>
                                        {getFieldDecorator(`identitp`)(
                                            <Input placeholder={`持卡人证件类型`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人证件号码`}>
                                        {getFieldDecorator(`identino`)(
                                            <Input placeholder={`持卡人证件号码`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人地址`}>
                                        {getFieldDecorator(`holderaddress`)(
                                            <Input placeholder={`持卡人地址`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label={`持卡人手机号`}>
                                        {getFieldDecorator(`holderphone`)(
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



MerchantModal = Form.create()(MerchantModal)
export default MerchantModal