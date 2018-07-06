import React from 'react'

// const LoadingComponent = ({isLoading, error}) => {
//   // 加载中
//   if (isLoading) {
//     return <div>Loading...</div>
//   }
//   // 加载出错
//   else if (error) {
//     return <div>Sorry, there was a problem loading the page.</div>
//   }
//   else {
//     return null
//   }
// }

const LoadingComponent = (props) => {
  console.log(props)
  if (props.error) {
    return (
      <div>Error!</div>
    )
  } else if (props.pastDelay) {
    // 300ms 之后显示
    return (
      <div>信息请求中...</div>
    )
  } else {
    return null
  }
}

export default LoadingComponent
