import React, { memo, useEffect, useState } from 'react';
import { Modal, Button, List, Avatar, Card, Image, InputNumber, Radio, Row, Popconfirm, Empty, Checkbox } from "@/components/base"
import { api } from '@/constants/api';
import axios from "@/ultils/axios"
import { urlApi } from '@/constants/config';
import { useStore } from '@/stores';

const ModalCart = ({open, setOpen}) => {
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
        await axios.get(api.GET_CART_DETAIL)
        .then(res => {
            console.log(res);
            if(res.data.success) {
                setData(res.data.result)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const onChangeQuantity = (quantity) => {
        setFormSate({...formState, quantity});
    }

    useEffect(() => {
        if(open) {
            getData();
        }
    }, [open])
    
    const [selectedShops, setSelectedShops] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleShopSelection = (shopId) => {
        if (selectedShops.includes(shopId)) {
            console.log("hihi");
            setSelectedShops(selectedShops.filter(id => id !== shopId));
            setSelectedProducts([selectedProducts.filter(x => !data.find(shop => shop.shopId === shopId).resultByShopId.map(product => product.id).includes(x))]);
        } else {
            setSelectedShops([...selectedShops, shopId]);
            setSelectedProducts([
                ...selectedProducts,
                ...data.find(shop => shop.shopId === shopId).resultByShopId.map(product => product.id)
            ]);
        }
    };
    
    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleOrder = () => {
        console.log("order: ", selectedProducts);
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
                <div>Giỏ hàng của bạn</div>
                {data ? data.map((shop, idshop) => (
                    <div key={idshop}>
                        <div style={{padding: "1rem 0", fontWeight: "500", fontSize: "1.3rem"}}>
                            <Checkbox
                                style={{ marginRight: "1rem" }}
                                //id cart
                                checked={selectedShops.includes(shop.shopId)}
                                onChange={() => handleShopSelection(shop.shopId)}
                            />
                            <Avatar src={`${urlApi}/uploads/${shop.imgNameShop}`} />
                            {shop.nameShop}
                        </div>
                        <hr />
                        <List
                            itemLayout="horizontal"
                            dataSource={shop.resultByShopId}
                            style={{paddingLeft: "3rem"}}
                            renderItem={(product, idpro) => (
                            <List.Item key={idpro}
                            actions={[<Popconfirm
                                        title="Xóa sản phẩm"
                                        description="Bạn có chắc chắn muốn xóa không?"
                                        okText="Có"
                                        cancelText="Không"
                                        //onConfirm={() => handleDelete(selectedRowKeys)}
                                    >
                                        <Button type="primary" 
                                            danger
                                            style={{margin: '1rem'}}
                                        >
                                            Xóa
                                        </Button>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<>
                                        <Checkbox
                                            style={{ marginRight: "1rem" }}
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleProductSelection(product.id)}
                                        />
                                        <Image src={`${urlApi}/uploads/${product.imgNamePro}`}
                                        style={{
                                            display: "block",
                                            width: "6rem",
                                            height: "7rem"
                                        }}/>
                                    </>}
                                    title={product.namePro}
                                    description={
                                        <>
                                            <Row>
                                                <InputNumber min={1} max={100} value={product.quantity} defaultValue={1} onChange={onChangeQuantity} style={{margin: "0 1rem 2rem 0"}}/>                                
                                                <Radio.Group value={product.size} onChange={handleSizeChange}>
                                                    {product.listSize &&  product.listSize.map((itemsize, index) => (
                                                        <Radio.Button key={index} value={itemsize._id}>{itemsize.sizeName}</Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Row>
                                            <Row>
                                                {product.price} đ
                                            </Row>
                                        </>
                                    }
                                />
                            </List.Item>
                            )}
                        />  
                        <div style={{textAlign: "end"}}>Tổng đơn hàng: {shop.totalPrice} đ</div>
                    </div>
                   
                )) : (
                    <div style={{textAlign: "center", margin: "3rem"}}>
                        <Empty description={
                            <span>
                                không có sản phẩm nào trong giỏ hàng
                            </span>
                        }/>
                    </div>
                )}
                <Button onClick={handleOrder}>Đặt hàng</Button>
            </Modal>
        </div>
    )
}

export default memo(ModalCart);
