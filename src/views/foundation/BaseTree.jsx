import React, { Component } from 'react'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class BaseTree extends Component {
    state = {
        treeData: [
            {
                title: '微信支付2017版',
                key: '0',
                children: [
                    {
                        title: '线下零售', key: '0-1', children: [
                            { title: '超市', key: '0-1-1' },
                            { title: '便利店', key: '0-1-2' }
                        ]
                    },
                    {
                        title: '金融', key: '0-2', children: [
                            { title: '保险业务', key: '0-2-1' },
                            { title: '股票软件类', key: '0-2-2' }
                        ]
                    },
                    { title: '线上零售', key: '0-3', children: [{ title: '子类', key: '0-3-1' }] }
                ]
            },
            { title: 'Tree Node', key: '2', isLeaf: true },
        ],
    }
    renderTreeNodes = (data) => {
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
    render() {
        return (
            <Tree 
                defaultExpandAll
                showLine
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        );
    }
}

export default BaseTree