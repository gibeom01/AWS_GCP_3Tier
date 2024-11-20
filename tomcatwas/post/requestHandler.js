const fs = require('fs');
const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // MySQL 사용자 이름
    password: 'root',    // MySQL 비밀번호
    database: 'pratice_board' // 사용할 데이터베이스 이름
});

// HTML 파일 읽기
const main_view = fs.readFileSync('./tomcat/post/main.html', 'utf-8');
const orderlist_view = fs.readFileSync('./tomcat/webapps/ROOT/orderlist.html', 'utf-8');

// 메인 페이지 처리
function main(response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(main_view); // 메인 HTML 페이지 반환
    response.end();
}

// 주문 목록 페이지 처리
function orderList(response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });

    // MySQL에서 쿼리 실행
    connection.query('SELECT product_id, order_date FROM orderlist', (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            response.write("<h2>Error retrieving order list</h2>");
            response.end();
            return;
        }

        // 쿼리 결과를 테이블로 출력
        response.write(orderlist_view);
        response.write("<table border='1'><tr><th>Product ID</th><th>Order Date</th></tr>");
        rows.forEach(element => {
            response.write("<tr><td>" + element.product_id + "</td><td>" + element.order_date + "</td></tr>");
        });
        response.write("</table>");
        response.end();
    });
}

// 라우팅 설정
exports.handle = {
    '/': main,           // '/' 요청 시 메인 페이지 반환
    '/orderlist': orderList // '/orderlist' 요청 시 주문 목록 반환
};
