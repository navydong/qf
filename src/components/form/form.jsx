import React from 'react'
import propType from 'prop-types'

import {
    Button,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Form,
    Radio,
    Switch,
    Row,
    Col
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 22 },
        sm: { span: 16 }
    },
}
class ModalForm extends React.Component {
    componentDidMount() {
        // console.log(11)
    }
    createForm(getFieldDecorator, options) {
        let formfile = null;
        switch (options.type) {
            case 'select':
                formfile = <Select allowClear placeholder={options.placeholder}>
                    {options.option.map(item => (
                        <Option key={item.key}>
                            {item.value}
                        </Option>
                    ))}
                </Select>;
                break;
            default:
                formfile = <Input placeholder={options.placeholder} />
        }
        return (
            <Col span={12} key={options.key}>
                <FormItem {...formItemLayout} label={options.label}>
                    {getFieldDecorator(options.key, {
                        rules: options.rules
                    })(formfile)}
                </FormItem>
            </Col>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formdata = [
            {
                key: 'passwayName',
                label: '通道',
                placeholder: '请输入用户名',
                defaultValue: 'foolbear',
            }, {
                type: 'select',
                key: 'a',
                label: '下拉',
                placeholder: '下拉',
                option: [{ key: '1', value: '1' }, { key: '2', value: '2' }]
            }
        ]
        return (
            <div>
                <Form>
                    <Row gutter={8}>
                        {formdata.map(item =>
                            this.createForm(getFieldDecorator, item)
                        )}
                    </Row>
                </Form>
            </div>
        )
    }
}


export default Form.create()(ModalForm)
