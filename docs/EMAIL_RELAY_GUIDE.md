# Hướng Dẫn Cấu Hình HTTPS Email Relay (Dành Cho Render Cloud)

## 1. Bối Cảnh & Vấn Đề
- Trên các hosting đám mây miễn phí như **Render Cloud Free Tier**, toàn bộ cổng SMTP ra ngoài (`25`, `465`, `587`) đều bị chặn bởi tường lửa để phòng chống spam.
- Chỉ có cổng **443 (HTTPS)** là luôn mở 100%.
- Để hệ thống trên Render Cloud có thể gửi email nhắc nhở học viên và mã OTP xác thực mà không cần nâng cấp gói trả phí, hệ thống hỗ trợ gửi qua **HTTPS Relay Webhook** bằng **Google Apps Script** (chạy trên chính tài khoản Gmail của bạn, miễn phí 100%).

---

## 2. Các Bước Thiết Lập Trong 60 Giây

### Bước 1: Mở Google Apps Script
- Truy cập: [https://script.google.com](https://script.google.com)
- Đăng nhập bằng tài khoản Gmail của bạn (ví dụ: `dtung2788@gmail.com`).
- Bấm vào nút **Dự án mới (New project)** ở góc trên bên trái.

### Bước 2: Dán Mã Nguồn Xử Lý
Xóa toàn bộ mã mặc định có trong trình soạn thảo, sau đó sao chép và dán đoạn mã sau:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    GmailApp.sendEmail(data.to, data.subject, data.text || "", {
      htmlBody: data.html,
      name: data.fromName || "Hệ Thống Thực Hành Mạng UTH"
    });
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      message: "Email sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Bước 3: Triển Khai Web App
1. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng bên cạnh mục *Chọn loại* $\rightarrow$ Chọn **Ứng dụng web (Web App)**.
3. Cấu hình:
   - **Mô tả:** `UTH NetLab Email Relay`
   - **Thực thi dưới dạng (Execute as):** `Tôi (email của bạn)`
   - **Người có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)`
4. Bấm nút **Triển khai (Deploy)**.
5. Google sẽ hiện hộp thoại yêu cầu cấp quyền:
   - Bấm **Ủy quyền truy cập (Authorize access)**.
   - Chọn tài khoản Google của bạn.
   - Bấm **Nâng cao (Advanced)** $\rightarrow$ Bấm **Đi tới Dự án không có tiêu đề (không an toàn)**.
   - Bấm **Cho phép (Allow)**.
6. Sao chép đường dẫn **URL của ứng dụng web** (có định dạng: `https://script.google.com/macros/s/AKfycb.../exec`).

### Bước 4: Cấu Hình Biến Môi Trường Trên Render
1. Mở [Dashboard Render](https://dashboard.render.com).
2. Chọn Web Service của bạn (`network-simulator-1`).
3. Chuyển sang mục **Environment**.
4. Thêm biến môi trường mới:
   - **Key:** `EMAIL_RELAY_URL`
   - **Value:** *(Dán đường link Web App bạn đã sao chép ở Bước 3)*
5. Bấm **Save Changes**.

---

## 3. Hoạt Động Của Hệ Thống

| Môi Trường | Phương Thức Gửi | Trạng Thái |
| :--- | :--- | :--- |
| **Localhost (Máy tính cá nhân)** | SMTP trực tiếp qua cổng `465 SSL` hoặc `587 TLS` | ✅ Thành công 100% (không bị chặn) |
| **Render Cloud (Đã cấu hình `EMAIL_RELAY_URL`)** | Gửi qua Google Apps Script Web App (HTTPS port `443`) | ✅ Thành công 100% (vượt tường lửa Render) |
| **Render Cloud (Chưa cấu hình `EMAIL_RELAY_URL`)** | Thử SMTP direct qua cổng `465/587` | ⚠️ Bị tường lửa gói Free chặn; Chatbot báo lỗi rõ ràng |
