/*
 * @Author: yss.donghaijun 
 * @Date: 2018-03-28 13:32:30 
 * @Last Modified by:   yss.donghaijun 
 * @Last Modified time: 2018-03-28 13:32:30 
 */

import React from 'react'

import topImg from '@/style/imgs/back.png'

const columns = [
    { title: '手机号码', dataIndex: '' },
    { title: '积分', dataIndex: '' },
    { title: '注册时间', dataIndex: '' },
    { title: '领卡渠道', dataIndex: '' },
    { title: '卡号', dataIndex: '' },
    { title: '', dataIndex: '' },
    { title: '', dataIndex: '' },
]

export default function cardDetails({ }) {
    return (
        <div className="detail">
            <div className="detail_head">
                <img src={topImg} alt="" />
            </div>
        </div>
    )
}