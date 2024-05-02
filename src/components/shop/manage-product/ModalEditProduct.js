import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Upload, Image, Card, Space } from '@/components/base/index.mjs';
import styles from '@/assets/css/Profile.module.css';
import { useStore } from '@/stores/index';
import axios from '@/ultils/axios';
import { api } from '@/constants/api';
import { IoCloseCircleOutline } from "react-icons/io5";
import { urlApi } from '@/constants/config';
function ModalEditProduct({getData, openEdit, setOpenEdit, productId}) {
    const { showToast } = useStore();
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
        span: 8,
        },
        wrapperCol: {
        span: 16,
        },
    };

    const validateMessages = {
        required: '${label} là bắt buộc!',
    };
    const { Option } = Select;

    const [srcImg, setSrcImg] = useState(null);
    const [formDataUpload, setformDataUpload] = useState(null);

    const onRoleChange = () => {

    }

    
    const rules = {
        required: [
            {
                required: true,
            }
        ],
        
        username: [{ required: true }],
    };
    
    
    const onFinish = async (values) => {
        console.log(values);         
        if(values) {
            values.isChangeImage = isChangeImage;
            values.id = productId; 
            // add san pham
            await axios.post(api.EDIT_PRODUCT, values)
            .then(async res => {
                if(res.data.success) {
                    showToast("Lưu thành công!", 'success');                  
                    if(isChangeImage) {
                        await uploadImg(productId);
                    }
                    await getData();
                    form.resetFields();
                    setOpenEdit(false);
                }
                else {
                    showToast(res.data.message, 'error')
                }
            })
            .catch((err) => {
                console.log(err);
                showToast("Lưu thất bại!", 'error')
            })     
            
            
        }

    };

    const uploadImg = async (id) => {
        // upload anhr
        setformDataUpload(formDataUpload.append('id', id))
        await axios.post(api.UPLOAD_IMG_PRODUCT, formDataUpload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log('File uploaded successfully:', response);
            if(response.data.success) {
                showToast("Thêm ảnh thành công!", "success")
            }
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
            // Handle upload error
        });
    }


    //file
    const normFile = async (e) => {
        console.log('Upload event:', e.file);
        const formData = new FormData();
        formData.append('productImg', e.file);
        setformDataUpload(formData)
        if(e.file.status == "removed") {
            setformDataUpload(null);
            return;
        }
        setSrcImg(URL.createObjectURL(e.file));
        return e?.fileList;
    };
    const [fileList, setFileList] = useState([]);
    const propsFile = {
        onRemove: () => {
            setFileList([])
            setSrcImg(null);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            console.log(fileList);
            setSrcImg(URL.createObjectURL(file));
            return false;
        },
        fileList,
        maxCount: 1
    };

    const [isChangeImage, setIsChangeImage] = useState(false);
    const handleChangImage = () => {
        setIsChangeImage(true);
        setSrcImg(null);
    }

    useEffect(()=>{
        form.setFieldsValue({})
        setSrcImg(null)
        setIsChangeImage(false);
        const fetchData = async () => {
            if(productId) {
                await axios.get(`${api.GET_PRODUCT_BY_ID}?id=${productId}`)
                .then(res => {
                    console.log("sds",res);
                    form.setFieldsValue(res.data.result)
                    setSrcImg(`${urlApi}/uploads/${res.data.result.imgName}`)
                }) 
                .catch(err => {
                    console.log(err);
                })
            }
        };
        fetchData();
        
    }, [productId, openEdit]);

    return (
        <>
            <Modal
                title="Sửa sản phẩm"
                centered
                open={openEdit}
                onOk={() => {}}
                okText="Lưu"
                onCancel={() => setOpenEdit(false)}
                cancelText="Thoát"
                width={1000}
                okButtonProps={{ form: 'formAdd', key: 'submit', htmlType: 'submit' }}
            >
                <Form
                    form={form}
                    {...layout}
                    name="formAdd"
                    onFinish={onFinish}
                    style={{
                        maxWidth: 800,
                    }}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name={'productImg'}
                        label="Ảnh sản phẩm"
                        getValueFromEvent={normFile}
                        rules={isChangeImage ? rules.required : null}
                    >
                        {!isChangeImage ? (
                            <>
                                <Button onClick={handleChangImage}>Thay đổi ảnh</Button>
                            </>

                        ) : (
                            <>
                                <Upload {...propsFile} >
                                    <Button >Tải lên</Button>
                                </Upload>
                            </>
                        )}
                        {srcImg && (
                            <Image src={srcImg} 
                                alt="ảnh sản phẩm"                               
                                style={{
                                    margin: '0.4rem 0',
                                    width: '10rem',
                                    height: '10rem'
                                }}
                                preview
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        name='name'
                        label="Tên sản phẩm"
                        rules={rules.required}
                    >
                        <Input placeholder="Nhập tên sản phẩm"/>
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label="Mô tả"
                        rules={rules.required}
                    >
                        <Input placeholder="Nhập mô tả"/>
                    </Form.Item>
                    <Form.Item
                        name='listSize'
                        label="Kích cỡ"
                        rules={rules.required}
                    >
                        <Form.List name='listSize'>
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                    }}
                                    align="baseline"
                                >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'sizeName']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn size',
                                    },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn kích cỡ"
                                        onChange={onRoleChange}
                                        allowClear
                                    >
                                        <Option value="S">Size S</Option>
                                        <Option value="M">Size M</Option>
                                        <Option value="L">Size L</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Giá bán',
                                    },
                                    ]}
                                >
                                    <Input placeholder="Nhập giá bán" type="number" />
                                </Form.Item>
                                <IoCloseCircleOutline onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()}>
                                    + Thêm kích cỡ
                                </Button>
                            </Form.Item>
                            </>
                        )}
                        </Form.List>
                    </Form.Item>
                    
                    
                </Form>
            </Modal>
        </>
    );
};
export default ModalEditProduct;