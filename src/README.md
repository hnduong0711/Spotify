# Spotify Clone

Một ứng dụng phát nhạc tương tự Spotify được xây dựng bằng **ReactJS** và **Tailwind CSS**. Dự án này mô phỏng các tính năng chính của một nền tảng nghe nhạc, bao gồm phát nhạc, tạo album, xác thực người dùng, quản lý hồ sơ cá nhân và chức năng tìm kiếm. Toàn bộ dữ liệu về bài hát, album, nghệ sĩ và người dùng được lưu trữ và truy xuất từ hệ thống Backend, đảm bảo cung cấp một nguồn dữ liệu phong phú và linh hoạt.

## Mục Lục
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Tính Năng](#tính-năng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Hướng dẫn cài Đặt](#cài-đặt)

## Công Nghệ Sử Dụng
- **ReactJS**: Khung chính để xây dựng giao diện.
- **React Router**: Xử lý định tuyến phía client (`/search`, `/profile`, v.v.).
- **Tailwind CSS**: Tạo kiểu với các lớp tiện ích cho thiết kế responsive.
- **axios**: Dùng để gọi API lấy dữ liệu, thực hiện các thao tác post, put, delete.
- **framer-motion**: Tạo các hiệu ứng chuyển động giúp giao diện trở nên mượt mà hơn.
- **lucide-react**: Biểu tượng cho các nút (ví dụ: phát, thu nhỏ).
- **HTML5 Video**: Phát video MP4 trong thành phần `Player`.
- **Vite**: Công cụ xây dựng cho phát triển nhanh (giả định; điều chỉnh nếu dùng Create React App).

## Tính Năng
- **Phát Nhạc**: Phát các video MP4 với trình phát tùy chỉnh, hỗ trợ phát/tạm dừng, bài tiếp theo/trước đó, điều chỉnh âm lượng và giao diện thu nhỏ/mở rộng.
- **Tạo Album**: Tạo album tùy chỉnh với các bài hát được chọn và hình ảnh, lưu vào hồ sơ người dùng.
- **Tìm Kiếm**: Tìm kiếm bài hát theo tên, hiển thị tất cả bài hát khi không nhập từ khóa.
- **Thiết Kế Responsive**: Giao diện thân thiện với thiết bị di động nhờ Tailwind CSS, bao gồm trình phát thu nhỏ cố định ở dưới cùng.

## Cấu Trúc
```
spotify/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── Login/Login.jsx
│   │   │   ├── Pagination/Pagination.jsx
│   │   │   ├── Sidebar/Sidebar.jsx
│   │   │   ├── SongManagement/SongManagement.jsx
│   │   │   ├── SongModal/SongModal.jsx
│   │   │   ├── UserManagement/UserManagement.jsx
│   │   └── layouts/
│   │       └── AdminLayout.jsx
│   ├── assets/
│   ├── components/
│   │   ├── Footer/Footer.jsx
│   │   ├── Header/Header.jsx
│   │   ├── Layout/Layout.jsx
│   │   ├── Player/Player.jsx
│   │   ├── PlaylistCard
│   │   │   ├── PlaylistCardList.jsx
│   │   │   └── PlaylistCardItem.jsx
│   │   ├── PlaylistDetail/PlaylistDetail.jsx
│   │   ├── ProfileManagement/
│   │   │   ├── AlbumsTab.jsx
│   │   │   ├── ProfileManagement.jsx
│   │   │   ├── ProfileSidebar.jsx
│   │   │   ├── ProfileTab.jsx
│   │   │   └── SongsTab.jsx
│   │   ├── Sidebar/Sidebar.jsx
│   │   └── SongDetail/SongDetail.jsx
│   ├── context/
│   │   ├── Sidebar/Sidebar.jsx
│   │   ├── Sidebar/Sidebar.jsx
│   │   └── SongDetail/SongDetail.jsx
│   ├── pages/
│   │   ├── AuthContext.jsx
│   │   ├── PlayerContext.jsx
│   │   └── ProfileContext.jsx
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md

```

- **components/**: Chứa các thành phần giao diện có thể tái sử dụng trong nhiều trang khác nhau, như thanh điều hướng, trình phát nhạc, thẻ bài hát,...
- **context/**: Chứa cách state cần dùng chung như trình phát nhạc, thông tin người dùng,...
- **pages/**: Bao gồm các thành phần đại diện cho từng trang cụ thể trong ứng dụng, tương ứng với các route như trang chủ, đăng nhập, tìm kiếm,...
- **admin/**: Chứa trang admin để quản lý người dùng, quản lý bài hát,...
- **App.jsx**: Là tệp khởi đầu chính của ứng dụng, nơi thiết lập hệ thống định tuyến và bố cục tổng thể.

## Hướng dẫn cài Đặt
Hướng dẫn cài đặt và chạy dự án trên máy cục bộ.

### Yêu Cầu
- **Node.js**
- **npm** hoặc **yarn**
- Trình duyệt hiện đại (Chrome, Firefox, v.v.)

### Các Bước
1. **Sao Chép Kho Lưu Trữ**:
   Mở folder chứa project:
   ```bash
   git clone https://github.com/hnduong0711/Spotify.git
   cd spotify-clone
   ```

3. **Cài Đặt Các Module đã khai báo**:
   ```bash
   npm install
   ```
   Lệnh này cài đặt các module cho dự án, bao gồm:
   - `react`, `react-dom`
   - `react-router-dom`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `lucide-react`
   - `framer-motion`
   - `axios`

4. **Thiết Lập Tailwind CSS**:
   Đảm bảo file `index.css` được cấu hình:
   ```css
   /* src/index.css */
   @import "tailwindcss";
   @config "../tailwind.config.js";

   Đảm bảo file `vite.config.js`
   /* src/vite.config.js */
   import tailwindcss from '@tailwindcss/vite'
   Trong plugin có tailwindcss()
   plugins: [react(),tailwindcss()]

5. **Chạy Server Phát Triển**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ mở tại `http://localhost:5173`.
