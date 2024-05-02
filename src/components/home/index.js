import React from 'react';

import { BiFilter } from 'react-icons/bi';
import { SiCoffeescript } from 'react-icons/si';
import { FaUser } from 'react-icons/fa';
import { BsBalloonHeartFill } from 'react-icons/bs';
import { AiOutlineLeftCircle, AiOutlineRightCircle, AiFillHeart } from 'react-icons/ai';
import { GiReturnArrow } from "react-icons/gi";

import styles from '@/assets/css/Home.module.css';
import CardImage from "@/components/common/CardImage.js";
import axios from '@/ultils/axios';
import imgIntro1 from '@/assets/image/intro1.jpg';
import { useEffect, useState } from "react";
import { urlApi } from "@/constants/config";
import {Form, Select, Input, Button, Image, Empty} from '@/components/base/index.mjs';
import { api } from '@/constants/api';
function Home() {
    const [form] = Form.useForm();
    const {Option} = Select;
  
    //search site
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

    useEffect(() => {
        getProvince();
    }, [])

    const onProvinceChange = (value) => {
        console.log("value", value);
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

    //column
    const [listHighlightShopCoffee, setListHighlightShopCoffee] = useState([])

    const [column1, setColumn1] = useState([]);
    const [column2, setColumn2] = useState([]);
    const [column3, setColumn3] = useState([]);
    const [styleColumn, setStyleColumn] = useState({});
    const [listImage, setListImage] = useState([
        '1701940563185.jfif',
        '1701940591433.jfif',
        '1701940591439.jfif',
        '1701940591441.jfif',
        '1701940591442.jfif',
        '1701941026982.jfif'
    ])
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const numOfImages = listImage.length;

            if (width <= 768) {
                setColumn1(listImage.slice(0, Math.floor(numOfImages / 2)));
                setColumn2(listImage.slice(Math.floor(numOfImages / 2)));
                setColumn3([]); // Đảm bảo cột thứ 3 rỗng khi màn hình nhỏ hơn
                setStyleColumn({width: '48%'})
            } else {
                setColumn1(listImage.slice(0, Math.floor(numOfImages / 3)));
                setColumn2(listImage.slice(Math.floor(numOfImages / 3), Math.floor((2 * numOfImages) / 3)));
                setColumn3(listImage.slice(Math.floor((2 * numOfImages) / 3)));
                setStyleColumn({width: '32.6%'})
            }
        };

        handleResize(); // Gọi hàm khi load trang
        window.addEventListener('resize', handleResize); // Thêm sự kiện resize window

        return () => {
            window.removeEventListener('resize', handleResize); // Xóa sự kiện khi component unmount
        };
    }, [listImage]);


    const [isSearch, setIsSearch] = useState(false);
    const [listShop, setListShop] = useState([]);

    //
    const onFinish = () => {

    }


    // slide
    const [currentIndexSlider, setCurrentIndexSlider] = useState(0);
    const sliderStyle = {
        transform: `translateX(-${currentIndexSlider * 20}rem)`
    }


    const handlePrev = () => {
        if(currentIndexSlider > 0) {
            setCurrentIndexSlider(currentIndexSlider - 1);
        }
    };

    const handleNext = () => {
        if(currentIndexSlider < listHighlightShopCoffee.length - 2) {
            setCurrentIndexSlider(currentIndexSlider + 1);
        }
    };
    const getData = async () => {
        await axios.get('/shop/getlistHighlightShop')
        .then(res => {
            console.log(res)
            if(res.data.success) {
                setListHighlightShopCoffee(res.data.result)
            }
        })
        .catch(err => {
            console.log(err)
        })

        // await axios.get('/home/getRegion')
        // .then(res => {
        //     console.log(res)
        //     if(res.data.success) {
        //         setListRegion(res.data.result);
        //         console.log(listRegion);
        //     }
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    }

    useEffect(() => {
        getData();
    }, []);


    const handleSearch = async () => {
        const postData = {
            regionIdSearch,
            nameShopCoffeeSearch
        }
        setIsSearch(true)
        console.log("regionIdSearch: ", postData);
        await axios.post('/shop/searchShop', postData)
        .then(res => {
            console.log(res)
            if(res.data.success) {
                setListShop(res.data.result)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <section>
            <div className={styles.head}>
                <video className={styles.videohead} src="/video/footer.mp4" loop autoPlay muted type="video/mp4"></video>      
                <div className={styles.info}>
                    <h2 className={styles.titleInfo}>Tìm kiếm view đẹp cho hôm nay</h2>
                    <Form
                        className={styles.form}
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            width: '100%'
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tỉnh"
                            name="province_id"
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
                            label="Tên quán"
                            name="name"
                        >
                            <Input placeholder='Nhập tên quán'/>
                        </Form.Item>  
                        <Button type='primary' htmlType="submit" style={{width: '100%'}}>
                            Tìm kiếm
                        </Button>
                    </Form>
                </div>
            </div>
            {!isSearch ? (
                <>
                     <div className={styles.report_title + " container"} style={{ textAlign: 'center', margin: '4rem auto 1rem auto'}}>
                        <h1>Sợt Coffee</h1>
                        <p>Chào mừng đến với trang web tìm kiếm quán cà phê - nơi dành cho những người yêu thích hương vị của cà phê và không gian đặc biệt. Chúng tôi là nguồn thông tin tin cậy giúp bạn khám phá và trải nghiệm những quán cà phê đa dạng, từ những nơi mang phong cách hiện đại đến những không gian lịch sự và thư giãn.</p>
                    </div>
                    <div className={styles.listImage}>
                        <div className={styles.column1} style={styleColumn}>
                            {column1 && column1.length > 0 && column1.map((imgName, index) => (
                                <Image src={`/image/${imgName}`}
                                    style={{margin: '0.4rem 0'}}
                                    preview={false}
                                    key={index}
                                />                  
                            ))}
                        </div>
                        <div className={styles.column2} style={styleColumn}>
                            {column2 && column2.length > 0 && column2.map((imgName, index) => (
                                <Image src={`/image/${imgName}`}
                                    style={{margin: '0.4rem 0'}}
                                    preview={false}
                                    key={index}
                                />
                            ))}
                        </div>
                        <div className={styles.column3} style={column3 && column3.length > 0 ? styleColumn : {}}>
                            {column3 && column3.length > 0 && column3.map((imgName, index) => (
                                
                                <Image src={`/image/${imgName}`}
                                    style={{margin: '0.4rem 0'}}
                                    preview={false}
                                    key={index}
                                />                               
                            ))}
                        </div>
                    </div>
                    <div className={styles.report + " containerApp8"}>
                        <div className={styles.report_title}>
                            <h2>Giới thiệu</h2>
                            <p>Trang web tìm kiếm quán coffee số 1</p>
                        </div>
                        <div className={styles.report1}>
                            <BsBalloonHeartFill className={styles.report_icon} />
                            <h3>Yêu thích</h3>
                            <p>Top 1 trang web được yêu thích nhất</p>
                        </div>
                        <div className={styles.report2}>
                            <FaUser className={styles.report_icon} />
                            <h3>Truy cập</h3>
                            <p>Hàng triệu lượt truy cập mỗi ngày</p>
                        </div>
                        <div className={styles.report3}>
                            <SiCoffeescript className={styles.report_icon} />
                            <h3>Bao phủ</h3>
                            <p>Bao phủ 80% các quán coffee ở Hà Nội</p>
                        </div>
                    </div>

                    <div className={styles.highlightCoffee}>
                        <div className={styles.highlightCoffee_title + " containerApp8"}>
                            <h2>Các quán coffee nổi bật</h2>
                            <p>Với việc chọn lựa tỉ mỉ từng chi tiết trang trí, mỗi quán cà phê mang đến cho bạn một trải nghiệm thị giác độc đáo. Bức tranh, tác phẩm điêu khắc hay thậm chí là những bức ảnh độc đáo - mọi thứ đều được sắp xếp một cách tinh tế để tạo nên một không gian đầy cảm hứng.</p>
                        </div>
                        <div className={styles.highlightCoffee_listcard}
                            style={sliderStyle}
                        >
                                {listHighlightShopCoffee.map((shop, index) => (                           
                                    <CardImage key={index}
                                        imgName={shop.avatar}
                                        title={shop.username}
                                        address={shop.address}    
                                        statusLike={shop.statusLike} 
                                        statusSave={shop.statusSave}  
                                        shopId={shop.shopId}
                                    />
                                ))}
                        </div>
                    
                        <AiOutlineLeftCircle onClick={handlePrev} className={styles.icon_sliderLeft} />
                        <AiOutlineRightCircle onClick={handleNext} className={styles.icon_sliderRight} />
                    </div>

                    <div className={styles.report_title + " containerApp8"} style={{ textAlign: 'center', margin: '4rem auto 1rem auto'}}>
                            <h2>Cà Phê Hà Nội</h2>
                            <p> Khám Phá và Chia Sẻ Khoảnh Khắc Cùng Trang Web Tìm Kiếm Quán Cà Phê</p>
                        </div>
                    <div className={styles.useful + " containerApp8"}>
                        <div className={styles.usefulCard}>
                            <FaUser className={styles.report_icon} />
                            <h3>Tiện ích</h3>
                            <p style={{padding: '0 2rem'}}>Trang web tìm kiếm quán cà phê của chúng tôi giúp bạn tra cứu dễ dàng các quán cà phê tại Hà Nội. Với hệ thống tìm kiếm thông minh, bạn có thể lọc kết quả theo vị trí, loại cà phê, hoặc bất kỳ tiêu chí nào bạn mong muốn. Không cần lãng phí thời gian trong việc tìm kiếm, bạn sẽ nhanh chóng tìm thấy quán cà phê ưng ý.</p>
                        </div>
                        <div className={styles.usefulCard}>
                            <FaUser className={styles.report_icon} />
                            <h3>Khám phá</h3>
                            <p style={{padding: '0 2rem'}}>Hà Nội nổi tiếng với văn hóa cà phê đa dạng, và chúng tôi tự hào giúp bạn tận hưởng hương vị cà phê độc đáo tại thủ đô. Tìm kiếm những quán cà phê phong cách và thú vị, từ những nơi ấm cúng đến những bữa tiệc cà phê thú vị, tất cả nằm trong tầm tay.</p>
                        </div>
                        <div className={styles.usefulCard}>
                            <FaUser className={styles.report_icon} />
                            <h3>Chia sẻ</h3>
                            <p style={{padding: '0 2rem'}}>Trang web của chúng tôi không chỉ giúp bạn tìm kiếm các quán cà phê nổi tiếng mà còn cho phép bạn chia sẻ khoảnh khắc tuyệt vời. Bạn có thể đăng bài viết, đánh giá quán cà phê, và tạo ra những kỷ niệm đáng nhớ với cà phê. Cùng nhau, hãy khám phá và yêu thương thế giới cà phê tại Hà Nội.</p>
                        </div>
                    </div>


                    <div className={styles.introduction}>
                        <div className={styles.introduction_title}>
                            <h2>Giới thiệu</h2>
                            <p>Trang web tìm kiếm quán coffee số 1</p>
                        </div>
                        <div className={styles.introduction_image}>
                            <img src="/image/intro1.jpg" alt="" className={styles.intro_img}/>
                        </div>
                        <div className={styles.introduction_text + " " + styles.introduction_text1}>
                            <h3>Hà Nội Cà Phê - Thế Giới Cà Phê Tại Đầu Ngón Tay</h3>
                            <p>Chào mừng bạn đến với Hà Nội Cà Phê, nơi tạo cầu nối giữa bạn và thế giới cà phê đa dạng của Hà Nội. Chúng tôi mang đến cho bạn cơ hội khám phá và trải nghiệm những quán cà phê độc đáo và phong cách, từ những nơi ấm cúng đến những bữa tiệc cà phê thú vị. Hãy tham gia cùng chúng tôi và bắt đầu cuộc hành trình thưởng thức cà phê tại thủ đô nhiều hương vị!</p>
                        </div>
                        <div className={styles.introduction_text}>
                            <h3>Khám Phá Cà Phê Hà Nội Cùng Chúng Tôi</h3>
                            <p>Chúng tôi sẵn sàng giúp bạn tìm kiếm những quán cà phê xuất sắc tại thủ đô, cho phép bạn khám phá và tận hưởng hương vị cà phê đặc biệt. Chúng tôi nơi kết nối những người yêu cà phê và những địa điểm độc đáo. Hãy tham gia cùng chúng tôi trong hành trình trải nghiệm cà phê tại Hà Nội!</p>
                        </div>
                        <div className={styles.introduction_image + " " + styles.introduction_image2}>
                            <img src="/image/intro1.jpg" alt="" className={styles.intro_img} />
                        </div>                
                    </div>
                </>
            ) : (
                <div>
                    <div style={{position: "relative"}}>
                        <GiReturnArrow className={styles.iconReturn} 
                            onClick={() => setIsSearch(false)}
                        />
                        <h1 className={styles.titleSearch}>Kết quả tìm kiếm</h1>
                    </div>
                    <br />
                    {listShop.length > 0 ? (
                        <div className={styles.listShop}>
                            {listShop.map((shop, index) => (
                                <CardImage
                                    key={index}
                                    imgName={shop.avatar}
                                    title={shop.username}
                                    address={shop.address}
                                    className={styles.cardImage}
                                    shopId={shop.shop_id}
                                    statusLike={shop.statusLike}
                                    statusSaved={shop.statusSaved} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{textAlign: "center", margin: "3rem"}}>
                            <Empty description={
                                <span>
                                    không có dữ liệu
                                </span>
                            }/>
                        </div>
                    )}

                    <br/>
                </div>
            )}
        </section>
    )
}

export default Home
