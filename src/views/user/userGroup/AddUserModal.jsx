import React from 'react'
import { Modal, Form, Select, Spin } from 'antd'
import axios from 'axios'
import querystring from 'querystring'
const FormItem = Form.Item
const Option = Select.Option




class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = this.fetchUser.bind(this);
    }
    state = {
        data: [],
        value: [],
        fetching: false,
    }
    // 这里需要节流控制
    fetchUser = (value) => {
        console.log('fetching', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ fetching: true });
        axios.get(`/back/group/${this.props.parentId}/user`).then(res => res.data).then((response) => {
            if (fetchId !== this.lastFetchId) { // for fetch callback order
                return;
            }
            if(response.rel){
                const data = response.result[this.props.sType].map(user => ({
                    text: user.name,
                    value: user.name,
                    fetching: false,
                }));
                this.setState({ data });
            }
        }).catch(err=>console.log(err))
    }
    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }
    render() {
        const { fetching, data, value } = this.state;
        return (
            <Select
                mode="multiple"
                labelInValue
                value={value}
                placeholder="请输入"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={{ width: '100%' }}
                ref={e=>this.select = e}
            >
                {data.map(d => <Option key={d.value}>{d.text}</Option>)}
            </Select>
        )
    }
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 },
        lg: { span: 5 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 15 },
        lg: { span: 16 }
    },
}


class AddUserModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    onOk = (e) => {
        e.preventDefault()
        let leaders = this.leaders.select.props.value
        let members = this.members.select.props.value
        this.props.onOk({
            leaders,
            members
        })

    }
    render() {
        const parentId = this.props.parentId
        return (
            <div>
                <Modal
                    title="添加用户"
                    visible={this.props.visible}
                    onOk={this.onOk}
                    onCancel={this.props.onCancel}
                >
                    <Form>
                        <FormItem label="群主领导" {...formItemLayout}>
                            <SearchInput placeholder="请选择" ref={e => this.leaders = e} parentId={parentId} sType="leaders" />
                        </FormItem>
                        <FormItem label="人员" {...formItemLayout}>
                            <SearchInput placeholder="请选择" ref={e => this.members = e} parentId={parentId} sType="members" />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default AddUserModal