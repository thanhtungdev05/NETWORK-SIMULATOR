# Bằng chứng gốc — Vigor2927

Thư mục này là BẰNG CHỨNG GỐC, CHỈ ĐỌC (CLAUDE.md mục 2.3).
Không sửa, không xoá, không sắp xếp lại, không "dọn dẹp".

Có ba loại bằng chứng, giá trị pháp lý khác nhau. Dùng sai loại là vi phạm
nguyên tắc 2.1 (không bịa nội dung).

---

## rendered/ — DOM sau khi JavaScript đã chạy

**Đây KHÔNG phải mã nguồn của thiết bị.**

Là ảnh chụp cây DOM tại thời điểm trình duyệt đã tải xong và JavaScript đã
chạy xong. Bản chụp còn bị tiện ích trình duyệt chèn thêm code, nhận ra qua:

- URL `chrome-extension://...`
- thuộc tính `data-yd-*`
- class do AngularJS sinh ra lúc chạy: `ng-scope`, `ng-binding`, ...
- thẻ lạ do extension chèn: `<plasmo-csui>`, ...

So với mã nguồn gốc, bản rendered đã MẤT:

- khai báo `<!DOCTYPE html>`
- thẻ `<title>`
- khối `var webcfg = {...}`
- toàn bộ khối `gWebCfg*`

**Dùng để:** biết trang hiển thị ra sao; biết bảng/danh sách do JavaScript
dựng ra chứa dữ liệu gì.

**KHÔNG dùng làm căn cứ cấu trúc.** Không được lấy tên input, cây DOM, hay
tên hàm JS từ đây rồi coi là bản gốc.

---

## source/ — mã nguồn gốc từ thiết bị

Mã nguồn thật, lấy trực tiếp từ thiết bị, chưa qua trình duyệt xử lý.
Còn nguyên `<!DOCTYPE html>`, `<title>`, `var webcfg = {...}`, các khối
`gWebCfg*`.

**Đây là căn cứ cấu trúc theo nguyên tắc 2.2.** Mọi quyết định về:

- tên file và đường dẫn
- thuộc tính `name`, `id` của input/select/checkbox
- cấu trúc DOM và thứ tự phần tử
- tên hàm JavaScript và tên biến toàn cục

đều phải truy về một file cụ thể trong thư mục này.

---

## har/ — ghi giao tiếp thật giữa trình duyệt và thiết bị

File HAR ghi lại request/response thật.

**Đây là căn cứ hợp đồng response theo nguyên tắc 2.4.** Mọi response giả
lập phải đúng định dạng ghi ở đây. Chưa có HAR cho endpoint nào thì ghi
`ISSUES.md` rồi DỪNG, không tự chế định dạng.

---

## Thư mục phụ

- `raw/` — file json/txt/css/b64 thu kèm lúc crawl, cùng nguồn với `rendered/`,
  cùng mức độ tin cậy (không dùng làm căn cứ cấu trúc).
- `js/` — file JS gốc của thiết bị.
- `screenshots/` — ảnh chụp màn hình.

---

## Bảng tóm tắt

| Thư mục | Là gì | Dùng làm căn cứ cho | Nguyên tắc |
|---------|-------|---------------------|------------|
| `rendered/` | DOM sau khi JS chạy, có nhiễm extension | hiển thị, nội dung bảng do JS dựng | — (KHÔNG dùng cho cấu trúc) |
| `source/` | mã nguồn gốc từ thiết bị | cấu trúc: đường dẫn, DOM, `name`/`id`, tên hàm JS | 2.2 |
| `har/` | giao tiếp thật | định dạng response, method, tham số | 2.4 |
