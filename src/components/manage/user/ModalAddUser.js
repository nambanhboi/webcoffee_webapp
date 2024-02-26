import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from '@/components/base/index.mjs';

import { useStore } from '@/stores/index';
import axios from '@/ultils/axios';
function ModalAddUser({getData}) {
    const { showToast } = useStore();
    const [open, setOpen] = useState(false);
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

    const onRoleChange = () => {

    }
    const rules = {
        confirmPassword: [
            {
                required: true,
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                },
            }),
        ],
        password: [
            {
                required: true,
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if(!/[A-Z]/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự hoa!"))
                    }   
                    if(!/\d/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự số!"))
                    }
                    if(!/\W/.test(value)) {
                        return Promise.reject(new Error("Mật khẩu phải chứa ký tự biệt!"))
                    }   
                    if(value.length < 8) {
                        return Promise.reject(new Error("Mật khẩu phải tối thiểu 8 ký tự!"))
                    }                                       
                    return Promise.resolve();
                }
            })
        ],
        role: [{ required: true }],
        email: [
            {
                required: true,
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if(!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
                        return Promise.reject(new Error("Email không hợp lệ!"))
                    }                                                          
                    return Promise.resolve();
                }
            })
        ],
        username: [{ required: true }],
    };
    
    
    const onFinish = (values) => {
        console.log(values);       
        if(values) {
            axios.post(`auth/register`, values)
            .then(res => {
                if(res.data.success) {
                    showToast("Thêm mới thành công!", 'success');
                    //form.resetFields()
                    getData();
                    setOpen(false);
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
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Thêm mới
            </Button>
            <Modal
                title="Thêm mới người dùng"
                centered
                open={open}
                onOk={() => {}}
                okText="Thêm mới"
                onCancel={() => setOpen(false)}
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
                        rules={rules.username}
                    >
                        <Input placeholder="Nhập tên tài khoản"/>
                    </Form.Item>
                    <Form.Item
                        name='email'
                        label="Email"
                        rules={rules.email}
                    >
                        <Input placeholder="Nhập email"/>
                    </Form.Item>
                    <Form.Item
                        name='role'
                        label="Phân quyền"
                        rules={rules.role}
                    >
                        <Select
                            placeholder="Chọn phân quyền"
                            onChange={onRoleChange}
                            allowClear
                        >
                            <Option value="admin">Quản trị</Option>
                            <Option value="shop">Quán coffee</Option>
                            <Option value="visitor">Người dùng</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label="Mật khẩu"
                        rules={rules.password}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name='confirmPassword'
                        label="Nhập lại mật khẩu"
                        dependencies={['user', 'password']}
                        rules={rules.confirmPassword}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                    </Form.Item>
                    
                </Form>
            </Modal>
        </>
    );
};
export default ModalAddUser;