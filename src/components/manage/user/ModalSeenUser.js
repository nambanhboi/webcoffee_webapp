import React, { memo, useEffect, useState } from 'react';
import { Button, Modal, Row, Col, Input } from '@/components/base/index.mjs';

import axios from '@/ultils/axios';
const ModalSeenUser = ({ userId, openSeen, setOpenSeen }) => {
    const rowLabel = [
        { label: "Tên tài khoản", value: "username"},
        { label: "Email", value: "email"},
        { label: "Phân quyền", value: "roles"},
        { label: "Địa chỉ", value: "address"},
        { label: "Địa chỉ chi tiết", value: "addressDetail"},
        { label: "Số điện thoại", value: "phoneNumber"},
        { label: "Thông tin", value: "information"},
    ]
    const [rowData, setRowdata] = useState({})


    useEffect(()=>{

        if(userId) {
            axios.get(`/user/getUserById/${userId}`)
            .then(res => {
                console.log(res);
                setRowdata(res.data.result)
            }) 
            .catch(err => {
                console.log(err);
            })
        }
        
    }, [userId]);
    return (
        <>
            <Modal
                title="Thông tin người dùng"
                centered
                open={openSeen}
                onOk={() => setOpenSeen(false)}
                onCancel={() => setOpenSeen(false)}
                width={700}
                okButtonProps={{ style: {display: 'none'}}}
                cancelText="Thoát"
            >
                {rowLabel.map((item, index) => (
                    <Row key={index} style={{margin: '0.5rem 0'}}>
                        <Col span={6}
                            style={{fontWeight: '500'}}
                        >{item.label}</Col>
                        <Col span={18}>{rowData[item.value]}</Col>
                    </Row>
                ))}
            </Modal>
        </>
    );
};
export default ModalSeenUser;