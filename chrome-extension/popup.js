// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const statusMessage = document.getElementById('statusMessage');
const statusSection = document.getElementById('statusSection');

let selectedFile = null;

// 监听文件选择
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        fileName.textContent = file.name;
        uploadBtn.disabled = false;
        
        // 显示文件大小
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        fileName.textContent = `${file.name} (${sizeInMB} MB)`;
    } else {
        selectedFile = null;
        fileName.textContent = '未选择文件';
        uploadBtn.disabled = true;
    }
    // 清空之前的状态信息
    statusMessage.textContent = '';
    statusSection.className = 'status-section';
});

// 监听上传按钮点击
uploadBtn.addEventListener('click', async function() {
    if (!selectedFile) {
        showStatus('请先选择文件', 'error');
        return;
    }
    
    // 禁用按钮，防止重复点击
    uploadBtn.disabled = true;
    uploadBtn.textContent = '上传中...';
    
    try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // 发送POST请求
        const response = await fetch('http://localhost:19666/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            // 上传成功
            const sizeInMB = (result.filesize / (1024 * 1024)).toFixed(2);
            showStatus(
                `上传成功！\n文件名: ${result.filename}\n大小: ${sizeInMB} MB`,
                'success'
            );
            
            // 重置表单
            fileInput.value = '';
            selectedFile = null;
            fileName.textContent = '未选择文件';
        } else {
            // 上传失败
            showStatus(`上传失败: ${result.message || '未知错误'}`, 'error');
            uploadBtn.disabled = false;
        }
    } catch (error) {
        // 网络错误或其他异常
        console.error('上传错误:', error);
        showStatus(`上传失败: ${error.message}\n请确保后端服务正在运行`, 'error');
        uploadBtn.disabled = false;
    } finally {
        uploadBtn.textContent = '上传文件';
    }
});

// 显示状态信息
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusSection.className = `status-section ${type}`;
    statusSection.style.display = 'block';
}
