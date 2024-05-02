import React, { memo, useEffect, useState } from 'react';
import { Button, Modal, Input, Form, Image, List, Row } from '@/components/base/index.mjs';

import axios from '@/ultils/axios';
import { api } from '@/constants/api';
import { urlApi } from '@/constants/config';
const ModalSeenOrder = ({ orderId, openSeen, setOpenSeen }) => {
    
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
        span: 8,
        },
        wrapperCol: {
        span: 16,
        },
    };
    const [listProduct, setListProduct] = useState([]);
    const onRoleChange = () => {

    }
    useEffect(()=>{
        form.setFieldsValue({})
        const fetchData = async () => {
            if(orderId) {
                await axios.get(`${api.GET_ORDER_DETAIL_BY_ID}?id=${orderId}`)
                .then(res => {
                    console.log("sds",res);
                    form.setFieldsValue(res.data.result)
                    setListProduct(res.data.result.listProduct);
                }) 
                .catch(err => {
                    console.log(err);
                })
            }
        };
        fetchData();
        
    }, [orderId]);
    return (
        <>
            <Modal
                title="Chi tiết đơn hàng"
                centered
                open={openSeen}
                onCancel={() => setOpenSeen(false)}
                cancelText="Thoát"
                width={1000}
            >
                <Form
                    form={form}
                    {...layout}
                    name="formAdd"
                    style={{
                        maxWidth: 800,
                    }}
                    disabled
                >
                    
                    <Form.Item
                        name='time'
                        label="Thời gian"                       
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='status'
                        label="Trạng thái"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='username'
                        label="Tên khách hàng"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='total'
                        label="Tổng đơn hàng"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='phoneNumber'
                        label="Số điện thoại"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='address'
                        label="Địa chỉ"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='methodPay'
                        label="Phương thức thanh toán"               
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='listProduct'
                        label="Danh sách sản phẩm"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={listProduct}
                            style={{paddingLeft: "3rem"}}
                            renderItem={(product, idpro) => (
                            <List.Item key={idpro}
                            >
                                <List.Item.Meta
                                    avatar={<>
                                        <Image src={`${urlApi}/uploads/${product.imgNamePro}`}
                                        style={{
                                            display: "block",
                                            width: "2rem",
                                            height: "3rem"
                                        }}/>
                                    </>}
                                    title={product.namePro}
                                    description={
                                        <>
                                            <Row>
                                                {product.quantity},
                                                {product.sizeName}
                                            </Row>
                            
                                        </>
                                    }
                                />
                            </List.Item>
                            )}
                        />
                    </Form.Item>
                    
                    
                </Form>
            </Modal>
        </>
    );
};
export default ModalSeenOrder;