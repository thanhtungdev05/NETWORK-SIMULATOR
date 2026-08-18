# Tracking API — Hướng dẫn tích hợp cho trang web thiết bị

Tài liệu này dành cho **dev phát triển web cấu hình thiết bị** (giao diện mà KTV thao tác).
Mục tiêu: khi KTV hoàn thành một bài lab trên giao diện web, trang web gọi Tracking API để ghi nhận phiên làm lab vào hệ thống, và Dashboard sẽ hiển thị phiên đó (không cần nhập tay, không cần F5).

---

## 1. Luồng dữ liệu tổng quan

```
Trang web cấu hình thiết bị (giao diện KTV)
        │  KTV kết thúc/nộp bài lab
        ▼
POST /api/index.php/tracking/timer   (JSON)
        │
        ▼
api/lib/tracking_handler.php → bảng timer_sessions (Neon Postgres)
        │
        ▼
Dashboard đọc GET /api/index.php/dashboard/all  (poll mỗi 30 giây)
        │
        ▼
"Danh sách bài nộp lab" / "Chi tiết theo KTV" / KPI / Ma trận
```

- Hệ thống chạy trên **port 8080** (`docker compose up --build` / `run_all.py`). Trang web thiết bị và API được serve cùng server nên có thể gọi bằng đường dẫn tương đối `/api/index.php/tracking/timer`.
- Dashboard tự cập nhật mỗi **30 giây** — sau khi gửi tracking thành công, dữ liệu xuất hiện trên dashboard trong tối đa ~30s.

---

## 2. Endpoint

| Method | Path                          | Mô tả                                   |
|--------|-------------------------------|-----------------------------------------|
| POST   | `/api/index.php/tracking/timer` | Ghi nhận 1 phiên làm lab đã kết thúc  |
| GET    | `/api/index.php/tracking/health` | Kiểm tra kết nối (không cần API key)  |

Không có endpoint "bắt đầu" riêng. Toàn bộ là **một POST duy nhất khi phiên kết thúc**; trường `started_at` gửi kèm để server tự tính `duration_sec` nếu không gửi.

### 2.1 Health check
```
GET http://localhost:8080/api/index.php/tracking/health
```
Response 200:
```json
{ "status": "ok", "service": "tracking", "time": "2026-08-10T14:15:00+07:00" }
```

### 2.2 CORS
Đã mở sẵn: `Access-Control-Allow-Origin: *`, chấp nhận preflight `OPTIONS`. Web thiết bị có thể gọi API kể cả khi khác origin.

---

## 3. Xác thực (API key)

- Cách 1 (khuyến nghị): header `X-Tracking-Key: <key>`
- Cách 2: `Authorization: Bearer <key>`

> **Lưu ý:** Key chỉ bắt buộc khi server có cấu hình biến môi trường `TRACKING_API_KEY`. Hiện tại biến này **chưa được đặt** nên request không có key vẫn được chấp nhận. Dev web vẫn nên hỗ trợ gửi header này để sẵn sàng khi bật bảo mật. Nếu đã bật mà gửi thiếu/sai key → HTTP `401 unauthorized`.

---

## 4. Body request (JSON, UTF-8)

Các trường chính và **alias** đều được chấp nhận:

| Trường (chính) | Alias được nhận         | Bắt buộc | Giới hạn | Ý nghĩa                                  |
|----------------|--------------------------|----------|----------|------------------------------------------|
| `technician_id`| `technicianId`           | khuyến nghị | ≤ 50 ký tự | Mã KTV (vd `DEV_TECH_002`)             |
| `name`         | `full_name`, `fullName`  | khuyến nghị | ≤ 100 | Tên KTV                                   |
| `email`        | `mail`                   | tùy chọn | ≤ 100 | Email KTV                                 |
| `lab_id`       | `labId`, `lab`           | **bắt buộc về nghiệp vụ** | ≤ 50 | Tên bài lab — phải khớp chính xác với danh mục (xem mục 6) |
| `mode`         | —                        | tùy chọn | ≤ 30 | `"Thực hành"` hoặc `"Hướng dẫn"`; mặc định `"Thực hành"` |
| `status`       | —                        | tùy chọn | ≤ 30 | `"completed"`, `"failed"` hoặc `"abandoned"`; mặc định `"completed"` |
| `completed_first_try` | `completedFirstTry` | tùy chọn | JSON boolean | Chỉ gửi cho phiên Thực hành `completed` khi simulator có bằng chứng đánh giá; bỏ qua/`null` nếu chưa biết |
| `device`       | `device_model`, `deviceModel` | khuyến nghị | ≤ 100 | Tên thiết bị, phải khớp danh mục thiết bị |
| `duration_sec` | `durationSec`, `duration`| tùy chọn | số nguyên ≥ 0 | Thời gian làm bài (giây). Bỏ qua → server tự tính = `finished_at − started_at` |
| `finished_at`  | `finishedAt`, `end_time` | tùy chọn | ISO 8601 | Thời điểm hoàn thành. Bỏ qua → mặc định là thời điểm server nhận request |
| `started_at`   | `startedAt`              | tùy chọn | ISO 8601 | Thời điểm bắt đầu bài. Dùng để tính duration nếu thiếu `duration_sec` |

**Lưu ý timestamp:** nên gửi theo ISO 8601 kèm múi giờ, ví dụ `"2026-08-10T14:15:00+07:00"`.

### Ví dụ body
```json
{
  "technician_id": "DEV_TECH_002",
  "name": "KTV DEV_TECH_002",
  "email": "devtech002@fpt.com",
  "lab_id": "Bài 1-Cấu hình PPPoE",
  "mode": "Thực hành",
  "status": "completed",
  "completed_first_try": false,
  "device": "AX3000S",
  "started_at": "2026-08-10T14:14:00+07:00",
  "finished_at": "2026-08-10T14:15:00+07:00"
}
```

---

## 5. Response & mã lỗi

**Thành công — HTTP 200:**
```json
{
  "item": {
    "session_id": "TMR_20260810141500_a1b2c3",
    "technician_id": "DEV_TECH_002",
    "name": "KTV DEV_TECH_002",
    "email": "devtech002@fpt.com",
    "finished_at": "2026-08-10T14:15:00+07:00",
    "duration_sec": 60,
    "mode": "Thực hành",
    "device": "AX3000S",
    "device_model": "AX3000S",
    "lab_id": "Bài 1-Cấu hình PPPoE",
    "lab_name": "Bài 1-Cấu hình PPPoE",
    "status": "completed",
    "completed_first_try": false,
    "saved": true
  }
}
```
- `saved: true` mới là thành công thật sự (đã INSERT vào DB).
- `session_id` chính là `id` tự tăng trong bảng `timer_sessions`.

**Thất bại — cấu trúc lỗi chung:** `{ "error": { "code": "...", "message": "..." } }`

| HTTP | code              | Khi nào                                  |
|------|-------------------|------------------------------------------|
| 400  | `bad-request`     | `mode`/`status` không hợp lệ; `duration_sec` sai; first-try không phải JSON boolean hoặc được gửi cho phiên chưa completed |
| 401  | `unauthorized`    | Thiếu/sai API key (chỉ khi đã cấu hình `TRACKING_API_KEY`) |
| 404  | `not-found`       | Sai path endpoint                         |
| 413  | `payload-too-large` | Body quá lớn                           |
| 500  | `db-connect-error`| Không kết nối được DB (xảy ra trong `db()` / khởi tạo session) |
| 500  | `tracking/save-failed` | INSERT/PREPARE phiên thất bại; API không còn nuốt lỗi và trả `saved: false` |

---

## 6. Quy ước nghiệp vụ — QUAN TRỌNG

1. **Gọi đúng 1 lần khi phiên kết thúc.** Gửi `completed` khi đạt, `failed` khi nộp nhưng chưa đạt, `abandoned` khi dừng/bỏ phiên. Không gọi khi lưu từng bước trung gian, không gọi lại nếu phiên đã ghi.
2. **`lab_id` phải lấy từ danh mục bài lab thực tế**, không tự đặt tên. Danh mục nằm trong `devices/*/data.js`:
   - `window.DEVICE_AX3000S.categories[].lessons[].title` → `"Bài 1-Cấu hình PPPoE"`, `"Bài 2-Cấu hình WIFI"`, ...
   - Gửi đúng chuỗi `title` này (kèm dấu và số, đúng UTF-8).
3. **`device` phải khớp tên thiết bị trong danh mục** (`window.DEVICE_AX3000S.name` → `"AX3000S"`).
4. **`mode`:** dùng `"Thực hành"` cho ca được đánh giá, `"Hướng dẫn"` cho buổi hướng dẫn. Hướng dẫn không có kết quả first-try; API sẽ lưu trường này là `NULL`.
   - Phiên `"Hướng dẫn"` vẫn hiện ở **"Danh sách bài nộp lab"** và **"Chi tiết theo KTV"** nhưng **KHÔNG** tính vào các chỉ số đánh giá: *Lab hoàn thành trong kỳ*, *Tỷ lệ hoàn thành*, *Hoàn thành lần đầu*, *Ma trận tiến độ lab theo lớp*, *Ma trận thực hành theo Khu vực/CNx*.
5. **Múi giờ:** bắt buộc gửi timestamp kèm offset (`+07:00`) để dashboard phân nhóm theo ngày cho đúng.

---

## 7. Hướng dẫn tích hợp vào web thiết bị

### 7.1 Khai báo cấu hình + helper (1 lần)

```js
var TRACKING = {
  TIMER_URL: "/api/index.php/tracking/timer",
  TRACKING_API_KEY: "…",            // nếu server bật key
  // Giá trị tĩnh của thiết bị:
  DEVICE: window.DEVICE_AX3000S && window.DEVICE_AX3000S.name || "AX3000S",
};

function sendTrackingTimer(payload) {
  var headers = { "Content-Type": "application/json" };
  if (TRACKING.TRACKING_API_KEY) {
    headers["X-Tracking-Key"] = TRACKING.TRACKING_API_KEY;
  }
  console.log("TRACKING TIMER payload:", payload);

  return fetch(TRACKING.TIMER_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
    keepalive: true, // tránh bị hủy khi chuyển trang ngay sau khi nộp bài
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var ok = data && data.item && data.item.saved === true;
      console.log(ok ? "TRACKING TIMER saved:" : "TRACKING TIMER NOT saved:", data);
      return ok;
    })
    .catch(function (err) {
      console.error("TRACKING TIMER error:", err);
      return false;
    });
}
```

### 7.2 Xây payload động khi KTV bắt đầu làm bài

```js
var sessionStartedAt = null;

function onLessonStarted(lesson) {
  sessionStartedAt = new Date(); // nhớ thời điểm bắt đầu
  // lesson: đối tượng bài học hiện tại (có lesson.title)
  window.currentLesson = lesson;
}

function buildTrackingPayload() {
  var lesson = window.currentLesson;
  var finished = new Date();
  return {
    technician_id: window.currentUser.technicianId,  // mã KTV từ phiên đăng nhập
    name: window.currentUser.fullName,                // tên KTV
    email: window.currentUser.email,
    lab_id: lesson.title,                             // lấy TỪ DANH MỤC, không tự đặt
    mode: "Thực hành",                                // hoặc "Hướng dẫn"
    device: TRACKING.DEVICE,
    started_at: sessionStartedAt.toISOString(),
    finished_at: finished.toISOString(),
    duration_sec: Math.round((finished - sessionStartedAt) / 1000),
  };
}
```

### 7.3 Gắn vào nút hoàn thành bài lab

```js
function onSubmitLab() {
  var payload = buildTrackingPayload();
  return sendTrackingTimer(payload).then(function (ok) {
    if (!ok) alert("Không ghi nhận được phiên làm lab. Vui lòng thử lại.");
    // nộp bài / chuyển trang sau khi đã gửi tracking
  });
}
```

> Khi web thật chưa có thông tin KTV đăng nhập (`technician_id/name/email`), có thể đọc từ cổng xác thực hoặc biến session đã có; nếu chưa có, đặt tạm các giá trị test như file `sim_ax3000s/www/login.html` để xác minh luồng trước.

---

## 8. Kiểm thử nhanh

1. Chạy hệ thống: `CHAY-TAT-CA.bat` (server port 8080).
2. Kiểm tra kết nối:
   ```
   curl http://localhost:8080/api/index.php/tracking/health
   ```
3. Gửi thử 1 phiên (thay nội dung phù hợp):
   ```bash
   curl -X POST http://localhost:8080/api/index.php/tracking/timer \
        -H "Content-Type: application/json" \
        -d "{\"technician_id\":\"DEV_TECH_002\",\"name\":\"KTV DEV_TECH_002\",\"email\":\"devtech002@fpt.com\",\"lab_id\":\"Bài 1-Cấu hình PPPoE\",\"mode\":\"Thực hành\",\"device\":\"AX3000S\",\"started_at\":\"2026-08-10T14:14:00+07:00\",\"finished_at\":\"2026-08-10T14:15:00+07:00\"}"
   ```
4. Mở Dashboard (`http://localhost:8080/dashboard-authen`) — trong ~30 giây phiên vừa gửi xuất hiện trong "Danh sách bài nộp lab" và thống kê của KTV.

---

## 9. Tham khảo nguồn

- Xử lý endpoint: `api/lib/tracking_handler.php` (hàm `handle_tracking`, `verify_tracking_api_key`, `tracking_timer_response`).
- Định tuyến: `api/index.php` (routing `/tracking`) + `api/.htaccess` (rewrite).
- Bảng dữ liệu: migration 007 tạo `timer_sessions`; migration 012–013 bổ sung `user_id`, status, first-try nullable, batch mock và các ràng buộc kết quả.
- Ví dụ gọi từ web: `sim_ax3000s/www/login.html` (đối tượng `TRACKING` + hàm `sendTrackingTimer`).
- Danh mục bài lab & thiết bị: `devices/*/data.js` (vd `window.DEVICE_AX3000S`).
