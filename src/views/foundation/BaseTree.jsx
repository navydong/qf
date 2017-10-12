import React, { Component } from 'react'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class BaseTree extends React.Component {
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
                    { title: '金融', key: '0-2' },
                    { title: '线上零售', key: '0-3' }
                ]
            },
            { title: 'Tree Node', key: '2', isLeaf: true },
        ],
    }
    onLoadData = (treeNode) => {
        console.log(treeNode)
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 100);
        });
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
            <Tree loadData={this.onLoadData}>
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        );
    }
}

export default BaseTree