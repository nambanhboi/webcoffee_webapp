import React, { memo, useEffect, useState } from 'react';
import { Modal, Button, List, Avatar, Select, Card, Form, Image, InputNumber, Typography, Radio, Row, Popconfirm, Empty, Checkbox, Col, Input } from "@/components/base"
import { api } from '@/constants/api';
import axios from "@/ultils/axios"
import { urlApi } from '@/constants/config';
import { useStore } from '@/stores';

function Cart() {
    const { state, dispatch, toast, showToast } = useStore();
    const [formState, setFormState] = useState({});
    const [data, setData] = useState(null);
    const [listSize, setListSize] = useState([])
    const [price, setPrice] = useState(null);


    const [form] = Form.useForm();
    const layout = {
        labelCol: {
        span: 8,
        },
        wrapperCol: {
        span: 16,
        },
    };

    const validateMessages = {
        required: '${label} là bắt buộc!',
    };
    const { Option } = Select;


    const rules = {
        username: [{ required: true }],
        phoneNumber:[
            {
                required: true
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if(!/^0\d+$/.test(value) || value.length != 10) {
                        return Promise.reject(new Error("Số điện thoại không hợp lệ!"))
                    }                                      
                    return Promise.resolve();
                }
            })
        ],
        requireRule: [{ required: true }],
    };
    const [listProvinceId, setListProvinceId] = useState([]);
    const [listDistrictId, setListDistrictId] = useState([]);
    const [listCommuneId, setListCommuneId] = useState([]);
    const getProvince = () => {
        axios.get(api.GET_ALL_PROVINCEID)
        .then(res => {
            if(res.data.success) {
                setListProvinceId(res.data.result);
            }
        })
        .catch(err => {
            console.log("error get province", err);
        })
    }
    const getDistrict = (id) => {
        axios.get(`${api.GET_ALL_DISTRICT_BY_PROVINCEID}?province_id=${id}`)
        .then(res => {
            if(res.data.success) {
                setListDistrictId(res.data.result);
            }
        })
        .catch(err => {
            console.log("error get district", err);
        })
    }

    const getCommune = (id) => {
        axios.get(`${api.GET_ALL_COMMUNE_BY_DISTRICTID}?district_id=${id}`)
        .then(res => {
            if(res.data.success) {
                setListCommuneId(res.data.result);
            }
        })
        .catch(err => {
            console.log("error get commune", err);
        })
    }


    const onProvinceChange = (value) => {
        console.log("value provine", value);
        if(value) getDistrict(value);
        form.setFieldsValue({
            district_id: null,
            commune_id: null
        })
    }
    const onDistrictChange = (value) => {
        console.log("value", value);
        if(value) getCommune(value);
        form.setFieldsValue({
            commune_id: null
        })
    }
    const onCommuneChange = (value) => {
        console.log("value", value);
    }
    useEffect(() => {
        if (form && Object.keys(formState).length > 0) {
            if(formState["province_id"] != null) {
                console.log("hihihihi");
                onProvinceChange(formState["province_id"])
                onDistrictChange(formState["district_id"])
            }
            form.setFieldsValue(formState);
        }
    }, [form, formState]);

    const getDataDeliver = async () => {

        await axios.get(api.GET_USER_DETAIL)
        .then(res => {
            console.log(res)    
            setFormState(res.data.result)  
        })
        .catch(err => {
            console.log(err)
        })
    }

    const onFinish = (values) => {
        if(selectedProducts.length == 0) {
            showToast("Vui lòng chọn sản phẩm", "info");
            return;
        }
        console.log(values);
        console.log(selectedProducts);
        values = {...values, summaryOrder}
        console.log(summaryOrder);   
        if(values) {
            axios.post(api.CREATE_ORDER, values)
            .then(res => {
                console.log(res);
                if(res.data.success) {
                    showToast("Đặt hàng thành công!", 'success');
                    getData()
                }
            })
            .catch((err) => {
                console.log(err);
                showToast("Thêm mới thất bại!", 'error')
            })           
        }

    };


    const handleSizeChange = (e) => {
        const size = e.target.value;
        setFormSate({...formState, size});
        setPrice(listSize.find(x => x._id == size).price);
    };
    const handleChangeMethodPay = () => {

    }
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
        getData();
        getProvince();
        getDataDeliver();
    }, [])
    
    const [selectedShops, setSelectedShops] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [summaryOrder, setSummaryOrder] = useState([]);

    const handleShopSelection = (shopId) => {
        
        if (selectedShops.includes(shopId)) {
            setSelectedShops(selectedShops.filter(id => id !== shopId));
            setSelectedProducts(selectedProducts.filter(productId => {
                return !data.find(shop => shop.shopId === shopId).resultByShopId.some(product => product.id === productId);
            }));
        } else {
            setSelectedShops([...selectedShops, shopId]);
            setSelectedProducts([
                ...selectedProducts,
                ...data.find(shop => shop.shopId === shopId).resultByShopId.map(product => product.id)
            ]);
        }
        console.log("shop: ", selectedShops);
    };
    
    
    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
            //set lại don
            //setListProductPost(lis)
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
        console.log("product: ", selectedProducts);
    };

    const calculateSummaryOrder = () => {
        const summary = [];
        // Lặp qua từng cửa hàng được chọn
        selectedShops.forEach(shopId => {
            // Tìm thông tin cửa hàng từ data
            const shop = data.find(shop => shop.shopId === shopId);
            if (shop) {
                const selectedProductsInShop = shop.resultByShopId.filter(product => selectedProducts.includes(product.id));
                if (selectedProductsInShop.length > 0) {
                    summary.push({
                        shopId: shop.shopId,
                        nameShop: shop.nameShop,
                        imgNameShop: shop.imgNameShop,
                        resultByShopId: selectedProductsInShop,
                        totalPrice: selectedProductsInShop.reduce((total, product) => total + product.price * product.quantity, 0)
                    });
                }
            }
        });
        setSummaryOrder(summary);
    };

    useEffect(() => {
        calculateSummaryOrder();
    }, [selectedProducts, selectedShops]);

   
    
    return (
        <div>
            <div style={{textAlign: 'center',
                fontSize: '2rem',
                fontWeight: '500',
                margin: '3rem 0'}}>
                    Giỏ hàng của bạn</div>
            <Row className="containerApp9">
                <Col span={16}>
                    {data && data.length > 0 ? data.map((shop, idshop) => (
                        <div key={idshop}>
                            <div style={{padding: "1rem 0", fontWeight: "500", fontSize: "1.1rem"}}>
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
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                    <Typography.Title level={4}>
                        Tóm tắt đơn hàng
                    </Typography.Title>
                    {summaryOrder && summaryOrder.length > 0 ? summaryOrder.map((shop, idshop) => (
                        <div key={idshop}>
                            <div style={{padding: "0.4rem 0", fontWeight: "500", fontSize: "0.8rem"}}>
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
                                                    {product.listSize.find(x => x._id == product.size).sizeName}
                                                </Row>
                                
                                            </>
                                        }
                                    />
                                </List.Item>
                                )}
                            />  
                            <div style={{textAlign: "end", fontSize: "0.5rem"}}>
                                <i>Tiền tạm tính: {shop.totalPrice} đ </i>                                                                    
                                <br />
                                <i>Phí giao hàng: {30000} đ</i>                                   
                                <br />
                                <strong><i>Tổng đơn hàng: {shop.totalPrice + 30000} đ</i></strong>                                                                  
                            </div>
                        </div>
                        
                    )) : (
                        <div style={{textAlign: "center", margin: "3rem"}}>
                            <Empty description={
                                <span>
                                    Vui lòng chọn sản phẩm
                                </span>
                            }/>
                        </div>
                    )}
                    <Typography.Title level={4} style={{margin: "1rem 0"}}>
                        Thông tin giao hàng
                    </Typography.Title>
                    <Form
                        form={form}
                        {...layout}
                        name="formAdd"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 800,
                        }}
                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            name='username'
                            label="Tên người nhận"
                            rules={rules.requireRule}
                        >
                            <Input placeholder="Nhập tên người nhân"/>
                        </Form.Item>
                        <Form.Item
                            name='phoneNumber'
                            label="Số điện thoại"
                            rules={rules.requireRule}
                        >
                            <Input placeholder="Nhập số điện thoại"/>
                        </Form.Item>
                        
                        <Form.Item
                            label="Tỉnh"
                            name="province_id"
                            rules={rules.requireRule}
                        >
                            <Select
                                placeholder="Vui lòng chọn tỉnh"
                                onChange={onProvinceChange}
                                allowClear
                            >
                                {listProvinceId.map((item, index) => (
                                    <Option key={index} value={item._id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> 
                        <Form.Item
                            label="Huyện"
                            name="district_id"
                            rules={rules.requireRule}
                        >
                            <Select
                                placeholder="Vui lòng chọn huyện"
                                onChange={onDistrictChange}
                                allowClear
                                filterOption={true}
                            >
                                {listDistrictId.map((item, index) => (
                                    <Option key={index} value={item._id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> 
                        <Form.Item
                            label="Xã"
                            name="commune_id"
                            rules={rules.requireRule}
                        >
                            <Select
                                placeholder="Vui lòng chọn xã"
                                onChange={onCommuneChange}
                                allowClear
                            >
                                {listCommuneId.map((item, index) => (
                                    <Option key={index} value={item._id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='detailAddress'
                            label="Địa chỉ chi tiết"
                            rules={rules.requireRule}
                        >
                            <Input.TextArea placeholder="Nhập địa chỉ chi tiết"/>
                        </Form.Item>
                        <Form.Item
                            name='methodPay'
                            label="Phương thức"
                            rules={rules.requireRule}
                        >
                            <Radio.Group onChange={handleChangeMethodPay}>
                                <Radio value="0">Thanh toán khi nhận hàng</Radio>
                                <Radio value="1">Thanh toán bằng thẻ</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name='note'
                            label="Ghi chú"
                        >
                            <Input.TextArea placeholder="Nhập ghi chú"/>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                            >
                            <Button type="primary" htmlType="submit">
                                Đặt hàng
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>
            </Row>
        
        </div>
    )
}

export default Cart;
