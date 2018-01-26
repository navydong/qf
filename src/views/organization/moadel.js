//微信和支付宝通道的id
export const WeiXinId = '74e1479029544232a218a3e60cb791fc';
export const ZhiFuBaoId = '0c811cd8f6a3453da7eca6e446a54528';
const bankList = [
    "中国工商银行", "中国农业银行", "中国银行", "中国建设银行", "中国光大银行",
    "中国民生银行", "华夏银行", "中信银行", "恒丰银行", "上海浦东发展银行", "交通银行",
    "浙商银行", "兴业银行", "深圳发展银行", "招商银行", "广东发展银行"
]
const licenceList = [
    { type: '身份证', number: '0' },
    { type: '护照', number: '1' },
    { type: '军官证', number: '2' },
    { type: '士兵证', number: '3' },
    { type: '港澳台居民来往通行证', number: '4' },
    { type: '警官证', number: '5' },
    { type: '其它', number: '6' }
]

export {
    bankList,
    licenceList,
}