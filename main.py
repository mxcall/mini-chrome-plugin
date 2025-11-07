import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 配置上传文件夹
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 3 * 1024 * 1024 * 1024  # 3GB 限制


def get_unique_filename(original_filename):
    """
    生成唯一的文件名。如果文件已存在,添加时间戳。
    格式: 文件名_年月日时分秒.扩展名
    """
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
    
    if not os.path.exists(filepath):
        return original_filename
    
    # 分离文件名和扩展名
    name, ext = os.path.splitext(original_filename)
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    new_filename = f"{name}_{timestamp}{ext}"
    
    return new_filename


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    处理文件上传请求
    """
    try:
        # 检查是否有文件在请求中
        if 'file' not in request.files:
            return jsonify({
                'status': 'error',
                'message': '请求中没有文件字段'
            }), 400
        
        file = request.files['file']
        
        # 检查文件名是否为空
        if file.filename == '':
            return jsonify({
                'status': 'error',
                'message': '未选择文件'
            }), 400
        
        # 获取安全的文件名
        if not file.filename:
            return jsonify({
                'status': 'error',
                'message': '文件名为空'
            }), 400
        original_filename = secure_filename(file.filename)
        
        # 生成唯一文件名
        unique_filename = get_unique_filename(original_filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # 保存文件(流式处理,适合大文件)
        file.save(filepath)
        
        # 获取文件大小
        file_size = os.path.getsize(filepath)
        
        return jsonify({
            'status': 'success',
            'filename': unique_filename,
            'filesize': file_size
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'文件上传失败: {str(e)}'
        }), 500


@app.route('/', methods=['GET'])
def index():
    """首页提示信息"""
    return jsonify({
        'message': '文件上传服务正在运行',
        'upload_endpoint': '/upload',
        'method': 'POST'
    })


def main():
    print("文件上传服务启动中...")
    print("监听地址: localhost:19666")
    print(f"文件保存目录: {os.path.abspath(UPLOAD_FOLDER)}")
    print("按 Ctrl+C 停止服务")
    # 打包为exe时必须关闭debug模式
    app.run(host='localhost', port=19666, debug=False, use_reloader=False)


if __name__ == "__main__":
    main()
