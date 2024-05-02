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
function CardImage({imgName, title, address, statusLike, shopId, statusSave, maxw}) {
  var {state, showToast} = useStore();
  const {Meta} = Card
    const [StatusLike, setStatusLike] = useState(statusLike);
    const [StatusSave, setStatusSave] = useState(statusSave);
    const handleLike = async () => {
      if(state.isAuth == null) {
        showToast("Vui lòng đăng nhập để tiếp tục!", "info");
        return;
      }
        console.log(shopId);
        await axios.post("/like/likeShop", {shopId})
        .then(res => {
            console.log(res);
            if(res.data.success) {
                setStatusLike(!StatusLike)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleSave = async () => {
      if(state.isAuth == null) {
        showToast("Vui lòng đăng nhập để tiếp tục!", "info");
        return;
      }
        console.log(shopId);
        await axios.post("/save/saveShop", {shopId})
        .then(res => {
            console.log(res);
            if(res.data.success) {
                setStatusSave(!StatusSave)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <Card
        style={{ 
          width: (maxw ? `${maxw}%` :'20rem'), 
          border: 'none',
          margin: '0.5rem',
          maxWidth: (maxw ? `${maxw}%` :'46%'),
          minWidth: '30%',
        textAlign: "center" }}
          cover={
            <Image src={`${urlApi}/uploads/${imgName}`}
                style={{margin: '0.4rem 0', height: '30rem'}}
            />
          }
          actions={[
            <>
              {StatusLike ? <AiFillHeart style={{color: 'red', fontSize: "1.6rem", cursor: "pointer"}} onClick={handleLike}/> : <AiOutlineHeart onClick={handleLike} style={{fontSize: "1.6rem", cursor: "pointer"}}/>} 
            </>,
            <>
              {StatusSave ? <IoBookmark onClick={handleSave} style={{fontSize: "1.6rem", cursor: "pointer"}}/> : <IoBookmarkOutline onClick={handleSave} style={{fontSize: "1.6rem", cursor: "pointer"}}/>}                
            </>,
          ]}
        >
        <Meta
          title={
            (
              <Link href={`/shop/profile/${shopId}`} className="link">
                  {title}              
              </Link>
            )
          }
          description={<>
            <FiMapPin style={{fontSize: "1.6rem", marginRight: "8px"}}/>
            {address != "" ? address : "Chưa cập nhật"}
          </>}
        />
      </Card>
    )
};

export default CardImage;
