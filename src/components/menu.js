module.exports = {
    vipMenu: [{
        id: '1',
        path: '/app/vip',
        icon: 'credit-card',
        title: '会员卡',
        children: [{
            id: '1-2',
            title: '会员管理',
            href: '/app/vip/members',
        }, {
            id: '1-1',
            title: '会员卡',
            href: '/app/vip/card',
        }]
    }],
    orderMenu: [{
        id: '2',
        path: '/app/order',
        icon: 'credit-card',
        title: '菜单',
        children: [{
            id: '2-1',
            title: '菜单管理',
            href: '/app/order/product',
        },{
            id: '2-2',
            title: '品类管理',
            href: '/app/order/category'
        },{
            id: '2-3',
            title: '订单管理',
            href: 'app/order/list'
        }]
    }]
}