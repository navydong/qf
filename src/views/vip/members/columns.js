const columns = []

for (var i = 0; i < 15; i++) {
    columns.push({
        nameInfo: {
            name: 'lls',
            gender: i % 2
        },
        code: parseInt(Math.random() * 100000),
        phone: '13888888888',
        bonus: '200',
        level: '普通会员',
        beginDate: Date.now() - i * 10000
    }, )
}

module.exports = {
    columns
}