import React from 'react'
import { Tabs, message } from 'antd'
import axios from 'axios'
import Content from './Content'

const TabPane = Tabs.TabPane;
class UserGroup extends React.Component {
    state = {
        tabList: []
    }
    componentDidMount() {
        axios.get('/back/groupType/all').then(({ data }) => {
            this.setState({
                tabList: data.map(item => item.name)
            })
        })
    }
    render() {
        const { tabList } = this.state
        return (
            <div className="user-group">
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab={tabList[0]||'角色类型'} key="1">
                            <Content />
                        </TabPane>
                    </Tabs>
            </div>
        )
    }
}
export default UserGroup