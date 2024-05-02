import axios from "@/ultils/axios";
import CTable from "@/components/common/CTable";
import { useState, memo, useEffect, useRef } from "react";
import styles from "@/assets/css/ManageUser.module.css";

import { AiOutlineEye } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import ModalAddUser from "./ModalAddUser";
import ModalSeenUser from "./ModalSeenUser";
import { Popconfirm, Button, Tag } from "@/components/base/index.mjs";
import { useStore } from "@/stores/index";
import { TbLockOpen } from "react-icons/tb";
import { TbLock } from "react-icons/tb";


function ManageUser() {   
    const { showToast } = useStore();
    const testRef = useRef(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [
        {
          title: 'Tên tài khoản',
          dataIndex: 'username',
        },
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Quyền',
          dataIndex: 'role',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (tag, record) => (
                <>                
                    <Tag color={tag == 'active' ? 'green' : (tag == 'disable' ? 'volcano' : 'geekblue')} key={tag}>
                        {tag.toUpperCase()}
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
                {record.status == "active" ? (
                     <TbLock 
                        className={styles.iconAction} 
                        onClick={() => handleBlock(id, "disabled")}
                    />
                ) : (
                    <TbLockOpen
                        className={styles.iconAction} 
                        onClick={() => handleBlock(id, "active")}
                     />
                )}           
                
                <Popconfirm
                    title="Xóa người dùng"
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


    const [openSeen, setOpenSeen] = useState(false);
    const [userId, setUserId] = useState('');

    const getData = async () => {
        console.log("get data");
        await axios.get('/user/getAllUser')
        .then(res => {
            var listUser = res.data.result.map(x => ({...x, key: x._id}))
            setData(listUser)
        })
        .catch(err => {
            console.log(err);
        })
    }
    //getData();
    useEffect(() => {
        getData()
    }, [])

    const handleSeen = (id) => {
        console.log("DSD",id);
        setOpenSeen(true);
        setUserId(id);
    }
    const handleBlock = async (id, status) => {
        await axios.post('/user/activeUser', {
            user_id: id,
            status
        })
        .then(res => {
            if(res.data.success) {
                var message = status == "active" ? "Mở khóa thành công!" : "Khóa thành công!";
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
            showToast("Vui lòng chọn người dùng để xóa!", 'error');
            return;
        }
        await axios.post('/user/deleteUserByArrId', arrId)
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
            <h1 style={{textAlign: 'center', margin: '2rem', fontSize: '2rem'}}>Quản lý người dùng</h1>
            <ModalAddUser getData={getData}/>
            <Popconfirm
                    title="Xóa người dùng"
                    description="Bạn có chắc chắn muốn xóa không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => handleDelete(selectedRowKeys)}
                >
                    <Button type="primary" 
                        danger
                        style={{margin: '1rem'}}
                    >
                        Xóa người dùng
                    </Button>
                </Popconfirm>
            <ModalSeenUser userId={userId}
                openSeen={openSeen}
                setOpenSeen={setOpenSeen}
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

export default memo(ManageUser);