import axios from '@/ultils/axios';
import styles from '@/assets/css/Profile.module.css';
import { urlApi } from "@/constants/config";
import { api } from '@/constants/api';
import CardImage from "@/components/common/CardImage";
import { useStore, actions } from '@/stores/index';
import ModalEditInfo from '@/components/user/profile/ModalEditInfo';
import ModalEditImage from './ModalEditImage';

import { BsTelephone } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { BiBookmark } from 'react-icons/bi';
import { FaTableCells } from 'react-icons/fa6';
import { AiOutlineLeftCircle, AiOutlineRightCircle, AiFillHeart } from 'react-icons/ai';
import { IoIosTimer } from "react-icons/io";
import { SiCoffeescript } from "react-icons/si";

import { Button, Tabs, Upload, Form, Image, Empty } from "@/components/base/index.mjs";
import { useEffect, useState } from "react";
import CardProduct from '@/components/common/CardProduct';
import ModalAddToCart from '@/components/common/ModalAddToCart';

function ProfileShop() {
    const { state, dispatch, showToast } = useStore();
    const { TabPane } = Tabs;
    
    const [column1, setColumn1] = useState([]);
    const [column2, setColumn2] = useState([]);
    const [column3, setColumn3] = useState([]);
    const [styleColumn, setStyleColumn] = useState({});
    const [listImage, setListImage] = useState([]);
    const [listHighlightShopCoffee, setListHighlightShopCoffee] = useState([]);
    const [listProduct, setListProduct] = useState([]);

    const [data, setData] = useState({
        address: null,
        avatar: null,
        email: null,
        information: null,
        phoneNumber: null, 
        username: null,
        timeOpen: null,
        timeClose: null
    });
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditImage, setOpenEditImage] = useState(false);

    const [openCart, setOpenCart] = useState(false);
    const [productIdToCart, setProductIdToCart] = useState(null);

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
        // get thoong tin chi tiet
        await axios.get(api.GET_USER_DETAIL)
        .then(res => {
            if(res.data.success) {
                console.log("get user detail", res);
                setData(res.data.result);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    const getListImage = async () => {
        //lấy danh sách ảnh
        await axios.get(api.GET_LIST_IMAGE)
        .then(res => {
            if(res.data.success) {
                console.log("get list image", res);
                setListImage(res.data.result)
            }
        })
        .catch(err => {
            console.log(err);
        })
    } 
    const getHightLightShop = async () => {
        // lấy thông tin shop hightlight
        await axios.get(api.GET_HIGHLIGHT_SHOP)
        .then(res => {
            console.log(res)
            if(res.data.success) {
                setListHighlightShopCoffee(res.data.result);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    const getListProduct = async () => {
        //lấy danh sách ảnh
        await axios.get(api.GET_ALL_PRODUCT)
        .then(res => {
            if(res.data.success) {
                console.log("get list product", res);
                setListProduct(res.data.result)
            }
        })
        .catch(err => {
            console.log(err);
        })
    } 

    //getListImage();

    useEffect(() => {
        getData();
        getListImage();
        getHightLightShop();
        getListProduct();
    }, [])
    console.log(data);
    useEffect(() => {
        getData()
    }, [openEdit])

    useEffect(() => {
        getListImage()
    }, [openEditImage])

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
        if(listImage) {

            handleResize(); // Gọi hàm khi load trang
            window.addEventListener('resize', handleResize); // Thêm sự kiện resize window
        
            return () => {
                window.removeEventListener('resize', handleResize); // Xóa sự kiện khi component unmount
            };
        }
        
    }, [listImage]);
    
    //file
    const normFile = async (e) => {
        console.log('Upload event:', e.file);
        const formData = new FormData();
        formData.append('avatar', e.file);
        if(e.file.status == "removed") return;
        await axios.post(api.UPLOAD_AVATAR, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        })
        .then((response) => {
            console.log('File uploaded successfully:', response);
            if(response.data.success) {
                showToast("Thay đổi ảnh đại diện thành công!", "success")
                dispatch(actions.setavatar(response.data.result))
                setData({...data, avatar: response.data.result})
            }
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
            showToast("Ảnh không đúng định dạng!", "error")
            // Handle upload error
        });
        return e?.fileList;
    };
    const [fileList, setFileList] = useState([]);
    const propsFile = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            setFileList([file]);
            console.log(fileList);
            return false;
        },
        fileList,
        maxCount: 1
      };

      const handleAddToCart = (id) => {
        console.log("hsihdi : ", id);
        setProductIdToCart(id);
        setOpenCart(true);
      }

    return (
        <>
            <div className={styles.container_profile}>
                <div className={styles.profile}>
                    <div className={styles.profile_avata}>   
                        <Image src={`${urlApi}/uploads/${data.avatar}`} 
                            alt="avatar"
                            className={styles.img_avata}
                            style={{
                                margin: '0.4rem 0',
                                width: '10rem',
                                height: '10rem'
                            }}
                            preview={{
                                maskClassName: styles.preAvatar
                            }}
                        />
                        {data.username && (
                            <Form>
                                <Form.Item
                                    name={'avatar'}
                                    label="Ảnh đại diện"
                                    getValueFromEvent={normFile}
                                >
                                    <Upload {...propsFile}>
                                        <Button >Tải lên</Button>
                                    </Upload>
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                    <div className={styles.profile_right}>
                        <div className={styles.profile_right1}>
                            <div className={styles.name}>
                                {data.username}
                            </div>                            
                            <>
                                <Button className={styles.btn_edit}
                                    onClick={() => setOpenEdit(true)}
                                >Sửa Thông tin</Button>
                            </>                            
                        </div>
                        <div className={styles.profile_story}>
                            <BsTelephone className={styles.profile_site_icon}/>
                            {data.phoneNumber ?? "Chưa cập nhật"}
                        </div>
                        <div className={styles.profile_site}>
                            <FiMapPin className={styles.profile_site_icon} /> 
                            {data.address ?? "Chưa cập nhật"}
                        </div>
                        <div className={styles.profile_site}>
                            <IoIosTimer className={styles.profile_site_icon} /> 
                            {data.timeOpen ?? "Chưa cập nhật"} : {data.timeClose ?? "Chưa cập nhật"}
                        </div>
                    </div>
                </div>
                <div className={styles.intro}>
                    <h2 >Thông tin giới thiệu</h2>
                    <p className={styles.intro_p}>{data.information ?? "Chưa cập nhật"}</p>
                </div>
                <hr />
                
                <div className={styles.profile_history + ' containerApp9'}>
                    <Tabs
                        defaultActiveKey="product"
                        id="fill-tab-example"
                        className="mb-3"
                        variant="underline"                        
                        centered                   
                    >      
                        <TabPane key="saved" tab='Đã đăng'
                            icon={<BiBookmark style={{display: 'inline'}} />}
                        >
                            <Button className={styles.btn_edit}
                                onClick={() => setOpenEditImage(true)}
                            >Sửa ảnh</Button>
                            {listImage && listImage.length > 0 ? (
                                <div className={styles.listImage}>
                                    <div className={styles.column1} style={styleColumn}>
                                        {column1 && column1.length > 0 && column1.map((imgName, index) => (
                                            <>
                                                <Image src={`${urlApi}/uploads/${imgName}`}
                                                    style={{margin: '0.4rem 0'}}
                                                    key={index}
                                                />
                                            </>
                                        ))}
                                    </div>
                                    <div className={styles.column2} style={styleColumn}>
                                        {column2 && column2.length > 0 && column2.map((imgName, index) => (
                                            <>
                                                <Image src={`${urlApi}/uploads/${imgName}`}
                                                    style={{margin: '0.4rem 0'}}
                                                    key={index}
                                                />
                                            </>
                                        ))}
                                    </div>
                                    <div className={styles.column3} style={column3 && column3.length > 0 ? styleColumn : {}}>
                                        {column3 && column3.length > 0 && column3.map((imgName, index) => (
                                            <>
                                                <Image src={`${urlApi}/uploads/${imgName}`}
                                                    style={{margin: '0.4rem 0'}}
                                                    key={index}
                                                />
                                            </>
                                        ))}
                                    </div>
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
                        </TabPane>
                        <TabPane key="product" tab='Sản phẩm'
                            icon={<SiCoffeescript style={{display: 'inline'}} />}
                        >
                            {listProduct.length > 0 ? (
                                <div className={styles.listProduct}>
                                    {listProduct.map((product, index) => (                           
                                        <CardProduct key={index}
                                            imgName={product.imgName}
                                            title={product.name}
                                            description={product.description}    
                                            id={product._id} 
                                            statusSave={product.statusSave}  
                                            shopId={product.shopId}
                                            price={product.priceShow}
                                            handleAddToCart={handleAddToCart}
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
                        </TabPane>
                    </Tabs>
                </div>
                <ModalEditInfo openEdit={openEdit} setOpenEdit={setOpenEdit} />              
                <ModalEditImage openEditImage={openEditImage} setOpenEditImage={setOpenEditImage} listImage={listImage} />
                <ModalAddToCart open={openCart} setOpen={setOpenCart} productId={productIdToCart}/>
                <div className={styles.highlightCoffee }>
                <div style={{marginTop: '3rem'}}>
                    <h2 className={styles.titleh2}>Các quán coffee nổi bật</h2>
                </div>


                {listHighlightShopCoffee.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    <div style={{textAlign: "center", margin: "3rem"}}>
                        <Empty description={
                            <span>
                                không có dữ liệu
                            </span>
                        }/>
                    </div>
                )}
            </div>
            </div>
        </>
    )
};
export default ProfileShop;