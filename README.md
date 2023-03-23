# frontend-workflow

Install Gulp global (skip this step if Gulp is already installed)
- npm install gulp -g

1. Install project
- npm install

2. Run project
- npm start

Run project for dev (don't rebuild src)
- npm run dev

Build Production
- npm run build

Note : 
    - Do not edit any files in directory ./build/
    - Edit/Add/Delete data in directory ./src/

-----------------------------------------------------------------

Nếu máy chưa cài Gulp, cài Gulp (4.x) lần đầu.
- npm install gulp -g

1. Cài đặt project lần đầu
- npm install
=> Chỉ cần chạy lần đầu, những lần sau không cần chạy lại. 
Nếu package.json có update package mới thì mới chạy lại để cài bổ sung

2. Chạy project
- npm start
=> lệnh này sẽ build source từ ./src -> ./build, sau khi build thành công nó sẽ chạy server http://localhost:3000/ là ta có thể dev được rồi.
.Lúc này biến môi trường là "dev"

3. Nếu không cần build lại source (tiết kiệm thời gian chờ), chỉ cần chạy server để dev thì chạy lệnh:
- npm run dev
.Lúc này biến môi trường là "dev"

4. Build code cho môi trường chính thức
- npm run build
=> Lệnh này sẽ build source, minify css/js, tối ưu images giúp code gọn nhất để đưa khách hàng.
.Lúc này biến môi trường là "production"

Chú ý : 
 - Toàn bộ dữ liệu trong ./src/assets/ sẽ ko được tối ưu khi build (trừ ./images/), nó sẽ copy toàn bộ sang ./build/html/assets/
 - Không thao tác gì trong thư mục ./build, vì khi chạy lệnh "npm start" hay "npm run build" thì thư mục sẽ bị xóa để build code mới.
 - Khi commit code lên svn/git thì không commit code trong thư mục ./build
 - Khi nhúng Wordpress, sử dụng file css /build/html/assets/css/wordpress-style.min.css (đã tự động đổi đường dẫn image local sang đường dẫn images của WP)








Cấu trúc thư mục scripts và thứ tự nối file:

./gulpfile.js   (file cấu hình (configs.js), file main (index.js) và toàn bộ module task của gulp)
./src 
    |__ /assets/                (toàn bộ thư mục này sẽ được copy qua ./build/html/assets)
        |__ images              
        |__ plugins
    |__ /scripts/ (js sẽ được gom lại theo thứ tự sau)
        |__ /plugins/jquery/    (thư mục này sẽ được load đầu tiên)
        |__ configs.js          (dùng khai báo các biến toàn cục, xài chung)
        |__ /detect/            (load toàn bộ file trong thư mục này, chứa các file detect) 
        |__ /plugins/           (load toàn bộ file trong thư mục này, là các plugin cần sử dụng)
        |__ /function/          (các function dùng chung khai báo trong này, từng file riêng lẻ)
        |__ template.js         (script dùng chung cho tất cả các trang : header, menu smp,.....)
        |__ /pages/             (load cuối cùng, chứa script riêng biệt của từng trang)
    |__ /styles/                (toàn bộ file .scss)
    |__ /views/                 (toàn bộ file .pug)

Chú ý : 
- Hiện tại chức năng scripts chỉ nối toàn bộ file theo thứ tự cấu trúc phía trên :) 
- Toàn bộ các script hay xài sẽ để trong đây, tùy dự án, nếu plugin/script nào ko xài thì thêm "_" phía trước tên file, khi build nó sẽ bỏ qua file đó.
VD : dự án không xài "chart.min.js", bỏ qua không build ra thì đổi tên thành "_chart.min.js"
