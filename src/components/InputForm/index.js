import React from 'react'
import { Form, Row, Col, Input, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
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

    showSelect(){
        const data = this.props.data;
        data.map(function(item,index){
            if( !item.options ){
               return(<Option value={''} key={index}></Option>)
            }else{
                item.options.map(function(item,index){
                    return(<Option value={item} key={index}>{item}</Option>)
                })
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const data = this.props.data;
        return (
            <Row gutter={16}>
                {
                    data.map(function(item,index){
                        if( !item.isSelect ){
                            return (
                                <Col span={8} key={index}>
                                    <FormItem {...formItemLayout} label={`${item.label}`}>
                                        {getFieldDecorator(`${item.getFile}`)(
                                            <Input placeholder={`${item.placeholder}`} />
                                        )}
                                    </FormItem>
                                </Col>
                            )
                        }else{
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
                        }
                    })
                }
            </Row>
        )
    }
}



InputForm = Form.create()(InputForm)
export default InputForm