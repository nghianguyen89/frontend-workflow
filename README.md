# Frontend Workflow với Gulp v5

## 1. Cài đặt PNPM và Gulp

Khuyến khích sử dụng `pnpm` thay cho `npm` để tăng tốc độ và tiết kiệm dung lượng.

Cài đặt toàn cục:
```sh
npm install -g pnpm gulp-cli
```

Nếu gặp lỗi không nhận diện được `gulp`, hãy chạy lại lệnh trên để cài đặt `gulp-cli`.

---

## 2. Cài đặt project

Chạy lệnh sau để cài đặt các package cần thiết:
```sh
pnpm install
```
Chỉ cần chạy khi mới clone hoặc khi có cập nhật trong `package.json`.

---

## 3. Chạy project

Khởi động server dev:
```sh
pnpm start
```
- Source sẽ được build từ `./src/` sang `./build/`.
- Server chạy tại [http://localhost:4200/](http://localhost:4200/).
- Môi trường: `dev`.

Nếu chỉ cần chạy server (không build lại source):
```sh
pnpm dev
```

---

## 4. Build cho môi trường production

Build và tối ưu code:
```sh
pnpm build
```
- Minify CSS/JS, tối ưu hình ảnh.
- Môi trường: `prod`.

---

## Lưu ý

- Dữ liệu trong `./src/assets/` (trừ `images/`) sẽ được copy sang `./build/html/assets/` mà không tối ưu.
- Không chỉnh sửa hoặc commit code trong thư mục `./build/`.
- Khi dùng cho Wordpress, sử dụng file CSS: `/build/html/assets/css/wordpress-style.min.css`.

---

## Cấu trúc thư mục

```
.vscode/           # Cấu hình VSCode cho project
build/html/        # Code đã build từ src/
gulp-task/         # Các task module của gulp
src/
  assets/
    images/        # Ảnh sẽ được tối ưu khi build production
    plugins/       # Các plugin sử dụng
  scripts/         # JS files
  styles/          # SCSS files
  views/           # Pug files
gulpfile.js        # Cấu hình gulp
```