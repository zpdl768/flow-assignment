// API 기본 URL
const API_BASE_URL = '/api';

// DOM 요소
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadResult = document.getElementById('uploadResult');
const fixedExtensionsContainer = document.getElementById('fixedExtensions');
const customExtensionsContainer = document.getElementById('customExtensions');
const customExtensionInput = document.getElementById('customExtensionInput');
const addCustomBtn = document.getElementById('addCustomBtn');
const customCount = document.getElementById('customCount');
const notification = document.getElementById('notification');

// ===== 유틸리티 함수 =====

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== API 호출 함수 =====

// 고정 확장자 목록 가져오기
async function fetchFixedExtensions() {
    try {
        const response = await fetch(`${API_BASE_URL}/extensions/fixed`);
        const data = await response.json();
        if (data.success) {
            renderFixedExtensions(data.data);
        }
    } catch (error) {
        console.error('고정 확장자 조회 오류:', error);
        showNotification('고정 확장자를 불러오는데 실패했습니다.', 'error');
    }
}

// 고정 확장자 상태 업데이트
async function updateFixedExtension(id, isBlocked) {
    try {
        const response = await fetch(`${API_BASE_URL}/extensions/fixed/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_blocked: isBlocked })
        });
        const data = await response.json();
        if (data.success) {
            showNotification('확장자 설정이 업데이트되었습니다.', 'success');
        }
    } catch (error) {
        console.error('고정 확장자 업데이트 오류:', error);
        showNotification('확장자 설정 업데이트에 실패했습니다.', 'error');
    }
}

// 커스텀 확장자 목록 가져오기
async function fetchCustomExtensions() {
    try {
        const response = await fetch(`${API_BASE_URL}/extensions/custom`);
        const data = await response.json();
        if (data.success) {
            renderCustomExtensions(data.data);
            updateCustomCount(data.count);
        }
    } catch (error) {
        console.error('커스텀 확장자 조회 오류:', error);
        showNotification('커스텀 확장자를 불러오는데 실패했습니다.', 'error');
    }
}

// 커스텀 확장자 추가
async function addCustomExtension(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/extensions/custom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            fetchCustomExtensions(); // 목록 새로고침
            customExtensionInput.value = ''; // 입력 필드 초기화
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('커스텀 확장자 추가 오류:', error);
        showNotification('커스텀 확장자 추가에 실패했습니다.', 'error');
    }
}

// 커스텀 확장자 삭제
async function deleteCustomExtension(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/extensions/custom/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            fetchCustomExtensions(); // 목록 새로고침
        }
    } catch (error) {
        console.error('커스텀 확장자 삭제 오류:', error);
        showNotification('커스텀 확장자 삭제에 실패했습니다.', 'error');
    }
}

// 파일 업로드
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            uploadResult.className = 'upload-result success';
            uploadResult.textContent = `✅ ${data.message} (${file.name})`;
            showNotification('파일 업로드 성공!', 'success');
        } else {
            uploadResult.className = 'upload-result error';
            uploadResult.textContent = `❌ ${data.message}`;
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        uploadResult.className = 'upload-result error';
        uploadResult.textContent = '❌ 파일 업로드 중 오류가 발생했습니다.';
        showNotification('파일 업로드에 실패했습니다.', 'error');
    }
}

// ===== 렌더링 함수 =====

// 고정 확장자 렌더링
function renderFixedExtensions(extensions) {
    fixedExtensionsContainer.innerHTML = extensions.map(ext => `
        <div class="extension-item">
            <input
                type="checkbox"
                id="ext-${ext.id}"
                ${ext.is_blocked ? 'checked' : ''}
                onchange="handleFixedExtensionChange(${ext.id}, this.checked)"
            >
            <label for="ext-${ext.id}">${ext.name}</label>
        </div>
    `).join('');
}

// 커스텀 확장자 렌더링
function renderCustomExtensions(extensions) {
    if (extensions.length === 0) {
        customExtensionsContainer.innerHTML = '<div class="empty-state">등록된 커스텀 확장자가 없습니다.</div>';
        return;
    }

    customExtensionsContainer.innerHTML = extensions.map(ext => `
        <div class="custom-extension-tag">
            ${ext.name}
            <button class="remove-btn" onclick="handleDeleteCustomExtension(${ext.id})">×</button>
        </div>
    `).join('');
}

// 커스텀 확장자 카운트 업데이트
function updateCustomCount(count) {
    customCount.textContent = count;
}

// ===== 이벤트 핸들러 =====

// 고정 확장자 체크박스 변경
function handleFixedExtensionChange(id, isBlocked) {
    updateFixedExtension(id, isBlocked);
}

// 커스텀 확장자 삭제
function handleDeleteCustomExtension(id) {
    if (confirm('이 확장자를 삭제하시겠습니까?')) {
        deleteCustomExtension(id);
    }
}

// 커스텀 확장자 추가 버튼 클릭
addCustomBtn.addEventListener('click', () => {
    const name = customExtensionInput.value.trim();
    if (name) {
        addCustomExtension(name);
    } else {
        showNotification('확장자 이름을 입력해주세요.', 'error');
    }
});

// 커스텀 확장자 입력 필드에서 Enter 키 처리
customExtensionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCustomBtn.click();
    }
});

// ===== 파일 업로드 관련 =====

// 드롭 존 클릭 시 파일 선택
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// 파일 선택 시
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file);
    }
});

// 드래그 오버
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

// 드래그 리브
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

// 파일 드롭
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
        uploadFile(file);
    }
});

// ===== 초기화 =====

// 페이지 로드 시 데이터 불러오기
document.addEventListener('DOMContentLoaded', () => {
    fetchFixedExtensions();
    fetchCustomExtensions();
});
