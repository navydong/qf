import React from 'react'
import { Row, Col, Form, Input, Upload, InputNumber, Icon, Button, Card } from 'antd'
import UploadImg from './UploadImg'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const FormItem = Form.Item

// 初始后的下一个元素
let uuid = 3;
// 初始的列表(数组表示每个元素)
const initialValue = [0, 1, 2];

const Item = (props) => {
    const { getFieldDecorator, keys, k, remove } = props
    return (
        <Card.Grid style={{ width: '50%', padding: 18 }} >
            <Row>
                {/* 图片 */}
                <Col span={10} >
                    <FormItem>
                        {getFieldDecorator(`pic[${k}]`)(
                            <UploadImg />
                        )}
                    </FormItem>
                </Col>
                {/* 名称、价格 */}
                <Col span={12} >
                    <Row>
                        <Col>
                            <FormItem label="菜名" >
                                {getFieldDecorator(`names[${k}]`)(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="价格" >
                                {getFieldDecorator(`price[${k}]`)(
                                    <InputNumber min={0} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
                <Col span={2} style={{ textAlign: 'center' }} >
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => remove(k)}
                        />
                    ) : null}
                </Col>
            </Row>
        </Card.Grid>
    )
}

class List extends React.Component {
    componentDidMount() {
        this.props.form.setFieldsValue(this.props.initalList)
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const props = {
                getFieldDecorator,
                keys,
                k,
                remove: this.remove
            }
            return (
                <Item {...props} key={index} />
            );
        });
        return (<div className="product-list" >
            <Form onSubmit={this.handleSubmit}>
                <Card noHovering bordered={false} bodyStyle={{ padding: 0 }} >
                    {formItems}
                </Card>
                <Row style={{marginTop: 20}} >
                    <Col span={24} style={{textAlign: 'center'}} >
                        <Button type="dashed" onClick={this.add} style={{ width: 200 }}>
                            <Icon type="plus" /> 新增菜单
                        </Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Col>
                </Row>
            </Form>
        </div>)
    }
}


export default Form.create()(List)


