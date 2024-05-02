// "use client"
import React, { useEffect, useState } from "react";

import styles from '@/assets/css/Header.module.css';

import { Menu } from "@/components/base";
import { useStore, actions } from '@/stores';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/ultils/axios';
import  { urlApi } from '@/constants/config';
import { BsCart3 } from "react-icons/bs";
import Link from "next/link";
function NavCom() {
    const { state, dispatch, showToast } = useStore();
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
    // Theo dõi trạng thái và cập nhật isAuth và auth khi nó thay đổi
        if (state) {
            console.log("state: ", state);
            setIsAuth(state.isAuth);
            setAuth(state.auth);
            setAuthToken(state.accessToken)
        }
    }, [state]);

    const handleLogout = () => {
        dispatch(actions.logout());
        router.push('/login', { scroll: false });
    }
    const itemsAdmin = [
        {
            label: (<Link href='/manage/user'>Quản lý người dùng</Link>),
            key: 'manageUser'
        },
        {
            label: (
                <Link href='/user/cart' style={{display: 'flex'}}><BsCart3 style={{fontSize: '1.6rem',
                    marginTop: '0.5rem'}} /> Giỏ hàng</Link>              
            ),
            key: 'cart'
        },
        {
            label: (
                <>
                    { isAuth != null && (
                        <div className={styles.username}>
                            <img src={`${urlApi}/uploads/${auth.avatar}`} className={styles.avata} alt=''/>
                            <span>{auth.username}</span>
                        </div>
                    )}
                </>           
            ),
            key: 'user',
            children: [
                {
                    label: (
                        <span onClick={handleLogout}>Đăng xuất</span>
                    ),
                },
            ],
        },
    ]; 
    const itemsShop = [
        {
            label: (<Link href='/shop/manage-product'>Quản lý sản phẩm</Link>),
            key: 'manageProduct'
        },
        {
            label: (<Link href='/shop/manage-order'>Quản lý đơn hàng</Link>),
            key: 'manageOrder'
        },
        {
            label: (
                <Link href='/user/cart' style={{display: 'flex'}}><BsCart3 style={{fontSize: '1.6rem',
                    marginTop: '0.5rem'}} /> Giỏ hàng</Link>              
            ),
            key: 'cart'
        },
        {
            label: (
                <>
                    { isAuth != null && (
                        <div className={styles.username}>
                            <img src={`${urlApi}/uploads/${auth.avatar}`} className={styles.avata} alt=''/>
                            <span>{auth.username}</span>
                        </div>
                    )}
                </>           
            ),
            key: 'user',
            children: [
                {
                    label: (
                        <Link href='/user/profile'>Trang cá nhân</Link>
                    ),
                },
                {
                    label: (
                        <Link href='/shop/profile'>Trang quán</Link>
                    ),
                },
                {
                    label: (
                        <span onClick={handleLogout}>Đăng xuất</span>
                    ),
                },
            ],
        },
    ];
    const itemsUser = [
        {
            label: (
                <Link href='/user/cart' style={{display: 'flex'}}><BsCart3 style={{fontSize: '1.6rem',
                    marginTop: '0.5rem'}} /> Giỏ hàng</Link>              
            ),
            key: "cart"
        },
        {
            label: (
                <>
                    { isAuth != null && (
                        <div className={styles.username}>
                            <img src={`${urlApi}/uploads/${auth.avatar}`} className={styles.avata} alt=''/>
                            <span>{auth.username}</span>
                        </div>
                    )}
                </>           
            ),
            key: 'user',
            children: [
                {
                    label: (
                        <Link href='/user/profile'>Trang cá nhân</Link>
                    ),
                },
                {
                    label: (
                        <span onClick={handleLogout}>Đăng xuất</span>
                    ),
                },
            ],
        },
    ];  

    const itemsNoUser = [
        {
            label: (
                <span onClick={() => showToast("Vui lòng đăng nhập để tiếp tục!", "info")} style={{display: 'flex'}}><BsCart3 style={{fontSize: '1.6rem',
                    marginTop: '0.5rem'}} /> Giỏ hàng</span>              
            ),
            key: 'cart'
        },
        {
            label: (
                <Link href='/login'>Đăng nhập</Link>              
            ),
            key: 'login'
        },
        {
            label: (
                <Link href='/register'>Đăng ký</Link>              
            ),
            key: 'register'
        },
    ]
    

    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        setCurrent(e.key);
    };    
    return (
        <>
            <Link href="/">
                <img src='/image/logo.jfif' alt="" className={styles.logo}/>
            </Link> 
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={isAuth == 'admin' ? itemsAdmin : (isAuth == 'shop' ? itemsShop : (isAuth == 'visitor' ? itemsUser : itemsNoUser))} className={styles.nav} />           
        </>
    )
}

export default NavCom;