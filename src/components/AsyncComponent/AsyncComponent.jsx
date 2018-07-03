import React, { Component } from 'react'
import ErrorComponent from './ErrorComponent'
import LoadingComponent from './LoadingComponent'
import './style/index.less'

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        component: LoadingComponent
      }
    }

    async componentDidMount() {
      try {
        const { default: component } = await importComponent()
        this.setState({
          component: component
        })
      } catch (e) {
        this.setState({
          component: ErrorComponent
        })
      }
    }

    render() {
      const C = this.state.component
      return C ? <C {...this.props} /> : null
    }
  }

  return AsyncComponent
}
