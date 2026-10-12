# Frontend Workflow với Gulp + Vite

Workflow này dùng để code giao diện thuần, preview static HTML/CSS/JS/images trong `dist/`, sau đó sync các file cần thiết sang cấu trúc CMS đang chọn như WordPress, EC-CUBE, Lancelot...

## 1. Cài đặt

```sh
pnpm install
```

Nếu chưa có CLI toàn cục:

```sh
npm install -g pnpm gulp-cli
```

## 2. Chạy dev

```sh
pnpm start
```

Lệnh này build trước source vào `dist/`, sau đó chạy watcher + BrowserSync tại:

```txt
https://localhost:4200/
```

Nếu chỉ muốn chạy watcher/server sau khi đã build:

```sh
pnpm dev
```

Vite chạy một watcher incremental cho SCSS/JS trong process Gulp, giữ nguyên các tham số `--plugins`, `--project` và `--cms`. Plugin theo dõi danh sách script để nhận cả file mới/xóa mà không cần restart. Sửa SCSS cập nhật CSS và source map; BrowserSync inject CSS, chỉ reload toàn trang khi nội dung JS thật sự đổi. Source map không tự gây reload. Pug reload sau khi ghi HTML xong. Dev không tự sync CSS/JS sang CMS; watcher images/fonts vẫn gọi sync theo cấu hình CMS.

`gulp watch --dev` chạy cả watcher Gulp và Vite, không khởi động BrowserSync. `gulp css --dev` và `gulp js --dev` cùng dùng pipeline Vite và cập nhật cả CSS/JS.

URL, HTTPS, trình duyệt và đường dẫn chứng chỉ nằm trong `browser_sync` tại `gulp-task/_configs_.js`. Cấu hình HTTPS mặc định cần chứng chỉ trên máy; có thể đặt `use_https: false` để preview bằng HTTP.

## 3. Build và sync CMS

```sh
pnpm build
```

Lệnh này build production đầy đủ rồi sync CSS/JS sang CMS. Nếu `dist/` đã có bản build muốn đưa sang CMS, chỉ cần:

```sh
pnpm sync:cms
```

## 4. Chi tiết build production

Pipeline hiện tại:

- Gulp render `src/views/**/*.pug` thành HTML trong `dist/`.
- Vite build và minify `src/styles/styles.scss` thành `dist/assets/css/styles.min.css`.
- Vite bundle JS legacy/vendor/custom thành `dist/assets/js/bundle.min.js`.
- Gulp concat và minify plugin CSS từ npm/legacy theo cấu hình thành `dist/assets/css/plugins.min.css`.
- Gulp copy images, fonts vào `dist/assets/`.
- Gulp sync CSS/JS sang target CMS theo cấu hình.

## 5. Cấu hình CMS target

Chỉnh trong:

```txt
gulp-task/_configs_.js
```

Các giá trị chính:

```js
const project_name = getArg('project', process.env.PROJECT_NAME || 'wp_themes');
const project_cms = getArg('cms', process.env.CMS || 'wordpress');
```

Có thể truyền qua command:

```sh
gulp build --prod --cms=wordpress --project=wp_themes
```

Mỗi CMS target khai báo `root`, thư mục `css/js/images/fonts`, và mapping file cần copy. Target WordPress hiện copy CSS/JS, mirror fonts (`sync.fonts: true`) và không mirror images. Mirror có thể xóa file ở đích nếu không còn ở source; đặt `fonts: false` nếu cần giữ font CMS riêng. Mỗi project nên chọn rõ images/fonts trong target:

```js
sync: {
    images: true,
    fonts: true,
}
```

## 6. Cấu hình plugin

Plugin được khai báo tại `plugins.registry` trong:

```txt
gulp-task/_configs_.js
```

Mặc định `plugins.active` bật toàn bộ plugin tương đương bộ legacy hiện có. Với project mới, có thể sửa trực tiếp danh sách này hoặc truyền qua command/env:

```sh
gulp build --prod --plugins=jquery,bootstrap,swiper,fancyapps
```

Các plugin có package npm đã được chuyển sang npm dependency và bundle bằng Vite. Chỉ còn `floating-totop-button` và `jquery-zip2` nằm trong `src/assets/plugins/` vì chưa có package npm tương ứng rõ ràng.

## 7. Minify khi compile

Vite tạo `styles.min.css` và `bundle.min.js` với tên cố định. Dev không minify app CSS/JS và giữ source map để debug; plugin CSS do Gulp tạo vẫn được minify. Production bật minify và báo kích thước nén, giữ source map JS. `pnpm build` chạy đầy đủ clean/render/copy/sync.

Với Vite 8.2.2, CSS extract của build IIFE không có map chỉ bằng `build.sourcemap`. Plugin `legacy-css-source-map` bổ sung map SCSS khi dev từ chính preprocessor của Vite; production không chạy bước này.

## 8. Cấu trúc chính

```txt
src/
  views/          Pug templates
  styles/         SCSS source
  scripts/        JS custom
  assets/         images, fonts, vendor plugins
  _cms_/          source CMS dùng để compare/upload
dist/             static build output
gulp-task/        Gulp pipeline
vite.config.mjs   Vite CSS/JS build
```

## 9. Kiểm tra workflow

`pnpm test:workflow` kiểm tra BrowserSync, anchor ở trang con, source map SCSS và watcher thêm/sửa/xóa JS. Test watcher dùng bản sao source trong thư mục tạm. Node 22+ được khuyến nghị. Sau khi đổi build/watch, chạy cả `pnpm build:dev`, `pnpm build` và kiểm tra incremental rebuild.

Khi thay dependency/plugin, cập nhật lockfile cùng manifest và chạy `pnpm install --frozen-lockfile`. Nếu pnpm báo lỗi non-TTY dù dependency đã cài, có thể gọi `node_modules/.bin/gulp.cmd` trực tiếp trên Windows từ repo root.

Các lỗi và nguyên tắc đã xác minh được lưu tại [docs/PROJECT_TROUBLESHOOTING.MD](docs/PROJECT_TROUBLESHOOTING.MD).
