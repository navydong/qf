### 移动支付清分系统
```javascript
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
├─axios
│      config.js
│      index.js
│      tools.js
│
├─components
│  │  BreadcrumbCustom.jsx
│  │  changePwdModal.jsx
│  │  HeaderBar.jsx
│  │  HeaderCustom.jsx
│  │  SiderCustom.jsx
│  │
│  ├─animation
│  │      BasicAnimations.jsx
│  │      ExampleAnimations.jsx
│  │
│  ├─AreaSelector
│  │      areaData.js
│  │      index.js
│  │
│  ├─auth
│  │      Basic.js
│  │      RouterEnter.js
│  │
│  ├─barcode
│  │      BarcodeHeader.js
│  │      BarcodeModal.js
│  │
│  ├─benefit
│  │      BenefitHeader.js
│  │
│  ├─Bill
│  │  ├─AliPayHeader
│  │  │      AlipayHeader.js
│  │  │
│  │  ├─AllBill
│  │  │      AllBillHeader.js
│  │  │
│  │  └─WxPayHeader
│  │          WxPayHeader.js
│  │
│  ├─charts
│  │      Echarts.jsx
│  │      EchartsArea.jsx
│  │      EchartsEffectScatter.js
│  │      EchartsForce.js
│  │      EchartsGraphnpm.jsx
│  │      EchartsPie.jsx
│  │      EchartsScatter.jsx
│  │      Recharts.jsx
│  │      RechartsBarChart.jsx
│  │      RechartsRadarChart.jsx
│  │      RechartsRadialBarChart.jsx
│  │      RechartsSimpleLineChart.jsx
│  │
│  ├─DropOption
│  │      DropOption.js
│  │
│  ├─equipment
│  │  ├─category
│  │  │      CategoryHeader.js
│  │  │      CategoryModal.js
│  │  │
│  │  └─terminal
│  │          TerminalHeader.js
│  │          terminalModal.js
│  │
│  ├─forms
│  │      BasicForm.jsx
│  │      HorizontalForm.jsx
│  │      LoginForm.jsx
│  │      ModalForm.jsx
│  │
│  ├─organization
│  │  ├─merchant
│  │  │      BulkImport.js
│  │  │      MerchantHeader.js
│  │  │      MerchantModal.js
│  │  │
│  │  ├─service
│  │  │      ServiceHeader.js
│  │  │      ServiceModal.js
│  │  │
│  │  └─slove
│  │          SloveHeader.js
│  │          SloveModal.js
│  │
│  ├─ShareBenefit
│  │  │  scheme_header.less
│  │  │
│  │  ├─config
│  │  │      ConfigHeader.js
│  │  │      shareConfigModal.js
│  │  │
│  │  ├─detail
│  │  │      DetailHeader.js
│  │  │      index.js
│  │  │
│  │  ├─program
│  │  │      index.js
│  │  │      ProgramHeader.js
│  │  │      RightTab.js
│  │  │
│  │  └─toggle
│  │          ToggleHeader.js
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
│  │      demo.css
│  │      demo_fontclass.html
│  │      demo_symbol.html
│  │      demo_unicode.html
│  │      iconfont.css
│  │      iconfont.eot
│  │      iconfont.js
│  │      iconfont.svg
│  │      iconfont.ttf
│  │      iconfont.woff
│  │
│  ├─imgs
│  │      01.png
│  │      02.png
│  │      03.png
│  │      04.png
│  │      404.png
│  │      b1.jpg
│  │      b1.png
│  │      beauty.jpg
│  │      green.png
│  │      logo.png
│  │      mobile.gif
│  │      orange.png
│  │      qr.png
│  │      wx.jpg
│  │      下载 (2).png
│  │
│  ├─lib
│  │      animate.css
│  │
│  ├─sharebenefit
│  │      reset-antd.less
│  │
│  └─theme
│          index.js
│          theme-danger.json
│          theme-grey.json
│          theme-info.json
│          theme-warn.json
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