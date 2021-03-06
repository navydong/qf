import React, { Component } from 'react'
import moment from 'moment'
import { Form, Row, Col, Input, Select, Upload, DatePicker, Button, Icon } from 'antd'
import { WeiXinId, ZhiFuBaoId } from '../wxAndzfb'
import { bankList, licenceList, formItemLayout } from '../moadel'
import UploadImg from '@/components/UploadImg'
import UploadFile from '@/components/UploadFile'

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea

class ServiceModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            acctype: '0',
            initPassway: props.initPassway,
            passways: [],
            endOpen: false
        }
    }

    componentDidMount(){

    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.onSubmit(err, values);
        });
    }

    createOptions = () => {
        const children = [];
        const { passway } = this.props;
        if (!passway) return;
        for (let i = 0; i < passway.length; i++) {
            children.push(<Option key={i} value={passway[i].id}>{passway[i].passwayName}</Option>)
        }
        return children;
    }

    getBank = () => {
        return bankList.map((item, index) => {
            return <Option key={index} value={item}>{item}</Option>
        }
        )
    }

    getLicence = () => {
        return licenceList.map((item, index) => {
            return <Option key={index} value={item.number}>{item.type}</Option>
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



    /**
     * 支付通道选择
     */
    handlePaySelectChange = (value) => {
        this.props.handlePaySelectChange(value.join(','))
    }
    /**
     * 账户类型选择
     */
    handleTypeChange = (value) => {
        this.props.handleTypeChange(value)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isUpdate, tabInfos, SelectedPasswayIds, SelectedAcctype } = this.props
        const { endOpen } = this.state
        let SelectedPasswayIdsArray = SelectedPasswayIds ? SelectedPasswayIds.split(',') : []
        console.log(tabInfos)
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3 className="modal-title">基本信息</h3>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商名称`}>
                            {getFieldDecorator(`facname`, {
                                rules: [{ required: true, whitespace: true, message: '请输入服务商名称' }],
                                initialValue: tabInfos.facname
                            })(
                                <Input placeholder={`服务商名称`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`服务商简称`}>
                            {getFieldDecorator(`facstname`, {
                                rules: [{ required: true, message: '请输入服务商简称' }],
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
                            {getFieldDecorator(`passwayIds`, {
                                initialValue: tabInfos.passwayIds ? tabInfos.passwayIds.split(',') : []
                            })(
                                <Select
                                    allowClear
                                    placeholder="请选择"
                                    mode="multiple"
                                    onChange={this.handlePaySelectChange}
                                    getPopupContainer={() => document.querySelector('.vertical-center-modal')}
                                >
                                    {this.createOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {
                    //微信支付
                    SelectedPasswayIdsArray.includes(WeiXinId)
                        ? <Row gutter={12}>
                            <Col span={24}>
                                <h3 className="modal-title">微信支付</h3>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`FAPP_SECRET`}>
                                    {getFieldDecorator(`appSecret`, {
                                        initialValue: tabInfos.appSecret,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <Input placeholder={`请输入FAPP_SECRET`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={` 微信证书 `}>
                                    {getFieldDecorator(`cert`)(
                                        <UploadFile
                                            keys={tabInfos.id}
                                            url={tabInfos.certUrl} />
                                    )
                                    }
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`APPID`}>
                                    {getFieldDecorator(`appid`, {
                                        initialValue: tabInfos.appid,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <Input placeholder={`请输入应用ID`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`服务商商户号`}>
                                    {getFieldDecorator(`facno`, {
                                        initialValue: tabInfos.facno,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <Input placeholder={`请输入服务商商户号`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`KEY`}>
                                    {getFieldDecorator(`key`, {
                                        initialValue: tabInfos.key,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <Input placeholder={`请输入key`} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`微信是否启用`}>
                                    {getFieldDecorator(`effective`, {
                                        initialValue: (tabInfos.effective !== undefined) ? tabInfos.effective.toString() : '1'
                                    })(
                                        <Select>
                                            <Option value="0">否</Option>
                                            <Option value="1">是</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        : null
                }
                {
                    // 支付宝支付
                    SelectedPasswayIdsArray.includes(ZhiFuBaoId)
                        ? <Row gutter={12}>
                            <Col span={24}>
                                <h3 className="modal-title">支付宝支付</h3>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用ID`}>
                                    {getFieldDecorator(`appidzfb`, {
                                        initialValue: tabInfos.appidzfb,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <TextArea placeholder={`请输入应用ID`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用私钥`}>
                                    {getFieldDecorator(`privateKey`, {
                                        initialValue: tabInfos.privateKey,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <TextArea placeholder={`请输入应用私钥`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`应用公钥`}>
                                    {getFieldDecorator(`publicKey`, {
                                        initialValue: tabInfos.publicKey,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <TextArea placeholder={`请输入应用公钥`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`阿里公钥`}>
                                    {getFieldDecorator(`alipayPublickey`, {
                                        initialValue: tabInfos.alipayPublickey,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <TextArea placeholder={`请输入阿里公钥`} />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`支付宝是否启用`}>
                                    {getFieldDecorator('effectivez', {
                                        initialValue: (tabInfos.effectivez !== undefined) ? tabInfos.effectivez.toString() : '1'
                                    })(
                                        <Select>
                                            <Option value="0">否</Option>
                                            <Option value="1">是</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="pId">
                                    {getFieldDecorator(`pId`, {
                                        initialValue: tabInfos.pId,
                                        rules: [{
                                            required: true, message: '请输入'
                                        }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        : null
                }
                {isUpdate === true ? '' : (
                    <div>
                        <h3 className="modal-title">用户信息</h3>
                        <Row gutter={12}>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`用户名`}>
                                    {getFieldDecorator(`userName`, {
                                        rules: [
                                            { required: true, message: '请输入用户名' },
                                            { pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '非法字符' },
                                        ],
                                        validateFirst: true,
                                    })(
                                        <Input placeholder={`用户名`} autoComplete="off" maxLength="16" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={`密码`}>
                                    {getFieldDecorator(`passWord`, {
                                        rules: [{ required: true, whitespace: true, message: '请输入密码' }]
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
                            {getFieldDecorator(`acctype`, {
                                initialValue: (tabInfos.acctype !== undefined) ? tabInfos.acctype.toString() : undefined
                            })(
                                <Select placeholder="请选择" onChange={this.handleTypeChange}>
                                    <Option value="0">机构</Option>
                                    <Option value="1">个人</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户银行`}>
                            {getFieldDecorator(`deposite`, {
                                initialValue: tabInfos.deposite
                            })(
                                <Select
                                    placeholder="==请选择=="
                                    showSearch
                                    allowClear>
                                    {this.getBank()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`银行卡号`} hasFeedback>
                            {getFieldDecorator(`bankno`, {
                                initialValue: tabInfos.bankno,
                                // rules: [{ pattern: /^([1-9]{1})(\d{14}|\d{18})$/, message: '请输入正确的银行卡号' }]
                            })(
                                <Input placeholder={`银行卡号`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行名称`}>
                            {getFieldDecorator(`branchName`, {
                                initialValue: tabInfos.branchName,
                                rules: [{ pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确的开户支行名称' }]
                            })(
                                <Input placeholder={`开户支行名称`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label={`开户支行地区`}>
                            {getFieldDecorator(`branchRegion`, {
                                initialValue: tabInfos.branchRegion,
                                rules: [{ pattern: /[\u4e00-\u9fa5]/gm, message: '请输入正确的开户支行地区' }]
                            })(
                                <Input placeholder={`开户支行地区`} maxLength="255" />
                            )}
                        </FormItem>
                    </Col>
                    {this.state.acctype === '0' ? (
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`企业名称`}>
                                {getFieldDecorator(`company`, {
                                    initialValue: tabInfos.company
                                })(
                                    <Input placeholder={`企业名称`} maxLength="255" />
                                )}
                            </FormItem>
                        </Col>)
                        : ''
                    }
                </Row>
                {SelectedAcctype === '1'
                    ? <Row gutter={12}>
                        <Col span={24}>
                            <h3 className="modal-title">个人银行账户信息</h3>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`开户人`}>
                                {getFieldDecorator(`acctholder`, {
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
                                {getFieldDecorator(`identitp`, {
                                    initialValue: tabInfos.identitp
                                })(
                                    <Select placeholder={'==请选择=='}>
                                        {this.getLicence()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`持卡人证件号码`}>
                                {getFieldDecorator(`identino`, {
                                    initialValue: tabInfos.identino,
                                    rules: [{ pattern: /^[a-zA-Z0-9]{0,30}$/, message: '请输入正确证件号码' }]
                                })(
                                    <Input placeholder={`持卡人证件号码`} maxLength="30" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`持卡人手机号`}>
                                {getFieldDecorator(`holderphone`, {
                                    initialValue: tabInfos.holderphone,
                                    rules: [{ pattern: /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/, message: '请输入正确手机号' }]
                                })(
                                    <Input placeholder={`持卡人手机号`} maxLength="11" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={12} >
                                    <FormItem {...formItemLayout} label={`持卡人地址`}>
                                        {getFieldDecorator(`holderaddress`, {
                                            initialValue: tabInfos.holderaddress
                                        })(
                                            <Input placeholder={`持卡人地址`} maxLength="255" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`证件有效期起`}>
                                {getFieldDecorator(`idendtstart`, {
                                    initialValue: tabInfos.idendtstart && moment(tabInfos.idendtstart)
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
                                {getFieldDecorator(`idendtend`, {
                                    initialValue: tabInfos.idendtend && moment(tabInfos.idendtend)
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
                                    <UploadImg
                                        keys={tabInfos.id}
                                        url={tabInfos.frontUrl}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={`身份证反面照片`}>
                                {getFieldDecorator(`back`)(
                                    <UploadImg
                                        keys={tabInfos.id}
                                        url={tabInfos.backUrl}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    : null
                }
            </Form>
        )
    }
}

ServiceModal = Form.create()(ServiceModal);
export default ServiceModal
