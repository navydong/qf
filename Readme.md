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

### 分页要和表格分开做

### 骨架屏注入
service-worker.js

### async await axios

### 表格滚动条
scroll = {{ x: true }}
添加css .ant-table td { white-space: nowrap; }
        .ant-table th { white-space: nowrap; }



```
│  App.css
│  App.js
│  App.test.js
│  index.css
│  index.js
│  registerServiceWorker.js
│
├─ajax
│      tools.js
│
├─components
│  │  BreadcrumbCustom.jsx
│  │  changePwdModal.jsx
│  │  HeaderBar.jsx
│  │  SiderCustom.jsx
│  │
│  ├─AreaSelector
│  │      areaData.js
│  │      index.js
│  │
│  └─upload
│          UploadHeader.js
│
├─redux
│  ├─actions
│  │      auth.js
│  │      index.js
│  │      type.js
│  │
│  └─reducer
│          auth.js
│          index.js
│
├─routes
│      index.js
│
├─style
│  │  banner.less
│  │  base.less
│  │  button.less
│  │  card.less
│  │  footer.less
│  │  global.less
│  │  icons.less
│  │  img.less
│  │  index.less
│  │  login.less
│  │  menu.less
│  │  modal.less
│  │  scroll.less
│  │  siderbar.less
│  │  style.md
│  │  table.less
│  │  utils-border.less
│  │  utils-color.less
│  │  utils-size.less
│  │  utils-spacing.less
│  │  utils-text.less
│  │  variables.less
│  │
│  ├─icon
│  │
│  ├─imgs
│  │
│  ├─lib
│  │      animate.css
│  │
│  ├─sharebenefit
│       reset-antd.less
│  
│
├─utils
│      index.jsx
│      md5.js
│      Request.js
│
└─views
    │  Login.jsx
    │  NotFound.jsx           //404页
    │  Page.jsx         
    │
    ├─barcode                 
    │      barcode.jsx
    │
    ├─benefit                 //清分管理
    │      query.jsx          //清分数据查询
    │
    ├─checkBill               //账单核对
    │      aliPay.jsx 
    │      billDetail.jsx     //对账信息
    │      wxPay.jsx
    │
    ├─equipment                //设备管理
    │  │  equipCategory.jsx    //设备品类信息
    │  │  equipTerminal.jsx    //设备终端信息
    │  │
    │  └─qr                    //二维码管理
    │          AddModal.jsx
    │          Authorize.jsx
    │          index.jsx
    │          qr.less
    │          QrCreat.jsx
    │          SearchBox.jsx
    │
    ├─foundation                //基础参数
    │  ├─accessMessage          //通道信息
    │  │      AddModal.jsx
    │  │      DropOption.jsx
    │  │      index.jsx
    │  │      SearchBox.jsx
    │  │
    │  └─category               //行业类目信息
    │          AddForm.jsx
    │          DropOption.jsx
    │          index.jsx
    │          SearchBox.jsx
    │
    ├─login                     //登录页
    │  │  bg2.svg
    │  │  canvas.html
    │  │  login.html
    │  │  style.css
    │  │
    │  └─icon             
    │
    ├─organization             //机构管理
    │      merchant.jsx
    │      merchant.less
    │      service.jsx
    │      slove.jsx
    │
    ├─reportQuery               //报表查询
    │  ├─chart                  //统计图表
    │  │      arguments.js
    │  │      Bar.jsx
    │  │      cardCustom.jsx
    │  │      Hour.jsx
    │  │      index.jsx
    │  │      index.less
    │  │      Line.jsx
    │  │
    │  ├─scatter                //设备分布图
    │  │      index.jsx
    │  │      index.less
    │  │      Map.jsx
    │  │      SearchBox.jsx
    │  │
    │  ├─tradeBalcons           //订单查询-汇总
    │  │      AddModal.jsx
    │  │      DropOption.jsx
    │  │      index.jsx
    │  │      SearchBox.jsx
    │  │
    │  └─tradeBlotter           //订单查询-明细
    │          index.jsx
    │          SearchBox.jsx
    │          tradeBlotter.less
    │
    ├─shareBenefit              //分润管理
    │      detail.jsx
    │      program.jsx
    │      shareConfig.jsx
    │      toggle.jsx
    │
    ├─upload                    //上传
    │      upload.jsx
    │
    └─user                      //权限管理
        ├─menu                  //菜单管理
        │      AddModal.jsx
        │      DropOption.jsx
        │      index.jsx
        │      menu.less
        │      MenuRigth.jsx
        │      RigthAddModal.jsx
        │      SearchBox.jsx
        │
        ├─userGroup             //角色管理
        │      AddModal.jsx
        │      AddUserModal.jsx
        │      Content.jsx
        │      index.jsx
        │      LimitModal.jsx
        │      LimitRigth.jsx
        │      ManageModal.jsx
        │      SearchBox.jsx
        │      tts.jsx
        │      user.less
        │
        └─users                 //用户管理
                AddModal.jsx
                DropOption.jsx
                index.jsx
                SearchBox.jsx

```