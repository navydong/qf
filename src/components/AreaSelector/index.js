import React from 'react'
import { Form, Row, Col,  Select } from 'antd'


const FormItem = Form.Item;
const Option = Select.Option;

class AreaDataSelector extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            province: "110000",
            city: "110100",
            county: "110101"
        }
    }

    handleProvinceChange = (value) => {
        console.log(value)
        this.setState({
            province: value,
        })
        console.log(this.state)
    }

    handleCityChange = (value) => {
        console.log(value)
        this.setState({
            city: value
        })
        console.log(this.state)
    }

    handleCountryChange = (value) => {
        this.setState({
           county: value
        })
        console.log(this.state)
    }

    provinceOptions (){
        let provs = [];
        let data = this.props.data;
        for( let item in data.provinces ){
            provs.push([item,data.provinces[item].name])
        }
        return provs.map((value,key) => <Option key={key} value={value[0]}>{value[1]}</Option>)
    }

    cityOptions(){
        let citys = [];
        let data = this.props.data;
        if( this.state.province ){
            for( let item in data.provinces[this.state.province].citys ){
                citys.push([item,data.provinces[this.state.province].citys[item].name])
            }
        }
        return citys.map((value,key) => <Option key={key} value={value[0]}>{value[1]}</Option>)
        console.log(citys)
    }

    countryOptions(){
        let county = [];
        let data = this.props.data;
        if( this.state.province && this.state.city ){
           // for( let item in data.provinces[this.state.province].citys[this.state.city].countys ){
                //county.push([item,data.provinces[this.state.province].citys[this.state.city].countys[item].name])
           // }
        }

        //return county.map(function(value,index){
            //return (<Option key={index} value={value[0]}>{value[1]}</Option>)
       // })
    }

    render(){
        const data = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        return (
            <div className="area-selector">
                <Row gutter={16}>
                    <Col md={8}>
                        <FormItem {...formItemLayout} label={`省份`}>
                            {getFieldDecorator('province',{
                                //initialValue: data.provinces[this.state.province].name
                            })(
                                <Select  onChange={this.handleProvinceChange}>
                                    {this.provinceOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8}>
                        <FormItem {...formItemLayout} label={`城市`}>
                            {getFieldDecorator('city',{
                                //initialValue: data.provinces[this.state.province].citys[this.state.city].name
                            })(
                                <Select  onChange={this.handleCityChange}>
                                    {this.cityOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8}>
                        <FormItem {...formItemLayout} label={`区县`}>
                            {getFieldDecorator('County',{
                               //initialValue: data.provinces[this.state.province].citys[this.state.city].countys[this.state.county].name
                            })(
                                <Select  onChange={this.handleCountryChange}>
                                    {this.countryOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }

}

AreaDataSelector = Form.create()(AreaDataSelector)
export default AreaDataSelector
