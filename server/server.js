const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { initializeDatabase } = require('./config/initDB');
const extensionsRouter = require('./routes/extensions');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (프론트엔드)
app.use(express.static(path.join(__dirname, '../public')));

// API 라우트
app.use('/api/extensions', extensionsRouter);
app.use('/api/upload', uploadRouter);

// 루트 경로
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({ success: false, message: '요청한 경로를 찾을 수 없습니다.' });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err.stack);
  res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('⚠️  데이터베이스 연결에 실패했습니다. .env 파일을 확인하세요.');
      console.log('ℹ️  서버는 시작되지만 데이터베이스 기능은 사용할 수 없습니다.');
    } else {
      // 데이터베이스 초기화 (테이블 생성 및 초기 데이터 삽입)
      await initializeDatabase();
    }

    // 서버 시작
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📂 http://localhost:${PORT}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
