import { Form, Input, message, Modal, Table } from 'antd';
import axios from 'axios';
import React from 'react';


const FormItem = Form.Item
const Search = Input.Search
const columns = [
    {
        title: "商户名称",
        dataIndex: 'merchantName',
    }
]

class BdModal extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],               //选中商户keys
            merchant: [],
            value: '',
            loading: true
        }
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    /**
     * 获取商户信息
     * 
     * @param {Number} [limit=10] 
     * @param {Number} [offset=1] 
     * @param {string} id  用户id
     * @param {Object} name  商户名称
     */
    getPageList = (id, name, changeSelected = false) => {
        this.setState({
            loading: true
        });
        axios.post('/back/bd/findmerchantbybd', {
            id,
            name
        }).then(({ data }) => {
            const total = data.total;
            const selectedMerchant = data.rows.filter(item => {
                return data.selected.indexOf(item.id) > -1
            })
            const notSelectedMerchant = data.rows.filter(item => {
                return data.selected.indexOf(item.id) < 0
            })
            changeSelected
                ? this._isMounted && this.setState({
                    merchant: [...selectedMerchant, ...notSelectedMerchant],
                    loading: false,
                    total
                })
                : this._isMounted && this.setState({
                    merchant: [...selectedMerchant, ...notSelectedMerchant],
                    selectedRowKeys: data.selected,
                    loading: false,
                    total
                })
        })
    }
    onCancel = () => {
        this.reset(this.props.modalProps.onCancel)
    }
    onOk = () => {
        const ids = this.state.selectedRowKeys.join(',')
        const id = this.props.modalProps.item.id
        axios.post('/back/bd/bdandmerorg', { merIds: ids, id }).then(({ data }) => {
            if (data.rel) {
                message.success(data.msg)
                this.props.onOk()
                this.reset()
            } else {
                message.error(data.msg)
            }
        })
    }
    onSearch = (value) => {
        this.getPageList(this.props.userId, value, true)
    }
    onChange = (e) => {
        const value = e.target.value
        this.setState({
            value
        })
    }
    reset = (cb) => {
        this.setState({
            value: ''
        }, cb)
    }
    render() {
        console.log(React.createContext)
        const { visible, title } = this.props.modalProps
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys)
                this.setState({
                    selectedRowKeys
                })
            }
        }
        const tableProps = {
            bordered: true,
            scroll: { y: 300 },
            pagination: false,
            rowKey: 'id',
            columns,
            rowSelection: rowSelection,
            dataSource: this.state.merchant,
            loading: this.state.loading
        }
        return (
            <div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    width="768px"
                    visible={visible}
                    title={title}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                    <FormItem wrapperCol={{ span: 12 }}>
                        <Search
                            placeholder="搜索商户名称"
                            value={this.state.value}
                            onChange={this.onChange}
                            onSearch={this.onSearch}
                        />
                    </FormItem>
                    <Table {...tableProps} />
                </Modal>
            </div>
        )
    }
}

export default BdModal