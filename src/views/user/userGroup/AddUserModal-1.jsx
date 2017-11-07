import React from 'react'
import { Modal, Transfer } from 'antd'
import axios from 'axios'

class AddUserModal extends React.Component {
    state = {
        leaders: [],
        targetKeys: [],
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.parentId)
        if(!nextProps.parentId){
            return
        }
        axios.get(`/back/group/${nextProps.parentId}/user`).then(res => res.data).then(response => {
            let leaders = []
            let targetKeys = [] //members
            if (response.rel) {
                response.result.leaders.push(...response.result.members)
                leaders = response.result.leaders.map(leader => (
                    { title: leader.name, key: leader.id }
                ))
                targetKeys = response.result.members.map(member => (
                   member.id
                ))
                this.setState({
                    leaders,targetKeys
                })
            }
        })
    }

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }
    onOk = (e)=>{
        e.preventDefault()
        this.props.onOk(this.state.targetKeys)
    }
    render() {
        return (
            <div>
                <Modal
                    title="添加用户"
                    visible={this.props.visible}
                    onOk={this.onOk}
                    onCancel={this.props.onCancel}
                >
                    <Transfer
                        titles={['人员列表', '成员']}
                        dataSource={this.state.leaders}
                        targetKeys={this.state.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.title}
                    />
                </Modal>
            </div>
        )
    }
}
export default AddUserModal