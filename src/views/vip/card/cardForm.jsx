/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-23 16:33:25 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-04-02 11:36:58
 */
import React from 'react'
import {
    Row, Col, Form, Input, Radio, Upload,
    Icon, Card, Switch, InputNumber, Button,
    Checkbox, Tooltip, Select, message, Modal
} from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

const RadioGroup = Radio.Group;
const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        lg: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 22 },
        lg: { span: 12 },
    },
};
const bonusFormItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 }
}
//背景颜色 
const cardColor = [
    { name: 'Color010', color: '#63b359' },
    { name: 'Color020', color: '#2c9f67' },
    { name: 'Color030', color: '#509fc9' },
    { name: 'Color040', color: '#5885cf' },
    { name: 'Color050', color: '#9062c0' },
    { name: 'Color060', color: '#d09a45' },
    { name: 'Color070', color: '#e4b138' },
    { name: 'Color080', color: '#ee903c' },
    { name: 'Color081', color: '#f08500' },
    { name: 'Color082', color: '#a9d92d' },
    { name: 'Color090', color: '#dd6549' },
    { name: 'Color100', color: '#cc463d' },
    { name: 'Color101', color: '#cf3e36' },
    { name: 'Color102', color: '#5E6671' },
]
// code码
const codeType = [
    { type: 'CODE_TYPE_TEXT', text: '文本' },
    { type: 'CODE_TYPE_BARCODE', text: '一维码' },
    { type: 'CODE_TYPE_QRCODE', text: '二维码' },
    { type: 'CODE_TYPE_ONLY_QRCODE', text: '仅显示二维码' },
    { type: 'CODE_TYPE_ONLY_BARCODE', text: '仅显示一维码' },
    { type: 'CODE_TYPE_NONE', text: '不显示任何码型' },
]
const infoStyle = {
    marginLeft: 5,
    borderRadius: '50%',
    backgroundColor: '#f5222d33',
    color: '#fff',
}
// 积分规则字段
const bonusRules = {
    CostMoneyUnit: 'cost_money_unit',
    increaseBonus: "increase_bonus",
    maxIncreaseBonus: "max_increase_bonus",
    initIncreaseBonus: "init_increase_bonus",
    costBonusUnit: "cost_bonus_unit",
    reduceMoney: "reduce_money",
    leastMoneyToUseBonus: "least_money_to_use_bonus",
    maxReduceBonus: "max_reduce_bonus"
}
//开关的true/false 转换成0/1
const getValueFromEvent = (e) => {
    console.log(e)
    if (e) {
        return 1
    } else {
        return 0
    }
}


/**
 * 将post参数从 background_color 转换为  backgroundColro
 * 
 * @param {*} data 
 */
function transformData(data) {
    var newData = {}
    var re = /_(\w)/g;
    for (var key in data) {
        var newkey = key.replace(re, function ($0, $1) {
            return $1.toUpperCase();
        });
        if (typeof data[key] == 'boolean') {
            if (data[key]) {
                data[key] = 1
            } else {
                data[key] = 0
            }
        }
        // 把表单提交的数字转换为number 
        if (!isNaN(data[key])) {
            data[key] = parseInt(data[key])
        }
        newData[newkey] = data[key]
    }
    return newData
}
// 图片上传地址
const postUrl = '/back/membercard/fileUpload'

// 上传响应后，提示响应
const uploadMessage = (info) => {
    if (info.file.status === 'done') {
        if (!info.file.response.rel) {
            message.error(info.file.response.msg)
        } else {
            //success
        }
    }
}

class CardForm extends React.Component {
    state = {
        supply_bonus: true,
        logo_fileList: [],
        image_fileList: [],
        background_fileList: []
    }
    logoUploadChange = (info) => {
        uploadMessage(info)
        this.setState({ logo_fileList: info.fileList })
    }
    backgrounduUloadChange = (info) => {
        uploadMessage(info)
        this.setState({ background_fileList: info.fileList })
    }
    supplyBonus = (checked) => {
        this.setState({
            supply_bonus: checked
        })
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return
            console.log(values)
            // return
            //处理上传图片信息
            if (values.background_pic) {
                values.background_pic_url = values.background_pic[0].response.wxUrl
                values.background_pic_local_url = values.background_pic[0].response.fileUrl
            }
            if (values.logo_pic_url) {
                values.logo_url = values.logo_pic_url[0].response.wxUrl
                values.logo_local_url = values.logo_pic_url[0].response.fileUrl
            }
            console.log(transformData(values))
            axios.post('/back/membercard/createwxmembercard', transformData(values)).then(({ data }) => {
                console.log(data)
            })
        })
    }
    // 图片上传前钩子
    beforeUpload(file) {
        // 上传的图片限制文件大小限制1MB，仅支持JPG、PNG格式。
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPGorPNG) {
            message.error('仅支持JPG、PNG格式图片');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('图片大小必须小于1M');
        }
        return isJPGorPNG && isLt1M;
    }
    // 图片预览
    previewCancel = () => {

    }
    // 背景图片改变
    backgroundPicChange = () => {

    }
    // 背景图片移除
    backgrounduRemove = () => {

    }
    //可以把 onChange 的参数（如 event）转化为控件的值
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    render() {
        const { form, loading, onSubmit } = this.props
        const { supply_bonus, logo_fileList, image_fileList, background_fileList } = this.state
        const { getFieldDecorator } = form
        const uploadButton = (text = '上传') => {
            return <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{text}</div>
            </div>
        }
        return (
            <Form onSubmit={this.onSubmit} >
                {/* 品牌名 */}
                <FormItem {...formItemLayout} label="品牌名称">
                    {getFieldDecorator('brand_name', {
                        rules: [
                            { required: true, message: '请输入品牌名称' },
                            { max: 12, message: '品牌名称最多12个汉字' }
                        ]
                    })(
                        <Input maxLength="12" />
                    )}
                </FormItem>
                {/* 卡卷名 */}
                <FormItem {...formItemLayout} label="卡卷名">
                    {getFieldDecorator('title', {
                        rules: [
                            { required: true, message: '请输入卡卷名' },
                            { max: 12, message: '品牌名称最多9个汉字' }
                        ]
                    })(
                        <Input maxLength="9" />
                    )}
                </FormItem>
                {/* Code展示类型 */}
                <FormItem {...formItemLayout} label="Code展示类型">
                    {getFieldDecorator('code_type', {
                        initialValue: 'CODE_TYPE_QRCODE',
                        rules: [
                            { required: true, message: '请选择' },
                        ]
                    })(
                        // <RadioGroup name="code_type">
                        //     {codeType.map(item => (
                        //         <Radio value={item.type} key={item.type}>{item.text}</Radio>
                        //     ))}
                        // </RadioGroup>
                        <Select>
                            {codeType.map(item => (
                                <Option value={item.type} key={item.type}>{item.text}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                {/* 卡片背景颜色 */}
                <FormItem {...formItemLayout} label="卡片背景颜色">
                    {getFieldDecorator('color', {
                        initialValue: 'Color010',
                        rules: [
                            { required: true, message: '请选择卡片背景颜色' },
                        ]
                    })(
                        // <RadioGroup name="color">
                        //     {cardColor.map(({ name, color }) => (
                        //         <Radio value={name} key={name}><span className="color_radio" style={{ backgroundColor: color }}></span></Radio>
                        //     ))}
                        // </RadioGroup>
                        <Select>
                            {cardColor.map(item => (
                                <Option value={item.name} key={item.name}><span className="color_radio" style={{ backgroundColor: item.color }}></span> &nbsp; {item.name}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                {/* 背景图片 */}
                <FormItem {...formItemLayout} label="背景图片" help="建议像素1000*600以下" >
                    {getFieldDecorator('background_pic', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                    })(
                        <Upload name="pic"
                            listType="picture-card"
                            className="background-uploader"
                            action={postUrl}
                            onChange={this.backgrounduUloadChange}
                            beforeUpload={this.beforeUpload}
                            showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                        >
                            {background_fileList.length >= 1 ? null : uploadButton('上传背景图片')}
                        </Upload>
                    )}
                </FormItem>
                {/* 品牌LOGO */}
                <FormItem {...formItemLayout} label="品牌LOGO" extra="建议像素300*300" >
                    {getFieldDecorator('logo_pic_url', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [
                            { required: true, message: '请上传品牌LOGO' },
                        ]
                    })(
                        <Upload name="pic"
                            listType="picture-card"
                            className="logo-uploader"
                            action={postUrl}
                            onChange={this.logoUploadChange}
                            beforeUpload={this.beforeUpload}
                            showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                        >
                            {logo_fileList.length >= 1 ? null : uploadButton('上传LOGO')}
                        </Upload>
                    )}
                </FormItem>
                {/* 会员信息类目 */}
                {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="会员信息类目" >
                    {getFieldDecorator('member_supply', {
                        initialValue: ['1'],
                        rules: [
                            // { required: true, message: '请输入会员卡特权说明' },
                        ]
                    })(<Checkbox.Group disabled >
                        <Checkbox value="1" >积分</Checkbox>
                        <Checkbox value="2" >等级</Checkbox>
                        <Checkbox value="3" >优惠券</Checkbox>
                    </Checkbox.Group>)}
                </FormItem> */}
                {/* 卡券使用提醒 */}
                <FormItem {...formItemLayout} label="卡券使用提醒">
                    {getFieldDecorator('notice', {
                        rules: [
                            { required: true, message: '请输入卡券使用提醒' },
                            { max: 16, message: '卡券使用提醒最多16个汉字' }
                        ]
                    })(
                        <Input maxLength="16" />
                    )}
                </FormItem>
                {/* 卡券使用提醒 */}
                <FormItem {...formItemLayout} label="卡券使用说明">
                    {getFieldDecorator('description', {
                        rules: [
                            { required: true, message: '请输入卡券使用提醒' },
                            { max: 1024, message: '字数上限为1024个汉字' }
                        ]
                    })(
                        <TextArea rows={4} placeholder="最大输入1024个汉字" />
                    )}
                </FormItem>
                {/* 卡券库存的数量 */}
                <FormItem {...formItemLayout} label="卡券库存的数量">
                    {getFieldDecorator('quantity', {
                        initialValue: 10000000,
                        rules: [
                            { required: true, message: '请输入卡卡券库存的数量' },
                        ]
                    })(
                        <InputNumber min={1} max={100000000} />
                    )}
                </FormItem>
                {/* 中心按钮 */}
                {/* <FormItem {...formItemLayout} label="中心按钮">
                    {getFieldDecorator('center', {
                        rules: [
                            // { required: true, message: '请输入卡卷名' },
                            // { max: 12, message: '品牌名称最多9个汉字' }
                        ]
                    })(
                        <Input maxLength="9" disabled />
                    )}
                </FormItem> */}
                {/* 是否显示积分 */}
                <FormItem {...formItemLayout} label="显示积分">
                    {getFieldDecorator('supply_bonus', {
                        // getValueFromEvent,
                        initialValue: true,
                        valuePropName: 'checked',
                        rules: [
                            { required: true, message: '请选择' },
                        ]
                    })(
                        <Switch onChange={this.supplyBonus} disabled />
                    )}
                </FormItem>
                {/* 是否支持储值 */}
                <FormItem {...formItemLayout} label="是否支持储值">
                    {getFieldDecorator('supply_balance', {
                        // getValueFromEvent,
                        initialValue: false,
                        valuePropName: 'checked',
                        rules: [
                            { required: true, message: '请选择' },
                        ]
                    })(
                        <Switch disabled />
                    )}
                </FormItem>

                <div className="base_info" >
                    <Card title="会员卡详情-base_info" bodyStyle={{ backgroundColor: '#f0f2f5' }}>
                        {/* 会员卡特权说明 */}
                        <FormItem {...formItemLayout} label="会员卡特权说明">
                            {getFieldDecorator('prerogative', {
                                rules: [
                                    { required: true, message: '请输入会员卡特权说明' },
                                ]
                            })(
                                <TextArea rows={4} placeholder="最大输入1024个汉字" />
                            )}
                        </FormItem>
                        {/* 商家服务类型 */}
                        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="商家服务类型">
                            {getFieldDecorator('business_service', {
                                rules: [
                                    // { required: true, message: '请输入会员卡特权说明' },
                                ]
                            })(<Checkbox.Group>
                                <Checkbox value={'BIZ_SERVICE_DELIVER'}>外卖服务</Checkbox>
                                <Checkbox value={'BIZ_SERVICE_FREE_PARK'}>停车位</Checkbox>
                                <Checkbox value={'BIZ_SERVICE_WITH_PET'}>可带宠物</Checkbox>
                                <Checkbox value={'BIZ_SERVICE_FREE_WIFI'}>免费wifi</Checkbox>
                            </Checkbox.Group>)}
                        </FormItem> */}
                        {/* 客服电话 */}
                        <FormItem {...formItemLayout} label="客服电话">
                            {getFieldDecorator('service_phone', {
                                rules: [
                                    // { message: '请输入会员卡特权说明' },
                                ]
                            })(
                                <Input type="tel" />
                            )}
                        </FormItem>
                        {/* 使用日期，有效期的信息 */}
                        <FormItem {...formItemLayout} label="有效日期">
                            {getFieldDecorator('type', {
                                initialValue: 'DATE_TYPE_PERMANENT',
                                rules: [
                                    { required: true },
                                ]
                            })(
                                <Select disabled >
                                    <Option value="DATE_TYPE_PERMANENT" >永久有效</Option>
                                </Select>
                            )}
                            <span className="ant-form-text" style={{ position: 'absolute', marginLeft: 5 }} >
                                <Tooltip title="该规则暂不支持修改" ><Icon type="info" style={infoStyle} /></Tooltip>
                            </span>
                        </FormItem>
                        {/* 每人可领会员卡数量 */}
                        <FormItem {...formItemLayout} label="每人可领卡的数量">
                            {getFieldDecorator('limit', {
                                initialValue: 1,
                            })(
                                <InputNumber min={1} disabled />
                            )}
                            <span className="ant-form-text" style={{ position: 'absolute', marginLeft: 5 }} >
                                <Tooltip title="该规则暂不支持修改" ><Icon type="info" style={infoStyle} /></Tooltip>
                            </span>
                        </FormItem>
                        {/* 图文列表-图片 */}
                        {/* <FormItem {...formItemLayout} label="图文列表-图片">
                            {getFieldDecorator('image_url', {
                                rules: [
                                    // { required: true, message: '请上传品牌LOGO' },
                                ]
                            })(
                                <Upload name="pic"
                                    listType="picture-card"
                                    className="logo-uploader"
                                    fileList={image_fileList}
                                    action={postUrl}
                                    onChange={this.uploadChange}
                                    beforeUpload={this.beforeUpload}
                                    showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                                >
                                    {image_fileList.length >= 1 ? null : uploadButton('上传图片')}
                                </Upload>
                            )}
                        </FormItem> */}
                        {/* 图文列表-文字 */}
                        {/* <FormItem {...formItemLayout} label="图文列表-描述">
                            {getFieldDecorator('text', {
                                rules: [{ max: 512, message: '超过最大长度' }]
                            })(
                                <TextArea rows={4} maxLength="512" />
                            )}
                        </FormItem> */}

                    </Card>
                </div>


                <Card title="积分规则" bodyStyle={{ backgroundColor: '#f0f2f5' }}>
                    {supply_bonus &&
                        <div className="bonus" >
                            {/* 消费得积分规则 */}
                            <FormItem style={{ display: 'none' }} >
                                {getFieldDecorator(bonusRules.CostMoneyUnit, {
                                    initialValue: 1000,
                                    rules: [{ required: true }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem label="消费积分: 每消费1.00元，增加" colon={false} {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.increaseBonus, {
                                    initialValue: 1,
                                    rules: [{ required: supply_bonus }]
                                })(
                                    <Input disabled />
                                )}
                                <span className="ant-form-text">
                                    积分
                                    <Tooltip title="该规则不可修改" ><Icon type="info" style={infoStyle} /></Tooltip>
                                </span>
                            </FormItem>
                            {/* 用户单次可获取的积分上限 */}
                            <FormItem label="用户单次可获取的积分上限" {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.maxIncreaseBonus, {
                                    initialValue: 1000000,
                                    rules: [{ required: true, message: '请输入' }]
                                })(
                                    <Input disabled />
                                )}
                            </FormItem>
                            {/* 初始设置积分 */}
                            <FormItem label="首次开卡赠送积分" {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.initIncreaseBonus, {
                                    initialValue: 0
                                    // rules: [{ required: true, message: '请输入' }]
                                })(
                                    <Input disabled />
                                )}
                            </FormItem>
                            {/* 抵扣条件，满xx元（这里以分为单位）可用。 */}
                            <FormItem label="抵扣条件：满" colon={false} {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.leastMoneyToUseBonus, {
                                    initialValue: 0
                                    // rules: [{ required: true, message: '请输入' }]
                                })(
                                    <Input disabled />
                                )}
                                <span className="ant-form-text">元可用</span>
                            </FormItem>
                            {/* 抵扣条件，单笔最多使用xx积分。 */}
                            <FormItem label="抵扣条件：单笔最多使用" colon={false} {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.maxReduceBonus, {
                                    initialValue: 10000000,
                                    // rules: [{ required: true, message: '请输入' }]
                                })(
                                    <Input disabled />
                                )}
                                <span className="ant-form-text">积分</span>
                            </FormItem>
                            {/* 每使用<input name="cost_bonus_unit" />积分，抵扣<input name="reduce_money" />元 */}
                            <FormItem label="每使用100积分， 抵扣" colon={false} {...bonusFormItemLayout} >
                                {getFieldDecorator(bonusRules.reduceMoney, {
                                    initialValue: 0,
                                    // rules: [{ required: true, message: '请输入' }]
                                })(
                                    <Input disabled />
                                )}
                                <span className="ant-form-text">元</span>
                            </FormItem>
                        </div>}
                </Card>

                <div className="right_bottom" >
                    <Button type="primary" htmlType="submit" className="btn-search">提交</Button>
                </div>
            </Form>)
    }
}

export default connect()(Form.create({
    onFieldsChange(props, fields) {
        Object.keys(fields).forEach(item=>{
            props.dispatch({
                type: 'CARDINFO',
                payload: {[item]: fields[item].value }
            })
        })
    },
    // mapPropsToFields(props) {
    //     return {
    //       username: Form.createFormField({
    //         // ...props.username,
    //         // value: props.username.value,
    //       }),
    //     };
    //   },
    onValuesChange(_, values) {

    },
})(CardForm))


