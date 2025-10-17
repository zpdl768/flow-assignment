const express = require('express');
const router = express.Router();
const extensionController = require('../controllers/extensionController');

// 고정 확장자 관련 라우트
router.get('/fixed', extensionController.getFixedExtensions);
router.put('/fixed/:id', extensionController.updateFixedExtension);

// 커스텀 확장자 관련 라우트
router.get('/custom', extensionController.getCustomExtensions);
router.post('/custom', extensionController.addCustomExtension);
router.delete('/custom/:id', extensionController.deleteCustomExtension);

// 모든 차단된 확장자 조회
router.get('/blocked', extensionController.getAllBlockedExtensions);

module.exports = router;
