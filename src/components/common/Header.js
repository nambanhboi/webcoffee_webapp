"use client"
import { 
Nav,
NavDropdown,
Navbar,
Container,
    } from 'react-bootstrap';
import styles from '@/assets/css/Header.module.css';
import { useStore } from '@/stores';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/ultils/axios';
import  { urlApi } from '@/constants/config';
import Link from 'next/link';
function Header() {
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
    return (
        <Navbar expand="lg" className="">
            <Container>
                <Navbar.Brand style={{ textAlign: 'center'}}>
                    <Link href="/">
                        <img src='/image/logo.jfif' alt="" style={{ width: '3rem'}}/>
                        <div style={{fontFamily: "monospace"}}>Sợt Coffee</div>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {isAuth==='admin' && (
                            <>
                                <NavDropdown title="Quản lý thông tin" id="basic-nav-dropdown">
                                    <NavDropdown.Item href='/manage_user'>Quản lý người dùng</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                        {/* nếu chưa đăng nhập  */} 
                        {isAuth !== null ? (
                            <>
                                <NavDropdown title={
                                        <img src={`${urlApi}/uploads/${auth.avatar}`} className='avata' alt=''/>
                                    } id="basic-nav-dropdown"
                                >
                                    <NavDropdown.Item>{auth?.username}</NavDropdown.Item>
                                    <NavDropdown.Item href="/profile">Trang cá nhân</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link href='/register'>Đăng ký</Nav.Link>
                                /
                                <Nav.Link href='/login'>Đăng nhập</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;