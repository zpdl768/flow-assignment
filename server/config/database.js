const mysql = require('mysql2');
require('dotenv').config();

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'file_upload_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise 기반 pool 사용
const promisePool = pool.promise();

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL 데이터베이스 연결 성공');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error.message);
    return false;
  }
};

module.exports = { pool: promisePool, testConnection };
