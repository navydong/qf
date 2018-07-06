import React from 'react'
import { Form, Row, Col, Input, Select } from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 6 },
        lg: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 14 }
    },
}
/**
 * Col和FormItem的外层
 * 
 * @param {*} formItem 
 * @param {*} file 
 */
function colWraper(formItem, file) {
    return (getFieldDecorator, forUpdate) => {
        return (
            <Col lg={12} key={file.id}>
                <FormItem {...formItemLayout} label={file.label}>
                    {formItem(getFieldDecorator, forUpdate)}
                </FormItem>
            </Col>
        )
    }
}
/**
 * form下拉菜单
 * 
 * @param {Object} field 
 * Array   field.option 下拉菜单选项
 * String  field.id     表单name
 * String  placeholder  占位符
 */
function getFormSelect(field) {
    const options = [];
    field.options.forEach((option) => {
        options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });
    return colWraper((getFieldDecorator, forUpdate) => {
        return getFieldDecorator(field.id, {
            initialValue: forUpdate ? undefined : field.defaultValue,
            // rules: forUpdate ? field.$$updateValidator : field.validator,
            rules: field.validator,
        })(
            <Select placeholder={field.placeholder || '请选择'} size="default" disabled={field.disabled} mode={field.mode}>
                {options}
            </Select>
            )
    }, field)
}
/**
 * form 普通输入框
 * 
 * @param {*} field
 * String id             表单name
 * String placeholder    占位符
 * String label          表单label
 * String defaultValue        默认值
 * Bool   disabled            是否禁用
 * addonBefore
 * addonAfter
 */
function getFormInput(field) {
    return colWraper((getFieldDecorator, forUpdate) => {
        return getFieldDecorator(field.id, {
            initialValue: !forUpdate ? undefined : field.defaultValue,
            rules: forUpdate ? field.$$updateValidator : field.validator,
        })(
            <Input
                placeholder={field.placeholder}
                size="default"
                addonBefore={field.addonBefore}
                addonAfter={field.addonAfter}
                disabled={field.disabled}
            />
            )
    }, field)
}

export {
    getFormSelect,
    getFormInput
}