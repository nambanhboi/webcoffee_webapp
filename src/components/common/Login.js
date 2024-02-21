import React from 'react';
import { Button, Checkbox, Form, Input, Image } from '@/components/base';
import styles from '@/assets/css/Auth.module.css';
import { useStore, actions } from '@/stores';
import axios from '@/ultils/axios';
import { useRouter } from 'next/navigation';
function Login() {
    const { state, dispatch, toast, showToast } = useStore();
    var router = useRouter();
    const onFinish = (values) => {
        showToast("gui", "success");
        axios.post('/auth/login', values)
        .then(res => {
            console.log(res);
            if(!res.data.success) {
                showToast(res.data.message, "error")
                return;
            }

            showToast("Đăng nhập thành công", "success");
            dispatch(actions.login(res.data.result))
            router.push("/", { scroll: false })
        })
        .catch(err => {
            console.log(err);
        })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='flex'>
            <div className={styles.imgLeft}>            
                <img style={{width: '100%', height: "100%"}}
                    src="/image/auth.jfif" />
            </div>
            <Form
            className={styles.form}
                name="basic"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    width: '50%'

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
                    Đăng nhập
                </div>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                        {
                            type: 'email',
                            message: "Email không đúng định dạng!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        {
                            type: 'password',
                            message: "Password không đúng định dạng!"
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Button type='primary' htmlType="submit" >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};
export default Login;