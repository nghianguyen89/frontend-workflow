# Frontend-workflow with Gulp task v4

## Nếu máy chưa cài Gulp, cài Gulp (4.x) lần đầu.

> `npm install gulp -g`

## Cài đặt project lần đầu

> `npm install`
>
> - Chỉ cần chạy lần đầu, những lần sau không cần chạy lại. Nếu package.json có update package mới thì mới chạy lại để cài bổ sung.

## Chạy project

> `npm start`
>
> - Lệnh này sẽ build source từ `./src/` -> `./build/`, sau khi build thành công nó sẽ chạy server http://localhost:3000/ là ta có thể dev được rồi.  
> - Lúc này biến môi trường là `dev`

### Nếu không cần build lại source (tiết kiệm thời gian chờ), chỉ cần chạy server để dev thì chạy lệnh:

> `npm run dev`  
> - Lúc này biến môi trường là `dev`

## Build code cho môi trường chính thức

> `npm run build`
> >
> - Lệnh này sẽ build source, minify css/js, tối ưu images giúp code gọn nhất để đưa khách hàng.  
> - Lúc này biến môi trường là `production`

### ***Chú ý :***

> - Toàn bộ dữ liệu trong `./src/assets/` sẽ ko được tối ưu khi build (trừ `./images/`), nó sẽ copy toàn bộ sang `./build/html/assets/`
> - Không thao tác gì trong thư mục `./build/`, vì khi chạy lệnh `npm start` hay `npm run build` thì thư mục sẽ bị xóa để build code mới.
> - Khi commit code lên `svn/git` thì không commit code trong thư mục `./build`
> - Khi nhúng Wordpress, sử dụng file css `/build/html/assets/css/wordpress-style.min.css` (đã tự động đổi đường dẫn image local sang đường dẫn images của WP)


## Cấu trúc thư mục

> **`.vscode/`**  
> |---- `settings.json` : cấu hình vscode của project  
> **`build/`**  
> |---- **`html/`**  : chứa code build từ `src/`  
> **`gulpfile.js/`**  
> |---- `configs.js` : cấu hình Gulp  
> |---- `index.js` : khai báo task  
> |---- `*.js` : toàn bộ module task của Gulp  
> **`src/`**  
> |---- **`assets/`**  
> |-------- **`images/`** : khi chạy lệnh `npm run build` hoặc lệnh có tham số môi trường khác `--dev` thì toàn bộ images trong thư mục này sẽ được tối ưu.   
> |-------- **`plugins/`** : toàn bộ plugin sử dụng để trong thư mục này  
> |---- **`scripts/`** : js files  
> |---- **`styles/`** : scss files  
> |---- **`views/`** : pug files  
