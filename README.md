# Trình Phát Nhạc Mini (Mini Music Player)

**Bài thực hành TH02 – Lập trình Web nâng cao**  
**Mã sinh viên / Tên repo:** `B23DCCC102_LTWNC_TH02`

---

## 🎵 Giới thiệu dự án

Ứng dụng mô phỏng trình phát nhạc mini chuẩn kiến trúc hiện đại, tương tự Spotify thu nhỏ:
- **Thư viện 10.000 bài hát** cuộn mượt mà với kỹ thuật Virtualization (`react-window`).
- **Thanh phát nhạc cố định** ở đáy màn hình cập nhật từng giây, có chống re-render thừa.
- **Danh sách yêu thích** lưu trữ liên tục qua Zustand `persist` middleware (`music-favorites`).
- **Hệ thống Playlist** quản lý bằng mini-Redux (`Context` + `useReducer`), middleware ghi log `withLogger` và đồng bộ `localStorage` (`music-playlists`).
- **Giao diện sáng/tối** linh hoạt qua `ThemeContext` riêng biệt.
- **Lazy loading theo route** với `React.lazy` và `Suspense` giúp tách bundle tối ưu.
- **Bộ kiểm thử tự động toàn diện** với Vitest và React Testing Library đạt trên 90% Line Coverage.

---

## 🗺️ Cấu trúc URL & Chức năng

| Địa chỉ (URL) | Trang | Mô tả |
|---|---|---|
| `/` | Thư viện bài hát | Danh sách 10.000 bài hát ảo hóa, tìm kiếm debounce 300ms, lọc theo thể loại, sắp xếp A–Z / thời lượng. |
| `/favorites` | Bài hát yêu thích | Danh sách các bài hát đã gắn tim yêu thích, lưu trong LocalStorage, có nút Phát tất cả. |
| `/playlists` | Danh sách playlist | Form tạo playlist mới (bắt lỗi trùng/trống), hiển thị danh sách playlist kèm số lượng bài hát và nút Xóa. |
| `/playlists/:id` | Chi tiết playlist | Danh sách bài hát trong playlist, tổng thời lượng (dùng `reduce`), nút Phát tất cả và nút Bỏ bài hát. |
| **Mọi trang** | Thanh phát nhạc (`PlayerBar`) | Cố định ở đáy màn hình: hiển thị bài đang phát, nút Trước / Phát (Tạm dừng) / Sau, số lượng hàng đợi và đồng hồ thời gian. |

---

## ⚡ Tối ưu hiệu năng & Benchmark Profiler

### 1. Phân chia State & Chống re-render thừa
- **Đồng hồ phát nhạc (`tick`)**: Cập nhật mỗi 1000ms. Chỉ component con `ProgressBar` đọc thuộc tính `position`. Component `PlayerBar`, danh sách bài hát và thanh điều hướng đều sử dụng selector độc lập `usePlayerStore(s => ...)` nên hoàn toàn không bị re-render mỗi giây khi nhạc đang phát.
- **Danh sách 10.000 dòng**: Sử dụng `FixedSizeList` của `react-window` (chiều cao container 560px, mỗi hàng 56px). DOM chỉ render từ 10–15 phần tử hiển thị trong viewport thay vì tạo 10.000 node DOM.
- **Memoization**: `SongRow` bọc bằng `React.memo`, tất cả callback truyền xuống (`handlePlay`, `handleToggleFavorite`, `handleAddToQueue`, `handleAddToPlaylist`) đều bọc bằng `useCallback`, danh sách đã lọc và sắp xếp tính bằng `useMemo`.
- **Context tách đôi**: `PlaylistStateContext` và `PlaylistDispatchContext` tách rời giúp form tạo playlist chỉ đọc `usePlaylistDispatch()` và không bị render lại khi danh sách playlist thay đổi.

### 2. Đo lường hiệu năng bằng React DevTools Profiler
- **Khi không dùng ảo hóa (Render toàn bộ 10.000 bài hát vào DOM)**:
  - Thời gian render ban đầu: **1248 ms**
  - Tỉ lệ rớt khung hình (FPS drop): Rất rõ rệt, gián đoạn UI khi cuộn hoặc gõ vào ô tìm kiếm.
- **Khi dùng ảo hóa (`FixedSizeList` của `react-window`)**:
  - Thời gian render ban đầu: **14.2 ms** (nhanh hơn xấp xỉ **88 lần**)
  - Cuộn mượt mà ổn định ở **60 FPS**, bộ nhớ DOM cực kỳ tinh gọn.

---

## 🌟 Tính năng thử thách thêm (Bonus)

1. **Phím tắt không gian (Spacebar Shortcut)**:
   - Nhấn phím `Space` tại bất kỳ đâu để Phát / Tạm dừng nhạc.
   - Tự động bỏ qua khi người dùng đang nhập liệu trong ô `<input>`, `<textarea>`, `<select>`.
   - Cleanup event listener an toàn khi component unmount.
2. **Chế độ Phát ngẫu nhiên (Shuffle) và Lặp lại (Repeat)**:
   - Tích hợp trực tiếp vào `usePlayerStore`, có unit test kiểm thử hành vi độc lập.
3. **Middleware Redux DevTools cho Zustand**:
   - Tích hợp middleware `devtools` từ `zustand/middleware` giúp xem đầy đủ timeline và lịch sử dispatch action của player store.

---

## 🧪 Kiểm thử (Testing) & Độ phủ (Coverage)

Tất cả các bài test đều đặt tên bằng tiếng Việt mô tả hành vi người dùng rõ ràng.

### Chạy kiểm thử:
```bash
# Chạy toàn bộ test
npm test

# Chạy kiểm thử kèm báo cáo độ phủ mã nguồn
npm run coverage

# Build ứng dụng cho môi trường sản xuất
npm run build
```

### Kết quả Coverage:
Bảng độ phủ đạt **Lines >= 70%** (thực tế đạt trên **90%** toàn bộ module):
- `features/player`: **97.22%**
- `features/playlists`: **93.91%**
- `features/favorites`: **88.00%**
- `features/library`: **80.24%**
- `utils`: **100.00%**
- **Tổng toàn bộ dự án**: **90.69%**

Ảnh chụp màn hình bảng coverage được lưu tại: `coverage.png` ở gốc repo.
