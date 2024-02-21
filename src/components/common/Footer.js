"use client";
import { Button, Container,
Form
    } from "react-bootstrap";
import { FiSend,
    FiMapPin } from 'react-icons/fi'
import { BsFacebook } from 'react-icons/bs'
import { AiOutlineTwitter,
AiFillYoutube,
AiOutlineGoogle,
AiOutlinePhone,
AiOutlineMail } from 'react-icons/ai';
import Link from "next/link";
import styles from '@/assets/css/Footer.module.css';
function Footer() {
    return (
        <div className={styles.footer}>
            <video src='/video/footer.mp4' loop autoPlay muted type="video/mp4"></video>
            <Container className={styles.info}>
                <Form className={styles.contactwu}>
                    <Form.Group className={styles.formemail} controlId="formGroupEmail">
                        <Form.Label className={styles.label}>Liên hệ với chúng tôi</Form.Label>
                        <Form.Control className={styles.email} type="email" placeholder="Nhập email" />
                    </Form.Group>
                    <Button className={styles.button}>Gửi
                        <FiSend />
                    </Button>
                </Form>
                <div className={styles.block + styles.card}>
                    <div className={styles.introduction_footer}>
                        <span className={styles.title_footer}>Giới thiệu</span>
                        <p>Discover our extensive collection of stylish and high-quality footwear for every occasion at our online shoe store. Step into fashion and comfort with us today!</p>
                        <div>
                            <BsFacebook className={styles.icon}/>
                            <AiOutlineTwitter className={styles.icon}/>
                            <AiFillYoutube className={styles.icon}/>
                            <AiOutlineGoogle className={styles.icon}/>
                        </div>
                    </div>
                    <div className={styles.contact}>
                        <span className={styles.title_footer}>Liên hệ</span>
                        <span>
                            <FiMapPin className={styles.icon}/>
                            Nhà số 7, ngách 112, ngõ 54, Lê Quang Đạo, Nam Từ Liêm, Thành phố Hà Nội
                        </span>
                        <span>
                            <AiOutlinePhone className={styles.icon}/>
                            0704112515
                        </span>
                        <span>
                            <AiOutlineMail className={styles.icon}/>
                            vuhainam18102003@gmail.com
                        </span>
                    </div>
                    <div className={styles.help}>
                        <span className={styles.title_footer}>Trợ giúp</span>
                        <Link href="" className="link">Giao Hàng</Link>
                        <Link href="" className="link">Hoàn trả</Link>
                        <Link href="" className="link">Trợ giúp</Link>
                    </div>
                    <div className={styles.aboutus}>
                        <span className={styles.title_footer}>Về chúng tôi</span>
                        <Link href="" className="link">Tin tức</Link>
                        <Link href="" className="link">Thành viên</Link>
                        <Link href="" className="link">Về chúng tôi</Link>
                    </div>
                </div>
            </Container>
        </div>
        
    )
}

export default Footer;


