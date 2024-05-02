import axios from '@/ultils/axios';
import styles from '@/assets/css/Profile.module.css';
import { urlApi } from "@/constants/config";
import { api } from '@/constants/api';
import CardImage from "@/components/common/CardImage";
// import CardImageCircle from "../../../components/CardImageCircle";
// import CardImageHover from "../../../components/CardImageHover";
import { useStore, actions } from '@/stores/index';
import ModalEditInfo from './ModalEditInfo';

import { BsTelephone } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { BiBookmark } from 'react-icons/bi';
import { FaTableCells } from 'react-icons/fa6';
import { AiOutlineLeftCircle, AiOutlineRightCircle, AiFillHeart } from 'react-icons/ai';

import { Button, Tabs, Upload, Form, Image, Empty, List } from "@/components/base/index.mjs";
import { useEffect, useState } from "react";
import ModalEditPass from './ModalEditPass';
import { BsCart3 } from "react-icons/bs";

function Profile() {
    const { state, dispatch, showToast } = useStore();
    const { TabPane } = Tabs;
    
    const [column1, setColumn1] = useState([]);
    const [column2, setColumn2] = useState([]);
    const [column3, setColumn3] = useState([]);
    const [styleColumn, setStyleColumn] = useState({});
    const [listImage, setListImage] = useState([]);
    const [listHighlightShopCoffee, setListHighlightShopCoffee] = useState([])

    const [data, setData] = useState({
        address: null,
        avatar: null,
        email: null,
        information: null, 
        listImageName: null,
        phoneNumber: null, 
        username: null,
    });
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditImage, setOpenEditImage] = useState(false); 
    const [openEditPass, setOpenEditPass] = useState(false);

    const [currentIndexSlider, setCurrentIndexSlider] = useState(0);
    const sliderStyle = {
        transform: `translateX(-${currentIndexSlider * 20}rem)`
    }
    const [listShopSaved, setListShopSaved] = useState([]);
    const [listOrder, setListOrder] = useState([]);

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
                setData(res.data.result)
            }
        })
        .catch(err => {
            console.log(err);
        })
        
        await axios.get(api.GET_LIST_SHOP_SAVED)
        .then(res => {
            console.log(res);
            if(res.data.success) {
                setListShopSaved(res.data.result.listSaved);
            }
        })
        .catch(err => {
            console.log(err);
        })

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

    const getListOrder = async () => {
        await axios.get(api.GET_ALL_ORDER_BY_USER_ID)
        .then(res => {
            console.log(res)
            if(res.data.success) {
                setListOrder(res.data.result)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getData();
        getListOrder();
    }, [])
    console.log(data);
    useEffect(() => {
        getData()
    }, [openEditImage, openEdit])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const numOfImages = listShopSaved.length;

            if (width <= 768) {
                setColumn1(listShopSaved.slice(0, Math.floor(numOfImages / 2)));
                setColumn2(listShopSaved.slice(Math.floor(numOfImages / 2)));
                setColumn3([]); // Đảm bảo cột thứ 3 rỗng khi màn hình nhỏ hơn
                setStyleColumn({width: '48%'})
            } else {
                setColumn1(listShopSaved.slice(0, Math.floor(numOfImages / 3)));
                setColumn2(listShopSaved.slice(Math.floor(numOfImages / 3), Math.floor((2 * numOfImages) / 3)));
                setColumn3(listShopSaved.slice(Math.floor((2 * numOfImages) / 3)));
                setStyleColumn({width: '32.6%'})
            }
        };

        handleResize(); // Gọi hàm khi load trang
        window.addEventListener('resize', handleResize); // Thêm sự kiện resize window

        return () => {
            window.removeEventListener('resize', handleResize); // Xóa sự kiện khi component unmount
        };
    }, [listShopSaved]);
    
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
                URL.revokeObjectURL(e.file.originFileObj);
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
                                <Button className={styles.btn_edit} 
                                        onClick={() => setOpenEditPass(true)}
                                    >Đổi mật khẩu</Button>
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
                    </div>
                </div>
                <hr />
                <div className={styles.profile_history + ' containerApp9'}>
                    <Tabs
                        defaultActiveKey="saved"
                        id="fill-tab-example"
                        className="mb-3"
                        variant="underline"                        
                        centered                   
                    >      
                            <TabPane key="saved" tab='Đã lưu'
                                icon={<BiBookmark style={{display: 'inline'}} />}
                            >
                                { listShopSaved.length > 0 ? (                       
                                    <>
                                        <div className={styles.listImage}>
                                            <div className={styles.column1} style={styleColumn}>
                                                {column1 && column1.length > 0 && column1.map((shop, index) => (
                                                    <CardImage key={index}
                                                    imgName={shop.avatar}
                                                    title={shop.username}
                                                    address={shop.address}    
                                                    statusLike={shop.statusLike} 
                                                    statusSave={shop.statusSave}  
                                                    shopId={shop.shopId}
                                                    maxw={100}
                                                />                  
                                                ))}
                                            </div>
                                            <div className={styles.column2} style={styleColumn}>
                                                {column2 && column2.length > 0 && column2.map((shop, index) => (
                                                    <CardImage key={index}
                                                    imgName={shop.avatar}
                                                    title={shop.username}
                                                    address={shop.address}    
                                                    statusLike={shop.statusLike} 
                                                    statusSave={shop.statusSave}  
                                                    shopId={shop.shopId}
                                                    maxw={100}
                                                />
                                                ))}
                                            </div>
                                            <div className={styles.column3} style={column3 && column3.length > 0 ? styleColumn : {}}>
                                                {column3 && column3.length > 0 && column3.map((shop, index) => (
                                                    
                                                    <CardImage key={index}
                                                    imgName={shop.avatar}
                                                    title={shop.username}
                                                    address={shop.address}    
                                                    statusLike={shop.statusLike} 
                                                    statusSave={shop.statusSave}  
                                                    shopId={shop.shopId}
                                                    maxw={100}
                                                />                             
                                                ))}
                                            </div>
                                        </div>
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
                            </TabPane>
                            <TabPane key="ordered" tab='Đơn hàng'
                                icon={<BsCart3 style={{display: 'inline'}} />}
                            >
                                {listOrder ? (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={shop.resultByShopId}
                                        style={{paddingLeft: "3rem"}}
                                        renderItem={(product, idpro) => (
                                    <List.Item key={idpro}
                                    >
                                        <List.Item.Meta
                                            avatar={<>
                                                <Image src={`${urlApi}/uploads/${product.imgNamePro}`}
                                                style={{
                                                    display: "block",
                                                    width: "2rem",
                                                    height: "3rem"
                                                }}/>
                                            </>}
                                            title={product.namePro}
                                            description={
                                                <>
                                                    <Row>
                                                        {product.quantity},
                                                        {product.listSize.find(x => x._id == product.size).sizeName}
                                                    </Row>
                                    
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            /> )  : (
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
                <ModalEditPass openEditPass={openEditPass} setOpenEditPass={setOpenEditPass} /> 
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
export default Profile;