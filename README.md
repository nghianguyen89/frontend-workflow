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
http://localhost:4200/
```

Nếu chỉ muốn chạy watcher/server sau khi đã build:

```sh
pnpm dev
```

Trong dev, sửa SCSS chỉ compile `styles.min.css`; BrowserSync inject CSS nên không reload trang. Sửa JavaScript vẫn bundle lại bằng Vite và reload trang như bình thường. Watcher dev không sync file sang CMS.

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

Mỗi CMS target khai báo `root`, thư mục `css/js/images/fonts`, và mapping file cần copy. Mặc định CMS sync chỉ copy CSS/JS để tránh xóa nhầm asset sẵn có trong source CMS. Nếu dự án thật sự cần mirror images/fonts, bật rõ trong target:

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

Vite bundle JavaScript thành `.min.js`; task SCSS dùng Sass + PostCSS để tạo `styles.min.css`. Cả hai đều minify ở dev. `pnpm build` vẫn dùng pipeline production đầy đủ để clean/render/copy/sync toàn bộ asset.

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
