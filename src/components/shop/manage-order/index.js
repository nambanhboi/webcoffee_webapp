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
import { enumConst } from "@/constants/enumConst";
import { FaTimesCircle } from 'react-icons/fa';
import { IoMdCheckboxOutline } from "react-icons/io";
import { FaHouseCircleCheck } from "react-icons/fa6";
import ModalSeenOrder from "./ModalSeenOrder";
function ManageOrder() {   
    const { showToast } = useStore();
    const testRef = useRef(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'time'
        },
        {
          title: 'Tên khách hàng',
          dataIndex: 'username',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (tag, record) => (
                <>                
                    <Tag color={tag == "rejected" ?  'volcano' : 'green'} key={tag}>
                        {enumConst.statusOrder.find(x => x.status == tag).label}
                    </Tag>
                </>
              ),
        },
        {
          title: 'Thao tác',
          dataIndex: 'id',
          key: 'x',
          render:(id, record) => (
            <div style={{display: 'flex'}}>
                <AiOutlineEye 
                    title="Xem chi tiết đơn hàng"
                    className={styles.iconAction} 
                    onClick={() => handleSeen(id)}
                />
                {record.status == "ordered" ? (
                     <>
                        <Popconfirm
                            title="Xác nhận đơn hàng"
                            description="Bạn có chắc chắn muốn xác nhận không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => handleToStatus(id, "confirmed")}
                        >
                            <span>
                            <IoMdCheckboxOutline
                            title="Xác nhận đơn hàng"
                                className={styles.iconAction} 
                            />          
                            </span>
                        </Popconfirm>
                        <Popconfirm
                            title="Từ chối đơn hàng"
                            description="Bạn có chắc chắn muốn từ chối không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => handleToStatus(id, "rejected")}
                        >
                            <span>
                            <FaTimesCircle
                                title="Từ chối đơn hàng"
                                className={styles.iconAction} 
                            />          
                            </span>
                        </Popconfirm>
                     </>
                    
                ) : (record.status == "confirmed" ? (
                    <Popconfirm
                            title="Chuẩn bị xong đơn hàng"
                            description="Bạn có chắc chắn muốn xác nhận không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => handleToStatus(id, "prepared")}
                        >
                            <span>
                            <FaHouseCircleCheck
                                title="Chuẩn bị xong đơn hàng"
                                className={styles.iconAction} 
                            />          
                            </span>
                        </Popconfirm>
                ) : (<></>))}           
            </div>
          ),
        },
    ];
    const [data, setData] = useState([]);
    const [orderId, setOrderId] = useState(null)
    const [openSeen, setOpenSeen] = useState(false);

    const getData = async () => {
        console.log("get data");
        await axios.get(api.GET_ALL_ORDER)
        .then(res => {
            console.log("res order ", res);
            var listOrder = res.data.result.map(x => ({...x, key: x._id}))
            setData(listOrder)
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
        setOrderId(id)
    }
    const handleToStatus = async (id, status) => {
        await axios.post(api.TO_STATUS_ORDER, {
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
    
    return (
        <div className="containerApp9">
            <h1 style={{textAlign: 'center', margin: '2rem', fontSize: "2.4rem", fontWeight: '400'}}>Quản lý đơn hàng</h1>           
            <CTable selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                columns={columns}
                data={data}
                setData={setData}
            />
            <ModalSeenOrder orderId={orderId} 
                openSeen={openSeen} 
                setOpenSeen={setOpenSeen}
            />
        </div>

    )
}

export default memo(ManageOrder);