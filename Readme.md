"proxy": "http://192.168.98.174"
"proxy": "http://192.168.98.157"
"proxy": "https://www.shouzan365.com"


### 判断组件是否加载
```
_isMounted = false
componentDidMount() {
    this._isMounted = true
}
componentWillUnmount(){
    this._isMounted = false
}
```
### 代理
packjson 增加  "proxy": "https://www.shouzan365.com"

webpackDevServer
```
proxy: {
      'http://localhost:3006': {
        target: "https://www.shouzan365.com",
        // target: "http://192.168.98.174",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
```

### 保留2位有效数字
` toFixed(2) `

### 分页要和表格分开做

### 骨架屏注入
service-worker.js

### 表格滚动条
scroll = {{ x: true }}
添加css .ant-table td { white-space: nowrap; }
        .ant-table th { white-space: nowrap; }