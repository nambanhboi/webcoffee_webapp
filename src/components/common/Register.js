import React, { Children, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Image, Tabs, Select, } from '@/components/base';
import styles from '@/assets/css/Auth.module.css';
import { useStore, actions } from '@/stores';
import axios from '@/ultils/axios';
import { useRouter } from 'next/navigation';
function Register() {
    const { state, dispatch, toast, showToast } = useStore();
    var router = useRouter();

    const rules = {
        email: [
            {
                type: 'email',
                message: "Email không đúng định dạng!"
            }
        ],
        password: [
            {
                type: 'password',
                message: "Password không đúng định dạng!"
            }
        ],
        confirmPassword: [
            ({getFieldsValue}) => ({
                validator(_, value) {
                    console.log(getFieldsValue()['password']);
                    if(value && getFieldsValue()['password'] === value)
                        return Promise.resolve();
                    return Promise.reject(new Error("Mật khẩu không trùng khớp!"))
                }
            })
        ],
        phoneNumber: [
            {
                pattern: /^0\d{10}$/,
                message: "Số điện thoại không đúng định dạng!"
            }
        ],
        fieldRequired: [
            {
                required: true,
                message: 'Trường này là bắt buộc!',
            },
        ]
    }

    // const { Option } = Select
    const [form] = Form.useForm();

    // const [listProvinceId, setListProvinceId] = useState([]);
    // const [listDistrictId, setListDistrictId] = useState([]);
    // const [listCommuneId, setListCommuneId] = useState([]);

    // const getProvince = () => {
    //     axios.get('/site/getAllProvince')
    //     .then(res => {
    //         if(res.data.success) {
    //             setListProvinceId(res.data.result);
    //         }
    //     })
    //     .catch(err => {
    //         console.log("error get province", err);
    //     })
    // }
    // const getDistrict = (id) => {
    //     axios.get(`/site/getAllDistrictByProvinceId?province_id=${id}`)
    //     .then(res => {
    //         if(res.data.success) {
    //             setListDistrictId(res.data.result);
    //         }
    //     })
    //     .catch(err => {
    //         console.log("error get district", err);
    //     })
    // }

    // const getCommune = (id) => {
    //     axios.get(`/site/getAllCommuneByDistrictId?district_id=${id}`)
    //     .then(res => {
    //         if(res.data.success) {
    //             setListCommuneId(res.data.result);
    //         }
    //     })
    //     .catch(err => {
    //         console.log("error get commune", err);
    //     })
    // }

    // useEffect(() => {
    //     getProvince();
    // }, [])
    
    // const onProvinceChange = (value) => {
    //     console.log("value", value);
    //     if(value) getDistrict(value);
    //     form.setFieldsValue({
    //         district_id: null,
    //         commune_id: null
    //     })
    // }
    // const onDistrictChange = (value) => {
    //     console.log("value", value);
    //     if(value) getCommune(value);
    //     form.setFieldsValue({
    //         commune_id: null
    //     })
    // }
    // const onCommuneChange = (value) => {
    //     console.log("value", value);
    // }
    const onCheckBoxChange = () => {

    }


    const onFinish = (values) => {
        console.log("values", values);
        const role = values["isShopCoffee"] ? "shop" : "visitor";
        values["role"] = role
        axios.post('/auth/register', values)
        .then(res => {
            console.log(res);
            if(!res.data.success) {
                showToast(res.data.message, "error")
                return;
            }

            showToast("Đăng ký thành công", "success");
            router.push("/login", { scroll: false })
        })
        .catch(err => {
            console.log(err);
        })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{display: "flex"}}>
            <div className={styles.imgLeft}>            
                <img style={{width: '100%', height: "100%"}}
                    src="/image/auth.jfif" />
            </div>
            <Form
                className={styles.form}
                form={form}
                name="basic"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div>
                    <img src="/image/logo.jfif" alt="" className={styles.imgLogo} />
                </div>
                <div className={styles.title}>
                    Đăng ký
                </div>
                
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[...rules.email, ...rules.fieldRequired]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tên tài khoản"
                    name="username"
                    rules={rules.fieldRequired}
                >
                    <Input />
                </Form.Item>   
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[...rules.password, ...rules.fieldRequired]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    rules={[...rules.confirmPassword, ...rules.fieldRequired]}
                >
                    <Input.Password />
                </Form.Item>  
                <Form.Item
                    name="isShopCoffee"
                    valuePropName="checked"
                >
                    <Checkbox onChange={onCheckBoxChange}>Bạn là chủ quán coffee</Checkbox>
                </Form.Item> 
                {/* <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[...rules.phoneNumber, ...rules.fieldRequired]}
                >
                    <Input />
                </Form.Item> */}
                {/* <Form.Item
                    label="Tỉnh"
                    name="province_id"
                    rules={rules.fieldRequired}
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
                    rules={rules.fieldRequired}
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
                    rules={rules.fieldRequired}
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
                    label="Địa chỉ chi tiết"
                    name="detailAddress"
                    rules={rules.fieldRequired}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Thông tin giới thiệu"
                    name="information"
                    rules={rules.fieldRequired}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Giờ hoạt động"
                    name="time"
                    rules={rules.fieldRequired}
                >
                    <TimePicker.RangePicker />
                </Form.Item>              */}
        
                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Button type='primary' htmlType="submit" >
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};
export default Register;