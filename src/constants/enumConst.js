export const enumConst = {
    statusOrder: [
        // người dùng đặt hàng
        { status: "ordered", label: "Đã đặt hàng" },
        // quán xác nhận đơn
        { status: "confirmed", label: "Đã xác nhận" },        
        { status: "pended", label: "Đã xử lý" },
        // quán chuyển trạng thái bên giao hàng đến lấy hàng
        { status: "prepared", label: "Đã chuẩn bị xong" },
        // shop từ chối nhận đơn
        { status: "rejected", label: "Đã từ chối" },
        // bên giao hàng chuyển trạng thái
        { status: "delivery", label: "Đang giao hàng" },
        // bên giao hàng chuyển trạng thái khi giao xong
        { status: "done", label: "Đã hoàn thành" },
        //người dùng hủy
        { status: "cancel", label: "Đã hủy" },
    ]
}
