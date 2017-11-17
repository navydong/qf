import React from 'react'
import { Tabs, message } from 'antd'
import axios from 'axios'
import BreadcrumbCustom from '../../../components/BreadcrumbCustom'
import Content from './Content'

const TabPane = Tabs.TabPane;
class UserGroup extends React.Component {
    state = {
        tabList: []
    }
    componentDidMount() {
        axios.get('/back/groupType/all').then(({ data }) => {
            this.setState((prevState) => {
                let arr = data.map(item => item.name)
                prevState.tabList.push(...arr)
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    render() {
        const { tabList } = this.state
        return (
            <div className="user-group">
                <BreadcrumbCustom first="基础配置管理" second="角色管理" user />
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