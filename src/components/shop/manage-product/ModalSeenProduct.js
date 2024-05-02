import React, { memo, useEffect, useState } from 'react';
import { Button, Modal, Input, Form, Select, Image, Space } from '@/components/base/index.mjs';

import axios from '@/ultils/axios';
import { api } from '@/constants/api';
import { urlApi } from '@/constants/config';
const ModalSeenProduct = ({ productId, openSeen, setOpenSeen }) => {
    
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
        span: 8,
        },
        wrapperCol: {
        span: 16,
        },
    };

    const { Option } = Select;

    const [srcImg, setSrcImg] = useState(null);
    const onRoleChange = () => {

    }
    useEffect(()=>{
        form.setFieldsValue({})
        setSrcImg(null)
        const fetchData = async () => {
            if(productId) {
                await axios.get(`${api.GET_PRODUCT_BY_ID}?id=${productId}`)
                .then(res => {
                    console.log("sds",res);
                    form.setFieldsValue(res.data.result)
                    setSrcImg(`${urlApi}/uploads/${res.data.result.imgName}`)
                }) 
                .catch(err => {
                    console.log(err);
                })
            }
        };
        fetchData();
        
    }, [productId]);
    return (
        <>
            <Modal
                title="Chi tiết sản phẩm"
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
                        name='imgName'
                        label="Ảnh sản phẩm"                        
                    >
                        {srcImg && (
                            <Image src={srcImg} 
                                alt="ảnh sản phẩm"                               
                                style={{
                                    margin: '0.4rem 0',
                                    width: '10rem',
                                    height: '10rem'
                                }}
                                preview
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        name='name'
                        label="Tên sản phẩm"                       
                    >
                        <Input placeholder="Nhập tên sản phẩm"/>
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label="Mô tả"
                        
                    >
                        <Input placeholder="Nhập mô tả"/>
                    </Form.Item>
                    <Form.Item
                        name='listSize'
                        label="Kích cỡ"
                        
                    >
                        <Form.List name='listSize'>
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                    }}
                                    align="baseline"
                                >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'sizeName']}
                                    
                                >
                                    <Select
                                        placeholder="Chọn kích cỡ"
                                        onChange={onRoleChange}
                                        allowClear
                                    >
                                        <Option value="S">Size S</Option>
                                        <Option value="M">Size M</Option>
                                        <Option value="L">Size L</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    label="Giá"
                                >
                                    <Input placeholder="Nhập giá bán" type="number" />
                                </Form.Item>
                                </Space>
                            ))}
                            </>
                        )}
                        </Form.List>
                    </Form.Item>
                    
                    
                </Form>
            </Modal>
        </>
    );
};
export default ModalSeenProduct;