const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// 파일 업로드 라우트
router.post('/', uploadController.uploadFile);

module.exports = router;
