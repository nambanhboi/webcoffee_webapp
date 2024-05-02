export const api = {
    //user
    GET_USER_DETAIL: "/user/getUserDetail",
    CHANGE_PASS: "/auth/changePassword",
    EDIT_USER_DETAI: "user/editInfoUser",
    
    //SHOP
    GET_LIST_SHOP_SAVED: "/save/getListShopSaved",
    GET_HIGHLIGHT_SHOP: "/shop/getlistHighlightShop",
    GET_LIST_IMAGE: "/shop/getListImage",
    //site
    GET_ALL_PROVINCEID: "/site/getAllProvince",
    GET_ALL_DISTRICT_BY_PROVINCEID: "/site/getAllDistrictByProvinceId",
    GET_ALL_COMMUNE_BY_DISTRICTID: "/site/getAllCommuneByDistrictId",

    //upload
    UPLOAD_AVATAR: "/upload/avatar",
    EDIT_IMAGE: "/upload/editImage",
    UPLOAD_IMG_PRODUCT: "/upload/productImg",

    //product
    GET_ALL_PRODUCT: "/product/getAllProduct",
    ADD_PRODUCT: "/product/addProduct",
    DELETE_PRODUCT_BY_ARRID: "/product/deleteProductByArrId",
    GET_PRODUCT_BY_ID: "/product/getProductById",
    EDIT_PRODUCT: "/product/editProduct",
    ACTIVE_PRODUCT: "/product/activeProduct",
    GET_ALL_SIZE_BY_PRODUCT_ID: "/product/getAllSizeByProductId",

    // cart
    ADD_TO_CART: "/cart/addToCart",
    GET_CART_DETAIL: "/cart/getCartDetail",

    //order
    CREATE_ORDER: "/order/createOrder",
    GET_ALL_ORDER: "/order/getAllOrder",
    TO_STATUS_ORDER: "/order/toStatusOrder",
    GET_ORDER_DETAIL_BY_ID: "/order/getOrderDetailById",
    GET_ALL_ORDER_BY_USER_ID: "/order/getAllOrderByUserId"
}