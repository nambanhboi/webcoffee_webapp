import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select } from '@/components/base';

import { useStore } from '@/stores/index';
import axios from '@/ultils/axios';
import { api } from '@/constants/api';
function ModalEditPass({ openEditPass, setOpenEditPass }) {
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
        oldPassword:[
            {
                required: true
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if(!/\W/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự đặc biệt!"))
                    } 
                    if(!/\d/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự số!"))
                    } 
                    if(!/[A-Z]/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự hoa!"))
                    }                                      
                    if(value.length < 8) {
                        return Promise.reject(new Error("Mật khẩu phải tối thiểu 8 ký tự!"))
                    } 
                    return Promise.resolve();
                }
            })
        ],
        newPassword:[
            {
                required: true
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if(!/\W/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự đặc biệt!"))
                    } 
                    if(!/\d/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự số!"))
                    } 
                    if(!/[A-Z]/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự hoa!"))
                    }                                      
                    if(value.length < 8) {
                        return Promise.reject(new Error("Mật khẩu phải tối thiểu 8 ký tự!"))
                    } 
                    if (value && getFieldValue('oldPassword') == value) {
                        return Promise.reject(new Error("Mật khẩu phải khác mật khẩu cũ!"))
                    }
                    return Promise.resolve();
                }
            })
        ],
        confirmNewPassWord:[
            {
                required: true
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('newPassword') == value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                }
            })
        ],
    };

    
    const onFinish = (values) => {
        console.log(values);  
        if(values) {
            axios.post(api.CHANGE_PASS, values)
            .then(res => {
                console.log(res);
                if(res.data.success) {
                    showToast("Đổi mật khẩu thành công!", 'success');
                    form.resetFields()                
                    setOpenEditPass(false);
                }
                else {
                    showToast(res.data.message, 'error')
                }
            })
            .catch((err) => {
                console.log(err);
                showToast("Đổi mật khẩu thất bại!", 'error')
            })           
        }

    };

    return (
        <Modal
            title="Chỉnh sửa thông tin"
            centered
            open={openEditPass}
            onOk={() => {}}
            okText="Lưu"
            onCancel={() => setOpenEditPass(false)}               
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
                    name='oldPassword'
                    label="Xác nhận mật khẩu"
                    rules={rules.oldPassword}
                >
                    <Input.Password placeholder="Nhập mật khẩu cũ" />
                </Form.Item>
                <Form.Item
                    name='newPassword'
                    label="Mật khẩu mới"
                    rules={rules.newPassword}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
                <Form.Item
                    name='confirmNewPassWord'
                    label="Nhập lại mật khẩu mới"
                    dependencies={['user', 'newPassword']}
                    rules={rules.confirmNewPassWord}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                
            </Form>
        </Modal>

    );
};
export default ModalEditPass;