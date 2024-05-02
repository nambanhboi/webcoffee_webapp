import { urlApi } from "@/constants/config";
import axios from "@/ultils/axios";

import { Card,
Button,
Image } from "@/components/base/index.mjs";
import Link from 'next/link';
import { FiMapPin } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { useState } from "react";
import { useStore } from "@/stores";
function CardProduct({id, imgName, title, description, price, shopId, handleAddToCart}) {
    var {state, showToast} = useStore()
    const [open, setOpen] = useState(false);
    const {Meta} = Card
    
    const handleAddProToCart = () => {
        if(state.isAuth == null) {
            showToast("Vui lòng đăng nhập để tiếp tục!", "info");
            return;
          }
        handleAddToCart(id)
    }
    return (
        <>
            <Card
                style={{ 
                width: '14rem', 
                border: 'none',
                margin: '0.5rem',
                maxWidth: '30%',
                minWidth: '23%',
                textAlign: "center"
            }}
                cover={
                    <Image src={`${urlApi}/uploads/${imgName}`}
                        style={{margin: '0.4rem 0', height: '22rem'}}
                    />
                }
            >
                <Meta        
                    title={title}
                    description={<>
                        <div>{description}</div>
                            <div >{price} đ</div>
                        <div>
                        <Button onClick={handleAddProToCart}>Thêm vào giỏ</Button>
                        </div>
                    </>}
                />
            </Card>
        </>
    )
};

export default CardProduct;
