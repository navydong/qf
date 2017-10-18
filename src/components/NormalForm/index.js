import React from 'react'
import { Form, Row, Col, Input, Select, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
/*
  参数传递的说明:
  参数格式：props: [
            {
                    label: "string", => 标题
                    placeholder: 'string', =>默认值
                    getFile: "string", =>返回的数据
                    isSelect: boolean, =>是否为下拉菜单
                    options: ["目录一","目录二"] =>下拉菜单列表
              }

         ]
  数组的长度代表需要的 input框的个数
*/
class InputForm extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const data = this.props.data;
        return (
           <Form className="ant-advanced-search-form">
                <Row gutter={16}>
                    {
                        data.map(function(item,index){
                            if( item.isSelect ){
                                return (
                                    <Col span={8} key={index}>
                                        <FormItem {...formItemLayout} label={`${item.label}`}>
                                            {getFieldDecorator(`${item.getFile}`)(
                                                <Select defalultValue={`${item.placeholder}`}>
                                                    {
                                                        item.options.map((item,index) => (
                                                            <Option value={item} key={index}>{item}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                )
                            }else if(item.isDate){
                                return (
                                    <Col span={8} key={index}>
                                        <FormItem {...formItemLayout} label={`${item.label}`}>
                                            {getFieldDecorator(`${item.getFile}`)(
                                                <DatePicker />
                                            )}
                                        </FormItem>
                                    </Col>
                                )
                            }else{
                                return (
                                    <Col span={8} key={index}>
                                        <FormItem {...formItemLayout} label={`${item.label}`}>
                                            {getFieldDecorator(`${item.getFile}`)(
                                                <Input placeholder={`${item.placeholder}`} />
                                            )}
                                        </FormItem>
                                    </Col>
                                )
                            }
                        })
                    }
                </Row>
           </Form>
        )
    }
}



InputForm = Form.create()(InputForm)
export default InputForm