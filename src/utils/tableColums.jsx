export const shareBenefitProgramme =  [{
    title: '序号',
    dataIndex: 'id',
    render: (text, record) => <a href={record.url} target="_blank">{text}</a>
}, {
    title: '分润方案名称',
    dataIndex: 'types',
}, {
    title: '创建人',
    dataIndex: 'createPerson',
}, {
    title: '创建时间',
    dataIndex: 'createTime',
},{
    title: '修改人',
    dataIndex: 'changePerson',
},{
    title: '修改时间',
    dataIndex: 'changeTime'
},{
    title: '审核状态',
    dataIndex: 'checkStatus'
},{
    title: '审核人',
    dataIndex: 'checkPerson'
},{
    title: '审核时间',
    dataIndex: 'checkTime',
}, {
    title: '操作',
    dataIndex: 'action',
    render: text => (
        <div>
            <Button type="primary" htmlType="submit" onClick={() => this.handlerDetail()}>详细</Button>
        </div>
    )
 }
]