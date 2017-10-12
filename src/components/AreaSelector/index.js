import React from 'react'
import { Select, Row, Col, Form } from 'antd'
import InputForm from "../InputForm/index";

const FormItem = Form.Item;
const Option = Select.Option;

class AreaDataSelector extends React.Component {
    constructor(props){
        super(props)
        const value = this.props.value || {}
        this.state = {
            province: value.province,//"110000",
            city: value.city,//"110100",
            county:value.county //"110101"
        }
    }

    handleProvinceChange = (value) => {
        this.setState({
            province: value,
            city: '',
            county: ''
        })
        this.triggerChange({
            province: value,
            city: '',
            county: ''}
        )
    }

    handleCityChange = (value) => {
        this.setState({
            city: value,
            county: ''
        })
        this.triggerChange({
            city: value,
            county: ''
        })
    }

    handleCountryChange = (value) => {
        this.setState({
            county: value
        })
        this.triggerChange({
            county: value
        })
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    provinceOptions (){
        let provs = [];
        let data = this.props.data;
        for( let item in data.provinces ){
            provs.push([item,data.provinces[item].name])
        }
        return provs.map((value,key) => <Option key={key} value={value[0]} data-index={value[0]}>{value[1]}</Option>)
    }

    cityOptions(){
        let citys = [];
        let data = this.props.data;
        if( this.state.province ){
            for( let item in data.provinces[this.state.province].citys ){
                citys.push([item,data.provinces[this.state.province].citys[item].name])
            }
        }
        return citys.map((value,key) => <Option key={key} value={value[0]} data-index={value[0]}>{value[1]}</Option>)
    }

    countryOptions(){
        let county = [];
        let data = this.props.data;
        console.log(this.state.province)
        if( this.state.province && this.state.city ){
           for( let item in data.provinces[this.state.province].citys[this.state.city].countys ){
               county.push([item,data.provinces[this.state.province].citys[this.state.city].countys[item].name])
            }
        }

        return county.map(function(value,index){
            return (<Option key={index} value={value[0]} data-index={value[0]}>{value[1]}</Option>)
       })
    }

    render(){
        const data = this.props.data;
        return (
            <Row>
                <Col span={8}>
                    <Select defaultValue={"北京市"}  onChange={this.handleProvinceChange}>
                        {this.provinceOptions()}
                    </Select>
                </Col>
                <Col span={8}>
                    <Select defaultValue={"市辖区"} onChange={this.handleCityChange}>
                        {this.cityOptions()}
                    </Select>
                </Col>
                <Col span={8}>
                    <Select defaultValue={"东城区"} onChange={this.handleCountryChange}>
                        {this.countryOptions()}
                    </Select>
                </Col>
            </Row>
        )
    }

}

export default AreaDataSelector
