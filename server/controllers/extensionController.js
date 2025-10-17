const { pool } = require('../config/database');

// 고정 확장자 목록 조회
const getFixedExtensions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM fixed_extensions ORDER BY name ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('고정 확장자 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 고정 확장자 차단 상태 변경
const updateFixedExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;

    const [result] = await pool.query(
      'UPDATE fixed_extensions SET is_blocked = ? WHERE id = ?',
      [is_blocked, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '확장자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '확장자 상태가 업데이트되었습니다.' });
  } catch (error) {
    console.error('고정 확장자 업데이트 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 커스텀 확장자 목록 조회
const getCustomExtensions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM custom_extensions ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('커스텀 확장자 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 커스텀 확장자 추가
const addCustomExtension = async (req, res) => {
  try {
    const { name } = req.body;

    // 입력 검증
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: '확장자 이름을 입력해주세요.' });
    }

    // 확장자 이름 정규화 (앞뒤 공백 제거, 소문자 변환)
    const normalizedName = name.trim().toLowerCase();

    // 길이 검증
    if (normalizedName.length === 0) {
      return res.status(400).json({ success: false, message: '확장자 이름을 입력해주세요.' });
    }

    if (normalizedName.length > 20) {
      return res.status(400).json({
        success: false,
        message: `확장자의 최대 길이는 20자리입니다. 현재 ${normalizedName.length}자리`
      });
    }

    // 커스텀 확장자 개수 확인 (최대 200개)
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM custom_extensions');
    if (countResult[0].count >= 200) {
      return res.status(400).json({
        success: false,
        message: '커스텀 확장자 등록은 200개까지만 가능합니다.'
      });
    }

    // 중복 검사 (고정 확장자와 커스텀 확장자 모두 확인)
    const [fixedCheck] = await pool.query(
      'SELECT id FROM fixed_extensions WHERE name = ?',
      [normalizedName]
    );

    if (fixedCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: '해당 확장자는 이미 차단되어 있습니다.'
      });
    }

    const [customCheck] = await pool.query(
      'SELECT id FROM custom_extensions WHERE name = ?',
      [normalizedName]
    );

    if (customCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: '해당 확장자는 이미 차단되어 있습니다.'
      });
    }

    // 커스텀 확장자 추가
    await pool.query(
      'INSERT INTO custom_extensions (name) VALUES (?)',
      [normalizedName]
    );

    res.json({ success: true, message: '커스텀 확장자가 추가되었습니다.' });
  } catch (error) {
    console.error('커스텀 확장자 추가 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 커스텀 확장자 삭제
const deleteCustomExtension = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM custom_extensions WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '확장자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '커스텀 확장자가 삭제되었습니다.' });
  } catch (error) {
    console.error('커스텀 확장자 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 모든 차단된 확장자 조회 (파일 업로드 검증용)
const getAllBlockedExtensions = async (req, res) => {
  try {
    // 고정 확장자 중 차단된 것들
    const [fixedBlocked] = await pool.query(
      'SELECT name FROM fixed_extensions WHERE is_blocked = TRUE'
    );

    // 모든 커스텀 확장자 (커스텀은 추가되면 모두 차단)
    const [customBlocked] = await pool.query(
      'SELECT name FROM custom_extensions'
    );

    const blockedExtensions = [
      ...fixedBlocked.map(row => row.name),
      ...customBlocked.map(row => row.name)
    ];

    res.json({ success: true, data: blockedExtensions });
  } catch (error) {
    console.error('차단 확장자 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  getFixedExtensions,
  updateFixedExtension,
  getCustomExtensions,
  addCustomExtension,
  deleteCustomExtension,
  getAllBlockedExtensions
};
