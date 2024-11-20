// /src/db/dbConnection.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pratice_board',
    connectionLimit: 5
});

async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('MariaDB에 연결됨');
        return conn;
    } catch (err) {
        console.error('연결 오류: ', err);
        throw err;
    }
}

async function executeQuery(query, params = []) {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.query(query, params);
        return result;
    } catch (err) {
        console.error('쿼리 실행 오류: ', err);
        throw err;
    } finally {
        if (conn) conn.end(); // 연결을 풀로 반환
    }
}

module.exports = { pool, executeQuery };
