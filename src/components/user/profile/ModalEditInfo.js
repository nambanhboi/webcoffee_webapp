import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select } from '@/components/base';

import { useStore } from '@/stores';
import axios from '@/ultils/axios';
import { api } from '@/constants/api';
function ModalEditInfo({ openEdit, setOpenEdit }) {
    const { showToast, state } = useStore();
    const [form] = Form.useForm();
    const [formState, setFormState] = useState({});

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

    //site
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

    const getData = async () => {

        await axios.get(api.GET_USER_DETAIL)
        .then(res => {
            console.log(res)    
            setFormState(res.data.result)  
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    useEffect(() => {
        if(openEdit) {
            console.log("gettt dadadatataatt");
            getData();
            getProvince();
        }
    }, [openEdit])

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


    
    const onFinish = (values) => {
        console.log(values);    
        if(values) {
            axios.post(api.EDIT_USER_DETAI, values)
            .then(res => {
                console.log(res);
                if(res.data.success) {
                    showToast("Thêm mới thành công!", 'success');
                    form.resetFields()                
                    setOpenEdit(false);
                }
                else {
                    showToast(res.data.message, 'error')
                }
            })
            .catch((err) => {
                console.log(err);
                showToast("Thêm mới thất bại!", 'error')
            })           
        }

    };

    

    return (
        <Modal
            title="Chỉnh sửa thông tin"
            centered
            open={openEdit}
            onOk={() => {}}
            okText="Lưu"
            onCancel={() => setOpenEdit(false)}               
            cancelText="Thoát"
            width={1000}
            okButtonProps={{ form: 'formAdd', key: 'submit', htmlType: 'submit' }}
        >
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
                    label="Tên tài khoản"
                    rules={rules.requireRule}
                >
                    <Input placeholder="Nhập tên tài khoản"/>
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
                {state.isAuth == "shop" && (
                    <>
                        <Form.Item
                            name='information'
                            label="Thông tin chi tiết"
                            rules={rules.requireRule}
                        >
                            <Input.TextArea placeholder="Nhập thông tin chi tiết"/>
                        </Form.Item>
                        <Form.Item
                            name='timeOpen'
                            label="Giờ mở cửa"
                            rules={rules.requireRule}
                        >
                            <Input.TextArea placeholder="Nhập giờ mở cửa"/>
                        </Form.Item>
                        <Form.Item
                            name='timeClose'
                            label="Giờ đóng cửa"
                            rules={rules.requireRule}
                        >
                            <Input.TextArea placeholder="Nhập thông tin chi tiết"/>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>

    );
};
export default ModalEditInfo;