// /src/app.js
const express = require('express');
const mysql = require('mysql2');
const { DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD } = process.env;

// 환경 변수로 MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: DATABASE_URL.split(':')[1].replace('//', ''),  // DATABASE_URL에서 호스트 추출
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: 'pratice_board',  // Docker Compose에서 설정한 데이터베이스 이름
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const app = express();
const port = 3000;

// MySQL 데이터베이스에서 orderlist를 조회하는 쿼리
app.get('/orderlist', async (req, res) => {
    pool.query('SELECT * FROM orderlist', (err, results) => {
        if (err) {
            console.error('쿼리 실행 실패:', err);
            return res.status(500).send('쿼리 실행 실패');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`서버가 http://10.10.20.46:${port}에서 실행 중`);
});

