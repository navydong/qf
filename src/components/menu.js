module.exports = {
    vipMenu: [{
        id: '1',
        path: '/app/vip',
        icon: 'credit-card',
        title: '会员卡',
        code: 'vip',
        children: [{
            id: '1-2',
            title: '会员管理',
            code: 'members',
            href: '/app/vip/members',
        }, {
            id: '1-1',
            title: '会员卡',
            code: 'card',
            href: '/app/vip/card',
        },{
            id: '1-3',
            title: '支付即会员',
            code: 'mark',
            href: '/app/vip/mark'
        },{
            id: '1-4',
            title: '活动管理',
            code: 'activity',
            href: '/app/vip/activity'
        }]
    }],
    orderMenu: [{
        id: '2',
        path: '/app/order',
        icon: 'credit-card',
        title: '菜单',
        code: 'order',
        children: [{
            id: '2-1',
            title: '菜单管理',
            code: 'product',
            href: '/app/order/product',
        },{
            id: '2-2',
            title: '品类管理',
            code: 'category',
            href: '/app/order/category'
        },{
            id:'2-3',
            title: '订单',
            code: 'list',
            href: '/app/order/list'
        }]
    }]
}