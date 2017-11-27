import React from 'react'
import { Modal, Transfer } from 'antd'
import axios from 'axios'

class AddUserModal extends React.Component {
    state = {
        leaders: [],
        targetKeys: [],
    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.parentId)
        if (!nextProps.parentId) {
            return
        }
        axios.get(`/back/group/${nextProps.parentId}/user`).then(res => res.data).then(response => {
            let leaders = []
            let targetKeys = [] //members
            if (response.rel) {
                response.result.leaders.push(...response.result.members)
                leaders = response.result.leaders.map(leader => (
                    {
                        key: leader.id,
                        name: leader.name,
                        username: leader.username,
                        description: leader.description,
                        mobilePhone: leader.mobilePhone,
                        email: leader.email,
                    }
                ))
                targetKeys = response.result.members.map(member => (
                    member.id
                ))
                this.setState({
                    leaders, targetKeys
                })
            }
        })
    }

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }
    onOk = (e) => {
        e.preventDefault()
        this.props.onOk(this.state.targetKeys)
    }
    // 搜索框 相当于filter的用法
    filterOption = (inputValue, option) => {
        return Object.values(option).filter(i=>(
            i&&i.indexOf(inputValue) > -1
        )).length
        // return option.title && option.title.indexOf(inputValue) > -1;
    }
    render() {
        return (
            <div className="user-modal">
                <Modal
                    title="添加用户"
                    visible={this.props.visible}
                    onOk={this.onOk}
                    onCancel={this.props.onCancel}
                    wrapClassName="vertical-center-modal"
                >
                    <Transfer
                        className="transferCustom"
                        showSearch
                        searchPlaceholder="请输入搜索内容"
                        listStyle={{height: '300px', width: '200px', }}
                        filterOption={this.filterOption}
                        titles={['人员列表', '成员']}
                        dataSource={this.state.leaders}
                        targetKeys={this.state.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.name}
                    />
                </Modal>
            </div>
        )
    }
}
export default AddUserModal