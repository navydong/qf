import React from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}
class Qrname extends React.Component {
    state = {}
    componentDidMount() {
        const qrName = this.props.modalProps.item.qrName
        this.setState({
            qrName
        })
    }
    componentWillReceiveProps(nextProps) {
        const qrName = nextProps.modalProps.item.qrName
        this.setState({
            qrName
        })
    }
    onChange = (e) => {
        this.setState({
            qrName: e.target.value
        })
    }
    onOk = () => {
        this.props.onOk({
            id: this.props.modalProps.item.id,
            qrName: this.state.qrName
        })
    }
    onCancel = () => {
        this.props.modalProps.onCancel()
    }
    render() {
        const { visible, title } = this.props.modalProps
        return (
            <Modal
                title={title}
                visible={visible}
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                <FormItem label="码名" {...formItemLayout}>
                    <Input value={this.state.qrName} onChange={this.onChange} name="qrName" />
                </FormItem>
            </Modal>

        )
    }
}

export default Form.create()(Qrname)