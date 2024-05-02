"use client"
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
    const { state, dispatch } = useStore();
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
    const items = [
        {
            label: 'Quản lý người dùng',
            key: 'manageUser'
        },
        {
            label: (
                <Link href='/user/cart'><BsCart3 /></Link>              
            ),
            key: 'cart'
        },
        {
            label: (
                <>
                    { isAuth != null ? (
                        <div className={styles.username}>
                            <img src={`${urlApi}/uploads/${auth.avatar}`} className={styles.avata} alt=''/>
                            <span>{auth.username}</span>
                        </div>
                    ) : (
                        <>                      
                            <Link href='/register'>Đăng ký</Link>
                            /
                            <Link href='/login'>Đăng nhập</Link>
                        </>
                    )}
                </>           
            ),
            key: 'user',
            children: [
                {
                    label: (
                        <Link href='/profile'>Trang cá nhân</Link>
                    ),
                },
                {
                    label: (
                        <>
                            { isAuth == "admin" && (
                                <Link href='/manage/user'>Quản lý người dùng</Link>
                            )}
                        </>
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
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        setCurrent(e.key);
    };    
    return (
        <>
            <Link href="/">
                <img src='/image/logo.jfif' alt="" className={styles.logo}/>
            </Link> 
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className={styles.nav} />
            
        </>
    )
}

export default NavCom;