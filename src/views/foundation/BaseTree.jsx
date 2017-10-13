import React, { Component } from 'react'
import axios from 'axios'
import { Tree, Button } from 'antd';
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group
class BaseTree extends Component {
    state = {
        treeData: [],
        expandedKeys: ['0', '0-1', '0-2', '0-3'],
        selectedKeys: [],
        checkedKeys: [],
        autoExpandParent: true
    }
    componentDidMount() {
        axios.get('/getTreeData').then(({ data }) => {
            if (data.status !== 200) {
                return
            }
            console.log(data)
            this.setState({
                treeData: data.treeData
            })
            this.props.set()        
        })
    }
    renderTreeNodes = (data) => {
        if (!data) {
            return
        }
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });
    }
    onExpand = (expandedKeys) => {
        //console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    //select指鼠标点击选中，check指前面的多选框选中 
    onCheck = (checkedKeys) => {
        //console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        //console.log('onSelect', info)
        this.setState({ selectedKeys },()=>{
            console.log(this.state.selectedKeys[0])
            this.props.switch({name: this.state.selectedKeys[0], rate: '2', period: '3'})
        })
    }
    //按钮组 
    addHandle = () => {
        let selectedKeys = this.state.selectedKeys
        let treeData = this.state.treeData.slice()

        function addChildNode(data, key, newdata) {
            //console.log(data)
            data.forEach((item) => {
                if (item.key === key) {
                    item.children ? item.children.push(newdata) : item.children = [newdata]
                    return
                }
                if (item.children) {
                    addChildNode(item.children, key, newdata)
                }
            })
        }

        let newdata = { title: '新增节点', key: Math.random() + '' }
        addChildNode(treeData, selectedKeys[0], newdata)
        let expandedKeys = this.state.expandedKeys.slice()
        expandedKeys.push(newdata.key)
        this.setState({ treeData, expandedKeys })
    }
    delHandle = () => {

    }
    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button onClick={this.addHandle}>添加</Button>
                    <Button type="primary" onClick={this.delHandle}>删除</Button>
                </ButtonGroup>
                <Tree
                    expandedKeys={this.state.expandedKeys}
                    showLine
                    checkable
                    autoExpandParent={this.state.autoExpandParent}
                    onExpand={this.onExpand}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    selectedKeys={this.state.selectedKeys}
                    onSelect={this.onSelect}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </Tree>
            </div>

        );
    }
}

export default BaseTree