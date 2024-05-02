import axios from "@/ultils/axios";
import CTable from "@/components/common/CTable";
import { useState, memo, useEffect, useRef } from "react";
import styles from "@/assets/css/ManageUser.module.css";

import { AiOutlineEye } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { Popconfirm, Button, Tag, Image } from "@/components/base/index.mjs";
import { useStore } from "@/stores/index";
import { TbLockOpen } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { LuPenSquare } from "react-icons/lu";
import { api } from "@/constants/api";
import { urlApi } from "@/constants/config";
import ModalAddProduct from "./ModalAddProduct";
import ModalSeenProduct from "./ModalSeenProduct";
import ModalEditProduct from "./ModalEditProduct";

function ManageProduct() {   
    const { showToast } = useStore();
    const testRef = useRef(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'imgName',
            render: (tag, record) => (
                <>                
                    <Image src={`${urlApi}/uploads/${tag}`} 
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
                </>
              ),
        },
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
          },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (tag, record) => (
                <>                
                    <Tag color={tag == true ? 'green' : 'volcano'} key={tag}>
                        {tag ? "Còn hàng" : "Hết hàng"}
                    </Tag>
                </>
              ),
        },
        {
          title: 'Thao tác',
          dataIndex: '_id',
          key: 'x',
          render:(id, record) => (
            <div style={{display: 'flex'}}>
                <AiOutlineEye 
                    className={styles.iconAction} 
                    onClick={() => handleSeen(id)}
                />
                <LuPenSquare 
                    className={styles.iconAction} 
                    onClick={() => handleEdit(id)}
                />
                {record.status == true ? (
                     <TbLock 
                        className={styles.iconAction} 
                        onClick={() => handleBlock(id, false)}
                        title="Chuyển trạng thái hết hàng"
                    />
                ) : (
                    <TbLockOpen
                        className={styles.iconAction} 
                        onClick={() => handleBlock(id, true)}
                        title="Chuyển trạng thái còn hàng"
                     />
                )}           
                
                <Popconfirm
                    title="Xóa sản phẩm"
                    description="Bạn có chắc chắn muốn xóa không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => handleDelete([id])}
                >
                    <span>
                        <RiDeleteBin6Line 
                            className={styles.iconAction}                     
                        />          
                    </span>
                </Popconfirm>
            </div>
          ),
        },
    ];
    const [data, setData] = useState([]);
    const [productId, setProductId] = useState(null)
    const [openSeen, setOpenSeen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const getData = async () => {
        console.log("get data");
        await axios.get(api.GET_ALL_PRODUCT)
        .then(res => {
            console.log("res product ", res);
            var listProduct = res.data.result.map(x => ({...x, key: x._id}))
            setData(listProduct)
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const handleSeen = (id) => {
        console.log("DSD",id);
        setOpenSeen(true)
        setProductId(id)
    }
    const handleEdit = (id) => {
        console.log("DSD",id);
        setOpenEdit(true);
        setProductId(id)
    }
    const handleBlock = async (id, status) => {
        await axios.post(api.ACTIVE_PRODUCT, {
            id,
            status
        })
        .then(res => {
            if(res.data.success) {
                var message = "Chuyển trạng thái thành công!";
                showToast(message, "success");
                getData()
            }
        })
        .catch(err => {
            console.log(err);
            showToast("Thất bại!", "error");
        })
    }
    const handleDelete = async (arrId) => {
        console.log("arid: ", arrId);
        if(arrId.length <=0 ) {
            showToast("Vui lòng chọn sản phẩm để xóa!", 'error');
            return;
        }t 
        await axios.post(api.DELETE_PRODUCT_BY_ARRID, arrId)
        .then(res => {
            console.log(res);
            if(res.data.success) {
                showToast("Xóa thành công!", 'success');
                getData();
            }
            else {
                showToast(res.data.message, 'error');

            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <div className="containerApp9">
            <h1 style={{textAlign: 'center', margin: '2rem', fontSize: "2.4rem", fontWeight: '400'}}>Quản lý sản phẩm</h1>
            <ModalAddProduct getData={getData} />          
            <Popconfirm
                    title="Xóa sản phẩm"
                    description="Bạn có chắc chắn muốn xóa không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => handleDelete(selectedRowKeys)}
                >
                    <Button type="primary" 
                        danger
                        style={{margin: '1rem'}}
                    >
                        Xóa sản phẩm
                    </Button>
                </Popconfirm>
            <ModalSeenProduct productId={productId} 
                openSeen={openSeen} 
                setOpenSeen={setOpenSeen}
            />
            <ModalEditProduct productId={productId} 
                openEdit={openEdit} 
                setOpenEdit={setOpenEdit}
                getData={getData}
            />
            <CTable selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                columns={columns}
                data={data}
                setData={setData}
            />
        </div>

    )
}

export default memo(ManageProduct);