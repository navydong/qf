import React from 'react'
import { Row, Col, Form, Select, Input, Button } from 'antd'
const FormItem = Form.Item,
    Option = Select.Option
const Search = Input.Search;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class SearchBox extends React.Component {
    /**
     * 重置表单
     */
    state = {
        name: ''
    }
    reset = () => {
        this.setState({
            name: ''
        })
    }
    search = (e) => {
        this.props.search({
            name: this.state.name
        })
    }
    onChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    render() {
        return (
            <div className="search-box">
                <Form>
                    <Row gutter={40}>
                        <Col span={12}>
                            <FormItem {...formItemLayout}>
                                <Search
                                    id="name"
                                    placeholder="搜索用户名、姓名、机构名、角色"
                                    autoFocus
                                    value={this.state.name}
                                    onSearch={this.search}
                                    onChange={this.onChange}
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    type="primary"
                                    className="btn-search"
                                    loading={this.props.loading}
                                    onClick={this.search}
                                >查询</Button>
                                <Button
                                    className="btn-reset"
                                    onClick={this.reset}
                                >重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default SearchBox