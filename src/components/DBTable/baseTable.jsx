import React from 'react';
import {
    Button,
    Table,
    Icon,
    Modal,
    message,
    notification,
    Affix
} from 'antd';

class BaseTable extends React.Component {
    state = {
        modalTitle: '新增',  //模态框标题名称
        modalVisible: false, //模态框是否显示
        selectedRowKeys: [] // 当前有哪些行被选中, 这里只保存key
    }
    //模态框确认按钮
    handleModalOk = ()=>{

    }
    //模态框取消按钮
    hideModal = ()=>{
        
    }
    render() {
        const { tableConfig } = this.props
        const hasSelected = this.state.selectedRowKeys.length > 0;  // 是否选择
        const multiSelected = this.state.selectedRowKeys.length > 1;  // 是否选择了多项
        return (
            <div>
                <Button.Group>
                    {tableConfig.showInsert &&
                        <Button type="primary" onClick={this.onClickInsert}>
                            <Icon type="plus-circle-o" /> 新增
                        </Button>}
                    {tableConfig.showUpdate &&
                        <Button type="primary" disabled={!hasSelected || !this.primaryKey} onClick={this.onClickUpdate}>
                            <Icon type="edit" /> {multiSelected ? '批量修改' : '修改'}
                        </Button>}
                    {tableConfig.showDelete &&
                        <Button type="primary" disabled={!hasSelected || !this.primaryKey} onClick={this.onClickDelete}>
                            <Icon type="delete" /> {multiSelected ? '批量删除' : '删除'}
                        </Button>}
                </Button.Group>
                <Modal title={this.state.modalTitle} visible={this.state.modalVisible} onOk={this.handleModalOk}
                    onCancel={this.hideModal} maskClosable={false} width={550}>
                    {/* 这里放Modal的表单内容 */}
                </Modal>
            </div>
        )
    }
}

export default BaseTable