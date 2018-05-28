/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-23 16:33:25 
 * @Last Modified by: yss.donghaijun
 * @Last Modified time: 2018-05-23 16:09:49
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

// 当前用户是否已创建会员卡
let hasCard = false

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 22 },
        sm: { span: 12 },
    },
};
const bonusFormItemLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 }
}
const cardBodyStyle = {
    // backgroundColor: '#fff',
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
    CostMoneyUnit: 'costMoneyUnit',
    increaseBonus: "increaseBonus",
    maxIncreaseBonus: "maxIncreaseBonus",
    initIncreaseBonus: "initIncreaseBonus",
    costBonusUnit: "costBonusUnit",
    reduceMoney: "reduceMoney",
    leastMoneyToUseBonus: "leastMoneyToUseBonus",
    maxReduceBonus: "maxReduceBonus"
}

// 图片上传地址
const postUrl = '/back/membercard/fileUpload'

var background = new Blob(['imgs'], { type: 'text/plain' })

class CardForm extends React.Component {
    _isMounted = false
    state = {
        supply_bonus: true,
        logo_fileList: [],                //logo图片
        image_fileList: [],
        background_fileList: [],          //背景图片
        hasCard: false
    }
    componentDidMount() {
        this._isMounted = true
        this.getwxmembercard()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    // 获取已创建会员卡信息
    getwxmembercard = () => {
        axios.get('/back/membercard/getwxmembercard').then(({ data }) => {
            // rel为true, 会员卡已创建。 rel为false，会员卡未创建
            if (data.rel) {
                const { title, brandName, codeType, color, type, description,
                    limit, notice, prerogative, quantity, supplyBalance,
                    supplyBonus, logoLocalUrl, backgroundPicLocalUrl } = data.result
                const backgroundPicFileList = [{
                    uid: -1,
                    status: 'done',
                    url: backgroundPicLocalUrl
                }]
                const logoPicUrlFileList = [{
                    uid: -1,
                    status: 'done',
                    url: logoLocalUrl
                }]
                // 设置表单值
                this.props.form.setFieldsValue({
                    title, brandName, codeType, color, type, description,
                    limit, notice, prerogative, quantity,
                    supplyBalance: !!supplyBalance,
                    supplyBonus: !!supplyBonus,
                    backgroundPic: backgroundPicLocalUrl && backgroundPicFileList,
                    logoPicUrl: logoLocalUrl && logoPicUrlFileList,
                })


                this.setState({
                    background_fileList: backgroundPicLocalUrl ? backgroundPicFileList : [],
                    logo_fileList: logoLocalUrl ? logoPicUrlFileList : [],
                    hasCard: true,
                    cardInfo: data.result
                })
            }
        })
    }



    logoUploadChange = (info) => {
        this.setState({ logo_fileList: info.fileList })
    }
    backgrounduUloadChange = (info) => {
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

            //处理上传图片信息, 不可修改
            if (values.backgroundPic) {
                if (values.backgroundPic[0].response) {
                    values.backgroundPicUrl = values.backgroundPic[0].response.wxUrl
                    values.backgroundPicLocalUrl = values.backgroundPic[0].response.fileUrl
                }
            }
            if (values.logoPicUrl) {
                // 要区分是否上传新的
                if (values.logoPicUrl[0].response) {
                    values.logoUrl = values.logoPicUrl[0].response.wxUrl
                    values.logoLocalUrl = values.logoPicUrl[0].response.fileUrl
                }

            }
            delete values.backgroundPic
            delete values.logoPicUrl

            if (this.state.hasCard) {
                // 修改会员卡
                values.cardId = this.state.cardInfo.cardId
                values.id = this.state.cardInfo.id
                axios.put('/back/membercard/updatewxmembercard', transformData(values)).then(({ data }) => {
                    if (data.rel) {
                        message.info(data.msg)
                    } else {
                        message.error(data.msg)
                    }
                })
            } else {
                // 创建会员卡
                axios.post('/back/membercard/createwxmembercard', transformData(values)).then(({ data }) => {
                    if (data.rel) {
                        message.info(data.msg)
                    } else {
                        message.error(data.msg)
                    }
                })
            }
        })
    }
    //可以把 onChange 的参数（如 event）转化为控件的值
    normFile = (info) => {
        console.log(info)
        // 把fileList作为value传给表单
        return info && info.fileList;
    }
    render() {
        const { cardInfo } = this.props
        const { supply_bonus, logo_fileList, image_fileList, background_fileList } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.onSubmit} >
                <Card title="会员卡信息" noHovering bodyStyle={cardBodyStyle} >
                    {/* 品牌名, 创建后不允许修改 */}
                    {!hasCard && <FormItem {...formItemLayout} label="品牌名称">
                        {getFieldDecorator('brandName', {
                            rules: [
                                { required: true, message: '请输入品牌名称' },
                                { max: 12, message: '品牌名称最多12个汉字' }
                            ]
                        })(
                            <Input maxLength="12" />
                        )}
                    </FormItem>}

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
                        {getFieldDecorator('codeType', {
                            initialValue: 'CODE_TYPE_QRCODE',
                            rules: [
                                { required: true, message: '请选择' },
                            ]
                        })(
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
                            <Select>
                                {cardColor.map(item => (
                                    <Option value={item.name} key={item.name}><span className="color_radio" style={{ backgroundColor: item.color }}></span> &nbsp; {item.name}</Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    {/* 背景图片 */}
                    <FormItem {...formItemLayout} label="背景图片" help="建议像素1000*600以下" >
                        {getFieldDecorator('backgroundPic', {
                            valuePropName: 'fileList',          //子节点的值的属性
                            getValueFromEvent: this.normFile,
                        })(
                            <Upload
                                accept="image/*"
                                name="pic"
                                listType="picture-card"
                                className="background-uploader"
                                action={postUrl}
                                onChange={this.backgrounduUloadChange}
                                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                            >
                                {background_fileList.length >= 1
                                    ? null
                                    : <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">上传背景图片</div>
                                    </div>}
                            </Upload>
                        )}
                        <Tooltip title="设置背景图片则背景颜色无效" ><Icon type="info" style={infoStyle} /></Tooltip>
                    </FormItem>
                    {/* 品牌LOGO */}
                    <FormItem {...formItemLayout} label="品牌LOGO" extra="建议像素300*300" >
                        {getFieldDecorator('logoPicUrl', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [
                                { required: true, message: '请上传品牌LOGO' },
                            ]
                        })(
                            <Upload
                                accept="image/*"
                                name="pic"
                                listType="picture-card"
                                className="logo-uploader"
                                action={postUrl}
                                onChange={this.logoUploadChange}
                                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                            >
                                {logo_fileList.length >= 1
                                    ? null
                                    : <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">上传LOGO</div>
                                    </div>}
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
                    {/* 卡券库存的数量, 创建后不允许修改 */}
                    {
                        !hasCard && <FormItem {...formItemLayout} label="卡券库存的数量">
                            {getFieldDecorator('quantity', {
                                initialValue: 10000000,
                                rules: [
                                    { required: true, message: '请输入卡卡券库存的数量' },
                                ]
                            })(
                                <InputNumber min={1} max={100000000} />
                            )}
                        </FormItem>
                    }
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
                        {getFieldDecorator('supplyBonus', {
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
                        {getFieldDecorator('supplyBalance', {
                            initialValue: false,
                            valuePropName: 'checked',
                            rules: [
                                { required: true, message: '请选择' },
                            ]
                        })(
                            <Switch disabled />
                        )}
                    </FormItem>
                </Card>

                <div className="base_info" >
                    <Card title="会员卡详情-base_info" bodyStyle={cardBodyStyle} noHovering >
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
                            {getFieldDecorator('servicePhone', {
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


                <Card title="积分规则" bodyStyle={cardBodyStyle} noHovering >
                    {supply_bonus &&
                        <div className="bonus" >
                            {/* 消费得积分规则 */}
                            <FormItem style={{ display: 'none' }} >
                                {getFieldDecorator(bonusRules.CostMoneyUnit, {
                                    initialValue: 100,
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
                            <FormItem style={{ display: 'none' }} >
                                {getFieldDecorator(bonusRules.costBonusUnit, {
                                    initialValue: 100,
                                    rules: [{ required: true }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
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
                    <Button type="primary" htmlType="submit" className="btn-search">
                        {this.state.hasCard ? '修改' : '创建'}
                    </Button>
                </div>
            </Form>)
    }
}

export default connect()(Form.create({
    onFieldsChange(props, fields) {
        Object.keys(fields).forEach(item => {
            props.dispatch({
                type: 'CARDINFO',
                payload: { [item]: fields[item].value }
            })
        })
    }
})(CardForm))


/**
 * 将post参数从 background_color 转换为  backgroundColor
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

