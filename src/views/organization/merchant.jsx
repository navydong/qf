import React from 'react'
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import { Form, Row, Col, Input, Button, Icon, Card, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
class Merchant extends React.Component {
    state = {
        expand: false,
        cities: cityData[provinceData[0]],
        secondCity: cityData[provinceData[0]][0]
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(( err,values ) => {
            console.log('Received values of form', values)
        })
    }

    handleProvinceChange = (value) => {
        this.setState({
            cities:cityData[value],
            secondCity:cityData[value][0]
        })
    }

    onSecondCityChange = (value) => {
        this.setState({
            secondCity: value
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
        const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);
        return (
            <div className="merchant-wrapper">
                <BreadcrumbCustom first="机构信息" second="商户" />
                <Form className="ant-advanced-search-form" onSubmit={ this.handleSearch }>
                    <Card>
                        <Row gutter={16}>
                            <Col span={8}>
                                <FormItem { ...formItemLayout } label={`商户名称`}>
                                    {getFieldDecorator('merchantName')(
                                        <Input  placeholder="商户名称" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人姓名`}>
                                    {getFieldDecorator('contactName')(
                                        <Input placeholder="联系人姓名" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label={`联系人手机`}>
                                    {getFieldDecorator('contactPhone')(
                                        <Input placeholder="联系人手机" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={8}>
                                <FormItem {...formItemLayout} label={`省份`}>
                                    {getFieldDecorator('province',{
                                        initialValue: provinceData[0]
                                    })(
                                        <Select  onChange={this.handleProvinceChange}>
                                            {provinceOptions}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={8}>
                                <FormItem {...formItemLayout} label={`城市`}>
                                    {getFieldDecorator('city',{
                                        initialValue: this.state.secondCity
                                    })(
                                        <Select  onChange={this.onSecondCityChange}>
                                            {cityOptions}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={8}>
                                <FormItem {...formItemLayout} label={`区县`}>
                                    {getFieldDecorator('County',{
                                        initialValue: this.state.secondCity
                                    })(
                                        <Select  onChange={this.onSecondCityChange}>
                                            {cityOptions}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col offset={22}>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        )
    }
}
Merchant = Form.create()(Merchant)
export default Merchant