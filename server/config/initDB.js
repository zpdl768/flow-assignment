const { pool } = require('./database');

/**
 * 데이터베이스 초기화 함수
 * - 테이블 생성 (존재하지 않을 경우)
 * - 초기 데이터 삽입
 */
const initializeDatabase = async () => {
  try {
    console.log('🔧 데이터베이스 초기화 시작...');

    // 고정 확장자 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fixed_extensions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE,
        is_blocked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_blocked (is_blocked)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ fixed_extensions 테이블 생성/확인 완료');

    // 커스텀 확장자 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_extensions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ custom_extensions 테이블 생성/확인 완료');

    // 고정 확장자 초기 데이터 삽입 (중복 시 무시)
    const fixedExtensions = ['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'];

    for (const ext of fixedExtensions) {
      await pool.query(
        `INSERT INTO fixed_extensions (name, is_blocked)
         VALUES (?, FALSE)
         ON DUPLICATE KEY UPDATE name=name`,
        [ext]
      );
    }
    console.log('✅ 고정 확장자 초기 데이터 삽입 완료');

    console.log('🎉 데이터베이스 초기화 완료!');
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error.message);
    // 초기화 실패해도 서버는 계속 실행
    return false;
  }
};

module.exports = { initializeDatabase };
