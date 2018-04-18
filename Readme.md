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