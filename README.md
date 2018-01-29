### 移动支付清分系统
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

- 分润管理/分润方案 -- 操作、新增分润方案明细   行业类目修改
- 修改分页    分润管理 - 机构分润配置完成
- 修改时间关联，去掉时间（时分秒）选择
- 地图页修改

* [ ]  验证不通过滚动到错误提示
- 下拉框不随页面滚动走 
   - Modal添加 wrapClassName="vertical-center-modal"
   - Select添加 getPopupContainer={()=>document.querySelector('.vertical-center-modal')}

- 分润机构配置modal修改 机构类型和机构名称的关联
- 上传图片问题

`proxyConsole.js:56 Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the TradeBlotter component.`
设备分布图

分页功能
- 分页是受控的, 当搜索时需要把分页重置到1
- 搜索时，分页改变，请求数据需要带上搜索参数


- showQuickJumper	是否可以快速跳转至某页
- showSizeChanger	是否可以改变 pageSize


