import React, { memo, useEffect, useState } from 'react';
import { Option, Modal, Button, Card, Flex, Typography, Radio, InputNumber, Col, Row } from "@/components/base"
import { api } from '@/constants/api';
import axios from "@/ultils/axios"
import { urlApi } from '@/constants/config';
import { useStore } from '@/stores';

const ModalAddToCart = ({open, setOpen, productId}) => {
    const { state, dispatch, toast, showToast } = useStore();
    const [formState, setFormSate] = useState({
        size: null,
        quantity: 1,
        productId: null,
        shopId: null
    })
    const [data, setData] = useState(null);
    const [listSize, setListSize] = useState([])
    const [price, setPrice] = useState(null);
    const handleSizeChange = (e) => {
        const size = e.target.value;
        setFormSate({...formState, size});
        setPrice(listSize.find(x => x._id == size).price);
    };
    const getData = async () => {
        await axios.get(`${api.GET_PRODUCT_BY_ID}?id=${productId}`)
        .then(res => {
            if(res.data.success) {
                console.log("get size", res);
                setData(res.data.result)
                setListSize(res.data.result.listSize);
                formState.size = res.data.result.listSize[0]._id
                setPrice(res.data.result.listSize[0].price);
                var shopId = res.data.result.shopId;
                setFormSate({...formState, productId, shopId});
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        if(productId) {
            getData();
        }
    }, [productId])

    const onChangeQuantity = (quantity) => {
        setFormSate({...formState, quantity});
    }

    const handleAddToCart = async () => {
        console.log(formState);
        await axios.post(api.ADD_TO_CART, formState)
        .then(res => {
            if(res.data.success) {
                showToast(res.data.message, "success")
                setOpen(false);
                return;
            }
            showToast("Thêm thất bại!", "error")
        })
        .catch(err => {
            showToast("Thêm thất bại!", "error")
            console.log(err);
        })
    }
    return (
        <div>
            <Modal
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={null}
            >
                <Card
                    bordered={false}
                    style={{width: "100%"}}
                    styles={{
                        body: {
                            padding: 0,
                            overflow: 'hidden',
                        },
                    }}
                >
                    <Flex >
                        <img
                            alt="avatar"
                            src={data ? `${urlApi}/uploads/${data.imgName}` : ''}
                            style={{
                                display: "block",
                                width: "28rem",
                                height: "34rem"
                            }}
                            
                        />
                        <Flex
                            align="flex-start"   
                            vertical        
                            style={{
                                padding: 32,
                                width: 2000
                            }}
                        >
                            <Typography.Title level={3}>
                                {data && data.name}
                            </Typography.Title>
                            <Row>
                                {data && data.description}
                            </Row>
                            <Row style={{ width: "100%", margin: "3rem 0 1rem 0"}}>
                                <Col span={6}>
                                    <Typography.Title level={5}>
                                        Số lượng
                                    </Typography.Title>
                                </Col>
                                <Col span={18}>
                                    <InputNumber min={1} max={100} value={formState.quantity} defaultValue={formState.quantity} onChange={onChangeQuantity} />                                
                                </Col>
                            </Row>
                            <Row style={{ width: "100%"}}>
                                <Col span={6}>
                                    <Typography.Title level={5}>
                                        Kích cỡ
                                    </Typography.Title>
                                </Col>
                                <Col span={18}>
                                    <Radio.Group value={formState.size} onChange={handleSizeChange}>
                                        {listSize &&  listSize.map((item, index) => (
                                            <Radio.Button key={index} value={item._id}>{item.sizeName}</Radio.Button>
                                        ))}
                                    </Radio.Group>                                
                                </Col>
                            </Row>
                            <Row style={{ width: "100%", margin: "3rem 0 1rem 0"}}>
                                <Col span={6}>
                                    <Typography.Title level={5}>
                                        Giá
                                    </Typography.Title>
                                </Col>
                                <Col span={18}>
                                    {price} đ
                                </Col>
                            </Row>
                            <Button style={{margin: "4rem 0"}} onClick={handleAddToCart}>
                                Thêm vào giỏ
                            </Button>
                        </Flex>
                    </Flex>
                </Card>
            </Modal>
        </div>
    )
}

export default memo(ModalAddToCart);
