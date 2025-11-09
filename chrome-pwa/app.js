// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const statusMessage = document.getElementById('statusMessage');
const statusSection = document.getElementById('statusSection');
const textInput = document.getElementById('textInput');
const uploadTextBtn = document.getElementById('uploadTextBtn');
const dropZone = document.getElementById('dropZone');
const serverStatus = document.getElementById('serverStatus');

let selectedFile = null;
let deferredPrompt = null;

// 后端服务地址
const API_BASE_URL = '';  // 空字符串表示使用当前域名和端口

// ==================== PWA 安装功能 ====================

// 监听 PWA 安装提示
window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止自动弹出
    e.preventDefault();
    deferredPrompt = e;
    
    // 显示自定义安装提示
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'block';
});

// 安装按钮点击
document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`用户选择: ${outcome}`);
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }
});

// 稍后安装按钮
document.getElementById('dismissBtn')?.addEventListener('click', () => {
    document.getElementById('installPrompt').style.display = 'none';
});

// PWA 安装成功
window.addEventListener('appinstalled', () => {
    console.log('PWA 安装成功');
    showStatus('✅ 应用已成功安装到桌面!', 'success');
});

// ==================== Service Worker 注册 ====================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker 注册失败:', error);
            });
    });
}

// ==================== 服务器状态检测 ====================

async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/status`, {
            method: 'GET',
            mode: 'cors'
        });
        if (response.ok) {
            serverStatus.textContent = '✅ 在线';
            serverStatus.className = 'online';
            return true;
        }
    } catch (error) {
        serverStatus.textContent = '❌ 离线';
        serverStatus.className = 'offline';
        return false;
    }
}

// 页面加载时检测服务器状态
checkServerStatus();

// 每30秒检测一次服务器状态
setInterval(checkServerStatus, 30000);

// ==================== 文件拖拽功能 ====================

// 阻止默认拖拽行为
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 拖拽高亮效果
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
    }, false);
});

// 处理文件拖放
dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
}, false);

// ==================== 文件上传功能 ====================

// 监听文件选择
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

// 处理文件选择
function handleFileSelect(file) {
    selectedFile = file;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    fileName.textContent = `${file.name} (${sizeInMB} MB)`;
    uploadBtn.disabled = false;
    
    // 清空之前的状态信息
    statusMessage.textContent = '💡 文件已选择,点击上传按钮开始上传';
    statusSection.className = 'status-section';
}

// 监听上传按钮点击
uploadBtn.addEventListener('click', async function() {
    if (!selectedFile) {
        showStatus('⚠️ 请先选择文件', 'warning');
        return;
    }
    
    // 禁用按钮,防止重复点击
    uploadBtn.disabled = true;
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<span class="btn-icon loading">⏳</span><span>上传中...</span>';
    uploadBtn.classList.add('loading');
    
    try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // 发送POST请求
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            // 上传成功
            const sizeInMB = (result.filesize / (1024 * 1024)).toFixed(2);
            showStatus(
                `✅ 文件上传成功！

📁 文件名: ${result.filename}
📦 大小: ${sizeInMB} MB
💾 保存位置: uploads/${result.filename}

文件管理器已自动打开`,
                'success'
            );
            
            // 重置表单
            fileInput.value = '';
            selectedFile = null;
            fileName.textContent = '未选择文件';
        } else {
            // 上传失败
            showStatus(`❌ 上传失败: ${result.message || '未知错误'}`, 'error');
            uploadBtn.disabled = false;
        }
    } catch (error) {
        // 网络错误或其他异常
        console.error('上传错误:', error);
        showStatus(
            `❌ 上传失败: ${error.message}

请确保:
1. 后端服务正在运行 (localhost:19666)
2. 网络连接正常`,
            'error'
        );
        uploadBtn.disabled = false;
    } finally {
        uploadBtn.innerHTML = originalText;
        uploadBtn.classList.remove('loading');
    }
});

// ==================== 文本上传功能 ====================

// 监听文本上传按钮点击
uploadTextBtn.addEventListener('click', async function() {
    const textContent = textInput.value.trim();
    
    if (!textContent) {
        showStatus('⚠️ 请先输入文本内容', 'warning');
        return;
    }
    
    // 禁用按钮,防止重复点击
    uploadTextBtn.disabled = true;
    const originalText = uploadTextBtn.innerHTML;
    uploadTextBtn.innerHTML = '<span class="btn-icon loading">⏳</span><span>上传中...</span>';
    uploadTextBtn.classList.add('loading');
    
    try {
        // 将文本转为base64
        const base64Content = btoa(unescape(encodeURIComponent(textContent)));
        
        // 发送POST请求
        const response = await fetch(`${API_BASE_URL}/upload-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: base64Content
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            // 上传成功
            showStatus(
                `✅ 文本上传成功！

📝 字符数: ${result.char_count}
📋 已复制到剪贴板
💾 保存位置: uploads/copy_tmp.txt

可直接按 Ctrl+V 粘贴使用`,
                'success'
            );
            
            // 可选：清空文本框
            // textInput.value = '';
        } else {
            // 上传失败
            showStatus(`❌ 上传失败: ${result.message || '未知错误'}`, 'error');
        }
    } catch (error) {
        // 网络错误或其他异常
        console.error('上传错误:', error);
        showStatus(
            `❌ 上传失败: ${error.message}

请确保:
1. 后端服务正在运行 (localhost:19666)
2. 网络连接正常`,
            'error'
        );
    } finally {
        uploadTextBtn.disabled = false;
        uploadTextBtn.innerHTML = originalText;
        uploadTextBtn.classList.remove('loading');
    }
});

// ==================== 工具函数 ====================

// 显示状态信息
function showStatus(message, type = '') {
    statusMessage.textContent = message;
    statusSection.className = `status-section ${type}`;
    
    // 滚动到状态区域
    statusSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 在文本框中快速上传
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === textInput) {
        e.preventDefault();
        uploadTextBtn.click();
    }
});
