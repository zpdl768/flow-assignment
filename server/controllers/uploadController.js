const multer = require('multer');
const path = require('path');
const { pool } = require('../config/database');

// Multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// 파일 크기 제한 (10MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('file');

// 파일 확장자 추출 함수
const getFileExtension = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return ext.startsWith('.') ? ext.substring(1) : ext;
};

// 차단된 확장자 목록 가져오기
const getBlockedExtensions = async () => {
  try {
    // 고정 확장자 중 차단된 것들
    const [fixedBlocked] = await pool.query(
      'SELECT name FROM fixed_extensions WHERE is_blocked = TRUE'
    );

    // 모든 커스텀 확장자
    const [customBlocked] = await pool.query(
      'SELECT name FROM custom_extensions'
    );

    return [
      ...fixedBlocked.map(row => row.name.toLowerCase()),
      ...customBlocked.map(row => row.name.toLowerCase())
    ];
  } catch (error) {
    console.error('차단 확장자 조회 오류:', error);
    return [];
  }
};

// 파일 업로드 핸들러
const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: '파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.'
        });
      }
      return res.status(400).json({
        success: false,
        message: '파일 업로드 중 오류가 발생했습니다.'
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.'
      });
    }

    // 파일이 없는 경우
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '파일을 선택해주세요.'
      });
    }

    // 파일 확장자 확인
    const fileExtension = getFileExtension(req.file.originalname);

    // 차단된 확장자 목록 가져오기
    const blockedExtensions = await getBlockedExtensions();

    // 확장자가 차단되었는지 확인
    if (blockedExtensions.includes(fileExtension)) {
      // 업로드된 파일 삭제
      const fs = require('fs');
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: `${fileExtension} 확장자는 업로드할 수 없습니다.`
      });
    }

    // 업로드 성공
    res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        extension: fileExtension
      }
    });
  });
};

module.exports = { uploadFile };
