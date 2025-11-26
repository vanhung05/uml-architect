import { UseCaseData } from "./types";

export const DEFAULT_USE_CASE: UseCaseData = {
  name: "Đặt sân bóng",
  actor: "Khách hàng",
  trigger: "Khách hàng bấm vào nút 'Đặt sân' trên trang chủ ứng dụng.",
  preConditions: "- Khách hàng đã đăng nhập vào hệ thống.\n- Hệ thống có kết nối internet ổn định.",
  postConditions: "- Sân được đặt thành công và chuyển trạng thái sang 'Đã đặt'.\n- Hệ thống gửi email/thông báo xác nhận cho khách hàng.",
  basicFlow: "1. Hệ thống hiển thị danh sách các sân và khung giờ còn trống theo ngày hiện tại.\n2. Khách hàng chọn loại sân (Sân 5 hoặc Sân 7).\n3. Khách hàng chọn khung giờ mong muốn.\n4. Hệ thống hiển thị thông tin chi tiết đặt sân (Giá tiền, giờ, tên sân).\n5. Khách hàng xác nhận thông tin.\n6. Hệ thống chuyển sang màn hình thanh toán.\n7. Khách hàng chọn phương thức thanh toán và thanh toán.\n8. Hệ thống xác nhận thanh toán thành công.\n9. Hệ thống tạo vé điện tử và gửi cho khách hàng.",
  alternativeFlow: "A1. Khách hàng chọn bộ lọc tìm kiếm nâng cao (theo khu vực, giá tiền).\nA2. Tại bước 7, khách hàng chọn thanh toán bằng ví điểm tích lũy.",
  exceptionFlow: "E1. Tại bước 3, nếu khung giờ vừa được người khác đặt trước đó, hệ thống thông báo 'Hết sân' và yêu cầu chọn lại.\nE2. Tại bước 8, nếu thanh toán thất bại, hệ thống báo lỗi và cho phép thử lại hoặc chọn phương thức khác."
};