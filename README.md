# PAT Motion — bản PWA (cài được lên Android / Windows 11)

6 file đặt ngang hàng ở thư mục gốc repo: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.

## Triển khai lên GitHub Pages
1. Tạo repo mới, ví dụ `pat-motion` (public).
2. Upload đúng 6 file trên vào thư mục gốc của repo (không đặt trong thư mục con).
3. Settings → Pages → Source: branch `main`, thư mục `/ (root)` → Save.
4. Chờ 1–2 phút, mở `https://<username>.github.io/pat-motion/`.
Không cần sửa gì thêm: `start_url` và `scope` dùng đường dẫn tương đối nên chạy đúng ở mọi subpath. Mỗi app cài được nên ở một repo riêng (scope anh em, không lồng nhau); portal không đặt ở repo `<user>.github.io`.

## Kiểm tra
- **Android (Chrome):** mở link → menu 3 chấm → "Cài đặt ứng dụng" / "Thêm vào Màn hình chính". App mở toàn màn hình, không có thanh địa chỉ.
- **Windows 11 (Edge/Chrome):** mở link → biểu tượng "Cài đặt" ở thanh địa chỉ (hoặc menu → Ứng dụng → Cài đặt trang này như một ứng dụng).
- **Lighthouse:** DevTools → Lighthouse → chọn "Progressive Web App" → Analyze.
- Vẫn mở được như file thường: bấm đúp `index.html` (service worker tự bỏ qua khi mở bằng `file://`).

## Cập nhật phiên bản
Chỉ đổi `pat-motion-cache-v1` → `v2` trong `sw.js` và thay nội dung `index.html`. Giữ nguyên `id`, `name`, `start_url`, `scope` và tên file icon.

## Lỗi "Ứng dụng này đã được cài đặt rồi" nhưng không mở được
1. Xuất / sao lưu dữ liệu trong app trước; không bấm các nút đặt lại (Reset).
2. Vào Cài đặt → Ứng dụng, gỡ mục PAT Motion (và portal nếu có).
3. Đóng hẳn Chrome rồi mở lại link.
4. Nếu Chrome vẫn không hiện "Cài đặt ứng dụng": kiểm tra `scope` / `id` theo mục Triển khai (không có app khác trùng scope trên cùng domain).
5. Chỉ khi vẫn kẹt mới xóa dữ liệu Chrome hoặc cài lại Chrome. Cách này xóa luôn localStorage/IndexedDB của mọi app trên domain nên bắt buộc sao lưu trước.

## Ghi chú
- Service worker chỉ cache 6 file tĩnh và thư viện bản đồ maplibre-gl 4.7.1 (jsdelivr). Ô bản đồ, tra độ cao, tìm đường và toàn bộ dữ liệu đo đi thẳng ra mạng / IndexedDB, không bị chặn.
- Bản đồ cần Internet để tải ô bản đồ; số đo, lịch sử và biểu đồ dùng được khi offline.
